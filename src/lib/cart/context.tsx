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

/** Recomputes item-derived totals; shipping/discount stay as the server last sent. */
function withItems(current: Cart, items: Cart['items']): Cart {
  const subtotalAmount = items.reduce((sum, i) => sum + i.totalPrice.amount, 0);
  const delta = subtotalAmount - current.subtotal.amount;
  return {
    ...current,
    items,
    itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
    subtotal: { amount: subtotalAmount, currencyCode: current.currencyCode },
    total: {
      amount: Math.max(0, current.total.amount + delta),
      currencyCode: current.currencyCode,
    },
  };
}

function optimisticReducer(current: Cart | null, action: OptimisticAction): Cart | null {
  if (action.type === 'set') {
    return action.cart;
  }
  if (!current) return current;

  if (action.type === 'update') {
    return withItems(
      current,
      current.items.map((item) =>
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
      ),
    );
  }

  if (action.type === 'remove') {
    return withItems(
      current,
      current.items.filter((item) => item.id !== action.lineItemId),
    );
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
  /** Replace the cart with a fresh server copy (e.g. after a promo code). */
  setCart: (cart: Cart | null) => void;
  /** Last add-to-cart error message, for toasts. */
  lastError: string | null;
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
  const [lastError, setLastError] = React.useState<string | null>(null);

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
            setLastError(null);
            success = true;
          } else {
            setLastError(res.error ?? null);
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
      setCart,
      lastError,
    }),
    [
      cart,
      optimisticCart,
      isPending,
      addItem,
      updateItem,
      removeItem,
      refreshCart,
      lastError,
    ],
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
