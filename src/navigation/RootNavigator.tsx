import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthStack from "./AuthStack";
import ProductDetailScreen from "@/features/product/ProductDetailScreen";
import CheckoutScreen from "@/features/checkout/CheckoutScreen";
import OrderHistoryScreen from "@/features/orders/OrderHistoryScreen";
import OrderDetailScreen from "@/features/orders/OrderDetailScreen";
import AddressManagementScreen from "@/features/address/AddressManagementScreen";
import PaymentMethodsScreen from "@/features/payments/PaymentMethodsScreen";
import NotificationsScreen from "@/features/notifications/NotificationsScreen";
import HelpScreen from "@/features/help/HelpScreen";
import SettingsScreen from "@/features/settings/SettingsScreen";
import { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Auth" component={AuthStack} />
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
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Help" component={HelpScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
