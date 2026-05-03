import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SafeScreen } from "@/components/layout/SafeScreen";
import { useTheme } from "@/hooks/useTheme";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuthStore } from "@/store/auth.store";
import { productService } from "@/services/product.service";
import { Button, Badge, Skeleton } from "@/components/common";
import {
  Star,
  Minus,
  Plus,
  Heart,
  ShoppingCart,
  ChevronLeft,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/types";
import { Product, Review } from "@/types";

type Props = NativeStackScreenProps<RootStackParamList, "ProductDetail">;

const { width } = Dimensions.get("window");

export default function ProductDetailScreen({ route, navigation }: Props) {
  const id = route.params?.id;
  const insets = useSafeAreaInsets();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { addToCart } = useCart();
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();
  const { user } = useAuthStore();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<
    "description" | "specs" | "reviews"
  >("description");
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [related, setRelated] = useState<Product[]>([]);

  const isInWishlist = wishlistItems.some((item) => item.id === String(id));

  useEffect(() => {
    loadProduct();
  }, [id]);

  useEffect(() => {
    if (product?.category) {
      productService.getProductsByCategory(product.category).then((data) => {
        setRelated(data.filter((p) => p.id !== product.id).slice(0, 8));
      });
    }
  }, [product]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const [productData, reviewsData] = await Promise.all([
        productService.getProductById(String(id)),
        productService.getProductReviews(String(id)),
      ]);
      setProduct(productData);
      setReviews(reviewsData);
    } catch (error) {
      console.error("Error loading product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!user || !product) {
      Alert.alert("Error", "You must be logged in to submit a review");
      return;
    }

    if (!newReview.trim()) {
      Alert.alert("Error", "Please write a review before submitting");
      return;
    }

    setSubmittingReview(true);
    try {
      const reviewData = {
        user: user.name || "Anonymous",
        avatar: user.avatar || "",
        rating: newRating,
        date: new Date().toISOString().split("T")[0],
        comment: newReview.trim(),
      };

      await productService.addReview(String(id), reviewData);
      setNewReview("");
      setNewRating(5);
      Alert.alert("Success", "Review submitted successfully!");
      loadProduct(); // Reload to show new review
    } catch (error) {
      Alert.alert("Error", "Failed to submit review. Please try again.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const relatedList = useMemo(
    () =>
      related.length > 0 ? (
        <View
          style={[
            styles.relatedSection,
            { backgroundColor: isDark ? "#1a1a1a" : "#ffffff" },
          ]}
        >
          <Text
            style={[
              styles.relatedTitle,
              { color: isDark ? "#fafafa" : "#030213" },
            ]}
          >
            Related Products
          </Text>
          <FlatList
            data={related}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            windowSize={3}
            maxToRenderPerBatch={4}
            removeClippedSubviews
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.relatedCard,
                  {
                    backgroundColor: isDark ? "#262626" : "#f5f5f5",
                  },
                ]}
                onPress={() =>
                  navigation.push("ProductDetail", { id: item.id })
                }
                activeOpacity={0.7}
              >
                <Image
                  source={{ uri: item.image }}
                  style={styles.relatedImage}
                  resizeMode="cover"
                />
                <Text
                  style={[
                    styles.relatedName,
                    {
                      color: isDark ? "#fafafa" : "#030213",
                    },
                  ]}
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
                <Text style={styles.relatedPrice}>
                  ${item.price.toFixed(2)}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      ) : null,
    [related, isDark, navigation],
  );

  if (loading || !product) {
    return (
      <SafeScreen loading>
        <ScrollView>
          <Skeleton height={300} borderRadius={0} />
          <View style={{ padding: 16 }}>
            <Skeleton width="80%" height={24} />
            <Skeleton width="40%" height={20} style={{ marginTop: 8 }} />
            <Skeleton width="100%" height={100} style={{ marginTop: 16 }} />
          </View>
        </ScrollView>
      </SafeScreen>
    );
  }

  const isOwnProduct = user?.id === product.sellerId;

  const handleAddToCart = async () => {
    if (isOwnProduct) {
      Alert.alert("Unavailable", "You cannot purchase your own product");
      return;
    }
    await addToCart(product, quantity);
  };

  const handleBuyNow = async () => {
    if (isOwnProduct) {
      Alert.alert("Unavailable", "You cannot purchase your own product");
      return;
    }
    await addToCart(product, quantity);
    navigation.navigate("Checkout");
  };

  const handleWishlistToggle = async () => {
    if (isInWishlist) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }
  };

  return (
    <SafeScreen>
      <View
        style={[
          styles.container,
          { backgroundColor: isDark ? "#0f0f0f" : "#f5f5f5" },
        ]}
      >
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 28 }}
        >
          <View style={styles.imageSection}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
            >
              <ChevronLeft size={24} color={isDark ? "#fafafa" : "#030213"} />
            </TouchableOpacity>
            <View style={{ width, height: 300 }}>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={(e) => {
                  const index = Math.round(
                    e.nativeEvent.contentOffset.x / width,
                  );
                  setCurrentImage(index);
                }}
                scrollEventThrottle={16}
              >
                {(product?.images || [product?.image].filter(Boolean)).map(
                  (uri: string, i: number) => (
                    <View key={i} style={{ width }}>
                      <View
                        style={{
                          width,
                          height: 300,
                          backgroundColor: isDark ? "#1a1a1a" : "#f0f0f0",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {uri ? (
                          <Image
                            source={{ uri }}
                            style={{ width: "100%", height: "100%" }}
                          />
                        ) : (
                          <Text
                            style={{
                              textAlign: "center",
                              color: "#737373",
                            }}
                          >
                            No Image
                          </Text>
                        )}
                      </View>
                    </View>
                  ),
                )}
              </ScrollView>
            </View>
            <View style={styles.imageDots}>
              {(product?.images || [product?.image].filter(Boolean)).map(
                (_: any, i: number) => (
                  <TouchableOpacity
                    key={i}
                    style={[styles.dot, i === currentImage && styles.activeDot]}
                    onPress={() => setCurrentImage(i)}
                  />
                ),
              )}
            </View>
            <TouchableOpacity
              style={styles.wishBtn}
              onPress={handleWishlistToggle}
            >
              <Heart
                size={24}
                color={isInWishlist ? "#d4183d" : "#ffffff"}
                fill={isInWishlist ? "#d4183d" : "transparent"}
              />
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.infoCard,
              { backgroundColor: isDark ? "#1a1a1a" : "#ffffff" },
            ]}
          >
            <Text
              style={[styles.name, { color: isDark ? "#fafafa" : "#030213" }]}
            >
              {product.name}
            </Text>
            <View style={styles.priceRow}>
              <Text style={styles.price}>${product.price.toFixed(2)}</Text>
              {product.originalPrice && (
                <Text
                  style={[
                    styles.originalPrice,
                    { color: isDark ? "#737373" : "#a3a3a3" },
                  ]}
                >
                  ${product.originalPrice.toFixed(2)}
                </Text>
              )}
              {product.discount && (
                <Badge
                  label={`-${product.discount}%`}
                  variant="destructive"
                  size="sm"
                />
              )}
            </View>
            <View style={styles.ratingRow}>
              <Star size={16} color="#fbbf24" fill="#fbbf24" />
              <Text
                style={[
                  styles.rating,
                  { color: isDark ? "#a3a3a3" : "#737373" },
                ]}
              >
                {product.rating.toFixed(1)} ({product.reviews || 0} reviews)
              </Text>
            </View>

            <View style={styles.qtyRow}>
              <Text
                style={[
                  styles.qtyLabel,
                  { color: isDark ? "#fafafa" : "#030213" },
                ]}
              >
                Quantity
              </Text>
              <View style={styles.qtyControls}>
                <TouchableOpacity
                  style={[
                    styles.qtyBtn,
                    {
                      backgroundColor: isDark ? "#333333" : "#f0f0f0",
                    },
                  ]}
                  onPress={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus size={18} color={isDark ? "#fafafa" : "#030213"} />
                </TouchableOpacity>
                <Text
                  style={[
                    styles.qtyText,
                    { color: isDark ? "#fafafa" : "#030213" },
                  ]}
                >
                  {quantity}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.qtyBtn,
                    {
                      backgroundColor: isDark ? "#333333" : "#f0f0f0",
                    },
                  ]}
                  onPress={() => setQuantity(quantity + 1)}
                >
                  <Plus size={18} color={isDark ? "#fafafa" : "#030213"} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.badges}>
              <View
                style={[
                  styles.badgeItem,
                  { backgroundColor: isDark ? "#262626" : "#f5f5f5" },
                ]}
              >
                <Truck size={18} color="#3b82f6" />
                <Text
                  style={[
                    styles.badgeText,
                    { color: isDark ? "#a3a3a3" : "#737373" },
                  ]}
                >
                  Free Shipping
                </Text>
              </View>
              <View
                style={[
                  styles.badgeItem,
                  { backgroundColor: isDark ? "#262626" : "#f5f5f5" },
                ]}
              >
                <Shield size={18} color="#10b981" />
                <Text
                  style={[
                    styles.badgeText,
                    { color: isDark ? "#a3a3a3" : "#737373" },
                  ]}
                >
                  2 Year Warranty
                </Text>
              </View>
              <View
                style={[
                  styles.badgeItem,
                  { backgroundColor: isDark ? "#262626" : "#f5f5f5" },
                ]}
              >
                <RotateCcw size={18} color="#fb923c" />
                <Text
                  style={[
                    styles.badgeText,
                    { color: isDark ? "#a3a3a3" : "#737373" },
                  ]}
                >
                  30 Day Return
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.tabs,
                { borderBottomColor: isDark ? "#404040" : "#e5e5e5" },
              ]}
            >
              {(["description", "specs", "reviews"] as const).map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tab, activeTab === tab && styles.activeTab]}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text
                    style={[
                      styles.tabText,
                      {
                        color:
                          activeTab === tab
                            ? "#9333ea"
                            : isDark
                              ? "#737373"
                              : "#a3a3a3",
                      },
                    ]}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {activeTab === "description" && (
              <Text
                style={[
                  styles.content,
                  { color: isDark ? "#a3a3a3" : "#737373" },
                ]}
              >
                {product.description ||
                  "Premium quality product designed for exceptional performance. Built with top-tier materials and backed by our satisfaction guarantee."}
              </Text>
            )}

            {activeTab === "specs" && (
              <View>
                {Object.entries(
                  product.specs || {
                    Brand: "Nova",
                    Model: "NX-2024",
                    Weight: "250g",
                    Color: "Black",
                  },
                ).map(([key, val]) => (
                  <View
                    key={key}
                    style={[
                      styles.specRow,
                      {
                        borderBottomColor: isDark ? "#333333" : "#f0f0f0",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.specKey,
                        { color: isDark ? "#a3a3a3" : "#737373" },
                      ]}
                    >
                      {key}
                    </Text>
                    <Text
                      style={[
                        styles.specVal,
                        { color: isDark ? "#fafafa" : "#030213" },
                      ]}
                    >
                      {val}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {activeTab === "reviews" && (
              <View>
                {reviews.map((review) => (
                  <View key={review.id} style={styles.reviewCard}>
                    <View style={styles.reviewHeader}>
                      <View
                        style={[
                          styles.reviewAvatar,
                          {
                            backgroundColor: isDark ? "#404040" : "#e5e5e5",
                          },
                        ]}
                      />
                      <View>
                        <Text
                          style={[
                            styles.reviewName,
                            { color: isDark ? "#fafafa" : "#030213" },
                          ]}
                        >
                          {review.user}
                        </Text>
                        <Text
                          style={[
                            styles.reviewDate,
                            { color: isDark ? "#737373" : "#a3a3a3" },
                          ]}
                        >
                          {review.date}
                        </Text>
                      </View>
                      <View style={styles.reviewStars}>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            color={
                              i < review.rating
                                ? "#fbbf24"
                                : isDark
                                  ? "#525252"
                                  : "#d4d4d4"
                            }
                            fill={i < review.rating ? "#fbbf24" : "transparent"}
                          />
                        ))}
                      </View>
                    </View>
                    <Text
                      style={[
                        styles.reviewText,
                        { color: isDark ? "#a3a3a3" : "#737373" },
                      ]}
                    >
                      {review.comment}
                    </Text>
                  </View>
                ))}

                <View
                  style={[
                    styles.addReviewSection,
                    {
                      backgroundColor: isDark ? "#262626" : "#f5f5f5",
                    },
                  ]}
                >
                  <Text style={[styles.reviewName, { marginTop: 16 }]}>
                    Add Your Review
                  </Text>
                  <View style={styles.ratingInput}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <TouchableOpacity
                        key={star}
                        onPress={() => setNewRating(star)}
                      >
                        <Star
                          size={24}
                          color={star <= newRating ? "#fbbf24" : "#d4d4d4"}
                          fill={star <= newRating ? "#fbbf24" : "transparent"}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                  <TextInput
                    style={[
                      styles.reviewInput,
                      {
                        borderColor: isDark ? "#404040" : "#e5e5e5",
                        color: isDark ? "#fafafa" : "#030213",
                      },
                    ]}
                    value={newReview}
                    onChangeText={setNewReview}
                    placeholder="Write your review..."
                    multiline
                    numberOfLines={4}
                  />
                  <Button
                    onPress={handleSubmitReview}
                    style={styles.submitReviewBtn}
                    disabled={submittingReview}
                  >
                    {submittingReview ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      "Submit Review"
                    )}
                  </Button>
                </View>
              </View>
            )}

            {relatedList}
          </View>
        </ScrollView>

        <View
          style={[
            styles.footer,
            {
              backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
              paddingBottom: Math.max(16, insets.bottom),
            },
          ]}
        >
          {isOwnProduct ? (
            <>
              <Button
                onPress={() =>
                  navigation.navigate("SellProduct", {
                    productId: product.id,
                  })
                }
                variant="outline"
                style={styles.editBtn}
              >
                Edit
              </Button>
              <Button
                onPress={() =>
                  Alert.alert(
                    "Delete Product",
                    "Are you sure you want to delete this product?",
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Delete",
                        style: "destructive",
                        onPress: async () => {
                          await productService.deleteProduct(product.id);
                          navigation.goBack();
                        },
                      },
                    ],
                  )
                }
                variant="destructive"
                style={styles.deleteBtn}
              >
                Delete
              </Button>
            </>
          ) : (
            <>
              <Button
                onPress={handleAddToCart}
                variant="outline"
                style={styles.cartBtn}
              >
                <ShoppingCart
                  size={20}
                  color={isDark ? "#fafafa" : "#030213"}
                />
              </Button>
              <Button onPress={handleBuyNow} style={styles.buyBtn}>
                Buy Now
              </Button>
            </>
          )}
        </View>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageSection: { position: "relative" },
  backBtn: {
    position: "absolute",
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.8)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  wishBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  imageDots: {
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
    flexDirection: "row",
    gap: 8,
    zIndex: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  activeDot: { backgroundColor: "#ffffff", width: 24 },
  infoCard: {
    padding: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
  },
  name: { fontSize: 22, fontWeight: "700" },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  price: { fontSize: 24, fontWeight: "700", color: "#9333ea" },
  originalPrice: {
    fontSize: 16,
    textDecorationLine: "line-through",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 8,
  },
  rating: { fontSize: 14 },
  qtyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  qtyLabel: { fontSize: 16, fontWeight: "600" },
  qtyControls: { flexDirection: "row", alignItems: "center", gap: 12 },
  qtyBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: { fontSize: 18, fontWeight: "600" },
  badges: { flexDirection: "row", gap: 8, marginTop: 16 },
  badgeItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    borderRadius: 8,
    gap: 4,
  },
  badgeText: { fontSize: 11, fontWeight: "500" },
  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    marginTop: 20,
  },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center" },
  activeTab: { borderBottomWidth: 2, borderBottomColor: "#9333ea" },
  tabText: { fontSize: 14, fontWeight: "600" },
  content: { fontSize: 14, lineHeight: 22, marginTop: 16 },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  specKey: { fontSize: 14 },
  specVal: { fontSize: 14, fontWeight: "500" },
  reviewCard: { marginTop: 16 },
  reviewHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  reviewName: { fontSize: 14, fontWeight: "600" },
  reviewDate: { fontSize: 12 },
  reviewStars: { flexDirection: "row", marginLeft: "auto", gap: 2 },
  reviewText: { fontSize: 14, lineHeight: 20 },
  footer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cartBtn: {
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  buyBtn: { flex: 1 },
  editBtn: { flex: 1 },
  deleteBtn: { flex: 1 },
  addReviewSection: {
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
  },
  ratingInput: {
    flexDirection: "row",
    gap: 8,
    marginVertical: 12,
  },
  reviewInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    textAlignVertical: "top",
    minHeight: 100,
  },
  submitReviewBtn: {
    marginTop: 12,
  },
  relatedSection: {
    marginTop: 24,
    padding: 16,
    borderRadius: 16,
  },
  relatedTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  relatedCard: {
    width: 140,
    marginRight: 12,
    borderRadius: 12,
    padding: 8,
  },
  relatedImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
  },
  relatedName: {
    fontSize: 13,
    fontWeight: "500",
    marginTop: 8,
  },
  relatedPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: "#9333ea",
    marginTop: 4,
  },
});
