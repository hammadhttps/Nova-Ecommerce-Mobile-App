import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { Badge } from "@/components/common";
import { ChevronRight } from "lucide-react-native";
import { Order } from "@/types";

const mockOrders: Order[] = [
  {
    id: "ORD-001",
    date: "2024-01-15",
    status: "delivered",
    total: 109.98,
    items: [
      {
        name: "Wireless Earbuds Pro",
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1590658268037-6bf12f032f53?w=100",
        price: 29.99,
      },
      {
        name: "Smart Watch Ultra",
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=100",
        price: 89.99,
      },
    ],
  },
  {
    id: "ORD-002",
    date: "2024-01-20",
    status: "in_transit",
    total: 79.99,
    items: [
      {
        name: "Running Shoes Elite",
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100",
        price: 79.99,
      },
    ],
  },
  {
    id: "ORD-003",
    date: "2024-02-01",
    status: "processing",
    total: 45.99,
    items: [
      {
        name: "Minimalist Backpack",
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100",
        price: 45.99,
      },
    ],
  },
];

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
  const { isDark } = useTheme();

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

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#0f0f0f" : "#f5f5f5" },
      ]}
    >
      <FlatList
        data={mockOrders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: { fontSize: 12 },
  right: { flexDirection: "row", alignItems: "center", gap: 6 },
  total: { fontSize: 14, fontWeight: "600" },
});
