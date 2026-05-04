import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { SafeScreen } from '@/components/layout/SafeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ONBOARDING_COMPLETED_KEY } from '@/utils/constants';
import { useAuthStore } from '@/store/auth.store';

interface SplashScreenProps {
  navigation: any;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  const scale = useRef(new Animated.Value(0.5)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(async () => {
      const onboardingCompleted = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);
      if (onboardingCompleted !== 'true') {
        navigation.navigate('Onboarding');
        return;
      }
      const isAuthenticated = useAuthStore.getState().isAuthenticated;
      navigation.replace(isAuthenticated ? 'Main' : 'Login');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeScreen>
      <View style={styles.container}>
        <Animated.View style={{ transform: [{ scale }], opacity }}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Nova</Text>
          </View>
          <Text style={styles.tagline}>Shop Smarter, Live Better</Text>
        </Animated.View>
      </View>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9333ea',
  },
  logoContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  logoText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#9333ea',
  },
  tagline: {
    fontSize: 18,
    color: '#ffffff',
    opacity: 0.9,
  },
});

export default SplashScreen;
