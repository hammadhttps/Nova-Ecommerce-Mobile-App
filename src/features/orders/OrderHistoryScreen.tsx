import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeScreen } from "@/components/layout/SafeScreen";
import { useTheme } from "@/hooks/useTheme";
import { Badge } from "@/components/common/Badge";
import { orderService } from "@/services/order.service";
import { Order } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/types";
import { useAuthStore } from "@/store/auth.store";

type Props = NativeStackScreenProps<RootStackParamList, "OrderHistory">;

const tabs = [
  "all",
  "processing",
  "in_transit",
  "delivered",
  "cancelled",
] as const;
type TabType = (typeof tabs)[number];

const tabLabels: Record<TabType, string> = {
  all: "All",
  processing: "Processing",
  in_transit: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const getStatusVariant = (
  status: string,
): "success" | "info" | "warning" | "destructive" | "default" => {
  if (status === "delivered") return "success";
  if (status === "in_transit") return "info";
  if (status === "processing") return "warning";
  if (status === "cancelled") return "destructive";
  return "default";
};

export default function OrderHistoryScreen({ navigation }: Props) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    setIsLoading(true);
    orderService
      .getOrdersByStatus(user.id, activeTab)
      .then((orders) => {
        setOrders(orders);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [user?.id, activeTab]);

  const renderItem = useCallback(
    ({ item }: { item: Order }) => (
      <TouchableOpacity
        style={[
          styles.card,
          { backgroundColor: isDark ? "#1a1a1a" : "#ffffff" },
        ]}
        onPress={() => navigation.navigate("OrderDetail", { id: item.id })}
        activeOpacity={0.7}
      >
        <View style={styles.header}>
          <Text
            style={[styles.orderId, { color: isDark ? "#fafafa" : "#030213" }]}
          >
            {item.id}
          </Text>
          <Badge
            label={tabLabels[item.status as TabType] || item.status}
            variant={getStatusVariant(item.status)}
            size="sm"
          />
        </View>
        {item.items.slice(0, 3).map((product, index) => (
          <View key={index} style={styles.productRow}>
            <Image
              source={{ uri: product.image }}
              style={styles.productImage}
            />
            <View style={styles.productInfo}>
              <Text
                style={[
                  styles.productName,
                  { color: isDark ? "#fafafa" : "#030213" },
                ]}
                numberOfLines={1}
              >
                {product.name} x{product.quantity}
              </Text>
              <Text style={[styles.productPrice, { color: "#9333ea" }]}>
                ${product.price.toFixed(2)}
              </Text>
            </View>
          </View>
        ))}
        <View style={styles.footer}>
          <Text
            style={[styles.total, { color: isDark ? "#fafafa" : "#030213" }]}
          >
            Total: ${item.total.toFixed(2)}
          </Text>
          <Text
            style={[styles.date, { color: isDark ? "#a3a3a3" : "#737373" }]}
          >
            {item.date}
          </Text>
        </View>
      </TouchableOpacity>
    ),
    [isDark, navigation],
  );

  if (isLoading) {
    return <SafeScreen loading />;
  }

  return (
    <SafeScreen>
      <View
        style={[
          styles.container,
          { backgroundColor: isDark ? "#0f0f0f" : "#f5f5f5" },
        ]}
      >
        {/* Tabs */}
        <View style={styles.tabs}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && styles.tabActive,
                activeTab === tab && {
                  borderBottomColor: "#9333ea",
                },
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: isDark ? "#fafafa" : "#030213" },
                  activeTab === tab && { color: "#9333ea", fontWeight: "600" },
                ]}
              >
                {tabLabels[tab]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Orders List */}
        <FlatList
          data={orders}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          windowSize={5}
          maxToRenderPerBatch={10}
          removeClippedSubviews
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={{ color: isDark ? "#a3a3a3" : "#737373" }}>
                No orders found
              </Text>
            </View>
          }
        />
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabs: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 16,
  },
  tab: {
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {},
  tabText: { fontSize: 14 },
  listContent: { padding: 20 },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  orderId: { fontSize: 16, fontWeight: "600" },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  productImage: { width: 40, height: 40, borderRadius: 6 },
  productInfo: { flex: 1, marginLeft: 12 },
  productName: { fontSize: 14, marginBottom: 4 },
  productPrice: { fontSize: 14, fontWeight: "600" },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
  },
  total: { fontSize: 16, fontWeight: "700" },
  date: { fontSize: 12 },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
});
