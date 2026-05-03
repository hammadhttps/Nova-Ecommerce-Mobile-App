# Nova E-Commerce Mobile App

A fully-featured e-commerce mobile application built with React Native (Expo) and TypeScript. Supports both buying and selling products with a modern, intuitive interface.

## Features

- **Authentication Flow**: Splash → Onboarding → Login/Signup → Main App
- **Product Browsing**: Flash sales, categories, recommendations, search with trending categories
- **Shopping Cart**: Add/remove items, quantity controls, promo codes (NOVA20), saved for later
- **Wishlist**: Save products, stock status tracking, price drops, back in stock alerts
- **Checkout**: 3-step flow (Address → Payment → Review)
- **Order Management**: Order history with status filtering, detailed order tracking
- **Product Comparison**: Compare up to 3 products side by side
- **Sell Products**: List products for sale with image picker and Cloudinary upload
- **My Products**: View, edit, and delete your own listed products from your profile
- **Edit Products**: Reuse the sell form with pre-filled data for editing
- **Delete Products**: Remove your products with confirmation (from My Products or Product Detail)
- **Profile Photo Upload**: Tap your avatar to upload a profile photo via Cloudinary
- **Related Products**: Horizontal scroll of same-category products on product detail pages
- **Self-Buy Prevention**: You cannot purchase your own products (buttons disabled)
- **Dark Mode**: Full dark mode support with persistence
- **Push & Local Notifications**: Expo push token registration, local scheduled notifications (random sales, order confirmations, promotional alerts), foreground notification banners
- **Notifications Screen**: Firestore-backed notification center with read/unread tracking
- **Address & Payment Management**: CRUD operations for addresses and payment methods
- **Home Feed**: Personalized feeds (For You, Flash Sale, Recent, Listings)
- **Announcement Ticker**: Auto-scrolling marquee on the homepage showing rotating promotional messages
- **Help & Support**: In-app help screen
- **Performance Optimizations**: `React.memo` on ProductCard, `useCallback` on FlatList renderItems, `windowSize`/`maxToRenderPerBatch` tuning for smooth scrolling

## Tech Stack

| Layer            | Technology                                                                   |
| ---------------- | ---------------------------------------------------------------------------- |
| Framework        | React Native (Expo SDK 54)                                                   |
| Language         | TypeScript                                                                   |
| Navigation       | React Navigation v6 (Stack + Bottom Tabs + Material Top Tabs)                |
| State Management | Zustand                                                                      |
| Styling          | StyleSheet + React Native SVG                                                |
| Storage          | AsyncStorage                                                                 |
| Icons            | Lucide React Native                                                          |
| Animations       | React Native Reanimated + Gesture Handler                                    |
| Toast            | React Native Toast Message                                                   |
| Backend          | Firebase (Auth, Firestore)                                                   |
| Image Hosting    | Cloudinary (product images, profile photos)                                  |
| HTTP Client      | Axios                                                                        |
| Image            | Expo Image + Expo Image Picker                                               |
| Other            | React Native Confetti Cannon, React Native Tab View, React Native Pager View |

## Project Structure

```
src/
├── types/                    # TypeScript interfaces
│   └── index.ts
├── services/                 # API/data layer (Firebase integrated)
│   ├── mocks/               # Mock data files (products, users, orders, etc.)
│   ├── auth.service.ts
│   ├── product.service.ts
│   ├── cart.service.ts
│   ├── wishlist.service.ts
│   ├── order.service.ts
│   ├── address.service.ts
│   ├── payment.service.ts
│   ├── expoNotificationService.ts # Push notification registration, handlers, local scheduling
│   └── notification.service.ts
├── store/                    # Zustand stores
│   ├── auth.store.ts
│   ├── cart.store.ts
│   ├── wishlist.store.ts
│   ├── theme.store.ts
│   └── comparison.store.ts
├── hooks/                    # Custom hooks
│   ├── useTheme.ts
│   ├── useCart.ts
│   ├── useWishlist.ts
│   └── useComparison.ts
├── utils/                    # Utilities
│   ├── constants.ts
│   ├── formatters.ts
│   ├── validators.ts
│   └── delay.ts
├── components/
│   ├── common/              # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   ├── Avatar.tsx
│   │   ├── Card.tsx
│   │   ├── Skeleton.tsx
│   │   ├── EmptyState.tsx
│   │   ├── LoadingScreen.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── index.ts
│   ├── layout/
│   │   └── SafeScreen.tsx
│   ├── AnnouncementTicker.tsx # Auto-scrolling promotional marquee
│   └── ProductCard.tsx      # Product card with wishlist/comparison
├── navigation/
│   ├── RootNavigator.tsx    # Root stack with all screens
│   ├── AuthStack.tsx        # Auth flow (splash, onboarding, login, signup)
│   ├── MainTabs.tsx         # Bottom tabs with swipe support
│   ├── TopTabsNavigator.tsx # Material top tabs
│   ├── MainSwipeTabBar.tsx  # Custom swipe tab bar
│   ├── TabViewPager.tsx     # Tab view pager
│   └── types.ts             # Navigation types
├── features/                 # Feature-specific screens
│   ├── auth/                # Login, Signup
│   ├── onboarding/          # Splash, Onboarding
│   ├── home/                # Home screen with FlashSale, ForYou, Recent
│   ├── home-tabs/           # HomeFeed, Listings
│   ├── categories/          # Categories screen
│   ├── wishlist/            # WishlistItems, PriceDrops, BackInStock tabs
│   ├── cart/                # InCart, SavedForLater tabs
│   ├── profile/             # Overview (with photo upload), Orders, Settings tabs
│   ├── product/             # Product detail (related products, edit/delete for owners)
│   ├── search/              # RecentSearch, Trending, Categories tabs
│   ├── checkout/            # Checkout flow
│   ├── orders/              # Order history & detail
│   ├── address/             # Address management
│   ├── payments/            # Payment methods
│   ├── notifications/       # Notification center
│   ├── help/                # Help screen
│   ├── settings/            # Settings screen
│   └── sell/                # Sell product screen + MyProductsScreen
├── Firebaseconfig.ts         # Firebase configuration
└── App.tsx                   # Entry point
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo Go app (for testing on device) or Android Studio / Xcode

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npx expo start

# Run on specific platform
npm run android    # Android
npm run ios        # iOS
npm run web        # Web (limited support)
npm run typecheck  # TypeScript check
npm run check      # Alias for typecheck

# Seed Firestore with sample data
node scripts/seedFirestore.js
```

### Testing on Device

1. Install **Expo Go** on your phone (iOS App Store / Google Play)
2. Run `npx expo start`
3. Scan the QR code with Expo Go (Android) or camera (iOS)

## Notifications System

The app uses `expo-notifications` for both local and remote (push) notifications.

### What works in Expo Go

- **Local notifications** — scheduled immediately (random sales, order confirmations, promotional alerts)
- **Foreground notification banners** — notifications show as in-app banners while the app is open
- **Firestore notification docs** — notifications are persisted to `users/{uid}/notifications/` in Firestore
- **Notifications Screen** — reads from Firestore with pull-to-refresh

### What requires a development build

- **Remote push notifications** (ExpoPushToken) — generating a push token and receiving server-sent push notifications

> **⚠️ Expo Go limitation**: Since Expo SDK 53, `expo-notifications` remote push functionality was removed from Expo Go. Local notifications work fine, but for full push notification support you need a **development build**:
>
> ```bash
> # Android (requires Android Studio)
> npx expo run:android
>
> # or using EAS Build
> npx eas build --profile development --platform android
> ```

### Notification triggers in the app

| Trigger                 | Type                  | Timing                                   |
| ----------------------- | --------------------- | ---------------------------------------- |
| App launch              | Local + Firestore doc | 3s (sale) / 5s (promo doc) / 15s (promo) |
| Order placed            | Local + Firestore doc | Immediately after successful order       |
| Announcement Ticker     | UI marquee            | Continuous scroll on HomeScreen          |
| Push token registration | Firestore save        | On app launch (dev build only)           |

## Architecture Highlights

### Service Layer Pattern

All data access is isolated in `src/services/`. The app uses **Firebase Firestore** for all data (products, users, orders, cart, wishlist, etc.) and **Cloudinary** for image hosting.

```typescript
// Products are fetched live from Firestore
export const productService = {
  async getForYouProducts(): Promise<Product[]> {
    const q = query(collection(db, "products"), orderBy("rating", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) => ({ ...doc.data(), id: doc.id }) as Product,
    );
  },
};
```

### State Management

- **Zustand stores** for global state (cart, wishlist, auth, theme, comparison)
- **AsyncStorage** for persistence (auth token, user, theme preference)
- **No business logic in UI components** — all logic in stores/services

### Navigation Structure

```
RootNavigator (Stack)
├── Auth (Stack)
│   ├── Splash
│   ├── Onboarding
│   ├── Login
│   ├── Signup
│   └── Main (Bottom Tabs with swipe)
│       ├── Home (Top Tabs: Home, Listings)
│       ├── Search (Tabs: Recent, Trending, Categories)
│       ├── Wishlist (Tabs: Wishlist Items, Price Drops, Back in Stock)
│       ├── Cart (Tabs: In Cart, Saved for Later)
│       └── Profile (Tabs: Overview, Orders, Settings)
├── ProductDetail (Related Products, Edit/Delete for owners)
├── SearchResults (Tabs: Recent, Trending, Categories)
├── SellProduct (also used for editing via productId param)
├── MyProducts (view/manage your listed products)
├── Checkout
├── OrderHistory
├── OrderDetail
├── AddressManagement
├── PaymentMethods
├── Notifications
├── Help
└── Settings
```

## Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication and Firestore Database
3. Add your config to `Firebaseconfig.ts`
4. Run the seed script to populate Firestore:
   ```bash
   node src/scripts/seedFirestore.js
   ```

## Promo Code

Use **NOVA20** at checkout for a 20% discount.

## Quick Health Check

Run this before starting feature work:

```bash
npm install
npm run typecheck
```

## Cloudinary Setup

Product images and profile photos are uploaded to Cloudinary. The configuration is already in the code:

| Setting       | Value          |
| ------------- | -------------- |
| Cloud Name    | `dkyjvyz1m`    |
| Upload Preset | `nova_uploads` |

To use your own Cloudinary account:

1. Create a Cloudinary account at [cloudinary.com](https://cloudinary.com)
2. Create an unsigned upload preset named `nova_uploads`
3. Update the cloud name and preset in:
   - `src/services/product.service.ts` (search for `api.cloudinary.com`)
   - `src/services/auth.service.ts` (search for `api.cloudinary.com`)

## Future Enhancements

- [x] Firebase Config integrated
- [x] Firestore for real-time data
- [x] Cloudinary image uploads (products + profile photos)
- [x] Product image upload with image picker
- [x] Profile photo upload
- [x] Edit & delete own products
- [x] Related products on product detail
- [x] Prevent self-purchase
- [x] Performance optimizations (React.memo, useCallback, FlatList tuning)
- [x] Push & local notifications (expo-notifications)
- [ ] Payment gateway (Stripe/Razorpay)
- [ ] Image caching optimization
- [ ] Offline support
- [ ] Deep linking
- [ ] Biometric authentication

## License

Private - All rights reserved
