import React, { useMemo } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTheme } from "@/hooks/useTheme";
import { HomeTopTabParamList } from "./types";
import HomeFeedScreen from "@/features/home-tabs/HomeFeedScreen";
import ListingsScreen from "@/features/home-tabs/ListingsScreen";
import HomeProfileTabScreen from "@/features/home-tabs/HomeProfileTabScreen";

const Tab = createMaterialTopTabNavigator<HomeTopTabParamList>();

const TAB_ACCENT = {
  feed: "#6366F1",
  listings: "#0EA5E9",
  profile: "#A855F7",
} as const;

/**
 * Swipeable top tabs inside Home (React Navigation material tabs + pager).
 */
const TopTabsNavigator: React.FC = () => {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark";

  const screenOptions = useMemo(
    () => ({
      lazy: true,
      lazyPreloadDistance: 1,
      tabBarScrollEnabled: true,
      tabBarIndicatorStyle: {
        height: 3,
        borderRadius: 2,
        backgroundColor: isDark ? "#818cf8" : TAB_ACCENT.feed,
      },
      tabBarLabelStyle: {
        fontWeight: "600" as const,
        fontSize: 14,
        textTransform: "none" as const,
      },
      tabBarActiveTintColor: isDark ? "#e2e8f0" : "#0f172a",
      tabBarInactiveTintColor: isDark ? "#64748b" : "#64748b",
      tabBarStyle: {
        backgroundColor: isDark ? "#111827" : "#f1f5f9",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        borderBottomWidth: 1,
        borderBottomColor: isDark ? "#334155" : "#cbd5e1",
      },
      tabBarPressColor: "transparent",
      swipeEnabled: true,
    }),
    [isDark],
  );

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="Feed"
        component={HomeFeedScreen}
        options={{
          title: "Home",
          tabBarActiveTintColor: isDark ? "#a5b4fc" : TAB_ACCENT.feed,
        }}
      />
      <Tab.Screen
        name="Listings"
        component={ListingsScreen}
        options={{
          tabBarActiveTintColor: isDark ? "#38bdf8" : TAB_ACCENT.listings,
        }}
      />
      <Tab.Screen
        name="HomeProfile"
        component={HomeProfileTabScreen}
        options={{
          title: "Profile",
          tabBarActiveTintColor: isDark ? "#c084fc" : TAB_ACCENT.profile,
        }}
      />
    </Tab.Navigator>
  );
};

export default TopTabsNavigator;
