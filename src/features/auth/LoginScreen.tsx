import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input, Button } from '@/components/common';
import { useAuthStore } from '@/store/auth.store';
import { validateEmail } from '@/utils/validators';
import { useTheme } from '@/hooks/useTheme';

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { isDark } = useTheme();
  const { login, loginWithGoogle, isLoading, error } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleLogin = async () => {
    setEmailError('');
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      return;
    }
    try {
      await login({ email, password });
      navigation.replace('Main');
    } catch (err) {
      // Error handled by store
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigation.replace('Main');
    } catch (err) {
      // Error handled by store
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={[styles.title, { color: isDark ? '#fafafa' : '#030213' }]}>
              Welcome Back
            </Text>
            <Text style={[styles.subtitle, { color: isDark ? '#a3a3a3' : '#737373' }]}>
              Sign in to continue shopping
            </Text>
          </View>

          <View style={styles.form}>
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
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <Button
              variant="primary"
              size="lg"
              loading={isLoading}
              onPress={handleLogin}
              style={styles.button}
            >
              Sign In
            </Button>

            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: isDark ? '#262626' : '#ececf0' }]} />
              <Text style={[styles.dividerText, { color: isDark ? '#737373' : '#a3a3a3' }]}>or</Text>
              <View style={[styles.dividerLine, { backgroundColor: isDark ? '#262626' : '#ececf0' }]} />
            </View>

            <Button
              variant="outline"
              size="lg"
              loading={isLoading}
              onPress={handleGoogleLogin}
            >
              Continue with Google
            </Button>
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: isDark ? '#a3a3a3' : '#737373' }]}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    marginBottom: 24,
  },
  errorText: {
    color: '#d4183d',
    fontSize: 14,
    marginBottom: 12,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#9333ea',
    fontSize: 14,
    fontWeight: '500',
  },
  button: {
    marginBottom: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  footerText: {
    fontSize: 14,
  },
  signupLink: {
    color: '#9333ea',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LoginScreen;
