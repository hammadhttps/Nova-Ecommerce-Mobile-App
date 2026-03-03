import React, { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import type { NavigationProp } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ForYouScreen from "@/features/home/ForYouScreen";
import { RootStackParamList } from "@/navigation/types";
import { Product } from "@/types";

const HomeFeedScreen: React.FC = React.memo(function HomeFeedScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();

  const onProductPress = useCallback(
    (product: Product) => {
      navigation.navigate("ProductDetail", { id: String(product.id) });
    },
    [navigation],
  );

  return <ForYouScreen onProductPress={onProductPress} />;
});

export default HomeFeedScreen;
