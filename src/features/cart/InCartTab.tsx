import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { useCart } from "@/hooks/useCart";
import { Minus, Plus, X } from "lucide-react-native";
import { CartItem } from "@/types";
import { Button } from "@/components/common";

interface InCartTabProps {
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onProductPress: (item: CartItem) => void;
}

export default React.memo(function InCartTab({
  onUpdateQuantity,
  onRemove,
  onProductPress,
}: InCartTabProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark";
  const { items } = useCart();

  const renderItem = useCallback(
    ({ item }: { item: CartItem }) => (
      <View
        style={[
          styles.card,
          { backgroundColor: isDark ? "#1a1a1a" : "#ffffff" },
        ]}
      >
        <TouchableOpacity
          onPress={() => onProductPress(item)}
          activeOpacity={0.7}
        >
          <Image source={{ uri: item.image }} style={styles.image} />
        </TouchableOpacity>
        <View style={styles.info}>
          <Text
            style={[styles.name, { color: isDark ? "#fafafa" : "#030213" }]}
            numberOfLines={2}
          >
            {item.name}
          </Text>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          <View style={styles.row}>
            <View style={styles.qtyRow}>
              <TouchableOpacity
                style={[
                  styles.qtyBtn,
                  { backgroundColor: isDark ? "#333333" : "#f0f0f0" },
                ]}
                onPress={() =>
                  onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))
                }
              >
                <Minus size={16} color={isDark ? "#fafafa" : "#030213"} />
              </TouchableOpacity>
              <Text
                style={[
                  styles.qtyText,
                  { color: isDark ? "#fafafa" : "#030213" },
                ]}
              >
                {item.quantity}
              </Text>
              <TouchableOpacity
                style={[
                  styles.qtyBtn,
                  { backgroundColor: isDark ? "#333333" : "#f0f0f0" },
                ]}
                onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}
              >
                <Plus size={16} color={isDark ? "#fafafa" : "#030213"} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => onRemove(item.id)}>
              <X size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    ),
    [isDark, onUpdateQuantity, onRemove, onProductPress],
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#0f0f0f" : "#f5f5f5" },
      ]}
    >
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },
  card: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: { width: 80, height: 80, borderRadius: 8 },
  info: { flex: 1, marginLeft: 12, justifyContent: "space-between" },
  name: { fontSize: 14, fontWeight: "600" },
  price: { fontSize: 16, fontWeight: "700", color: "#9333ea" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  qtyRow: { flexDirection: "row", alignItems: "center" },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: { fontSize: 14, fontWeight: "600", marginHorizontal: 12 },
});
