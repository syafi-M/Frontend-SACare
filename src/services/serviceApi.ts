// src/services/serviceApi.ts
import type { Service, SortType } from '../types/service';

// DUMMY DATA - akan diganti dengan API call nanti
const DUMMY_SERVICES: Service[] = [
  {
    id: 1,
    name: 'Cleaning Service',
    description: 'Layanan pembersihan rumah profesional dan menyeluruh',
    img: 'https://placehold.co/600x300',
    category: 'Cleaning',
    price: 150000,
    rate: 4.8,
    rateCount: 120
  },
  {
    id: 2,
    name: 'AC Service & Cleaning',
    description: 'Pembersihan, servis, dan perawatan AC berkala',
    img: 'https://placehold.co/600x300',
    category: 'Cleaning',
    price: 200000,
    rate: 4.5,
    rateCount: 95
  },
  {
    id: 3,
    name: 'Laundry Service',
    description: 'Layanan cuci dan setrika pakaian profesional',
    img: 'https://placehold.co/600x300',
    category: 'Laundry',
    price: 100000,
    rate: 4.7,
    rateCount: 150
  },
  {
    id: 4,
    name: 'Furniture Cleaning',
    description: 'Pembersihan dan perawatan mebel dan sofa',
    img: 'https://placehold.co/600x300',
    category: 'Cleaning',
    price: 250000,
    rate: 4.6,
    rateCount: 80
  },
  {
    id: 5,
    name: 'Carpet & Rug Cleaning',
    description: 'Pembersihan karpet dan permadani dengan steam cleaning',
    img: 'https://placehold.co/600x300',
    category: 'Cleaning',
    price: 300000,
    rate: 4.5,
    rateCount: 60
  },
  {
    id: 6,
    name: 'Window & Glass Cleaning',
    description: 'Pembersihan kaca jendela dan cermin profesional',
    img: 'https://placehold.co/600x300',
    category: 'Cleaning',
    price: 100000,
    rate: 4.7,
    rateCount: 70
  },
  {
    id: 7,
    name: 'Pest Control',
    description: 'Layanan pengendalian hama dan serangga',
    img: 'https://placehold.co/600x300',
    category: 'Cleaning',
    price: 350000,
    rate: 4.8,
    rateCount: 90
  },
  {
    id: 8,
    name: 'Plumbing Service',
    description: 'Perbaikan dan perawatan sistem pipa air',
    img: 'https://placehold.co/600x300',
    category: 'Plumbing',
    price: 200000,
    rate: 4.6,
    rateCount: 50
  }
];

/**
 * Service API Layer
 * DUMMY: Menggunakan dummy data untuk sekarang
 * TODO: Replace dengan API call ke backend
 * 
 * Contoh API call nanti:
 * const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/services`, {...})
 * return response.json()
 */

class ServiceApiClient {
  private baseUrl = import.meta.env.PUBLIC_API_URL || 'http://localhost:3000/api';

  /**
   * Fetch semua services dengan optional sorting
   * DUMMY: Return dummy data
   */
  async getAllServices(sortBy?: SortType, category?: string): Promise<Service[]> {
    try {
      let services = [...DUMMY_SERVICES];
      
      // Tambahkan Logika Filter Kategori
      if (category) {
        services = services.filter(s => 
          s.category.toLowerCase() === category.toLowerCase()
        );
      }

      return this.sortServices(services, sortBy || 'popular');
    } catch (error) {
      console.error('Error fetching services:', error);
      return DUMMY_SERVICES;
    }
  }

  /**
   * Fetch single service by ID
   * DUMMY: Return dummy data
   */
  async getServiceById(id: number): Promise<Service | null> {
    try {
      // TODO: Uncomment ini ketika API siap
      // const response = await fetch(`${this.baseUrl}/services/${id}`);
      // if (!response.ok) return null;
      // return response.json();

      // DUMMY: Return dummy data
      return DUMMY_SERVICES.find(s => s.id === id) || null;
    } catch (error) {
      console.error('Error fetching service:', error);
      return DUMMY_SERVICES.find(s => s.id === id) || null;
    }
  }

  /**
   * Sort services
   * Helper function untuk sorting logic
   */
  private sortServices(services: Service[], sortBy: SortType): Service[] {
    const sorted = [...services];

    switch (sortBy) {
      case 'price-low-high':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high-low':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => b.rate - a.rate || b.rateCount - a.rateCount);
      case 'popular':
      default:
        return sorted.sort((a, b) => b.rateCount - a.rateCount || b.rate - a.rate);
    }
  }
}

export const serviceApi = new ServiceApiClient();