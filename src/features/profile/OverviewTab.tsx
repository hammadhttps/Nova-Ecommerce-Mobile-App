import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "@/hooks/useTheme";
import { Avatar } from "@/components/common";
import { useAuthStore } from "@/store/auth.store";
import { useWishlist } from "@/hooks/useWishlist";
import { authService } from "@/services/auth.service";
import { orderService } from "@/services/order.service";
import { productService } from "@/services/product.service";
import { Plus, Package, Camera } from "lucide-react-native";

export default React.memo(function OverviewTab({ navigation }: any) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { user, updateUser } = useAuthStore();
  const { wishlistCount } = useWishlist();
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [orderCount, setOrderCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  const fetchStats = useCallback(async () => {
    if (!user?.id) return;
    try {
      const [orders, reviews] = await Promise.all([
        orderService.getOrders(user.id),
        productService.getUserReviews(user.id),
      ]);
      setOrderCount(orders.length);
      setReviewCount(reviews.length);
    } catch (error) {
      console.error("Failed to fetch profile stats:", error);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const stats = [
    { label: "Orders", value: orderCount },
    { label: "Wishlist", value: wishlistCount },
    { label: "Reviews", value: reviewCount },
  ];

  const handlePhotoUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (result.canceled || !result.assets[0]) return;

    setUploadingPhoto(true);
    try {
      const photoURL = await authService.updateProfilePhoto(
        result.assets[0].uri,
      );
      if (user) {
        updateUser({ ...user, avatar: photoURL });
      }
    } catch {
      Alert.alert("Error", "Failed to upload profile photo");
    } finally {
      setUploadingPhoto(false);
    }
  };

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
        <TouchableOpacity onPress={handlePhotoUpload} disabled={uploadingPhoto}>
          {uploadingPhoto ? (
            <View
              style={[
                styles.avatarLoader,
                { backgroundColor: isDark ? "#262626" : "#f0f0f0" },
              ]}
            >
              <ActivityIndicator size="large" color="#9333ea" />
            </View>
          ) : (
            <Avatar size={72} name={user.name} uri={user.avatar} />
          )}
          <View style={styles.cameraBadge}>
            <Camera size={16} color="#fff" />
          </View>
        </TouchableOpacity>
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
        <TouchableOpacity
          style={[
            styles.myProductsButton,
            { borderColor: isDark ? "#404040" : "#e5e5e5" },
          ]}
          onPress={() => navigation.navigate("MyProducts")}
        >
          <Package size={20} color="#9333ea" />
          <Text style={styles.myProductsText}>My Products</Text>
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
  avatarLoader: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#9333ea",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
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
  myProductsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 12,
    width: "100%",
  },
  myProductsText: {
    color: "#9333ea",
    fontSize: 16,
    fontWeight: "600",
  },
});
