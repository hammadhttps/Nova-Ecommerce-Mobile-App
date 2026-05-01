import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { SafeScreen } from '@/components/layout/SafeScreen';
import { useTheme } from '@/hooks/useTheme';
import { Input } from '@/components/common/Input';
import { ProductCard } from '@/components/ProductCard';
import { Clock, TrendingUp, Search } from 'lucide-react-native';
import { allProducts } from '@/services/mocks/products';

const recentSearches = ['Wireless Earbuds', 'Running Shoes', 'Smart Watch', 'Sunglasses'];
const trendingSearches = ['Bluetooth Speaker', 'Laptop Stand', 'Phone Case', 'Desk Lamp', 'Yoga Mat'];

export default function SearchScreen({ navigation }: any) {
  const { isDark } = useTheme();
  const [query, setQuery] = useState('');
  const results = allProducts.filter(
    (p) => query && p.name.toLowerCase().includes(query.toLowerCase())
  );
  const showResults = query.length > 0;

  return (
    <SafeScreen>
      <View style={[styles.container, { backgroundColor: isDark ? '#0f0f0f' : '#f5f5f5' }]}>
        <View style={styles.header}>
          <Input placeholder="Search products..." value={query} onChangeText={setQuery} containerStyle={{ flex: 1, marginBottom: 0 }} />
          <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        {showResults ? (
          results.length > 0 ? (
            <ScrollView contentContainerStyle={styles.resultsList} showsVerticalScrollIndicator={false}>
              <View style={styles.grid}>
                {results.map((item) => (
                  <ProductCard key={item.id} product={item} onPress={() => navigation.navigate('ProductDetail', { id: item.id })} />
                ))}
              </View>
            </ScrollView>
          ) : (
            <View style={styles.empty}>
              <Search size={48} color={isDark ? '#525252' : '#d4d4d4'} />
              <Text style={[styles.emptyText, { color: isDark ? '#a3a3a3' : '#737373' }]}>No results found</Text>
            </View>
          )
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Clock size={18} color={isDark ? '#a3a3a3' : '#737373'} />
                <Text style={[styles.sectionTitle, { color: isDark ? '#fafafa' : '#030213' }]}>Recent</Text>
              </View>
              <View style={styles.chips}>
                {recentSearches.map((s, i) => (
                  <TouchableOpacity key={i} style={[styles.chip, { backgroundColor: isDark ? '#1a1a1a' : '#ffffff' }]} onPress={() => setQuery(s)}>
                    <Text style={[styles.chipText, { color: isDark ? '#fafafa' : '#030213' }]}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <TrendingUp size={18} color={isDark ? '#a3a3a3' : '#737373'} />
                <Text style={[styles.sectionTitle, { color: isDark ? '#fafafa' : '#030213' }]}>Trending</Text>
              </View>
              {trendingSearches.map((s, i) => (
                <TouchableOpacity key={i} style={styles.trendingItem} onPress={() => setQuery(s)}>
                  <Text style={[styles.trendingNum, { color: isDark ? '#a3a3a3' : '#737373' }]}>{i + 1}</Text>
                  <Text style={[styles.trendingText, { color: isDark ? '#fafafa' : '#030213' }]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  cancelBtn: { padding: 8 },
  cancelText: { color: '#9333ea', fontSize: 16, fontWeight: '500' },
  section: { paddingHorizontal: 16, marginTop: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '600' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  chipText: { fontSize: 14 },
  trendingItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  trendingNum: { fontSize: 16, fontWeight: '700', width: 30 },
  trendingText: { fontSize: 16 },
  resultsList: { padding: 16 },
  grid: { gap: 12 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyText: { fontSize: 16, marginTop: 12 },
});
