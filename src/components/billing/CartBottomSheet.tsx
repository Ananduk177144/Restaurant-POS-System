import React, { useState } from "react";

import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import CurrentOrderPanel from "./CurrentOrderPanel";
import BillingFooter from "./BillingFooter";
import { Colors } from "../../theme/colors";

type Props = {
  cart: any[];

  increaseQuantity: (id: number) => void;

  decreaseQuantity: (id: number) => void;

  clearCart: () => void;

  totalAmount: number;

  loading: boolean;

  generateBill: () => void;
};

export default function CartBottomSheet({
  cart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  totalAmount,
  loading,
  generateBill,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={[styles.container, expanded && styles.containerExpanded]}>
      {/* Handle / Header */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setExpanded(!expanded)}
        style={styles.header}
      >
        <View style={styles.handle} />

        <View style={styles.headerRow}>
          <View style={styles.orderInfo}>
            <View style={styles.orderIcon}>
              <Text style={styles.orderIconText}>🛒</Text>
            </View>

            <View>
              <Text style={styles.orderTitle}>Current Order</Text>

              <Text style={styles.orderSubtitle}>
                {cart.length} {cart.length === 1 ? "item" : "items"}
              </Text>
            </View>
          </View>

          <View style={styles.amountContainer}>
            <Text style={styles.amount}>₹ {totalAmount}</Text>

            <Text style={styles.expandText}>
              {expanded ? "Collapse ▲" : "View Order ▼"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Expanded content */}
      {expanded && (
        <View style={styles.expandedContent}>
          <CurrentOrderPanel
            cart={cart}
            increaseQuantity={increaseQuantity}
            decreaseQuantity={decreaseQuantity}
            clearCart={clearCart}
            totalAmount={totalAmount}
          />

          <BillingFooter
            totalAmount={totalAmount}
            itemCount={cart.length}
            loading={loading}
            generateBill={generateBill}
            clearCart={clearCart}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    elevation: 16,

    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: -3,
    },
  },

  containerExpanded: {
    maxHeight: "62%",
  },

  header: {
    paddingHorizontal: 14,
    paddingTop: 7,
    paddingBottom: 9,
  },

  handle: {
    alignSelf: "center",
    width: 42,
    height: 4,
    borderRadius: 5,
    backgroundColor: Colors.border,
    marginBottom: 8,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  orderInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  orderIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FFF3E6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 9,
  },

  orderIconText: {
    fontSize: 19,
  },

  orderTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: Colors.heading,
  },

  orderSubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  amountContainer: {
    alignItems: "flex-end",
  },

  amount: {
    fontSize: 18,
    fontWeight: "900",
    color: Colors.primary,
  },

  expandText: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.textSecondary,
    marginTop: 2,
  },

  expandedContent: {
    flexShrink: 1,
  },
});
