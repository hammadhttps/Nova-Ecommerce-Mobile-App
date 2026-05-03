import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp, NavigationProp } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { productService } from "@/services/product.service";
import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/types";
import { RootStackParamList } from "@/navigation/types";

type SearchResultsRouteProp = RouteProp<RootStackParamList, "SearchResults">;
type SearchResultsNavigationProp = NavigationProp<RootStackParamList>;

export default function SearchResultsScreen() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const navigation = useNavigation<SearchResultsNavigationProp>();
  const route = useRoute<SearchResultsRouteProp>();
  const insets = useSafeAreaInsets();
  const { query, category } = route.params || {};

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResults = async () => {
      try {
        let results: Product[] = [];
        if (category) {
          results = await productService.getProductsByCategory(category);
        } else if (query) {
          results = await productService.searchProducts(query);
        }
        setProducts(results);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    };
    loadResults();
  }, [query, category]);

  const onProductPress = useCallback(
    (product: Product) => {
      navigation.navigate("ProductDetail", { id: String(product.id) });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <View style={styles.cardWrapper}>
        <ProductCard product={item} onPress={() => onProductPress(item)} />
      </View>
    ),
    [onProductPress],
  );

  const title = category
    ? category
    : query
      ? `Results for "${query}"`
      : "Search Results";

  if (loading) {
    return (
      <View
        style={[
          styles.safe,
          styles.center,
          {
            backgroundColor: isDark ? "#0f0f0f" : "#f5f5f5",
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          },
        ]}
      >
        <ActivityIndicator size="large" color="#9333ea" />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.safe,
        {
          backgroundColor: isDark ? "#0f0f0f" : "#f5f5f5",
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? "#fafafa" : "#030213" }]}>
          {title}
        </Text>
        <Text style={[styles.count, { color: isDark ? "#a3a3a3" : "#737373" }]}>
          {products.length} {products.length === 1 ? "product" : "products"}{" "}
          found
        </Text>
      </View>
      {products.length === 0 ? (
        <View style={styles.empty}>
          <Text
            style={[
              styles.emptyText,
              { color: isDark ? "#a3a3a3" : "#737373" },
            ]}
          >
            No products found
          </Text>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  center: { alignItems: "center", justifyContent: "center" },
  header: { paddingHorizontal: 16, paddingVertical: 12 },
  title: { fontSize: 22, fontWeight: "700" },
  count: { fontSize: 14, marginTop: 4 },
  listContent: { paddingHorizontal: 12, paddingBottom: 24 },
  row: { justifyContent: "space-between", marginBottom: 12 },
  cardWrapper: { width: "48%" },
  empty: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyText: { fontSize: 16 },
});
