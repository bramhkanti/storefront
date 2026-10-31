import type {
  Address,
  Cart,
  Category,
  Collection,
  CompleteCartResult,
  Customer,
  Order,
  OtpVerifyResult,
  PaginatedResult,
  PaymentMethod,
  PaymentSession,
  Product,
  ProductFilterParams,
  ProductReview,
  ProductReviewPage,
  RatingSummary,
  Redirect,
  ReviewInput,
  ShippingOption,
} from './domain';

/**
 * Interface Segregation Principle: Small, focused reader and service interfaces.
 * Feature layers and components depend strictly on these interfaces.
 */

export interface ProductReader {
  getProductByHandle(handle: string): Promise<Product | null>;
  listProducts(filter?: ProductFilterParams): Promise<PaginatedResult<Product>>;
  getFeaturedProducts(limit?: number): Promise<Product[]>;
  getTopProductsForStaticParams(limit?: number): Promise<Array<{ handle: string }>>;
  getProductsByCategory(categoryHandle: string, limit?: number): Promise<Product[]>;
}

export interface CategoryReader {
  getCategoryByHandle(handle: string): Promise<Category | null>;
  listCategories(): Promise<Category[]>;
  getCategoryTree(): Promise<Category[]>;
  getAllCategoryHandles(): Promise<string[]>;
}

export interface CollectionReader {
  getCollectionByHandle(handle: string): Promise<Collection | null>;
  listCollections(): Promise<Collection[]>;
}

export interface RedirectReader {
  getRedirect(path: string): Promise<Redirect | null>;
  listAllRedirects(): Promise<Redirect[]>;
}

/** Approved customer reviews. */
export interface ReviewReader {
  listProductReviews(
    productId: string,
    options?: { limit?: number | undefined; offset?: number | undefined },
  ): Promise<ProductReviewPage>;
  getRatingSummaries(productIds: string[]): Promise<Record<string, RatingSummary>>;
  /** Newest approved reviews across the catalog, e.g. for the home page. */
  listLatestReviews(limit?: number, minRating?: number): Promise<ProductReview[]>;
}

export interface ReviewService {
  /** New reviews wait for moderation before they are shown. */
  submitReview(
    token: string,
    input: ReviewInput,
  ): Promise<{ status: 'pending' | 'approved' | 'rejected'; verifiedPurchase: boolean }>;
}

export interface SearchService {
  searchProducts(query: string, limit?: number): Promise<Product[]>;
}

/**
 * `token` arguments are the logged-in customer's bearer token (optional for
 * guests). Implementations must never cache it between calls.
 */
export interface CartService {
  getCart(cartId: string): Promise<Cart | null>;
  createCart(token?: string): Promise<Cart>;
  addItem(cartId: string, item: { variantId: string; quantity: number }): Promise<Cart>;
  updateItem(cartId: string, lineItemId: string, quantity: number): Promise<Cart>;
  removeItem(cartId: string, lineItemId: string): Promise<Cart>;
  /** Attach a guest cart to the logged-in customer. */
  transferCart(cartId: string, token: string): Promise<Cart>;
  applyPromoCode(cartId: string, code: string): Promise<Cart>;
  removePromoCode(cartId: string, code: string): Promise<Cart>;
}

export interface CheckoutService {
  updateCheckoutDetails(
    cartId: string,
    input: { email?: string | undefined; shippingAddress: Address },
  ): Promise<Cart>;
  listShippingOptions(cartId: string): Promise<ShippingOption[]>;
  setShippingOption(cartId: string, optionId: string): Promise<Cart>;
  listPaymentMethods(cartId: string): Promise<PaymentMethod[]>;
  initPaymentSession(cartId: string, providerId: string): Promise<PaymentSession>;
  /** The backend verifies payment; a `cart` result means it isn't confirmed yet. */
  completeCart(cartId: string): Promise<CompleteCartResult>;
  /** Public lookup by id (used by the confirmation page). */
  getOrder(orderId: string): Promise<Order | null>;
}

export interface CustomerAuthService {
  requestOtp(phone: string): Promise<void>;
  verifyOtp(phone: string, otp: string): Promise<OtpVerifyResult>;
  /** Creates the customer for a registration token; returns a customer token. */
  registerCustomer(
    registrationToken: string,
    profile: { firstName?: string | undefined; lastName?: string | undefined },
  ): Promise<string>;
  getCustomer(token: string): Promise<Customer | null>;
  updateCustomer(
    token: string,
    input: { firstName: string; lastName: string; email?: string | undefined },
  ): Promise<Customer>;
  addAddress(token: string, address: Address): Promise<Customer>;
  updateAddress(token: string, addressId: string, address: Address): Promise<Customer>;
  deleteAddress(token: string, addressId: string): Promise<Customer>;
  listOrders(
    token: string,
    page?: number,
    limit?: number,
  ): Promise<PaginatedResult<Order>>;
  getCustomerOrder(token: string, orderId: string): Promise<Order | null>;
}
