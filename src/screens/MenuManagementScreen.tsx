import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";

import { supabase } from "../services/supabase";
import { Colors } from "../theme/colors";

export default function MenuManagementScreen({ navigation }: any) {
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState<any[]>([]);

  // ==========================================
  // FETCH CATEGORIES
  // ==========================================

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

  // ==========================================
  // ADD CATEGORY
  // ==========================================

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

  // ==========================================
  // DELETE CATEGORY
  // ==========================================

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

    fetchCategories();

    Alert.alert("Success", "Category Deleted");
  }

  // ==========================================
  // CATEGORY ICON
  // ==========================================

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
      Mutton: "🍖",
      Veg: "🥗",
      Sandwich: "🥪",
      Biriyani: "🍗",
      Biryani: "🍗",
      FriedRice: "🍚",
      Chinese: "🥢",
    };

    return icons[name] || "🍽️";
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.background,
        padding: 20,
      }}
    >
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 30,
        }}
        ListHeaderComponent={
          <>
            {/* HEADER */}

            <Text
              style={{
                fontSize: 28,
                fontWeight: "bold",
                color: Colors.heading,
              }}
            >
              Category Management
            </Text>

            <Text
              style={{
                fontSize: 14,
                color: Colors.textSecondary,
                marginTop: 5,
                marginBottom: 20,
              }}
            >
              Organize your restaurant menu
            </Text>

            {/* ADD CATEGORY CARD */}

            <View
              style={{
                backgroundColor: Colors.card,
                borderRadius: 14,
                padding: 15,
                borderWidth: 1,
                borderColor: Colors.border,
                elevation: 2,
                marginBottom: 22,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: Colors.heading,
                  marginBottom: 12,
                }}
              >
                Add New Category
              </Text>

              <TextInput
                placeholder="Enter Category Name"
                placeholderTextColor={Colors.textLight}
                value={categoryName}
                onChangeText={setCategoryName}
                style={{
                  backgroundColor: Colors.surface,
                  borderWidth: 1,
                  borderColor: Colors.border,
                  borderRadius: 10,
                  padding: 12,
                  color: Colors.text,
                  marginBottom: 12,
                }}
              />

              <TouchableOpacity
                onPress={addCategory}
                activeOpacity={0.8}
                style={{
                  backgroundColor: Colors.primary,
                  paddingVertical: 13,
                  borderRadius: 10,
                }}
              >
                <Text
                  style={{
                    color: Colors.buttonText,
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: 16,
                  }}
                >
                  📂 Add New Category
                </Text>
              </TouchableOpacity>
            </View>

            {/* CATEGORY TITLE */}

            <Text
              style={{
                fontSize: 19,
                fontWeight: "bold",
                color: Colors.heading,
                marginBottom: 12,
              }}
            >
              Categories
            </Text>
          </>
        }
        ListEmptyComponent={
          <View
            style={{
              backgroundColor: Colors.card,
              padding: 30,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: Colors.border,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: Colors.textSecondary,
                fontSize: 15,
              }}
            >
              No categories added yet.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: Colors.card,
              borderRadius: 14,
              padding: 15,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: Colors.border,
              elevation: 2,
            }}
          >
            {/* CATEGORY NAME */}

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 14,
              }}
            >
              <View
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 23,
                  backgroundColor: Colors.softMint,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 23,
                  }}
                >
                  {getCategoryIcon(item.name)}
                </Text>
              </View>

              <View
                style={{
                  flex: 1,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: Colors.heading,
                  }}
                >
                  {item.name}
                </Text>

                <Text
                  style={{
                    fontSize: 13,
                    color: Colors.textSecondary,
                    marginTop: 3,
                  }}
                >
                  Menu category
                </Text>
              </View>
            </View>

            {/* MANAGE ITEMS */}

            <TouchableOpacity
              onPress={() =>
                navigation.navigate("MenuItems", {
                  categoryId: item.id,
                  categoryName: item.name,
                })
              }
              activeOpacity={0.8}
              style={{
                backgroundColor: Colors.primary,
                paddingVertical: 11,
                borderRadius: 9,
                marginBottom: 9,
              }}
            >
              <Text
                style={{
                  color: Colors.buttonText,
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 15,
                }}
              >
                Manage Items
              </Text>
            </TouchableOpacity>

            {/* DELETE */}

            <TouchableOpacity
              onPress={() => confirmDeleteCategory(item.id, item.name)}
              activeOpacity={0.8}
              style={{
                borderWidth: 1,
                borderColor: Colors.danger,
                paddingVertical: 10,
                borderRadius: 9,
              }}
            >
              <Text
                style={{
                  color: Colors.danger,
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 15,
                }}
              >
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
