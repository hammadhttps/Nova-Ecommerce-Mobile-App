import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  NavigationContainer,
  NavigationContainerRef,
} from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./Firebaseconfig";
import RootNavigator from "@/navigation/RootNavigator";
import { ErrorBoundary } from "@/components/common";
import { useAuthStore } from "@/store/auth.store";
import { useThemeStore } from "@/store/theme.store";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { LoadingScreen } from "@/components/common";
import {
  setupForegroundHandler,
  registerForPushNotificationsAsync,
  setupNotificationResponseListener,
  scheduleLocalNotification,
} from "@/services/expoNotificationService";
import { notificationService } from "@/services/notification.service";
import { RootStackParamList } from "@/navigation/types";

const SALE_ANNOUNCEMENTS = [
  "⚡ Flash Sale: Up to 60% off — tonight only!",
  "🔥 Deal of the Day: 50% off on top brands",
  "🎉 New arrivals: Shop the latest trends",
  "🚚 Free shipping on orders over $50",
  "💥 Extra 20% off on all clearance items",
  "🏆 Best-sellers: Up to 40% off",
  "⭐ Summer Special: Buy 2 Get 1 Free",
  "📦 End of Season Sale — Up to 70% off",
];

const PROMO_NOTIFICATIONS = [
  {
    title: "🔥 Flash Sale Alert",
    body: "50% off on Wireless Earbuds Pro. Hurry, limited stock!",
  },
  {
    title: "🎉 New Arrivals",
    body: "Check out the latest trends — just dropped!",
  },
  {
    title: "🚚 Free Shipping",
    body: "Free shipping on all orders over $50. Shop now!",
  },
  { title: "💥 Extra Discount", body: "Use code NOVA20 for an extra 20% off!" },
  {
    title: "🏆 Trending Now",
    body: "Best-sellers you don't want to miss — up to 40% off.",
  },
];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const navigationRef =
  React.createRef<NavigationContainerRef<RootStackParamList>>();

function NotificationInitializer() {
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    setupForegroundHandler();

    const sub = setupNotificationResponseListener(() => {
      navigationRef.current?.navigate("Notifications");
    });

    const setupPush = async () => {
      const token = await registerForPushNotificationsAsync();
      if (token && user?.id) {
        try {
          await setDoc(
            doc(db, "users", user.id),
            { pushToken: token },
            { merge: true },
          );
        } catch {}
      }
    };

    if (user?.id) {
      setupPush();
    }

    const timers: ReturnType<typeof setTimeout>[] = [];

    const announcement = getRandomItem(SALE_ANNOUNCEMENTS);
    timers.push(
      setTimeout(() => {
        scheduleLocalNotification("⚡ Flash Sale", announcement);
      }, 3000),
    );

    const promo = getRandomItem(PROMO_NOTIFICATIONS);
    timers.push(
      setTimeout(() => {
        scheduleLocalNotification(promo.title, promo.body);
      }, 15000),
    );

    if (user?.id) {
      const notif = getRandomItem(PROMO_NOTIFICATIONS);
      timers.push(
        setTimeout(async () => {
          await notificationService.createNotification(user.id, {
            type: "offer",
            title: notif.title,
            message: notif.body,
            time: new Date().toISOString(),
            read: false,
          });
        }, 5000),
      );
    }

    return () => {
      sub.remove();
      timers.forEach(clearTimeout);
    };
  }, [user?.id]);

  return null;
}

const AppContent: React.FC = () => {
  const [isReady, setIsReady] = useState(false);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const initializeTheme = useThemeStore((state) => state.initializeTheme);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const fetchWishlist = useWishlistStore((state) => state.fetchWishlist);
  const resolvedTheme = useThemeStore((state) => state.resolvedTheme);

  useEffect(() => {
    const init = async () => {
      await Promise.all([initializeAuth(), initializeTheme()]);
      await Promise.all([fetchCart(), fetchWishlist()]);
      setIsReady(true);
    };
    init();
  }, []);

  if (!isReady) {
    return <LoadingScreen fullScreen />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <NavigationContainer ref={navigationRef}>
            <StatusBar
              style={resolvedTheme === "dark" ? "light" : "dark"}
              backgroundColor="transparent"
              translucent
            />
            <NotificationInitializer />
            <RootNavigator />
          </NavigationContainer>
        </ErrorBoundary>
        <Toast />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default function App() {
  return <AppContent />;
}
