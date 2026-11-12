import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { THEME } from "../../constants/theme";
import { ScreenHeader } from "../../components/common/ScreenHeader";

export default function PrivacyPolicyScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScreenHeader title="Privacy Policy" subtitle="Data Protection & GPS Tracking Policy" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.heading}>1. Information We Collect</Text>
          <Text style={styles.body}>
            DIESEL Life collects contact information (name, email, phone number), commercial fleet/asset data (vehicle registration, fuel tank size), and location coordinates required to accurately guide mobile bowsers to your drop site.
          </Text>

          <Text style={styles.heading}>2. GPS & Precise Location Usage</Text>
          <Text style={styles.body}>
            Precise GPS location is collected strictly when requesting or tracking a diesel delivery. Location coordinates are shared only with the assigned Bowser driver during transit and are never sold or shared with non-logistics third parties.
          </Text>

          <Text style={styles.heading}>3. Billing & Payment Security</Text>
          <Text style={styles.body}>
            Payment transactions, wallet balances, and invoices comply with RBI regulations and PCI-DSS standards. We do not store raw card numbers on our local databases.
          </Text>

          <Text style={styles.heading}>4. Data Deletion</Text>
          <Text style={styles.body}>
            You may request complete account deletion from the Account Actions tab at any time, permanently deleting your profile and delivery coordinates.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    gap: 12,
  },
  heading: {
    fontSize: 14,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
    marginTop: 6,
  },
  body: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    lineHeight: 20,
  },
});
