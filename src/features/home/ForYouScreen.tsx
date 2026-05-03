import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { ProductCard } from "@/components/ProductCard";
import { useTheme } from "@/hooks/useTheme";
import { productService } from "@/services/product.service";
import { Product } from "@/types";

interface ForYouScreenProps {
  onProductPress: (product: Product) => void;
}

const ForYouScreen: React.FC<ForYouScreenProps> = React.memo(
  ({ onProductPress }) => {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const loadProducts = async () => {
        try {
          const forYou = await productService.getForYouProducts();
          setProducts(forYou);
        } catch (error) {
          console.error("Failed to load For You products:", error);
        } finally {
          setLoading(false);
        }
      };
      loadProducts();
    }, []);

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
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          windowSize={5}
          maxToRenderPerBatch={10}
          removeClippedSubviews
        />
      </View>
    );
  },
);

ForYouScreen.displayName = "ForYouScreen";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: { alignItems: "center", justifyContent: "center" },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
  },
  row: {
    gap: 12,
    marginBottom: 12,
  },
  cardWrapper: {
    flex: 1,
  },
});

export default ForYouScreen;
