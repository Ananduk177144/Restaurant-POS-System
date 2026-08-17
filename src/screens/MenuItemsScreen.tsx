import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { supabase } from "../services/supabase";
import { Colors } from "../theme/colors";

export default function MenuItemsScreen({ route }: any) {
  const { categoryId, categoryName } = route.params;

  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchMenuItems() {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("category_id", categoryId)
      .order("id", { ascending: true });

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    setMenuItems(data || []);
  }

  useEffect(() => {
    fetchMenuItems();
  }, []);

  async function addMenuItem() {
    if (!itemName.trim()) {
      Alert.alert("Validation", "Enter Item Name");
      return;
    }

    if (!price.trim()) {
      Alert.alert("Validation", "Enter Price");
      return;
    }

    const numericPrice = Number(price);

    if (isNaN(numericPrice) || numericPrice <= 0) {
      Alert.alert("Validation", "Enter a valid price");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("menu_items").insert({
      category_id: categoryId,
      name: itemName.trim(),
      price: numericPrice,
      is_available: true,
    });

    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    setItemName("");
    setPrice("");

    await fetchMenuItems();

    Alert.alert("Success", "Menu Item Added");
  }

  async function deleteMenuItem(id: number) {
    const { error } = await supabase.from("menu_items").delete().eq("id", id);

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    await fetchMenuItems();

    Alert.alert("Success", "Menu Item Deleted");
  }

  function confirmDeleteItem(id: number, name: string) {
    Alert.alert(
      "Delete Menu Item",
      `Are you sure you want to delete "${name}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteMenuItem(id),
        },
      ],
    );
  }

  async function toggleAvailability(id: number, currentStatus: boolean) {
    const { error } = await supabase
      .from("menu_items")
      .update({
        is_available: !currentStatus,
      })
      .eq("id", id);

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    await fetchMenuItems();
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* ========================= */}
        {/* HEADER */}
        {/* ========================= */}

        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Text style={styles.headerEmoji}>🍽️</Text>
          </View>

          <View style={styles.headerText}>
            <Text numberOfLines={1} style={styles.title}>
              {categoryName}
            </Text>

            <Text style={styles.subtitle}>Manage menu items</Text>
          </View>

          <View style={styles.itemCount}>
            <Text style={styles.itemCountNumber}>{menuItems.length}</Text>

            <Text style={styles.itemCountLabel}>Items</Text>
          </View>
        </View>

        {/* ========================= */}
        {/* ADD ITEM CARD */}
        {/* ========================= */}

        <View style={styles.addCard}>
          <Text style={styles.addTitle}>Add Menu Item</Text>

          <Text style={styles.addSubtitle}>
            Add a new item to {categoryName}
          </Text>

          <TextInput
            placeholder="Item Name"
            placeholderTextColor={Colors.textLight}
            value={itemName}
            onChangeText={setItemName}
            style={styles.input}
          />

          <TextInput
            placeholder="Price"
            placeholderTextColor={Colors.textLight}
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
            style={styles.input}
          />

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={addMenuItem}
            disabled={loading}
            style={[styles.addButton, loading && styles.disabledButton]}
          >
            <Text style={styles.addButtonText}>
              {loading ? "Adding..." : "＋ Add Menu Item"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ========================= */}
        {/* ITEMS HEADER */}
        {/* ========================= */}

        <View style={styles.itemsHeader}>
          <View>
            <Text style={styles.itemsTitle}>Menu Items</Text>

            <Text style={styles.itemsSubtitle}>
              Manage availability and items
            </Text>
          </View>
        </View>

        {/* ========================= */}
        {/* MENU ITEMS */}
        {/* ========================= */}

        <FlatList
          data={menuItems}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🍴</Text>

              <Text style={styles.emptyTitle}>No Menu Items</Text>

              <Text style={styles.emptyText}>
                Add your first item using the form above.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View
              style={[
                styles.itemCard,
                !item.is_available && styles.unavailableCard,
              ]}
            >
              {/* Item information */}

              <View style={styles.itemTop}>
                <View style={styles.foodIcon}>
                  <Text style={styles.foodEmoji}>🍴</Text>
                </View>

                <View style={styles.itemInfo}>
                  <Text numberOfLines={2} style={styles.itemName}>
                    {item.name}
                  </Text>

                  <Text style={styles.itemPrice}>₹ {item.price}</Text>
                </View>

                {/* Availability badge */}

                <View
                  style={[
                    styles.statusBadge,
                    item.is_available
                      ? styles.availableBadge
                      : styles.unavailableBadge,
                  ]}
                >
                  <View
                    style={[
                      styles.statusDot,
                      item.is_available
                        ? styles.availableDot
                        : styles.unavailableDot,
                    ]}
                  />

                  <Text
                    style={[
                      styles.statusText,
                      item.is_available
                        ? styles.availableText
                        : styles.unavailableText,
                    ]}
                  >
                    {item.is_available ? "Available" : "Unavailable"}
                  </Text>
                </View>
              </View>

              {/* Actions */}

              <View style={styles.actionsRow}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => toggleAvailability(item.id, item.is_available)}
                  style={[
                    styles.availabilityButton,
                    item.is_available
                      ? styles.markUnavailableButton
                      : styles.markAvailableButton,
                  ]}
                >
                  <Text
                    style={[
                      styles.availabilityText,
                      item.is_available
                        ? styles.markUnavailableText
                        : styles.markAvailableText,
                    ]}
                  >
                    {item.is_available ? "Disable" : "Enable"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => confirmDeleteItem(item.id, item.name)}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteIcon}>🗑</Text>

                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  container: {
    flex: 1,
    paddingHorizontal: 16,
  },

  /* ========================= */
  /* HEADER */
  /* ========================= */

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 14,
  },

  headerIcon: {
    width: 47,
    height: 47,
    borderRadius: 14,
    backgroundColor: "#FFF3E6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  headerEmoji: {
    fontSize: 24,
  },

  headerText: {
    flex: 1,
  },

  title: {
    fontSize: 22,
    fontWeight: "900",
    color: Colors.heading,
  },

  subtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  itemCount: {
    minWidth: 55,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
  },

  itemCountNumber: {
    fontSize: 17,
    fontWeight: "900",
    color: Colors.billing,
  },

  itemCountLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: Colors.textSecondary,
  },

  /* ========================= */
  /* ADD CARD */
  /* ========================= */

  addCard: {
    backgroundColor: Colors.card,
    borderRadius: 17,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 3,
    marginBottom: 17,
  },

  addTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: Colors.heading,
  },

  addSubtitle: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
    marginBottom: 11,
  },

  input: {
    height: 44,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    color: Colors.heading,
    backgroundColor: Colors.surface,
    fontSize: 13,
    marginBottom: 8,
  },

  addButton: {
    height: 44,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  disabledButton: {
    opacity: 0.6,
  },

  addButtonText: {
    color: Colors.buttonText,
    fontWeight: "800",
    fontSize: 13,
  },

  /* ========================= */
  /* ITEMS HEADER */
  /* ========================= */

  itemsHeader: {
    marginBottom: 8,
  },

  itemsTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: Colors.heading,
  },

  itemsSubtitle: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  listContent: {
    paddingBottom: 30,
  },

  /* ========================= */
  /* ITEM CARD */
  /* ========================= */

  itemCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 2,
  },

  unavailableCard: {
    opacity: 0.72,
  },

  itemTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  foodIcon: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  foodEmoji: {
    fontSize: 23,
  },

  itemInfo: {
    flex: 1,
    paddingRight: 6,
  },

  itemName: {
    fontSize: 15,
    fontWeight: "800",
    color: Colors.heading,
  },

  itemPrice: {
    fontSize: 16,
    fontWeight: "900",
    color: Colors.success,
    marginTop: 4,
  },

  /* ========================= */
  /* STATUS */
  /* ========================= */

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },

  availableBadge: {
    backgroundColor: "#DCFCE7",
  },

  unavailableBadge: {
    backgroundColor: "#FEE2E2",
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },

  availableDot: {
    backgroundColor: Colors.success,
  },

  unavailableDot: {
    backgroundColor: Colors.danger,
  },

  statusText: {
    fontSize: 9,
    fontWeight: "800",
  },

  availableText: {
    color: Colors.success,
  },

  unavailableText: {
    color: Colors.danger,
  },

  /* ========================= */
  /* ACTIONS */
  /* ========================= */

  actionsRow: {
    flexDirection: "row",
    marginTop: 12,
  },

  availabilityButton: {
    flex: 1,
    height: 39,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 7,
  },

  markUnavailableButton: {
    backgroundColor: "#FFF7ED",
    borderWidth: 1,
    borderColor: "#FED7AA",
  },

  markAvailableButton: {
    backgroundColor: "#DCFCE7",
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },

  availabilityText: {
    fontSize: 11,
    fontWeight: "800",
  },

  markUnavailableText: {
    color: "#C2410C",
  },

  markAvailableText: {
    color: Colors.success,
  },

  deleteButton: {
    flex: 0.8,
    height: 39,
    borderRadius: 9,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  deleteIcon: {
    fontSize: 12,
    marginRight: 4,
  },

  deleteText: {
    fontSize: 11,
    fontWeight: "800",
    color: Colors.danger,
  },

  /* ========================= */
  /* EMPTY */
  /* ========================= */

  emptyContainer: {
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 30,
  },

  emptyEmoji: {
    fontSize: 48,
    marginBottom: 10,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: Colors.heading,
  },

  emptyText: {
    textAlign: "center",
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 5,
  },
});
