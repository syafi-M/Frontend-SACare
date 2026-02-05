// src/actions/index.ts
import { defineAction } from 'astro:actions';
import { z } from 'astro:content';
import { serviceApi } from '../services/serviceApi';
import type { SortType } from '../types/service';

const API_MODE = import.meta.env.PUBLIC_API_MODE;
const LARAVEL_URL = import.meta.env.PUBLIC_LARAVEL_URL;

export const server = {
  loginWithGoogle: defineAction({
    input: z.object({}).optional(),
    handler: async (_, context) => {
      try {
        const dummyUser = {
          name: "User SACare",
          email: "user@sacare.com"
        };

        context.cookies.set("user_session", JSON.stringify(dummyUser), {
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: 'lax'
        });

        return { success: true };
      } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: 'Failed to login' };
      }
    }
  }),

  getSortedServices: defineAction({
    input: z.object({
      sortBy: z.enum(['popular', 'rating', 'price-low-high', 'price-high-low']),
    }),
    handler: async (input, context) => {
      // LOGIKA SWITCHER
      if (API_MODE === 'production') {
        try {
          const response = await fetch(`${LARAVEL_URL}/services?sort=${input.sortBy}`, {
            headers: {
              // Ambil token dari cookie jika sudah login
              'Authorization': `Bearer ${context.cookies.get('auth_token')?.value}`,
              'Accept': 'application/json'
            }
          });
          return await response.json();
        } catch (e) {
          throw new Error("Gagal menyambung ke Laravel API");
        }
      }

      // LOGIKA DUMMY (Dijalankan jika mode = dummy)
      console.log("Running in Dummy Mode...");
      const dummyServices = [
        { id: 1, name: 'Cleaning Service', price: 150000, rate: 4.8 },
        { id: 2, name: 'AC Service', price: 200000, rate: 4.5 },
      ];
      // ... logika sorting dummy kamu ...
      return dummyServices;
    }
  }),

  addToCart: defineAction({
    input: z.object({
      serviceId: z.number(),
      quantity: z.number().min(1).default(1),
      duration: z.number().min(1).default(1),
    }),
    handler: async (input) => {
      try {
        // Fetch service dari serviceApi
        const service = await serviceApi.getServiceById(input.serviceId);
        
        if (!service) {
          return { success: false, error: 'Service not found' };
        }

        // Add to cart (client-side akan handle ini)
        return {
          success: true,
          data: {
            serviceId: service.id,
            quantity: input.quantity,
            duration: input.duration,
            price: service.price,
          }
        };
      } catch (error) {
        console.error('Error adding to cart:', error);
        return { success: false, error: 'Failed to add to cart' };
      }
    }
  }),

  getCart: defineAction({
    input: z.object({}).optional(),
    handler: async () => {
      try {
        // Cart diambil dari client-side localStorage
        // Action ini bisa digunakan untuk server-side validation nanti
        return { success: true };
      } catch (error) {
        console.error('Error getting cart:', error);
        return { success: false, error: 'Failed to get cart' };
      }
    }
  })
};