import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ShoppingBag, CreditCard, Sparkles } from "lucide-react-native";
import { Button } from "@/components/common";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ONBOARDING_COMPLETED_KEY } from "@/utils/constants";

const { width } = Dimensions.get("window");

interface OnboardingScreenProps {
  navigation: any;
}

const slides = [
  {
    id: "1",
    title: "Discover Amazing Products",
    description:
      "Browse through thousands of products from trusted sellers worldwide.",
    icon: ShoppingBag,
    gradient: ["#9333ea", "#a855f7"],
  },
  {
    id: "2",
    title: "Save with Exclusive Deals",
    description:
      "Get access to flash sales, promo codes, and member-only discounts.",
    icon: Sparkles,
    gradient: ["#ec4899", "#f43f5e"],
  },
  {
    id: "3",
    title: "Checkout in Seconds",
    description:
      "Secure payment, fast delivery, and hassle-free returns guaranteed.",
    icon: CreditCard,
    gradient: ["#3b82f6", "#06b6d4"],
  },
];

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, "true");
    navigation.replace("Login");
  };

  const handleGetStarted = async () => {
    await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, "true");
    navigation.replace("Login");
  };

  const scrollXInterpolation = scrollX.interpolate({
    inputRange: [0, width, width * 2],
    outputRange: [0, 1, 2],
    extrapolate: "clamp",
  });

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.skipText} onPress={handleSkip}>
          Skip
        </Text>
      </View>

      <FlatList
        data={slides}
        renderItem={({ item }) => {
          const IconComponent = item.icon;
          return (
            <View style={styles.slide}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: item.gradient[0] },
                ]}
              >
                <IconComponent size={48} color="#ffffff" />
              </View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          );
        }}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          {
            useNativeDriver: false,
          },
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        keyExtractor={(item) => item.id}
        ref={slidesRef}
      />

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => {
            const opacity = scrollXInterpolation.interpolate({
              inputRange: [index - 1, index, index + 1],
              outputRange: [0.3, 1, 0.3],
              extrapolate: "clamp",
            });
            const scale = opacity;
            return (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  { opacity, transform: [{ scale }] },
                  currentIndex === index && { backgroundColor: "#9333ea" },
                ]}
              />
            );
          })}
        </View>

        <Button
          variant="primary"
          size="lg"
          onPress={scrollTo}
          style={styles.button}
        >
          {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    alignItems: "flex-end",
  },
  skipText: {
    fontSize: 16,
    color: "#737373",
    fontWeight: "500",
  },
  slide: {
    width,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingTop: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#030213",
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: "#737373",
    textAlign: "center",
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 32,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#d4d4d4",
  },
  button: {
    width: "100%",
  },
});

export default OnboardingScreen;
