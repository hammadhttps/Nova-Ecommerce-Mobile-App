import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "@/hooks/useTheme";
import {
  ChevronRight,
  Bell,
  Shield,
  Moon,
  Globe,
  Info,
  LogOut,
  MapPin,
} from "lucide-react-native";
import { LucideIcon } from "lucide-react-native";

const settingsItems: { icon: LucideIcon; label: string; value?: string }[] = [
  { icon: Bell, label: "Notifications", value: "On" },
  { icon: MapPin, label: "Addresses" },
  { icon: Moon, label: "Dark Mode" },
  { icon: Globe, label: "Language", value: "English" },
  { icon: Shield, label: "Privacy & Security" },
  { icon: Info, label: "About", value: "v1.0.0" },
];

interface SettingsTabProps {
  onToggleDarkMode: () => void;
  onLogout: () => void;
  onPress: (label: string) => void;
}

export default React.memo(function SettingsTab({
  onToggleDarkMode,
  onLogout,
  onPress,
}: SettingsTabProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const renderItem = useCallback(
    ({
      item,
      index,
    }: {
      item: { icon: LucideIcon; label: string; value?: string };
      index: number;
    }) => {
      const Icon = item.icon;
      return (
        <TouchableOpacity
          style={[
            styles.item,
            index < settingsItems.length - 1 && {
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderBottomColor: isDark ? "#333333" : "#f0f0f0",
            },
          ]}
          onPress={() => {
            if (item.label === "Dark Mode") {
              onToggleDarkMode();
            } else {
              onPress(item.label);
            }
          }}
          activeOpacity={0.7}
        >
          <Icon size={20} color={isDark ? "#fafafa" : "#030213"} />
          <Text
            style={[styles.label, { color: isDark ? "#fafafa" : "#030213" }]}
          >
            {item.label}
          </Text>
          {item.value && (
            <Text
              style={[styles.value, { color: isDark ? "#737373" : "#a3a3a3" }]}
            >
              {item.value}
            </Text>
          )}
          <ChevronRight size={18} color={isDark ? "#737373" : "#a3a3a3"} />
        </TouchableOpacity>
      );
    },
    [isDark, onToggleDarkMode, onPress],
  );

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
        <FlatList
          data={settingsItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.label}
          showsVerticalScrollIndicator={false}
          windowSize={5}
          maxToRenderPerBatch={10}
          removeClippedSubviews
        />
      </View>
      <TouchableOpacity
        style={[
          styles.logoutBtn,
          { backgroundColor: isDark ? "#1a1a1a" : "#ffffff" },
        ]}
        onPress={onLogout}
        activeOpacity={0.7}
      >
        <LogOut size={20} color="#ef4444" />
        <Text style={styles.logoutLabel}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: {
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  label: { flex: 1, marginLeft: 14, fontSize: 15 },
  value: { fontSize: 13, marginRight: 8 },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logoutLabel: { color: "#ef4444", fontSize: 15, fontWeight: "600" },
});
