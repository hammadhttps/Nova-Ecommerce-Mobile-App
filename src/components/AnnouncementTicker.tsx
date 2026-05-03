import React, { useRef, useEffect, useState } from "react";
import { View, Text, Animated, StyleSheet, Dimensions } from "react-native";

const announcements = [
  "⚡ Flash Sale: Up to 60% off — tonight only!",
  "🔥 Deal of the Day: 50% off on top brands",
  "🕐 Hurry! Sale ends in 2 hours",
  "🎉 New arrivals: Shop the latest trends",
  "🚚 Free shipping on orders over $50",
  "💥 Extra 20% off on all clearance items",
  "🏆 Best-sellers: Up to 40% off",
  "🎯 Limited stock: Grab yours before it's gone",
  "⭐ Summer Special: Buy 2 Get 1 Free",
  "📦 End of Season Sale — Up to 70% off",
];

const SCREEN_WIDTH = Dimensions.get("window").width;

function getRandomLine(): string {
  return announcements[Math.floor(Math.random() * announcements.length)];
}

export default function AnnouncementTicker() {
  const scrollAnim = useRef(new Animated.Value(0)).current;
  const [textWidth, setTextWidth] = useState(0);
  const lineRef = useRef(getRandomLine());
  const line = lineRef.current;

  useEffect(() => {
    if (textWidth === 0) return;

    const duration = (textWidth + SCREEN_WIDTH) * 12;

    const animation = Animated.loop(
      Animated.timing(scrollAnim, {
        toValue: -textWidth,
        duration,
        useNativeDriver: true,
      }),
    );
    animation.start();

    return () => animation.stop();
  }, [textWidth, scrollAnim]);

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <Animated.View
          style={[styles.slider, { transform: [{ translateX: scrollAnim }] }]}
        >
          <Text style={styles.text} numberOfLines={1}>
            {line}
          </Text>
          <Text style={styles.text} numberOfLines={1}>
            {line}
          </Text>
        </Animated.View>
      </View>
      <Text
        style={styles.measurer}
        numberOfLines={1}
        onLayout={(e) => {
          if (textWidth === 0) setTextWidth(e.nativeEvent.layout.width);
        }}
      >
        {line}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#7c22ce",
    paddingVertical: 8,
    overflow: "hidden",
    marginTop: 8,
    marginHorizontal: 20,
    borderRadius: 8,
  },
  track: {
    height: 20,
    overflow: "hidden",
  },
  slider: {
    flexDirection: "row",
  },
  text: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    marginRight: 0,
  },
  measurer: {
    position: "absolute",
    opacity: 0,
    fontSize: 14,
    fontWeight: "600",
  },
});
