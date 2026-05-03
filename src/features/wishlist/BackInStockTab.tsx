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
import { Badge } from "@/components/common";
import { Bell } from "lucide-react-native";
import { Product } from "@/types";

const backInStock: Product[] = [
  {
    id: 301,
    name: "Premium Sunglasses",
    price: 129.99,
    rating: 4.9,
    reviews: 201,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
    inStock: true,
    category: "Fashion",
  },
];

interface BackInStockTabProps {
  onProductPress: (product: Product) => void;
}

export default React.memo(function BackInStockTab({
  onProductPress,
}: BackInStockTabProps) {
  const { isDark } = useTheme();

  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
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
            <Badge label="Back in Stock" variant="success" size="sm" />
            <Bell size={16} color="#10b981" />
          </View>
        </View>
      </View>
    ),
    [isDark, onProductPress],
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#0f0f0f" : "#f5f5f5" },
      ]}
    >
      <FlatList
        data={backInStock}
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
    marginTop: 4,
  },
});
