import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { THEME } from "../../constants/theme";
import { ScreenHeader } from "../../components/common/ScreenHeader";

export default function AboutScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScreenHeader title="About DIESEL Life" subtitle="India's Smart Fuel Logistics Network" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroCard}>
          <View style={styles.brandBadge}>
            <MaterialCommunityIcons name="gas-station" size={32} color="#FFFFFF" />
          </View>
          <Text style={styles.heroTitle}>DIESEL Life</Text>
          <Text style={styles.heroTagline}>Pure Power, Directly Delivered</Text>
          <Text style={styles.heroDesc}>
            DIESEL Life is an on-demand doorstep diesel delivery service revolutionizing industrial, commercial, and agricultural fuel management.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Why Diesel Life?</Text>

          <View style={styles.featureRow}>
            <MaterialCommunityIcons name="check-decagram" size={20} color={THEME.colors.secondary} />
            <View style={styles.featureCol}>
              <Text style={styles.featureHeading}>100% PESO Certified</Text>
              <Text style={styles.featureText}>
                Fabricated to strict PESO guidelines with spark arrestors, auto shut-off, and vapor recovery nozzles.
              </Text>
            </View>
          </View>

          <View style={styles.featureRow}>
            <MaterialCommunityIcons name="counter" size={20} color={THEME.colors.primary} />
            <View style={styles.featureCol}>
              <Text style={styles.featureHeading}>Zero Pilferage Smart Metering</Text>
              <Text style={styles.featureText}>
                Weights & Measures calibrated flow meters with digital invoices generated right at your nozzle.
              </Text>
            </View>
          </View>

          <View style={styles.featureRow}>
            <MaterialCommunityIcons name="shield-check" size={20} color={THEME.colors.accent} />
            <View style={styles.featureCol}>
              <Text style={styles.featureHeading}>Quality & Density Guaranteed</Text>
              <Text style={styles.featureText}>
                Hydrometer density checks performed in front of you before dispensing to ensure BS-VI standards.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footerInfo}>
          <Text style={styles.versionText}>Diesel Life App v2.4.0 (Build 580)</Text>
          <Text style={styles.copyrightText}>© 2026 DIESEL Life Technologies Private Limited. All Rights Reserved.</Text>
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
    gap: 16,
  },
  heroCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.lg,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  brandBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: THEME.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: THEME.colors.textPrimary,
  },
  heroTagline: {
    fontSize: 13,
    color: THEME.colors.primary,
    fontWeight: "700",
    marginTop: 2,
  },
  heroDesc: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    textAlign: "center",
    marginTop: 12,
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    gap: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
    marginBottom: 4,
  },
  featureRow: {
    flexDirection: "row",
    gap: 12,
  },
  featureCol: {
    flex: 1,
  },
  featureHeading: {
    fontSize: 14,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
  },
  featureText: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    marginTop: 2,
    lineHeight: 18,
  },
  footerInfo: {
    alignItems: "center",
    paddingVertical: 12,
  },
  versionText: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.colors.textSecondary,
  },
  copyrightText: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    textAlign: "center",
    marginTop: 4,
  },
});
