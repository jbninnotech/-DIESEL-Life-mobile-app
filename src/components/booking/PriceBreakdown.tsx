import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { THEME } from "../../constants/theme";
import { PriceBreakdownResult } from "../../types/booking.types";

interface PriceBreakdownProps {
  breakdown: PriceBreakdownResult;
}

export const PriceBreakdown: React.FC<PriceBreakdownProps> = ({ breakdown }) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <MaterialCommunityIcons name="receipt-text-outline" size={18} color={THEME.colors.primary} />
        <Text style={styles.cardTitle}>Live Dynamic Fuel Pricing</Text>
      </View>

      <View style={styles.lineItem}>
        <Text style={styles.label}>
          Diesel Subtotal ({breakdown.quantityLiters}L × ₹{breakdown.ratePerLiter.toFixed(2)}/L)
        </Text>
        <Text style={styles.value}>
          ₹{breakdown.dieselSubtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </Text>
      </View>

      <View style={styles.lineItem}>
        <Text style={styles.label}>Bowser Dispatch & Delivery Fee</Text>
        <Text
          style={[
            styles.value,
            breakdown.deliveryCharges === 0 && { color: THEME.colors.secondaryDark },
          ]}
        >
          {breakdown.deliveryCharges === 0
            ? "FREE (Bulk Waived)"
            : `₹${breakdown.deliveryCharges.toFixed(2)}`}
        </Text>
      </View>

      {breakdown.discountAmount > 0 && (
        <View style={styles.lineItem}>
          <Text style={[styles.label, { color: THEME.colors.secondaryDark }]}>
            Bulk Tier Discount Applied
          </Text>
          <Text style={[styles.value, { color: THEME.colors.secondaryDark }]}>
            - ₹{breakdown.discountAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </Text>
        </View>
      )}

      <View style={styles.lineItem}>
        <Text style={styles.label}>Taxes (GST & Regulatory Cess)</Text>
        <Text style={styles.value}>Included in Base Tariff</Text>
      </View>

      <View style={styles.divider} />

      <View style={[styles.lineItem, styles.totalRow]}>
        <View>
          <Text style={styles.totalLabel}>Estimated Total</Text>
          <Text style={styles.totalSub}>Inclusive of doorstep automated dispensing</Text>
        </View>
        <Text style={styles.totalValue}>
          ₹{breakdown.finalTotalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.lg,
    padding: 16,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
  },
  lineItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    fontWeight: "600",
  },
  value: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: THEME.colors.borderLight,
    marginVertical: 10,
  },
  totalRow: {
    marginBottom: 0,
    alignItems: "flex-end",
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
  },
  totalSub: {
    fontSize: 10,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "800",
    color: THEME.colors.primary,
  },
});
