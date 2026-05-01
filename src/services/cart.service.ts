import { CartItem, Product } from '@/types';
import { initialCartItems } from '@/services/mocks/cart';
import { delay } from '@/utils/delay';

let cartState: CartItem[] = [...initialCartItems];

export const cartService = {
  async getCartItems(): Promise<CartItem[]> {
    await delay(300);
    return cartState;
  },

  async addToCart(product: Product, quantity: number = 1): Promise<CartItem[]> {
    await delay(200);

    const existingItem = cartState.find((item) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cartState.push({
        ...product,
        quantity,
      });
    }
    return cartState;
  },

  async updateQuantity(productId: number, quantity: number): Promise<CartItem[]> {
    await delay(200);

    if (quantity <= 0) {
      cartState = cartState.filter((item) => item.id !== productId);
    } else {
      const item = cartState.find((item) => item.id === productId);
      if (item) {
        item.quantity = quantity;
      }
    }
    return cartState;
  },

  async removeFromCart(productId: number): Promise<CartItem[]> {
    await delay(200);
    cartState = cartState.filter((item) => item.id !== productId);
    return cartState;
  },

  async clearCart(): Promise<void> {
    await delay(200);
    cartState = [];
  },

  getSubtotal(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  applyPromoCode(code: string): { valid: boolean; discount: number; message: string } {
    if (code === 'NOVA20') {
      return { valid: true, discount: 0.2, message: '20% discount applied!' };
    }
    return { valid: false, discount: 0, message: 'Invalid promo code' };
  },
};
