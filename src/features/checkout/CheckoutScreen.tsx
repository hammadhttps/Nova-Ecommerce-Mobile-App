import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SafeScreen } from "@/components/layout/SafeScreen";
import { useTheme } from "@/hooks/useTheme";
import { useCart } from "@/hooks/useCart";
import { Button, Badge } from "@/components/common";
import ConfettiCannon from "react-native-confetti-cannon";
import { ChevronLeft, Check, MapPin, CreditCard } from "lucide-react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/types";
import { Address } from "@/types";
import { addressService } from "@/services/address.service";
import { mockPaymentMethods } from "@/services/mocks/payments";
import { orderService, CheckoutData } from "@/services/order.service";
import { useAuthStore } from "@/store/auth.store";

type Props = NativeStackScreenProps<RootStackParamList, "Checkout">;

const { width } = Dimensions.get("window");

export default function CheckoutScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { items, subtotal, shipping, total, clearCart } = useCart();
  const { user } = useAuthStore();
  const [step, setStep] = useState(0);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("1");
  const [showConfetti, setShowConfetti] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  // Fetch addresses from Firestore
  useEffect(() => {
    if (user?.id) {
      setLoadingAddresses(true);
      addressService
        .getAddresses(user.id)
        .then((addrs) => {
          setAddresses(addrs);
          const defaultAddr = addrs.find((a) => a.isDefault) || addrs[0];
          if (defaultAddr) setSelectedAddress(defaultAddr.id);
        })
        .finally(() => setLoadingAddresses(false));
    } else {
      setLoadingAddresses(false);
    }
  }, [user?.id]);

  const handlePlaceOrder = async () => {
    if (!user?.id) return;

    const address = addresses.find((a) => a.id === selectedAddress);
    const payment = mockPaymentMethods.find((m) => m.id === selectedPayment);

    if (!address || !payment) return;

    const checkoutData: CheckoutData = {
      items,
      address,
      paymentMethod: payment,
    };

    await orderService.createOrder(user.id, checkoutData);
    clearCart();
    setOrderPlaced(true);
    setTimeout(() => setShowConfetti(true), 100);
    setTimeout(() => {
      navigation.navigate("OrderHistory");
    }, 2500);
  };

  const address = addresses.find((a) => a.id === selectedAddress);
  const payment = mockPaymentMethods.find((m) => m.id === selectedPayment);

  if (loadingAddresses) {
    return (
      <SafeScreen>
        <View style={[styles.container, styles.center]}>
          <ActivityIndicator size="large" color="#9333ea" />
        </View>
      </SafeScreen>
    );
  }

  const renderStepIndicator = () => (
    <View style={styles.steps}>
      {["Address", "Payment", "Review"].map((label, i) => (
        <View key={i} style={styles.stepItem}>
          <View
            style={[
              styles.stepDot,
              {
                backgroundColor:
                  i <= step ? "#9333ea" : isDark ? "#262626" : "#ececf0",
              },
            ]}
          >
            {i < step && <Check size={14} color="#ffffff" />}
          </View>
          <Text
            style={[
              styles.stepLabel,
              { color: i <= step ? "#9333ea" : isDark ? "#737373" : "#a3a3a3" },
            ]}
          >
            {label}
          </Text>
          {i < 2 && (
            <View
              style={[
                styles.stepLine,
                {
                  backgroundColor:
                    i < step ? "#9333ea" : isDark ? "#262626" : "#ececf0",
                },
              ]}
            />
          )}
        </View>
      ))}
    </View>
  );

  const renderAddressStep = () => (
    <View>
      <Text
        style={[styles.sectionTitle, { color: isDark ? "#fafafa" : "#030213" }]}
      >
        Select Address
      </Text>
      <TouchableOpacity
        style={styles.manageLink}
        onPress={() => navigation.navigate("AddressManagement")}
      >
        <Text style={styles.manageLinkText}>+ Manage Addresses</Text>
      </TouchableOpacity>
      {addresses.map((a) => (
        <TouchableOpacity
          key={a.id}
          style={[
            styles.optionCard,
            { backgroundColor: isDark ? "#1a1a1a" : "#ffffff" },
            selectedAddress === a.id && {
              borderColor: "#9333ea",
              borderWidth: 2,
            },
          ]}
          onPress={() => setSelectedAddress(a.id)}
        >
          <MapPin size={20} color="#9333ea" />
          <View style={styles.optionInfo}>
            <Text
              style={[
                styles.optionTitle,
                { color: isDark ? "#fafafa" : "#030213" },
              ]}
            >
              {a.name}
            </Text>
            <Text
              style={[
                styles.optionSub,
                { color: isDark ? "#a3a3a3" : "#737373" },
              ]}
            >
              {a.street}
            </Text>
            <Text
              style={[
                styles.optionSub,
                { color: isDark ? "#a3a3a3" : "#737373" },
              ]}
            >
              {a.city}
              {a.zip ? `, ${a.zip}` : ""}
            </Text>
          </View>
          {a.isDefault && <Badge label="Default" variant="info" size="sm" />}
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderPaymentStep = () => (
    <View>
      <Text
        style={[styles.sectionTitle, { color: isDark ? "#fafafa" : "#030213" }]}
      >
        Select Payment
      </Text>
      {mockPaymentMethods.map((m) => (
        <TouchableOpacity
          key={m.id}
          style={[
            styles.optionCard,
            { backgroundColor: isDark ? "#1a1a1a" : "#ffffff" },
            selectedPayment === m.id && {
              borderColor: "#9333ea",
              borderWidth: 2,
            },
          ]}
          onPress={() => setSelectedPayment(m.id)}
        >
          <CreditCard size={20} color="#9333ea" />
          <View style={styles.optionInfo}>
            <Text
              style={[
                styles.optionTitle,
                { color: isDark ? "#fafafa" : "#030213" },
              ]}
            >
              {m.type.toUpperCase()} {m.number}
            </Text>
            <Text
              style={[
                styles.optionSub,
                { color: isDark ? "#a3a3a3" : "#737373" },
              ]}
            >
              Expires {m.expiry}
            </Text>
          </View>
          {m.isDefault && <Badge label="Default" variant="info" size="sm" />}
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderReviewStep = () => (
    <View>
      <Text
        style={[styles.sectionTitle, { color: isDark ? "#fafafa" : "#030213" }]}
      >
        Order Review
      </Text>
      <View
        style={[
          styles.summaryCard,
          { backgroundColor: isDark ? "#1a1a1a" : "#ffffff" },
        ]}
      >
        <View style={styles.summarySection}>
          <Text
            style={[
              styles.summarySectionTitle,
              { color: isDark ? "#fafafa" : "#030213" },
            ]}
          >
            Items
          </Text>
          {items.map((item) => (
            <View key={item.id} style={styles.summaryItem}>
              <Text
                style={[
                  styles.summaryItemName,
                  { color: isDark ? "#fafafa" : "#030213" },
                ]}
              >
                {item.name} x{item.quantity}
              </Text>
              <Text style={styles.summaryItemPrice}>
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.summarySection}>
          <Text
            style={[
              styles.summarySectionTitle,
              { color: isDark ? "#fafafa" : "#030213" },
            ]}
          >
            Delivery
          </Text>
          <Text
            style={[
              styles.summaryText,
              { color: isDark ? "#a3a3a3" : "#737373" },
            ]}
          >
            {address?.street}
          </Text>
          <Text
            style={[
              styles.summaryText,
              { color: isDark ? "#a3a3a3" : "#737373" },
            ]}
          >
            {address?.city}
          </Text>
        </View>
        <View style={styles.summarySection}>
          <Text
            style={[
              styles.summarySectionTitle,
              { color: isDark ? "#fafafa" : "#030213" },
            ]}
          >
            Payment
          </Text>
          <Text
            style={[
              styles.summaryText,
              { color: isDark ? "#a3a3a3" : "#737373" },
            ]}
          >
            {payment?.type.toUpperCase()} {payment?.number}
          </Text>
        </View>
        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <Text
              style={[
                styles.summaryLabel,
                { color: isDark ? "#a3a3a3" : "#737373" },
              ]}
            >
              Subtotal
            </Text>
            <Text
              style={[
                styles.summaryValue,
                { color: isDark ? "#fafafa" : "#030213" },
              ]}
            >
              ${subtotal.toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text
              style={[
                styles.summaryLabel,
                { color: isDark ? "#a3a3a3" : "#737373" },
              ]}
            >
              Shipping
            </Text>
            <Text
              style={[
                styles.summaryValue,
                { color: isDark ? "#fafafa" : "#030213" },
              ]}
            >
              {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
            </Text>
          </View>
          <View
            style={[
              styles.summaryRow,
              styles.totalRow,
              { borderTopColor: isDark ? "#404040" : "#e5e5e5" },
            ]}
          >
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
      </View>
    </View>
  );

  return (
    <SafeScreen hasScrollView keyboardAware>
      <View
        style={[
          styles.container,
          { backgroundColor: isDark ? "#0f0f0f" : "#f5f5f5" },
        ]}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => (step > 0 ? setStep(step - 1) : navigation.goBack())}
          >
            <ChevronLeft size={24} color={isDark ? "#fafafa" : "#030213"} />
          </TouchableOpacity>
          <Text
            style={[
              styles.headerTitle,
              { color: isDark ? "#fafafa" : "#030213" },
            ]}
          >
            Checkout
          </Text>
          <View style={{ width: 24 }} />
        </View>
        {renderStepIndicator()}
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: 24 + insets.bottom },
          ]}
        >
          {step === 0 && renderAddressStep()}
          {step === 1 && renderPaymentStep()}
          {step === 2 && renderReviewStep()}
        </ScrollView>
        <View
          style={[
            styles.footer,
            {
              backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
              paddingBottom: Math.max(20, insets.bottom),
            },
          ]}
        >
          {step < 2 ? (
            <Button onPress={() => setStep(step + 1)} fullWidth>
              Continue
            </Button>
          ) : (
            <Button onPress={handlePlaceOrder} fullWidth>
              Place Order
            </Button>
          )}
        </View>
        {orderPlaced && (
          <View style={styles.successOverlay}>
            {showConfetti && (
              <ConfettiCannon
                count={200}
                origin={{ x: width / 2, y: 0 }}
                fadeOut={true}
              />
            )}
            <View
              style={[
                styles.successCard,
                { backgroundColor: isDark ? "#1a1a1a" : "#ffffff" },
              ]}
            >
              <View style={styles.successIcon}>
                <Check size={40} color="#ffffff" />
              </View>
              <Text
                style={[
                  styles.successTitle,
                  { color: isDark ? "#fafafa" : "#030213" },
                ]}
              >
                Order Placed Successfully!
              </Text>
              <Text
                style={[
                  styles.successSub,
                  { color: isDark ? "#a3a3a3" : "#737373" },
                ]}
              >
                Your order has been confirmed and is being processed.
              </Text>
            </View>
          </View>
        )}
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { justifyContent: "center", alignItems: "center" },
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  successCard: {
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    marginHorizontal: 40,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  successIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#22c55e",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  successSub: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: { fontSize: 20, fontWeight: "700" },
  steps: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  stepItem: { alignItems: "center", flex: 1, position: "relative" },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  stepLabel: { fontSize: 12, fontWeight: "500" },
  stepLine: {
    position: "absolute",
    top: 16,
    left: "50%",
    width: "100%",
    height: 2,
  },
  content: { paddingHorizontal: 20, paddingTop: 4 },
  sectionTitle: { fontSize: 20, fontWeight: "700", marginBottom: 8 },
  manageLink: { marginBottom: 12 },
  manageLinkText: { color: "#9333ea", fontSize: 14, fontWeight: "600" },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  optionInfo: { flex: 1, marginLeft: 12 },
  optionTitle: { fontSize: 16, fontWeight: "600" },
  optionSub: { fontSize: 14, marginTop: 2 },
  summaryCard: {
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summarySection: { marginBottom: 16 },
  summarySectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  summaryItemName: { fontSize: 14 },
  summaryItemPrice: { fontSize: 14, fontWeight: "600", color: "#9333ea" },
  summaryText: { fontSize: 14 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: { fontSize: 14 },
  summaryValue: { fontSize: 14, fontWeight: "600" },
  totalRow: {
    borderTopWidth: 1,
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: { fontSize: 16, fontWeight: "700" },
  totalValue: { fontSize: 18, fontWeight: "700", color: "#9333ea" },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
});
