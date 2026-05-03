export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  ProductDetail: { id: string };
  SearchResults: { query?: string; category?: string };
  Checkout: undefined;
  OrderHistory: undefined;
  OrderDetail: { id: string };
  AddressManagement: undefined;
  PaymentMethods: undefined;
  Notifications: undefined;
  Help: undefined;
  Settings: undefined;
  SellProduct: { productId?: string };
  MyProducts: undefined;
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
};
