import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  TextInputProps,
  ViewStyle,
} from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  variant?: "default" | "outline";
  containerStyle?: ViewStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  variant = "default",
  containerStyle,
  secureTextEntry,
  leftIcon,
  rightIcon,
  ...props
}) => {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark";
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = secureTextEntry;

  const backgroundColor = isDark ? "#1a1a1a" : "#ffffff";
  const borderColor = isFocused
    ? isDark
      ? "#525252"
      : "#030213"
    : error
      ? "#d4183d"
      : isDark
        ? "#262626"
        : "rgba(0,0,0,0.1)";
  const textColor = isDark ? "#fafafa" : "#030213";
  const placeholderColor = isDark ? "#737373" : "#737373";

  return (
    <View style={[{ marginBottom: 16 }, containerStyle]}>
      {label && (
        <Text
          style={{
            fontSize: 14,
            fontWeight: "500",
            color: isDark ? "#d4d4d4" : "#525252",
            marginBottom: 6,
          }}
        >
          {label}
        </Text>
      )}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderColor,
          borderRadius: 10,
          backgroundColor,
          paddingHorizontal: 12,
        }}
      >
        {leftIcon && <View style={{ marginRight: 8 }}>{leftIcon}</View>}
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
        {isPassword && !rightIcon && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{ padding: 4, marginLeft: 4 }}
          >
            {showPassword ? (
              <EyeOff size={20} color={placeholderColor} />
            ) : (
              <Eye size={20} color={placeholderColor} />
            )}
          </TouchableOpacity>
        )}
        {rightIcon && !isPassword && (
          <View style={{ marginLeft: 4 }}>{rightIcon}</View>
        )}
      </View>
      {error && (
        <Text style={{ color: "#d4183d", fontSize: 12, marginTop: 4 }}>
          {error}
        </Text>
      )}
    </View>
  );
};
