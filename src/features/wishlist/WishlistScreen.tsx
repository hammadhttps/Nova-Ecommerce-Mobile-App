import React, { useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeScreen } from "@/components/layout/SafeScreen";
import { useTheme } from "@/hooks/useTheme";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { EmptyState } from "@/components/common";
import TabViewPager, { TabRoute } from "@/navigation/TabViewPager";
import WishlistItemsTab from "@/features/wishlist/WishlistItemsTab";
import PriceDropsTab from "@/features/wishlist/PriceDropsTab";
import BackInStockTab from "@/features/wishlist/BackInStockTab";
import { WishlistItem, Product } from "@/types";
import { SceneMap } from "react-native-tab-view";

const routes: TabRoute[] = [
  { key: "wishlist", title: "Wishlist" },
  { key: "drops", title: "Price Drops" },
  { key: "backInStock", title: "Back In Stock" },
];

export default function WishlistScreen({ navigation }: { navigation: any }) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark";
  const { wishlistItems, removeFromWishlist, wishlistLoading } = useWishlist();
  const { addToCart } = useCart();

  const handleProductPress = useCallback(
    (item: WishlistItem | Product) => {
      navigation.navigate("ProductDetail", { id: String(item.id) });
    },
    [navigation],
  );

  const handleRemove = useCallback(
    (id: string) => {
      removeFromWishlist(id);
    },
    [removeFromWishlist],
  );

  const handleAddToCart = useCallback(
    (item: Product) => {
      addToCart(item, 1);
    },
    [addToCart],
  );

  const renderScene = SceneMap({
    wishlist: () => (
      <WishlistItemsTab
        onRemove={handleRemove}
        onProductPress={handleProductPress}
      />
    ),
    drops: () => <PriceDropsTab onProductPress={handleProductPress} />,
    backInStock: () => <BackInStockTab onProductPress={handleProductPress} />,
  });

  if (wishlistLoading) {
    return <SafeScreen loading />;
  }

  if (wishlistItems.length === 0) {
    return (
      <SafeScreen>
        <View
          style={[
            styles.container,
            { backgroundColor: isDark ? "#0f0f0f" : "#f5f5f5" },
          ]}
        >
          <View style={styles.header}>
            <Text
              style={[styles.title, { color: isDark ? "#fafafa" : "#030213" }]}
            >
              My Wishlist
            </Text>
          </View>
          <EmptyState
            icon="heart"
            title="Your wishlist is empty"
            message="Save items you love to your wishlist"
          />
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen>
      <View
        style={[
          styles.container,
          { backgroundColor: isDark ? "#0f0f0f" : "#f5f5f5" },
        ]}
      >
        <View style={styles.header}>
          <Text
            style={[styles.title, { color: isDark ? "#fafafa" : "#030213" }]}
          >
            My Wishlist
          </Text>
          <Text
            style={[styles.subtitle, { color: isDark ? "#a3a3a3" : "#737373" }]}
          >
            {wishlistItems.length} items
          </Text>
        </View>
        <TabViewPager routes={routes} renderScene={renderScene} />
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingVertical: 16 },
  title: { fontSize: 28, fontWeight: "700" },
  subtitle: { fontSize: 14, marginTop: 4 },
});
