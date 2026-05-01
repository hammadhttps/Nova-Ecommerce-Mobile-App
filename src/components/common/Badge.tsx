import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'success' | 'destructive' | 'warning' | 'info';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  size = 'sm',
}) => {
  const { isDark } = useTheme();

  const variantStyles: Record<string, { container: ViewStyle; text: TextStyle }> = {
    default: {
      container: {
        backgroundColor: isDark ? '#262626' : '#ececf0',
      },
      text: {
        color: isDark ? '#d4d4d4' : '#030213',
      },
    },
    success: {
      container: {
        backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)',
      },
      text: {
        color: '#10b981',
      },
    },
    destructive: {
      container: {
        backgroundColor: isDark ? 'rgba(220, 38, 38, 0.2)' : 'rgba(212, 24, 61, 0.1)',
      },
      text: {
        color: isDark ? '#dc2626' : '#d4183d',
      },
    },
    warning: {
      container: {
        backgroundColor: isDark ? 'rgba(251, 146, 60, 0.2)' : 'rgba(251, 146, 60, 0.1)',
      },
      text: {
        color: '#fb923c',
      },
    },
    info: {
      container: {
        backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
      },
      text: {
        color: '#3b82f6',
      },
    },
  };

  const sizeStyles: Record<string, { container: ViewStyle; text: TextStyle }> = {
    sm: {
      container: { paddingVertical: 4, paddingHorizontal: 8 },
      text: { fontSize: 12 },
    },
    md: {
      container: { paddingVertical: 6, paddingHorizontal: 12 },
      text: { fontSize: 14 },
    },
  };

  return (
    <View
      style={[
        { borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
        variantStyles[variant].container,
        sizeStyles[size].container,
      ]}
    >
      <Text
        style={[
          { fontWeight: '500' },
          variantStyles[variant].text,
          sizeStyles[size].text,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};
