import { useCartStore } from '@/store/cart.store';

export const useCart = () => {
  const items = useCartStore((state) => state.items);
  const isLoading = useCartStore((state) => state.isLoading);
  const promoCode = useCartStore((state) => state.promoCode);
  const promoMessage = useCartStore((state) => state.promoMessage);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const addToCart = useCartStore((state) => state.addToCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const applyPromoCode = useCartStore((state) => state.applyPromoCode);
  const removePromoCode = useCartStore((state) => state.removePromoCode);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const getDiscount = useCartStore((state) => state.getDiscount);
  const getShipping = useCartStore((state) => state.getShipping);
  const getTotal = useCartStore((state) => state.getTotal);

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
