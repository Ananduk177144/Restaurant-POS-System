import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";

import LoginScreen from "../screens/LoginScreen";
import DashboardScreen from "../screens/DashboardScreen";
import MenuManagementScreen from "../screens/MenuManagementScreen";
import MenuItemsScreen from "../screens/MenuItemsScreen";
import BillingScreenV2 from "../screens/BillingScreenV2";
import BillHistoryScreen from "../screens/BillHistoryScreen";
import BillDetailsScreen from "../screens/BillDetailsScreen";
import SalesDashboardScreen from "../screens/SalesDashboardScreen";
import MenuCategoriesScreen from "../screens/MenuCategoriesScreen";
import MenuItemsViewScreen from "../screens/MenuItemsViewScreen";

import { supabase } from "../services/supabase";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [session, setSession] = useState<any>(undefined);

  useEffect(() => {
    async function checkSession() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        setSession(session);
      } catch (error) {
        console.log("Supabase error:", error);
        setSession(null);
      }
    }

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {session ? (
          <>
            <Stack.Screen name="Dashboard" component={DashboardScreen} />

            <Stack.Screen
              name="MenuManagement"
              component={MenuManagementScreen}
            />

            <Stack.Screen name="MenuItems" component={MenuItemsScreen} />

            <Stack.Screen name="Billing" component={BillingScreenV2} />

            <Stack.Screen name="BillHistory" component={BillHistoryScreen} />

            <Stack.Screen name="BillDetails" component={BillDetailsScreen} />

            <Stack.Screen
              name="SalesDashboard"
              component={SalesDashboardScreen}
            />

            <Stack.Screen
              name="MenuCategories"
              component={MenuCategoriesScreen}
            />

            <Stack.Screen
              name="MenuItemsView"
              component={MenuItemsViewScreen}
            />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
