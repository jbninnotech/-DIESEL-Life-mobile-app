import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { THEME } from "../../constants/theme";
import { CompleteOrderData } from "../../types/orderWorkflow.types";

interface Props {
  order: CompleteOrderData;
  onTrackOrder: () => void;
  onDone: () => void;
}

export const FlowPaymentSuccessCard: React.FC<Props> = ({ order, onTrackOrder, onDone }) => {
  return (
    <View style={styles.card}>
      <View style={styles.successIconCircle}>
        <MaterialCommunityIcons name="check-bold" size={36} color="#FFFFFF" />
      </View>

      <Text style={styles.title}>Diesel Booking Confirmed!</Text>
      <Text style={styles.orderNumber}>Booking ID: {order.orderId}</Text>
      <View style={styles.demoTag}>
        <Text style={styles.demoTagText}>DEMO TRANSACTION CONFIRMED</Text>
      </View>

      <Text style={styles.message}>
        Your order for {order.quantityLitres} Litres of certified diesel has been routed to{" "}
        {order.supplier.name}.
      </Text>

      {/* Details Box */}
      <View style={styles.detailsBox}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Payment Mode</Text>
          <Text style={styles.detailVal}>
            {order.paymentMethod.toUpperCase()} (Demo Paid)
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Delivery Site</Text>
          <Text style={styles.detailVal} numberOfLines={1}>
            {order.deliveryAddress.buildingNumber}, {order.deliveryAddress.city}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Assigned Bowser</Text>
          <Text style={styles.detailVal}>{order.tracking.partner.vehicleRegistration}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Total Amount</Text>
          <Text style={[styles.detailVal, { color: "#059669", fontWeight: "900" }]}>
            ₹{Math.round(order.priceBreakdown.finalTotalAmount).toLocaleString("en-IN")}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.trackBtn} onPress={onTrackOrder} activeOpacity={0.8}>
          <MaterialCommunityIcons name="radar" size={20} color="#FFFFFF" />
          <Text style={styles.trackBtnText}>Open Live Tracking</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.doneBtn} onPress={onDone} activeOpacity={0.8}>
          <Text style={styles.doneBtnText}>Return to Bookings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
    alignItems: "center",
    marginBottom: 16,
  },
  successIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#16A34A",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
    color: THEME.colors.textPrimary,
    textAlign: "center",
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: "800",
    color: THEME.colors.primary,
    marginTop: 4,
  },
  demoTag: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 6,
  },
  demoTagText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#166534",
  },
  message: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 18,
  },
  detailsBox: {
    width: "100%",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 14,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailLabel: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
  },
  detailVal: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
  },
  actions: {
    width: "100%",
    gap: 10,
  },
  trackBtn: {
    backgroundColor: THEME.colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  trackBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  doneBtn: {
    backgroundColor: "#F1F5F9",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  doneBtnText: {
    color: THEME.colors.textSecondary,
    fontSize: 13,
    fontWeight: "700",
  },
});
