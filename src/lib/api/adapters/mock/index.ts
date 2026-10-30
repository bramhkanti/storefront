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
} from '../../contracts/domain';
import type {
  CartService,
  CategoryReader,
  CheckoutService,
  CollectionReader,
  CustomerAuthService,
  ProductReader,
  RedirectReader,
  ReviewReader,
  ReviewService,
  SearchService,
} from '../../contracts/readers';
import { NotFoundError, UserFacingError } from '../../errors';
import {
  MOCK_CATEGORIES,
  MOCK_COLLECTIONS,
  MOCK_PRODUCTS,
  MOCK_REDIRECTS,
} from './fixtures';

/**
 * In-memory MockAdapter implementing all reader and cart interfaces.
 * Used for development, local runs, CI, and test suites.
 * Fully interchangeable with MedusaAdapter (Liskov Substitution Principle).
 */
export class MockAdapter
  implements
    ProductReader,
    CategoryReader,
    CollectionReader,
    RedirectReader,
    SearchService,
    CartService,
    CheckoutService,
    CustomerAuthService,
    ReviewReader,
    ReviewService
{
  private categories: Category[];
  private products: Product[];
  private collections: Collection[];
  private redirects: Redirect[];
  private carts: Map<string, Cart>;
  private orders = new Map<string, Order & { customerId?: string | undefined }>();
  private customers = new Map<string, Customer>();
  private pendingOtps = new Set<string>();
  /** Starts empty: the demo never shows made-up reviews. */
  private reviews: Array<
    ProductReview & { productId: string; customerId: string; approved: boolean }
  > = [];

  constructor(
    categories: Category[] = MOCK_CATEGORIES,
    products: Product[] = MOCK_PRODUCTS,
    collections: Collection[] = MOCK_COLLECTIONS,
    redirects: Redirect[] = MOCK_REDIRECTS,
  ) {
    this.categories = categories;
    this.products = products;
    this.collections = collections;
    this.redirects = redirects;
    this.carts = new Map<string, Cart>();
  }

  // --- CategoryReader ---

  async getCategoryByHandle(handle: string): Promise<Category | null> {
    const findInTree = (cats: Category[]): Category | null => {
      for (const cat of cats) {
        if (cat.handle === handle) return cat;
        if (cat.children) {
          const found = findInTree(cat.children);
          if (found) return found;
        }
      }
      return null;
    };
    return findInTree(this.categories);
  }

  async listCategories(): Promise<Category[]> {
    const flatten = (cats: Category[]): Category[] => {
      const result: Category[] = [];
      for (const cat of cats) {
        result.push(cat);
        if (cat.children) {
          result.push(...flatten(cat.children));
        }
      }
      return result;
    };
    return flatten(this.categories);
  }

  async getCategoryTree(): Promise<Category[]> {
    return this.categories;
  }

  async getAllCategoryHandles(): Promise<string[]> {
    const all = await this.listCategories();
    return all.map((c) => c.handle);
  }

  // --- ProductReader ---

  async getProductByHandle(handle: string): Promise<Product | null> {
    const product = this.products.find((p) => p.handle === handle);
    return product ?? null;
  }

  async listProducts(
    filter: ProductFilterParams = {},
  ): Promise<PaginatedResult<Product>> {
    const {
      categoryHandle,
      collectionHandle,
      tags,
      minPrice,
      maxPrice,
      inStockOnly,
      sort,
      page = 1,
      limit = 20,
    } = filter;

    let filtered = [...this.products];

    // Filter by category (including descendants)
    if (categoryHandle) {
      const category = await this.getCategoryByHandle(categoryHandle);
      if (category) {
        const categoryIds = new Set<string>([category.id]);
        if (category.children) {
          category.children.forEach((c) => categoryIds.add(c.id));
        }
        filtered = filtered.filter((p) =>
          p.categoryIds.some((id) => categoryIds.has(id)),
        );
      } else {
        filtered = [];
      }
    }

    // Filter by collection
    if (collectionHandle) {
      const col = this.collections.find((c) => c.handle === collectionHandle);
      if (col) {
        filtered = filtered.filter((p) => p.collectionIds.includes(col.id));
      } else {
        filtered = [];
      }
    }

    // Filter by tags
    if (tags && tags.length > 0) {
      filtered = filtered.filter((p) => tags.every((t) => p.tags.includes(t)));
    }

    // Filter by price (based on lowest variant price)
    if (minPrice !== undefined) {
      filtered = filtered.filter((p) =>
        p.variants.some((v) => v.price.amount >= minPrice),
      );
    }
    if (maxPrice !== undefined) {
      filtered = filtered.filter((p) =>
        p.variants.some((v) => v.price.amount <= maxPrice),
      );
    }

    // Filter by stock
    if (inStockOnly) {
      filtered = filtered.filter((p) => p.variants.some((v) => v.inStock));
    }

    // Sorting
    if (sort === 'price_asc') {
      filtered.sort((a, b) => {
        const aMin = Math.min(...a.variants.map((v) => v.price.amount));
        const bMin = Math.min(...b.variants.map((v) => v.price.amount));
        return aMin - bMin;
      });
    } else if (sort === 'price_desc') {
      filtered.sort((a, b) => {
        const aMax = Math.max(...a.variants.map((v) => v.price.amount));
        const bMax = Math.max(...b.variants.map((v) => v.price.amount));
        return bMax - aMax;
      });
    } else if (sort === 'newest') {
      filtered.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } else if (sort === 'featured') {
      filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const offset = (page - 1) * limit;
    const paginatedItems = filtered.slice(offset, offset + limit);

    return {
      items: paginatedItems,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async getFeaturedProducts(limit = 6): Promise<Product[]> {
    return this.products.filter((p) => p.featured).slice(0, limit);
  }

  async getTopProductsForStaticParams(limit = 20): Promise<Array<{ handle: string }>> {
    return this.products.slice(0, limit).map((p) => ({ handle: p.handle }));
  }

  async getProductsByCategory(categoryHandle: string, limit = 12): Promise<Product[]> {
    const result = await this.listProducts({ categoryHandle, limit });
    return result.items;
  }

  // --- CollectionReader ---

  async getCollectionByHandle(handle: string): Promise<Collection | null> {
    const col = this.collections.find((c) => c.handle === handle);
    return col ?? null;
  }

  async listCollections(): Promise<Collection[]> {
    return this.collections;
  }

  // --- RedirectReader ---

  async getRedirect(path: string): Promise<Redirect | null> {
    const r = this.redirects.find((item) => item.fromPath === path);
    return r ?? null;
  }

  async listAllRedirects(): Promise<Redirect[]> {
    return this.redirects;
  }

  // --- SearchService ---

  async searchProducts(query: string, limit = 10): Promise<Product[]> {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return this.products
      .filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      )
      .slice(0, limit);
  }

  // --- CartService ---

  async getCart(cartId: string): Promise<Cart | null> {
    const cart = this.carts.get(cartId);
    return cart ?? null;
  }

  async createCart(token?: string): Promise<Cart> {
    const id = `cart_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newCart: Cart = {
      id,
      items: [],
      itemCount: 0,
      subtotal: { amount: 0, currencyCode: 'INR' },
      shippingEstimate: { amount: 0, currencyCode: 'INR' },
      total: { amount: 0, currencyCode: 'INR' },
      currencyCode: 'INR',
      customerId: token ? this.customerIdFromToken(token) : undefined,
    };
    this.carts.set(id, newCart);
    return newCart;
  }

  async addItem(
    cartId: string,
    item: { variantId: string; quantity: number },
  ): Promise<Cart> {
    let cart = this.carts.get(cartId);
    if (!cart) {
      cart = await this.createCart();
    }

    // Locate product and variant
    let matchedProduct: Product | undefined;
    let matchedVariant = undefined;
    for (const p of this.products) {
      const v = p.variants.find((variant) => variant.id === item.variantId);
      if (v) {
        matchedProduct = p;
        matchedVariant = v;
        break;
      }
    }

    if (!matchedProduct || !matchedVariant) {
      throw new NotFoundError('ProductVariant', item.variantId);
    }

    const existingIndex = cart.items.findIndex(
      (line) => line.variantId === item.variantId,
    );

    if (existingIndex >= 0 && cart.items[existingIndex]) {
      const existing = cart.items[existingIndex];
      const newQuantity = existing.quantity + item.quantity;
      cart.items[existingIndex] = {
        ...existing,
        quantity: newQuantity,
        totalPrice: {
          amount: existing.unitPrice.amount * newQuantity,
          currencyCode: existing.unitPrice.currencyCode,
        },
      };
    } else {
      const lineItemId = `line_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      cart.items.push({
        id: lineItemId,
        productId: matchedProduct.id,
        variantId: matchedVariant.id,
        title: matchedProduct.title,
        variantTitle: matchedVariant.title,
        handle: matchedProduct.handle,
        thumbnailUrl: matchedProduct.images[0]?.url,
        unitPrice: matchedVariant.price,
        totalPrice: {
          amount: matchedVariant.price.amount * item.quantity,
          currencyCode: matchedVariant.price.currencyCode,
        },
        quantity: item.quantity,
      });
    }

    this.recalculateCart(cart);
    this.carts.set(cart.id, cart);
    return cart;
  }

  async updateItem(cartId: string, lineItemId: string, quantity: number): Promise<Cart> {
    const cart = this.carts.get(cartId);
    if (!cart) {
      throw new NotFoundError('Cart', cartId);
    }

    if (quantity <= 0) {
      return this.removeItem(cartId, lineItemId);
    }

    const item = cart.items.find((line) => line.id === lineItemId);
    if (!item) {
      throw new NotFoundError('CartItem', lineItemId);
    }

    item.quantity = quantity;
    item.totalPrice = {
      amount: item.unitPrice.amount * quantity,
      currencyCode: item.unitPrice.currencyCode,
    };

    this.recalculateCart(cart);
    this.carts.set(cart.id, cart);
    return cart;
  }

  async removeItem(cartId: string, lineItemId: string): Promise<Cart> {
    const cart = this.carts.get(cartId);
    if (!cart) {
      throw new NotFoundError('Cart', cartId);
    }

    cart.items = cart.items.filter((line) => line.id !== lineItemId);
    this.recalculateCart(cart);
    this.carts.set(cart.id, cart);
    return cart;
  }

  private recalculateCart(cart: Cart): void {
    const subtotalAmount = cart.items.reduce(
      (sum, item) => sum + item.totalPrice.amount,
      0,
    );
    const option = MOCK_SHIPPING_OPTIONS.find((o) => o.id === cart.shippingOptionId);
    const shippingAmount = option ? option.amount.amount : 0;
    const discountAmount = cart.promoCodes?.includes('DEMO10')
      ? Math.round(subtotalAmount * 0.1)
      : 0;

    cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.subtotal = { amount: subtotalAmount, currencyCode: cart.currencyCode };
    cart.shippingEstimate = option
      ? { amount: shippingAmount, currencyCode: cart.currencyCode }
      : undefined;
    cart.discountTotal = { amount: discountAmount, currencyCode: cart.currencyCode };
    cart.total = {
      amount: subtotalAmount + shippingAmount - discountAmount,
      currencyCode: cart.currencyCode,
    };
  }

  private requireCart(cartId: string): Cart {
    const cart = this.carts.get(cartId);
    if (!cart) throw new NotFoundError('Cart', cartId);
    return cart;
  }

  async transferCart(cartId: string, token: string): Promise<Cart> {
    const cart = this.requireCart(cartId);
    cart.customerId = this.customerIdFromToken(token);
    return cart;
  }

  async applyPromoCode(cartId: string, code: string): Promise<Cart> {
    const cart = this.requireCart(cartId);
    if (code.toUpperCase() !== 'DEMO10') {
      throw new UserFacingError(`"${code}" isn't a valid code for this order`);
    }
    cart.promoCodes = ['DEMO10'];
    this.recalculateCart(cart);
    return cart;
  }

  async removePromoCode(cartId: string): Promise<Cart> {
    const cart = this.requireCart(cartId);
    cart.promoCodes = [];
    this.recalculateCart(cart);
    return cart;
  }

  // --- CheckoutService (demo data, no real payments) ---

  async updateCheckoutDetails(
    cartId: string,
    input: { email?: string | undefined; shippingAddress: Address },
  ): Promise<Cart> {
    const cart = this.requireCart(cartId);
    cart.email = input.email;
    cart.shippingAddress = input.shippingAddress;
    return cart;
  }

  async listShippingOptions(): Promise<ShippingOption[]> {
    return MOCK_SHIPPING_OPTIONS;
  }

  async setShippingOption(cartId: string, optionId: string): Promise<Cart> {
    const cart = this.requireCart(cartId);
    if (!MOCK_SHIPPING_OPTIONS.some((o) => o.id === optionId)) {
      throw new NotFoundError('ShippingOption', optionId);
    }
    cart.shippingOptionId = optionId;
    this.recalculateCart(cart);
    return cart;
  }

  async listPaymentMethods(): Promise<PaymentMethod[]> {
    return [{ providerId: 'pp_system_default', kind: 'cod', label: 'Cash on delivery' }];
  }

  async initPaymentSession(_cartId: string, providerId: string): Promise<PaymentSession> {
    return { providerId, data: {} };
  }

  async completeCart(cartId: string): Promise<CompleteCartResult> {
    const cart = this.requireCart(cartId);
    if (!cart.items.length) return { type: 'cart', error: 'Your bag is empty' };
    if (!cart.shippingAddress) return { type: 'cart', error: 'Add a delivery address' };
    if (!cart.shippingOptionId)
      return { type: 'cart', error: 'Choose a delivery option' };

    const order: Order & { customerId?: string | undefined } = {
      id: `order_mock_${Date.now()}`,
      displayId: 1000 + this.orders.size + 1,
      createdAt: new Date().toISOString(),
      status: 'pending',
      paymentStatus: 'awaiting',
      fulfillmentStatus: 'not_fulfilled',
      email: cart.email,
      items: cart.items.map((item) => ({ ...item, total: item.totalPrice })),
      itemCount: cart.itemCount,
      shippingAddress: cart.shippingAddress,
      shippingMethodName: MOCK_SHIPPING_OPTIONS.find(
        (o) => o.id === cart.shippingOptionId,
      )?.name,
      paymentProviderId: 'pp_system_default',
      subtotal: cart.subtotal,
      shippingTotal: cart.shippingEstimate ?? {
        amount: 0,
        currencyCode: cart.currencyCode,
      },
      discountTotal: cart.discountTotal ?? { amount: 0, currencyCode: cart.currencyCode },
      taxTotal: { amount: 0, currencyCode: cart.currencyCode },
      total: cart.total,
      currencyCode: cart.currencyCode,
      customerId: cart.customerId,
    };
    this.orders.set(order.id, order);
    this.carts.delete(cartId);
    return { type: 'order', order };
  }

  async getOrder(orderId: string): Promise<Order | null> {
    return this.orders.get(orderId) ?? null;
  }

  // --- CustomerAuthService (demo OTP is always 123456) ---

  private customerIdFromToken(token: string): string | undefined {
    return token.startsWith('mock_customer:')
      ? token.slice('mock_customer:'.length)
      : undefined;
  }

  private findCustomerByPhone(phone: string): Customer | undefined {
    return [...this.customers.values()].find((c) => c.phone === phone);
  }

  private requireCustomer(token: string): Customer {
    const customer = this.customers.get(this.customerIdFromToken(token) ?? '');
    if (!customer) throw new UserFacingError('Please log in again', 401);
    return customer;
  }

  async requestOtp(phone: string): Promise<void> {
    this.pendingOtps.add(phone);
  }

  async verifyOtp(phone: string, otp: string): Promise<OtpVerifyResult> {
    if (!this.pendingOtps.has(phone) || otp !== MOCK_OTP_CODE) {
      throw new UserFacingError('Incorrect or expired OTP', 401);
    }
    this.pendingOtps.delete(phone);
    const existing = this.findCustomerByPhone(phone);
    return existing
      ? { token: `mock_customer:${existing.id}`, needsRegistration: false }
      : { token: `mock_registration:${phone}`, needsRegistration: true };
  }

  async registerCustomer(
    registrationToken: string,
    profile: { firstName?: string | undefined; lastName?: string | undefined },
  ): Promise<string> {
    const phone = registrationToken.replace('mock_registration:', '');
    const customer: Customer = {
      id: `cus_mock_${Date.now()}`,
      firstName: profile.firstName ?? '',
      lastName: profile.lastName ?? '',
      phone,
      addresses: [],
    };
    this.customers.set(customer.id, customer);
    return `mock_customer:${customer.id}`;
  }

  async getCustomer(token: string): Promise<Customer | null> {
    return this.customers.get(this.customerIdFromToken(token) ?? '') ?? null;
  }

  async updateCustomer(
    token: string,
    input: { firstName: string; lastName: string; email?: string | undefined },
  ): Promise<Customer> {
    const customer = this.requireCustomer(token);
    Object.assign(customer, input);
    return customer;
  }

  async addAddress(token: string, address: Address): Promise<Customer> {
    const customer = this.requireCustomer(token);
    const added = { ...address, id: `addr_mock_${Date.now()}` };
    if (added.isDefault || customer.addresses.length === 0) {
      customer.addresses.forEach((a) => (a.isDefault = false));
      added.isDefault = true;
    }
    customer.addresses.push(added);
    return customer;
  }

  async updateAddress(
    token: string,
    addressId: string,
    address: Address,
  ): Promise<Customer> {
    const customer = this.requireCustomer(token);
    if (address.isDefault) customer.addresses.forEach((a) => (a.isDefault = false));
    customer.addresses = customer.addresses.map((a) =>
      a.id === addressId ? { ...address, id: addressId } : a,
    );
    return customer;
  }

  async deleteAddress(token: string, addressId: string): Promise<Customer> {
    const customer = this.requireCustomer(token);
    customer.addresses = customer.addresses.filter((a) => a.id !== addressId);
    return customer;
  }

  async listOrders(token: string, page = 1, limit = 10): Promise<PaginatedResult<Order>> {
    const customerId = this.customerIdFromToken(token);
    const all = [...this.orders.values()]
      .filter((o) => o.customerId === customerId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return {
      items: all.slice((page - 1) * limit, page * limit),
      total: all.length,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(all.length / limit)),
    };
  }

  async getCustomerOrder(token: string, orderId: string): Promise<Order | null> {
    const order = this.orders.get(orderId);
    return order && order.customerId === this.customerIdFromToken(token) ? order : null;
  }

  // --- ReviewReader / ReviewService ---

  private approvedReviews(productId?: string) {
    return this.reviews
      .filter((r) => r.approved && (!productId || r.productId === productId))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async listProductReviews(
    productId: string,
    options: { limit?: number | undefined; offset?: number | undefined } = {},
  ): Promise<ProductReviewPage> {
    const { limit = 10, offset = 0 } = options;
    const approved = this.approvedReviews(productId);
    const summary = (await this.getRatingSummaries([productId]))[productId]!;
    return {
      reviews: approved.slice(offset, offset + limit),
      total: approved.length,
      summary,
    };
  }

  async getRatingSummaries(productIds: string[]): Promise<Record<string, RatingSummary>> {
    const result: Record<string, RatingSummary> = {};
    for (const id of productIds) {
      const approved = this.approvedReviews(id);
      const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      for (const review of approved) {
        distribution[review.rating as 1 | 2 | 3 | 4 | 5] += 1;
      }
      const total = approved.reduce((sum, review) => sum + review.rating, 0);
      result[id] = {
        average: approved.length ? Math.round((total / approved.length) * 10) / 10 : 0,
        count: approved.length,
        distribution,
      };
    }
    return result;
  }

  async listLatestReviews(limit = 6, minRating = 1): Promise<ProductReview[]> {
    return this.approvedReviews()
      .filter((review) => review.rating >= minRating)
      .slice(0, limit);
  }

  async submitReview(
    token: string,
    input: ReviewInput,
  ): Promise<{ status: 'pending'; verifiedPurchase: boolean }> {
    const customerId = this.customerIdFromToken(token);
    if (!customerId) throw new UserFacingError('Please log in to write a review', 401);
    if (!this.products.some((p) => p.id === input.productId)) {
      throw new NotFoundError('Product', input.productId);
    }
    if (
      this.reviews.some(
        (r) => r.productId === input.productId && r.customerId === customerId,
      )
    ) {
      throw new UserFacingError('You have already reviewed this product', 422);
    }
    this.reviews.push({
      id: `rev_mock_${this.reviews.length + 1}`,
      productId: input.productId,
      customerId,
      authorName: 'Demo customer',
      rating: input.rating,
      title: input.title,
      body: input.body,
      verifiedPurchase: false,
      createdAt: new Date().toISOString(),
      approved: false,
    });
    return { status: 'pending', verifiedPurchase: false };
  }
}

/** Demo-only values used when API_ADAPTER=mock. */
const MOCK_OTP_CODE = '123456';
const MOCK_SHIPPING_OPTIONS: ShippingOption[] = [
  {
    id: 'so_mock_standard',
    name: 'Standard delivery (demo)',
    amount: { amount: 7000, currencyCode: 'INR' },
  },
  {
    id: 'so_mock_express',
    name: 'Express delivery (demo)',
    amount: { amount: 14900, currencyCode: 'INR' },
  },
];
