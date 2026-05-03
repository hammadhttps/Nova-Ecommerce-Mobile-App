import { create } from "zustand";
import { CartItem, Product } from "@/types";
import { cartService } from "@/services/cart.service";
import { useAuthStore } from "./auth.store";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from "@/utils/constants";

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  promoCode: string | null;
  promoDiscount: number;
  promoMessage: string;

  fetchCart: () => Promise<void>;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
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
  promoMessage: "",

  fetchCart: async () => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;

    set({ isLoading: true });
    try {
      const items = await cartService.getCartItems(userId);
      set({ items });
    } finally {
      set({ isLoading: false });
    }
  },

  addToCart: async (product: Product, quantity = 1) => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;

    const items = await cartService.addToCart(userId, product, quantity);
    set({ items });
  },

  updateQuantity: async (productId: string, quantity: number) => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;

    const items = await cartService.updateQuantity(userId, productId, quantity);
    set({ items });
  },

  removeFromCart: async (productId: string) => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;

    const items = await cartService.removeFromCart(userId, productId);
    set({ items });
  },

  clearCart: async () => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;

    await cartService.clearCart(userId);
    set({ items: [], promoCode: null, promoDiscount: 0, promoMessage: "" });
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
    set({ promoCode: null, promoDiscount: 0, promoMessage: "" });
  },

  getSubtotal: () => {
    return cartService.getSubtotal(get().items);
  },

  getDiscount: () => {
    return get().getSubtotal() * get().promoDiscount;
  },

  getShipping: () => {
    const subtotal = get().getSubtotal();
    return subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  },

  getTotal: () => {
    return get().getSubtotal() - get().getDiscount() + get().getShipping();
  },
}));
