import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { Colors } from "../../theme/colors";
import BackButton from "../BackButton";

type BillingHeaderProps = {
  navigation: any;

  sendWhatsApp: boolean;
  setSendWhatsApp: (value: boolean) => void;

  customerName: string;
  setCustomerName: (value: string) => void;

  customerMobile: string;
  setCustomerMobile: (value: string) => void;

  searchText: string;
  setSearchText: (value: string) => void;
};

export default function BillingHeader({
  navigation,
  sendWhatsApp,
  setSendWhatsApp,
  customerName,
  setCustomerName,
  customerMobile,
  setCustomerMobile,
  searchText,
  setSearchText,
}: BillingHeaderProps) {
  return (
    <View style={styles.container}>
      {/* ========================= */}
      {/* TOP HEADER */}
      {/* ========================= */}

      <View style={styles.topHeader}>
        {/* Back Button */}

        <View style={styles.backButtonContainer}>
          <BackButton navigation={navigation} />
        </View>

        {/* Centered Title */}

        <View style={styles.titleContainer}>
          <View style={styles.titleIcon}>
            <Text style={styles.titleIconText}>🧾</Text>
          </View>

          <View>
            <Text style={styles.title}>Create Bill</Text>

            <Text style={styles.subtitle}>Add items and generate invoice</Text>
          </View>
        </View>
      </View>

      {/* ========================= */}
      {/* WHATSAPP TOGGLE */}
      {/* ========================= */}

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setSendWhatsApp(!sendWhatsApp)}
        style={[
          styles.whatsappToggle,
          sendWhatsApp && styles.whatsappToggleActive,
        ]}
      >
        <View style={styles.whatsappLeft}>
          <View
            style={[
              styles.whatsappIcon,
              sendWhatsApp && styles.whatsappIconActive,
            ]}
          >
            <Text style={styles.whatsappIconText}>💬</Text>
          </View>

          <View>
            <Text style={styles.whatsappTitle}>WhatsApp Invoice</Text>

            <Text style={styles.whatsappSubtitle}>
              {sendWhatsApp
                ? "Customer details required"
                : "Send invoice to customer"}
            </Text>
          </View>
        </View>

        <View style={[styles.switch, sendWhatsApp && styles.switchActive]}>
          <View
            style={[
              styles.switchThumb,
              sendWhatsApp && styles.switchThumbActive,
            ]}
          />
        </View>
      </TouchableOpacity>

      {/* ========================= */}
      {/* CUSTOMER DETAILS */}
      {/* ========================= */}

      {sendWhatsApp && (
        <View style={styles.customerSection}>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputIcon}>👤</Text>

            <TextInput
              placeholder="Customer name"
              placeholderTextColor={Colors.textLight}
              value={customerName}
              onChangeText={setCustomerName}
              style={styles.input}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputIcon}>📱</Text>

            <TextInput
              placeholder="Mobile number"
              placeholderTextColor={Colors.textLight}
              keyboardType="phone-pad"
              value={customerMobile}
              onChangeText={setCustomerMobile}
              style={styles.input}
            />
          </View>
        </View>
      )}

      {/* ========================= */}
      {/* SEARCH */}
      {/* ========================= */}

      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>

        <TextInput
          placeholder="Search menu items..."
          placeholderTextColor={Colors.textLight}
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
        />

        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText("")}>
            <Text style={styles.clearSearch}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    paddingHorizontal: 15,
    paddingTop: 4,
    paddingBottom: 8,
  },

  /* ========================= */
  /* TOP HEADER */
  /* ========================= */

  topHeader: {
    height: 62,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 7,
  },

  backButtonContainer: {
    position: "absolute",
    left: 0,
    top: 8,
    zIndex: 10,
  },

  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  titleIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 9,
  },

  titleIconText: {
    fontSize: 21,
  },

  title: {
    fontSize: 22,
    fontWeight: "900",
    color: Colors.heading,
  },

  subtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },

  /* ========================= */
  /* WHATSAPP */
  /* ========================= */

  whatsappToggle: {
    minHeight: 52,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  whatsappToggleActive: {
    borderColor: Colors.primary,
    backgroundColor: "#F0FDF4",
  },

  whatsappLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  whatsappIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  whatsappIconActive: {
    backgroundColor: "#DCFCE7",
  },

  whatsappIconText: {
    fontSize: 18,
  },

  whatsappTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.heading,
  },

  whatsappSubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  switch: {
    width: 44,
    height: 25,
    borderRadius: 14,
    backgroundColor: "#D1D5DB",
    padding: 3,
    justifyContent: "center",
  },

  switchActive: {
    backgroundColor: Colors.primary,
  },

  switchThumb: {
    width: 19,
    height: 19,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },

  switchThumbActive: {
    alignSelf: "flex-end",
  },

  /* ========================= */
  /* CUSTOMER */
  /* ========================= */

  customerSection: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },

  inputWrapper: {
    flex: 1,
    height: 42,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 11,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },

  inputIcon: {
    fontSize: 15,
    marginRight: 6,
  },

  input: {
    flex: 1,
    fontSize: 13,
    color: Colors.text,
    paddingVertical: 0,
  },

  /* ========================= */
  /* SEARCH */
  /* ========================= */

  searchContainer: {
    height: 44,
    borderRadius: 13,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },

  searchIcon: {
    fontSize: 17,
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    paddingVertical: 0,
  },

  clearSearch: {
    fontSize: 15,
    color: Colors.textSecondary,
    paddingLeft: 8,
  },
});
