import React, { useMemo } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import HomeScreen from "@/features/home/HomeScreen";
import SearchScreen from "@/features/search/SearchScreen";
import WishlistScreen from "@/features/wishlist/WishlistScreen";
import CartScreen from "@/features/cart/CartScreen";
import ProfileScreen from "@/features/profile/ProfileScreen";
import MainSwipeTabBar from "./MainSwipeTabBar";
import { MainTabParamList } from "./types";

const Tab = createMaterialTopTabNavigator<MainTabParamList>();

/**
 * Main app sections with horizontal swipe (material top tabs + tabBar at bottom).
 */
const MainTabs: React.FC = () => {
  const screenOptions = useMemo(
    () => ({
      lazy: true,
      lazyPreloadDistance: 1,
      swipeEnabled: true,
      animationEnabled: true,
    }),
    [],
  );

  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      tabBar={(props) => <MainSwipeTabBar {...props} />}
      screenOptions={screenOptions}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Home" }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ title: "Search" }}
      />
      <Tab.Screen name="Cart" component={CartScreen} options={{ title: "Cart" }} />
      <Tab.Screen
        name="Wishlist"
        component={WishlistScreen}
        options={{ title: "Wishlist" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Profile" }}
      />
    </Tab.Navigator>
  );
};

export default MainTabs;
