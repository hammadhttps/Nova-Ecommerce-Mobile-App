import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  variant?: 'default' | 'outline';
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  variant = 'default',
  containerStyle,
  secureTextEntry,
  ...props
}) => {
  const { isDark } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = secureTextEntry;

  const backgroundColor = isDark ? '#1a1a1a' : '#ffffff';
  const borderColor = isFocused
    ? isDark
      ? '#525252'
      : '#030213'
    : error
      ? '#d4183d'
      : isDark
        ? '#262626'
        : 'rgba(0,0,0,0.1)';
  const textColor = isDark ? '#fafafa' : '#030213';
  const placeholderColor = isDark ? '#737373' : '#737373';

  return (
    <View style={[{ marginBottom: 16 }, containerStyle]}>
      {label && (
        <Text
          style={{
            fontSize: 14,
            fontWeight: '500',
            color: isDark ? '#d4d4d4' : '#525252',
            marginBottom: 6,
          }}
        >
          {label}
        </Text>
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor,
          borderRadius: 10,
          backgroundColor,
          paddingHorizontal: 12,
        }}
      >
        <TextInput
          style={{
            flex: 1,
            paddingVertical: 12,
            fontSize: 16,
            color: textColor,
          }}
          placeholderTextColor={placeholderColor}
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 4 }}>
            {showPassword ? (
              <EyeOff size={20} color={placeholderColor} />
            ) : (
              <Eye size={20} color={placeholderColor} />
            )}
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text style={{ color: '#d4183d', fontSize: 12, marginTop: 4 }}>{error}</Text>
      )}
    </View>
  );
};
