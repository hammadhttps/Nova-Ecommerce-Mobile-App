import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { Button, EmptyState } from "@/components/common";
import { ShoppingCart } from "lucide-react-native";
import { Product } from "@/types";

const savedItems: Product[] = [
  {
    id: 101,
    name: "Ceramic Coffee Mug Set",
    price: 18.99,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400",
    inStock: true,
    category: "Home",
  },
  {
    id: 102,
    name: "Leather Wallet Classic",
    price: 54.99,
    originalPrice: 69.99,
    discount: 21,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400",
    inStock: true,
    category: "Fashion",
  },
];

interface SavedForLaterTabProps {
  onMoveToCart: (product: Product) => void;
  onProductPress: (product: Product) => void;
}

export default React.memo(function SavedForLaterTab({
  onMoveToCart,
  onProductPress,
}: SavedForLaterTabProps) {
  const { isDark } = useTheme();
  const [items, setItems] = useState(savedItems);

  const handleMoveToCart = useCallback(
    (item: Product) => {
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      onMoveToCart(item);
    },
    [onMoveToCart],
  );

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
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          <Button
            onPress={() => handleMoveToCart(item)}
            variant="outline"
            size="sm"
            style={styles.moveBtn}
          >
            Move to Cart
          </Button>
        </View>
      </View>
    ),
    [isDark, onProductPress, handleMoveToCart],
  );

  if (items.length === 0) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: isDark ? "#0f0f0f" : "#f5f5f5" },
        ]}
      >
        <EmptyState
          icon="cart"
          title="No saved items"
          message="Items saved for later will appear here"
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
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? "#fafafa" : "#030213" }]}>
          Saved for Later
        </Text>
        <Text style={[styles.count, { color: isDark ? "#a3a3a3" : "#737373" }]}>
          {items.length} items
        </Text>
      </View>
      <FlatList
        data={items}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  title: { fontSize: 16, fontWeight: "700" },
  count: { fontSize: 13 },
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
  moveBtn: { alignSelf: "flex-start", marginTop: 8 },
});
