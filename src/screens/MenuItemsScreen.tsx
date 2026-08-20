import { supabase } from "../services/supabase";
import { Alert } from "react-native";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Colors } from "../theme/colors";

export default function MenuItemsScreen({ route }: any) {
  const { categoryId, categoryName } = route.params;

  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [menuItems, setMenuItems] = useState<any[]>([]);

  // ==========================================
  // ADD MENU ITEM
  // ==========================================

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

    const { error } = await supabase.from("menu_items").insert({
      category_id: categoryId,
      name: itemName.trim(),
      price: numericPrice,
      is_available: true,
    });

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    Alert.alert("Success", "Menu Item Added");

    setItemName("");
    setPrice("");

    fetchMenuItems();
  }

  // ==========================================
  // FETCH MENU ITEMS
  // NEWEST ITEMS FIRST
  // ==========================================

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

  // ==========================================
  // DELETE MENU ITEM
  // ==========================================

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

  // ==========================================
  // TOGGLE ON / OFF
  // ==========================================

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

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchMenuItems();
  }, []);

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
      {/* HEADER */}

      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          color: Colors.heading,
          marginBottom: 5,
        }}
      >
        {categoryName}
      </Text>

      <Text
        style={{
          fontSize: 14,
          color: Colors.textSecondary,
          marginBottom: 20,
        }}
      >
        Manage items and availability
      </Text>

      {/* ADD ITEM SECTION */}

      <View
        style={{
          backgroundColor: Colors.card,
          borderRadius: 14,
          padding: 15,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: Colors.border,
          elevation: 2,
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
          Add New Item
        </Text>

        <TextInput
          placeholder="Item Name"
          placeholderTextColor={Colors.textLight}
          value={itemName}
          onChangeText={setItemName}
          style={{
            backgroundColor: Colors.surface,
            borderWidth: 1,
            borderColor: Colors.border,
            borderRadius: 10,
            padding: 12,
            marginBottom: 10,
            color: Colors.text,
          }}
        />

        <TextInput
          placeholder="Price"
          placeholderTextColor={Colors.textLight}
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
          style={{
            backgroundColor: Colors.surface,
            borderWidth: 1,
            borderColor: Colors.border,
            borderRadius: 10,
            padding: 12,
            marginBottom: 12,
            color: Colors.text,
          }}
        />

        <TouchableOpacity
          onPress={addMenuItem}
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
            + Add Item
          </Text>
        </TouchableOpacity>
      </View>

      {/* MENU ITEMS */}

      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{
          paddingBottom: 30,
        }}
        ListHeaderComponent={
          <Text
            style={{
              fontSize: 19,
              fontWeight: "bold",
              color: Colors.heading,
              marginBottom: 12,
            }}
          >
            Menu Items
          </Text>
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
              No menu items added yet.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: Colors.card,
              padding: 15,
              borderRadius: 14,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: Colors.border,
              elevation: 2,
            }}
          >
            {/* ITEM NAME + PRICE */}

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <View
                style={{
                  flex: 1,
                  paddingRight: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: "bold",
                    color: Colors.heading,
                  }}
                >
                  {item.name}
                </Text>

                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: "bold",
                    color: Colors.success,
                    marginTop: 5,
                  }}
                >
                  ₹ {item.price}
                </Text>
              </View>

              {/* ON / OFF */}

              <TouchableOpacity
                onPress={() => toggleAvailability(item.id, item.is_available)}
                activeOpacity={0.8}
                style={{
                  backgroundColor: item.is_available
                    ? Colors.success
                    : Colors.textLight,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  minWidth: 65,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: Colors.buttonText,
                    fontWeight: "bold",
                    fontSize: 13,
                  }}
                >
                  {item.is_available ? "ON" : "OFF"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* STATUS */}

            <View
              style={{
                marginTop: 12,
                paddingVertical: 8,
                paddingHorizontal: 10,
                borderRadius: 8,
                backgroundColor: item.is_available
                  ? Colors.softGreen
                  : Colors.softRed,
              }}
            >
              <Text
                style={{
                  color: item.is_available ? Colors.success : Colors.danger,
                  fontWeight: "600",
                  fontSize: 13,
                }}
              >
                {item.is_available
                  ? "✓ Available for customers"
                  : "✕ Currently unavailable"}
              </Text>
            </View>

            {/* DELETE */}

            <TouchableOpacity
              onPress={() => deleteMenuItem(item.id)}
              activeOpacity={0.8}
              style={{
                marginTop: 10,
                borderWidth: 1,
                borderColor: Colors.danger,
                paddingVertical: 9,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  color: Colors.danger,
                  textAlign: "center",
                  fontWeight: "bold",
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
