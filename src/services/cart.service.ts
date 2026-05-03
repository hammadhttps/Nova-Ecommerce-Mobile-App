import { CartItem, Product } from "@/types";
import { db } from "../../Firebaseconfig";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";

export const cartService = {
  async getCartItems(userId: string): Promise<CartItem[]> {
    const q = query(collection(db, "users", userId, "carts"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) => ({ ...doc.data(), id: doc.id }) as CartItem,
    );
  },

  async addToCart(
    userId: string,
    product: Product,
    quantity: number = 1,
  ): Promise<CartItem[]> {
    const cartRef = doc(db, "users", userId, "carts", product.id);
    const existing = await getDocs(
      query(
        collection(db, "users", userId, "carts"),
        where("id", "==", product.id),
      ),
    );

    if (!existing.empty) {
      // Update quantity if item exists
      const existingDoc = existing.docs[0];
      const currentQty = existingDoc.data().quantity || 0;
      await setDoc(
        existingDoc.ref,
        { quantity: currentQty + quantity },
        { merge: true },
      );
    } else {
      // Add new item
      await setDoc(cartRef, {
        ...product,
        quantity,
      });
    }

    return this.getCartItems(userId);
  },

  async updateQuantity(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<CartItem[]> {
    if (quantity <= 0) {
      await this.removeFromCart(userId, productId);
    } else {
      const q = query(
        collection(db, "users", userId, "carts"),
        where("id", "==", productId),
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        await setDoc(snapshot.docs[0].ref, { quantity }, { merge: true });
      }
    }
    return this.getCartItems(userId);
  },

  async removeFromCart(userId: string, productId: string): Promise<CartItem[]> {
    const q = query(
      collection(db, "users", userId, "carts"),
      where("id", "==", productId),
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      await deleteDoc(snapshot.docs[0].ref);
    }
    return this.getCartItems(userId);
  },

  async clearCart(userId: string): Promise<void> {
    const snapshot = await getDocs(collection(db, "users", userId, "carts"));
    const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  },

  getSubtotal(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  applyPromoCode(code: string): {
    valid: boolean;
    discount: number;
    message: string;
  } {
    const PROMO_CODE = "NOVA20";
    const PROMO_DISCOUNT = 0.2;

    if (code.trim().toUpperCase() === PROMO_CODE) {
      return {
        valid: true,
        discount: PROMO_DISCOUNT,
        message: "20% discount applied!",
      };
    }
    return { valid: false, discount: 0, message: "Invalid promo code" };
  },
};
