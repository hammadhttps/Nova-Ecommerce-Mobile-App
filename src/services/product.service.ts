import { Product, Category } from '@/types';
import { delay } from '@/utils/delay';
import {
  allProducts,
  flashSaleProducts,
  forYouProducts,
  recentProducts,
  categories,
  productDetailImages,
  productReviews,
  getProductById,
} from '@/services/mocks/products';

export const productService = {
  async getFlashSaleProducts(): Promise<Product[]> {
    await delay(500);
    return flashSaleProducts;
  },

  async getForYouProducts(): Promise<Product[]> {
    await delay(500);
    return forYouProducts;
  },

  async getRecentProducts(): Promise<Product[]> {
    await delay(500);
    return recentProducts;
  },

  async getAllProducts(): Promise<Product[]> {
    await delay(500);
    return allProducts;
  },

  async getProductById(id: number): Promise<Product | null> {
    await delay(300);
    return getProductById(id) || null;
  },

  async getProductImages(productId: number): Promise<string[]> {
    await delay(200);
    return productDetailImages;
  },

  async getProductReviews(productId: number): Promise<typeof productReviews> {
    await delay(300);
    return productReviews;
  },

  async getCategories(): Promise<Category[]> {
    await delay(400);
    return categories;
  },

  async searchProducts(query: string): Promise<Product[]> {
    await delay(500);
    if (!query.trim()) return [];
    return allProducts.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category?.toLowerCase().includes(query.toLowerCase())
    );
  },
};
