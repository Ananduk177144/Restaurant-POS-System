import React, { useEffect, useState } from "react";

import {
  FlatList,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { supabase } from "../services/supabase";
import { Colors } from "../theme/colors";

export default function MenuItemsViewScreen({ route }: any) {
  const { categoryId, categoryName } = route.params;

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    setLoading(true);

    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("category_id", categoryId)
      .eq("is_available", true)
      .order("name");

    setLoading(false);

    if (error) {
      console.log(error);
      return;
    }

    setItems(data || []);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* ========================= */}
        {/* HEADER */}
        {/* ========================= */}

        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Text style={styles.headerEmoji}>
              {getCategoryIcon(categoryName)}
            </Text>
          </View>

          <View style={styles.headerText}>
            <Text numberOfLines={1} style={styles.title}>
              {categoryName}
            </Text>

            <Text style={styles.subtitle}>Available menu items</Text>
          </View>

          <View style={styles.itemCount}>
            <Text style={styles.itemCountNumber}>{items.length}</Text>

            <Text style={styles.itemCountLabel}>Items</Text>
          </View>
        </View>

        {/* ========================= */}
        {/* CATEGORY BANNER */}
        {/* ========================= */}

        <View style={styles.banner}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>Today's Selection</Text>

            <Text style={styles.bannerSubtitle}>
              Freshly available items from our {categoryName} menu
            </Text>
          </View>

          <Text style={styles.bannerEmoji}>🍴</Text>
        </View>

        {/* ========================= */}
        {/* SECTION TITLE */}
        {/* ========================= */}

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Menu Items</Text>

            <Text style={styles.sectionSubtitle}>
              {items.length} available {items.length === 1 ? "item" : "items"}
            </Text>
          </View>

          <View style={styles.availableBadge}>
            <View style={styles.availableDot} />

            <Text style={styles.availableText}>Available</Text>
          </View>
        </View>

        {/* ========================= */}
        {/* LOADING */}
        {/* ========================= */}

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />

            <Text style={styles.loadingText}>Loading menu...</Text>
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIcon}>
                  <Text style={styles.emptyEmoji}>🍽️</Text>
                </View>

                <Text style={styles.emptyTitle}>No Items Available</Text>

                <Text style={styles.emptyText}>
                  There are currently no available items in this category.
                </Text>
              </View>
            }
            renderItem={({ item, index }) => (
              <View style={styles.itemCard}>
                {/* Item number */}

                <View style={styles.numberContainer}>
                  <Text style={styles.numberText}>
                    {String(index + 1).padStart(2, "0")}
                  </Text>
                </View>

                {/* Food icon */}

                <View style={styles.foodIcon}>
                  <Text style={styles.foodEmoji}>🍴</Text>
                </View>

                {/* Item details */}

                <View style={styles.itemInfo}>
                  <Text numberOfLines={2} style={styles.itemName}>
                    {item.name}
                  </Text>

                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Price</Text>

                    <Text style={styles.price}>₹ {item.price}</Text>
                  </View>
                </View>

                {/* Available indicator */}

                <View style={styles.itemStatus}>
                  <View style={styles.itemStatusDot} />
                </View>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

/* ========================= */
/* CATEGORY ICON */
/* ========================= */

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

/* ========================= */
/* STYLES */
/* ========================= */

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
    width: 49,
    height: 49,
    borderRadius: 15,
    backgroundColor: "#FFF3E6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 11,
  },

  headerEmoji: {
    fontSize: 25,
  },

  headerText: {
    flex: 1,
  },

  title: {
    fontSize: 23,
    fontWeight: "900",
    color: Colors.heading,
  },

  subtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  itemCount: {
    minWidth: 57,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
  },

  itemCountNumber: {
    fontSize: 18,
    fontWeight: "900",
    color: Colors.billing,
  },

  itemCountLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: Colors.textSecondary,
  },

  /* ========================= */
  /* BANNER */
  /* ========================= */

  banner: {
    backgroundColor: Colors.primary,
    borderRadius: 18,
    minHeight: 94,
    paddingHorizontal: 16,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
    elevation: 4,
    overflow: "hidden",
  },

  bannerContent: {
    flex: 1,
    paddingRight: 10,
  },

  bannerTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },

  bannerSubtitle: {
    color: "#F8EDE5",
    fontSize: 10,
    lineHeight: 16,
    marginTop: 4,
  },

  bannerEmoji: {
    fontSize: 48,
  },

  /* ========================= */
  /* SECTION */
  /* ========================= */

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 9,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: Colors.heading,
  },

  sectionSubtitle: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  availableBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 15,
  },

  availableDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
    marginRight: 5,
  },

  availableText: {
    fontSize: 9,
    fontWeight: "800",
    color: Colors.success,
  },

  /* ========================= */
  /* LIST */
  /* ========================= */

  listContent: {
    paddingBottom: 30,
  },

  /* ========================= */
  /* ITEM CARD */
  /* ========================= */

  itemCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 11,
    marginBottom: 9,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
  },

  numberContainer: {
    width: 29,
    alignItems: "center",
    marginRight: 5,
  },

  numberText: {
    fontSize: 10,
    fontWeight: "800",
    color: Colors.textLight,
  },

  foodIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
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
    paddingRight: 7,
  },

  itemName: {
    fontSize: 15,
    fontWeight: "800",
    color: Colors.heading,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },

  priceLabel: {
    fontSize: 9,
    color: Colors.textSecondary,
    marginRight: 5,
  },

  price: {
    fontSize: 16,
    fontWeight: "900",
    color: Colors.success,
  },

  itemStatus: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#DCFCE7",
    justifyContent: "center",
    alignItems: "center",
  },

  itemStatusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },

  /* ========================= */
  /* LOADING */
  /* ========================= */

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 10,
  },

  /* ========================= */
  /* EMPTY */
  /* ========================= */

  emptyContainer: {
    alignItems: "center",
    paddingTop: 55,
    paddingHorizontal: 35,
  },

  emptyIcon: {
    width: 75,
    height: 75,
    borderRadius: 24,
    backgroundColor: "#FFF3E6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 13,
  },

  emptyEmoji: {
    fontSize: 36,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: Colors.heading,
  },

  emptyText: {
    textAlign: "center",
    fontSize: 11,
    lineHeight: 17,
    color: Colors.textSecondary,
    marginTop: 5,
  },
});
