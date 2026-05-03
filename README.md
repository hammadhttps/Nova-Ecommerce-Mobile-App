# Nova E-Commerce Mobile App

A fully-featured e-commerce mobile application built with React Native (Expo) and TypeScript.

## Features

- **Authentication Flow**: Splash → Onboarding → Login/Signup → Main App
- **Product Browsing**: Flash sales, categories, recommendations, search
- **Shopping Cart**: Add/remove items, quantity controls, promo codes (NOVA20)
- **Wishlist**: Save products, stock status tracking
- **Checkout**: 3-step flow (Address → Payment → Review)
- **Order Management**: Order history with status filtering, detailed order tracking
- **Product Comparison**: Compare up to 3 products side by side
- **Dark Mode**: Full dark mode support with persistence
- **Notifications**: Read/unread notification center
- **Address & Payment Management**: CRUD operations for addresses and payment methods

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native (Expo SDK 51) |
| Language | TypeScript |
| Navigation | React Navigation v7 (Stack + Bottom Tabs) |
| State Management | Zustand |
| Styling | NativeWind (Tailwind for RN) + StyleSheet |
| Storage | AsyncStorage |
| Icons | Lucide React Native |
| Animations | React Native Reanimated |
| Toast | React Native Toast Message |

## Project Structure

```
src/
├── types/                    # TypeScript interfaces
├── services/                 # API/data layer (mock → Firebase ready)
│   ├── mocks/               # Mock data files
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
│   └── validators.ts
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
│   │   └── ErrorBoundary.tsx
│   ├── layout/
│   │   └── SafeScreen.tsx
│   └── ProductCard.tsx      # Product card with wishlist/comparison
├── navigation/
│   ├── RootNavigator.tsx    # Root stack with all screens
│   ├── AuthStack.tsx        # Auth flow (splash, onboarding, login, signup)
│   └── MainTabs.tsx         # Bottom tabs (Home, Categories, Wishlist, Cart, Profile)
└── features/                 # Feature-specific screens
    ├── auth/
    ├── onboarding/
    ├── home/
    ├── categories/
    ├── wishlist/
    ├── cart/
    ├── profile/
    ├── product/
    ├── search/
    ├── checkout/
    ├── orders/
    ├── address/
    ├── payments/
    ├── notifications/
    ├── help/
    └── settings/
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
```

### Testing on Device

1. Install **Expo Go** on your phone (iOS App Store / Google Play)
2. Run `npx expo start`
3. Scan the QR code with Expo Go (Android) or camera (iOS)

## Architecture Highlights

### Service Layer Pattern
All data access is isolated in `src/services/`. Currently uses mock data but structured for easy Firebase integration:

```typescript
// Easy to swap mock → Firebase later
export const productService = {
  async getFlashSaleProducts(): Promise<Product[]> {
    // Currently: returns mock data
    // Future: return firestore().collection('products').where('flashSale', '==', true)
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
│   └── Main (Bottom Tabs)
│       ├── Home
│       ├── Categories
│       ├── Wishlist
│       ├── Cart
│       └── Profile
├── ProductDetail
├── Search
├── Checkout
├── OrderHistory
├── OrderDetail
├── AddressManagement
├── PaymentMethods
├── Notifications
├── Help
└── Settings
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

- [ ] Firebase Auth integration
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
