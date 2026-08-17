import React from "react";

import { View, Text, FlatList, StyleSheet } from "react-native";

import CartItem from "./CartItem";
import EmptyCart from "./EmptyCart";
import { Colors } from "../../theme/colors";

type CurrentOrderPanelProps = {
  cart: any[];
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  clearCart: () => void;
  totalAmount: number;
};

export default function CurrentOrderPanel({
  cart,
  increaseQuantity,
  decreaseQuantity,
}: CurrentOrderPanelProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.cartIcon}>
            <Text style={styles.cartIconText}>🛒</Text>
          </View>

          <View>
            <Text style={styles.title}>Current Order</Text>

            <Text style={styles.subtitle}>
              {cart.length} {cart.length === 1 ? "item" : "items"} added
            </Text>
          </View>
        </View>
      </View>

      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <EmptyCart />
        </View>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <CartItem
              item={item}
              increaseQuantity={increaseQuantity}
              decreaseQuantity={decreaseQuantity}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 4,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  cartIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: "#FFF3E6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 9,
  },

  cartIconText: {
    fontSize: 18,
  },

  title: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.heading,
  },

  subtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },

  list: {
    maxHeight: 145,
  },

  listContent: {
    paddingBottom: 2,
  },

  emptyContainer: {
    paddingVertical: 8,
  },
});
