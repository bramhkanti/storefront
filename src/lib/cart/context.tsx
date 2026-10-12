'use client';

import * as React from 'react';
import type { Cart } from '@/lib/api/contracts/domain';
import {
  addToCartAction,
  getCartAction,
  removeCartItemAction,
  updateCartItemAction,
} from './actions';

type OptimisticAction =
  | { type: 'set'; cart: Cart | null }
  | { type: 'update'; lineItemId: string; quantity: number }
  | { type: 'remove'; lineItemId: string };

function optimisticReducer(current: Cart | null, action: OptimisticAction): Cart | null {
  if (action.type === 'set') {
    return action.cart;
  }
  if (!current) return current;

  if (action.type === 'update') {
    const items = current.items.map((item) =>
      item.id === action.lineItemId
        ? {
            ...item,
            quantity: action.quantity,
            totalPrice: {
              amount: item.unitPrice.amount * action.quantity,
              currencyCode: item.unitPrice.currencyCode,
            },
          }
        : item,
    );
    const subtotalAmount = items.reduce((sum, i) => sum + i.totalPrice.amount, 0);
    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
    const shippingAmount = subtotalAmount === 0 ? 0 : subtotalAmount >= 49900 ? 0 : 7000;

    return {
      ...current,
      items,
      itemCount,
      subtotal: { amount: subtotalAmount, currencyCode: current.currencyCode },
      shippingEstimate: {
        amount: shippingAmount,
        currencyCode: current.currencyCode,
      },
      total: {
        amount: subtotalAmount + shippingAmount,
        currencyCode: current.currencyCode,
      },
    };
  }

  if (action.type === 'remove') {
    const items = current.items.filter((item) => item.id !== action.lineItemId);
    const subtotalAmount = items.reduce((sum, i) => sum + i.totalPrice.amount, 0);
    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
    const shippingAmount = subtotalAmount === 0 ? 0 : subtotalAmount >= 49900 ? 0 : 7000;

    return {
      ...current,
      items,
      itemCount,
      subtotal: { amount: subtotalAmount, currencyCode: current.currencyCode },
      shippingEstimate: {
        amount: shippingAmount,
        currencyCode: current.currencyCode,
      },
      total: {
        amount: subtotalAmount + shippingAmount,
        currencyCode: current.currencyCode,
      },
    };
  }

  return current;
}

export interface CartContextValue {
  cart: Cart | null;
  optimisticCart: Cart | null;
  isPending: boolean;
  addItem: (variantId: string, quantity?: number) => Promise<boolean>;
  updateItem: (lineItemId: string, quantity: number) => Promise<boolean>;
  removeItem: (lineItemId: string) => Promise<boolean>;
  refreshCart: () => Promise<void>;
}

const CartContext = React.createContext<CartContextValue | null>(null);

export interface CartProviderProps {
  children: React.ReactNode;
  initialCart?: Cart | null | undefined;
}

export function CartProvider({
  children,
  initialCart = null,
}: CartProviderProps): React.JSX.Element {
  const [cart, setCart] = React.useState<Cart | null>(initialCart);
  const [isPending, startTransition] = React.useTransition();

  const [optimisticCart, setOptimistic] = React.useOptimistic(cart, optimisticReducer);

  // Initialize cart from session cookie on mount if not provided
  React.useEffect(() => {
    if (!initialCart) {
      void getCartAction().then((fetched) => {
        if (fetched) setCart(fetched);
      });
    }
  }, [initialCart]);

  const refreshCart = React.useCallback(async () => {
    const fetched = await getCartAction();
    setCart(fetched);
  }, []);

  const addItem = React.useCallback(
    async (variantId: string, quantity: number = 1): Promise<boolean> => {
      let success = false;
      await new Promise<void>((resolve) => {
        startTransition(async () => {
          const res = await addToCartAction(variantId, quantity);
          if (res.success && res.cart) {
            setCart(res.cart);
            success = true;
          }
          resolve();
        });
      });
      return success;
    },
    [],
  );

  const updateItem = React.useCallback(
    async (lineItemId: string, quantity: number): Promise<boolean> => {
      let success = false;
      await new Promise<void>((resolve) => {
        startTransition(async () => {
          setOptimistic({ type: 'update', lineItemId, quantity });
          const res = await updateCartItemAction(lineItemId, quantity);
          if (res.success && res.cart) {
            setCart(res.cart);
            success = true;
          } else {
            await refreshCart();
          }
          resolve();
        });
      });
      return success;
    },
    [refreshCart, setOptimistic],
  );

  const removeItem = React.useCallback(
    async (lineItemId: string): Promise<boolean> => {
      let success = false;
      await new Promise<void>((resolve) => {
        startTransition(async () => {
          setOptimistic({ type: 'remove', lineItemId });
          const res = await removeCartItemAction(lineItemId);
          if (res.success && res.cart) {
            setCart(res.cart);
            success = true;
          } else {
            await refreshCart();
          }
          resolve();
        });
      });
      return success;
    },
    [refreshCart, setOptimistic],
  );

  const value = React.useMemo<CartContextValue>(
    () => ({
      cart,
      optimisticCart,
      isPending,
      addItem,
      updateItem,
      removeItem,
      refreshCart,
    }),
    [cart, optimisticCart, isPending, addItem, updateItem, removeItem, refreshCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
