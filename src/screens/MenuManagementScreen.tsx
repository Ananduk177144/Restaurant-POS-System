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

export default function MenuManagementScreen({ navigation }: any) {
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    setCategories(data || []);
  }

  async function addCategory() {
    if (!categoryName.trim()) {
      Alert.alert("Validation", "Enter category name");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("categories").insert({
      name: categoryName.trim(),
    });

    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    setCategoryName("");

    await fetchCategories();

    Alert.alert("Success", "Category Added");
  }

  function confirmDeleteCategory(id: number, name: string) {
    Alert.alert(
      "Delete Category",
      `Are you sure you want to delete "${name}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteCategory(id),
        },
      ],
    );
  }

  async function deleteCategory(id: number) {
    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    await fetchCategories();

    Alert.alert("Success", "Category Deleted");
  }

  function getCategoryIcon(name: string) {
    const icons: { [key: string]: string } = {
      Beverages: "🥤",
      Drinks: "🥤",
      Breakfast: "🍳",
      Lunch: "🍱",
      Dinner: "🍽️",
      Meals: "🍛",
      Curry: "🍛",
      Snacks: "🍕",
      Pizza: "🍕",
      Burger: "🍔",
      Coffee: "☕",
      Tea: "🫖",
      Dessert: "🍰",
      IceCream: "🍨",
      Chicken: "🍗",
      Beef: "🥩",
      Fish: "🐟",
      Veg: "🥗",
      Biryani: "🍗",
      Biriyani: "🍗",
      FriedRice: "🍚",
      Chinese: "🥢",
      Sandwich: "🥪",
      Mutton: "🍖",
    };

    return icons[name] || "🍽️";
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* ========================= */}
        {/* HEADER */}
        {/* ========================= */}

        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Menu Management</Text>

            <Text style={styles.subtitle}>
              Manage your restaurant categories
            </Text>
          </View>

          <View style={styles.categoryCount}>
            <Text style={styles.categoryCountNumber}>{categories.length}</Text>

            <Text style={styles.categoryCountLabel}>Categories</Text>
          </View>
        </View>

        {/* ========================= */}
        {/* ADD CATEGORY CARD */}
        {/* ========================= */}

        <View style={styles.addCard}>
          <View style={styles.addHeader}>
            <View style={styles.addIcon}>
              <Text style={styles.addIconText}>＋</Text>
            </View>

            <View>
              <Text style={styles.addTitle}>Add New Category</Text>

              <Text style={styles.addSubtitle}>
                Create a category for your menu
              </Text>
            </View>
          </View>

          <TextInput
            placeholder="e.g. Biriyani, Beverages, Snacks"
            placeholderTextColor={Colors.textLight}
            value={categoryName}
            onChangeText={setCategoryName}
            style={styles.input}
          />

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={addCategory}
            disabled={loading}
            style={[styles.addButton, loading && styles.disabledButton]}
          >
            <Text style={styles.addButtonText}>
              {loading ? "Adding..." : "＋ Add Category"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ========================= */}
        {/* CATEGORY LIST HEADER */}
        {/* ========================= */}

        <View style={styles.listHeader}>
          <View>
            <Text style={styles.listTitle}>Your Categories</Text>

            <Text style={styles.listSubtitle}>
              Select a category to manage its items
            </Text>
          </View>
        </View>

        {/* ========================= */}
        {/* CATEGORY LIST */}
        {/* ========================= */}

        <FlatList
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🍽️</Text>

              <Text style={styles.emptyTitle}>No Categories Yet</Text>

              <Text style={styles.emptyText}>
                Add your first menu category above.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.categoryCard}>
              {/* Category information */}
              <View style={styles.categoryInfo}>
                <View style={styles.categoryIcon}>
                  <Text style={styles.categoryEmoji}>
                    {getCategoryIcon(item.name)}
                  </Text>
                </View>

                <View style={styles.categoryTextContainer}>
                  <Text numberOfLines={1} style={styles.categoryName}>
                    {item.name}
                  </Text>

                  <Text style={styles.categoryDescription}>
                    Manage items in this category
                  </Text>
                </View>
              </View>

              {/* Manage button */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() =>
                  navigation.navigate("MenuItems", {
                    categoryId: item.id,
                    categoryName: item.name,
                  })
                }
                style={styles.manageButton}
              >
                <Text style={styles.manageButtonText}>Manage Items</Text>

                <Text style={styles.manageArrow}>→</Text>
              </TouchableOpacity>

              {/* Delete button */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => confirmDeleteCategory(item.id, item.name)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteIcon}>🗑</Text>
              </TouchableOpacity>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 16,
  },

  title: {
    fontSize: 26,
    fontWeight: "900",
    color: Colors.heading,
  },

  subtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 3,
  },

  categoryCount: {
    minWidth: 65,
    paddingVertical: 7,
    paddingHorizontal: 9,
    borderRadius: 13,
    backgroundColor: "#FFF3E6",
    alignItems: "center",
  },

  categoryCountNumber: {
    fontSize: 18,
    fontWeight: "900",
    color: Colors.primary,
  },

  categoryCountLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: Colors.textSecondary,
    marginTop: 1,
  },

  /* ========================= */
  /* ADD CARD */
  /* ========================= */

  addCard: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 3,
    marginBottom: 18,
  },

  addHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  addIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: "#FFF3E6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  addIconText: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.primary,
  },

  addTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: Colors.heading,
  },

  addSubtitle: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  input: {
    height: 46,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 11,
    paddingHorizontal: 13,
    color: Colors.heading,
    backgroundColor: Colors.surface,
    fontSize: 13,
  },

  addButton: {
    height: 45,
    borderRadius: 11,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 9,
  },

  disabledButton: {
    opacity: 0.6,
  },

  addButtonText: {
    color: Colors.buttonText,
    fontSize: 14,
    fontWeight: "800",
  },

  /* ========================= */
  /* LIST HEADER */
  /* ========================= */

  listHeader: {
    marginBottom: 9,
  },

  listTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: Colors.heading,
  },

  listSubtitle: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  listContent: {
    paddingBottom: 30,
  },

  /* ========================= */
  /* CATEGORY CARD */
  /* ========================= */

  categoryCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 11,
    marginBottom: 9,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 2,
  },

  categoryInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingRight: 30,
  },

  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 11,
  },

  categoryEmoji: {
    fontSize: 24,
  },

  categoryTextContainer: {
    flex: 1,
  },

  categoryName: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.heading,
  },

  categoryDescription: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 3,
  },

  /* ========================= */
  /* MANAGE */
  /* ========================= */

  manageButton: {
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.billing,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  manageButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },

  manageArrow: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
    marginLeft: 7,
  },

  /* ========================= */
  /* DELETE */
  /* ========================= */

  deleteButton: {
    position: "absolute",
    top: 11,
    right: 11,
    width: 31,
    height: 31,
    borderRadius: 9,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
  },

  deleteIcon: {
    fontSize: 14,
  },

  /* ========================= */
  /* EMPTY */
  /* ========================= */

  emptyContainer: {
    alignItems: "center",
    paddingTop: 45,
    paddingHorizontal: 30,
  },

  emptyEmoji: {
    fontSize: 50,
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
