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

export default function TermsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScreenHeader title="Terms & Conditions" subtitle="Fuel Dispensing Protocols & Agreements" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.heading}>1. PESO Safety Protocol</Text>
          <Text style={styles.body}>
            Delivery of High-Speed Diesel (HSD) is carried out in compliant mobile bowsers equipped with certified dispensing meters, emergency shut-offs, and flame arrestors. Fueling into unapproved open containers or loose bottles is strictly prohibited.
          </Text>

          <Text style={styles.heading}>2. Customer Gate & Access Responsibility</Text>
          <Text style={styles.body}>
            The customer is responsible for ensuring clear physical road access and gate clearance for a minimum 4-wheel commercial fuel bowser to reach the designated delivery coordinates.
          </Text>

          <Text style={styles.heading}>3. Pricing & Dynamic OMC Revisions</Text>
          <Text style={styles.body}>
            Fuel rates are tied to OMC (Oil Marketing Companies) daily price declarations for the respective city depot. Final invoice reflects the live rate at order confirmation.
          </Text>

          <Text style={styles.heading}>4. Cancellation & Flow Metering</Text>
          <Text style={styles.body}>
            Orders can be cancelled free of charge prior to bowser departure. Once dispatched, a nominal logistics dispatch fee may apply. Total volume dispensed is digitally verified and logged via certified micro-motion flow meters.
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
