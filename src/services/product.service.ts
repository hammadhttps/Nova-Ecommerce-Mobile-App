import { Product, Category, Review } from "@/types";
import { db } from "../../Firebaseconfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";

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

  async getProductsByCategory(category: string): Promise<Product[]> {
    const q = query(
      collection(db, "products"),
      where("category", "==", category),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) => ({ ...doc.data(), id: doc.id }) as Product,
    );
  },

  async getUserProducts(userId: string): Promise<Product[]> {
    const q = query(
      collection(db, "products"),
      where("sellerId", "==", userId),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) => ({ ...doc.data(), id: doc.id }) as Product,
    );
  },

  async getTrendingProducts(): Promise<Product[]> {
    const q = query(collection(db, "products"), where("trending", "==", true));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) => ({ ...doc.data(), id: doc.id }) as Product,
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

  async updateProduct(
    id: string,
    updates: Partial<Omit<Product, "id">>,
  ): Promise<void> {
    await updateDoc(doc(db, "products", id), updates);
  },

  async deleteProduct(id: string): Promise<void> {
    await deleteDoc(doc(db, "products", id));
  },

  async uploadProductImage(
    _productId: string,
    imageUri: string,
  ): Promise<string> {
    const data = new FormData();
    data.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: "upload.jpg",
    } as any);
    data.append("upload_preset", "nova_uploads");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dkyjvyz1m/image/upload",
      { method: "POST", body: data },
    );
    const json = await res.json();
    return json.secure_url;
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
