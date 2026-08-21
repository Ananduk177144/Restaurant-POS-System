import { supabase } from "../services/supabase";
import { Alert } from "react-native";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "../theme/colors";
import BackButton from "../components/BackButton";

export default function MenuItemsScreen({ route, navigation }: any) {
  const { categoryId, categoryName } = route.params || {};

  if (!categoryId) {
    return (
      <SafeAreaView style={styles.container}>
        <BackButton navigation={navigation} />

        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "800",
              color: Colors.heading,
              textAlign: "center",
            }}
          >
            Category information is missing
          </Text>

          <Text
            style={{
              marginTop: 8,
              fontSize: 12,
              color: Colors.textSecondary,
              textAlign: "center",
            }}
          >
            Please go back and select a category again.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [menuItems, setMenuItems] = useState<any[]>([]);

  async function addMenuItem() {
    if (!itemName.trim()) {
      Alert.alert("Validation", "Enter Item Name");
      return;
    }

    if (!price.trim()) {
      Alert.alert("Validation", "Enter Price");
      return;
    }

    const { error } = await supabase.from("menu_items").insert({
      category_id: categoryId,
      name: itemName.trim(),
      price: Number(price),
      is_available: true,
    });

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    setItemName("");
    setPrice("");

    fetchMenuItems();

    Alert.alert("Success", "Menu Item Added");
  }

  async function fetchMenuItems() {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("category_id", categoryId)
      .order("id", { ascending: false });

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    setMenuItems(data || []);
  }

  async function deleteMenuItem(id: number) {
    Alert.alert(
      "Delete Item",
      "Are you sure you want to delete this menu item?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase
              .from("menu_items")
              .delete()
              .eq("id", id);

            if (error) {
              Alert.alert("Error", error.message);
              return;
            }

            fetchMenuItems();

            Alert.alert("Success", "Menu Item Deleted");
          },
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

    fetchMenuItems();
  }

  useEffect(() => {
    fetchMenuItems();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* ================= HEADER ================= */}

      <View style={styles.header}>
        <BackButton navigation={navigation} />

        <View style={styles.titleContainer}>
          <Text style={styles.titleIcon}>🍽️</Text>

          <Text style={styles.title} numberOfLines={1}>
            {categoryName}
          </Text>
        </View>
      </View>

      {/* ================= ADD ITEM ================= */}

      <View style={styles.addSection}>
        <Text style={styles.sectionTitle}>Add New Item</Text>

        <TextInput
          placeholder="Item Name"
          placeholderTextColor={Colors.textSecondary}
          value={itemName}
          onChangeText={setItemName}
          style={styles.input}
        />

        <TextInput
          placeholder="Price"
          placeholderTextColor={Colors.textSecondary}
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
          style={styles.input}
        />

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={addMenuItem}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>+ Add Item</Text>
        </TouchableOpacity>
      </View>

      {/* ================= MENU ITEMS ================= */}

      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Menu Items</Text>

            <Text style={styles.itemCount}>
              {menuItems.length} {menuItems.length === 1 ? "item" : "items"}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🍽️</Text>

            <Text style={styles.emptyTitle}>No Items Yet</Text>

            <Text style={styles.emptyText}>
              Add your first item to this category.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            {/* Item information */}

            <View style={styles.itemTopRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={2}>
                  {item.name}
                </Text>

                <Text style={styles.price}>₹ {item.price}</Text>
              </View>

              {/* Availability badge */}

              <View
                style={[
                  styles.statusBadge,
                  item.is_available ? styles.statusOn : styles.statusOff,
                ]}
              >
                <View
                  style={[
                    styles.statusDot,
                    item.is_available
                      ? styles.statusDotOn
                      : styles.statusDotOff,
                  ]}
                />

                <Text
                  style={[
                    styles.statusText,
                    item.is_available
                      ? styles.statusTextOn
                      : styles.statusTextOff,
                  ]}
                >
                  {item.is_available ? "On" : "Off"}
                </Text>
              </View>
            </View>

            {/* Actions */}

            <View style={styles.actionRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => toggleAvailability(item.id, item.is_available)}
                style={[
                  styles.actionButton,
                  item.is_available ? styles.offButton : styles.onButton,
                ]}
              >
                <Text
                  style={[
                    styles.actionButtonText,
                    item.is_available
                      ? styles.offButtonText
                      : styles.onButtonText,
                  ]}
                >
                  {item.is_available ? "Turn Off" : "Turn On"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => deleteMenuItem(item.id)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 15,
  },

  /* ================= HEADER ================= */

  header: {
    height: 58,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },

  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "65%",
  },

  titleIcon: {
    fontSize: 21,
    marginRight: 7,
  },

  title: {
    fontSize: 20,
    fontWeight: "900",
    color: Colors.heading,
  },

  /* ================= ADD SECTION ================= */

  addSection: {
    backgroundColor: Colors.card,
    borderRadius: 17,
    padding: 15,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 15,
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: Colors.heading,
    marginBottom: 10,
  },

  input: {
    height: 46,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 11,
    paddingHorizontal: 13,
    backgroundColor: "#FFFFFF",
    color: Colors.text,
    marginBottom: 9,
  },

  addButton: {
    height: 45,
    borderRadius: 11,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 1,
  },

  addButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

  /* ================= LIST ================= */

  listContent: {
    paddingBottom: 30,
  },

  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  listTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: Colors.heading,
  },

  itemCount: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.textSecondary,
  },

  /* ================= ITEM CARD ================= */

  itemCard: {
    backgroundColor: Colors.card,
    borderRadius: 15,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 2,
  },

  itemTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  itemInfo: {
    flex: 1,
    paddingRight: 10,
  },

  itemName: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.heading,
  },

  price: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.primary,
    marginTop: 5,
  },

  /* ================= STATUS ================= */

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },

  statusOn: {
    backgroundColor: "#DCFCE7",
  },

  statusOff: {
    backgroundColor: "#FEF2F2",
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },

  statusDotOn: {
    backgroundColor: Colors.success,
  },

  statusDotOff: {
    backgroundColor: Colors.danger,
  },

  statusText: {
    fontSize: 10,
    fontWeight: "800",
  },

  statusTextOn: {
    color: Colors.success,
  },

  statusTextOff: {
    color: Colors.danger,
  },

  /* ================= ACTIONS ================= */

  actionRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },

  actionButton: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },

  offButton: {
    backgroundColor: "#FFF7ED",
    borderColor: "#FED7AA",
  },

  onButton: {
    backgroundColor: "#F0FDF4",
    borderColor: "#BBF7D0",
  },

  actionButtonText: {
    fontSize: 12,
    fontWeight: "800",
  },

  offButtonText: {
    color: "#C2410C",
  },

  onButtonText: {
    color: "#15803D",
  },

  deleteButton: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
  },

  deleteButtonText: {
    color: Colors.danger,
    fontSize: 12,
    fontWeight: "800",
  },

  /* ================= EMPTY ================= */

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 45,
  },

  emptyIcon: {
    fontSize: 42,
    marginBottom: 10,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: Colors.heading,
  },

  emptyText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    textAlign: "center",
  },
});
