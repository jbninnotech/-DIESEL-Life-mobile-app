import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { THEME } from "../../constants/theme";
import { CompleteOrderData } from "../../types/orderWorkflow.types";

interface Props {
  order: CompleteOrderData;
}

export const FlowOrderSummaryCard: React.FC<Props> = ({ order }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Order & Site Summary</Text>

      {/* Site address */}
      <View style={styles.addressBox}>
        <MaterialCommunityIcons name="map-marker-radius" size={20} color={THEME.colors.primary} />
        <View style={{ flex: 1 }}>
          <Text style={styles.addressTitle}>
            {order.deliveryAddress.fullName} ({order.deliveryAddress.phone})
          </Text>
          <Text style={styles.addressText}>
            {order.deliveryAddress.buildingNumber}, {order.deliveryAddress.streetName},{" "}
            {order.deliveryAddress.area}, {order.deliveryAddress.city} - {order.deliveryAddress.pinCode}
          </Text>
          {order.deliveryAddress.deliveryInstructions ? (
            <Text style={styles.instText}>
              Note: {order.deliveryAddress.deliveryInstructions}
            </Text>
          ) : null}
        </View>
      </View>

      {/* Bill summary table */}
      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={styles.label}>Order Number</Text>
          <Text style={styles.val}>{order.orderId}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Fuel Supplier</Text>
          <Text style={styles.val}>{order.supplier.name}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Diesel Quantity</Text>
          <Text style={styles.val}>{order.quantityLitres} Litres</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Base Price / Litre</Text>
          <Text style={styles.val}>₹{order.pricePerLitre.toFixed(2)}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Delivery Charges</Text>
          <Text style={[styles.val, { color: "#16A34A" }]}>FREE</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Payment Mode</Text>
          <Text style={styles.val}>
            {order.paymentMethod.toUpperCase()} ({order.paymentStatus})
          </Text>
        </View>

        <View style={[styles.row, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total Invoiced (Demo)</Text>
          <Text style={styles.totalVal}>
            ₹{Math.round(order.priceBreakdown.finalTotalAmount).toLocaleString("en-IN")}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 20,
  },
  heading: {
    fontSize: 15,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
    marginBottom: 12,
  },
  addressBox: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 14,
  },
  addressTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
  },
  addressText: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  instText: {
    fontSize: 11,
    color: THEME.colors.primary,
    marginTop: 4,
    fontStyle: "italic",
  },
  table: {
    gap: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
  },
  val: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
  },
  totalRow: {
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: "#E2E8F0",
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
  },
  totalVal: {
    fontSize: 15,
    fontWeight: "900",
    color: THEME.colors.primary,
  },
});
