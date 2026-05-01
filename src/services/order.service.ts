import { Order, CartItem, Address, PaymentMethod } from '@/types';
import { mockOrders, mockOrderDetail } from '@/services/mocks/orders';

let ordersState: Order[] = [...mockOrders];

export interface CheckoutData {
  items: CartItem[];
  address: Address;
  paymentMethod: PaymentMethod;
  promoCode?: string;
}

export const orderService = {
  async getOrders(): Promise<Order[]> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return ordersState;
  },

  async getOrderById(id: string): Promise<Order | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return ordersState.find((o) => o.id === id) || null;
  },

  async createOrder(checkoutData: CheckoutData): Promise<Order> {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const subtotal = checkoutData.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const discount = checkoutData.promoCode === 'NOVA20' ? subtotal * 0.2 : 0;
    const shipping = subtotal > 50 ? 0 : 4.99;
    const total = subtotal - discount + shipping;

    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'processing',
      total,
      items: checkoutData.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        image: item.image,
        price: item.price,
      })),
      address: checkoutData.address,
      paymentMethod: checkoutData.paymentMethod,
    };

    ordersState = [newOrder, ...ordersState];
    return newOrder;
  },

  async getOrdersByStatus(status: Order['status'] | 'all'): Promise<Order[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (status === 'all') return ordersState;
    return ordersState.filter((o) => o.status === status);
  },

  getMockOrderDetail(): Order {
    return mockOrderDetail;
  },
};
