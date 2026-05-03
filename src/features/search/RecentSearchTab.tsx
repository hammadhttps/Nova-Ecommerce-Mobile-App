import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Trash2, Search } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";
import { useAuthStore } from "@/store/auth.store";
import { searchService, RecentSearch } from "@/services/search.service";

interface RecentSearchTabProps {
  onSelectSearch: (term: string) => void;
}

export default function RecentSearchTab({
  onSelectSearch,
}: RecentSearchTabProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { user } = useAuthStore();
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const loadRecentSearches = async () => {
      try {
        const searches = await searchService.getRecentSearches(user.id);
        setRecentSearches(searches);
      } catch (error) {
        console.error("Failed to load recent searches:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRecentSearches();
  }, [user?.id]);

  const handleClearAll = useCallback(async () => {
    if (!user?.id) return;
    try {
      await searchService.clearRecentSearches(user.id);
      setRecentSearches([]);
    } catch (error) {
      console.error("Failed to clear recent searches:", error);
    }
  }, [user?.id]);

  const handleRemoveItem = useCallback(async (searchId: string) => {
    try {
      await searchService.removeRecentSearch(searchId);
      setRecentSearches((prev) => prev.filter((item) => item.id !== searchId));
    } catch (error) {
      console.error("Failed to remove recent search:", error);
    }
  }, []);

  const handleSelectSearch = useCallback(
    (term: string) => {
      onSelectSearch(term);
    },
    [onSelectSearch],
  );

  if (loading) {
    return (
      <View
        style={[
          styles.center,
          { backgroundColor: isDark ? "#0f0f0f" : "#f5f5f5" },
        ]}
      >
        <ActivityIndicator size="small" color="#9333ea" />
      </View>
    );
  }

  if (!user?.id) {
    return (
      <View
        style={[
          styles.container,
          styles.center,
          { backgroundColor: isDark ? "#0f0f0f" : "#f5f5f5" },
        ]}
      >
        <Text
          style={[styles.emptyText, { color: isDark ? "#a3a3a3" : "#737373" }]}
        >
          Login to save and view recent searches
        </Text>
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
      {recentSearches.length > 0 && (
        <View style={styles.header}>
          <Text
            style={[styles.title, { color: isDark ? "#fafafa" : "#030213" }]}
          >
            Recent Searches
          </Text>
          <TouchableOpacity onPress={handleClearAll} activeOpacity={0.7}>
            <Text style={styles.clearAll}>Clear All</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={recentSearches}
        keyExtractor={(item) => item.id}
        renderItem={useCallback(
          ({ item }: { item: RecentSearch }) => (
            <TouchableOpacity
              style={[
                styles.searchItem,
                { backgroundColor: isDark ? "#1a1a1a" : "#ffffff" },
              ]}
              onPress={() => handleSelectSearch(item.term)}
              activeOpacity={0.7}
            >
              <View style={styles.left}>
                <Search size={18} color={isDark ? "#737373" : "#a3a3a3"} />
                <Text
                  style={[
                    styles.term,
                    { color: isDark ? "#fafafa" : "#030213" },
                  ]}
                  numberOfLines={1}
                >
                  {item.term}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleRemoveItem(item.id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Trash2 size={16} color={isDark ? "#737373" : "#a3a3a3"} />
              </TouchableOpacity>
            </TouchableOpacity>
          ),
          [isDark, handleSelectSearch, handleRemoveItem],
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        windowSize={5}
        maxToRenderPerBatch={10}
        removeClippedSubviews
        ListEmptyComponent={
          <View style={styles.center}>
            <Text
              style={[
                styles.emptyText,
                { color: isDark ? "#a3a3a3" : "#737373" },
              ]}
            >
              No recent searches yet
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { alignItems: "center", justifyContent: "center", padding: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: { fontSize: 18, fontWeight: "600" },
  clearAll: { color: "#9333ea", fontSize: 14, fontWeight: "500" },
  listContent: { paddingHorizontal: 16, paddingTop: 8, flexGrow: 1 },
  searchItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
  },
  left: { flexDirection: "row", alignItems: "center", flex: 1, gap: 12 },
  term: { fontSize: 15, flex: 1 },
  emptyText: { fontSize: 15 },
});
