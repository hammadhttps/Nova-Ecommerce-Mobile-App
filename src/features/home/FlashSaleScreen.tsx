import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Clock } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";
import { flashSaleProducts } from "@/services/mocks/products";
import { Product } from "@/types";
import { formatCurrency } from "@/utils/formatters";

interface FlashSaleScreenProps {
  onProductPress: (product: Product) => void;
}

const FlashSaleScreen: React.FC<FlashSaleScreenProps> = React.memo(
  ({ onProductPress }) => {
    const { isDark } = useTheme();

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
          <View
            style={[
              styles.flashSaleImage,
              { backgroundColor: isDark ? "#262626" : "#f5f5f5" },
            ]}
          />
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

    return (
      <View style={styles.container}>
        <FlatList
          data={flashSaleProducts}
          renderItem={renderFlashSaleItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
    );
  },
);

FlashSaleScreen.displayName = "FlashSaleScreen";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 12,
  },
  flashSaleCard: {
    width: 160,
    marginRight: 12,
    borderRadius: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  flashSaleImageContainer: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
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
    marginBottom: 4,
  },
  timeLeftContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timeLeftText: {
    fontSize: 12,
    color: "#d4183d",
    fontWeight: "500",
  },
});

export default FlashSaleScreen;
