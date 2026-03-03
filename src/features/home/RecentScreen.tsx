import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { ChevronRight } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";
import { productService } from "@/services/product.service";
import { Product } from "@/types";
import { formatCurrency } from "@/utils/formatters";

interface RecentScreenProps {
  onProductPress: (product: Product) => void;
}

const RecentScreen: React.FC<RecentScreenProps> = React.memo(
  ({ onProductPress }) => {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const loadProducts = async () => {
        try {
          const recent = await productService.getRecentProducts();
          setProducts(recent);
        } catch (error) {
          console.error("Failed to load recent products:", error);
        } finally {
          setLoading(false);
        }
      };
      loadProducts();
    }, []);

    const renderItem = ({ item }: { item: Product }) => (
      <TouchableOpacity
        style={[
          styles.recentItem,
          { backgroundColor: isDark ? "#1a1a1a" : "#ffffff" },
        ]}
        onPress={() => onProductPress(item)}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.recentImage,
            { backgroundColor: isDark ? "#262626" : "#f5f5f5" },
          ]}
        />
        <View style={styles.recentInfo}>
          <Text
            style={[
              styles.recentName,
              { color: isDark ? "#fafafa" : "#030213" },
            ]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text style={styles.recentPrice}>{formatCurrency(item.price)}</Text>
        </View>
        <ChevronRight size={20} color={isDark ? "#737373" : "#a3a3a3"} />
      </TouchableOpacity>
    );

    if (loading) {
      return (
        <View style={[styles.container, styles.center]}>
          <ActivityIndicator size="large" color="#9333ea" />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  },
);

RecentScreen.displayName = "RecentScreen";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: { alignItems: "center", justifyContent: "center" },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 8,
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  recentImage: {
    width: 56,
    height: 56,
    borderRadius: 12,
  },
  recentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  recentName: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  recentPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#9333ea",
  },
});

export default RecentScreen;
