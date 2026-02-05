// src/types/service.ts
export interface Service {
  id: number;
  name: string;
  description: string;
  img: string;
  category: string;
  price: number;
  rate: number;
  rateCount: number;
}

export type SortType = 'popular' | 'rating' | 'price-low-high' | 'price-high-low';

export const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rating' },
  { value: 'price-low-high', label: 'Price: Low to High' },
  { value: 'price-high-low', label: 'Price: High to Low' },
] as const;