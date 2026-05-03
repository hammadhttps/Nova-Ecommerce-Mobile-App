import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { Clock, X } from "lucide-react-native";
import { Button } from "@/components/common";

const initialRecentSearches = [
  "Wireless Earbuds",
  "Running Shoes",
  "Smart Watch",
  "Sunglasses",
  "Laptop Stand",
  "Desk Lamp",
];

interface RecentSearchTabProps {
  onSelectSearch: (query: string) => void;
}

export default React.memo(function RecentSearchTab({
  onSelectSearch,
}: RecentSearchTabProps) {
  const { isDark } = useTheme();
  const [searches, setSearches] = useState(initialRecentSearches);

  const handleClearAll = useCallback(() => {
    setSearches([]);
  }, []);

  const handleRemove = useCallback((index: number) => {
    setSearches((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const renderItem = useCallback(
    ({ item, index }: { item: string; index: number }) => (
      <TouchableOpacity
        style={styles.item}
        onPress={() => onSelectSearch(item)}
        activeOpacity={0.7}
      >
        <View style={styles.row}>
          <Clock size={18} color={isDark ? "#a3a3a3" : "#737373"} />
          <Text
            style={[styles.label, { color: isDark ? "#fafafa" : "#030213" }]}
            numberOfLines={1}
          >
            {item}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.removeBtn}
          onPress={() => handleRemove(index)}
          activeOpacity={0.6}
        >
          <X size={16} color={isDark ? "#525252" : "#d4d4d4"} />
        </TouchableOpacity>
      </TouchableOpacity>
    ),
    [isDark, onSelectSearch, handleRemove],
  );

  if (searches.length === 0) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: isDark ? "#0f0f0f" : "#f5f5f5" },
        ]}
      >
        <View style={styles.empty}>
          <Clock size={48} color={isDark ? "#525252" : "#d4d4d4"} />
          <Text
            style={[
              styles.emptyText,
              { color: isDark ? "#a3a3a3" : "#737373" },
            ]}
          >
            No recent searches
          </Text>
        </View>
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
          Recent Searches
        </Text>
        <Button onPress={handleClearAll} variant="ghost" size="sm">
          Clear All
        </Button>
      </View>
      <FlatList
        data={searches}
        renderItem={renderItem}
        keyExtractor={(item) => item}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: { fontSize: 16, fontWeight: "700" },
  listContent: { paddingHorizontal: 16 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  row: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  label: { fontSize: 15 },
  removeBtn: { padding: 4 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyText: { fontSize: 16, marginTop: 12 },
});
