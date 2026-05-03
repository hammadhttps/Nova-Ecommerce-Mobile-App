import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Input, Button } from "@/components/common";
import { useAuthStore } from "@/store/auth.store";
import { validateEmail, validatePassword } from "@/utils/validators";
import { useTheme } from "@/hooks/useTheme";

interface SignupScreenProps {
  navigation: any;
}

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const insets = useSafeAreaInsets();
  const { signup, isLoading, error } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  const handleSignup = async () => {
    setNameError("");
    setEmailError("");
    setPasswordErrors([]);

    let hasError = false;

    if (!name.trim()) {
      setNameError("Name is required");
      hasError = true;
    }
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email");
      hasError = true;
    }
    const pwdValidation = validatePassword(password);
    if (!pwdValidation.valid) {
      setPasswordErrors(pwdValidation.errors);
      hasError = true;
    }

    if (hasError) return;

    try {
      await signup({ name, email, password });
      navigation.replace("Main");
    } catch (err) {
      // Error handled by store
    }
  };

  const screenBg = isDark ? "#0f0f0f" : "#ffffff";

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: screenBg,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text
              style={[styles.title, { color: isDark ? "#fafafa" : "#030213" }]}
            >
              Create Account
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: isDark ? "#a3a3a3" : "#737373" },
              ]}
            >
              Join Nova and start shopping today
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Full Name"
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
              error={nameError}
            />
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={emailError}
            />
            <Input
              label="Password"
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            {passwordErrors.length > 0 && (
              <View style={styles.passwordHints}>
                {passwordErrors.map((err, idx) => (
                  <Text key={idx} style={styles.hintText}>
                    • {err}
                  </Text>
                ))}
              </View>
            )}

            {error && <Text style={styles.errorText}>{error}</Text>}

            <Button
              variant="primary"
              size="lg"
              loading={isLoading}
              onPress={handleSignup}
              style={styles.button}
            >
              Create Account
            </Button>
          </View>

          <View style={styles.footer}>
            <Text
              style={[
                styles.footerText,
                { color: isDark ? "#a3a3a3" : "#737373" },
              ]}
            >
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    gap: 16,
  },
  passwordHints: {
    gap: 4,
    marginTop: 4,
  },
  hintText: {
    fontSize: 12,
    color: "#6b7280",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
    marginTop: 8,
  },
  button: {
    marginTop: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 32,
  },
  footerText: {
    fontSize: 14,
  },
  loginLink: {
    color: "#9333ea",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default SignupScreen;
