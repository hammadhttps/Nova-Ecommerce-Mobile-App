import React, { useCallback, useState } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Search, X } from "lucide-react-native";
import { SafeScreen } from "@/components/layout/SafeScreen";
import { useTheme } from "@/hooks/useTheme";
import TabViewPager, { TabRoute } from "@/navigation/TabViewPager";
import CategoriesTab from "@/features/search/CategoriesTab";
import TrendingTab from "@/features/search/TrendingTab";
import RecentSearchTab from "@/features/search/RecentSearchTab";
import { Product, Category } from "@/types";
import { SceneMap } from "react-native-tab-view";
import { useAuthStore } from "@/store/auth.store";
import { searchService } from "@/services/search.service";

const routes: TabRoute[] = [
  { key: "categories", title: "Categories", icon: "📂" },
  { key: "trending", title: "Trending", icon: "🔥" },
  { key: "recent", title: "Recent", icon: "🕐" },
];

export default function SearchScreen({ navigation }: { navigation: any }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [query, setQuery] = useState("");
  const { user } = useAuthStore();

  const handleProductPress = useCallback(
    (product: Product) => {
      navigation.navigate("ProductDetail", { id: product.id });
    },
    [navigation],
  );

  const handleCategoryPress = useCallback(
    (category: Category) => {
      navigation.navigate("SearchResults", {
        category: category.name,
      });
    },
    [navigation],
  );

  const handleSelectSearch = useCallback((term: string) => {
    setQuery(term);
    handleSearch();
  }, []);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;

    // Save to recent searches if authenticated
    if (user?.id) {
      try {
        await searchService.addRecentSearch(user.id, query.trim());
      } catch (error) {
        console.error("Failed to save recent search:", error);
      }
    }

    // Navigate to search results
    navigation.navigate("SearchResults", {
      query: query.trim(),
    });
  }, [query, user, navigation]);

  const clearQuery = useCallback(() => {
    setQuery("");
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
        {/* Search Input */}
        <View style={styles.searchContainer}>
          <View
            style={[
              styles.searchBox,
              {
                backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
                borderColor: isDark ? "#333333" : "#e5e5e5",
              },
            ]}
          >
            <Search size={20} color={isDark ? "#a3a3a3" : "#737373"} />
            <TextInput
              style={[styles.input, { color: isDark ? "#fafafa" : "#030213" }]}
              placeholder="Search products..."
              placeholderTextColor={isDark ? "#737373" : "#a3a3a3"}
              value={query}
              onChangeText={setQuery}
              returnKeyType="search"
              onSubmitEditing={handleSearch}
              autoFocus={false}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={clearQuery} style={styles.clearButton}>
                <X size={18} color={isDark ? "#a3a3a3" : "#737373"} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={[styles.searchButton, { backgroundColor: "#9333ea" }]}
            onPress={handleSearch}
            activeOpacity={0.7}
          >
            <Search size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* tabs */}
        <View style={styles.tabContainer}>
          <TabViewPager routes={routes} renderScene={renderScene} />
        </View>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  clearButton: {
    padding: 4,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  tabContainer: {
    flex: 1,
  },
});
