import { create } from 'zustand';
import { CartItem, Product } from '@/types';
import { cartService } from '@/services/cart.service';

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  promoCode: string | null;
  promoDiscount: number;
  promoMessage: string;

  fetchCart: () => Promise<void>;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  applyPromoCode: (code: string) => void;
  removePromoCode: () => void;
  getSubtotal: () => number;
  getDiscount: () => number;
  getShipping: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,
  promoCode: null,
  promoDiscount: 0,
  promoMessage: '',

  fetchCart: async () => {
    set({ isLoading: true });
    const items = await cartService.getCartItems();
    set({ items, isLoading: false });
  },

  addToCart: async (product: Product, quantity = 1) => {
    const items = await cartService.addToCart(product, quantity);
    set({ items });
  },

  updateQuantity: async (productId: number, quantity: number) => {
    const items = await cartService.updateQuantity(productId, quantity);
    set({ items });
  },

  removeFromCart: async (productId: number) => {
    const items = await cartService.removeFromCart(productId);
    set({ items });
  },

  clearCart: async () => {
    await cartService.clearCart();
    set({ items: [], promoCode: null, promoDiscount: 0, promoMessage: '' });
  },

  applyPromoCode: (code: string) => {
    const result = cartService.applyPromoCode(code);
    set({
      promoCode: result.valid ? code : null,
      promoDiscount: result.discount,
      promoMessage: result.message,
    });
  },

  removePromoCode: () => {
    set({ promoCode: null, promoDiscount: 0, promoMessage: '' });
  },

  getSubtotal: () => {
    return cartService.getSubtotal(get().items);
  },

  getDiscount: () => {
    return get().getSubtotal() * get().promoDiscount;
  },

  getShipping: () => {
    const subtotal = get().getSubtotal();
    return subtotal > 50 ? 0 : 4.99;
  },

  getTotal: () => {
    return get().getSubtotal() - get().getDiscount() + get().getShipping();
  },
}));
