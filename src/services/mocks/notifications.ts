import { Notification } from '@/types';

export const mockNotifications: Notification[] = [
  {
    id: 1,
    type: 'order',
    title: 'Order Confirmed',
    message: 'Your order ORD-2024-002 has been confirmed and is being processed.',
    time: '2 hours ago',
    read: false,
  },
  {
    id: 2,
    type: 'offer',
    title: 'Flash Sale Alert!',
    message: '50% off on Wireless Earbuds Pro. Hurry, limited stock!',
    time: '5 hours ago',
    read: false,
    productId: 1,
  },
  {
    id: 3,
    type: 'delivery',
    title: 'Out for Delivery',
    message: 'Your order ORD-2024-001 is out for delivery. Expected by 6 PM.',
    time: '1 day ago',
    read: true,
  },
  {
    id: 4,
    type: 'price_drop',
    title: 'Price Drop Alert',
    message: 'Smart Watch Ultra is now $89.99 (was $149.99). Add to cart now!',
    time: '2 days ago',
    read: true,
    productId: 2,
  },
  {
    id: 5,
    type: 'success',
    title: 'Review Posted',
    message: 'Thank you! Your review for Wireless Earbuds Pro has been published.',
    time: '3 days ago',
    read: true,
  },
  {
    id: 6,
    type: 'order',
    title: 'Order Delivered',
    message: 'Your order ORD-2024-001 has been delivered. Rate your experience!',
    time: '4 days ago',
    read: true,
  },
];
