import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Alert,
  Switch,
} from "react-native";
import { SafeScreen } from "@/components/layout/SafeScreen";
import { useTheme } from "@/hooks/useTheme";
import { useAuthStore } from "@/store/auth.store";
import { addressService } from "@/services/address.service";
import { Badge } from "@/components/common";
import {
  MapPin,
  Trash2,
  ChevronLeft,
  Edit2,
  Plus,
  X,
  Check,
} from "lucide-react-native";
import { Address } from "@/types";

const emptyForm = {
  name: "",
  street: "",
  city: "",
  zip: "",
  phone: "",
  isDefault: false,
};

export default function AddressManagementScreen({ navigation }: any) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { user } = useAuthStore();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchAddresses = useCallback(async () => {
    if (!user?.id) return;
    try {
      const data = await addressService.getAddresses(user.id);
      setAddresses(data);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAddresses();
  };

  const resetForm = () => {
    setForm(emptyForm);
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.street.trim() || !form.city.trim()) {
      Alert.alert("Error", "Name, street, and city are required");
      return;
    }
    if (!user?.id) return;
    setSaving(true);
    try {
      if (editingId) {
        await addressService.updateAddress(user.id, editingId, form);
      } else {
        await addressService.addAddress(user.id, form);
      }
      resetForm();
      await fetchAddresses();
    } catch {
      Alert.alert("Error", "Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (item: Address) => {
    Alert.alert(
      "Delete Address",
      `Remove "${item.name}" from your addresses?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            if (!user?.id) return;
            try {
              await addressService.deleteAddress(user.id, item.id);
              if (editingId === item.id) resetForm();
              fetchAddresses();
            } catch {
              Alert.alert("Error", "Failed to delete address");
            }
          },
        },
      ],
    );
  };

  const handleEdit = (item: Address) => {
    setForm({
      name: item.name,
      street: item.street,
      city: item.city,
      zip: item.zip || "",
      phone: item.phone,
      isDefault: item.isDefault,
    });
    setEditingId(item.id);
    setIsAdding(true);
  };

  const renderForm = () => (
    <View
      style={[
        styles.formCard,
        { backgroundColor: isDark ? "#1a1a1a" : "#ffffff" },
      ]}
    >
      <View style={styles.formHeader}>
        <Text
          style={[styles.formTitle, { color: isDark ? "#fafafa" : "#030213" }]}
        >
          {editingId ? "Edit Address" : "New Address"}
        </Text>
        <TouchableOpacity onPress={resetForm}>
          <X size={20} color={isDark ? "#fafafa" : "#030213"} />
        </TouchableOpacity>
      </View>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: isDark ? "#262626" : "#f5f5f5",
            color: isDark ? "#fafafa" : "#030213",
          },
        ]}
        placeholder="Label (e.g. Home, Work)"
        placeholderTextColor={isDark ? "#737373" : "#a3a3a3"}
        value={form.name}
        onChangeText={(t) => setForm((f) => ({ ...f, name: t }))}
      />
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: isDark ? "#262626" : "#f5f5f5",
            color: isDark ? "#fafafa" : "#030213",
          },
        ]}
        placeholder="Street address"
        placeholderTextColor={isDark ? "#737373" : "#a3a3a3"}
        value={form.street}
        onChangeText={(t) => setForm((f) => ({ ...f, street: t }))}
      />
      <View style={styles.formRow}>
        <TextInput
          style={[
            styles.input,
            styles.inputHalf,
            {
              backgroundColor: isDark ? "#262626" : "#f5f5f5",
              color: isDark ? "#fafafa" : "#030213",
            },
          ]}
          placeholder="City"
          placeholderTextColor={isDark ? "#737373" : "#a3a3a3"}
          value={form.city}
          onChangeText={(t) => setForm((f) => ({ ...f, city: t }))}
        />
        <TextInput
          style={[
            styles.input,
            styles.inputHalf,
            {
              backgroundColor: isDark ? "#262626" : "#f5f5f5",
              color: isDark ? "#fafafa" : "#030213",
            },
          ]}
          placeholder="ZIP"
          placeholderTextColor={isDark ? "#737373" : "#a3a3a3"}
          value={form.zip}
          onChangeText={(t) => setForm((f) => ({ ...f, zip: t }))}
        />
      </View>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: isDark ? "#262626" : "#f5f5f5",
            color: isDark ? "#fafafa" : "#030213",
          },
        ]}
        placeholder="Phone number"
        placeholderTextColor={isDark ? "#737373" : "#a3a3a3"}
        keyboardType="phone-pad"
        value={form.phone}
        onChangeText={(t) => setForm((f) => ({ ...f, phone: t }))}
      />
      <View style={styles.switchRow}>
        <Text
          style={[
            styles.switchLabel,
            { color: isDark ? "#fafafa" : "#030213" },
          ]}
        >
          Set as default
        </Text>
        <Switch
          value={form.isDefault}
          onValueChange={(v) => setForm((f) => ({ ...f, isDefault: v }))}
          trackColor={{
            false: isDark ? "#404040" : "#e5e5e5",
            true: "#9333ea",
          }}
          thumbColor={form.isDefault ? "#ffffff" : "#f4f3f4"}
        />
      </View>
      <View style={styles.formActions}>
        <TouchableOpacity
          onPress={resetForm}
          disabled={saving}
          style={[
            styles.formBtn,
            styles.cancelBtn,
            { borderColor: isDark ? "#404040" : "#e5e5e5" },
          ]}
        >
          <Text
            style={{ color: isDark ? "#fafafa" : "#030213", fontWeight: "500" }}
          >
            Cancel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          style={[styles.formBtn, styles.saveBtn]}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={{ color: "#ffffff", fontWeight: "500" }}>
              {editingId ? "Update" : "Save"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderItem = useCallback(
    ({ item }: { item: Address }) => (
      <View
        style={[
          styles.card,
          { backgroundColor: isDark ? "#1a1a1a" : "#ffffff" },
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardLeft}>
            <MapPin size={20} color="#9333ea" />
            <Text
              style={[styles.name, { color: isDark ? "#fafafa" : "#030213" }]}
            >
              {item.name}
            </Text>
          </View>
          {item.isDefault && <Badge label="Default" variant="info" size="sm" />}
        </View>
        <Text style={[styles.addr, { color: isDark ? "#a3a3a3" : "#737373" }]}>
          {item.street}
        </Text>
        <Text style={[styles.addr, { color: isDark ? "#a3a3a3" : "#737373" }]}>
          {item.city}
          {item.zip ? `, ${item.zip}` : ""}
        </Text>
        <Text style={[styles.phone, { color: isDark ? "#a3a3a3" : "#737373" }]}>
          {item.phone}
        </Text>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => handleEdit(item)}
          >
            <Edit2 size={16} color="#3b82f6" />
            <Text style={{ color: "#3b82f6", fontSize: 14, fontWeight: "500" }}>
              Edit
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => handleDelete(item)}
          >
            <Trash2 size={16} color="#ef4444" />
            <Text style={{ color: "#ef4444", fontSize: 14, fontWeight: "500" }}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    ),
    [isDark],
  );

  if (loading) {
    return (
      <SafeScreen>
        <View style={[styles.container, styles.center]}>
          <ActivityIndicator size="large" color="#9333ea" />
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen>
      <View
        style={[
          styles.container,
          { backgroundColor: isDark ? "#0f0f0f" : "#f5f5f5" },
        ]}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color={isDark ? "#fafafa" : "#030213"} />
          </TouchableOpacity>
          <Text
            style={[styles.title, { color: isDark ? "#fafafa" : "#030213" }]}
          >
            Addresses
          </Text>
          <View style={{ width: 24 }} />
        </View>
        {isAdding && <View style={styles.list}>{renderForm()}</View>}
        <FlatList
          data={addresses}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          windowSize={5}
          maxToRenderPerBatch={10}
          removeClippedSubviews
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MapPin size={40} color={isDark ? "#404040" : "#d4d4d4"} />
              <Text
                style={[
                  styles.emptyTitle,
                  { color: isDark ? "#fafafa" : "#030213" },
                ]}
              >
                No Addresses Yet
              </Text>
              <Text
                style={[
                  styles.emptySub,
                  { color: isDark ? "#737373" : "#a3a3a3" },
                ]}
              >
                Add a shipping address to get started
              </Text>
            </View>
          }
        />
        {!isAdding && (
          <View style={styles.footer}>
            <TouchableOpacity
              onPress={() => {
                resetForm();
                setIsAdding(true);
              }}
              style={styles.addBtn}
            >
              <Plus size={20} color="#ffffff" />
              <Text style={styles.addBtnText}>Add New Address</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: { fontSize: 20, fontWeight: "700" },
  list: { paddingHorizontal: 20, paddingBottom: 20 },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  name: { fontSize: 16, fontWeight: "600" },
  addr: { fontSize: 14, marginBottom: 2 },
  phone: { fontSize: 14, marginTop: 4 },
  actions: { flexDirection: "row", gap: 16, marginTop: 12 },
  actionBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  footer: { padding: 20 },
  emptyState: { alignItems: "center", paddingTop: 60 },
  emptyTitle: { fontSize: 18, fontWeight: "700", marginTop: 16 },
  emptySub: { fontSize: 14, marginTop: 4 },
  formCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  formHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  formTitle: { fontSize: 16, fontWeight: "700" },
  input: {
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 10,
  },
  formRow: { flexDirection: "row", gap: 10 },
  inputHalf: { flex: 1 },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  switchLabel: { fontSize: 15 },
  formActions: { flexDirection: "row", gap: 12 },
  formBtn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtn: { borderWidth: 1 },
  saveBtn: { backgroundColor: "#9333ea" },
  addBtn: {
    backgroundColor: "#9333ea",
    borderRadius: 10,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  addBtnText: { color: "#ffffff", fontSize: 16, fontWeight: "600" },
});
