import React, { useEffect, useRef } from 'react';
import { View, ActivityIndicator, Text, Animated } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Loading...',
  fullScreen = true,
}) => {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark";
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        {
          flex: fullScreen ? 1 : undefined,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 32,
          opacity,
        },
        !fullScreen && { minHeight: 200 },
      ]}
    >
      <ActivityIndicator size="large" color="#9333ea" />
      {message && (
        <Text
          style={{
            marginTop: 16,
            fontSize: 16,
            color: isDark ? '#d4d4d4' : '#525252',
          }}
        >
          {message}
        </Text>
      )}
    </Animated.View>
  );
};
