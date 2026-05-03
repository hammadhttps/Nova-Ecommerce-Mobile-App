import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { useTheme } from "@/hooks/useTheme";
import FlashSaleScreen from "@/features/home/FlashSaleScreen";
import ForYouScreen from "@/features/home/ForYouScreen";
import RecentScreen from "@/features/home/RecentScreen";
import { Product } from "@/types";

interface TopTabsNavigatorProps {
  navigation: any;
}

const windowWidth = Dimensions.get("window").width;

type Route = {
  key: string;
  title: string;
  icon: string;
};

const routes: Route[] = [
  { key: "flashSale", title: "Flash Sale", icon: "🔥" },
  { key: "forYou", title: "For You", icon: "⭐" },
  { key: "recent", title: "Recent", icon: "🕐" },
];

export default function TopTabsNavigator({
  navigation,
}: TopTabsNavigatorProps) {
  const { isDark } = useTheme();
  const [index, setIndex] = useState(0);

  const handleProductPress = useCallback(
    (product: Product) => {
      navigation.navigate("ProductDetail", { id: product.id });
    },
    [navigation],
  );

  const renderScene = SceneMap({
    flashSale: () => <FlashSaleScreen onProductPress={handleProductPress} />,
    forYou: () => <ForYouScreen onProductPress={handleProductPress} />,
    recent: () => <RecentScreen onProductPress={handleProductPress} />,
  });

  const renderTabBar = useCallback(
    (props: any) => (
      <TabBar
        {...props}
        scrollEnabled
        indicatorStyle={[styles.indicator, { backgroundColor: "#4F46E5" }]}
        style={[
          styles.tabBar,
          { backgroundColor: isDark ? "#0f0f0f" : "#ffffff" },
        ]}
        tabStyle={styles.tabStyle}
        labelStyle={[
          styles.labelStyle,
          { color: isDark ? "#a3a3a3" : "#737373" },
        ]}
        activeColor={isDark ? "#fafafa" : "#111827"}
        pressColor="transparent"
        pressOpacity={0.1}
        renderLabel={({
          route: r,
          focused,
          color,
        }: {
          route: Route;
          focused: boolean;
          color: string;
        }) => (
          <View style={styles.labelContainer}>
            <Text style={styles.tabIcon}>{r.icon}</Text>
            <Text
              style={[
                styles.tabLabel,
                { color: focused ? "#4F46E5" : color },
                { fontWeight: focused ? "700" : "500" },
              ]}
            >
              {r.title}
            </Text>
          </View>
        )}
        gap={0}
      />
    ),
    [isDark],
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      renderTabBar={renderTabBar}
      initialLayout={{ width: windowWidth }}
      lazy
      lazyPreloadDistance={1}
      swipeEnabled
      overdrag={false}
    />
  );
}

const styles = StyleSheet.create({
  tabBar: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  indicator: {
    height: 3,
    borderRadius: 2,
    marginHorizontal: 16,
  },
  tabStyle: {
    width: "auto",
    paddingHorizontal: 16,
  },
  labelStyle: {
    fontSize: 14,
    textTransform: "none",
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  tabIcon: {
    fontSize: 14,
  },
  tabLabel: {
    fontSize: 14,
  },
});
