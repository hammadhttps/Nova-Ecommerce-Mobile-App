import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  disabled,
  style,
  ...props
}) => {
  const { isDark } = useTheme();

  const containerStyles: Record<string, ViewStyle> = {
    primary: {
      backgroundColor: isDark ? '#fafafa' : '#030213',
    },
    secondary: {
      backgroundColor: isDark ? '#262626' : '#ececf0',
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: isDark ? '#262626' : 'rgba(0,0,0,0.1)',
    },
    ghost: {
      backgroundColor: 'transparent',
    },
    destructive: {
      backgroundColor: isDark ? '#dc2626' : '#d4183d',
    },
  };

  const sizeStyles: Record<string, { container: ViewStyle; text: TextStyle }> = {
    sm: {
      container: { paddingVertical: 8, paddingHorizontal: 12 },
      text: { fontSize: 14 },
    },
    md: {
      container: { paddingVertical: 12, paddingHorizontal: 16 },
      text: { fontSize: 16 },
    },
    lg: {
      container: { paddingVertical: 16, paddingHorizontal: 24 },
      text: { fontSize: 18 },
    },
  };

  const textColor =
    variant === 'primary'
      ? isDark
        ? '#030213'
        : '#ffffff'
      : variant === 'destructive'
        ? '#ffffff'
        : variant === 'outline' || variant === 'ghost'
          ? isDark
            ? '#fafafa'
            : '#030213'
          : isDark
            ? '#fafafa'
            : '#030213';

  return (
    <TouchableOpacity
      disabled={disabled || loading}
      style={[
        {
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          opacity: disabled || loading ? 0.5 : 1,
        },
        containerStyles[variant],
        sizeStyles[size].container,
        style as ViewStyle,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <Text style={[{ color: textColor, fontWeight: '500' }, sizeStyles[size].text]}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
};
