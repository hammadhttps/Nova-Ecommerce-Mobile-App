import React from "react";
import { View, Text, Image, ImageStyle } from "react-native";
import { useTheme } from "@/hooks/useTheme";

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: number;
  source?: { uri: string };
  style?: ImageStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  uri,
  name,
  size = 48,
  source,
  style,
}) => {
  const { isDark } = useTheme();
  const [hasError, setHasError] = React.useState(false);

  const imageUri = source?.uri || uri;

  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  if (imageUri && !hasError) {
    return (
      <Image
        source={{ uri: imageUri }}
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: isDark ? "#262626" : "#ececf0",
          },
          style,
        ]}
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: isDark ? "#262626" : "#ececf0",
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      <Text
        style={{
          color: isDark ? "#d4d4d4" : "#525252",
          fontWeight: "600",
          fontSize: size * 0.4,
        }}
      >
        {initials}
      </Text>
    </View>
  );
};
