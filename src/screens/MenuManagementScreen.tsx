import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
} from "react-native";

import { supabase } from "../services/supabase";
import { Colors } from "../theme/colors";
import BackButton from "../components/BackButton";

export default function MenuManagementScreen({ navigation }: any) {
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState<any[]>([]);

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

    const { error } = await supabase.from("categories").insert({
      name: categoryName.trim(),
    });

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    setCategoryName("");
    fetchCategories();

    Alert.alert("Success", "Category Added");
  }

  async function deleteCategory(id: number) {
    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    fetchCategories();

    Alert.alert("Success", "Category Deleted");
  }

  return (
    <View style={styles.container}>
      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <View style={styles.header}>
        <BackButton navigation={navigation} />

        <Text style={styles.headerTitle}>Category Management</Text>
      </View>

      {/* ========================= */}
      {/* CONTENT */}
      {/* ========================= */}

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {/* Add Category Section */}
            <View style={styles.addCard}>
              <Text style={styles.sectionTitle}>Add New Category</Text>

              <Text style={styles.sectionSubtitle}>
                Create a category for your restaurant menu.
              </Text>

              <TextInput
                placeholder="Enter Category Name"
                placeholderTextColor={Colors.textLight}
                value={categoryName}
                onChangeText={setCategoryName}
                style={styles.input}
              />

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={addCategory}
                style={styles.addButton}
              >
                <Text style={styles.addButtonIcon}>＋</Text>

                <Text style={styles.addButtonText}>Add Category</Text>
              </TouchableOpacity>
            </View>

            {/* Existing Categories */}
            <View style={styles.listHeader}>
              <View>
                <Text style={styles.sectionTitle}>Existing Categories</Text>

                <Text style={styles.sectionSubtitle}>
                  Manage your restaurant menu categories.
                </Text>
              </View>

              <View style={styles.countBadge}>
                <Text style={styles.countText}>{categories.length}</Text>
              </View>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.categoryCard}>
            <View style={styles.categoryIcon}>
              <Text style={styles.categoryIconText}>🍽️</Text>
            </View>

            <View style={styles.categoryContent}>
              <Text style={styles.categoryName}>{item.name}</Text>

              <Text style={styles.categorySubtitle}>Menu category</Text>
            </View>

            <View style={styles.categoryActions}>
              {/* Manage Items */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate("MenuItems", {
                    categoryId: item.id,
                    categoryName: item.name,
                  })
                }
                style={styles.manageButton}
              >
                <Text style={styles.manageButtonText}>Manage</Text>
              </TouchableOpacity>

              {/* Delete */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => deleteCategory(item.id)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📂</Text>

            <Text style={styles.emptyTitle}>No Categories Yet</Text>

            <Text style={styles.emptyText}>
              Add your first menu category above.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
  },

  /* ========================= */
  /* HEADER */
  /* ========================= */

  header: {
    height: 70,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
  },

  headerTitle: {
    fontSize: 21,
    fontWeight: "900",
    color: Colors.heading,
  },

  /* ========================= */
  /* LIST */
  /* ========================= */

  listContent: {
    paddingBottom: 35,
  },

  /* ========================= */
  /* ADD CATEGORY */
  /* ========================= */

  addCard: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: Colors.heading,
  },

  sectionSubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 3,
    marginBottom: 13,
  },

  input: {
    height: 46,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 11,
    paddingHorizontal: 13,
    backgroundColor: "#F9FAFB",
    color: Colors.text,
    fontSize: 14,
    marginBottom: 10,
  },

  addButton: {
    height: 45,
    borderRadius: 11,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  addButtonIcon: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    marginRight: 5,
  },

  addButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

  /* ========================= */
  /* LIST HEADER */
  /* ========================= */

  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  countBadge: {
    minWidth: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },

  countText: {
    color: Colors.billing,
    fontSize: 12,
    fontWeight: "900",
  },

  /* ========================= */
  /* CATEGORY CARD */
  /* ========================= */

  categoryCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 12,
    marginBottom: 9,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },

  categoryIcon: {
    width: 45,
    height: 45,
    borderRadius: 13,
    backgroundColor: "#F0FDF4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  categoryIconText: {
    fontSize: 22,
  },

  categoryContent: {
    flex: 1,
  },

  categoryName: {
    fontSize: 15,
    fontWeight: "800",
    color: Colors.heading,
  },

  categorySubtitle: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 3,
  },

  categoryActions: {
    alignItems: "flex-end",
  },

  manageButton: {
    minWidth: 72,
    height: 32,
    borderRadius: 9,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },

  manageButtonText: {
    color: Colors.billing,
    fontSize: 11,
    fontWeight: "800",
  },

  deleteButton: {
    minWidth: 72,
    height: 30,
    borderRadius: 9,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    justifyContent: "center",
    alignItems: "center",
  },

  deleteButtonText: {
    color: Colors.logout,
    fontSize: 11,
    fontWeight: "800",
  },

  /* ========================= */
  /* EMPTY */
  /* ========================= */

  emptyContainer: {
    alignItems: "center",
    paddingTop: 45,
    paddingHorizontal: 20,
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
