import React from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import { Colors } from "../../theme/colors";

type BillingFooterProps = {
  totalAmount: number;
  itemCount: number;
  loading: boolean;
  generateBill: () => void;
  clearCart: () => void;
};

export default function BillingFooter({
  totalAmount,
  itemCount,
  loading,
  generateBill,
  clearCart,
}: BillingFooterProps) {
  
  return (
    <View style={styles.container}>
      {/* Summary */}
      <View style={styles.summary}>
        <View>
          <Text style={styles.label}>TOTAL ITEMS</Text>

          <Text style={styles.itemCount}>{itemCount}</Text>
        </View>

        <View style={styles.totalContainer}>
          <Text style={styles.label}>GRAND TOTAL</Text>

          <Text style={styles.total}>₹ {totalAmount}</Text>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttons}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={clearCart}
          disabled={loading}
          style={styles.clearButton}
        >
          <Text style={styles.clearIcon}>🗑</Text>

          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={generateBill}
          disabled={loading || itemCount === 0}
          style={[
            styles.generateButton,
            (loading || itemCount === 0) && styles.generateButtonDisabled,
          ]}
        >
          {loading ? (
            <>
              <ActivityIndicator size="small" color="#FFFFFF" />

              <Text style={styles.generateText}>Generating...</Text>
            </>
          ) : (
            <>
              <Text style={styles.generateIcon}>✓</Text>

              <Text style={styles.generateText}>Generate Bill</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 8,
    elevation: 12,
  },

  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  label: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },

  itemCount: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.heading,
    marginTop: 1,
  },

  totalContainer: {
    alignItems: "flex-end",
  },

  total: {
    fontSize: 25,
    fontWeight: "900",
    color: Colors.primary,
    marginTop: 1,
  },

  buttons: {
    flexDirection: "row",
    gap: 8,
  },

  clearButton: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  clearIcon: {
    fontSize: 15,
    marginRight: 5,
  },

  clearText: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.text,
  },

  generateButton: {
    flex: 2.2,
    height: 46,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    elevation: 3,
  },

  generateButtonDisabled: {
    opacity: 0.55,
  },

  generateIcon: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
    marginRight: 6,
  },

  generateText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
});
