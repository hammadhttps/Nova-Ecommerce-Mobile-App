import React from "react";
import {
  View,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { LoadingScreen } from "@/components/common/LoadingScreen";

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
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark";
  const insets = useSafeAreaInsets();

  const backgroundColor = isDark ? "#0f0f0f" : "#ffffff";

  const Content = () => (
    <View
      style={[
        { flex: 1, backgroundColor },
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      {loading ? <LoadingScreen /> : children}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={backgroundColor}
      />
      {keyboardAware ? (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
          {hasScrollView ? (
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              {Content()}
            </ScrollView>
          ) : (
            Content()
          )}
        </KeyboardAvoidingView>
      ) : hasScrollView ? (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {Content()}
        </ScrollView>
      ) : (
        Content()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
