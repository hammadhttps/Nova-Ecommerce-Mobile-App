import React, { useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ChevronRight, User } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";
import { useAuthStore } from "@/store/auth.store";
import { Avatar } from "@/components/common";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HomeProfileTabScreen: React.FC = React.memo(
  function HomeProfileTabScreen() {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";
    const navigation = useNavigation();
    const { user } = useAuthStore();
    const insets = useSafeAreaInsets();

    const openMainProfile = useCallback(() => {
      navigation.navigate("Profile" as never);
    }, [navigation]);

    const name = user?.name ?? "User";
    const email = user?.email ?? "";

    return (
      <View
        style={[
          styles.safe,
          {
            backgroundColor: isDark ? "#0f0f0f" : "#f5f5f5",
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          },
        ]}
      >
        <View
          style={[
            styles.card,
            { backgroundColor: isDark ? "#1a1a1a" : "#ffffff" },
          ]}
        >
          <Avatar size={72} name={name} uri={user?.avatar} />
          <Text
            style={[styles.name, { color: isDark ? "#fafafa" : "#030213" }]}
          >
            {name}
          </Text>
          <Text
            style={[styles.email, { color: isDark ? "#a3a3a3" : "#737373" }]}
          >
            {email}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.row,
            { backgroundColor: isDark ? "#1a1a1a" : "#ffffff" },
          ]}
          onPress={openMainProfile}
          activeOpacity={0.7}
        >
          <View style={styles.rowLeft}>
            <User size={22} color={isDark ? "#fafafa" : "#111827"} />
            <Text
              style={[
                styles.rowLabel,
                { color: isDark ? "#fafafa" : "#030213" },
              ]}
            >
              Full profile & settings
            </Text>
          </View>
          <ChevronRight size={22} color={isDark ? "#737373" : "#a3a3a3"} />
        </TouchableOpacity>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  card: {
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 12,
  },
  email: {
    fontSize: 14,
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default HomeProfileTabScreen;
