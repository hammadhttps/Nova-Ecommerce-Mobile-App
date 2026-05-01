import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { SafeScreen } from '@/components/layout/SafeScreen';
import { useTheme } from '@/hooks/useTheme';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { EmptyState } from '@/components/common/EmptyState';
import { X } from 'lucide-react-native';
import { WishlistItem } from '@/types';

export default function WishlistScreen({ navigation }: any) {
  const { isDark } = useTheme();
  const { wishlistItems, removeFromWishlist, wishlistLoading } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (item: WishlistItem) => {
    addToCart(item);
  };

  const handleRemove = (id: number) => {
    removeFromWishlist(id);
  };

  const renderItem = ({ item }: { item: WishlistItem }) => (
    <View style={[styles.card, { backgroundColor: isDark ? '#1a1a1a' : '#ffffff' }]}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={[styles.name, { color: isDark ? '#fafafa' : '#030213' }]} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        <View style={styles.row}>
          {item.inStock ? (
            <Badge label="In Stock" variant="success" size="sm" />
          ) : (
            <Badge label="Out of Stock" variant="destructive" size="sm" />
          )}
          <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemove(item.id)} activeOpacity={0.7}>
            <X size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
        {item.inStock && (
          <Button onPress={() => handleAddToCart(item)} size="sm" style={styles.cartBtn}>
            Add to Cart
          </Button>
        )}
      </View>
    </View>
  );

  if (wishlistLoading) {
    return <SafeScreen loading />;
  }

  if (wishlistItems.length === 0) {
    return (
      <SafeScreen>
        <View style={[styles.container, { backgroundColor: isDark ? '#0f0f0f' : '#f5f5f5' }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: isDark ? '#fafafa' : '#030213' }]}>My Wishlist</Text>
          </View>
          <EmptyState icon="heart" title="Your wishlist is empty" message="Save items you love to your wishlist" />
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen>
      <View style={[styles.container, { backgroundColor: isDark ? '#0f0f0f' : '#f5f5f5' }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: isDark ? '#fafafa' : '#030213' }]}>My Wishlist</Text>
          <Text style={[styles.subtitle, { color: isDark ? '#a3a3a3' : '#737373' }]}>{wishlistItems.length} items</Text>
        </View>
        <FlatList
          data={wishlistItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingVertical: 16 },
  title: { fontSize: 28, fontWeight: '700' },
  subtitle: { fontSize: 14, marginTop: 4 },
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },
  card: { flexDirection: 'row', borderRadius: 12, padding: 12, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  image: { width: 80, height: 80, borderRadius: 8 },
  info: { flex: 1, marginLeft: 12, justifyContent: 'space-between' },
  name: { fontSize: 14, fontWeight: '600' },
  price: { fontSize: 16, fontWeight: '700', color: '#9333ea' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  removeBtn: { padding: 4 },
  cartBtn: { alignSelf: 'flex-start', marginTop: 8 },
});
