import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeScreen } from "@/components/layout/SafeScreen";
import { useTheme } from "@/hooks/useTheme";
import { Input } from "@/components/common/Input";
import {
  Search,
  MessageCircle,
  Phone,
  Mail,
  Package,
  CreditCard,
  User,
  ShoppingBag,
  ChevronRight,
  ChevronLeft,
} from "lucide-react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Help">;

const categories = [
  {
    icon: Package,
    title: "Orders",
    description: "Track, return, and manage orders",
  },
  {
    icon: CreditCard,
    title: "Payment",
    description: "Payment methods and billing issues",
  },
  {
    icon: User,
    title: "Account",
    description: "Profile, security, and settings",
  },
  {
    icon: ShoppingBag,
    title: "Products",
    description: "Product info, warranty, and returns",
  },
];

const contacts = [
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Chat with our support team",
    color: "#9333ea",
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "Call us at +1 234 567 8900",
    color: "#10b981",
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "Email us at support@nova.com",
    color: "#3b82f6",
  },
];

export default function HelpScreen({ navigation }: Props) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark";
  const [query, setQuery] = useState("");

  return (
    <SafeScreen hasScrollView keyboardAware>
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
            Help Center
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <Input
          placeholder="Search help articles..."
          value={query}
          onChangeText={setQuery}
          containerStyle={styles.searchContainer}
          leftIcon={<Search size={20} color={isDark ? "#737373" : "#a3a3a3"} />}
        />

        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: isDark ? "#fafafa" : "#030213" },
            ]}
          >
            Categories
          </Text>
          <View style={styles.catGrid}>
            {categories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.catCard,
                    { backgroundColor: isDark ? "#1a1a1a" : "#ffffff" },
                  ]}
                  activeOpacity={0.7}
                >
                  <View
                    style={[styles.catIconBg, { backgroundColor: "#9333ea20" }]}
                  >
                    <Icon size={24} color="#9333ea" />
                  </View>
                  <Text
                    style={[
                      styles.catTitle,
                      { color: isDark ? "#fafafa" : "#030213" },
                    ]}
                  >
                    {cat.title}
                  </Text>
                  <Text
                    style={[
                      styles.catDesc,
                      { color: isDark ? "#a3a3a3" : "#737373" },
                    ]}
                  >
                    {cat.description}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: isDark ? "#fafafa" : "#030213" },
            ]}
          >
            Contact Us
          </Text>
          <View
            style={[
              styles.contactList,
              { backgroundColor: isDark ? "#1a1a1a" : "#ffffff" },
            ]}
          >
            {contacts.map((c, i) => {
              const Icon = c.icon;
              return (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.contactItem,
                    i < contacts.length - 1 && {
                      borderBottomColor: isDark ? "#262626" : "#f0f0f0",
                      borderBottomWidth: 1,
                    },
                  ]}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.contactIconBg,
                      { backgroundColor: c.color + "20" },
                    ]}
                  >
                    <Icon size={20} color={c.color} />
                  </View>
                  <View style={styles.contactInfo}>
                    <Text
                      style={[
                        styles.contactTitle,
                        { color: isDark ? "#fafafa" : "#030213" },
                      ]}
                    >
                      {c.title}
                    </Text>
                    <Text
                      style={[
                        styles.contactDesc,
                        { color: isDark ? "#a3a3a3" : "#737373" },
                      ]}
                    >
                      {c.description}
                    </Text>
                  </View>
                  <ChevronRight
                    size={20}
                    color={isDark ? "#737373" : "#a3a3a3"}
                  />
                </TouchableOpacity>
              );
            })}
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
  searchContainer: { marginHorizontal: 20, marginBottom: 20 },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: "700", marginBottom: 16 },
  catGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  catCard: {
    width: "47%",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  catIconBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  catTitle: { fontSize: 14, fontWeight: "600", textAlign: "center" },
  catDesc: { fontSize: 12, textAlign: "center", marginTop: 4 },
  contactList: {
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  contactItem: { flexDirection: "row", alignItems: "center", padding: 16 },
  contactIconBg: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  contactInfo: { flex: 1, marginLeft: 12 },
  contactTitle: { fontSize: 16, fontWeight: "600" },
  contactDesc: { fontSize: 12, marginTop: 2 },
});
