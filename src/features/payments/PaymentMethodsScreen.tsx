import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeScreen } from '@/components/layout/SafeScreen';
import { useTheme } from '@/hooks/useTheme';
import { Button, Badge } from '@/components/common';
import { CreditCard, Trash2, ChevronLeft } from 'lucide-react-native';
import { mockPaymentMethods } from '@/services/mocks/payments';

export default function PaymentMethodsScreen({ navigation }: any) {
  const { isDark } = useTheme();

  const gradients: Record<string, [string, string]> = {
    visa: ['#1a237e', '#283593'],
    mastercard: ['#e65100', '#ff6d00'],
    amex: ['#1b5e20', '#2e7d32'],
  };

  const renderItem = ({ item }: { item: typeof mockPaymentMethods[0] }) => {
    const colors = gradients[item.type] || ['#374151', '#4b5563'];
    return (
      <View style={styles.cardWrapper}>
        <View style={[styles.card, { backgroundColor: colors[0] }]}>
          <View style={styles.cardTop}>
            <Text style={styles.cardLogo}>{item.type.toUpperCase()}</Text>
            {item.isDefault && <Badge label="Default" variant="info" size="sm" />}
          </View>
          <CreditCard size={32} color="rgba(255,255,255,0.6)" />
          <Text style={styles.cardNumber}>{item.number}</Text>
          <View style={styles.cardBottom}>
            <Text style={styles.cardName}>{item.name}</Text>
            <Text style={styles.cardExpiry}>Exp {item.expiry}</Text>
          </View>
        </View>
        {!item.isDefault && (
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => {}}>
              <Trash2 size={18} color="#ef4444" />
              <Text style={styles.actionText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeScreen>
      <View style={[styles.container, { backgroundColor: isDark ? '#0f0f0f' : '#f5f5f5' }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}><ChevronLeft size={24} color={isDark ? '#fafafa' : '#030213'} /></TouchableOpacity>
          <Text style={[styles.title, { color: isDark ? '#fafafa' : '#030213' }]}>Payment Methods</Text>
          <View style={{ width: 24 }} />
        </View>
        <FlatList data={mockPaymentMethods} renderItem={renderItem} keyExtractor={(item) => item.id.toString()} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} />
        <View style={styles.footer}>
          <Button onPress={() => {}} variant="outline" style={{ width: '100%' }}>Add New Card</Button>
        </View>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  title: { fontSize: 20, fontWeight: '700' },
  list: { paddingHorizontal: 20, paddingBottom: 20 },
  cardWrapper: { marginBottom: 16 },
  card: { borderRadius: 16, padding: 20, minHeight: 180, justifyContent: 'space-between' },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLogo: { color: '#ffffff', fontSize: 20, fontWeight: '700' },
  cardNumber: { color: '#ffffff', fontSize: 20, fontWeight: '500', letterSpacing: 2, marginTop: 16 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between' },
  cardName: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  cardExpiry: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 8 },
  actionText: { color: '#ef4444', fontSize: 14, fontWeight: '500' },
  footer: { padding: 20 },
});
