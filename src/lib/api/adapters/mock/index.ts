import type {
  Cart,
  Category,
  Collection,
  PaginatedResult,
  Product,
  ProductFilterParams,
  Redirect,
} from '../../contracts/domain';
import type {
  CartService,
  CategoryReader,
  CollectionReader,
  ProductReader,
  RedirectReader,
  SearchService,
} from '../../contracts/readers';
import { NotFoundError } from '../../errors';
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
    CartService
{
  private categories: Category[];
  private products: Product[];
  private collections: Collection[];
  private redirects: Redirect[];
  private carts: Map<string, Cart>;

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

  async createCart(): Promise<Cart> {
    const id = `cart_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newCart: Cart = {
      id,
      items: [],
      itemCount: 0,
      subtotal: { amount: 0, currencyCode: 'INR' },
      shippingEstimate: { amount: 0, currencyCode: 'INR' },
      total: { amount: 0, currencyCode: 'INR' },
      currencyCode: 'INR',
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
    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    // Free shipping above ₹999 (99900 paise), else ₹70 (7000 paise) flat
    const shippingAmount = subtotalAmount === 0 ? 0 : subtotalAmount >= 99900 ? 0 : 7000;

    cart.itemCount = itemCount;
    cart.subtotal = { amount: subtotalAmount, currencyCode: cart.currencyCode };
    cart.shippingEstimate = { amount: shippingAmount, currencyCode: cart.currencyCode };
    cart.total = {
      amount: subtotalAmount + shippingAmount,
      currencyCode: cart.currencyCode,
    };
  }
}
