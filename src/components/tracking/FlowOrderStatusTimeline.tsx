import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { THEME } from "../../constants/theme";
import { OrderTrackingStatus } from "../../types/orderWorkflow.types";

interface Props {
  currentStatus: OrderTrackingStatus;
  currentStepIndex: number;
}

interface StepItem {
  id: OrderTrackingStatus;
  title: string;
  description: string;
  icon: string;
}

const ORDER_STEPS: StepItem[] = [
  {
    id: "BOOKING_PLACED",
    title: "1. Booking Placed",
    description: "Diesel order recorded with refinery supplier",
    icon: "clipboard-check-outline",
  },
  {
    id: "PAYMENT_CONFIRMED",
    title: "2. Payment Confirmed",
    description: "Invoice transaction cleared / Demo Approved",
    icon: "cash-check",
  },
  {
    id: "SUPPLIER_CONFIRMED",
    title: "3. Supplier Confirmed",
    description: "Depot quality density inspection certified",
    icon: "domain",
  },
  {
    id: "DIESEL_PREPARATION",
    title: "4. Diesel Preparation",
    description: "Calibrated metering bowser tank loaded",
    icon: "barrel",
  },
  {
    id: "DELIVERY_PARTNER_ASSIGNED",
    title: "5. Delivery Partner Assigned",
    description: "Certified hazardous material driver allocated",
    icon: "account-hard-hat",
  },
  {
    id: "OUT_FOR_DELIVERY",
    title: "6. Out for Delivery",
    description: "Smart bowser en route to your registered site",
    icon: "truck-fast",
  },
  {
    id: "ARRIVING_AT_DESTINATION",
    title: "7. Arriving at Destination",
    description: "Bowser positioned at site discharge gate",
    icon: "map-marker-radius",
  },
  {
    id: "OTP_VERIFICATION",
    title: "8. OTP Verification",
    description: "Operator awaiting site manager OTP sign-off",
    icon: "shield-key-outline",
  },
  {
    id: "DELIVERED_SUCCESSFULLY",
    title: "9. Delivered Successfully",
    description: "Digital meter dispense complete & signed",
    icon: "check-circle",
  },
];

export const FlowOrderStatusTimeline: React.FC<Props> = ({ currentStatus, currentStepIndex }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Order Tracking Status Timeline</Text>
      <Text style={styles.subheading}>Real-time delivery progress updates</Text>

      <View style={styles.timeline}>
        {ORDER_STEPS.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          const isPending = idx > currentStepIndex;

          const dotColor = isDone ? "#16A34A" : isCurrent ? THEME.colors.primary : "#CBD5E1";
          const iconColor = isDone || isCurrent ? "#FFFFFF" : THEME.colors.textMuted;

          return (
            <View key={step.id} style={styles.stepRow}>
              {/* Left Column: Dot & Connecting Line */}
              <View style={styles.leftCol}>
                <View style={[styles.dot, { backgroundColor: dotColor }]}>
                  <MaterialCommunityIcons
                    name={isDone ? "check" : (step.icon as any)}
                    size={13}
                    color={iconColor}
                  />
                </View>
                {idx < ORDER_STEPS.length - 1 && (
                  <View style={[styles.line, isDone && styles.lineDone]} />
                )}
              </View>

              {/* Right Column: Step details */}
              <View style={styles.rightCol}>
                <View style={styles.titleRow}>
                  <Text
                    style={[
                      styles.stepTitle,
                      isCurrent && styles.stepTitleCurrent,
                      isDone && styles.stepTitleDone,
                    ]}
                  >
                    {step.title}
                  </Text>
                  {isCurrent && (
                    <View style={styles.activePill}>
                      <Text style={styles.activePillText}>IN PROGRESS</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.stepDesc}>{step.description}</Text>
              </View>
            </View>
          );
        })}
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
    marginBottom: 16,
  },
  heading: {
    fontSize: 15,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
  },
  subheading: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginBottom: 16,
    marginTop: 2,
  },
  timeline: {
    paddingLeft: 4,
  },
  stepRow: {
    flexDirection: "row",
    minHeight: 52,
  },
  leftCol: {
    alignItems: "center",
    width: 28,
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 2,
  },
  lineDone: {
    backgroundColor: "#16A34A",
  },
  rightCol: {
    flex: 1,
    paddingLeft: 12,
    paddingBottom: 14,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: THEME.colors.textMuted,
  },
  stepTitleCurrent: {
    color: THEME.colors.primary,
    fontWeight: "800",
  },
  stepTitleDone: {
    color: THEME.colors.textPrimary,
  },
  activePill: {
    backgroundColor: "#E0F2FE",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  activePillText: {
    fontSize: 9,
    fontWeight: "800",
    color: THEME.colors.primary,
  },
  stepDesc: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
});
