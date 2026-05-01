import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { SafeScreen } from '@/components/layout/SafeScreen';
import { useTheme } from '@/hooks/useTheme';
import { useCart } from '@/hooks/useCart';
import { Button, Input, EmptyState } from '@/components/common';
import { Minus, Plus, X } from 'lucide-react-native';
import { CartItem } from '@/types';

export default function CartScreen({ navigation }: any) {
  const { isDark } = useTheme();
  const {
    items,
    cartLoading,
    promoCode,
    applyPromoCode,
    promoMessage,
    updateQuantity,
    removeFromCart,
    subtotal,
    shipping,
    total,
  } = useCart();
  const [code, setCode] = useState('');

  if (cartLoading) {
    return <SafeScreen loading />;
  }

  if (items.length === 0) {
    return (
      <SafeScreen>
        <View style={[styles.container, { backgroundColor: isDark ? '#0f0f0f' : '#f5f5f5' }]}>
          <EmptyState icon="cart" title="Your cart is empty" message="Add items to get started" />
        </View>
      </SafeScreen>
    );
  }

  const handleApplyPromo = () => {
    applyPromoCode(code);
  };

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={[styles.card, { backgroundColor: isDark ? '#1a1a1a' : '#ffffff' }]}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={[styles.name, { color: isDark ? '#fafafa' : '#030213' }]} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        <View style={styles.row}>
          <View style={styles.qtyRow}>
            <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}>
              <Minus size={16} color={isDark ? '#fafafa' : '#030213'} />
            </TouchableOpacity>
            <Text style={[styles.qtyText, { color: isDark ? '#fafafa' : '#030213' }]}>{item.quantity}</Text>
            <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(item.id, item.quantity + 1)}>
              <Plus size={16} color={isDark ? '#fafafa' : '#030213'} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => removeFromCart(item.id)}>
            <X size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeScreen>
      <View style={[styles.container, { backgroundColor: isDark ? '#0f0f0f' : '#f5f5f5' }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: isDark ? '#fafafa' : '#030213' }]}>My Cart</Text>
          <Text style={[styles.subtitle, { color: isDark ? '#a3a3a3' : '#737373' }]}>{items.length} items</Text>
        </View>
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
        <View style={[styles.bottom, { backgroundColor: isDark ? '#1a1a1a' : '#ffffff' }]}>
          <View style={styles.promoRow}>
            <Input placeholder="Promo code" value={code} onChangeText={setCode} style={styles.promoInput} />
            <Button onPress={handleApplyPromo} size="sm" style={styles.applyBtn}>Apply</Button>
          </View>
          {promoMessage ? (
            <Text style={[styles.promoMsg, { color: promoCode ? '#10b981' : '#d4183d' }]}>{promoMessage}</Text>
          ) : null}
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={[styles.label, { color: isDark ? '#a3a3a3' : '#737373' }]}>Subtotal</Text>
              <Text style={[styles.value, { color: isDark ? '#fafafa' : '#030213' }]}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.label, { color: isDark ? '#a3a3a3' : '#737373' }]}>Shipping</Text>
              <Text style={[styles.value, { color: isDark ? '#fafafa' : '#030213' }]}>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={[styles.totalLabel, { color: isDark ? '#fafafa' : '#030213' }]}>Total</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
          </View>
          <Button onPress={() => navigation.navigate('Checkout')} style={{ width: '100%' }}>Checkout</Button>
        </View>
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
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  qtyRow: { flexDirection: 'row', alignItems: 'center' },
  qtyBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center' },
  qtyText: { fontSize: 14, fontWeight: '600', marginHorizontal: 12 },
  bottom: { padding: 20, borderTopLeftRadius: 24, borderTopRightRadius: 24, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 8 },
  promoRow: { flexDirection: 'row', marginBottom: 8 },
  promoInput: { flex: 1, marginRight: 8 },
  applyBtn: { width: 80 },
  promoMsg: { fontSize: 12, marginBottom: 8 },
  summary: { marginBottom: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  label: { fontSize: 14 },
  value: { fontSize: 14, fontWeight: '600' },
  totalRow: { borderTopWidth: 1, borderTopColor: '#e5e5e5', paddingTop: 12, marginTop: 8 },
  totalLabel: { fontSize: 16, fontWeight: '700' },
  totalValue: { fontSize: 18, fontWeight: '700', color: '#9333ea' },
});
