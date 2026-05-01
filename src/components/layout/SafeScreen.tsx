import React from 'react';
import { View, SafeAreaView, StatusBar, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { LoadingScreen } from '@/components/common/LoadingScreen';

interface SafeScreenProps {
  children?: React.ReactNode;
  loading?: boolean;
  hasScrollView?: boolean;
  keyboardAware?: boolean;
}

export const SafeScreen: React.FC<SafeScreenProps> = ({
  children,
  loading = false,
  hasScrollView = false,
  keyboardAware = false,
}) => {
  const { isDark } = useTheme();

  const backgroundColor = isDark ? '#0f0f0f' : '#ffffff';

  const Content = () => (
    <View style={{ flex: 1, backgroundColor }}>
      {loading ? <LoadingScreen /> : children}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundColor}
      />
      {keyboardAware ? (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
          {hasScrollView ? <ScrollView contentContainerStyle={{ flexGrow: 1 }}>{Content()}</ScrollView> : Content()}
        </KeyboardAvoidingView>
      ) : hasScrollView ? (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>{Content()}</ScrollView>
      ) : (
        Content()
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
