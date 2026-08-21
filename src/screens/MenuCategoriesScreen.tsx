import React, { useEffect, useState } from "react";
import {
  FlatList,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Alert,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { supabase } from "../services/supabase";
import { Colors } from "../theme/colors";
import BackButton from "../components/BackButton";

export default function MenuCategoriesScreen({ navigation }: any) {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.log("Category fetch error:", error);
      Alert.alert("Error", error.message);
      setLoading(false);
      return;
    }

    console.log("Categories fetched:", data);

    setCategories(data || []);
    setLoading(false);
  }

  function getCategoryIcon(name: string) {
    const icons: any = {
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
    };

    return icons[name] || "🍽️";
  }

  function openCategory(item: any) {
    console.log("Selected category:", item);

    if (!item || item.id === undefined || item.id === null) {
      Alert.alert(
        "Category Error",
        "This category does not have a valid category ID.",
      );

      return;
    }

    navigation.navigate("MenuItemsView", {
      categoryId: item.id,
      categoryName: item.name,
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <View style={styles.header}>
        <BackButton navigation={navigation} />

        <View style={styles.titleContainer}>
          <Text style={styles.titleIcon}>🍽️</Text>

          <Text style={styles.headerTitle}>View Menu</Text>
        </View>
      </View>

      {/* ========================= */}
      {/* CATEGORY LIST */}
      {/* ========================= */}

      <FlatList
        data={categories}
        keyExtractor={(item, index) =>
          item?.id !== undefined ? item.id.toString() : `category-${index}`
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshing={loading}
        onRefresh={fetchCategories}
        ListHeaderComponent={
          <View style={styles.intro}>
            <Text style={styles.introTitle}>Explore Our Menu</Text>

            <Text style={styles.introSubtitle}>
              Select a category to view the available items.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => openCategory(item)}
            style={styles.categoryCard}
          >
            {/* Category Icon */}

            <View style={styles.iconContainer}>
              <Text style={styles.icon}>{getCategoryIcon(item.name)}</Text>
            </View>

            {/* Category Information */}

            <View style={styles.categoryContent}>
              <Text style={styles.categoryName}>{item.name}</Text>

              <Text style={styles.categorySubtitle}>
                Tap to view menu items
              </Text>
            </View>

            {/* Arrow */}

            <View style={styles.arrowContainer}>
              <Text style={styles.arrow}>›</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🍽️</Text>

            <Text style={styles.emptyTitle}>No Categories Available</Text>

            <Text style={styles.emptyText}>
              Menu categories will appear here once they are added.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
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
    paddingTop: 14,
    marginBottom: 2,
  },

  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "70%",
  },

  titleIcon: {
    fontSize: 22,
    marginRight: 7,
  },

  headerTitle: {
    fontSize: 21,
    fontWeight: "900",
    color: Colors.heading,
  },

  /* ========================= */
  /* INTRO */
  /* ========================= */

  intro: {
    marginTop: 4,
    marginBottom: 14,
  },

  introTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: Colors.heading,
  },

  introSubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 3,
  },

  /* ========================= */
  /* LIST */
  /* ========================= */

  listContent: {
    paddingBottom: 35,
  },

  /* ========================= */
  /* CATEGORY CARD */
  /* ========================= */

  categoryCard: {
    backgroundColor: Colors.card,
    minHeight: 72,
    borderRadius: 17,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#F0FDF4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  icon: {
    fontSize: 25,
  },

  categoryContent: {
    flex: 1,
  },

  categoryName: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.heading,
  },

  categorySubtitle: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 3,
  },

  arrowContainer: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },

  arrow: {
    fontSize: 24,
    fontWeight: "400",
    color: Colors.heading,
    marginTop: -2,
  },

  /* ========================= */
  /* EMPTY */
  /* ========================= */

  emptyContainer: {
    alignItems: "center",
    paddingTop: 70,
    paddingHorizontal: 25,
  },

  emptyIcon: {
    fontSize: 45,
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: Colors.heading,
  },

  emptyText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 5,
    lineHeight: 18,
  },
});
