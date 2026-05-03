import { Product, Category, Review } from "@/types";
import { db, storage } from "../../Firebaseconfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const productService = {
  async getFlashSaleProducts(): Promise<Product[]> {
    const q = query(
      collection(db, "products"),
      where("discount", ">", 0),
      orderBy("discount", "desc"),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) => ({ ...doc.data(), id: doc.id }) as Product,
    );
  },

  async getForYouProducts(): Promise<Product[]> {
    const q = query(collection(db, "products"), orderBy("rating", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) => ({ ...doc.data(), id: doc.id }) as Product,
    );
  },

  async getRecentProducts(): Promise<Product[]> {
    const snapshot = await getDocs(collection(db, "products"));
    const products = snapshot.docs.map(
      (doc) => ({ ...doc.data(), id: doc.id }) as Product,
    );
    return products.slice(-3).reverse();
  },

  async getAllProducts(): Promise<Product[]> {
    const snapshot = await getDocs(collection(db, "products"));
    return snapshot.docs.map(
      (doc) => ({ ...doc.data(), id: doc.id }) as Product,
    );
  },

  async getProductById(id: string): Promise<Product | null> {
    const docSnap = await getDoc(doc(db, "products", id));
    if (docSnap.exists()) {
      return { ...docSnap.data(), id: docSnap.id } as Product;
    }
    return null;
  },

  async getProductImages(productId: string): Promise<string[]> {
    const product = await this.getProductById(productId);
    return product?.images || [];
  },

  async getProductReviews(productId: string): Promise<Review[]> {
    const snapshot = await getDocs(
      collection(db, "products", productId, "reviews"),
    );
    return snapshot.docs.map(
      (doc) => ({ ...doc.data(), id: doc.id }) as Review,
    );
  },

  async getCategories(): Promise<Category[]> {
    const snapshot = await getDocs(collection(db, "categories"));
    return snapshot.docs.map(
      (doc) => ({ ...doc.data(), id: doc.id }) as Category,
    );
  },

  async searchProducts(query: string): Promise<Product[]> {
    if (!query.trim()) return [];
    const snapshot = await getDocs(collection(db, "products"));
    const products = snapshot.docs.map(
      (doc) => ({ ...doc.data(), id: doc.id }) as Product,
    );
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category?.toLowerCase().includes(query.toLowerCase()),
    );
  },

  async createProduct(product: Omit<Product, "id">): Promise<Product> {
    const newId = Date.now().toString();
    const newProduct = { ...product, id: newId };
    await setDoc(doc(db, "products", newId), newProduct);
    return newProduct;
  },

  async uploadProductImage(
    productId: string,
    imageUri: string,
  ): Promise<string> {
    // Convert image URI to blob
    const response = await fetch(imageUri);
    const blob = await response.blob();

    // Upload to Firebase Storage
    const storageRef = ref(storage, `products/${productId}/${Date.now()}`);
    await uploadBytes(storageRef, blob);

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  },

  async addReview(
    productId: string,
    review: Omit<Review, "id">,
  ): Promise<Review> {
    const newId = Date.now().toString();
    const newReview = { ...review, id: newId };
    await setDoc(doc(db, "products", productId, "reviews", newId), newReview);
    return newReview;
  },
};
