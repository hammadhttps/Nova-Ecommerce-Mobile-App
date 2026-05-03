import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { ProductCard } from "@/components/ProductCard";
import { useTheme } from "@/hooks/useTheme";
import { forYouProducts } from "@/services/mocks/products";
import { Product } from "@/types";

interface ForYouScreenProps {
  onProductPress: (product: Product) => void;
}

const ForYouScreen: React.FC<ForYouScreenProps> = React.memo(
  ({ onProductPress }) => {
    const { isDark } = useTheme();

    const renderItem = ({ item }: { item: Product }) => (
      <View style={styles.cardWrapper}>
        <ProductCard product={item} onPress={() => onProductPress(item)} />
      </View>
    );

    return (
      <View
        style={[
          styles.container,
          { backgroundColor: isDark ? "#0f0f0f" : "#f5f5f5" },
        ]}
      >
        <FlatList
          data={forYouProducts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
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
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
  },
  row: {
    gap: 12,
  },
  cardWrapper: {
    flex: 1,
  },
});

export default ForYouScreen;
