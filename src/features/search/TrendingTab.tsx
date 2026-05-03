import React, { useCallback } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/types";

const trendingProducts: Product[] = [
  {
    id: "10",
    name: "Bluetooth Speaker",
    price: 49.99,
    rating: 4.5,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
    inStock: true,
    category: "Electronics",
  },
  {
    id: "11",
    name: "Laptop Stand",
    price: 39.99,
    rating: 4.7,
    reviews: 92,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400",
    inStock: true,
    category: "Electronics",
  },
  {
    id: "12",
    name: "Phone Case Pro",
    price: 19.99,
    rating: 4.3,
    reviews: 234,
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400",
    inStock: true,
    category: "Electronics",
  },
  {
    id: "13",
    name: "Desk Lamp LED",
    price: 34.99,
    originalPrice: 49.99,
    discount: 30,
    rating: 4.6,
    reviews: 78,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400",
    inStock: true,
    category: "Home",
  },
  {
    id: "14",
    name: "Yoga Mat Pro",
    price: 29.99,
    rating: 4.4,
    reviews: 167,
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400",
    inStock: true,
    category: "Sports",
  },
  {
    id: "15",
    name: "Mechanical Keyboard",
    price: 79.99,
    originalPrice: 99.99,
    discount: 20,
    rating: 4.8,
    reviews: 312,
    image: "https://images.unsplash.com/photo-1618384887188-788407cca96e?w=400",
    inStock: true,
    category: "Electronics",
  },
];

interface TrendingTabProps {
  onProductPress: (product: Product) => void;
}

export default React.memo(function TrendingTab({
  onProductPress,
}: TrendingTabProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark";

  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard product={item} onPress={() => onProductPress(item)} />
    ),
    [onProductPress],
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#0f0f0f" : "#f5f5f5" },
      ]}
    >
      <FlatList
        data={trendingProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.grid}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { padding: 16 },
  grid: { gap: 12 },
});
