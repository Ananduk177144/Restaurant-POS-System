import React, { useEffect, useState } from "react";
import { FlatList, View, Text, StyleSheet } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { supabase } from "../services/supabase";
import { Colors } from "../theme/colors";
import BackButton from "../components/BackButton";

export default function MenuItemsViewScreen({ route, navigation }: any) {
  const categoryId = route?.params?.categoryId;
  const categoryName = route?.params?.categoryName || "Menu";

  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (categoryId) {
      fetchItems();
    }
  }, [categoryId]);

  async function fetchItems() {
    console.log("========== VIEW MENU DEBUG ==========");
    console.log("categoryId:", categoryId);
    console.log("categoryName:", categoryName);

    if (!categoryId) {
      console.log("❌ categoryId is missing");
      return;
    }

    // First: fetch ALL menu items for this category
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("category_id", categoryId)
      .order("name");

    console.log("Supabase data:", data);
    console.log("Supabase error:", error);

    if (error) {
      console.log("❌ MENU ITEMS FETCH ERROR:", error.message);
      return;
    }

    console.log("Number of items:", data?.length || 0);

    setItems(data || []);

    console.log("====================================");
  }
  /*
   * If the screen was opened without a category,
   * don't try to query Supabase with an undefined ID.
   */
  if (!categoryId) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <BackButton navigation={navigation} />

          <View style={styles.titleContainer}>
            <Text style={styles.titleIcon}>🍽️</Text>

            <Text style={styles.headerTitle} numberOfLines={1}>
              Menu
            </Text>
          </View>
        </View>

        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>

          <Text style={styles.errorTitle}>Category Not Found</Text>

          <Text style={styles.errorText}>
            Unable to load this menu category.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <View style={styles.header}>
        {/* Back button */}
        <BackButton navigation={navigation} />

        {/* Centered title */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleIcon}>🍽️</Text>

          <Text style={styles.headerTitle} numberOfLines={1}>
            {categoryName}
          </Text>
        </View>
      </View>

      {/* ========================= */}
      {/* MENU ITEMS */}
      {/* ========================= */}

      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.intro}>
            <Text style={styles.introTitle}>Available Items</Text>

            <Text style={styles.introSubtitle}>
              Freshly available items from {categoryName}.
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🍽️</Text>

            <Text style={styles.emptyTitle}>No Items Available</Text>

            <Text style={styles.emptyText}>
              There are currently no available items in this category.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            {/* Item Icon */}

            <View style={styles.itemIcon}>
              <Text style={styles.itemIconText}>🍴</Text>
            </View>

            {/* Item Information */}

            <View style={styles.itemContent}>
              <Text style={styles.itemName}>{item.name}</Text>

              <Text style={styles.itemAvailability}>Available</Text>
            </View>

            {/* Price */}

            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>PRICE</Text>

              <Text style={styles.price}>₹ {item.price}</Text>
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
    paddingHorizontal: 16,
  },

  /* ========================= */
  /* HEADER */
  /* ========================= */

  header: {
    height: 64,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },

  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "65%",
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
  /* ITEM CARD */
  /* ========================= */

  itemCard: {
    backgroundColor: Colors.card,
    minHeight: 76,
    borderRadius: 17,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },

  itemIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#F0FDF4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 11,
  },

  itemIconText: {
    fontSize: 22,
  },

  itemContent: {
    flex: 1,
  },

  itemName: {
    fontSize: 15,
    fontWeight: "800",
    color: Colors.heading,
  },

  itemAvailability: {
    fontSize: 10,
    color: Colors.success,
    fontWeight: "700",
    marginTop: 4,
  },

  /* ========================= */
  /* PRICE */
  /* ========================= */

  priceContainer: {
    alignItems: "flex-end",
    marginLeft: 8,
  },

  priceLabel: {
    fontSize: 8,
    color: Colors.textSecondary,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  price: {
    fontSize: 18,
    fontWeight: "900",
    color: Colors.primary,
    marginTop: 2,
  },

  /* ========================= */
  /* EMPTY */
  /* ========================= */

  emptyContainer: {
    alignItems: "center",
    paddingTop: 65,
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

  /* ========================= */
  /* ERROR STATE */
  /* ========================= */

  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  errorIcon: {
    fontSize: 42,
    marginBottom: 12,
  },

  errorTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: Colors.heading,
  },

  errorText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 5,
  },
});
