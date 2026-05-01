import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeScreen } from '@/components/layout/SafeScreen';
import { useTheme } from '@/hooks/useTheme';
import { Button, Badge } from '@/components/common';
import { MapPin, Trash2, ChevronLeft, Edit2 } from 'lucide-react-native';
import { mockAddresses } from '@/services/mocks/addresses';

export default function AddressManagementScreen({ navigation }: any) {
  const { isDark } = useTheme();

  const renderItem = ({ item }: { item: typeof mockAddresses[0] }) => (
    <View style={[styles.card, { backgroundColor: isDark ? '#1a1a1a' : '#ffffff' }]}>
      <View style={styles.cardHeader}>
        <View style={styles.cardLeft}>
          <MapPin size={20} color="#9333ea" />
          <Text style={[styles.name, { color: isDark ? '#fafafa' : '#030213' }]}>{item.name}</Text>
        </View>
        {item.isDefault && <Badge label="Default" variant="info" size="sm" />}
      </View>
      <Text style={[styles.addr, { color: isDark ? '#a3a3a3' : '#737373' }]}>{item.street}</Text>
      <Text style={[styles.addr, { color: isDark ? '#a3a3a3' : '#737373' }]}>{item.city}</Text>
      <Text style={[styles.phone, { color: isDark ? '#a3a3a3' : '#737373' }]}>{item.phone}</Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => {}}>
          <Edit2 size={16} color="#3b82f6" />
          <Text style={{ color: '#3b82f6', fontSize: 14, fontWeight: '500' }}>Edit</Text>
        </TouchableOpacity>
        {!item.isDefault && (
          <TouchableOpacity style={styles.actionBtn} onPress={() => {}}>
            <Trash2 size={16} color="#ef4444" />
            <Text style={{ color: '#ef4444', fontSize: 14, fontWeight: '500' }}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeScreen>
      <View style={[styles.container, { backgroundColor: isDark ? '#0f0f0f' : '#f5f5f5' }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}><ChevronLeft size={24} color={isDark ? '#fafafa' : '#030213'} /></TouchableOpacity>
          <Text style={[styles.title, { color: isDark ? '#fafafa' : '#030213' }]}>Addresses</Text>
          <View style={{ width: 24 }} />
        </View>
        <FlatList data={mockAddresses} renderItem={renderItem} keyExtractor={(item) => item.id.toString()} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} />
        <View style={styles.footer}>
          <Button onPress={() => {}} style={{ width: '100%' }}>Add New Address</Button>
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
  card: { borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { fontSize: 16, fontWeight: '600' },
  addr: { fontSize: 14, marginBottom: 2 },
  phone: { fontSize: 14, marginTop: 4 },
  actions: { flexDirection: 'row', gap: 16, marginTop: 12 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  footer: { padding: 20 },
});
