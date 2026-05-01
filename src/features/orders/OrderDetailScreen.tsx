import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeScreen } from '@/components/layout/SafeScreen';
import { useTheme } from '@/hooks/useTheme';
import { Badge, Button } from '@/components/common';
import { ChevronLeft, MapPin, CreditCard } from 'lucide-react-native';
import { mockOrderDetail } from '@/services/mocks/orders';

const timelineSteps = [
  { label: 'Ordered', done: true },
  { label: 'Confirmed', done: true },
  { label: 'Shipped', done: true },
  { label: 'Out for Delivery', done: false },
  { label: 'Delivered', done: false },
];

export default function OrderDetailScreen({ navigation }: any) {
  const { isDark } = useTheme();
  const order = mockOrderDetail;

  const statusColor = (status: string) => {
    if (status === 'delivered') return '#10b981';
    if (status === 'in_transit') return '#3b82f6';
    if (status === 'processing') return '#f59e0b';
    return '#d4183d';
  };

  const progressIndex = { processing: 1, in_transit: 2, delivered: 4, cancelled: 0 }[order.status] || 0;

  return (
    <SafeScreen hasScrollView>
      <View style={[styles.container, { backgroundColor: isDark ? '#0f0f0f' : '#f5f5f5' }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}><ChevronLeft size={24} color={isDark ? '#fafafa' : '#030213'} /></TouchableOpacity>
          <Text style={[styles.title, { color: isDark ? '#fafafa' : '#030213' }]}>Order {order.id}</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={[styles.banner, { backgroundColor: statusColor(order.status) }]}>
          <Badge label={order.status.replace('_', ' ').toUpperCase()} variant={order.status === 'delivered' ? 'success' : 'info'} size="md" />
        </View>

        <View style={styles.timeline}>
          {timelineSteps.map((step, i) => (
            <View key={i} style={styles.timelineStep}>
              <View style={[styles.dot, { backgroundColor: i <= progressIndex ? '#9333ea' : isDark ? '#262626' : '#ececf0' }]} />
              {i < timelineSteps.length - 1 && <View style={[styles.line, { backgroundColor: i < progressIndex ? '#9333ea' : isDark ? '#262626' : '#ececf0' }]} />}
              <Text style={[styles.stepLabel, { color: i <= progressIndex ? (isDark ? '#fafafa' : '#030213') : isDark ? '#737373' : '#a3a3a3' }]}>{step.label}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.section, { backgroundColor: isDark ? '#1a1a1a' : '#ffffff' }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#fafafa' : '#030213' }]}>Items</Text>
          {order.items.map((item, i) => (
            <View key={i} style={styles.itemRow}>
              <Image source={{ uri: item.image }} style={styles.thumb} />
              <View style={styles.itemInfo}>
                <Text style={[styles.itemName, { color: isDark ? '#fafafa' : '#030213' }]}>{item.name}</Text>
                <Text style={[styles.itemQty, { color: isDark ? '#a3a3a3' : '#737373' }]}>Qty: {item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {order.address && (
          <View style={[styles.section, { backgroundColor: isDark ? '#1a1a1a' : '#ffffff' }]}>
            <View style={styles.sectionHeader}>
              <MapPin size={18} color="#9333ea" />
              <Text style={[styles.sectionTitle, { color: isDark ? '#fafafa' : '#030213' }]}>Delivery Address</Text>
            </View>
            <Text style={[styles.addrText, { color: isDark ? '#a3a3a3' : '#737373' }]}>{order.address.street}</Text>
            <Text style={[styles.addrText, { color: isDark ? '#a3a3a3' : '#737373' }]}>{order.address.city}</Text>
          </View>
        )}

        <View style={[styles.section, { backgroundColor: isDark ? '#1a1a1a' : '#ffffff' }]}>
          <View style={styles.sectionHeader}>
            <CreditCard size={18} color="#9333ea" />
            <Text style={[styles.sectionTitle, { color: isDark ? '#fafafa' : '#030213' }]}>Payment</Text>
          </View>
          <View style={styles.payRow}>
            <Text style={[styles.payLabel, { color: isDark ? '#a3a3a3' : '#737373' }]}>Subtotal</Text>
            <Text style={[styles.payVal, { color: isDark ? '#fafafa' : '#030213' }]}>${(order.total * 0.9).toFixed(2)}</Text>
          </View>
          <View style={styles.payRow}>
            <Text style={[styles.payLabel, { color: isDark ? '#a3a3a3' : '#737373' }]}>Shipping</Text>
            <Text style={[styles.payVal, { color: isDark ? '#fafafa' : '#030213' }]}>Free</Text>
          </View>
          <View style={[styles.payRow, styles.totalRow]}>
            <Text style={[styles.totalLabel, { color: isDark ? '#fafafa' : '#030213' }]}>Total</Text>
            <Text style={styles.totalValue}>${order.total.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Button onPress={() => {}} style={{ width: '100%' }}>Track Order</Button>
        </View>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  title: { fontSize: 18, fontWeight: '700' },
  banner: { marginHorizontal: 20, marginBottom: 16, padding: 16, borderRadius: 12, alignItems: 'center' },
  timeline: { marginHorizontal: 20, marginBottom: 16, padding: 16, backgroundColor: '#ffffff', borderRadius: 12 },
  timelineStep: { flexDirection: 'row', alignItems: 'center', position: 'relative' },
  dot: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  line: { position: 'absolute', left: 12, top: 24, width: 2, height: 40 },
  stepLabel: { marginLeft: 12, fontSize: 14, fontWeight: '500', marginBottom: 8 },
  section: { marginHorizontal: 20, marginBottom: 12, borderRadius: 12, padding: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginLeft: 8 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  thumb: { width: 48, height: 48, borderRadius: 8 },
  itemInfo: { flex: 1, marginLeft: 12 },
  itemName: { fontSize: 14, fontWeight: '500' },
  itemQty: { fontSize: 12 },
  itemPrice: { fontSize: 14, fontWeight: '600', color: '#9333ea' },
  addrText: { fontSize: 14, marginTop: 4 },
  payRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  payLabel: { fontSize: 14 },
  payVal: { fontSize: 14, fontWeight: '600' },
  totalRow: { borderTopWidth: 1, borderTopColor: '#e5e5e5', paddingTop: 12, marginTop: 8 },
  totalLabel: { fontSize: 16, fontWeight: '700' },
  totalValue: { fontSize: 18, fontWeight: '700', color: '#9333ea' },
  footer: { padding: 20 },
});
