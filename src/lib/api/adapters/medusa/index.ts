import type Medusa from '@medusajs/js-sdk';
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
import { NotFoundError, UpstreamError } from '../../errors';
import { createMedusaClient, type MedusaClientConfig } from './client';
import {
  medusaCartDtoSchema,
  medusaCategoryDtoSchema,
  medusaCollectionDtoSchema,
  medusaProductDtoSchema,
} from './dto';
import {
  mapMedusaCartToDomain,
  mapMedusaCategoryToDomain,
  mapMedusaCollectionToDomain,
  mapMedusaProductToDomain,
} from './mappers';

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
    CartService
{
  private client: Medusa;

  constructor(config: MedusaClientConfig) {
    this.client = createMedusaClient(config);
  }

  // --- CategoryReader ---

  async getCategoryByHandle(handle: string): Promise<Category | null> {
    try {
      const response = await this.client.store.category.list({
        handle,
        fields: '+metadata,+category_children',
      });
      const rawCategory = response.product_categories?.[0];
      if (!rawCategory) return null;

      const parsed = medusaCategoryDtoSchema.safeParse(rawCategory);
      if (!parsed.success) {
        throw new UpstreamError(
          `Invalid Medusa category payload for handle ${handle}`,
          502,
          parsed.error,
        );
      }
      return mapMedusaCategoryToDomain(parsed.data);
    } catch (error: unknown) {
      if (error instanceof UpstreamError) throw error;
      throw new UpstreamError(
        `Failed to fetch category ${handle} from Medusa`,
        502,
        error,
      );
    }
  }

  async listCategories(): Promise<Category[]> {
    try {
      const response = await this.client.store.category.list({
        fields: '+metadata,+category_children',
        limit: 100,
      });
      const categories: Category[] = [];
      for (const raw of response.product_categories ?? []) {
        const parsed = medusaCategoryDtoSchema.safeParse(raw);
        if (parsed.success) {
          categories.push(mapMedusaCategoryToDomain(parsed.data));
        }
      }
      return categories;
    } catch (error: unknown) {
      throw new UpstreamError('Failed to list categories from Medusa', 502, error);
    }
  }

  async getCategoryTree(): Promise<Category[]> {
    try {
      const response = await this.client.store.category.list({
        parent_category_id: null,
        include_descendants_tree: true,
        fields: '+metadata,+category_children',
      });
      const tree: Category[] = [];
      for (const raw of response.product_categories ?? []) {
        const parsed = medusaCategoryDtoSchema.safeParse(raw);
        if (parsed.success) {
          tree.push(mapMedusaCategoryToDomain(parsed.data));
        }
      }
      return tree;
    } catch (error: unknown) {
      throw new UpstreamError('Failed to fetch category tree from Medusa', 502, error);
    }
  }

  async getAllCategoryHandles(): Promise<string[]> {
    const categories = await this.listCategories();
    return categories.map((c) => c.handle);
  }

  // --- ProductReader ---

  async getProductByHandle(handle: string): Promise<Product | null> {
    try {
      const response = await this.client.store.product.list({
        handle,
        fields:
          '+metadata,+variants.metadata,+variants.calculated_price,+categories,+images',
      });
      const rawProduct = response.products?.[0];
      if (!rawProduct) return null;

      const parsed = medusaProductDtoSchema.safeParse(rawProduct);
      if (!parsed.success) {
        throw new UpstreamError(
          `Invalid Medusa product payload for handle ${handle}`,
          502,
          parsed.error,
        );
      }
      return mapMedusaProductToDomain(parsed.data);
    } catch (error: unknown) {
      if (error instanceof UpstreamError) throw error;
      throw new UpstreamError(
        `Failed to fetch product ${handle} from Medusa`,
        502,
        error,
      );
    }
  }

  async listProducts(
    filter: ProductFilterParams = {},
  ): Promise<PaginatedResult<Product>> {
    const { categoryHandle, collectionHandle, sort, page = 1, limit = 20 } = filter;
    const offset = (page - 1) * limit;

    const query: Record<string, unknown> = {
      offset,
      limit,
      fields:
        '+metadata,+variants.metadata,+variants.calculated_price,+categories,+images',
    };

    if (categoryHandle) {
      const category = await this.getCategoryByHandle(categoryHandle);
      if (category) {
        query.category_id = [category.id];
      }
    }

    if (collectionHandle) {
      const col = await this.getCollectionByHandle(collectionHandle);
      if (col) {
        query.collection_id = [col.id];
      }
    }

    if (sort === 'price_asc') {
      query.order = 'variants.calculated_price';
    } else if (sort === 'price_desc') {
      query.order = '-variants.calculated_price';
    } else if (sort === 'newest') {
      query.order = '-created_at';
    }

    try {
      const response = await this.client.store.product.list(query);
      const items: Product[] = [];
      for (const raw of response.products ?? []) {
        const parsed = medusaProductDtoSchema.safeParse(raw);
        if (parsed.success) {
          items.push(mapMedusaProductToDomain(parsed.data));
        }
      }

      const total = response.count ?? items.length;
      const totalPages = Math.ceil(total / limit) || 1;

      return {
        items,
        total,
        page,
        limit,
        totalPages,
      };
    } catch (error: unknown) {
      throw new UpstreamError('Failed to list products from Medusa', 502, error);
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
      const response = await this.client.store.collection.list({
        handle,
        fields: '+metadata',
      });
      const rawCollection = response.collections?.[0];
      if (!rawCollection) return null;

      const parsed = medusaCollectionDtoSchema.safeParse(rawCollection);
      if (!parsed.success) return null;
      return mapMedusaCollectionToDomain(parsed.data);
    } catch (error: unknown) {
      throw new UpstreamError(
        `Failed to fetch collection ${handle} from Medusa`,
        502,
        error,
      );
    }
  }

  async listCollections(): Promise<Collection[]> {
    try {
      const response = await this.client.store.collection.list({
        fields: '+metadata',
        limit: 50,
      });
      const items: Collection[] = [];
      for (const raw of response.collections ?? []) {
        const parsed = medusaCollectionDtoSchema.safeParse(raw);
        if (parsed.success) {
          items.push(mapMedusaCollectionToDomain(parsed.data));
        }
      }
      return items;
    } catch (error: unknown) {
      throw new UpstreamError('Failed to list collections from Medusa', 502, error);
    }
  }

  // --- RedirectReader ---

  async getRedirect(path: string): Promise<Redirect | null> {
    void path;
    // In production with Medusa, redirects can be stored in a custom Medusa module or table.
    // Clean fallback to null if no redirect matches.
    return null;
  }

  async listAllRedirects(): Promise<Redirect[]> {
    return [];
  }

  // --- SearchService ---

  async searchProducts(query: string, limit = 10): Promise<Product[]> {
    try {
      const response = await this.client.store.product.list({
        q: query,
        limit,
        fields:
          '+metadata,+variants.metadata,+variants.calculated_price,+categories,+images',
      });
      const items: Product[] = [];
      for (const raw of response.products ?? []) {
        const parsed = medusaProductDtoSchema.safeParse(raw);
        if (parsed.success) {
          items.push(mapMedusaProductToDomain(parsed.data));
        }
      }
      return items;
    } catch (error: unknown) {
      throw new UpstreamError(
        `Failed to search products for "${query}" from Medusa`,
        502,
        error,
      );
    }
  }

  // --- CartService ---

  async getCart(cartId: string): Promise<Cart | null> {
    try {
      const response = await this.client.store.cart.retrieve(cartId, {
        fields: '+items.product_handle,+shipping_total',
      });
      const parsed = medusaCartDtoSchema.safeParse(response.cart);
      if (!parsed.success) return null;
      return mapMedusaCartToDomain(parsed.data);
    } catch {
      return null;
    }
  }

  async createCart(): Promise<Cart> {
    try {
      const response = await this.client.store.cart.create({});
      const parsed = medusaCartDtoSchema.safeParse(response.cart);
      if (!parsed.success) {
        throw new UpstreamError(
          'Invalid cart created payload from Medusa',
          502,
          parsed.error,
        );
      }
      return mapMedusaCartToDomain(parsed.data);
    } catch (error: unknown) {
      throw new UpstreamError('Failed to create cart on Medusa', 502, error);
    }
  }

  async addItem(
    cartId: string,
    item: { variantId: string; quantity: number },
  ): Promise<Cart> {
    try {
      const response = await this.client.store.cart.createLineItem(cartId, {
        variant_id: item.variantId,
        quantity: item.quantity,
      });
      const parsed = medusaCartDtoSchema.safeParse(response.cart);
      if (!parsed.success) {
        throw new UpstreamError(
          'Invalid cart payload after adding item',
          502,
          parsed.error,
        );
      }
      return mapMedusaCartToDomain(parsed.data);
    } catch (error: unknown) {
      throw new UpstreamError(`Failed to add item to cart ${cartId}`, 502, error);
    }
  }

  async updateItem(cartId: string, lineItemId: string, quantity: number): Promise<Cart> {
    try {
      if (quantity <= 0) {
        return this.removeItem(cartId, lineItemId);
      }
      const response = await this.client.store.cart.updateLineItem(cartId, lineItemId, {
        quantity,
      });
      const parsed = medusaCartDtoSchema.safeParse(response.cart);
      if (!parsed.success) {
        throw new UpstreamError(
          'Invalid cart payload after updating item',
          502,
          parsed.error,
        );
      }
      return mapMedusaCartToDomain(parsed.data);
    } catch (error: unknown) {
      throw new UpstreamError(`Failed to update item in cart ${cartId}`, 502, error);
    }
  }

  async removeItem(cartId: string, lineItemId: string): Promise<Cart> {
    try {
      const response = await this.client.store.cart.deleteLineItem(cartId, lineItemId);
      // DeleteLineItem returns deleted parent cart
      const cartRaw = (response as { parent?: unknown }).parent ?? response;
      const parsed = medusaCartDtoSchema.safeParse(cartRaw);
      if (!parsed.success) {
        // Fallback: retrieve fresh cart
        const fresh = await this.getCart(cartId);
        if (!fresh) throw new NotFoundError('Cart', cartId);
        return fresh;
      }
      return mapMedusaCartToDomain(parsed.data);
    } catch (error: unknown) {
      throw new UpstreamError(`Failed to remove item from cart ${cartId}`, 502, error);
    }
  }
}
