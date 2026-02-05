// src/types/cart.ts
import type { Service } from './service';

export interface CartItem extends Service {
  size: number;
  addedAt: number; // timestamp
}

export interface Cart {
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
}

export const CART_STORAGE_KEY = 'sacare-cart';