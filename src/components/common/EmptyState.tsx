import React from 'react';
import { View, Text } from 'react-native';
import { Package, AlertCircle, ShoppingCart, Heart } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: 'package' | 'alert' | 'cart' | 'heart';
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const iconMap = {
  package: Package,
  alert: AlertCircle,
  cart: ShoppingCart,
  heart: Heart,
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'package',
  title,
  message,
  actionLabel,
  onAction,
}) => {
  const { isDark } = useTheme();
  const IconComponent = iconMap[icon];

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <IconComponent size={64} color={isDark ? '#525252' : '#d4d4d4'} />
      <Text
        style={{
          fontSize: 20,
          fontWeight: '600',
          color: isDark ? '#fafafa' : '#030213',
          marginTop: 16,
          textAlign: 'center',
        }}
      >
        {title}
      </Text>
      {message && (
        <Text
          style={{
            fontSize: 14,
            color: isDark ? '#a3a3a3' : '#737373',
            marginTop: 8,
            textAlign: 'center',
          }}
        >
          {message}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button variant="primary" style={{ marginTop: 24 }} onPress={onAction}>
          {actionLabel}
        </Button>
      )}
    </View>
  );
};
