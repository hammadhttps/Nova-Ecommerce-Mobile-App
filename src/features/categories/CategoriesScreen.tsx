import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeScreen } from '@/components/layout/SafeScreen';
import { useTheme } from '@/hooks/useTheme';
import { categories } from '@/services/mocks/products';
import { ChevronDown, ChevronUp } from 'lucide-react-native';

export default function CategoriesScreen({ navigation }: any) {
  const { isDark } = useTheme();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const renderCategory = ({ item }: { item: typeof categories[0] }) => {
    const isExpanded = expandedId === item.id;

    return (
      <View style={[styles.card, { backgroundColor: isDark ? '#1a1a1a' : '#ffffff' }]}>
        <TouchableOpacity
          style={styles.cardHeader}
          onPress={() => toggleExpand(item.id)}
          activeOpacity={0.7}
        >
          <View style={styles.left}>
            <Text style={styles.icon}>{item.icon}</Text>
            <Text style={[styles.name, { color: isDark ? '#fafafa' : '#030213' }]}>{item.name}</Text>
          </View>
          {isExpanded ? (
            <ChevronUp size={20} color={isDark ? '#fafafa' : '#030213'} />
          ) : (
            <ChevronDown size={20} color={isDark ? '#fafafa' : '#030213'} />
          )}
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.subs}>
            {item.subcategories.map((sub, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.subItem, { borderBottomColor: isDark ? '#262626' : '#ececf0' }]}
                onPress={() => navigation.navigate('Search')}
                activeOpacity={0.7}
              >
                <Text style={[styles.subText, { color: isDark ? '#a3a3a3' : '#737373' }]}>{sub}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeScreen>
      <View style={[styles.container, { backgroundColor: isDark ? '#0f0f0f' : '#f5f5f5' }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: isDark ? '#fafafa' : '#030213' }]}>Categories</Text>
        </View>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
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
  list: { paddingHorizontal: 20, paddingBottom: 20 },
  card: { borderRadius: 12, marginBottom: 12, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  left: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  icon: { fontSize: 24, marginRight: 12 },
  name: { fontSize: 16, fontWeight: '600', flex: 1 },
  subs: { paddingHorizontal: 16, paddingBottom: 12 },
  subItem: { paddingVertical: 10, borderBottomWidth: 1 },
  subText: { fontSize: 14, paddingLeft: 36 },
});
