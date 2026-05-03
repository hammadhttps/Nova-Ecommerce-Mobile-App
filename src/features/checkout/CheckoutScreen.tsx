import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeScreen } from "@/components/layout/SafeScreen";
import { useTheme } from "@/hooks/useTheme";
import { useCart } from "@/hooks/useCart";
import { Button, Badge } from "@/components/common";
import ConfettiCannon from "react-native-confetti-cannon";
import { ChevronLeft, Check, MapPin, CreditCard } from "lucide-react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/types";
import { mockAddresses } from "@/services/mocks/addresses";
import { mockPaymentMethods } from "@/services/mocks/payments";

type Props = NativeStackScreenProps<RootStackParamList, "Checkout">;

const { width } = Dimensions.get("window");

export default function CheckoutScreen({ navigation }: Props) {
  const { isDark } = useTheme();
  const { items, subtotal, shipping, total, clearCart } = useCart();
  const [step, setStep] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);

  const handlePlaceOrder = () => {
    setShowConfetti(true);
    clearCart();
    setTimeout(() => {
      navigation.navigate("OrderHistory");
    }, 2000);
  };

  const address = mockAddresses.find((a) => a.id === selectedAddress);
  const payment = mockPaymentMethods.find((m) => m.id === selectedPayment);

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
      {mockAddresses.map((a) => (
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
        <ScrollView contentContainerStyle={styles.content}>
          {step === 0 && renderAddressStep()}
          {step === 1 && renderPaymentStep()}
          {step === 2 && renderReviewStep()}
        </ScrollView>
        <View
          style={[
            styles.footer,
            { backgroundColor: isDark ? "#1a1a1a" : "#ffffff" },
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
        {showConfetti && (
          <ConfettiCannon
            count={200}
            origin={{ x: width / 2, y: 0 }}
            fadeOut={true}
          />
        )}
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  content: { paddingHorizontal: 20, paddingBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: "700", marginBottom: 16 },
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
    borderTopColor: "#e5e5e5",
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: { fontSize: 16, fontWeight: "700" },
  totalValue: { fontSize: 18, fontWeight: "700", color: "#9333ea" },
  footer: {
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
});
