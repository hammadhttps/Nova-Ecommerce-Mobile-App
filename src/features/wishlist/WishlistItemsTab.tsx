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
import { useWishlist } from "@/hooks/useWishlist";
import { Badge, EmptyState } from "@/components/common";
import { X } from "lucide-react-native";
import { WishlistItem } from "@/types";

interface WishlistItemsTabProps {
  onRemove: (id: number) => void;
  onProductPress: (item: WishlistItem) => void;
}

export default React.memo(function WishlistItemsTab({
  onRemove,
  onProductPress,
}: WishlistItemsTabProps) {
  const { isDark } = useTheme();
  const { wishlistItems } = useWishlist();

  const renderItem = useCallback(
    ({ item }: { item: WishlistItem }) => (
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
            {item.inStock ? (
              <Badge label="In Stock" variant="success" size="sm" />
            ) : (
              <Badge label="Out of Stock" variant="destructive" size="sm" />
            )}
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => onRemove(item.id)}
              activeOpacity={0.7}
            >
              <X size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    ),
    [isDark, onRemove, onProductPress],
  );

  if (wishlistItems.length === 0) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: isDark ? "#0f0f0f" : "#f5f5f5" },
        ]}
      >
        <EmptyState
          icon="heart"
          title="No wishlist items"
          message="Start adding items you love"
        />
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
        data={wishlistItems}
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
  removeBtn: { padding: 4 },
});
