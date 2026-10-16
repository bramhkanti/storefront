export type SortOption =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'rating'
  | 'name-asc';

export interface FilterState {
  category: string;
  priceRange: string;
  spiceLevel: string;
  oilBase: string;
  inStockOnly: boolean;
}

export const DEFAULT_FILTERS: FilterState = {
  category: 'all',
  priceRange: 'all',
  spiceLevel: 'all',
  oilBase: 'all',
  inStockOnly: false,
};

export const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: 'featured', label: 'Featured & Best Match' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Customer Rated (★ 4.9)' },
  { value: 'name-asc', label: 'Alphabetical: A to Z' },
];

export const PRICE_RANGES: Array<{ value: string; label: string; min?: number; max?: number }> = [
  { value: 'all', label: 'All Prices' },
  { value: 'under-300', label: 'Under ₹300', min: 0, max: 300 },
  { value: '300-500', label: '₹300 - ₹500', min: 300, max: 500 },
  { value: '500-800', label: '₹500 - ₹800', min: 500, max: 800 },
  { value: 'above-800', label: 'Above ₹800', min: 800 },
];

export const SPICE_LEVELS: Array<{ value: string; label: string }> = [
  { value: 'all', label: 'All Spice Levels' },
  { value: 'Mild', label: 'Mild (Gentle Warmth)' },
  { value: 'Medium', label: 'Medium (Traditional Zing)' },
  { value: 'Hot', label: 'Hot (Fiery Banarasi Kick)' },
  { value: 'Extra Hot', label: 'Extra Hot (Stone-Ground Chilli)' },
];

export const OIL_BASES: Array<{ value: string; label: string }> = [
  { value: 'all', label: 'All Cooking Bases' },
  { value: 'mustard', label: 'Virgin Kachi Ghani Mustard Oil' },
  { value: 'ghee', label: '100% Native Desi Cow Ghee' },
  { value: 'oil-free', label: '100% Oil-Free Sun-Dried' },
];

export const POPULAR_SEARCH_TERMS = [
  'Aam Ka Achar',
  'Banarasi Lal Mirch',
  'Nimbu Achar',
  'Besan Laddu',
  'Gond Ladoo',
  'Roasted Makhana',
  'Himalayan Salt Makhana',
  'Peri Peri',
];
