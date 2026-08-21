import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Linking,
  StyleSheet,
} from "react-native";

import { supabase } from "../services/supabase";
import { Colors } from "../theme/colors";
import BackButton from "../components/BackButton";

export default function BillDetailsScreen({ route, navigation }: any) {
  const { billId } = route.params;

  const [bill, setBill] = useState<any>(null);
  const [billItems, setBillItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // FETCH BILL
  // ==========================================

  async function fetchBillDetails() {
    try {
      const { data: billData, error: billError } = await supabase
        .from("bills")
        .select("*")
        .eq("id", billId)
        .single();

      if (billError) {
        console.log(billError);
        return;
      }

      setBill(billData);

      const { data: itemsData, error: itemsError } = await supabase
        .from("bill_items")
        .select("*")
        .eq("bill_id", billId);

      if (itemsError) {
        console.log(itemsError);
        return;
      }

      setBillItems(itemsData || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBillDetails();
  }, []);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <View style={styles.loadingHeader}>
          <BackButton navigation={navigation} />

          <Text style={styles.loadingHeaderTitle}>Bill Details</Text>
        </View>

        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color={Colors.primary} />

          <Text style={styles.loadingText}>Loading bill...</Text>
        </View>
      </View>
    );
  }

  // ==========================================
  // WHATSAPP
  // ==========================================

  async function shareViaWhatsApp() {
    if (!bill?.customer_mobile) {
      Alert.alert(
        "Customer Number Missing",
        "Customer mobile number is not available for this bill.",
      );
      return;
    }

    const billDate = bill?.created_at ? new Date(bill.created_at) : new Date();

    const formattedDate = billDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const formattedTime = billDate.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const totalQuantity = billItems.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0,
    );

    const invoiceItems = billItems
      .map(
        (item, index) =>
          `${index + 1}. ${item.item_name}
   ₹${Number(item.price).toFixed(2)} × ${item.quantity} = ₹${Number(
     item.subtotal,
   ).toFixed(2)}`,
      )
      .join("\n\n");

    const invoiceText = `
🍽️ *MALABAR MESS HOUSE*
📍 THIRUVAMBADY

━━━━━━━━━━━━━━━━━━━━

🧾 *RESTAURANT INVOICE*

Bill No: *#${bill.bill_number}*
Date: ${formattedDate}
Time: ${formattedTime}

━━━━━━━━━━━━━━━━━━━━

👤 *CUSTOMER*

${bill.customer_name || "Walk-In Customer"}
${bill.customer_mobile ? `📱 ${bill.customer_mobile}` : ""}

━━━━━━━━━━━━━━━━━━━━

🍴 *ORDER ITEMS*

${invoiceItems}

━━━━━━━━━━━━━━━━━━━━

📦 Total Items: *${totalQuantity}*

💰 *GRAND TOTAL: ₹${Number(bill.total_amount || 0).toFixed(2)}*

━━━━━━━━━━━━━━━━━━━━

❤️ Thank you for visiting us!

Please visit again.

*MALABAR MESS HOUSE*
*THIRUVAMBADY*
`;

    const phone = `91${bill.customer_mobile}`;

    const url =
      `https://wa.me/${phone}?text=` + encodeURIComponent(invoiceText);

    try {
      await Linking.openURL(url);

      await supabase
        .from("bills")
        .update({
          whatsapp_sent: true,
        })
        .eq("id", billId);

      setBill({
        ...bill,
        whatsapp_sent: true,
      });
    } catch (error) {
      console.log(error);

      Alert.alert("Error", "Unable to open WhatsApp.");
    }
  }

  // ==========================================
  // DELETE BILL
  // ==========================================

  function confirmDeleteBill() {
    Alert.alert(
      "Delete Bill",
      `Are you sure you want to delete Bill #${bill?.bill_number}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: deleteBill,
        },
      ],
    );
  }

  async function deleteBill() {
    const { error: itemsError } = await supabase
      .from("bill_items")
      .delete()
      .eq("bill_id", billId);

    if (itemsError) {
      Alert.alert("Error", itemsError.message);
      return;
    }

    const { error: billError } = await supabase
      .from("bills")
      .delete()
      .eq("id", billId);

    if (billError) {
      Alert.alert("Error", billError.message);
      return;
    }

    Alert.alert("Bill Deleted", "The bill has been successfully deleted.", [
      {
        text: "OK",
        onPress: () => navigation.goBack(),
      },
    ]);
  }

  // ==========================================
  // DATE / TIME
  // ==========================================

  const billDate = bill?.created_at ? new Date(bill.created_at) : new Date();

  const formattedDate = billDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formattedTime = billDate.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // ==========================================
  // TOTAL ITEMS
  // ==========================================

  const totalQuantity = billItems.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0,
  );

  // ==========================================
  // UI
  // ==========================================

  return (
    <View style={styles.screen}>
      {/* =====================================
          HEADER
      ===================================== */}

      <View style={styles.header}>
        <BackButton navigation={navigation} />

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Bill Details</Text>

          <Text style={styles.headerSubtitle}>
            Invoice #{bill?.bill_number}
          </Text>
        </View>
      </View>

      {/* =====================================
          CONTENT
      ===================================== */}

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* =====================================
            INVOICE
        ===================================== */}

        <View style={styles.invoiceCard}>
          {/* Restaurant Header */}

          <View style={styles.restaurantHeader}>
            <View style={styles.restaurantIcon}>
              <Text style={styles.restaurantIconText}>🍽️</Text>
            </View>

            <Text style={styles.restaurantName}>MALABAR MESS HOUSE</Text>

            <Text style={styles.restaurantLocation}>THIRUVAMBADY</Text>

            <View style={styles.invoiceBadge}>
              <Text style={styles.invoiceBadgeText}>RESTAURANT INVOICE</Text>
            </View>
          </View>

          {/* Invoice Information */}

          <View style={styles.invoiceInfo}>
            <View>
              <Text style={styles.smallLabel}>BILL NUMBER</Text>

              <Text style={styles.billNumber}>#{bill?.bill_number}</Text>
            </View>

            <View style={styles.dateContainer}>
              <Text style={styles.smallLabel}>DATE & TIME</Text>

              <Text style={styles.dateText}>{formattedDate}</Text>

              <Text style={styles.timeText}>{formattedTime}</Text>
            </View>
          </View>

          {/* Customer */}

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>CUSTOMER DETAILS</Text>

            <View style={styles.customerCard}>
              <View style={styles.customerIcon}>
                <Text>👤</Text>
              </View>

              <View style={styles.customerInfo}>
                <Text style={styles.customerName}>
                  {bill?.customer_name || "Walk-In Customer"}
                </Text>

                {bill?.customer_mobile ? (
                  <Text style={styles.customerMobile}>
                    {bill.customer_mobile}
                  </Text>
                ) : (
                  <Text style={styles.customerMobile}>No mobile number</Text>
                )}
              </View>

              <View
                style={[
                  styles.whatsappStatus,
                  bill?.whatsapp_sent
                    ? styles.whatsappSent
                    : styles.whatsappNotSent,
                ]}
              >
                <Text
                  style={[
                    styles.whatsappStatusText,
                    bill?.whatsapp_sent
                      ? styles.whatsappSentText
                      : styles.whatsappNotSentText,
                  ]}
                >
                  {bill?.whatsapp_sent ? "WhatsApp Sent" : "Not Sent"}
                </Text>
              </View>
            </View>
          </View>

          {/* Items */}

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>ORDER ITEMS</Text>

            {/* Table Header */}

            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.itemColumn]}>
                ITEM
              </Text>

              <Text style={[styles.tableHeaderText, styles.quantityColumn]}>
                QTY
              </Text>

              <Text style={[styles.tableHeaderText, styles.priceColumn]}>
                AMOUNT
              </Text>
            </View>

            {billItems.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.itemRow,
                  index === billItems.length - 1 && styles.lastItemRow,
                ]}
              >
                <View style={styles.itemColumn}>
                  <Text style={styles.itemName}>{item.item_name}</Text>

                  <Text style={styles.itemPrice}>
                    ₹ {Number(item.price).toFixed(2)} each
                  </Text>
                </View>

                <Text style={[styles.quantityColumn, styles.quantityText]}>
                  {item.quantity}
                </Text>

                <Text style={[styles.priceColumn, styles.subtotalText]}>
                  ₹ {Number(item.subtotal).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>

          {/* Summary */}

          <View style={styles.summarySection}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Items</Text>

              <Text style={styles.summaryValue}>{totalQuantity}</Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>GRAND TOTAL</Text>

              <Text style={styles.grandTotal}>
                ₹ {Number(bill?.total_amount || 0).toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Footer */}

          <View style={styles.invoiceFooter}>
            <Text style={styles.thankYou}>Thank you for visiting us! ❤️</Text>

            <Text style={styles.visitAgain}>Please visit again.</Text>
          </View>
        </View>

        {/* =====================================
            ACTION BUTTONS
        ===================================== */}

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            Alert.alert(
              "Send Invoice",
              "Send invoice to customer via WhatsApp?",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Send",
                  onPress: shareViaWhatsApp,
                },
              ],
            )
          }
          style={styles.whatsappButton}
        >
          <Text style={styles.whatsappIcon}>📱</Text>

          <Text style={styles.whatsappButtonText}>Share via WhatsApp</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={confirmDeleteBill}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteButtonText}>Delete Bill</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
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

  // ========================================
  // HEADER
  // ========================================

  header: {
    height: 72,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  headerTitleContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 21,
    fontWeight: "900",
    color: Colors.heading,
  },

  headerSubtitle: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  // ========================================
  // LOADING
  // ========================================

  loadingScreen: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  loadingHeader: {
    height: 72,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  loadingHeaderTitle: {
    fontSize: 21,
    fontWeight: "900",
    color: Colors.heading,
  },

  loadingContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 10,
    color: Colors.textSecondary,
    fontSize: 14,
  },

  // ========================================
  // CONTENT
  // ========================================

  content: {
    padding: 16,
    paddingBottom: 35,
  },

  // ========================================
  // INVOICE CARD
  // ========================================

  invoiceCard: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 4,

    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  // ========================================
  // RESTAURANT HEADER
  // ========================================

  restaurantHeader: {
    alignItems: "center",
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  restaurantIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#EAF7F0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  restaurantIconText: {
    fontSize: 28,
  },

  restaurantName: {
    fontSize: 21,
    fontWeight: "900",
    color: Colors.heading,
    textAlign: "center",
  },

  restaurantLocation: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginTop: 3,
    letterSpacing: 1,
  },

  invoiceBadge: {
    backgroundColor: "#EAF7F0",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginTop: 9,
  },

  invoiceBadgeText: {
    color: Colors.primary,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.7,
  },

  // ========================================
  // BILL INFO
  // ========================================

  invoiceInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  smallLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: Colors.textSecondary,
    letterSpacing: 0.6,
  },

  billNumber: {
    fontSize: 18,
    fontWeight: "900",
    color: Colors.heading,
    marginTop: 3,
  },

  dateContainer: {
    alignItems: "flex-end",
  },

  dateText: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.heading,
    marginTop: 3,
  },

  timeText: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  // ========================================
  // SECTIONS
  // ========================================

  section: {
    marginTop: 16,
  },

  sectionLabel: {
    fontSize: 10,
    fontWeight: "900",
    color: Colors.textSecondary,
    letterSpacing: 0.7,
    marginBottom: 8,
  },

  // ========================================
  // CUSTOMER
  // ========================================

  customerCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 11,
    flexDirection: "row",
    alignItems: "center",
  },

  customerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EAF7F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 9,
  },

  customerInfo: {
    flex: 1,
  },

  customerName: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.heading,
  },

  customerMobile: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 3,
  },

  whatsappStatus: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },

  whatsappSent: {
    backgroundColor: "#DCFCE7",
  },

  whatsappNotSent: {
    backgroundColor: "#F3F4F6",
  },

  whatsappStatusText: {
    fontSize: 9,
    fontWeight: "800",
  },

  whatsappSentText: {
    color: "#15803D",
  },

  whatsappNotSentText: {
    color: Colors.textSecondary,
  },

  // ========================================
  // ITEM TABLE
  // ========================================

  tableHeader: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
  },

  tableHeaderText: {
    fontSize: 9,
    fontWeight: "900",
    color: Colors.textSecondary,
  },

  itemColumn: {
    flex: 1,
  },

  quantityColumn: {
    width: 45,
    textAlign: "center",
  },

  priceColumn: {
    width: 82,
    textAlign: "right",
  },

  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 11,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  lastItemRow: {
    borderBottomWidth: 0,
  },

  itemName: {
    fontSize: 13,
    fontWeight: "800",
    color: Colors.heading,
  },

  itemPrice: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 3,
  },

  quantityText: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.heading,
  },

  subtotalText: {
    fontSize: 13,
    fontWeight: "800",
    color: Colors.heading,
  },

  // ========================================
  // SUMMARY
  // ========================================

  summarySection: {
    marginTop: 15,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  summaryLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: "600",
  },

  summaryValue: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.heading,
  },

  summaryDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 10,
  },

  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  grandTotalLabel: {
    fontSize: 14,
    fontWeight: "900",
    color: Colors.heading,
  },

  grandTotal: {
    fontSize: 25,
    fontWeight: "900",
    color: Colors.primary,
  },

  // ========================================
  // INVOICE FOOTER
  // ========================================

  invoiceFooter: {
    alignItems: "center",
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },

  thankYou: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.heading,
  },

  visitAgain: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 4,
  },

  // ========================================
  // ACTION BUTTONS
  // ========================================

  whatsappButton: {
    height: 50,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    marginTop: 14,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    elevation: 3,
  },

  whatsappIcon: {
    fontSize: 17,
    marginRight: 7,
  },

  whatsappButtonText: {
    color: Colors.buttonText,
    fontSize: 15,
    fontWeight: "800",
  },

  deleteButton: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.danger,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  deleteButtonText: {
    color: Colors.danger,
    fontSize: 14,
    fontWeight: "800",
  },
});
