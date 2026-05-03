import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuthStore } from "@/store/auth.store";
import AuthStack from "./AuthStack";
import MainTabs from "./MainTabs";
import ProductDetailScreen from "@/features/product/ProductDetailScreen";
import CheckoutScreen from "@/features/checkout/CheckoutScreen";
import OrderHistoryScreen from "@/features/orders/OrderHistoryScreen";
import OrderDetailScreen from "@/features/orders/OrderDetailScreen";
import AddressManagementScreen from "@/features/address/AddressManagementScreen";
import PaymentMethodsScreen from "@/features/payments/PaymentMethodsScreen";
import NotificationsScreen from "@/features/notifications/NotificationsScreen";
import HelpScreen from "@/features/help/HelpScreen";
import SettingsScreen from "@/features/settings/SettingsScreen";
import SellProductScreen from "@/features/sell/SellProductScreen";
import { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const { isAuthenticated, isInitialized, initializeAuth } = useAuthStore();

  // Initialize auth state on mount
  React.useEffect(() => {
    initializeAuth();
  }, []);

  // Show loading while checking auth state
  if (!isInitialized) {
    return null; // Or a loading screen
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen
            name="ProductDetail"
            component={ProductDetailScreen}
            options={{
              headerShown: true,
              headerTransparent: true,
              headerBackTitle: "Back",
            }}
          />
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
          <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
          <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
          <Stack.Screen
            name="AddressManagement"
            component={AddressManagementScreen}
          />
          <Stack.Screen
            name="PaymentMethods"
            component={PaymentMethodsScreen}
          />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="Help" component={HelpScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen
            name="SellProduct"
            component={SellProductScreen}
            options={{
              headerShown: true,
              title: "Sell Product",
              headerBackTitle: "Back",
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
