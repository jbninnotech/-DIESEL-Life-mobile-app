import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { THEME } from "../../constants/theme";
import { PriceBreakdownResult } from "../../types/booking.types";
import {
  DeliveryAddressData,
  DeliveryScheduleSelection,
  FuelSupplier,
} from "../../types/orderWorkflow.types";

interface Props {
  supplier: FuelSupplier | null;
  quantityLitres: number;
  priceBreakdown: PriceBreakdownResult;
  address: DeliveryAddressData;
  schedule: DeliveryScheduleSelection;
  paymentMethod: "upi" | "card" | "netbanking" | "wallet" | "cod";
  onSelectPaymentMethod: (method: "upi" | "card" | "netbanking" | "wallet" | "cod") => void;
  onPaySuccess: () => void;
}

const PAYMENT_OPTIONS = [
  {
    id: "upi",
    title: "Instant UPI (GPay, PhonePe, Paytm)",
    icon: "qrcode-scan",
    tag: "Instant Confirm",
  },
  {
    id: "card",
    title: "Credit / Debit Card",
    icon: "credit-card-outline",
    tag: "Visa / Master",
  },
  {
    id: "wallet",
    title: "Diesel Life Prepaid Balance",
    icon: "wallet-outline",
    tag: "₹14,850 Avail",
  },
  {
    id: "netbanking",
    title: "Net Banking (All Indian Banks)",
    icon: "bank-outline",
    tag: "Direct NEFT/RTGS",
  },
  {
    id: "cod",
    title: "Pay On Delivery / Inspection",
    icon: "cash",
    tag: "Driver Verified",
  },
];

export const FlowPaymentCard: React.FC<Props> = ({
  supplier,
  quantityLitres,
  priceBreakdown,
  address,
  schedule,
  paymentMethod,
  onSelectPaymentMethod,
  onPaySuccess,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayNow = async () => {
    setIsProcessing(true);
    // DEMO PAYMENT SIMULATION
    setTimeout(() => {
      setIsProcessing(false);
      onPaySuccess();
    }, 1200);
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="credit-card-check" size={24} color={THEME.colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Payment & Order Review</Text>
          <Text style={styles.subtitle}>Select mode to confirm mobile bowser booking</Text>
        </View>
      </View>

      {/* Demo Gateway Notice */}
      <View style={styles.demoNotice}>
        <MaterialCommunityIcons name="information" size={16} color="#B45309" />
        <Text style={styles.demoNoticeText}>
          DEMO MODE: Secure payment gateway simulation active. No actual financial charge will occur.
        </Text>
      </View>

      {/* Order Summary Itemized */}
      <View style={styles.summaryBox}>
        <Text style={styles.summaryTitle}>Booking Breakdown</Text>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Supplier / Depot</Text>
          <Text style={styles.summaryVal}>{supplier?.name || "GreenField Bio-Diesel"}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Diesel Quantity</Text>
          <Text style={styles.summaryVal}>{quantityLitres} Litres</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Base Rate</Text>
          <Text style={styles.summaryVal}>₹{priceBreakdown.ratePerLiter.toFixed(2)} / L</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Fuel Subtotal</Text>
          <Text style={styles.summaryVal}>₹{Math.round(priceBreakdown.dieselSubtotal).toLocaleString("en-IN")}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery & Safe Dispensing</Text>
          <Text style={[styles.summaryVal, { color: "#059669" }]}>FREE</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Regulatory & Testing Fee</Text>
          <Text style={styles.summaryVal}>₹{priceBreakdown.additionalCharges.toFixed(2)}</Text>
        </View>

        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total Payable Amount</Text>
          <Text style={styles.totalVal}>
            ₹{Math.round(priceBreakdown.finalTotalAmount).toLocaleString("en-IN")}
          </Text>
        </View>
      </View>

      {/* Delivery Target Preview */}
      <View style={styles.destStrip}>
        <MaterialCommunityIcons name="map-marker" size={16} color={THEME.colors.primary} />
        <Text style={styles.destText} numberOfLines={1}>
          {address.buildingNumber}, {address.streetName}, {address.city}
        </Text>
      </View>

      {/* Payment Modes */}
      <Text style={styles.sectionHeading}>Choose Payment Method</Text>
      <View style={styles.methodsList}>
        {PAYMENT_OPTIONS.map((opt) => {
          const isSelected = paymentMethod === opt.id;
          return (
            <TouchableOpacity
              key={opt.id}
              style={[styles.methodCard, isSelected && styles.methodCardActive]}
              onPress={() => onSelectPaymentMethod(opt.id as any)}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name={opt.icon as any}
                size={22}
                color={isSelected ? THEME.colors.primary : THEME.colors.textSecondary}
              />
              <View style={{ flex: 1 }}>
                <Text style={[styles.methodTitle, isSelected && styles.methodTitleActive]}>
                  {opt.title}
                </Text>
                <Text style={styles.methodTag}>{opt.tag}</Text>
              </View>
              <MaterialCommunityIcons
                name={isSelected ? "radiobox-marked" : "radiobox-blank"}
                size={20}
                color={isSelected ? THEME.colors.primary : THEME.colors.textMuted}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Pay Now Button */}
      <TouchableOpacity
        style={[styles.payBtn, isProcessing && styles.payBtnDisabled]}
        onPress={handlePayNow}
        disabled={isProcessing}
        activeOpacity={0.8}
      >
        {isProcessing ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.payBtnText}>
            Pay ₹{Math.round(priceBreakdown.finalTotalAmount).toLocaleString("en-IN")} & Confirm Order
          </Text>
        )}
      </TouchableOpacity>
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
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  demoNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FEF3C7",
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
  },
  demoNoticeText: {
    fontSize: 11,
    color: "#92400E",
    fontWeight: "600",
    flex: 1,
  },
  summaryBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 14,
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
  },
  summaryVal: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: "#E2E8F0",
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
  },
  totalVal: {
    fontSize: 16,
    fontWeight: "900",
    color: THEME.colors.primary,
  },
  destStrip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F1F5F9",
    padding: 8,
    borderRadius: 8,
    marginBottom: 14,
  },
  destText: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    flex: 1,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
    marginBottom: 10,
  },
  methodsList: {
    gap: 8,
    marginBottom: 16,
  },
  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
  },
  methodCardActive: {
    borderColor: THEME.colors.primary,
    backgroundColor: "#EFF6FF",
  },
  methodTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
  },
  methodTitleActive: {
    color: THEME.colors.primary,
  },
  methodTag: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 1,
  },
  payBtn: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  payBtnDisabled: {
    opacity: 0.6,
  },
  payBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
});
