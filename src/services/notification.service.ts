import { Notification } from "@/types";
import { db } from "../../Firebaseconfig";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { mockNotifications } from "@/services/mocks/notifications";
import { delay } from "@/utils/delay";

let notificationsState: Notification[] = [...mockNotifications];

function notifToNotification(doc: {
  id: string;
  data: () => Record<string, unknown>;
}): Notification {
  return { id: doc.id, ...doc.data() } as unknown as Notification;
}

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    await delay(300);
    return notificationsState;
  },

  async markAsRead(id: string): Promise<Notification[]> {
    await delay(200);
    notificationsState = notificationsState.map((n) =>
      n.id === id ? { ...n, read: true } : n,
    );
    return notificationsState;
  },

  async markAllAsRead(): Promise<Notification[]> {
    await delay(300);
    notificationsState = notificationsState.map((n) => ({ ...n, read: true }));
    return notificationsState;
  },

  async deleteNotification(id: string): Promise<Notification[]> {
    await delay(200);
    notificationsState = notificationsState.filter((n) => n.id !== id);
    return notificationsState;
  },

  getUnreadCount(): number {
    return notificationsState.filter((n) => !n.read).length;
  },

  async getFirestoreNotifications(userId: string): Promise<Notification[]> {
    const q = query(
      collection(db, "users", userId, "notifications"),
      orderBy("time", "desc"),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(notifToNotification);
  },

  async createNotification(
    userId: string,
    notification: Omit<Notification, "id">,
  ): Promise<string> {
    const id = `NOTIF-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    await setDoc(doc(db, "users", userId, "notifications", id), {
      ...notification,
      id,
    });
    return id;
  },

  async markAsReadInFirestore(
    userId: string,
    notificationId: string,
  ): Promise<void> {
    await updateDoc(doc(db, "users", userId, "notifications", notificationId), {
      read: true,
    });
  },

  async markAllAsReadInFirestore(userId: string): Promise<void> {
    const q = query(
      collection(db, "users", userId, "notifications"),
      where("read", "==", false),
    );
    const snapshot = await getDocs(q);
    await Promise.all(
      snapshot.docs.map((d) => updateDoc(d.ref, { read: true })),
    );
  },

  async deleteNotificationInFirestore(
    userId: string,
    notificationId: string,
  ): Promise<void> {
    await deleteDoc(doc(db, "users", userId, "notifications", notificationId));
  },
};
