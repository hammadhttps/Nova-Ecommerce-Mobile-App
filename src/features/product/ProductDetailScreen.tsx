import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeScreen } from '@/components/layout/SafeScreen';
import { useTheme } from '@/hooks/useTheme';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { Button, Badge, Skeleton } from '@/components/common';
import { Star, Minus, Plus, Heart, ShoppingCart, ChevronLeft, Truck, Shield, RotateCcw } from 'lucide-react-native';
import { allProducts, productReviews, productDetailImages } from '@/services/mocks/products';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen({ route, navigation }: any) {
  const id = parseInt(route.params?.id);
  const { isDark } = useTheme();
  const { addToCart } = useCart();
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

  const product = allProducts.find((p) => p.id === id);
  const isInWishlist = wishlistItems.some((item) => item.id === id);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

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

  const handleAddToCart = async () => {
    await addToCart(product, quantity);
  };

  const handleBuyNow = async () => {
    await addToCart(product, quantity);
    navigation.navigate('Checkout');
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
      <View style={[styles.container, { backgroundColor: isDark ? '#0f0f0f' : '#f5f5f5' }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.imageSection}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <ChevronLeft size={24} color={isDark ? '#fafafa' : '#030213'} />
            </TouchableOpacity>
            <Image source={{ uri: productDetailImages[currentImage] }} style={styles.mainImage} resizeMode="cover" />
            <View style={styles.imageDots}>
              {productDetailImages.map((_, i) => (
                <TouchableOpacity key={i} style={[styles.dot, i === currentImage && styles.activeDot]} onPress={() => setCurrentImage(i)} />
              ))}
            </View>
            <TouchableOpacity style={styles.wishBtn} onPress={handleWishlistToggle}>
              <Heart size={24} color={isInWishlist ? '#d4183d' : '#ffffff'} fill={isInWishlist ? '#d4183d' : 'transparent'} />
            </TouchableOpacity>
          </View>

          <View style={[styles.infoCard, { backgroundColor: isDark ? '#1a1a1a' : '#ffffff' }]}>
            <Text style={[styles.name, { color: isDark ? '#fafafa' : '#030213' }]}>{product.name}</Text>
            <View style={styles.priceRow}>
              <Text style={styles.price}>${product.price.toFixed(2)}</Text>
              {product.originalPrice && <Text style={styles.originalPrice}>${product.originalPrice.toFixed(2)}</Text>}
              {product.discount && <Badge label={`-${product.discount}%`} variant="destructive" size="sm" />}
            </View>
            <View style={styles.ratingRow}>
              <Star size={16} color="#fbbf24" fill="#fbbf24" />
              <Text style={[styles.rating, { color: isDark ? '#a3a3a3' : '#737373' }]}>{product.rating.toFixed(1)} ({product.reviews || 0} reviews)</Text>
            </View>

            <View style={styles.qtyRow}>
              <Text style={[styles.qtyLabel, { color: isDark ? '#fafafa' : '#030213' }]}>Quantity</Text>
              <View style={styles.qtyControls}>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Minus size={18} color={isDark ? '#fafafa' : '#030213'} />
                </TouchableOpacity>
                <Text style={[styles.qtyText, { color: isDark ? '#fafafa' : '#030213' }]}>{quantity}</Text>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity(quantity + 1)}>
                  <Plus size={18} color={isDark ? '#fafafa' : '#030213'} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.badges}>
              <View style={[styles.badgeItem, { backgroundColor: isDark ? '#262626' : '#f5f5f5' }]}>
                <Truck size={18} color="#3b82f6" />
                <Text style={[styles.badgeText, { color: isDark ? '#a3a3a3' : '#737373' }]}>Free Shipping</Text>
              </View>
              <View style={[styles.badgeItem, { backgroundColor: isDark ? '#262626' : '#f5f5f5' }]}>
                <Shield size={18} color="#10b981" />
                <Text style={[styles.badgeText, { color: isDark ? '#a3a3a3' : '#737373' }]}>2 Year Warranty</Text>
              </View>
              <View style={[styles.badgeItem, { backgroundColor: isDark ? '#262626' : '#f5f5f5' }]}>
                <RotateCcw size={18} color="#fb923c" />
                <Text style={[styles.badgeText, { color: isDark ? '#a3a3a3' : '#737373' }]}>30 Day Return</Text>
              </View>
            </View>

            <View style={styles.tabs}>
              {(['description', 'specs', 'reviews'] as const).map((tab) => (
                <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.activeTab]} onPress={() => setActiveTab(tab)}>
                  <Text style={[styles.tabText, { color: activeTab === tab ? '#9333ea' : isDark ? '#737373' : '#a3a3a3' }]}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {activeTab === 'description' && (
              <Text style={[styles.content, { color: isDark ? '#a3a3a3' : '#737373' }]}>
                {product.description || 'Premium quality product designed for exceptional performance. Built with top-tier materials and backed by our satisfaction guarantee.'}
              </Text>
            )}

            {activeTab === 'specs' && (
              <View>
                {Object.entries(product.specs || { Brand: 'Nova', Model: 'NX-2024', Weight: '250g', Color: 'Black' }).map(([key, val]) => (
                  <View key={key} style={styles.specRow}>
                    <Text style={[styles.specKey, { color: isDark ? '#a3a3a3' : '#737373' }]}>{key}</Text>
                    <Text style={[styles.specVal, { color: isDark ? '#fafafa' : '#030213' }]}>{val}</Text>
                  </View>
                ))}
              </View>
            )}

            {activeTab === 'reviews' && (
              <View>
                {productReviews.map((review) => (
                  <View key={review.id} style={styles.reviewCard}>
                    <View style={styles.reviewHeader}>
                      <Image source={{ uri: review.avatar }} style={styles.reviewAvatar} />
                      <View>
                        <Text style={[styles.reviewName, { color: isDark ? '#fafafa' : '#030213' }]}>{review.user}</Text>
                        <Text style={[styles.reviewDate, { color: isDark ? '#737373' : '#a3a3a3' }]}>{review.date}</Text>
                      </View>
                      <View style={styles.reviewStars}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} color={i < review.rating ? '#fbbf24' : '#d4d4d4'} fill={i < review.rating ? '#fbbf24' : 'transparent'} />
                        ))}
                      </View>
                    </View>
                    <Text style={[styles.reviewText, { color: isDark ? '#a3a3a3' : '#737373' }]}>{review.comment}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>

        <View style={[styles.footer, { backgroundColor: isDark ? '#1a1a1a' : '#ffffff' }]}>
          <Button onPress={handleAddToCart} variant="outline" style={styles.cartBtn}>
            <ShoppingCart size={20} color={isDark ? '#fafafa' : '#030213'} />
          </Button>
          <Button onPress={handleBuyNow} style={styles.buyBtn}>Buy Now</Button>
        </View>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageSection: { position: 'relative' },
  mainImage: { width, height: 300 },
  backBtn: { position: 'absolute', top: 16, left: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.8)', alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  wishBtn: { position: 'absolute', top: 16, right: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' },
  imageDots: { position: 'absolute', bottom: 16, alignSelf: 'center', flexDirection: 'row', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.5)' },
  activeDot: { backgroundColor: '#ffffff', width: 24 },
  infoCard: { padding: 16, borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -24 },
  name: { fontSize: 22, fontWeight: '700' },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  price: { fontSize: 24, fontWeight: '700', color: '#9333ea' },
  originalPrice: { fontSize: 16, color: '#a3a3a3', textDecorationLine: 'line-through' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  rating: { fontSize: 14 },
  qtyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
  qtyLabel: { fontSize: 16, fontWeight: '600' },
  qtyControls: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  qtyBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center' },
  qtyText: { fontSize: 18, fontWeight: '600' },
  badges: { flexDirection: 'row', gap: 8, marginTop: 16 },
  badgeItem: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 8, borderRadius: 8, gap: 4 },
  badgeText: { fontSize: 11, fontWeight: '500' },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e5e5e5', marginTop: 20 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#9333ea' },
  tabText: { fontSize: 14, fontWeight: '600' },
  content: { fontSize: 14, lineHeight: 22, marginTop: 16 },
  specRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  specKey: { fontSize: 14 },
  specVal: { fontSize: 14, fontWeight: '500' },
  reviewCard: { marginTop: 16 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  reviewAvatar: { width: 36, height: 36, borderRadius: 18, marginRight: 12 },
  reviewName: { fontSize: 14, fontWeight: '600' },
  reviewDate: { fontSize: 12 },
  reviewStars: { flexDirection: 'row', marginLeft: 'auto', gap: 2 },
  reviewText: { fontSize: 14, lineHeight: 20 },
  footer: { flexDirection: 'row', padding: 16, gap: 12, borderTopLeftRadius: 24, borderTopRightRadius: 24, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 8 },
  cartBtn: { width: 56, height: 56, justifyContent: 'center', alignItems: 'center' },
  buyBtn: { flex: 1 },
});
