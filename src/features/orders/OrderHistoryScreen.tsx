import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeScreen } from '@/components/layout/SafeScreen';
import { useTheme } from '@/hooks/useTheme';
import { Badge } from '@/components/common/Badge';
import { mockOrders } from '@/services/mocks/orders';

const tabs = ['all', 'processing', 'in_transit', 'delivered'] as const;
type TabType = (typeof tabs)[number];

const tabLabels: Record<TabType, string> = { all: 'All', processing: 'Processing', in_transit: 'Shipped', delivered: 'Delivered' };

export default function OrderHistoryScreen({ navigation }: any) {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const filtered = activeTab === 'all' ? mockOrders : mockOrders.filter((o) => o.status === activeTab);

  const statusVariant = (status: string) => {
    if (status === 'delivered') return 'success';
    if (status === 'in_transit') return 'info';
    if (status === 'processing') return 'warning';
    return 'destructive';
  };

  const renderItem = ({ item }: { item: typeof mockOrders[0] }) => (
    <TouchableOpacity style={[styles.card, { backgroundColor: isDark ? '#1a1a1a' : '#ffffff' }]} onPress={() => navigation.navigate('OrderDetail', { id: item.id })} activeOpacity={0.7}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.id, { color: isDark ? '#fafafa' : '#030213' }]}>{item.id}</Text>
          <Text style={[styles.date, { color: isDark ? '#a3a3a3' : '#737373' }]}>{item.date}</Text>
        </View>
        <Badge label={tabLabels[item.status as TabType] || item.status} variant={statusVariant(item.status) as any} />
      </View>
      <View style={styles.items}>
        {item.items.slice(0, 3).map((it, i) => (
          <Image key={i} source={{ uri: it.image }} style={styles.thumb} />
        ))}
        <Text style={[styles.total, { color: isDark ? '#fafafa' : '#030213' }]}>${item.total.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeScreen>
      <View style={[styles.container, { backgroundColor: isDark ? '#0f0f0f' : '#f5f5f5' }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: isDark ? '#fafafa' : '#030213' }]}>My Orders</Text>
        </View>
        <View style={styles.tabBar}>
          {tabs.map((tab) => (
            <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.activeTab]} onPress={() => setActiveTab(tab)}>
              <Text style={[styles.tabText, { color: activeTab === tab ? '#9333ea' : isDark ? '#737373' : '#a3a3a3' }]}>{tabLabels[tab]}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <FlatList data={filtered} renderItem={renderItem} keyExtractor={(item) => item.id} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false} ListEmptyComponent={<Text style={[styles.empty, { color: isDark ? '#a3a3a3' : '#737373' }]}>No orders found</Text>} />
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingVertical: 16 },
  title: { fontSize: 28, fontWeight: '700' },
  tabBar: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 16 },
  tab: { marginRight: 16, paddingVertical: 8 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#9333ea' },
  tabText: { fontSize: 14, fontWeight: '600' },
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },
  card: { borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  id: { fontSize: 16, fontWeight: '600' },
  date: { fontSize: 12, marginTop: 2 },
  items: { flexDirection: 'row', alignItems: 'center' },
  thumb: { width: 40, height: 40, borderRadius: 8, marginRight: 8 },
  total: { marginLeft: 'auto', fontSize: 16, fontWeight: '700' },
  empty: { textAlign: 'center', marginTop: 40, fontSize: 16 },
});
