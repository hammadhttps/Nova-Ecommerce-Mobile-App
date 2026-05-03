import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { Avatar } from "@/components/common";
import { useAuthStore } from "@/store/auth.store";

export default React.memo(function OverviewTab() {
  const { isDark } = useTheme();
  const { user } = useAuthStore();

  const stats = [
    { label: "Orders", value: 24 },
    { label: "Wishlist", value: 12 },
    { label: "Reviews", value: 8 },
  ];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#0f0f0f" : "#f5f5f5" },
      ]}
    >
      <View
        style={[
          styles.card,
          { backgroundColor: isDark ? "#1a1a1a" : "#ffffff" },
        ]}
      >
        <Avatar size={72} name={user?.name || "User"} uri={user?.avatar} />
        <Text style={[styles.name, { color: isDark ? "#fafafa" : "#030213" }]}>
          {user?.name || "Alex Johnson"}
        </Text>
        <Text style={[styles.email, { color: isDark ? "#a3a3a3" : "#737373" }]}>
          {user?.email || "alex@email.com"}
        </Text>
        <View style={styles.stats}>
          {stats.map((s, i) => (
            <View key={i} style={styles.statItem}>
              <Text
                style={[
                  styles.statVal,
                  { color: isDark ? "#fafafa" : "#030213" },
                ]}
              >
                {s.value}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: isDark ? "#a3a3a3" : "#737373" },
                ]}
              >
                {s.label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: {
    alignItems: "center",
    padding: 24,
    margin: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  name: { fontSize: 22, fontWeight: "700", marginTop: 12 },
  email: { fontSize: 14, marginTop: 4 },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  statItem: { alignItems: "center" },
  statVal: { fontSize: 20, fontWeight: "700" },
  statLabel: { fontSize: 12, marginTop: 4 },
});
