import { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";

import { supabase } from "../services/supabase";
import { Colors } from "../theme/colors";
import BackButton from "../components/BackButton";

export default function BillHistoryScreen({ navigation }: any) {
  const [bills, setBills] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchBills() {
    setRefreshing(true);

    const { data, error } = await supabase
      .from("bills")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.log(error);
      setRefreshing(false);
      return;
    }

    setBills(data || []);
    setRefreshing(false);
  }

  useFocusEffect(
    useCallback(() => {
      fetchBills();
    }, []),
  );

  function formatDate(dateString: string) {
    if (!dateString) return "Date unavailable";

    const date = new Date(dateString);

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function formatTime(dateString: string) {
    if (!dateString) return "";

    const date = new Date(dateString);

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <View style={styles.container}>
      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <View style={styles.header}>
        {/* Back Button */}
        <View style={styles.backButtonContainer}>
          <BackButton navigation={navigation} />
        </View>

        {/* Centered Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleIcon}>🧾</Text>

          <View>
            <Text style={styles.title}>Bill History</Text>

            <Text style={styles.subtitle}>
              View and manage your previous bills
            </Text>
          </View>
        </View>

        {/* Bill Count */}
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{bills.length}</Text>
        </View>
      </View>

      {/* ========================= */}
      {/* BILL LIST */}
      {/* ========================= */}

      <FlatList
        data={bills}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchBills} />
        }
        contentContainerStyle={[
          styles.listContent,
          bills.length === 0 && styles.emptyList,
        ]}
        renderItem={({ item }) => (
          <View style={styles.billCard}>
            {/* ========================= */}
            {/* TOP SECTION */}
            {/* ========================= */}

            <View style={styles.cardTop}>
              <View style={styles.billIcon}>
                <Text style={styles.billIconText}>🧾</Text>
              </View>

              <View style={styles.billInfo}>
                <Text style={styles.billNumber}>Bill #{item.bill_number}</Text>

                <Text style={styles.dateText}>
                  {formatDate(item.created_at)}
                  {item.created_at ? ` • ${formatTime(item.created_at)}` : ""}
                </Text>
              </View>

              <View style={styles.amountContainer}>
                <Text style={styles.amountLabel}>TOTAL</Text>

                <Text style={styles.amount}>
                  ₹ {Number(item.total_amount).toFixed(2)}
                </Text>
              </View>
            </View>

            {/* ========================= */}
            {/* CUSTOMER */}
            {/* ========================= */}

            <View style={styles.customerSection}>
              <Text style={styles.customerLabel}>CUSTOMER</Text>

              <Text style={styles.customerName}>
                {item.customer_name || "Walk-In Customer"}
              </Text>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* ========================= */}
            {/* VIEW DETAILS */}
            {/* ========================= */}

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate("BillDetails", {
                  billId: item.id,
                })
              }
              style={styles.viewButton}
            >
              <Text style={styles.viewButtonIcon}>📄</Text>

              <Text style={styles.viewButtonText}>View Bill Details</Text>

              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Text style={styles.emptyIconText}>🧾</Text>
            </View>

            <Text style={styles.emptyTitle}>No Bills Found</Text>

            <Text style={styles.emptySubtitle}>
              Generate your first bill to see your billing history here.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  /* ========================= */
  /* HEADER */
  /* ========================= */

  header: {
    height: 82,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
  },

  backButtonContainer: {
    position: "absolute",
    left: 18,
    top: 20,
    zIndex: 10,
  },

  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "70%",
  },

  titleIcon: {
    fontSize: 23,
    marginRight: 8,
  },

  title: {
    fontSize: 21,
    fontWeight: "900",
    color: Colors.heading,
  },

  subtitle: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  countBadge: {
    position: "absolute",
    right: 18,
    top: 23,
    minWidth: 36,
    height: 36,
    paddingHorizontal: 9,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  countText: {
    color: Colors.buttonText,
    fontSize: 13,
    fontWeight: "800",
  },

  /* ========================= */
  /* LIST */
  /* ========================= */

  listContent: {
    paddingHorizontal: 18,
    paddingBottom: 35,
  },

  emptyList: {
    flexGrow: 1,
  },

  /* ========================= */
  /* BILL CARD */
  /* ========================= */

  billCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 15,
    marginBottom: 14,

    borderWidth: 1,
    borderColor: Colors.border,

    elevation: 3,

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  cardTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  billIcon: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: "#EAF7F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 11,
  },

  billIconText: {
    fontSize: 22,
  },

  billInfo: {
    flex: 1,
  },

  billNumber: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.heading,
  },

  dateText: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 4,
  },

  amountContainer: {
    alignItems: "flex-end",
    marginLeft: 8,
  },

  amountLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },

  amount: {
    fontSize: 17,
    fontWeight: "900",
    color: Colors.primary,
    marginTop: 2,
  },

  /* ========================= */
  /* CUSTOMER */
  /* ========================= */

  customerSection: {
    marginTop: 14,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 10,
  },

  customerLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: Colors.textSecondary,
    letterSpacing: 0.6,
  },

  customerName: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.heading,
    marginTop: 3,
  },

  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },

  /* ========================= */
  /* VIEW BUTTON */
  /* ========================= */

  viewButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minHeight: 42,
    paddingHorizontal: 12,
  },

  viewButtonIcon: {
    fontSize: 15,
    marginRight: 7,
  },

  viewButtonText: {
    flex: 1,
    color: Colors.buttonText,
    fontSize: 14,
    fontWeight: "800",
  },

  arrow: {
    color: Colors.buttonText,
    fontSize: 25,
    fontWeight: "300",
    lineHeight: 25,
  },

  /* ========================= */
  /* EMPTY STATE */
  /* ========================= */

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 35,
  },

  emptyIcon: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "#EAF7F0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },

  emptyIconText: {
    fontSize: 38,
  },

  emptyTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: Colors.heading,
  },

  emptySubtitle: {
    textAlign: "center",
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
    marginTop: 7,
  },
});
