import React, { useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { SafeScreen } from "@/components/layout/SafeScreen";
import { useTheme } from "@/hooks/useTheme";
import { useAuthStore } from "@/store/auth.store";
import TopTabsNavigator, { TabRoute } from "@/navigation/TopTabsNavigator";
import OverviewTab from "@/features/profile/OverviewTab";
import OrdersTab from "@/features/profile/OrdersTab";
import SettingsTab from "@/features/profile/SettingsTab";
import { Order } from "@/types";
import { SceneMap } from "react-native-tab-view";

const routes: TabRoute[] = [
  { key: "overview", title: "Overview" },
  { key: "orders", title: "Orders" },
  { key: "settings", title: "Settings" },
];

export default function ProfileScreen({ navigation }: { navigation: any }) {
  const { isDark } = useTheme();
  const { logout } = useAuthStore();

  const handleOrderPress = useCallback(
    (order: Order) => {
      navigation.navigate("OrderDetail", { id: order.id });
    },
    [navigation],
  );

  const handleToggleDarkMode = useCallback(() => {}, []);

  const handleSettingsPress = useCallback(
    (label: string) => {
      const screenMap: Record<string, keyof any> = {
        Notifications: "Notifications",
        "Privacy & Security": "Settings",
        About: "Help",
      };
      const screen = screenMap[label];
      if (screen) {
        navigation.navigate(screen);
      }
    },
    [navigation],
  );

  const renderScene = SceneMap({
    overview: () => <OverviewTab />,
    orders: () => <OrdersTab onPress={handleOrderPress} />,
    settings: () => (
      <SettingsTab
        onToggleDarkMode={handleToggleDarkMode}
        onLogout={logout}
        onPress={handleSettingsPress}
      />
    ),
  });

  return (
    <SafeScreen hasScrollView={false}>
      <View
        style={[
          styles.container,
          { backgroundColor: isDark ? "#0f0f0f" : "#f5f5f5" },
        ]}
      >
        <TopTabsNavigator routes={routes} renderScene={renderScene} />
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
