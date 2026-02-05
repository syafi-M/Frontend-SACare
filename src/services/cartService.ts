// src/services/cartService.ts
import type { CartItem, Cart } from '../types/cart';
import { CART_STORAGE_KEY } from '../types/cart';
import type { Service } from '../types/service';

export type OrderStatus = 'Pending' | 'On Progress' | 'Completed' | 'Cancelled';

export interface Order {
  id: string;
  date: number;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
}

class CartManager {
  private storageKey = CART_STORAGE_KEY;

  /**
   * Helper untuk trigger event agar UI tahu ada perubahan
   */
  private dispatchCartUpdate() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('cart-updated'));
    }
  }

  /**
   * Get cart dari localStorage
   */
  getCart(): Cart {
    try {
      if (typeof window === 'undefined') {
        return { items: [], totalPrice: 0, totalItems: 0 };
      }

      const stored = localStorage.getItem(this.storageKey);
      if (!stored) {
        return { items: [], totalPrice: 0, totalItems: 0 };
      }

      const cart = JSON.parse(stored);
      // Pastikan kita selalu menghitung ulang total saat load untuk akurasi
      return this.calculateTotals(cart);
    } catch (error) {
      console.error('Error loading cart:', error);
      return { items: [], totalPrice: 0, totalItems: 0 };
    }
  }

  /**
   * Add item ke cart
   */
  addToCart(service: Service, size: number = 1, duration: number = 1): CartItem {
    const cart = this.getCart();
    const existingIndex = cart.items.findIndex(item => item.id === service.id);

    if (existingIndex > -1) {
      cart.items[existingIndex].size += size;
      // Opsional: duration biasanya tidak ditambah, tapi diupdate. 
    } else {
      const cartItem: CartItem = {
        ...service,
        size,
        addedAt: Date.now(),
      };
      cart.items.push(cartItem);
    }

    this.saveCart(cart);
    return cart.items[existingIndex > -1 ? existingIndex : cart.items.length - 1];
  }

  /**
   * Remove item dari cart
   */
  removeFromCart(serviceId: number): void {
    const cart = this.getCart();
    cart.items = cart.items.filter(item => item.id !== serviceId);
    this.saveCart(cart);
  }

  /**
   * Update size
   */
  updateSize(serviceId: number, size: number): void {
    const cart = this.getCart();
    const item = cart.items.find(item => item.id === serviceId);

    if (item) {
      if (size <= 0) {
        this.removeFromCart(serviceId);
      } else {
        item.size = size;
        this.saveCart(cart);
      }
    }
  }

  /**
   * Update duration
   */
  updateDuration(serviceId: number, duration: number): void {
    const cart = this.getCart();
    const item = cart.items.find(item => item.id === serviceId);

    if (item) {
      if (duration <= 0) {
        this.removeFromCart(serviceId);
      } else {
        this.saveCart(cart);
      }
    }
  }

  /**
   * Clear cart
   */
  clearCart(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.storageKey);
    }
  }

  /**
   * Calculate totals
   */
  private calculateTotals(cart: Cart): Cart {
    // FIX: Gunakan .reduce dengan benar
    const totalItems = cart.items.reduce((sum, item) => sum + item.size, 0);
    const totalPrice = cart.items.reduce(
      (sum, item) => sum + (item.price * item.size),
      0
    );

    return {
      ...cart,
      items: cart.items,
      totalItems,
      totalPrice,
    };
  }

  /**
   * Save cart ke localStorage
   */
  private saveCart(cart: Cart): void {
    try {
      const calculated = this.calculateTotals(cart);
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.storageKey, JSON.stringify(calculated));
        // TRIGGER EVENT!
        this.dispatchCartUpdate();
      }
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }

    /**
     * Get total items in cart
     */
  getTotalItems(): number {
    const cart = this.getCart();
    return cart.totalItems || 0;
  }

  checkout(): Order | null {
    const cart = this.getCart();
    if (cart.items.length === 0) return null;

    const tax = Math.round(cart.totalPrice * 0.1);
    const order: Order = {
      id: `SAC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      date: Date.now(),
      items: [...cart.items],
      subtotal: cart.totalPrice,
      tax: tax,
      total: cart.totalPrice + tax,
      status: 'Completed'
    };

    // Simpan ke History (Mock Database)
    const history = JSON.parse(localStorage.getItem('order_history') || '[]');
    localStorage.setItem('order_history', JSON.stringify([order, ...history]));

    // Kosongkan keranjang
    this.clearCart();
    this.dispatchCartUpdate();
    
    return order;
  }

  getOrderHistory(): Order[] {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem('order_history') || '[]');
  }
}

export const cartManager = new CartManager();