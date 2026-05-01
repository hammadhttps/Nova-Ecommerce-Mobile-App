import { useWishlistStore } from '@/store/wishlist.store';

export const useWishlist = () => {
  const {
    items,
    isLoading,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
  } = useWishlistStore();

  return {
    wishlistItems: items,
    wishlistLoading: isLoading,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    wishlistCount: items.length,
  };
};
