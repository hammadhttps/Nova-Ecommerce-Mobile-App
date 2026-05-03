import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Search } from "lucide-react-native";
import { SafeScreen } from "@/components/layout/SafeScreen";
import { Skeleton } from "@/components/common";
import { useTheme } from "@/hooks/useTheme";
import { useCart } from "@/hooks/useCart";
import TopTabsNavigator from "@/navigation/TopTabsNavigator";
import {
  flashSaleProducts,
  forYouProducts,
  recentProducts,
} from "@/services/mocks/products";

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
    (product: { id: number }) => {
      navigation.navigate("ProductDetail", { id: product.id });
    },
    [navigation],
  );

  if (loading) {
    return (
      <SafeScreen loading={false}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Skeleton width={150} height={28} />
            <Skeleton width={100} height={16} />
          </View>
          <Skeleton height={48} borderRadius={12} />
          <View style={{ marginTop: 24, paddingHorizontal: 16 }}>
            <Skeleton width={120} height={24} />
          </View>
        </View>
      </SafeScreen>
    );
  }

  const totalItems =
    flashSaleProducts.length + forYouProducts.length + recentProducts.length;

  return (
    <SafeScreen>
      <View
        style={[
          styles.container,
          { backgroundColor: isDark ? "#0f0f0f" : "#f5f5f5" },
        ]}
      >
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
            style={[
              styles.searchButton,
              { backgroundColor: isDark ? "#1a1a1a" : "#f5f5f5" },
            ]}
            onPress={() => navigation.navigate("Search")}
          >
            <Search size={20} color={isDark ? "#fafafa" : "#030213"} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.searchBar,
            { backgroundColor: isDark ? "#1a1a1a" : "#ffffff" },
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

        <View style={styles.badgeRow}>
          <View
            style={[
              styles.badge,
              { backgroundColor: isDark ? "#1a1a1a" : "#ffffff" },
            ]}
          >
            <Text
              style={[
                styles.badgeLabel,
                { color: isDark ? "#a3a3a3" : "#737373" },
              ]}
            >
              {totalItems} items
            </Text>
          </View>
        </View>

        <View style={styles.tabsContainer}>
          <TopTabsNavigator navigation={navigation} />
        </View>
      </View>
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
  badgeRow: {
    paddingHorizontal: 16,
    marginTop: 12,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeLabel: {
    fontSize: 13,
    fontWeight: "600",
  },
  tabsContainer: {
    flex: 1,
    marginTop: 8,
  },
});

export default HomeScreen;
