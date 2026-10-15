import type Medusa from '@medusajs/js-sdk';
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
  Redirect,
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
  SearchService,
} from '../../contracts/readers';
import { UpstreamError, UserFacingError } from '../../errors';
import {
  bearer,
  createMedusaClient,
  toAppError,
  type MedusaClientConfig,
} from './client';
import {
  medusaCartDtoSchema,
  medusaCategoryDtoSchema,
  medusaCollectionDtoSchema,
  medusaCustomerDtoSchema,
  medusaOrderDtoSchema,
  medusaProductDtoSchema,
  medusaShippingOptionDtoSchema,
} from './dto';
import {
  mapAddressToMedusa,
  mapCustomerAddressToMedusa,
  mapMedusaCartToDomain,
  mapMedusaCategoryToDomain,
  mapMedusaCollectionToDomain,
  mapMedusaCustomerToDomain,
  mapMedusaOrderToDomain,
  mapMedusaProductToDomain,
  mapMedusaShippingOptionToDomain,
} from './mappers';

const PRODUCT_FIELDS =
  '*variants.calculated_price,+variants.inventory_quantity,+variants.manage_inventory,+variants.allow_backorder,+variants.metadata,*categories,*images,*tags,+metadata,+subtitle';
const CART_FIELDS =
  '*items,+items.product_handle,+items.product_title,*shipping_address,*shipping_methods,*promotions,*payment_collection,*payment_collection.payment_sessions,+item_total,+discount_total,+tax_total,+shipping_total,+total';
const ORDER_FIELDS =
  '*items,+items.product_handle,+items.product_title,*shipping_address,*shipping_methods,*payment_collections,*payment_collections.payments,+payment_status,+fulfillment_status,+item_total,+discount_total,+tax_total,+shipping_total,+total';

/** Labels shown at checkout per Medusa payment provider id. */
function describePaymentProvider(providerId: string): PaymentMethod {
  if (providerId.startsWith('pp_razorpay')) {
    return { providerId, kind: 'razorpay', label: 'Pay online (UPI, cards, netbanking)' };
  }
  if (providerId === 'pp_system_default') {
    return { providerId, kind: 'cod', label: 'Cash on delivery' };
  }
  return { providerId, kind: 'other', label: providerId.replace(/^pp_/, '') };
}

function decodeJwtPayload(token: string): Record<string, unknown> {
  try {
    const part = token.split('.')[1] ?? '';
    return JSON.parse(Buffer.from(part, 'base64url').toString('utf8')) as Record<
      string,
      unknown
    >;
  } catch {
    return {};
  }
}

/**
 * Concrete MedusaAdapter connecting to Medusa.js v2 backend.
 * Encapsulates the Medusa SDK client, validates upstream responses, and maps to domain shapes.
 */
export class MedusaAdapter
  implements
    ProductReader,
    CategoryReader,
    CollectionReader,
    RedirectReader,
    SearchService,
    CartService,
    CheckoutService,
    CustomerAuthService
{
  private client: Medusa;
  private regionIdPromise: Promise<string> | null = null;

  constructor(private readonly config: MedusaClientConfig) {
    this.client = createMedusaClient(config);
  }

  /** The store sells in one region (India / INR). */
  private regionId(): Promise<string> {
    if (this.config.regionId?.startsWith('reg_')) {
      return Promise.resolve(this.config.regionId);
    }
    this.regionIdPromise ??= this.client.store.region
      .list({ limit: 20 })
      .then(({ regions }) => {
        const region =
          regions.find((r: { currency_code?: string }) => r.currency_code === 'inr') ??
          regions[0];
        if (!region) throw new UpstreamError('No region is configured in Medusa');
        return region.id;
      })
      .catch((error: unknown) => {
        this.regionIdPromise = null;
        throw toAppError(error, 'Failed to load store region');
      });
    return this.regionIdPromise;
  }

  private parseProducts(raw: unknown[] | undefined): Product[] {
    const items: Product[] = [];
    for (const entry of raw ?? []) {
      const parsed = medusaProductDtoSchema.safeParse(entry);
      if (parsed.success) items.push(mapMedusaProductToDomain(parsed.data));
    }
    return items;
  }

  private parseCart(raw: unknown): Cart {
    const parsed = medusaCartDtoSchema.safeParse(raw);
    if (!parsed.success) {
      throw new UpstreamError('Invalid cart payload from Medusa', 502, parsed.error);
    }
    return mapMedusaCartToDomain(parsed.data);
  }

  private parseOrder(raw: unknown): Order {
    const parsed = medusaOrderDtoSchema.safeParse(raw);
    if (!parsed.success) {
      throw new UpstreamError('Invalid order payload from Medusa', 502, parsed.error);
    }
    return mapMedusaOrderToDomain(parsed.data);
  }

  private parseCustomer(raw: unknown): Customer {
    const parsed = medusaCustomerDtoSchema.safeParse(raw);
    if (!parsed.success) {
      throw new UpstreamError('Invalid customer payload from Medusa', 502, parsed.error);
    }
    return mapMedusaCustomerToDomain(parsed.data);
  }

  // --- CategoryReader ---

  async getCategoryByHandle(handle: string): Promise<Category | null> {
    try {
      const { product_categories } = await this.client.store.category.list({
        handle,
        fields: '+metadata,*category_children',
      });
      const parsed = medusaCategoryDtoSchema.safeParse(product_categories?.[0]);
      return parsed.success ? mapMedusaCategoryToDomain(parsed.data) : null;
    } catch (error: unknown) {
      throw toAppError(error, `Failed to fetch category ${handle}`);
    }
  }

  async listCategories(): Promise<Category[]> {
    try {
      const { product_categories } = await this.client.store.category.list({
        fields: '+metadata',
        limit: 100,
      });
      const categories: Category[] = [];
      for (const raw of product_categories ?? []) {
        const parsed = medusaCategoryDtoSchema.safeParse(raw);
        if (parsed.success) categories.push(mapMedusaCategoryToDomain(parsed.data));
      }
      return categories;
    } catch (error: unknown) {
      throw toAppError(error, 'Failed to list categories');
    }
  }

  async getCategoryTree(): Promise<Category[]> {
    try {
      const { product_categories } = await this.client.store.category.list({
        parent_category_id: 'null',
        include_descendants_tree: true,
        fields: '+metadata,*category_children',
        limit: 100,
      });
      const tree: Category[] = [];
      for (const raw of product_categories ?? []) {
        const parsed = medusaCategoryDtoSchema.safeParse(raw);
        if (parsed.success) tree.push(mapMedusaCategoryToDomain(parsed.data));
      }
      return tree;
    } catch (error: unknown) {
      throw toAppError(error, 'Failed to fetch category tree');
    }
  }

  async getAllCategoryHandles(): Promise<string[]> {
    const categories = await this.listCategories();
    return categories.map((c) => c.handle);
  }

  // --- ProductReader ---

  async getProductByHandle(handle: string): Promise<Product | null> {
    try {
      const { products } = await this.client.store.product.list({
        handle,
        region_id: await this.regionId(),
        fields: PRODUCT_FIELDS,
      });
      return this.parseProducts(products)[0] ?? null;
    } catch (error: unknown) {
      throw toAppError(error, `Failed to fetch product ${handle}`);
    }
  }

  async listProducts(
    filter: ProductFilterParams = {},
  ): Promise<PaginatedResult<Product>> {
    const { categoryHandle, collectionHandle, sort, page = 1, limit = 20 } = filter;
    // Medusa can't order by calculated price, so price sorts and price/stock
    // filters run over the whole (small) catalog in memory.
    const inMemory =
      sort === 'price_asc' ||
      sort === 'price_desc' ||
      sort === 'featured' ||
      filter.minPrice !== undefined ||
      filter.maxPrice !== undefined ||
      Boolean(filter.inStockOnly);

    const query: Record<string, unknown> = {
      region_id: await this.regionId(),
      fields: PRODUCT_FIELDS,
      limit: inMemory ? 200 : limit,
      offset: inMemory ? 0 : (page - 1) * limit,
      order: sort === 'newest' ? '-created_at' : 'created_at',
    };

    if (categoryHandle) {
      const category = await this.getCategoryByHandle(categoryHandle);
      if (!category) return { items: [], total: 0, page, limit, totalPages: 1 };
      query.category_id = [category.id, ...(category.children ?? []).map((c) => c.id)];
    }
    if (collectionHandle) {
      const collection = await this.getCollectionByHandle(collectionHandle);
      if (!collection) return { items: [], total: 0, page, limit, totalPages: 1 };
      query.collection_id = [collection.id];
    }
    if (filter.tags?.length) {
      query.tags = { value: filter.tags };
    }

    try {
      const response = await this.client.store.product.list(query);
      let items = this.parseProducts(response.products);

      if (!inMemory) {
        const total = response.count ?? items.length;
        return {
          items,
          total,
          page,
          limit,
          totalPages: Math.max(1, Math.ceil(total / limit)),
        };
      }

      const priceOf = (p: Product) => p.variants[0]?.price.amount ?? 0;
      if (filter.minPrice !== undefined) {
        items = items.filter((p) => priceOf(p) >= filter.minPrice! * 100);
      }
      if (filter.maxPrice !== undefined) {
        items = items.filter((p) => priceOf(p) <= filter.maxPrice! * 100);
      }
      if (filter.inStockOnly) {
        items = items.filter((p) => p.variants.some((v) => v.inStock));
      }
      if (sort === 'price_asc') items.sort((a, b) => priceOf(a) - priceOf(b));
      if (sort === 'price_desc') items.sort((a, b) => priceOf(b) - priceOf(a));
      if (sort === 'featured') {
        // Buyable first, then products flagged `featured` in metadata.
        const score = (p: Product) =>
          (p.variants.some((v) => v.inStock) ? 2 : 0) + (p.featured ? 1 : 0);
        items.sort((a, b) => score(b) - score(a));
      }

      const total = items.length;
      return {
        items: items.slice((page - 1) * limit, page * limit),
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      };
    } catch (error: unknown) {
      throw toAppError(error, 'Failed to list products');
    }
  }

  async getFeaturedProducts(limit = 6): Promise<Product[]> {
    const result = await this.listProducts({ limit, sort: 'featured' });
    return result.items;
  }

  async getTopProductsForStaticParams(limit = 20): Promise<Array<{ handle: string }>> {
    const result = await this.listProducts({ limit });
    return result.items.map((p) => ({ handle: p.handle }));
  }

  async getProductsByCategory(categoryHandle: string, limit = 12): Promise<Product[]> {
    const result = await this.listProducts({ categoryHandle, limit });
    return result.items;
  }

  // --- CollectionReader ---

  async getCollectionByHandle(handle: string): Promise<Collection | null> {
    try {
      const { collections } = await this.client.store.collection.list({
        handle,
        fields: '+metadata',
      });
      const parsed = medusaCollectionDtoSchema.safeParse(collections?.[0]);
      return parsed.success ? mapMedusaCollectionToDomain(parsed.data) : null;
    } catch (error: unknown) {
      throw toAppError(error, `Failed to fetch collection ${handle}`);
    }
  }

  async listCollections(): Promise<Collection[]> {
    try {
      const { collections } = await this.client.store.collection.list({
        fields: '+metadata',
        limit: 50,
      });
      const items: Collection[] = [];
      for (const raw of collections ?? []) {
        const parsed = medusaCollectionDtoSchema.safeParse(raw);
        if (parsed.success) items.push(mapMedusaCollectionToDomain(parsed.data));
      }
      return items;
    } catch (error: unknown) {
      throw toAppError(error, 'Failed to list collections');
    }
  }

  // --- RedirectReader ---

  async getRedirect(path: string): Promise<Redirect | null> {
    void path;
    // Redirects are not stored in Medusa yet.
    return null;
  }

  async listAllRedirects(): Promise<Redirect[]> {
    return [];
  }

  // --- SearchService ---

  async searchProducts(query: string, limit = 10): Promise<Product[]> {
    try {
      const { products } = await this.client.store.product.list({
        q: query,
        limit,
        region_id: await this.regionId(),
        fields: PRODUCT_FIELDS,
      });
      return this.parseProducts(products);
    } catch (error: unknown) {
      throw toAppError(error, `Failed to search products for "${query}"`);
    }
  }

  // --- CartService ---

  async getCart(cartId: string): Promise<Cart | null> {
    try {
      const { cart } = await this.client.store.cart.retrieve(cartId, {
        fields: CART_FIELDS,
      });
      // A completed cart has become an order and can't be modified.
      if ((cart as { completed_at?: unknown }).completed_at) return null;
      return this.parseCart(cart);
    } catch {
      return null;
    }
  }

  async createCart(token?: string): Promise<Cart> {
    try {
      const { cart } = await this.client.store.cart.create(
        { region_id: await this.regionId() },
        { fields: CART_FIELDS },
        token ? bearer(token) : undefined,
      );
      return this.parseCart(cart);
    } catch (error: unknown) {
      throw toAppError(error, 'Failed to create cart');
    }
  }

  async addItem(
    cartId: string,
    item: { variantId: string; quantity: number },
  ): Promise<Cart> {
    try {
      const { cart } = await this.client.store.cart.createLineItem(
        cartId,
        { variant_id: item.variantId, quantity: item.quantity },
        { fields: CART_FIELDS },
      );
      return this.parseCart(cart);
    } catch (error: unknown) {
      throw toAppError(error, 'Failed to add item to cart');
    }
  }

  async updateItem(cartId: string, lineItemId: string, quantity: number): Promise<Cart> {
    if (quantity <= 0) return this.removeItem(cartId, lineItemId);
    try {
      const { cart } = await this.client.store.cart.updateLineItem(
        cartId,
        lineItemId,
        { quantity },
        { fields: CART_FIELDS },
      );
      return this.parseCart(cart);
    } catch (error: unknown) {
      throw toAppError(error, 'Failed to update cart item');
    }
  }

  async removeItem(cartId: string, lineItemId: string): Promise<Cart> {
    try {
      await this.client.store.cart.deleteLineItem(cartId, lineItemId);
      const fresh = await this.getCart(cartId);
      if (!fresh)
        throw new UpstreamError(`Cart ${cartId} disappeared after removing an item`);
      return fresh;
    } catch (error: unknown) {
      throw toAppError(error, 'Failed to remove cart item');
    }
  }

  async transferCart(cartId: string, token: string): Promise<Cart> {
    try {
      const { cart } = await this.client.store.cart.transferCart(
        cartId,
        { fields: CART_FIELDS },
        bearer(token),
      );
      return this.parseCart(cart);
    } catch (error: unknown) {
      throw toAppError(error, 'Failed to attach cart to your account');
    }
  }

  async applyPromoCode(cartId: string, code: string): Promise<Cart> {
    try {
      const { cart } = await this.client.store.cart.addPromotions(
        cartId,
        { promo_codes: [code] },
        { fields: CART_FIELDS },
      );
      const domain = this.parseCart(cart);
      // Medusa silently ignores codes that don't apply.
      if (!domain.promoCodes?.some((c) => c.toLowerCase() === code.toLowerCase())) {
        throw new UserFacingError(`"${code}" isn't a valid code for this order`);
      }
      return domain;
    } catch (error: unknown) {
      throw toAppError(error, 'Failed to apply promo code');
    }
  }

  async removePromoCode(cartId: string, code: string): Promise<Cart> {
    try {
      const { cart } = await this.client.store.cart.removePromotions(
        cartId,
        { promo_codes: [code] },
        { fields: CART_FIELDS },
      );
      return this.parseCart(cart);
    } catch (error: unknown) {
      throw toAppError(error, 'Failed to remove promo code');
    }
  }

  // --- CheckoutService ---

  async updateCheckoutDetails(
    cartId: string,
    input: { email?: string | undefined; shippingAddress: Address },
  ): Promise<Cart> {
    const address = mapAddressToMedusa(input.shippingAddress);
    try {
      const { cart } = await this.client.store.cart.update(
        cartId,
        {
          ...(input.email ? { email: input.email } : {}),
          shipping_address: address,
          billing_address: address,
        },
        { fields: CART_FIELDS },
      );
      return this.parseCart(cart);
    } catch (error: unknown) {
      throw toAppError(error, 'Failed to save delivery details');
    }
  }

  async listShippingOptions(cartId: string): Promise<ShippingOption[]> {
    try {
      const { shipping_options } = await this.client.store.fulfillment.listCartOptions({
        cart_id: cartId,
      });
      const options: ShippingOption[] = [];
      for (const raw of shipping_options ?? []) {
        const parsed = medusaShippingOptionDtoSchema.safeParse(raw);
        if (parsed.success && !parsed.data.insufficient_inventory) {
          options.push(mapMedusaShippingOptionToDomain(parsed.data, 'INR'));
        }
      }
      return options;
    } catch (error: unknown) {
      throw toAppError(error, 'Failed to load delivery options');
    }
  }

  async setShippingOption(cartId: string, optionId: string): Promise<Cart> {
    try {
      const { cart } = await this.client.store.cart.addShippingMethod(
        cartId,
        { option_id: optionId },
        { fields: CART_FIELDS },
      );
      return this.parseCart(cart);
    } catch (error: unknown) {
      throw toAppError(error, 'Failed to set delivery option');
    }
  }

  async listPaymentMethods(cartId: string): Promise<PaymentMethod[]> {
    void cartId;
    try {
      const { payment_providers } = await this.client.store.payment.listPaymentProviders({
        region_id: await this.regionId(),
      });
      const methods = payment_providers.map((p: { id: string }) =>
        describePaymentProvider(p.id),
      );
      // Online payment first.
      return methods.sort(
        (a: PaymentMethod, b: PaymentMethod) =>
          Number(b.kind === 'razorpay') - Number(a.kind === 'razorpay'),
      );
    } catch (error: unknown) {
      throw toAppError(error, 'Failed to load payment methods');
    }
  }

  async initPaymentSession(cartId: string, providerId: string): Promise<PaymentSession> {
    try {
      const { cart } = await this.client.store.cart.retrieve(cartId, {
        fields: CART_FIELDS,
      });
      const { payment_collection } =
        await this.client.store.payment.initiatePaymentSession(cart, {
          provider_id: providerId,
        });
      const session = payment_collection.payment_sessions?.find(
        (s: { provider_id: string }) => s.provider_id === providerId,
      );
      if (!session) {
        throw new UpstreamError(`No ${providerId} payment session was created`);
      }
      return { providerId, data: (session.data ?? {}) as Record<string, unknown> };
    } catch (error: unknown) {
      throw toAppError(error, 'Failed to start payment');
    }
  }

  async completeCart(cartId: string): Promise<CompleteCartResult> {
    try {
      const result = await this.client.store.cart.complete(cartId);
      if (result.type === 'order') {
        const order = await this.getOrder(result.order.id);
        return { type: 'order', order: order ?? this.parseOrder(result.order) };
      }
      return {
        type: 'cart',
        error: result.error?.message ?? 'Payment is not confirmed yet',
      };
    } catch (error: unknown) {
      const appError = toAppError(error, 'Failed to place the order');
      if (appError instanceof UserFacingError) {
        return { type: 'cart', error: appError.message };
      }
      throw appError;
    }
  }

  async getOrder(orderId: string): Promise<Order | null> {
    try {
      const { order } = await this.client.store.order.retrieve(orderId, {
        fields: ORDER_FIELDS,
      });
      return this.parseOrder(order);
    } catch {
      return null;
    }
  }

  // --- CustomerAuthService ---

  async requestOtp(phone: string): Promise<void> {
    try {
      await this.client.client.fetch('/auth/customer/phone-otp', {
        method: 'POST',
        body: { phone },
      });
    } catch (error: unknown) {
      throw toAppError(error, 'Could not send the OTP');
    }
  }

  async verifyOtp(phone: string, otp: string): Promise<OtpVerifyResult> {
    try {
      const { token } = await this.client.client.fetch<{ token: string }>(
        '/auth/customer/phone-otp/callback',
        { method: 'POST', body: { phone, otp } },
      );
      const payload = decodeJwtPayload(token);
      return { token, needsRegistration: !payload.actor_id };
    } catch (error: unknown) {
      throw toAppError(error, 'Could not verify the OTP');
    }
  }

  async registerCustomer(
    registrationToken: string,
    profile: { firstName?: string | undefined; lastName?: string | undefined },
  ): Promise<string> {
    try {
      await this.client.client.fetch('/store/phone-auth/customer', {
        method: 'POST',
        headers: bearer(registrationToken),
        body: {
          ...(profile.firstName ? { first_name: profile.firstName } : {}),
          ...(profile.lastName ? { last_name: profile.lastName } : {}),
        },
      });
      const { token } = await this.client.client.fetch<{ token: string }>(
        '/auth/token/refresh',
        { method: 'POST', headers: bearer(registrationToken) },
      );
      return token;
    } catch (error: unknown) {
      throw toAppError(error, 'Could not create your account');
    }
  }

  async getCustomer(token: string): Promise<Customer | null> {
    try {
      const { customer } = await this.client.store.customer.retrieve(
        { fields: '*addresses' },
        bearer(token),
      );
      return this.parseCustomer(customer);
    } catch {
      return null;
    }
  }

  async updateCustomer(
    token: string,
    input: { firstName: string; lastName: string; email?: string | undefined },
  ): Promise<Customer> {
    try {
      const { customer } = await this.client.store.customer.update(
        {
          first_name: input.firstName,
          last_name: input.lastName,
          ...(input.email ? { email: input.email } : {}),
        } as Parameters<Medusa['store']['customer']['update']>[0],
        { fields: '*addresses' },
        bearer(token),
      );
      return this.parseCustomer(customer);
    } catch (error: unknown) {
      throw toAppError(error, 'Could not update your profile');
    }
  }

  async addAddress(token: string, address: Address): Promise<Customer> {
    try {
      const { customer } = await this.client.store.customer.createAddress(
        mapCustomerAddressToMedusa(address),
        { fields: '*addresses' },
        bearer(token),
      );
      return this.parseCustomer(customer);
    } catch (error: unknown) {
      throw toAppError(error, 'Could not save the address');
    }
  }

  async updateAddress(
    token: string,
    addressId: string,
    address: Address,
  ): Promise<Customer> {
    try {
      const { customer } = await this.client.store.customer.updateAddress(
        addressId,
        mapCustomerAddressToMedusa(address),
        { fields: '*addresses' },
        bearer(token),
      );
      return this.parseCustomer(customer);
    } catch (error: unknown) {
      throw toAppError(error, 'Could not update the address');
    }
  }

  async deleteAddress(token: string, addressId: string): Promise<Customer> {
    try {
      await this.client.store.customer.deleteAddress(addressId, bearer(token));
      const customer = await this.getCustomer(token);
      if (!customer) throw new UpstreamError('Customer not found after deleting address');
      return customer;
    } catch (error: unknown) {
      throw toAppError(error, 'Could not delete the address');
    }
  }

  async listOrders(token: string, page = 1, limit = 10): Promise<PaginatedResult<Order>> {
    try {
      const { orders, count } = await this.client.store.order.list(
        { limit, offset: (page - 1) * limit, order: '-created_at', fields: ORDER_FIELDS },
        bearer(token),
      );
      const items = (orders ?? []).map((o: unknown) => this.parseOrder(o));
      const total = count ?? items.length;
      return {
        items,
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      };
    } catch (error: unknown) {
      throw toAppError(error, 'Could not load your orders');
    }
  }

  async getCustomerOrder(token: string, orderId: string): Promise<Order | null> {
    try {
      const { order } = await this.client.store.order.retrieve(
        orderId,
        { fields: ORDER_FIELDS },
        bearer(token),
      );
      return this.parseOrder(order);
    } catch {
      return null;
    }
  }
}
