import type {
  Cart,
  Category,
  Collection,
  PaginatedResult,
  Product,
  ProductFilterParams,
  Redirect,
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

export interface SearchService {
  searchProducts(query: string, limit?: number): Promise<Product[]>;
}

export interface CartService {
  getCart(cartId: string): Promise<Cart | null>;
  createCart(): Promise<Cart>;
  addItem(cartId: string, item: { variantId: string; quantity: number }): Promise<Cart>;
  updateItem(cartId: string, lineItemId: string, quantity: number): Promise<Cart>;
  removeItem(cartId: string, lineItemId: string): Promise<Cart>;
}
