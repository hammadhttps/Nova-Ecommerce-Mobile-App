import { Notification } from '@/types';
import { mockNotifications } from '@/services/mocks/notifications';
import { delay } from '@/utils/delay';

let notificationsState: Notification[] = [...mockNotifications];

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    await delay(300);
    return notificationsState;
  },

  async markAsRead(id: number): Promise<Notification[]> {
    await delay(200);
    notificationsState = notificationsState.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    return notificationsState;
  },

  async markAllAsRead(): Promise<Notification[]> {
    await delay(300);
    notificationsState = notificationsState.map((n) => ({ ...n, read: true }));
    return notificationsState;
  },

  async deleteNotification(id: number): Promise<Notification[]> {
    await delay(200);
    notificationsState = notificationsState.filter((n) => n.id !== id);
    return notificationsState;
  },

  getUnreadCount(): number {
    return notificationsState.filter((n) => !n.read).length;
  },
};
