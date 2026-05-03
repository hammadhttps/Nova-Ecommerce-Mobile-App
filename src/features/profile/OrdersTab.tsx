import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { useAuthStore } from "@/store/auth.store";
import { orderService } from "@/services/order.service";
import { Badge } from "@/components/common";
import { ChevronRight } from "lucide-react-native";
import { Order } from "@/types";

const statusConfig = {
  delivered: { label: "Delivered", variant: "success" as const },
  in_transit: { label: "In Transit", variant: "info" as const },
  processing: { label: "Processing", variant: "warning" as const },
  cancelled: { label: "Cancelled", variant: "destructive" as const },
};

interface OrdersTabProps {
  onPress: (order: Order) => void;
}

export default React.memo(function OrdersTab({ onPress }: OrdersTabProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = useCallback(async () => {
    if (!user?.id) return;
    try {
      const data = await orderService.getOrdersByStatus(user.id, "all");
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const renderItem = useCallback(
    ({ item }: { item: Order }) => {
      const config = statusConfig[item.status];
      return (
        <TouchableOpacity
          style={[
            styles.card,
            { backgroundColor: isDark ? "#1a1a1a" : "#ffffff" },
          ]}
          onPress={() => onPress(item)}
          activeOpacity={0.7}
        >
          <View style={styles.cardHeader}>
            <Text
              style={[
                styles.orderId,
                { color: isDark ? "#fafafa" : "#030213" },
              ]}
            >
              {item.id}
            </Text>
            <Badge label={config.label} variant={config.variant} size="sm" />
          </View>
          <View style={styles.itemsRow}>
            {item.items.slice(0, 3).map((i, idx) => (
              <Image key={idx} source={{ uri: i.image }} style={styles.thumb} />
            ))}
            {item.items.length > 3 && (
              <View style={styles.moreBadge}>
                <Text style={styles.moreText}>+{item.items.length - 3}</Text>
              </View>
            )}
          </View>
          <View style={styles.cardFooter}>
            <Text
              style={[styles.date, { color: isDark ? "#a3a3a3" : "#737373" }]}
            >
              {item.date}
            </Text>
            <View style={styles.right}>
              <Text
                style={[
                  styles.total,
                  { color: isDark ? "#fafafa" : "#030213" },
                ]}
              >
                ${item.total.toFixed(2)}
              </Text>
              <ChevronRight size={18} color={isDark ? "#737373" : "#a3a3a3"} />
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [isDark, onPress],
  );

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          styles.center,
          { backgroundColor: isDark ? "#0f0f0f" : "#f5f5f5" },
        ]}
      >
        <ActivityIndicator size="large" color="#9333ea" />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#0f0f0f" : "#f5f5f5" },
      ]}
    >
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        windowSize={5}
        maxToRenderPerBatch={10}
        removeClippedSubviews
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text
              style={[
                styles.emptyTitle,
                { color: isDark ? "#fafafa" : "#030213" },
              ]}
            >
              No Orders Yet
            </Text>
            <Text
              style={[
                styles.emptySub,
                { color: isDark ? "#737373" : "#a3a3a3" },
              ]}
            >
              Your order history will appear here
            </Text>
          </View>
        }
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { justifyContent: "center", alignItems: "center" },
  listContent: { padding: 16 },
  card: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  orderId: { fontSize: 14, fontWeight: "700" },
  itemsRow: { flexDirection: "row", gap: 8, marginBottom: 10 },
  thumb: { width: 40, height: 40, borderRadius: 8 },
  moreBadge: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  moreText: { fontSize: 12, fontWeight: "600", color: "#9333ea" },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: { fontSize: 12 },
  right: { flexDirection: "row", alignItems: "center", gap: 6 },
  total: { fontSize: 14, fontWeight: "600" },
  emptyState: { alignItems: "center", paddingTop: 60 },
  emptyTitle: { fontSize: 18, fontWeight: "700" },
  emptySub: { fontSize: 14, marginTop: 4 },
});
