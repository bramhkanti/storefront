import type { Money } from '@/lib/api/contracts/domain';

export interface ShippingAddress {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | undefined;
  city: string;
  state: string;
  postalCode: string;
  countryCode: string; // 'IN'
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId: string;
  title: string;
  variantTitle: string;
  sku: string;
  unitPrice: Money;
  totalPrice: Money;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  cartId: string;
  email?: string | undefined;
  phone: string;
  shippingAddress: ShippingAddress;
  billingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: Money;
  shippingTotal: Money;
  taxTotal: Money;
  total: Money;
  currencyCode: string;
  paymentMethod: string;
  paymentStatus: 'pending' | 'authorized' | 'paid' | 'failed' | 'refunded';
  fulfillmentStatus: 'unfulfilled' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderInput {
  cartId: string;
  email?: string | undefined;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
}

export interface AddressValidationResult {
  valid: boolean;
  errors?: Record<string, string> | undefined;
}

/**
 * Interface Segregation: Core checkout service contract.
 * Concrete implementations (Medusa Order Module, custom ERP) implement this.
 */
export interface CheckoutService {
  validateAddress(address: ShippingAddress): Promise<AddressValidationResult>;
  calculateShipping(cartId: string, postalCode: string): Promise<Money>;
  createOrderFromCart(input: CreateOrderInput): Promise<Order>;
  getOrderById(orderId: string): Promise<Order | null>;
}

export interface PaymentSession {
  sessionId: string;
  providerId: string;
  orderId: string;
  amount: Money;
  clientSecret?: string | undefined;
  redirectUrl?: string | undefined;
  metadata?: Record<string, unknown> | undefined;
}

export interface WebhookVerificationResult {
  valid: boolean;
  orderId?: string | undefined;
  status?: ('paid' | 'failed' | 'refunded') | undefined;
  rawEvent?: unknown | undefined;
}

/**
 * Open/Closed Principle: Pluggable payment gateway provider interface.
 * Extensible for Razorpay, Cashfree, PhonePe, or Stripe without modifying core checkout logic.
 */
export interface PaymentProvider {
  readonly id: string;
  readonly name: string;
  initiatePayment(order: Order): Promise<PaymentSession>;
  verifyWebhook(
    rawPayload: string,
    signature: string,
  ): Promise<WebhookVerificationResult>;
}

/**
 * Payment Provider Registry pattern for runtime provider lookup.
 */
export class PaymentProviderRegistry {
  private providers = new Map<string, PaymentProvider>();

  register(provider: PaymentProvider): void {
    this.providers.set(provider.id, provider);
  }

  get(providerId: string): PaymentProvider | undefined {
    return this.providers.get(providerId);
  }

  list(): PaymentProvider[] {
    return Array.from(this.providers.values());
  }
}
