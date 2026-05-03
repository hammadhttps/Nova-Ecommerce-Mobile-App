export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviews?: number;
  image: string;
  images?: string[];
  inStock?: boolean;
  timeLeft?: string;
  specs?: Record<string, string>;
  description?: string;
  category?: string;
  sellerId?: string;
  stock?: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  subcategories: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface WishlistItem extends Product {
  inStock: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
}

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  phone: string;
  zip?: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  type: "visa" | "mastercard" | "amex";
  number: string;
  expiry: string;
  name: string;
  last4?: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  date: string;
  status: "delivered" | "in_transit" | "processing" | "cancelled";
  total: number;
  subtotal?: number;
  shipping?: number;
  items: Array<{
    name: string;
    quantity: number;
    image: string;
    price: number;
    productId?: string;
  }>;
  address?: Address;
  paymentMethod?: PaymentMethod;
}

export interface Notification {
  id: string;
  type: "order" | "offer" | "success" | "price_drop" | "delivery";
  title: string;
  message: string;
  time: string;
  read: boolean;
  productId?: string;
}

export interface Review {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  userId?: string;
}
