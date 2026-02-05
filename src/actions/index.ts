// src/actions/index.ts
import { defineAction } from 'astro:actions';
import { z } from 'astro:content';
import { serviceApi } from '../services/serviceApi';
import type { SortType } from '../types/service';

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
    handler: async ({ sortBy }) => {
      try {
        return await serviceApi.getAllServices(sortBy as SortType);
      } catch (error) {
        console.error('Error getting sorted services:', error);
        return await serviceApi.getAllServices('popular');
      }
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