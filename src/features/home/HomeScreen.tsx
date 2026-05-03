import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search, ChevronRight, Clock } from "lucide-react-native";
import { SafeScreen } from "@/components/layout/SafeScreen";
import { ProductCard } from "@/components/ProductCard";
import { Skeleton, Badge } from "@/components/common";
import { useTheme } from "@/hooks/useTheme";
import { useCart } from "@/hooks/useCart";
import {
  flashSaleProducts,
  forYouProducts,
  recentProducts,
  categories,
} from "@/services/mocks/products";
import { Product } from "@/types";
import { formatCurrency } from "@/utils/formatters";

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { isDark } = useTheme();
  const { fetchCart } = useCart();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await fetchCart();
      setTimeout(() => setLoading(false), 800);
    };
    init();
  }, []);

  const handleProductPress = useCallback(
    (product: Product) => {
      navigation.navigate("ProductDetail", { id: product.id });
    },
    [navigation],
  );

  const renderFlashSaleItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.flashSaleCard}
      onPress={() => handleProductPress(item)}
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

  if (loading) {
    return (
      <SafeScreen loading={false}>
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <Skeleton width={150} height={28} />
            <Skeleton width={100} height={16} />
          </View>
          <Skeleton height={48} borderRadius={12} />
          <View style={{ marginTop: 24 }}>
            <Skeleton width={120} height={24} />
            <View style={{ marginTop: 16 }}>
              <Skeleton height={180} borderRadius={16} />
            </View>
          </View>
        </ScrollView>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text
              style={[
                styles.greeting,
                { color: isDark ? "#a3a3a3" : "#737373" },
              ]}
            >
              Good Morning
            </Text>
            <Text
              style={[
                styles.username,
                { color: isDark ? "#fafafa" : "#030213" },
              ]}
            >
              Alex Johnson
            </Text>
          </View>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => navigation.navigate("Search")}
          >
            <Search size={20} color={isDark ? "#fafafa" : "#030213"} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.searchBar,
            { backgroundColor: isDark ? "#1a1a1a" : "#f5f5f5" },
          ]}
          onPress={() => navigation.navigate("Search")}
          activeOpacity={0.7}
        >
          <Search size={20} color={isDark ? "#737373" : "#a3a3a3"} />
          <Text
            style={[
              styles.searchPlaceholder,
              { color: isDark ? "#737373" : "#a3a3a3" },
            ]}
          >
            Search products...
          </Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text
              style={[
                styles.sectionTitle,
                { color: isDark ? "#fafafa" : "#030213" },
              ]}
            >
              Flash Sales 🔥
            </Text>
            <Badge label="Limited" variant="destructive" />
          </View>
          <FlatList
            data={flashSaleProducts}
            renderItem={renderFlashSaleItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.flashSaleList}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text
              style={[
                styles.sectionTitle,
                { color: isDark ? "#fafafa" : "#030213" },
              ]}
            >
              Categories
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Search")}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.categoriesGrid}>
            {categories.slice(0, 6).map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryItem}
                onPress={() => navigation.navigate("Search")}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.categoryIcon,
                    { backgroundColor: category.color + "20" },
                  ]}
                >
                  <Text style={styles.categoryEmoji}>{category.icon}</Text>
                </View>
                <Text
                  style={[
                    styles.categoryName,
                    { color: isDark ? "#fafafa" : "#030213" },
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text
              style={[
                styles.sectionTitle,
                { color: isDark ? "#fafafa" : "#030213" },
              ]}
            >
              For You
            </Text>
          </View>
          <View style={styles.productsGrid}>
            {forYouProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPress={() => handleProductPress(product)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text
              style={[
                styles.sectionTitle,
                { color: isDark ? "#fafafa" : "#030213" },
              ]}
            >
              Recently Viewed
            </Text>
          </View>
          <FlatList
            data={recentProducts}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.recentItem}
                onPress={() => handleProductPress(item)}
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
                  <Text style={styles.recentPrice}>
                    {formatCurrency(item.price)}
                  </Text>
                </View>
                <ChevronRight
                  size={20}
                  color={isDark ? "#737373" : "#a3a3a3"}
                />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 14,
  },
  username: {
    fontSize: 24,
    fontWeight: "700",
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
  },
  searchPlaceholder: {
    fontSize: 16,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  seeAllText: {
    color: "#9333ea",
    fontSize: 14,
    fontWeight: "500",
  },
  flashSaleList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  flashSaleCard: {
    width: 160,
    marginRight: 12,
    backgroundColor: "#ffffff",
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
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryItem: {
    width: "30%",
    alignItems: "center",
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  categoryEmoji: {
    fontSize: 28,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 12,
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
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

export default HomeScreen;
