import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { THEME } from "../../constants/theme";
import {
  DieselBookingFormValues,
  PriceBreakdownResult,
} from "../../types/booking.types";

interface BookingSummaryProps {
  formValues: DieselBookingFormValues;
  priceBreakdown: PriceBreakdownResult;
  onEditSection: (sectionKey: string) => void;
}

export const BookingSummary: React.FC<BookingSummaryProps> = ({
  formValues,
  priceBreakdown,
  onEditSection,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Booking Verification & Summary</Text>
        <Text style={styles.badge}>READY TO DISPATCH</Text>
      </View>

      {/* Location */}
      <View style={styles.row}>
        <MaterialCommunityIcons name="map-marker-radius" size={20} color={THEME.colors.primary} />
        <View style={styles.contentWrap}>
          <Text style={styles.fieldLabel}>Delivery Location</Text>
          <Text style={styles.fieldVal} numberOfLines={2}>
            {formValues.deliveryAddress || "Address not provided"}
          </Text>
          <Text style={styles.subDetail}>
            {formValues.city} • PIN: {formValues.postalCode}
          </Text>
        </View>
        <TouchableOpacity onPress={() => onEditSection("location")} style={styles.editBtn}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      {/* Fuel & Asset */}
      <View style={styles.row}>
        <MaterialCommunityIcons name="gas-station" size={20} color={THEME.colors.primary} />
        <View style={styles.contentWrap}>
          <Text style={styles.fieldLabel}>Diesel Fuel & Asset</Text>
          <Text style={styles.fieldVal}>
            {formValues.litres} Litres (High-Speed Diesel)
          </Text>
          <Text style={styles.subDetail}>
            Asset: {formValues.vehicleCategory}
            {formValues.vehicleNumber ? ` (${formValues.vehicleNumber})` : ""}
          </Text>
        </View>
        <TouchableOpacity onPress={() => onEditSection("quantity")} style={styles.editBtn}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      {/* Schedule */}
      <View style={styles.row}>
        <MaterialCommunityIcons name="clock-outline" size={20} color={THEME.colors.primary} />
        <View style={styles.contentWrap}>
          <Text style={styles.fieldLabel}>Dispatch Timing</Text>
          <Text style={styles.fieldVal}>
            {formValues.scheduleType === "now"
              ? "Deliver Immediately (Express)"
              : `Scheduled: ${formValues.deliveryDate}`}
          </Text>
          {formValues.scheduleType === "scheduled" && formValues.deliverySlotId && (
            <Text style={styles.subDetail}>Slot: {formValues.deliverySlotId}</Text>
          )}
        </View>
        <TouchableOpacity onPress={() => onEditSection("schedule")} style={styles.editBtn}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      {/* Payment & Total */}
      <View style={styles.row}>
        <MaterialCommunityIcons name="shield-check" size={20} color={THEME.colors.secondary} />
        <View style={styles.contentWrap}>
          <Text style={styles.fieldLabel}>Payment & Bill Total</Text>
          <Text style={styles.totalAmount}>
            ₹{priceBreakdown.finalTotalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </Text>
          <Text style={styles.subDetail}>
            Method: {formValues.paymentMethod.toUpperCase()} • Rate: ₹
            {priceBreakdown.ratePerLiter.toFixed(2)}/L
          </Text>
        </View>
        <TouchableOpacity onPress={() => onEditSection("payment")} style={styles.editBtn}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
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
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  title: {
    fontSize: 14,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
  },
  badge: {
    fontSize: 10,
    fontWeight: "800",
    color: THEME.colors.secondaryDark,
    backgroundColor: THEME.colors.secondaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  contentWrap: {
    flex: 1,
    marginLeft: 10,
    marginRight: 8,
  },
  fieldLabel: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  fieldVal: {
    fontSize: 13,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
    marginTop: 2,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: "800",
    color: THEME.colors.primary,
    marginTop: 2,
  },
  subDetail: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  editBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: THEME.colors.borderLight,
    borderRadius: THEME.radius.xs,
  },
  editText: {
    fontSize: 11,
    fontWeight: "700",
    color: THEME.colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: THEME.colors.borderLight,
    marginVertical: 12,
  },
});
