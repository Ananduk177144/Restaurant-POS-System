import { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";

import { supabase } from "../services/supabase";
import { Colors } from "../theme/colors";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert("Login", "Please enter your email address.");
      return;
    }

    if (!password.trim()) {
      Alert.alert("Login", "Please enter your password.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      Alert.alert("Login Failed", error.message);
      return;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        {/* ========================= */}
        {/* BRAND HEADER */}
        {/* ========================= */}

        <View style={styles.brandSection}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoEmoji}>🍽️</Text>
          </View>

          <Text style={styles.brandName}>Restaurant POS</Text>

          <Text style={styles.brandSubtitle}>Point of Sale System</Text>
        </View>

        {/* ========================= */}
        {/* LOGIN CARD */}
        {/* ========================= */}

        <View style={styles.loginCard}>
          <Text style={styles.welcomeTitle}>Welcome Back</Text>

          <Text style={styles.welcomeSubtitle}>
            Sign in to manage your restaurant
          </Text>

          {/* ========================= */}
          {/* EMAIL */}
          {/* ========================= */}

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>✉️</Text>

              <TextInput
                placeholder="Enter your email"
                placeholderTextColor={Colors.textLight}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                style={styles.input}
              />
            </View>
          </View>

          {/* ========================= */}
          {/* PASSWORD */}
          {/* ========================= */}

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>🔒</Text>

              <TextInput
                placeholder="Enter your password"
                placeholderTextColor={Colors.textLight}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                style={styles.input}
              />
            </View>
          </View>

          {/* ========================= */}
          {/* LOGIN BUTTON */}
          {/* ========================= */}

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleLogin}
            disabled={loading}
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
          >
            {loading ? (
              <View style={styles.loadingContent}>
                <ActivityIndicator size="small" color="#FFFFFF" />

                <Text style={styles.loginButtonText}>Signing In...</Text>
              </View>
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          {/* ========================= */}
          {/* SECURITY MESSAGE */}
          {/* ========================= */}

          <View style={styles.securityContainer}>
            <Text style={styles.securityIcon}>🔐</Text>

            <Text style={styles.securityText}>
              Your account is securely protected
            </Text>
          </View>
        </View>

        {/* ========================= */}
        {/* FOOTER */}
        {/* ========================= */}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Restaurant POS System</Text>

          <Text style={styles.footerVersion}>Version 1.0.0</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

/* ================================= */
/* STYLES */
/* ================================= */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  /* ========================= */
  /* BRAND */
  /* ========================= */

  brandSection: {
    alignItems: "center",
    marginBottom: 25,
  },

  logoContainer: {
    width: 82,
    height: 82,
    borderRadius: 27,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    elevation: 6,
  },

  logoEmoji: {
    fontSize: 43,
  },

  brandName: {
    fontSize: 27,
    fontWeight: "900",
    color: Colors.heading,
  },

  brandSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 3,
  },

  /* ========================= */
  /* LOGIN CARD */
  /* ========================= */

  loginCard: {
    backgroundColor: Colors.card,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 5,
  },

  welcomeTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: Colors.heading,
  },

  welcomeSubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: 20,
  },

  /* ========================= */
  /* INPUT */
  /* ========================= */

  inputGroup: {
    marginBottom: 14,
  },

  inputLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: Colors.heading,
    marginBottom: 6,
  },

  inputContainer: {
    height: 50,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },

  inputIcon: {
    fontSize: 17,
    marginRight: 9,
  },

  input: {
    flex: 1,
    height: "100%",
    fontSize: 13,
    color: Colors.heading,
  },

  /* ========================= */
  /* LOGIN BUTTON */
  /* ========================= */

  loginButton: {
    height: 52,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    elevation: 3,
  },

  loginButtonDisabled: {
    opacity: 0.7,
  },

  loginButtonText: {
    color: Colors.buttonText,
    fontSize: 16,
    fontWeight: "900",
  },

  loadingContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  /* ========================= */
  /* SECURITY */
  /* ========================= */

  securityContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },

  securityIcon: {
    fontSize: 12,
    marginRight: 5,
  },

  securityText: {
    fontSize: 9,
    color: Colors.textSecondary,
  },

  /* ========================= */
  /* FOOTER */
  /* ========================= */

  footer: {
    alignItems: "center",
    marginTop: 22,
  },

  footerText: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.textSecondary,
  },

  footerVersion: {
    fontSize: 9,
    color: Colors.textLight,
    marginTop: 3,
  },
});
