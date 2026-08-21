import React from "react";

import { View, StyleSheet } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import BillingHeader from "../components/billing/BillingHeader";
import CategoryTabs from "../components/billing/CategoryTabs";
import MenuGrid from "../components/billing/MenuGrid";
import CartBottomSheet from "../components/billing/CartBottomSheet";
import LoadingOverlay from "../components/billing/LoadingOverlay";

import { Colors } from "../theme/colors";

import useBilling from "../hooks/useBilling";



export default function BillingScreenV2({ navigation }: any) {
  const {
    categories,
    menuItems,
    cart,

    loading,

    customerName,
    customerMobile,

    sendWhatsApp,

    searchText,
    selectedCategory,

    totalAmount,

    setCustomerName,
    setCustomerMobile,

    setSendWhatsApp,

    setSearchText,
    setSelectedCategory,

    addToCart,

    increaseQuantity,
    decreaseQuantity,

    clearCart,

    generateBill,
  } = useBilling();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <BillingHeader
        navigation={navigation}
        sendWhatsApp={sendWhatsApp}
        setSendWhatsApp={setSendWhatsApp}
        customerName={customerName}
        setCustomerName={setCustomerName}
        customerMobile={customerMobile}
        setCustomerMobile={setCustomerMobile}
        searchText={searchText}
        setSearchText={setSearchText}
      />

      {/* Categories */}
      <CategoryTabs
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Menu */}
      <View style={styles.menuContainer}>
        <MenuGrid
          menuItems={menuItems}
          searchText={searchText}
          selectedCategory={selectedCategory}
          cart={cart}
          addToCart={addToCart}
        />
      </View>

      {/* Cart */}
      <CartBottomSheet
        cart={cart}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        clearCart={clearCart}
        totalAmount={totalAmount}
        loading={loading}
        generateBill={generateBill}
      />

      {/* Loading */}
      <LoadingOverlay visible={loading} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  menuContainer: {
    flex: 1,
  },
});
