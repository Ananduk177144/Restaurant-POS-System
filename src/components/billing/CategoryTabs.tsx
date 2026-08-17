import React from "react";
import { ScrollView, TouchableOpacity, Text, StyleSheet } from "react-native";

import { Colors } from "../../theme/colors";

const categoryIcons: { [key: string]: string } = {
  All: "🍽",
  Beverages: "🥤",
  Drinks: "🥤",
  Breakfast: "🍳",
  Lunch: "🍱",
  Dinner: "🍽",
  Curry: "🍛",
  Snacks: "🍕",
  Dessert: "🍰",
  IceCream: "🍨",
  Coffee: "☕",
  Tea: "🫖",
  Juice: "🧃",
  Biriyani: "🍗",
  Biryani: "🍗",
  Meals: "🍛",
  FriedRice: "🍚",
  Chinese: "🥢",
  Burger: "🍔",
  Pizza: "🍕",
  Sandwich: "🥪",
  Chicken: "🍗",
  Beef: "🥩",
  Fish: "🐟",
  Mutton: "🍖",
  Veg: "🥗",
};

type CategoryTabsProps = {
  categories: any[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
};

export default function CategoryTabs({
  categories,
  selectedCategory,
  setSelectedCategory,
}: CategoryTabsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {/* All */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setSelectedCategory("All")}
        style={[
          styles.category,
          selectedCategory === "All" && styles.categorySelected,
        ]}
      >
        <Text style={styles.icon}>🍽</Text>

        <Text
          style={[
            styles.categoryText,
            selectedCategory === "All" && styles.categoryTextSelected,
          ]}
        >
          All
        </Text>
      </TouchableOpacity>

      {/* Dynamic categories */}
      {categories.map((category) => {
        const selected = selectedCategory === category.name;

        return (
          <TouchableOpacity
            key={category.id}
            activeOpacity={0.8}
            onPress={() => setSelectedCategory(category.name)}
            style={[styles.category, selected && styles.categorySelected]}
          >
            <Text style={styles.icon}>
              {categoryIcons[category.name] || "🍴"}
            </Text>

            <Text
              style={[
                styles.categoryText,
                selected && styles.categoryTextSelected,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    maxHeight: 54,
    flexGrow: 0,
  },

  content: {
    paddingHorizontal: 15,
    paddingVertical: 7,
    alignItems: "center",
  },

  category: {
    height: 38,
    paddingHorizontal: 13,
    borderRadius: 20,
    backgroundColor: Colors.categoryBackground,
    marginRight: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },

  categorySelected: {
    backgroundColor: Colors.selectedCategory,
    borderColor: Colors.selectedCategory,
    elevation: 3,
  },

  icon: {
    fontSize: 15,
    marginRight: 5,
  },

  categoryText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textSecondary,
  },

  categoryTextSelected: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
