import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { Avatar } from "@/components/common";
import { useAuthStore } from "@/store/auth.store";
import { Plus } from "lucide-react-native";

export default React.memo(function OverviewTab({ navigation }: any) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark";
  const { user } = useAuthStore();

  // TODO: Fetch real stats from Firestore
  const stats = [
    { label: "Orders", value: 0 },
    { label: "Wishlist", value: 0 },
    { label: "Reviews", value: 0 },
  ];

  if (!user) return null;

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
        <Avatar size={72} name={user.name} uri={user.avatar} />
        <Text style={[styles.name, { color: isDark ? "#fafafa" : "#030213" }]}>
          {user.name}
        </Text>
        <Text style={[styles.email, { color: isDark ? "#a3a3a3" : "#737373" }]}>
          {user.email}
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
        <TouchableOpacity
          style={[styles.sellButton, { backgroundColor: "#9333ea" }]}
          onPress={() => navigation.navigate("SellProduct")}
        >
          <Plus size={20} color="#fff" />
          <Text style={styles.sellButtonText}>Sell Product</Text>
        </TouchableOpacity>
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
  sellButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 20,
  },
  sellButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
