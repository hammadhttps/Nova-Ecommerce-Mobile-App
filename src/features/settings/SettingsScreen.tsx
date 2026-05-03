import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import { SafeScreen } from "@/components/layout/SafeScreen";
import { useTheme } from "@/hooks/useTheme";
import {
  ChevronRight,
  Globe,
  Lock,
  Shield,
  Bell,
  Moon,
  ChevronLeft,
} from "lucide-react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Settings">;

export default function SettingsScreen({ navigation }: Props) {
  const { isDark, toggleTheme } = useTheme();
  const [pushNotifications, setPushNotifications] = useState(true);

  return (
    <SafeScreen hasScrollView>
      <View
        style={[
          styles.container,
          { backgroundColor: isDark ? "#0f0f0f" : "#f5f5f5" },
        ]}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color={isDark ? "#fafafa" : "#030213"} />
          </TouchableOpacity>
          <Text
            style={[styles.title, { color: isDark ? "#fafafa" : "#030213" }]}
          >
            Settings
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.group}>
          <Text
            style={[
              styles.groupTitle,
              { color: isDark ? "#a3a3a3" : "#737373" },
            ]}
          >
            Appearance
          </Text>
          <View
            style={[
              styles.card,
              { backgroundColor: isDark ? "#1a1a1a" : "#ffffff" },
            ]}
          >
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Moon size={20} color="#9333ea" />
                <Text
                  style={[
                    styles.label,
                    { color: isDark ? "#fafafa" : "#030213" },
                  ]}
                >
                  Dark Mode
                </Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: "#d4d4d4", true: "#9333ea" }}
                thumbColor="#ffffff"
              />
            </View>
          </View>
        </View>

        <View style={styles.group}>
          <Text
            style={[
              styles.groupTitle,
              { color: isDark ? "#a3a3a3" : "#737373" },
            ]}
          >
            Notifications
          </Text>
          <View
            style={[
              styles.card,
              { backgroundColor: isDark ? "#1a1a1a" : "#ffffff" },
            ]}
          >
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Bell size={20} color="#9333ea" />
                <Text
                  style={[
                    styles.label,
                    { color: isDark ? "#fafafa" : "#030213" },
                  ]}
                >
                  Push Notifications
                </Text>
              </View>
              <Switch
                value={pushNotifications}
                onValueChange={setPushNotifications}
                trackColor={{ false: "#d4d4d4", true: "#9333ea" }}
                thumbColor="#ffffff"
              />
            </View>
          </View>
        </View>

        <View style={styles.group}>
          <Text
            style={[
              styles.groupTitle,
              { color: isDark ? "#a3a3a3" : "#737373" },
            ]}
          >
            Account
          </Text>
          <View
            style={[
              styles.card,
              { backgroundColor: isDark ? "#1a1a1a" : "#ffffff" },
            ]}
          >
            <TouchableOpacity style={styles.row} activeOpacity={0.7}>
              <View style={styles.rowLeft}>
                <Globe size={20} color="#9333ea" />
                <Text
                  style={[
                    styles.label,
                    { color: isDark ? "#fafafa" : "#030213" },
                  ]}
                >
                  Language
                </Text>
              </View>
              <ChevronRight size={20} color={isDark ? "#737373" : "#a3a3a3"} />
            </TouchableOpacity>
            <View
              style={[
                styles.divider,
                { backgroundColor: isDark ? "#262626" : "#f0f0f0" },
              ]}
            />
            <TouchableOpacity style={styles.row} activeOpacity={0.7}>
              <View style={styles.rowLeft}>
                <Lock size={20} color="#9333ea" />
                <Text
                  style={[
                    styles.label,
                    { color: isDark ? "#fafafa" : "#030213" },
                  ]}
                >
                  Change Password
                </Text>
              </View>
              <ChevronRight size={20} color={isDark ? "#737373" : "#a3a3a3"} />
            </TouchableOpacity>
            <View
              style={[
                styles.divider,
                { backgroundColor: isDark ? "#262626" : "#f0f0f0" },
              ]}
            />
            <TouchableOpacity style={styles.row} activeOpacity={0.7}>
              <View style={styles.rowLeft}>
                <Shield size={20} color="#9333ea" />
                <Text
                  style={[
                    styles.label,
                    { color: isDark ? "#fafafa" : "#030213" },
                  ]}
                >
                  Privacy Policy
                </Text>
              </View>
              <ChevronRight size={20} color={isDark ? "#737373" : "#a3a3a3"} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.group}>
          <Text
            style={[
              styles.groupTitle,
              { color: isDark ? "#a3a3a3" : "#737373" },
            ]}
          >
            About
          </Text>
          <View
            style={[
              styles.card,
              { backgroundColor: isDark ? "#1a1a1a" : "#ffffff" },
            ]}
          >
            <View style={styles.row}>
              <Text
                style={[
                  styles.label,
                  { color: isDark ? "#fafafa" : "#030213" },
                ]}
              >
                App Version
              </Text>
              <Text
                style={[
                  styles.value,
                  { color: isDark ? "#a3a3a3" : "#737373" },
                ]}
              >
                v1.0.0
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingBottom: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: { fontSize: 20, fontWeight: "700" },
  group: { marginBottom: 24, paddingHorizontal: 20 },
  groupTitle: { fontSize: 14, fontWeight: "600", marginBottom: 8 },
  card: {
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  label: { fontSize: 16 },
  value: { fontSize: 14 },
  divider: { height: 1 },
});
