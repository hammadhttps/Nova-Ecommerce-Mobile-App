import { Order, CartItem, Address, PaymentMethod } from "@/types";
import { db } from "../../Firebaseconfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { productService } from "./product.service";

export interface CheckoutData {
  items: CartItem[];
  address: Address;
  paymentMethod: PaymentMethod;
  promoCode?: string;
}

export const orderService = {
  async getOrders(userId: string): Promise<Order[]> {
    const q = query(
      collection(db, "users", userId, "orders"),
      orderBy("date", "desc"),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as Order);
  },

  async getOrderById(userId: string, orderId: string): Promise<Order | null> {
    const docSnap = await getDoc(doc(db, "users", userId, "orders", orderId));
    if (docSnap.exists()) {
      return { ...docSnap.data(), id: docSnap.id } as Order;
    }
    return null;
  },

  async createOrder(
    userId: string,
    checkoutData: CheckoutData,
  ): Promise<Order> {
    const subtotal = checkoutData.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const discount = checkoutData.promoCode === "NOVA20" ? subtotal * 0.2 : 0;
    const shipping = subtotal > 50 ? 0 : 4.99;
    const total = subtotal - discount + shipping;

    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      status: "processing",
      total,
      subtotal,
      shipping,
      items: checkoutData.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        image: item.image,
        price: item.price,
        productId: item.id,
      })),
      address: checkoutData.address,
      paymentMethod: checkoutData.paymentMethod,
    };

    await setDoc(doc(db, "users", userId, "orders", newOrder.id), newOrder);

    await this.createOrderNotifications(userId, newOrder);

    return newOrder;
  },

  async createOrderNotifications(userId: string, order: Order): Promise<void> {
    for (const item of order.items) {
      if (!item.productId) continue;

      const product = await productService.getProductById(item.productId);
      if (product?.sellerId && product.sellerId !== userId) {
        const notification = {
          type: "order",
          title: "New Order Received!",
          message: `You have a new order for: ${item.name}`,
          time: new Date().toISOString(),
          read: false,
          productId: item.productId,
        };

        const notificationId = `NOTIF-${Date.now()}-${product.sellerId}`;
        await setDoc(
          doc(db, "users", product.sellerId, "notifications", notificationId),
          notification,
        );
      }
    }
  },

  async getOrdersByStatus(
    userId: string,
    status: Order["status"] | "all",
  ): Promise<Order[]> {
    if (status === "all") {
      return this.getOrders(userId);
    }

    const q = query(
      collection(db, "users", userId, "orders"),
      where("status", "==", status),
      orderBy("date", "desc"),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as Order);
  },
};
