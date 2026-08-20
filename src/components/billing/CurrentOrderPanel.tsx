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
  clearCart,
  totalAmount
}: CurrentOrderPanelProps) {
  return (
    <View style={styles.container}>
      {/* Order Items Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.cartIcon}>
            <Text style={styles.cartIconText}>🛒</Text>
          </View>

          <View>
            <Text style={styles.title}>Order Items</Text>

            <Text style={styles.subtitle}>
              {cart.length} {cart.length === 1 ? "item" : "items"} added
            </Text>
          </View>
        </View>
      </View>

      {/* Cart Items */}
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
    paddingTop: 6,
    paddingBottom: 2,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  cartIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#EAF7F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },

  cartIconText: {
    fontSize: 16,
  },

  title: {
    fontSize: 15,
    fontWeight: "800",
    color: Colors.heading,
  },

  subtitle: {
    fontSize: 10,
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
