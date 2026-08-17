import React from "react";

import {
  FlatList,
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
} from "react-native";

import { Colors } from "../../theme/colors";

type MenuGridProps = {
  menuItems: any[];
  searchText: string;
  selectedCategory: string;
  cart: any[];
  addToCart: (item: any) => void;
};

const foodImages: { [key: string]: string } = {
  Biryani: "🍛",
  Biriyani: "🍛",
  FriedRice: "🍚",
  Burger: "🍔",
  Pizza: "🍕",
  Chicken: "🍗",
  Fish: "🐟",
  Mutton: "🍖",
  Beef: "🥩",
  Veg: "🥗",
  Dessert: "🍰",
  IceCream: "🍨",
  Coffee: "☕",
  Tea: "🫖",
  Juice: "🧃",
  Drinks: "🥤",
  Beverages: "🥤",
};

export default function MenuGrid({
  menuItems,
  searchText,
  selectedCategory,
  cart,
  addToCart,
}: MenuGridProps) {
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchText.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || item.categories?.name === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  function getCartQuantity(id: number) {
    const cartItem = cart.find((item) => item.id === id);

    return cartItem ? cartItem.quantity : 0;
  }

  function getEmoji(item: any) {
    const categoryName = item.categories?.name;

    return foodImages[categoryName] || "🍴";
  }

  return (
    <FlatList
      style={styles.list}
      data={filteredItems}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
      columnWrapperStyle={styles.column}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🔍</Text>

          <Text style={styles.emptyTitle}>No items found</Text>

          <Text style={styles.emptyText}>Try another search or category</Text>
        </View>
      }
      renderItem={({ item }) => {
        const qty = getCartQuantity(item.id);

        const imageUrl = item.image_url || item.image || item.imageUrl || null;

        return (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => addToCart(item)}
            style={styles.card}
          >
            {/* Image / Food Icon */}
            <View style={styles.imageContainer}>
              {imageUrl ? (
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.image}
                  resizeMode="cover"
                />
              ) : (
                <Text style={styles.foodEmoji}>{getEmoji(item)}</Text>
              )}

              {qty > 0 && (
                <View style={styles.quantityBadge}>
                  <Text style={styles.quantityText}>{qty}</Text>
                </View>
              )}
            </View>

            {/* Item name */}
            <Text numberOfLines={2} style={styles.name}>
              {item.name}
            </Text>

            {/* Price */}
            <Text style={styles.price}>₹ {item.price}</Text>

            {/* Add button */}
            <View style={[styles.addButton, qty > 0 && styles.addButtonActive]}>
              <Text
                style={[
                  styles.addButtonText,
                  qty > 0 && styles.addButtonTextActive,
                ]}
              >
                {qty > 0 ? `✓ Added × ${qty}` : "+ Add"}
              </Text>
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 190,
  },

  column: {
    justifyContent: "space-between",
  },

  card: {
    width: "48.5%",
    backgroundColor: Colors.card,
    borderRadius: 16,
    marginBottom: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.border,

    elevation: 3,
  },

  imageContainer: {
    height: 105,
    borderRadius: 12,
    backgroundColor: "#FFF3E6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 9,
    overflow: "hidden",
    position: "relative",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  foodEmoji: {
    fontSize: 48,
  },

  quantityBadge: {
    position: "absolute",
    top: 7,
    right: 7,
    minWidth: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  quantityText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },

  name: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.heading,
    minHeight: 38,
  },

  price: {
    fontSize: 17,
    fontWeight: "800",
    color: Colors.price,
    marginTop: 4,
  },

  addButton: {
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 9,
  },

  addButtonActive: {
    backgroundColor: "#DCFCE7",
  },

  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13,
  },

  addButtonTextActive: {
    color: Colors.success,
  },

  empty: {
    width: "100%",
    alignItems: "center",
    paddingTop: 70,
  },

  emptyIcon: {
    fontSize: 42,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.heading,
    marginTop: 10,
  },

  emptyText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});
