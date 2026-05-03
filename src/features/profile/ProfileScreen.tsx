import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeScreen } from "@/components/layout/SafeScreen";
import { useTheme } from "@/hooks/useTheme";
import { Avatar, Button } from "@/components/common";
import {
  ChevronRight,
  Package,
  MapPin,
  CreditCard,
  Bell,
  HelpCircle,
  Settings,
  LogOut,
} from "lucide-react-native";
import { useAuthStore } from "@/store/auth.store";
import {
  CompositeNavigationProp,
  NavigationProp,
} from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { MainTabParamList, RootStackParamList } from "@/navigation/types";

type ProfileScreenNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, "Profile">,
  NavigationProp<RootStackParamList>
>;

interface Props {
  navigation: ProfileScreenNavProp;
}

const menuItems = [
  { icon: Package, label: "My Orders", screen: "OrderHistory" as const },
  { icon: MapPin, label: "Addresses", screen: "AddressManagement" as const },
  {
    icon: CreditCard,
    label: "Payment Methods",
    screen: "PaymentMethods" as const,
  },
  { icon: Bell, label: "Notifications", screen: "Notifications" as const },
  { icon: HelpCircle, label: "Help", screen: "Help" as const },
  { icon: Settings, label: "Settings", screen: "Settings" as const },
];

export default function ProfileScreen({ navigation }: Props) {
  const { isDark } = useTheme();
  const { user, logout } = useAuthStore();

  const stats = [
    { label: "Orders", value: 24 },
    { label: "Wishlist", value: 12 },
    { label: "Reviews", value: 8 },
  ];

  return (
    <SafeScreen hasScrollView>
      <View
        style={[
          styles.container,
          { backgroundColor: isDark ? "#0f0f0f" : "#f5f5f5" },
        ]}
      >
        <View
          style={[
            styles.header,
            { backgroundColor: isDark ? "#1a1a1a" : "#ffffff" },
          ]}
        >
          <Avatar size={72} name={user?.name || "User"} uri={user?.avatar} />
          <Text
            style={[styles.name, { color: isDark ? "#fafafa" : "#030213" }]}
          >
            {user?.name || "Alex Johnson"}
          </Text>
          <Text
            style={[styles.email, { color: isDark ? "#a3a3a3" : "#737373" }]}
          >
            {user?.email || "alex@email.com"}
          </Text>
          <View style={styles.stats}>
            {stats.map((s, i) => (
              <View key={i} style={styles.statItem}>
                <Text
                  style={[
                    styles.statVal,
                    { color: isDark ? "#fafafa" : "#030213" },
                  ]}
                >
                  {s.value}
                </Text>
                <Text
                  style={[
                    styles.statLabel,
                    { color: isDark ? "#a3a3a3" : "#737373" },
                  ]}
                >
                  {s.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View
          style={[
            styles.menu,
            { backgroundColor: isDark ? "#1a1a1a" : "#ffffff" },
          ]}
        >
          {menuItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={i}
                style={styles.menuItem}
                onPress={() => (navigation as any).navigate(item.screen)}
                activeOpacity={0.7}
              >
                <Icon size={20} color={isDark ? "#fafafa" : "#030213"} />
                <Text
                  style={[
                    styles.menuLabel,
                    { color: isDark ? "#fafafa" : "#030213" },
                  ]}
                >
                  {item.label}
                </Text>
                <ChevronRight
                  size={20}
                  color={isDark ? "#737373" : "#a3a3a3"}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        <Button onPress={logout} variant="destructive" style={styles.logoutBtn}>
          <LogOut size={20} color="#ffffff" />
        </Button>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    alignItems: "center",
    padding: 24,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  name: { fontSize: 22, fontWeight: "700", marginTop: 12 },
  email: { fontSize: 14, marginTop: 4 },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  statItem: { alignItems: "center" },
  statVal: { fontSize: 20, fontWeight: "700" },
  statLabel: { fontSize: 12, marginTop: 4 },
  menu: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    paddingVertical: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuLabel: { flex: 1, marginLeft: 14, fontSize: 16 },
  logoutBtn: { marginHorizontal: 16, marginTop: 24, height: 52 },
});
