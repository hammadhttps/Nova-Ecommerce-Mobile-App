export interface Product {
  id: number;
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
}

export interface Category {
  id: number;
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
  id: number;
  name: string;
  street: string;
  city: string;
  phone: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: number;
  type: 'visa' | 'mastercard' | 'amex';
  number: string;
  expiry: string;
  name: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  date: string;
  status: 'delivered' | 'in_transit' | 'processing' | 'cancelled';
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    image: string;
    price: number;
  }>;
  address?: Address;
  paymentMethod?: PaymentMethod;
}

export interface Notification {
  id: number;
  type: 'order' | 'offer' | 'success' | 'price_drop' | 'delivery';
  title: string;
  message: string;
  time: string;
  read: boolean;
  productId?: number;
}

export interface Review {
  id: number;
  user: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}
