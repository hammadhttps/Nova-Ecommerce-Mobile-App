import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeScreen } from "@/components/layout/SafeScreen";
import { useTheme } from "@/hooks/useTheme";
import { useAuthStore } from "@/store/auth.store";
import { notificationService } from "@/services/notification.service";
import { Notification } from "@/types";
import {
  ShoppingBag,
  Truck,
  Tag,
  Gift,
  ChevronLeft,
  CheckCheck,
} from "lucide-react-native";

export default function NotificationsScreen({ navigation }: any) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotifications = useCallback(async () => {
    if (!user?.id) return;
    try {
      const data = await notificationService.getFirestoreNotifications(user.id);
      setNotifications(data);
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  }, [user?.id]);

  useEffect(() => {
    setLoading(true);
    loadNotifications().finally(() => setLoading(false));
  }, [loadNotifications]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  }, [loadNotifications]);

  const handleMarkAsRead = useCallback(
    async (id: string) => {
      if (!user?.id) return;
      await notificationService.markAsReadInFirestore(user.id, id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
    },
    [user?.id],
  );

  const handleMarkAllAsRead = useCallback(async () => {
    if (!user?.id) return;
    await notificationService.markAllAsReadInFirestore(user.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, [user?.id]);

  const getIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingBag size={20} color="#9333ea" />;
      case "delivery":
        return <Truck size={20} color="#3b82f6" />;
      case "offer":
      case "price_drop":
        return <Tag size={20} color="#f59e0b" />;
      case "success":
        return <Gift size={20} color="#10b981" />;
      default:
        return <ShoppingBag size={20} color="#9333ea" />;
    }
  };

  const unread = notifications.filter((n) => !n.read);
  const read = notifications.filter((n) => n.read);

  const renderItem = useCallback(
    ({ item }: { item: Notification }) => (
      <TouchableOpacity
        style={[
          styles.card,
          { backgroundColor: isDark ? "#1a1a1a" : "#ffffff" },
          !item.read && { borderLeftWidth: 3, borderLeftColor: "#9333ea" },
        ]}
        onPress={() => handleMarkAsRead(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.iconBox}>{getIcon(item.type)}</View>
        <View style={styles.content}>
          <Text
            style={[
              styles.cardTitle,
              { color: isDark ? "#fafafa" : "#030213" },
            ]}
          >
            {item.title}
          </Text>
          <Text
            style={[styles.message, { color: isDark ? "#a3a3a3" : "#737373" }]}
          >
            {item.message}
          </Text>
          <Text
            style={[styles.time, { color: isDark ? "#737373" : "#a3a3a3" }]}
          >
            {item.time}
          </Text>
        </View>
        {!item.read && <View style={styles.dot} />}
      </TouchableOpacity>
    ),
    [isDark, handleMarkAsRead],
  );

  if (loading) {
    return (
      <SafeScreen>
        <View style={[styles.container, styles.center]}>
          <ActivityIndicator size="large" color="#9333ea" />
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen>
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
            Notifications
          </Text>
          <TouchableOpacity onPress={handleMarkAllAsRead}>
            <CheckCheck size={20} color="#9333ea" />
          </TouchableOpacity>
        </View>
        {notifications.length === 0 ? (
          <View style={[styles.container, styles.center]}>
            <Text
              style={{ color: isDark ? "#737373" : "#a3a3a3", fontSize: 16 }}
            >
              No notifications yet
            </Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
              unread.length > 0 ? (
                <View style={styles.section}>
                  <Text
                    style={[
                      styles.sectionTitle,
                      { color: isDark ? "#a3a3a3" : "#737373" },
                    ]}
                  >
                    Unread ({unread.length})
                  </Text>
                </View>
              ) : null
            }
          />
        )}
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: { fontSize: 20, fontWeight: "700" },
  section: { paddingHorizontal: 20, marginBottom: 8, marginTop: 8 },
  sectionTitle: { fontSize: 14, fontWeight: "600" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  content: { flex: 1, marginLeft: 12 },
  cardTitle: { fontSize: 14, fontWeight: "600" },
  message: { fontSize: 12, marginTop: 2 },
  time: { fontSize: 11, marginTop: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#9333ea" },
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },
});
