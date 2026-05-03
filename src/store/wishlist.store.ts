import { create } from "zustand";
import { WishlistItem, Product } from "@/types";
import { wishlistService } from "@/services/wishlist.service";
import { useAuthStore } from "./auth.store";

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;

  fetchWishlist: () => Promise<void>;
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => Promise<boolean>;
  clearWishlist: () => Promise<void>;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  isLoading: false,

  fetchWishlist: async () => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;

    set({ isLoading: true });
    try {
      const items = await wishlistService.getWishlistItems(userId);
      set({ items });
    } finally {
      set({ isLoading: false });
    }
  },

  addToWishlist: async (product: Product) => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;

    const items = await wishlistService.addToWishlist(userId, product);
    set({ items });
  },

  removeFromWishlist: async (productId: string) => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;

    const items = await wishlistService.removeFromWishlist(userId, productId);
    set({ items });
  },

  isInWishlist: async (productId: string) => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return false;

    return wishlistService.isInWishlist(userId, productId);
  },

  clearWishlist: async () => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;

    await wishlistService.clearWishlist(userId);
    set({ items: [] });
  },
}));
