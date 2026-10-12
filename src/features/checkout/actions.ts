'use server';

import { redirect } from 'next/navigation';
import { clearCartAction, getCartAction } from '@/lib/cart/actions';

export interface PlaceOrderState {
  error?: string | undefined;
  fieldErrors?: Record<string, string> | undefined;
}

export async function placeOrderAction(
  _prevState: PlaceOrderState,
  formData: FormData,
): Promise<PlaceOrderState> {
  const fullName = String(formData.get('fullName') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();
  const postalCode = String(formData.get('postalCode') ?? '').trim();
  const addressLine1 = String(formData.get('addressLine1') ?? '').trim();
  const city = String(formData.get('city') ?? '').trim();
  const state = String(formData.get('state') ?? '').trim();
  const paymentMethod = String(formData.get('paymentMethod') ?? 'cod').trim();

  const fieldErrors: Record<string, string> = {};

  if (!fullName || fullName.length < 2) {
    fieldErrors.fullName = 'Please enter your full name.';
  }

  // Validate 10-digit Indian phone number (with optional +91 or 0 prefix)
  const cleanPhone = phone.replace(/[\s\-()]/g, '');
  if (!cleanPhone || !/^(?:\+91|0)?[6-9]\d{9}$/.test(cleanPhone)) {
    fieldErrors.phone = 'Please enter a valid 10-digit Indian mobile number.';
  }

  // Validate 6-digit Indian PIN code
  if (!postalCode || !/^[1-9][0-9]{5}$/.test(postalCode)) {
    fieldErrors.postalCode = 'Please enter a valid 6-digit Indian PIN code.';
  }

  if (!addressLine1 || addressLine1.length < 5) {
    fieldErrors.addressLine1 = 'Please enter your complete street address.';
  }

  if (!city || city.length < 2) {
    fieldErrors.city = 'Please enter your city/district.';
  }

  if (!state || state.length < 2) {
    fieldErrors.state = 'Please enter your state.';
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      error: 'Please fix the highlighted errors before placing your order.',
      fieldErrors,
    };
  }

  const cart = await getCartAction();
  if (!cart || cart.items.length === 0) {
    return {
      error: 'Your shopping bag is empty. Please add items before placing an order.',
    };
  }

  const orderNumber = `BK-2026-${Math.floor(10000 + Math.random() * 90000)}`;
  const totalAmount = cart.total.amount;
  const itemCount = cart.itemCount;

  // Clear cart cookie and session
  await clearCartAction();

  // Redirect to order confirmation page
  const searchParams = new URLSearchParams({
    orderNumber,
    name: fullName,
    phone: cleanPhone,
    city,
    state,
    pin: postalCode,
    method: paymentMethod,
    total: String(totalAmount),
    count: String(itemCount),
  });

  redirect(`/order-confirmed?${searchParams.toString()}`);
}
