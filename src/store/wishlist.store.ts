import { create } from 'zustand';
import { WishlistItem, Product } from '@/types';
import { wishlistService } from '@/services/wishlist.service';

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;

  fetchWishlist: () => Promise<void>;
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: number) => Promise<void>;
  isInWishlist: (productId: number) => Promise<boolean>;
  clearWishlist: () => Promise<void>;
}

export const useWishlistStore = create<WishlistState>((set) => ({
  items: [],
  isLoading: false,

  fetchWishlist: async () => {
    set({ isLoading: true });
    const items = await wishlistService.getWishlistItems();
    set({ items, isLoading: false });
  },

  addToWishlist: async (product: Product) => {
    const items = await wishlistService.addToWishlist(product);
    set({ items });
  },

  removeFromWishlist: async (productId: number) => {
    const items = await wishlistService.removeFromWishlist(productId);
    set({ items });
  },

  isInWishlist: async (productId: number) => {
    return wishlistService.isInWishlist(productId);
  },

  clearWishlist: async () => {
    await wishlistService.clearWishlist();
    set({ items: [] });
  },
}));
