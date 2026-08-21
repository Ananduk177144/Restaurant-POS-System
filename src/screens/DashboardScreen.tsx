import React, { useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";

import { supabase } from "../services/supabase";
import { Colors } from "../theme/colors";

export default function DashboardScreen({ navigation }: any) {
  const [isOnline, setIsOnline] = useState(true);

  async function logout() {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          const { error } = await supabase.auth.signOut();

          if (error) {
            Alert.alert("Error", error.message);
          }
        },
      },
    ]);
  }

  function toggleStatus() {
    setIsOnline((currentStatus) => !currentStatus);
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ========================= */}
        {/* HEADER */}
        {/* ========================= */}

        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={styles.logoContainer}>
              <Text style={styles.logo}>🍽️</Text>
            </View>

            <View>
              <Text style={styles.restaurantName}>Restaurant POS</Text>

              <Text style={styles.welcomeText}>Welcome back</Text>
            </View>
          </View>

          {/* ONLINE / OFFLINE TOGGLE */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={toggleStatus}
            style={[
              styles.statusBadge,
              isOnline ? styles.onlineBadge : styles.offlineBadge,
            ]}
          >
            <View
              style={[
                styles.statusDot,
                isOnline ? styles.onlineDot : styles.offlineDot,
              ]}
            />

            <Text
              style={[
                styles.statusText,
                isOnline ? styles.onlineText : styles.offlineText,
              ]}
            >
              {isOnline ? "Online" : "Offline"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ========================= */}
        {/* WELCOME CARD */}
        {/* ========================= */}

        <View style={styles.welcomeCard}>
          <View style={styles.welcomeContent}>
            <Text style={styles.welcomeTitle}>Good to see you! 👋</Text>

            <Text style={styles.welcomeSubtitle}>
              Manage your restaurant operations from one place.
            </Text>
          </View>

          <Text style={styles.welcomeEmoji}>🧑‍🍳</Text>
        </View>

        {/* ========================= */}
        {/* QUICK ACTIONS */}
        {/* ========================= */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <Text style={styles.sectionSubtitle}>Frequently used</Text>
        </View>

        <View style={styles.actionGrid}>
          {/* Billing */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate("Billing")}
            style={[styles.actionCard, styles.billingCard]}
          >
            <View style={[styles.actionIcon, styles.billingIcon]}>
              <Text style={styles.actionEmoji}>🧾</Text>
            </View>

            <Text style={styles.actionTitle}>Billing</Text>

            <Text style={styles.actionDescription}>Create a new bill</Text>

            <View style={styles.arrow}>
              <Text style={styles.arrowText}>→</Text>
            </View>
          </TouchableOpacity>

          {/* View Menu */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate("MenuCategories")}
            style={[styles.actionCard, styles.menuCard]}
          >
            <View style={[styles.actionIcon, styles.menuIcon]}>
              <Text style={styles.actionEmoji}>🍽️</Text>
            </View>

            <Text style={styles.actionTitle}>View Menu</Text>

            <Text style={styles.actionDescription}>Browse restaurant menu</Text>

            <View style={styles.arrow}>
              <Text style={styles.arrowText}>→</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ========================= */}
        {/* MANAGEMENT */}
        {/* ========================= */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Management</Text>

          <Text style={styles.sectionSubtitle}>Restaurant operations</Text>
        </View>

        {/* Menu Management */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate("MenuManagement")}
          style={styles.managementCard}
        >
          <View
            style={[
              styles.managementIcon,
              {
                backgroundColor: "#FFF3E6",
              },
            ]}
          >
            <Text style={styles.managementEmoji}>📋</Text>
          </View>

          <View style={styles.managementContent}>
            <Text style={styles.managementTitle}>Menu Management</Text>

            <Text style={styles.managementDescription}>
              Add, edit and manage menu items
            </Text>
          </View>

          <Text style={styles.managementArrow}>→</Text>
        </TouchableOpacity>

        {/* Bill History */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate("BillHistory")}
          style={styles.managementCard}
        >
          <View
            style={[
              styles.managementIcon,
              {
                backgroundColor: "#EFF6FF",
              },
            ]}
          >
            <Text style={styles.managementEmoji}>📜</Text>
          </View>

          <View style={styles.managementContent}>
            <Text style={styles.managementTitle}>Bill History</Text>

            <Text style={styles.managementDescription}>
              View previous restaurant bills
            </Text>
          </View>

          <Text style={styles.managementArrow}>→</Text>
        </TouchableOpacity>

        {/* Sales Dashboard */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate("SalesDashboard")}
          style={styles.managementCard}
        >
          <View
            style={[
              styles.managementIcon,
              {
                backgroundColor: "#F0FDF4",
              },
            ]}
          >
            <Text style={styles.managementEmoji}>📊</Text>
          </View>

          <View style={styles.managementContent}>
            <Text style={styles.managementTitle}>Sales Dashboard</Text>

            <Text style={styles.managementDescription}>
              Monitor restaurant sales
            </Text>
          </View>

          <Text style={styles.managementArrow}>→</Text>
        </TouchableOpacity>

        {/* ========================= */}
        {/* LOGOUT */}
        {/* ========================= */}

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={logout}
          style={styles.logoutButton}
        >
          <Text style={styles.logoutIcon}>↪</Text>

          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Restaurant POS • Version 1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 30,
  },

  /* ========================= */
  /* HEADER */
  /* ========================= */

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 11,
    elevation: 3,
  },

  logo: {
    fontSize: 24,
  },

  restaurantName: {
    fontSize: 20,
    fontWeight: "900",
    color: Colors.heading,
  },

  welcomeText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  /* ========================= */
  /* ONLINE / OFFLINE */
  /* ========================= */

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  onlineBadge: {
    backgroundColor: "#DCFCE7",
  },

  offlineBadge: {
    backgroundColor: "#FEE2E2",
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 5,
  },

  onlineDot: {
    backgroundColor: Colors.success,
  },

  offlineDot: {
    backgroundColor: Colors.logout,
  },

  statusText: {
    fontSize: 11,
    fontWeight: "800",
  },

  onlineText: {
    color: Colors.success,
  },

  offlineText: {
    color: Colors.logout,
  },

  /* ========================= */
  /* WELCOME CARD */
  /* ========================= */

  welcomeCard: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 18,
    minHeight: 115,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
    overflow: "hidden",
    elevation: 5,
  },

  welcomeContent: {
    flex: 1,
    paddingRight: 10,
  },

  welcomeTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },

  welcomeSubtitle: {
    color: "#F8EDE5",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
  },

  welcomeEmoji: {
    fontSize: 58,
  },

  /* ========================= */
  /* SECTIONS */
  /* ========================= */

  sectionHeader: {
    marginBottom: 10,
    marginTop: 2,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: Colors.heading,
  },

  sectionSubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  /* ========================= */
  /* QUICK ACTIONS */
  /* ========================= */

  actionGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  actionCard: {
    width: "48.5%",
    backgroundColor: Colors.card,
    borderRadius: 17,
    padding: 13,
    minHeight: 160,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 3,
  },

  billingCard: {
    borderTopWidth: 3,
    borderTopColor: Colors.billing,
  },

  menuCard: {
    borderTopWidth: 3,
    borderTopColor: Colors.menu,
  },

  actionIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  billingIcon: {
    backgroundColor: "#EFF6FF",
  },

  menuIcon: {
    backgroundColor: "#F0FDF4",
  },

  actionEmoji: {
    fontSize: 23,
  },

  actionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: Colors.heading,
  },

  actionDescription: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 16,
  },

  arrow: {
    position: "absolute",
    right: 12,
    bottom: 12,
    width: 27,
    height: 27,
    borderRadius: 9,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },

  arrowText: {
    fontSize: 17,
    fontWeight: "800",
    color: Colors.heading,
  },

  /* ========================= */
  /* MANAGEMENT */
  /* ========================= */

  managementCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    minHeight: 70,
    padding: 11,
    marginBottom: 9,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },

  managementIcon: {
    width: 47,
    height: 47,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 11,
  },

  managementEmoji: {
    fontSize: 23,
  },

  managementContent: {
    flex: 1,
  },

  managementTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.heading,
  },

  managementDescription: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 3,
  },

  managementArrow: {
    fontSize: 21,
    fontWeight: "700",
    color: Colors.textSecondary,
    paddingHorizontal: 6,
  },

  /* ========================= */
  /* LOGOUT */
  /* ========================= */

  logoutButton: {
    height: 48,
    borderRadius: 13,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 15,
  },

  logoutIcon: {
    fontSize: 19,
    color: Colors.logout,
    marginRight: 7,
  },

  logoutText: {
    color: Colors.logout,
    fontSize: 14,
    fontWeight: "800",
  },

  versionText: {
    textAlign: "center",
    fontSize: 10,
    color: Colors.textLight,
    marginTop: 13,
  },
});
``