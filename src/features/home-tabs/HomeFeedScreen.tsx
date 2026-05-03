import React, { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import type { NavigationProp } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import ForYouScreen from "@/features/home/ForYouScreen";
import { RootStackParamList } from "@/navigation/types";
import { Product } from "@/types";

const HomeFeedScreen: React.FC = React.memo(function HomeFeedScreen() {
  const navigation =
    useNavigation<NavigationProp<RootStackParamList>>();

  const onProductPress = useCallback(
    (product: Product) => {
      navigation.navigate("ProductDetail", { id: product.id });
    },
    [navigation],
  );

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      edges={["left", "right", "bottom"]}
    >
      <ForYouScreen onProductPress={onProductPress} />
    </SafeAreaView>
  );
});

export default HomeFeedScreen;
