import { useEffect, useState } from "react";

import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
} from "react-native";

import { supabase } from "../services/supabase";
import { Colors } from "../theme/colors";
import BackButton from "../components/BackButton";

export default function SalesDashboardScreen({ navigation }: any) {
  const [todaySales, setTodaySales] = useState(0);
  const [billCount, setBillCount] = useState(0);
  const [averageBill, setAverageBill] = useState(0);
  const [highestBill, setHighestBill] = useState(0);
  const [lowestBill, setLowestBill] = useState(0);

  const [refreshing, setRefreshing] = useState(false);

  // ==========================================
  // FETCH SALES
  // ==========================================

  async function fetchSales() {
    setRefreshing(true);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from("bills")
      .select("total_amount, created_at")
      .gte("created_at", today.toISOString());

    if (error) {
      console.log(error);
      setRefreshing(false);
      return;
    }

    if (!data || data.length === 0) {
      setTodaySales(0);
      setBillCount(0);
      setAverageBill(0);
      setHighestBill(0);
      setLowestBill(0);

      setRefreshing(false);
      return;
    }

    const totals = data.map((bill) => Number(bill.total_amount));

    const total = totals.reduce((sum, amount) => sum + amount, 0);

    setTodaySales(total);
    setBillCount(totals.length);
    setAverageBill(Math.round(total / totals.length));
    setHighestBill(Math.max(...totals));
    setLowestBill(Math.min(...totals));

    setRefreshing(false);
  }

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchSales();
  }, []);

  const today = new Date();

  // ==========================================
  // UI
  // ==========================================

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={fetchSales}
          tintColor={Colors.primary}
        />
      }
    >
      {/* ======================================
          HEADER
      ====================================== */}

      <View style={styles.header}>
        <BackButton navigation={navigation} />

        <View style={styles.headerTitleContainer}>
          <View style={styles.headerIcon}>
            <Text style={styles.headerEmoji}>📊</Text>
          </View>

          <View style={styles.headerText}>
            <Text style={styles.title}>Sales Dashboard</Text>

            <Text style={styles.subtitle}>
              Track today's restaurant performance
            </Text>
          </View>
        </View>
      </View>

      {/* ======================================
          DATE CARD
      ====================================== */}

      <View style={styles.dateCard}>
        <View style={styles.dateIcon}>
          <Text style={styles.dateEmoji}>📅</Text>
        </View>

        <View>
          <Text style={styles.dateLabel}>TODAY</Text>

          <Text style={styles.dateText}>{today.toDateString()}</Text>
        </View>

        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />

          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      {/* ======================================
          MAIN SALES CARD
      ====================================== */}

      <View style={styles.salesCard}>
        <View style={styles.salesCardTop}>
          <View>
            <Text style={styles.salesLabel}>TODAY'S SALES</Text>

            <Text style={styles.salesAmount}>₹ {todaySales}</Text>
          </View>

          <View style={styles.salesIcon}>
            <Text style={styles.salesEmoji}>💰</Text>
          </View>
        </View>

        <View style={styles.salesDivider} />

        <View style={styles.salesBottom}>
          <Text style={styles.salesBottomLabel}>
            Total revenue generated today
          </Text>

          <Text style={styles.salesBottomValue}>
            {billCount} {billCount === 1 ? "Bill" : "Bills"}
          </Text>
        </View>
      </View>

      {/* ======================================
          SECTION HEADER
      ====================================== */}

      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Sales Overview</Text>

          <Text style={styles.sectionSubtitle}>Today's billing statistics</Text>
        </View>
      </View>

      {/* ======================================
          STAT GRID
      ====================================== */}

      <View style={styles.statGrid}>
        {/* Bills */}

        <View style={styles.statCard}>
          <View style={[styles.statIcon, styles.blueIcon]}>
            <Text style={styles.statEmoji}>🧾</Text>
          </View>

          <Text style={styles.statLabel}>Bills Generated</Text>

          <Text style={styles.statValue}>{billCount}</Text>
        </View>

        {/* Average */}

        <View style={styles.statCard}>
          <View style={[styles.statIcon, styles.greenIcon]}>
            <Text style={styles.statEmoji}>📈</Text>
          </View>

          <Text style={styles.statLabel}>Average Bill</Text>

          <Text style={styles.statValue}>₹ {averageBill}</Text>
        </View>

        {/* Highest */}

        <View style={styles.statCard}>
          <View style={[styles.statIcon, styles.orangeIcon]}>
            <Text style={styles.statEmoji}>🔝</Text>
          </View>

          <Text style={styles.statLabel}>Highest Bill</Text>

          <Text style={styles.statValue}>₹ {highestBill}</Text>
        </View>

        {/* Lowest */}

        <View style={styles.statCard}>
          <View style={[styles.statIcon, styles.redIcon]}>
            <Text style={styles.statEmoji}>🔽</Text>
          </View>

          <Text style={styles.statLabel}>Lowest Bill</Text>

          <Text style={styles.statValue}>₹ {lowestBill}</Text>
        </View>
      </View>

      {/* ======================================
          EMPTY STATE
      ====================================== */}

      {billCount === 0 && (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIcon}>
            <Text style={styles.emptyEmoji}>📊</Text>
          </View>

          <Text style={styles.emptyTitle}>No Sales Yet</Text>

          <Text style={styles.emptyText}>
            No bills have been generated today. Your sales statistics will
            appear here once the first bill is created.
          </Text>
        </View>
      )}

      {/* ======================================
          FOOTER
      ====================================== */}

      <View style={styles.footer}>
        <Text style={styles.footerText}>Pull down to refresh sales data</Text>
      </View>
    </ScrollView>
  );
}

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  container: {
    padding: 16,
    paddingBottom: 40,
  },

  // ========================================
  // HEADER
  // ========================================

  header: {
    height: 72,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  headerIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: "#FFF3E6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 11,
  },

  headerEmoji: {
    fontSize: 25,
  },

  headerText: {
    alignItems: "center",
  },

  title: {
    fontSize: 23,
    fontWeight: "900",
    color: Colors.heading,
  },

  subtitle: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  // ========================================
  // DATE
  // ========================================

  dateCard: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 15,
    padding: 11,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 13,
  },

  dateIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  dateEmoji: {
    fontSize: 19,
  },

  dateLabel: {
    fontSize: 8,
    fontWeight: "900",
    color: Colors.textSecondary,
  },

  dateText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.heading,
    marginTop: 2,
  },

  liveBadge: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
  },

  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
    marginRight: 5,
  },

  liveText: {
    fontSize: 8,
    fontWeight: "900",
    color: Colors.success,
  },

  // ========================================
  // SALES CARD
  // ========================================

  salesCard: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 17,
    marginBottom: 20,
    elevation: 5,
  },

  salesCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  salesLabel: {
    color: "#F8EDE5",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.7,
  },

  salesAmount: {
    color: "#FFFFFF",
    fontSize: 31,
    fontWeight: "900",
    marginTop: 4,
  },

  salesIcon: {
    width: 53,
    height: 53,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },

  salesEmoji: {
    fontSize: 27,
  },

  salesDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginVertical: 13,
  },

  salesBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  salesBottomLabel: {
    color: "#F8EDE5",
    fontSize: 9,
  },

  salesBottomValue: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
  },

  // ========================================
  // SECTION
  // ========================================

  sectionHeader: {
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: Colors.heading,
  },

  sectionSubtitle: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  // ========================================
  // STAT GRID
  // ========================================

  statGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  statCard: {
    width: "48.3%",
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 13,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 2,
  },

  statIcon: {
    width: 35,
    height: 35,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 9,
  },

  blueIcon: {
    backgroundColor: "#DBEAFE",
  },

  greenIcon: {
    backgroundColor: "#DCFCE7",
  },

  orangeIcon: {
    backgroundColor: "#FFEDD5",
  },

  redIcon: {
    backgroundColor: "#FEE2E2",
  },

  statEmoji: {
    fontSize: 17,
  },

  statLabel: {
    fontSize: 9,
    color: Colors.textSecondary,
    fontWeight: "700",
  },

  statValue: {
    fontSize: 20,
    fontWeight: "900",
    color: Colors.heading,
    marginTop: 4,
  },

  // ========================================
  // EMPTY
  // ========================================

  emptyCard: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 25,
    marginTop: 3,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },

  emptyIcon: {
    width: 65,
    height: 65,
    borderRadius: 21,
    backgroundColor: "#FFF3E6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 11,
  },

  emptyEmoji: {
    fontSize: 30,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: Colors.heading,
  },

  emptyText: {
    textAlign: "center",
    fontSize: 10,
    lineHeight: 16,
    color: Colors.textSecondary,
    marginTop: 5,
  },

  // ========================================
  // FOOTER
  // ========================================

  footer: {
    alignItems: "center",
    marginTop: 12,
  },

  footerText: {
    fontSize: 9,
    color: Colors.textLight,
  },
});
