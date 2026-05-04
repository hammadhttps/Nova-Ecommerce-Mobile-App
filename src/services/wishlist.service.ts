import { WishlistItem, Product } from "@/types";
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

export const wishlistService = {
  async getWishlistItems(userId: string): Promise<WishlistItem[]> {
    const q = query(collection(db, "users", userId, "wishlists"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) => ({ ...doc.data(), id: doc.id }) as WishlistItem,
    );
  },

  async addToWishlist(
    userId: string,
    product: Product,
  ): Promise<WishlistItem[]> {
    const q = query(
      collection(db, "users", userId, "wishlists"),
      where("id", "==", product.id),
    );
    const existing = await getDocs(q);

    if (existing.empty) {
      await setDoc(doc(db, "users", userId, "wishlists", product.id), {
        ...product,
        inStock: product.inStock ?? true,
      });
    }

    return this.getWishlistItems(userId);
  },

  async removeFromWishlist(
    userId: string,
    productId: string,
  ): Promise<WishlistItem[]> {
    const q = query(
      collection(db, "users", userId, "wishlists"),
      where("id", "==", productId),
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      await deleteDoc(snapshot.docs[0].ref);
    }
    return this.getWishlistItems(userId);
  },

  async isInWishlist(userId: string, productId: string): Promise<boolean> {
    const q = query(
      collection(db, "users", userId, "wishlists"),
      where("id", "==", productId),
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  },

  async clearWishlist(userId: string): Promise<void> {
    const snapshot = await getDocs(
      collection(db, "users", userId, "wishlists"),
    );
    const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  },
};
