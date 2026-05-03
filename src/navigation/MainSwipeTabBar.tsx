import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import type { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Home,
  Search,
  Heart,
  ShoppingCart,
  User,
} from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";
import { useCart } from "@/hooks/useCart";
import type { MainTabParamList } from "./types";

const ACTIVE: Record<keyof MainTabParamList, string> = {
  Home: "#6366F1",
  Search: "#0EA5E9",
  Cart: "#F59E0B",
  Wishlist: "#EC4899",
  Profile: "#A855F7",
};

const ICONS: Record<
  keyof MainTabParamList,
  React.ComponentType<{ size: number; color: string }>
> = {
  Home,
  Search,
  Cart: ShoppingCart,
  Wishlist: Heart,
  Profile: User,
};

const SHORT_LABEL: Record<keyof MainTabParamList, string> = {
  Home: "Home",
  Search: "Search",
  Cart: "Cart",
  Wishlist: "Wishlist",
  Profile: "Profile",
};

/**
 * Bottom bar for the main swipeable tab navigator (Home, Search, Cart, Wishlist, Profile).
 */
export default function MainSwipeTabBar({
  state,
  navigation,
}: MaterialTopTabBarProps) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { cartCount } = useCart();

  const inactive = isDark ? "#64748b" : "#94a3b8";
  const barBg = isDark ? "#0f1117" : "#f8fafc";
  const borderTop = isDark ? "#1e293b" : "#e2e8f0";

  return (
    <View style={styles.shadowHost}>
      <View style={styles.accentStrip}>
        {(Object.keys(ACTIVE) as (keyof MainTabParamList)[]).map((key) => (
          <View
            key={key}
            style={[styles.stripSegment, { backgroundColor: ACTIVE[key] }]}
          />
        ))}
      </View>
      <View
        style={[
          styles.bar,
          {
            paddingBottom: Math.max(insets.bottom, 8),
            backgroundColor: barBg,
            borderTopColor: borderTop,
          },
        ]}
      >
        {state.routes.map((route, index) => {
          const name = route.name as keyof MainTabParamList;
          const isFocused = state.index === index;
          const accent = ACTIVE[name];
          const color = isFocused ? accent : inactive;
          const Icon = ICONS[name];

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const tabPill: StyleProp<ViewStyle> = isFocused
            ? {
                backgroundColor: isDark ? `${accent}22` : `${accent}18`,
              }
            : undefined;

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={{ selected: isFocused }}
              onPress={onPress}
              style={({ pressed }) => [
                styles.tab,
                tabPill,
                { borderRadius: 14 },
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.iconWrap}>
                <Icon size={22} color={color} />
                {name === "Cart" && cartCount > 0 ? (
                  <View style={[styles.badge, { borderColor: barBg }]}>
                    <Text style={styles.badgeText}>
                      {cartCount > 99 ? "99+" : String(cartCount)}
                    </Text>
                  </View>
                ) : null}
              </View>
              <Text
                style={[styles.label, { color }]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.75}
              >
                {SHORT_LABEL[name]}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowHost: {
    backgroundColor: "transparent",
  },
  accentStrip: {
    flexDirection: "row",
    height: 3,
  },
  stripSegment: {
    flex: 1,
  },
  bar: {
    flexDirection: "row",
    alignItems: "stretch",
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 6,
    paddingHorizontal: 2,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    marginHorizontal: 1,
    minWidth: 0,
  },
  pressed: {
    opacity: 0.88,
  },
  iconWrap: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    right: -12,
    top: -8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#f43f5e",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    borderWidth: 2,
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    marginTop: 4,
    letterSpacing: -0.2,
  },
  badgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "800",
  },
});
