import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NavigationProp } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ProductCard } from "@/components/ProductCard";
import { useTheme } from "@/hooks/useTheme";
import { RootStackParamList } from "@/navigation/types";
import { productService } from "@/services/product.service";
import { Product } from "@/types";

const ListingsScreen: React.FC = React.memo(function ListingsScreen() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const allProducts = await productService.getAllProducts();
        setProducts(allProducts);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

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
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        initialNumToRender={8}
        windowSize={5}
        maxToRenderPerBatch={10}
        removeClippedSubviews
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  safe: { flex: 1 },
  center: { alignItems: "center", justifyContent: "center" },
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 24,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cardWrapper: {
    width: "48%",
  },
});

export default ListingsScreen;
