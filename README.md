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
- **Sell Products**: List products for sale with image picker and product details
- **Dark Mode**: Full dark mode support with persistence
- **Notifications**: Read/unread notification center
- **Address & Payment Management**: CRUD operations for addresses and payment methods
- **Home Feed**: Personalized feeds (For You, Flash Sale, Recent, Listings, Profile tabs)
- **Help & Support**: In-app help screen

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
| Backend          | Firebase (Auth, Firestore ready)                                             |
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
│   ├── home-tabs/           # HomeFeed, Listings, HomeProfileTab
│   ├── categories/          # Categories screen
│   ├── wishlist/            # WishlistItems, PriceDrops, BackInStock tabs
│   ├── cart/                # InCart, SavedForLater tabs
│   ├── profile/             # Overview, Orders, Settings tabs
│   ├── product/             # Product detail
│   ├── search/              # RecentSearch, Trending, Categories tabs
│   ├── checkout/            # Checkout flow
│   ├── orders/              # Order history & detail
│   ├── address/             # Address management
│   ├── payments/            # Payment methods
│   ├── notifications/       # Notification center
│   ├── help/                # Help screen
│   ├── settings/            # Settings screen
│   └── sell/                # Sell product screen
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
```

### Testing on Device

1. Install **Expo Go** on your phone (iOS App Store / Google Play)
2. Run `npx expo start`
3. Scan the QR code with Expo Go (Android) or camera (iOS)

## Architecture Highlights

### Service Layer Pattern

All data access is isolated in `src/services/`. Uses mock data with Firebase integration ready:

```typescript
// Easy to swap mock → Firebase
export const productService = {
  async getFlashSaleProducts(): Promise<Product[]> {
    // Returns mock data, ready for Firestore integration
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
│       ├── Home (Top Tabs: For You, Flash Sale, Recent, Listings, Profile)
│       ├── Categories
│       ├── Wishlist (Tabs: Wishlist Items, Price Drops, Back in Stock)
│       ├── Cart (Tabs: In Cart, Saved for Later)
│       └── Profile (Tabs: Overview, Orders, Settings)
├── ProductDetail
├── Search (Tabs: Recent, Trending, Categories)
├── SellProduct
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

## Future Enhancements

- [x] Firebase Config integrated
- [ ] Firestore for real-time data
- [ ] Firebase Storage for images
- [ ] Push notifications
- [ ] Payment gateway (Stripe/Razorpay)
- [ ] Image caching optimization
- [ ] Offline support
- [ ] Deep linking
- [ ] Biometric authentication

## License

Private - All rights reserved
