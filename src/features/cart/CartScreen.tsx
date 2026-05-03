import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeScreen } from "@/components/layout/SafeScreen";
import { useTheme } from "@/hooks/useTheme";
import { useCart } from "@/hooks/useCart";
import { Button, Input, EmptyState } from "@/components/common";
import TabViewPager, { TabRoute } from "@/navigation/TabViewPager";
import InCartTab from "@/features/cart/InCartTab";
import SavedForLaterTab from "@/features/cart/SavedForLaterTab";
import { CartItem, Product } from "@/types";
import { SceneMap } from "react-native-tab-view";

const routes: TabRoute[] = [
  { key: "inCart", title: "In Cart" },
  { key: "saved", title: "Saved" },
];

export default function CartScreen({ navigation }: { navigation: any }) {
  const { isDark } = useTheme();
  const {
    items,
    cartLoading,
    promoCode,
    applyPromoCode,
    promoMessage,
    updateQuantity,
    removeFromCart,
    subtotal,
    shipping,
    total,
    addToCart,
  } = useCart();
  const [code, setCode] = useState("");

  const handleProductPress = useCallback(
    (item: CartItem | Product) => {
      navigation.navigate("ProductDetail", { id: item.id });
    },
    [navigation],
  );

  const handleMoveToCart = useCallback(
    (product: Product) => {
      addToCart(product, 1);
    },
    [addToCart],
  );

  const handleApplyPromo = () => {
    applyPromoCode(code);
  };

  const renderScene = SceneMap({
    inCart: () => (
      <InCartTab
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onProductPress={handleProductPress}
      />
    ),
    saved: () => (
      <SavedForLaterTab
        onMoveToCart={handleMoveToCart}
        onProductPress={handleProductPress}
      />
    ),
  });

  if (cartLoading) {
    return <SafeScreen loading />;
  }

  if (items.length === 0) {
    return (
      <SafeScreen>
        <View
          style={[
            styles.container,
            { backgroundColor: isDark ? "#0f0f0f" : "#f5f5f5" },
          ]}
        >
          <View style={styles.header}>
            <Text
              style={[styles.title, { color: isDark ? "#fafafa" : "#030213" }]}
            >
              My Cart
            </Text>
          </View>
          <EmptyState
            icon="cart"
            title="Your cart is empty"
            message="Add items to get started"
          />
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
          <Text
            style={[styles.title, { color: isDark ? "#fafafa" : "#030213" }]}
          >
            My Cart
          </Text>
          <Text
            style={[styles.subtitle, { color: isDark ? "#a3a3a3" : "#737373" }]}
          >
            {items.length} items
          </Text>
        </View>

        <View style={styles.tabsWrapper}>
          <TabViewPager routes={routes} renderScene={renderScene} />
        </View>

        <View
          style={[
            styles.bottom,
            { backgroundColor: isDark ? "#1a1a1a" : "#ffffff" },
          ]}
        >
          <View style={styles.promoRow}>
            <Input
              placeholder="Promo code"
              value={code}
              onChangeText={setCode}
              containerStyle={{ flex: 1, marginBottom: 0 }}
            />
            <Button
              onPress={handleApplyPromo}
              size="sm"
              style={styles.applyBtn}
            >
              Apply
            </Button>
          </View>
          {promoMessage ? (
            <Text
              style={[
                styles.promoMsg,
                { color: promoCode ? "#10b981" : "#d4183d" },
              ]}
            >
              {promoMessage}
            </Text>
          ) : null}
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text
                style={[
                  styles.label,
                  { color: isDark ? "#a3a3a3" : "#737373" },
                ]}
              >
                Subtotal
              </Text>
              <Text
                style={[
                  styles.value,
                  { color: isDark ? "#fafafa" : "#030213" },
                ]}
              >
                ${subtotal.toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text
                style={[
                  styles.label,
                  { color: isDark ? "#a3a3a3" : "#737373" },
                ]}
              >
                Shipping
              </Text>
              <Text
                style={[
                  styles.value,
                  { color: isDark ? "#fafafa" : "#030213" },
                ]}
              >
                {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
              </Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text
                style={[
                  styles.totalLabel,
                  { color: isDark ? "#fafafa" : "#030213" },
                ]}
              >
                Total
              </Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
          </View>
          <Button onPress={() => navigation.navigate("Checkout")} fullWidth>
            Checkout
          </Button>
        </View>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingVertical: 16 },
  title: { fontSize: 28, fontWeight: "700" },
  subtitle: { fontSize: 14, marginTop: 4 },
  tabsWrapper: { flex: 1 },
  bottom: {
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  promoRow: { flexDirection: "row", marginBottom: 8, alignItems: "center" },
  applyBtn: { width: 80, marginLeft: 8 },
  promoMsg: { fontSize: 12, marginBottom: 8 },
  summary: { marginBottom: 16 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: { fontSize: 14 },
  value: { fontSize: 14, fontWeight: "600" },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: { fontSize: 16, fontWeight: "700" },
  totalValue: { fontSize: 18, fontWeight: "700", color: "#9333ea" },
});
