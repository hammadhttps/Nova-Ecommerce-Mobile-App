import { Order } from '@/types';

export const mockOrders: Order[] = [
  {
    id: 'ORD-2024-001',
    date: '2024-03-15',
    status: 'delivered',
    total: 109.98,
    items: [
      { name: 'Wireless Earbuds Pro', quantity: 2, image: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f53?w=400', price: 29.99 },
      { name: 'Ceramic Coffee Mug', quantity: 1, image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400', price: 14.99 },
    ],
  },
  {
    id: 'ORD-2024-002',
    date: '2024-03-20',
    status: 'in_transit',
    total: 79.99,
    items: [
      { name: 'Running Shoes Elite', quantity: 1, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', price: 79.99 },
    ],
  },
  {
    id: 'ORD-2024-003',
    date: '2024-03-25',
    status: 'processing',
    total: 175.98,
    items: [
      { name: 'Smart Watch Ultra', quantity: 1, image: 'https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=400', price: 89.99 },
      { name: 'Minimalist Backpack', quantity: 1, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', price: 45.99 },
    ],
  },
  {
    id: 'ORD-2024-004',
    date: '2024-03-10',
    status: 'cancelled',
    total: 129.99,
    items: [
      { name: 'Premium Sunglasses', quantity: 1, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400', price: 129.99 },
    ],
  },
];

export const mockOrderDetail: Order = {
  id: 'ORD-2024-002',
  date: '2024-03-20',
  status: 'in_transit',
  total: 104.98,
  items: [
    { name: 'Running Shoes Elite', quantity: 1, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', price: 79.99 },
    { name: 'Yoga Mat Premium', quantity: 1, image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400', price: 34.99 },
  ],
};
