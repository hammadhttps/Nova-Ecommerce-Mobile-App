import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { useAuthStore } from "@/store/auth.store";
import { productService } from "@/services/product.service";
import { ProductCard } from "@/components/ProductCard";
import { EmptyState } from "@/components/common";
import { Product } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/types";
import { Pencil, Trash2 } from "lucide-react-native";

type Props = NativeStackScreenProps<RootStackParamList, "MyProducts">;

export default function MyProductsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { user } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    if (!user) return;
    try {
      const data = await productService.getUserProducts(user.id);
      setProducts(data);
    } catch (error) {
      console.error("Error fetching my products:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const handleDelete = (productId: string, productName: string) => {
    Alert.alert(
      "Delete Product",
      `Are you sure you want to delete "${productName}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setDeleting(productId);
            try {
              await productService.deleteProduct(productId);
              setProducts((prev) => prev.filter((p) => p.id !== productId));
            } catch {
              Alert.alert("Error", "Failed to delete product");
            } finally {
              setDeleting(null);
            }
          },
        },
      ],
    );
  };

  const renderProductItem = useCallback(
    ({ item }: { item: Product }) => (
      <View style={styles.cardWrapper}>
        <ProductCard
          product={item}
          onPress={() => navigation.navigate("ProductDetail", { id: item.id })}
        />
        {deleting === item.id ? (
          <ActivityIndicator
            style={styles.cardOverlay}
            size="small"
            color="#9333ea"
          />
        ) : (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() =>
                navigation.navigate("SellProduct", {
                  productId: item.id,
                })
              }
            >
              <Pencil size={16} color="#9333ea" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => handleDelete(item.id, item.name)}
            >
              <Trash2 size={16} color="#d4183d" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    ),
    [deleting, navigation, handleDelete],
  );

  if (loading) {
    return (
      <View
        style={[
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
        {
          backgroundColor: isDark ? "#0f0f0f" : "#f5f5f5",
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <EmptyState
            title="No Products Yet"
            message="Start by listing your first product for sale!"
          />
        }
        windowSize={5}
        maxToRenderPerBatch={10}
        removeClippedSubviews
        renderItem={renderProductItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  list: { padding: 16 },
  row: { gap: 12 },
  cardWrapper: { flex: 1, maxWidth: "50%" },
  actionRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 6,
  },
  actionBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  cardOverlay: {
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
