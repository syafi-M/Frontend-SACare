// src/services/cartService.ts
import type { CartItem, Cart } from '../types/cart';
import { CART_STORAGE_KEY } from '../types/cart';
import type { Service } from '../types/service';

class CartManager {
  private storageKey = CART_STORAGE_KEY;

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
      return this.calculateTotals(cart);
    } catch (error) {
      console.error('Error loading cart:', error);
      return { items: [], totalPrice: 0, totalItems: 0 };
    }
  }

  /**
   * Add item ke cart
   */
  addToCart(service: Service, quantity: number = 1, duration: number = 1): CartItem {
    const cart = this.getCart();

    // Check if item already exists
    const existingIndex = cart.items.findIndex(item => item.id === service.id);

    if (existingIndex > -1) {
      // Update quantity dan duration
      cart.items[existingIndex].quantity += quantity;
      cart.items[existingIndex].duration += duration;
    } else {
      // Add new item
      const cartItem: CartItem = {
        ...service,
        quantity,
        duration,
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
   * Update quantity
   */
  updateQuantity(serviceId: number, quantity: number): void {
    const cart = this.getCart();
    const item = cart.items.find(item => item.id === serviceId);

    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(serviceId);
      } else {
        item.quantity = quantity;
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
        item.duration = duration;
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
    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.items.reduce(
      (sum, item) => sum + (item.price * item.quantity * item.duration),
      0
    );

    return {
      ...cart,
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
      }
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }
}

export const cartManager = new CartManager();