// Simple seed script to populate Firestore with mock data
// Run with: node scripts/seedFirestore.js

const admin = require("firebase-admin");
const { v4: uuidv4 } = require("uuid");

// Initialize Firebase Admin
try {
  const serviceAccount = require("./serviceAccountKey.json");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://nova-b980c.firebaseio.com",
  });

  const db = admin.firestore();

  const products = [
    {
      id: "1",
      name: "Wireless Earbuds Pro MAX",
      price: 29.99,
      originalPrice: 59.99,
      discount: 50,
      rating: 4.5,
      reviews: 128,
      image:
        "https://images.unsplash.com/photo-1590658268037-6bf12f032f53?w=400",
      inStock: true,
      timeLeft: "2h 15m",
      category: "Electronics",
      brand: "Nova Tech",
      featured: true,
    },
    {
      id: "2",
      name: "Smart Watch Ultra Premium",
      price: 89.99,
      originalPrice: 149.99,
      discount: 40,
      rating: 4.8,
      reviews: 256,
      image: "https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=400",
      inStock: true,
      timeLeft: "5h 30m",
      category: "Electronics",
      brand: "Nova Tech",
      featured: true,
    },
    {
      id: "3",
      name: "Running Shoes Elite Pro",
      price: 79.99,
      rating: 4.7,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
      inStock: true,
      category: "Sports",
      brand: "Nova Sport",
      featured: true,
    },
    {
      id: "4",
      name: "Minimalist Backpack Deluxe",
      price: 45.99,
      originalPrice: 59.99,
      discount: 23,
      rating: 4.3,
      reviews: 67,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
      inStock: true,
      category: "Fashion",
      brand: "Nova Style",
    },
    {
      id: "5",
      name: "Premium Sunglasses Gold Edition",
      price: 129.99,
      rating: 4.9,
      reviews: 201,
      image:
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
      inStock: false,
      category: "Fashion",
      brand: "Nova Luxury",
    },
    {
      id: "6",
      name: "Smart Home Hub 2nd Gen",
      price: 99.99,
      originalPrice: 129.99,
      discount: 23,
      rating: 4.6,
      reviews: 145,
      image: "https://images.unsplash.com/photo-1558089687-f282ffcbc125?w=400",
      inStock: true,
      category: "Home",
      brand: "Nova Home",
    },
    {
      id: "7",
      name: "Ceramic Coffee Mug Set (4 pcs)",
      price: 14.99,
      rating: 4.4,
      image:
        "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400",
      inStock: true,
      category: "Home",
      brand: "Nova Home",
    },
    {
      id: "8",
      name: "Yoga Mat Premium Pro",
      price: 34.99,
      rating: 4.6,
      reviews: 78,
      image:
        "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400",
      inStock: true,
      category: "Sports",
      brand: "Nova Sport",
    },
    {
      id: "9",
      name: "Leather Wallet Classic",
      price: 49.99,
      originalPrice: 69.99,
      discount: 29,
      rating: 4.5,
      reviews: 112,
      image:
        "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400",
      inStock: true,
      category: "Fashion",
      brand: "Nova Luxury",
    },
    {
      id: "10",
      name: "Bluetooth Speaker X200",
      price: 49.99,
      originalPrice: 99.99,
      discount: 50,
      rating: 4.5,
      reviews: 156,
      image:
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
      inStock: true,
      category: "Electronics",
      brand: "Nova Tech",
    },
    {
      id: "11",
      name: "Laptop Stand Adjustable",
      price: 39.99,
      rating: 4.7,
      reviews: 92,
      image:
        "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400",
      inStock: true,
      category: "Electronics",
      brand: "Nova Tech",
    },
    {
      id: "12",
      name: "Phone Case Pro Max",
      price: 19.99,
      rating: 4.3,
      reviews: 234,
      image:
        "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400",
      inStock: true,
      category: "Electronics",
      brand: "Nova Tech",
    },
    {
      id: "13",
      name: "Desk Lamp LED Ultra",
      price: 34.99,
      originalPrice: 49.99,
      discount: 30,
      rating: 4.6,
      reviews: 78,
      image:
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400",
      inStock: true,
      category: "Home",
      brand: "Nova Home",
    },
    {
      id: "14",
      name: "Yoga Mat Elite",
      price: 29.99,
      originalPrice: 49.99,
      discount: 40,
      rating: 4.4,
      reviews: 167,
      image:
        "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400",
      inStock: true,
      category: "Sports",
      brand: "Nova Sport",
    },
    {
      id: "15",
      name: "Mechanical Keyboard RGB",
      price: 79.99,
      originalPrice: 99.99,
      discount: 20,
      rating: 4.8,
      reviews: 312,
      image:
        "https://images.unsplash.com/photo-1618384887188-788407cca96e?w=400",
      inStock: true,
      category: "Electronics",
      brand: "Nova Tech",
    },
    {
      id: "16",
      name: "Designer T-Shirt",
      price: 24.99,
      originalPrice: 39.99,
      discount: 38,
      rating: 4.2,
      reviews: 89,
      image:
        "https://images.unsplash.com/photo-1521577094892-106f420a65d1?w=400",
      inStock: true,
      category: "Fashion",
      brand: "Nova Style",
    },
    {
      id: "17",
      name: "Smart Fitness Band",
      price: 59.99,
      originalPrice: 99.99,
      discount: 40,
      rating: 4.5,
      reviews: 203,
      image:
        "https://images.unsplash.com/photo-1523275335683-8d69f4e7a36?w=400",
      inStock: true,
      category: "Electronics",
      brand: "Nova Tech",
    },
    {
      id: "18",
      name: "Organic Face Cream",
      price: 19.99,
      originalPrice: 34.99,
      discount: 43,
      rating: 4.7,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1556229295-5b1b2d423b5?w=400",
      inStock: true,
      category: "Beauty",
      brand: "Nova Beauty",
    },
    {
      id: "19",
      name: "Basketball Pro",
      price: 34.99,
      originalPrice: 49.99,
      discount: 30,
      rating: 4.6,
      reviews: 178,
      image: "https://images.unsplash.com/photo-1546519638-906aires-6cbe?w=400",
      inStock: true,
      category: "Sports",
      brand: "Nova Sport",
    },
    {
      id: "20",
      name: "Silk Pillow Case (2 pcs)",
      price: 29.99,
      originalPrice: 44.99,
      discount: 33,
      rating: 4.3,
      reviews: 98,
      image:
        "https://images.unsplash.com/photo-1522773508752-95d71dbe31f7?w=400",
      inStock: true,
      category: "Home",
      brand: "Nova Home",
    },
  ];

  const categories = [
    {
      id: "1",
      name: "Electronics",
      icon: "📱",
      color: "#9333ea",
      subcategories: [
        "Phones",
        "Laptops",
        "Tablets",
        "Accessories",
        "Wearables",
      ],
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
      subcategories: [
        "Fiction",
        "Non-Fiction",
        "Academic",
        "Children",
        "Comics",
      ],
    },
  ];

  const reviews = [
    {
      id: "1",
      productId: "1",
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
      productId: "1",
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
      productId: "1",
      user: "Emily R.",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
      rating: 5,
      date: "2 weeks ago",
      comment: "Best purchase I made this year. Highly recommend!",
    },
  ];

  // Sample addresses for testing (use a test user ID)
  const testUserId = "test-user-123"; // Replace with real user ID after creating account

  const addresses = [
    {
      id: "addr1",
      name: "Home",
      street: "123 Main Street, Apt 4B",
      city: "New York, NY 10001",
      zip: "10001",
      phone: "+1 234 567 8900",
      isDefault: true,
    },
    {
      id: "addr2",
      name: "Office",
      street: "456 Business Ave, Floor 12",
      city: "New York, NY 10002",
      phone: "+1 234 567 8901",
      isDefault: false,
    },
  ];

  async function seedFirestore() {
    try {
      console.log("Starting Firestore seed...");

      // Seed products
      console.log("Seeding products...");
      for (const product of products) {
        await db.collection("products").doc(product.id).set(product);
      }
      console.log("Seeded " + products.length + " products");

      // Seed categories
      console.log("Seeding categories...");
      for (const category of categories) {
        await db.collection("categories").doc(category.id).set(category);
      }
      console.log("Seeded " + categories.length + " categories");

      // Seed reviews
      console.log("Seeding product reviews...");
      for (const review of reviews) {
        await db
          .collection("products")
          .doc(review.productId)
          .collection("reviews")
          .doc(review.id)
          .set(review);
      }
      console.log("Seeded " + reviews.length + " reviews");

      // Seed sample addresses
      console.log("Seeding sample addresses...");
      for (const addr of addresses) {
        await db
          .collection("users")
          .doc(testUserId)
          .collection("addresses")
          .doc(addr.id)
          .set(addr);
      }
      console.log("Seeded " + addresses.length + " addresses");

      console.log("✅ Firestore seed completed successfully!");
      console.log(
        "\n⚠️  Note: Replace 'test-user-123' with a real user ID for testing",
      );
      process.exit(0);
    } catch (error) {
      console.error("❌ Error seeding Firestore:", error);
      process.exit(1);
    }
  }

  seedFirestore();
} catch (error) {
  console.error("❌ Error loading service account key:", error.message);
  console.log("\nTo use this script:");
  console.log(
    "1. Go to Firebase Console > Project Settings > Service Accounts",
  );
  console.log('2. Click "Generate New Private Key" and download the JSON file');
  console.log('3. Save it as "serviceAccountKey.json" in the scripts folder');
  console.log("4. Run: node scripts/seedFirestore.js\n");
  process.exit(1);
}
