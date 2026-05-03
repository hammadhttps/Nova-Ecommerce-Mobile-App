import { Product, Category, Review } from "@/types";

export const flashSaleProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Earbuds Pro",
    price: 29.99,
    originalPrice: 59.99,
    discount: 50,
    rating: 4.5,
    reviews: 128,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12f032f53?w=400",
    inStock: true,
    timeLeft: "2h 15m",
    category: "Electronics",
  },
  {
    id: "2",
    name: "Smart Watch Ultra",
    price: 89.99,
    originalPrice: 149.99,
    discount: 40,
    rating: 4.8,
    reviews: 256,
    image: "https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=400",
    inStock: true,
    timeLeft: "5h 30m",
    category: "Electronics",
  },
];

export const categories: Category[] = [
  {
    id: "1",
    name: "Electronics",
    icon: "📱",
    color: "#9333ea",
    subcategories: ["Phones", "Laptops", "Tablets", "Accessories", "Wearables"],
  },
  {
    id: "2",
    name: "Fashion",
    icon: "👕",
    color: "#ec4899",
    subcategories: ["Men", "Women", "Kids", "Shoes", "Accessories"],
  },
  {
    id: "3",
    name: "Home",
    icon: "🏠",
    color: "#3b82f6",
    subcategories: ["Furniture", "Decor", "Kitchen", "Bedding", "Lighting"],
  },
  {
    id: "4",
    name: "Beauty",
    icon: "💄",
    color: "#f43f5e",
    subcategories: ["Skincare", "Makeup", "Haircare", "Fragrance", "Tools"],
  },
  {
    id: "5",
    name: "Sports",
    icon: "⚽",
    color: "#10b981",
    subcategories: [
      "Equipment",
      "Clothing",
      "Shoes",
      "Supplements",
      "Accessories",
    ],
  },
  {
    id: "6",
    name: "Books",
    icon: "📚",
    color: "#f59e0b",
    subcategories: ["Fiction", "Non-Fiction", "Academic", "Children", "Comics"],
  },
];

export const forYouProducts: Product[] = [
  {
    id: "3",
    name: "Running Shoes Elite",
    price: 79.99,
    rating: 4.7,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    inStock: true,
    category: "Sports",
  },
  {
    id: "4",
    name: "Minimalist Backpack",
    price: 45.99,
    originalPrice: 59.99,
    discount: 23,
    rating: 4.3,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
    inStock: true,
    category: "Fashion",
  },
  {
    id: "5",
    name: "Premium Sunglasses",
    price: 129.99,
    rating: 4.9,
    reviews: 201,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
    inStock: false,
    category: "Fashion",
  },
  {
    id: "6",
    name: "Smart Home Hub",
    price: 99.99,
    originalPrice: 129.99,
    discount: 23,
    rating: 4.6,
    reviews: 145,
    image: "https://images.unsplash.com/photo-1558089687-f282ffcbc125?w=400",
    inStock: true,
    category: "Home",
  },
];

export const recentProducts: Product[] = [
  {
    id: "7",
    name: "Ceramic Coffee Mug",
    price: 14.99,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400",
    inStock: true,
    category: "Home",
  },
  {
    id: "8",
    name: "Yoga Mat Premium",
    price: 34.99,
    rating: 4.6,
    reviews: 78,
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400",
    inStock: true,
    category: "Sports",
  },
  {
    id: "9",
    name: "Leather Wallet",
    price: 49.99,
    originalPrice: 69.99,
    discount: 29,
    rating: 4.5,
    reviews: 112,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400",
    inStock: true,
    category: "Fashion",
  },
];

export const productDetailImages: string[] = [
  "https://images.unsplash.com/photo-1590658268037-6bf12f032f53?w=800",
  "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800",
  "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800",
];

export const productReviews: Review[] = [
  {
    id: "1",
    user: "Sarah M.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    rating: 5,
    date: "2 days ago",
    comment:
      "Absolutely love these earbuds! Sound quality is amazing and battery life is incredible.",
  },
  {
    id: "2",
    user: "James K.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    rating: 4,
    date: "1 week ago",
    comment:
      "Great value for money. Comfortable fit and good noise cancellation.",
  },
  {
    id: "3",
    user: "Emily R.",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    rating: 5,
    date: "2 weeks ago",
    comment: "Best purchase I made this year. Highly recommend!",
  },
];

export const allProducts: Product[] = [
  ...flashSaleProducts,
  ...forYouProducts,
  ...recentProducts,
];

export const getProductById = (id: string): Product | undefined =>
  allProducts.find((p) => p.id === id);
