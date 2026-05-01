import { useCartStore } from '@/store/cart.store';

export const useCart = () => {
  const {
    items,
    isLoading,
    promoCode,
    promoMessage,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyPromoCode,
    removePromoCode,
    getSubtotal,
    getDiscount,
    getShipping,
    getTotal,
  } = useCartStore();

  return {
    items,
    cartLoading: isLoading,
    promoCode,
    promoMessage,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyPromoCode,
    removePromoCode,
    subtotal: getSubtotal(),
    discount: getDiscount(),
    shipping: getShipping(),
    total: getTotal(),
    cartCount: items.reduce((sum, item) => sum + item.quantity, 0),
  };
};
