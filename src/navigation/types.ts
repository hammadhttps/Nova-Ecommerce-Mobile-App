export type RootStackParamList = {
  Auth: undefined;
  ProductDetail: { id: number };
  ProductList: { category?: string; title?: string };
  Checkout: undefined;
  OrderHistory: undefined;
  OrderDetail: { id: string };
  AddressManagement: undefined;
  PaymentMethods: undefined;
  Notifications: undefined;
  Help: undefined;
  Settings: undefined;
};

export type AuthStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Signup: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Cart: undefined;
  Wishlist: undefined;
  Profile: undefined;
};

/** Top tabs nested inside the Home main tab (route Feed shows label "Home"; avoids duplicate "Home" with main tabs) */
export type HomeTopTabParamList = {
  Feed: undefined;
  Listings: undefined;
  HomeProfile: undefined;
};
