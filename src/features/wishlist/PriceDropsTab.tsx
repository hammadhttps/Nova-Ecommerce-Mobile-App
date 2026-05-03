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
import { ProductCard } from "@/components/ProductCard";
import { Badge } from "@/components/common";
import { Tag } from "lucide-react-native";
import { Product } from "@/types";

const priceDrops: Product[] = [
  {
    id: 201,
    name: "Premium Sunglasses",
    price: 109.99,
    originalPrice: 129.99,
    discount: 15,
    rating: 4.9,
    reviews: 201,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
    inStock: true,
    category: "Fashion",
  },
  {
    id: 202,
    name: "Smart Home Hub",
    price: 79.99,
    originalPrice: 99.99,
    discount: 20,
    rating: 4.6,
    reviews: 145,
    image: "https://images.unsplash.com/photo-1558089687-f282ffcbc125?w=400",
    inStock: true,
    category: "Home",
  },
  {
    id: 203,
    name: "Running Shoes Elite",
    price: 69.99,
    originalPrice: 79.99,
    discount: 13,
    rating: 4.7,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    inStock: true,
    category: "Sports",
  },
];

interface PriceDropsTabProps {
  onProductPress: (product: Product) => void;
}

export default React.memo(function PriceDropsTab({
  onProductPress,
}: PriceDropsTabProps) {
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
          <View style={styles.priceRow}>
            <Text style={styles.price}>${item.price.toFixed(2)}</Text>
            <Text style={styles.originalPrice}>
              ${item.originalPrice?.toFixed(2)}
            </Text>
          </View>
          <View style={styles.badgeRow}>
            <Badge
              label={`${item.discount}% OFF`}
              variant="success"
              size="sm"
            />
            <View style={styles.tagRow}>
              <Tag size={12} color="#ef4444" />
              <Text style={styles.dropLabel}>Price dropped!</Text>
            </View>
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
        data={priceDrops}
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
  priceRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  price: { fontSize: 16, fontWeight: "700", color: "#9333ea" },
  originalPrice: {
    fontSize: 13,
    color: "#a3a3a3",
    textDecorationLine: "line-through",
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  tagRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  dropLabel: { fontSize: 12, color: "#ef4444", fontWeight: "600" },
});
