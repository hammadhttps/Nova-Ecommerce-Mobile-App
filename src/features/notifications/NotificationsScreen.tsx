import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeScreen } from '@/components/layout/SafeScreen';
import { useTheme } from '@/hooks/useTheme';
import { ShoppingBag, Truck, Tag, Gift, ChevronLeft, CheckCheck } from 'lucide-react-native';
import { mockNotifications } from '@/services/mocks/notifications';

export default function NotificationsScreen({ navigation }: any) {
  const { isDark } = useTheme();
  const [notifications, setNotifications] = useState(mockNotifications);

  const getIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingBag size={20} color="#9333ea" />;
      case 'delivery': return <Truck size={20} color="#3b82f6" />;
      case 'offer': case 'price_drop': return <Tag size={20} color="#f59e0b" />;
      case 'success': return <Gift size={20} color="#10b981" />;
      default: return <ShoppingBag size={20} color="#9333ea" />;
    }
  };

  const unread = notifications.filter((n) => !n.read);
  const read = notifications.filter((n) => n.read);

  const renderItem = ({ item }: { item: typeof mockNotifications[0] }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: isDark ? '#1a1a1a' : '#ffffff' }, !item.read && { borderLeftWidth: 3, borderLeftColor: '#9333ea' }]}
      onPress={() => setNotifications(notifications.map((n) => (n.id === item.id ? { ...n, read: true } : n)))}
      activeOpacity={0.7}
    >
      <View style={styles.iconBox}>{getIcon(item.type)}</View>
      <View style={styles.content}>
        <Text style={[styles.cardTitle, { color: isDark ? '#fafafa' : '#030213' }]}>{item.title}</Text>
        <Text style={[styles.message, { color: isDark ? '#a3a3a3' : '#737373' }]}>{item.message}</Text>
        <Text style={[styles.time, { color: isDark ? '#737373' : '#a3a3a3' }]}>{item.time}</Text>
      </View>
      {!item.read && <View style={styles.dot} />}
    </TouchableOpacity>
  );

  return (
    <SafeScreen>
      <View style={[styles.container, { backgroundColor: isDark ? '#0f0f0f' : '#f5f5f5' }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}><ChevronLeft size={24} color={isDark ? '#fafafa' : '#030213'} /></TouchableOpacity>
          <Text style={[styles.title, { color: isDark ? '#fafafa' : '#030213' }]}>Notifications</Text>
          <TouchableOpacity onPress={() => setNotifications(notifications.map((n) => ({ ...n, read: true })))}><CheckCheck size={20} color="#9333ea" /></TouchableOpacity>
        </View>
        {unread.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#a3a3a3' : '#737373' }]}>Unread ({unread.length})</Text>
            <FlatList data={unread} renderItem={renderItem} keyExtractor={(item) => item.id.toString()} scrollEnabled={false} />
          </View>
        )}
        {read.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#a3a3a3' : '#737373' }]}>Read</Text>
            <FlatList data={read} renderItem={renderItem} keyExtractor={(item) => item.id.toString()} scrollEnabled={false} />
          </View>
        )}
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  title: { fontSize: 20, fontWeight: '700' },
  section: { paddingHorizontal: 20, marginBottom: 16 },
  sectionTitle: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  card: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, marginBottom: 8, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
  iconBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#f5f5f5', alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, marginLeft: 12 },
  cardTitle: { fontSize: 14, fontWeight: '600' },
  message: { fontSize: 12, marginTop: 2 },
  time: { fontSize: 11, marginTop: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#9333ea' },
});
