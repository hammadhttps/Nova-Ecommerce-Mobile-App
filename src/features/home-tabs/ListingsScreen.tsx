import React, { useCallback } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NavigationProp } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProductCard } from "@/components/ProductCard";
import { useTheme } from "@/hooks/useTheme";
import { RootStackParamList } from "@/navigation/types";
import { allProducts } from "@/services/mocks/products";
import { Product } from "@/types";

const ListingsScreen: React.FC = React.memo(function ListingsScreen() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark";
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

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

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: isDark ? "#0f0f0f" : "#f5f5f5" }]}
      edges={["left", "right", "bottom"]}
    >
      <FlatList
        data={allProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        initialNumToRender={8}
        windowSize={5}
        removeClippedSubviews
      />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safe: { flex: 1 },
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
