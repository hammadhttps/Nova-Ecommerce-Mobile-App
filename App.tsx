import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import RootNavigator from '@/navigation/RootNavigator';
import { ErrorBoundary } from '@/components/common';
import { useAuthStore } from '@/store/auth.store';
import { useThemeStore } from '@/store/theme.store';
import { useCartStore } from '@/store/cart.store';
import { useWishlistStore } from '@/store/wishlist.store';
import { LoadingScreen } from '@/components/common';

const AppContent: React.FC = () => {
  const [isReady, setIsReady] = useState(false);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const initializeTheme = useThemeStore((state) => state.initializeTheme);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const fetchWishlist = useWishlistStore((state) => state.fetchWishlist);
  const resolvedTheme = useThemeStore((state) => state.resolvedTheme);

  useEffect(() => {
    const init = async () => {
      await Promise.all([
        initializeAuth(),
        initializeTheme(),
      ]);
      await Promise.all([
        fetchCart(),
        fetchWishlist(),
      ]);
      setIsReady(true);
    };
    init();
  }, []);

  if (!isReady) {
    return <LoadingScreen fullScreen />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <NavigationContainer>
            <StatusBar
              style={resolvedTheme === 'dark' ? 'light' : 'dark'}
              backgroundColor="transparent"
              translucent
            />
            <RootNavigator />
          </NavigationContainer>
        </ErrorBoundary>
        <Toast />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default function App() {
  return <AppContent />;
}
