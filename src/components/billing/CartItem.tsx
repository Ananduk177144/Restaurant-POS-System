import React from "react";

import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import { Colors } from "../../theme/colors";

type Props = {
  item: any;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
};

export default function CartItem({
  item,
  increaseQuantity,
  decreaseQuantity,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text numberOfLines={1} style={styles.name}>
          {item.name}
        </Text>

        <Text style={styles.price}>
          ₹{item.price} × {item.quantity}
        </Text>
      </View>

      <View style={styles.right}>
        <View style={styles.quantityControl}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => decreaseQuantity(item.id)}
            style={styles.quantityButton}
          >
            <Text style={styles.quantityButtonText}>−</Text>
          </TouchableOpacity>

          <Text style={styles.quantity}>{item.quantity}</Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => increaseQuantity(item.id)}
            style={[styles.quantityButton, styles.plusButton]}
          >
            <Text style={[styles.quantityButtonText, styles.plusText]}>+</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.total}>₹{item.price * item.quantity}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  info: {
    flex: 1,
    paddingRight: 8,
  },

  name: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.heading,
  },

  price: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 3,
  },

  right: {
    alignItems: "flex-end",
  },

  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
  },

  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },

  plusButton: {
    backgroundColor: "#DCFCE7",
  },

  quantityButtonText: {
    fontSize: 17,
    fontWeight: "800",
    color: Colors.text,
  },

  plusText: {
    color: Colors.success,
  },

  quantity: {
    fontSize: 14,
    fontWeight: "800",
    marginHorizontal: 9,
    color: Colors.heading,
  },

  total: {
    fontSize: 13,
    fontWeight: "800",
    color: Colors.primary,
    marginTop: 3,
  },
});
