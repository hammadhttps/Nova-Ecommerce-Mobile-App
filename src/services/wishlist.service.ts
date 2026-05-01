import { WishlistItem, Product } from '@/types';
import { initialWishlistItems } from '@/services/mocks/wishlist';

let wishlistState: WishlistItem[] = [...initialWishlistItems];

export const wishlistService = {
  async getWishlistItems(): Promise<WishlistItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return wishlistState;
  },

  async addToWishlist(product: Product): Promise<WishlistItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const exists = wishlistState.find((item) => item.id === product.id);
    if (!exists) {
      wishlistState.push({
        ...product,
        inStock: product.inStock ?? true,
      });
    }
    return wishlistState;
  },

  async removeFromWishlist(productId: number): Promise<WishlistItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    wishlistState = wishlistState.filter((item) => item.id !== productId);
    return wishlistState;
  },

  async isInWishlist(productId: number): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return wishlistState.some((item) => item.id === productId);
  },

  async clearWishlist(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    wishlistState = [];
  },
};
