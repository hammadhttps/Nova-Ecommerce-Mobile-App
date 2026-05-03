import React, { useCallback, useState } from "react";
import { View, StyleSheet } from "react-native";
import { SafeScreen } from "@/components/layout/SafeScreen";
import { useTheme } from "@/hooks/useTheme";
import TabViewPager, { TabRoute } from "@/navigation/TabViewPager";
import CategoriesTab from "@/features/search/CategoriesTab";
import TrendingTab from "@/features/search/TrendingTab";
import RecentSearchTab from "@/features/search/RecentSearchTab";
import { Product, Category } from "@/types";
import { SceneMap } from "react-native-tab-view";

const routes: TabRoute[] = [
  { key: "categories", title: "Categories", icon: "📂" },
  { key: "trending", title: "Trending", icon: "🔥" },
  { key: "recent", title: "Recent", icon: "🕐" },
];

export default function SearchScreen({ navigation }: { navigation: any }) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark";
  const [query, setQuery] = useState("");

  const handleProductPress = useCallback(
    (product: Product) => {
      navigation.navigate("ProductDetail", { id: product.id });
    },
    [navigation],
  );

  const handleCategoryPress = useCallback(
    (category: Category) => {
      setQuery(category.name);
      navigation.navigate("ProductList", {
        category: category.name,
        title: category.name,
      });
    },
    [navigation],
  );

  const handleSelectSearch = useCallback((term: string) => {
    setQuery(term);
  }, []);

  const renderScene = SceneMap({
    categories: () => <CategoriesTab onCategoryPress={handleCategoryPress} />,
    trending: () => <TrendingTab onProductPress={handleProductPress} />,
    recent: () => <RecentSearchTab onSelectSearch={handleSelectSearch} />,
  });

  return (
    <SafeScreen>
      <View
        style={[
          styles.container,
          { backgroundColor: isDark ? "#0f0f0f" : "#f5f5f5" },
        ]}
      >
        <TabViewPager routes={routes} renderScene={renderScene} />
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
