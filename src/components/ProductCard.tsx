import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Heart, Scale, Star } from "lucide-react-native";
import { Product } from "@/types";
import { useTheme } from "@/hooks/useTheme";
import { useWishlist } from "@/hooks/useWishlist";
import { useComparison } from "@/hooks/useComparison";
import { formatCurrency, formatRating } from "@/utils/formatters";

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  showComparisonToggle?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = React.memo(
  ({ product, onPress, showComparisonToggle = false }) => {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";
    const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();
    const {
      comparisonMode,
      addToComparison,
      removeFromComparison,
      selectedProducts,
    } = useComparison();

    const isInWishlist = wishlistItems.some((item) => item.id === product.id);
    const isSelectedForComparison = selectedProducts.some(
      (p) => p.id === product.id,
    );

    const handleWishlistToggle = () => {
      if (isInWishlist) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(product);
      }
    };

    const handleComparisonToggle = () => {
      if (isSelectedForComparison) {
        removeFromComparison(product.id);
      } else {
        addToComparison(product);
      }
    };

    return (
      <TouchableOpacity
        style={[
          styles.container,
          {
            backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
            shadowColor: "#000",
          },
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            resizeMode="cover"
          />
          {product.discount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{product.discount}%</Text>
            </View>
          )}
          {comparisonMode && (
            <TouchableOpacity
              style={[
                styles.comparisonBadge,
                isSelectedForComparison && styles.comparisonBadgeActive,
              ]}
              onPress={handleComparisonToggle}
              activeOpacity={0.7}
            >
              <Scale
                size={16}
                color={
                  isSelectedForComparison
                    ? "#ffffff"
                    : isDark
                      ? "#d4d4d4"
                      : "#525252"
                }
              />
            </TouchableOpacity>
          )}
          {!comparisonMode && (
            <TouchableOpacity
              style={styles.wishlistButton}
              onPress={handleWishlistToggle}
              activeOpacity={0.7}
            >
              <Heart
                size={18}
                color={
                  isInWishlist ? "#d4183d" : isDark ? "#d4d4d4" : "#525252"
                }
                fill={isInWishlist ? "#d4183d" : "transparent"}
              />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.content}>
          <Text
            style={[styles.name, { color: isDark ? "#fafafa" : "#030213" }]}
            numberOfLines={2}
          >
            {product.name}
          </Text>
          <View style={styles.ratingContainer}>
            <Star size={14} color="#fbbf24" fill="#fbbf24" />
            <Text
              style={[styles.rating, { color: isDark ? "#a3a3a3" : "#737373" }]}
            >
              {formatRating(product.rating)}
            </Text>
          </View>
          <View style={styles.priceContainer}>
            <Text
              style={[styles.price, { color: isDark ? "#fafafa" : "#030213" }]}
            >
              {formatCurrency(product.price)}
            </Text>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>
                {formatCurrency(product.originalPrice)}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    width: "100%",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    aspectRatio: 1,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  discountBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#d4183d",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  discountText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  comparisonBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 999,
    padding: 6,
  },
  comparisonBadgeActive: {
    backgroundColor: "#9333ea",
  },
  wishlistButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 999,
    padding: 6,
  },
  content: {
    padding: 14,
  },
  name: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 10,
  },
  rating: {
    fontSize: 12,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
  },
  originalPrice: {
    fontSize: 12,
    color: "#a3a3a3",
    textDecorationLine: "line-through",
  },
});
