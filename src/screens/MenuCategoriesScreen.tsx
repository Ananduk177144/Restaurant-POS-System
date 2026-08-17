import React, { useEffect, useState } from "react";

import {
  FlatList,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { supabase } from "../services/supabase";
import { Colors } from "../theme/colors";

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
      .order("name");

    setLoading(false);

    if (error) {
      console.log(error);
      return;
    }

    setCategories(data || []);
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
          <View style={styles.headerIcon}>
            <Text style={styles.headerEmoji}>🍽️</Text>
          </View>

          <View style={styles.headerText}>
            <Text style={styles.title}>View Menu</Text>

            <Text style={styles.subtitle}>
              Explore our available menu categories
            </Text>
          </View>

          <View style={styles.categoryCount}>
            <Text style={styles.categoryCountNumber}>{categories.length}</Text>

            <Text style={styles.categoryCountLabel}>Categories</Text>
          </View>
        </View>

        {/* ========================= */}
        {/* WELCOME BANNER */}
        {/* ========================= */}

        <View style={styles.banner}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>What would you like today?</Text>

            <Text style={styles.bannerSubtitle}>
              Select a category to explore the available dishes.
            </Text>
          </View>

          <Text style={styles.bannerEmoji}>👨‍🍳</Text>
        </View>

        {/* ========================= */}
        {/* SECTION HEADER */}
        {/* ========================= */}

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Categories</Text>

            <Text style={styles.sectionSubtitle}>
              Choose a category to continue
            </Text>
          </View>

          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>
              {categories.length}{" "}
              {categories.length === 1 ? "Category" : "Categories"}
            </Text>
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
            data={categories}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIcon}>
                  <Text style={styles.emptyEmoji}>🍽️</Text>
                </View>

                <Text style={styles.emptyTitle}>No Categories Available</Text>

                <Text style={styles.emptyText}>
                  The menu categories are currently unavailable.
                </Text>
              </View>
            }
            renderItem={({ item, index }) => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate("MenuItemsView", {
                    categoryId: item.id,
                    categoryName: item.name,
                  })
                }
                style={styles.categoryCard}
              >
                {/* Category Number */}

                <View style={styles.numberContainer}>
                  <Text style={styles.numberText}>
                    {String(index + 1).padStart(2, "0")}
                  </Text>
                </View>

                {/* Category Icon */}

                <View style={styles.categoryIcon}>
                  <Text style={styles.categoryEmoji}>
                    {getCategoryIcon(item.name)}
                  </Text>
                </View>

                {/* Category Details */}

                <View style={styles.categoryInfo}>
                  <Text numberOfLines={1} style={styles.categoryName}>
                    {item.name}
                  </Text>

                  <Text style={styles.categoryDescription}>
                    Tap to view available items
                  </Text>
                </View>

                {/* Arrow */}

                <View style={styles.arrowContainer}>
                  <Text style={styles.arrow}>›</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
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

  categoryCount: {
    minWidth: 68,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
  },

  categoryCountNumber: {
    fontSize: 18,
    fontWeight: "900",
    color: Colors.billing,
  },

  categoryCountLabel: {
    fontSize: 8,
    fontWeight: "700",
    color: Colors.textSecondary,
  },

  /* ========================= */
  /* BANNER */
  /* ========================= */

  banner: {
    backgroundColor: Colors.primary,
    borderRadius: 18,
    minHeight: 100,
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
    fontSize: 47,
  },

  /* ========================= */
  /* SECTION */
  /* ========================= */

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
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

  categoryBadge: {
    backgroundColor: "#FFF3E6",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },

  categoryBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    color: Colors.primary,
  },

  /* ========================= */
  /* LIST */
  /* ========================= */

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

  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: "#FFF8F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 11,
  },

  categoryEmoji: {
    fontSize: 27,
  },

  categoryInfo: {
    flex: 1,
    paddingRight: 8,
  },

  categoryName: {
    fontSize: 16,
    fontWeight: "900",
    color: Colors.heading,
  },

  categoryDescription: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 4,
  },

  /* ========================= */
  /* ARROW */
  /* ========================= */

  arrowContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },

  arrow: {
    fontSize: 25,
    lineHeight: 26,
    fontWeight: "400",
    color: Colors.primary,
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
