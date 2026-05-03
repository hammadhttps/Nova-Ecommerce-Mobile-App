import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { Clock } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";
import { productService } from "@/services/product.service";
import { Product } from "@/types";
import { formatCurrency } from "@/utils/formatters";

interface FlashSaleScreenProps {
  onProductPress: (product: Product) => void;
}

const FlashSaleScreen: React.FC<FlashSaleScreenProps> = React.memo(
  ({ onProductPress }) => {
    const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark";
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      loadFlashSaleProducts();
    }, []);

    const loadFlashSaleProducts = async () => {
      try {
        const data = await productService.getFlashSaleProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error loading flash sale products:", error);
      } finally {
        setLoading(false);
      }
    };

    const renderFlashSaleItem = ({ item }: { item: Product }) => (
      <TouchableOpacity
        style={[
          styles.flashSaleCard,
          { backgroundColor: isDark ? "#1a1a1a" : "#ffffff" },
        ]}
        onPress={() => onProductPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.flashSaleImageContainer}>
          {item.image ? (
            <Image
              source={{ uri: item.image }}
              style={styles.flashSaleImage}
              resizeMode="cover"
            />
          ) : (
            <View
              style={[
                styles.flashSaleImage,
                { backgroundColor: isDark ? "#262626" : "#f5f5f5" },
              ]}
            />
          )}
        </View>
        <Text
          style={[
            styles.flashSaleName,
            { color: isDark ? "#fafafa" : "#030213" },
          ]}
          numberOfLines={1}
        >
          {item.name}
        </Text>
        <Text style={styles.flashSalePrice}>{formatCurrency(item.price)}</Text>
        {item.timeLeft && (
          <View style={styles.timeLeftContainer}>
            <Clock size={12} color="#d4183d" />
            <Text style={styles.timeLeftText}>{item.timeLeft} left</Text>
          </View>
        )}
      </TouchableOpacity>
    );

    if (loading) {
      return (
        <View style={styles.container}>
          <Text style={{ color: isDark ? "#fafafa" : "#030213" }}>
            Loading...
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <FlatList
          data={products}
          renderItem={renderFlashSaleItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={{ color: isDark ? "#737373" : "#a3a3a3" }}>
              No flash sale products available
            </Text>
          }
        />
      </View>
    );
  },
);

export default FlashSaleScreen;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  flashSaleCard: {
    width: 140,
    marginRight: 12,
    borderRadius: 12,
    padding: 8,
  },
  flashSaleImageContainer: {
    width: "100%",
    height: 100,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 8,
  },
  flashSaleImage: {
    width: "100%",
    height: "100%",
  },
  flashSaleName: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  flashSalePrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#9333ea",
  },
  timeLeftContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  timeLeftText: {
    fontSize: 11,
    color: "#d4183d",
    fontWeight: "500",
  },
});
