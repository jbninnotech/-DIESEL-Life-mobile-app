import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { THEME } from "../../constants/theme";
import { DeliveryScheduleSelection, FuelSupplier } from "../../types/orderWorkflow.types";

interface Props {
  schedule: DeliveryScheduleSelection;
  onUpdateSchedule: (schedule: DeliveryScheduleSelection) => void;
  supplier: FuelSupplier | null;
  onConfirmSchedule: () => void;
}

const DEFAULT_SLOTS = [
  "Morning (07:00 AM - 10:00 AM)",
  "Afternoon (11:00 AM - 02:00 PM)",
  "Evening (03:00 PM - 06:00 PM)",
  "Night Express (07:00 PM - 10:00 PM)",
];

export const FlowDeliveryScheduleCard: React.FC<Props> = ({
  schedule,
  onUpdateSchedule,
  supplier,
  onConfirmSchedule,
}) => {
  const availableSlots = supplier?.availableSlots || DEFAULT_SLOTS;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="clock-time-four-outline" size={24} color={THEME.colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Delivery Scheduling</Text>
          <Text style={styles.subtitle}>Select time window for calibrated bowser arrival</Text>
        </View>
      </View>

      {/* Immediate vs Scheduled Mode */}
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleBtn, schedule.type === "now" && styles.toggleBtnActive]}
          onPress={() => onUpdateSchedule({ ...schedule, type: "now" })}
        >
          <MaterialCommunityIcons
            name="lightning-bolt"
            size={18}
            color={schedule.type === "now" ? "#FFFFFF" : THEME.colors.textSecondary}
          />
          <Text style={[styles.toggleText, schedule.type === "now" && styles.toggleTextActive]}>
            Express Now (Within 45m)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggleBtn, schedule.type === "scheduled" && styles.toggleBtnActive]}
          onPress={() => onUpdateSchedule({ ...schedule, type: "scheduled" })}
        >
          <MaterialCommunityIcons
            name="calendar-clock"
            size={18}
            color={schedule.type === "scheduled" ? "#FFFFFF" : THEME.colors.textSecondary}
          />
          <Text style={[styles.toggleText, schedule.type === "scheduled" && styles.toggleTextActive]}>
            Scheduled Slot
          </Text>
        </TouchableOpacity>
      </View>

      {/* Date & Slots (Shown if scheduled) */}
      {schedule.type === "scheduled" && (
        <View style={styles.slotsSection}>
          <Text style={styles.sectionHeading}>Available Time Windows (Supplier Calibrated)</Text>
          <View style={styles.slotsGrid}>
            {availableSlots.map((slot) => {
              const isSelected = schedule.timeSlot === slot;
              return (
                <TouchableOpacity
                  key={slot}
                  style={[styles.slotPill, isSelected && styles.slotPillActive]}
                  onPress={() => onUpdateSchedule({ ...schedule, timeSlot: slot })}
                >
                  <MaterialCommunityIcons
                    name={isSelected ? "radiobox-marked" : "radiobox-blank"}
                    size={16}
                    color={isSelected ? THEME.colors.primary : THEME.colors.textMuted}
                  />
                  <Text style={[styles.slotText, isSelected && styles.slotTextActive]}>
                    {slot}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* Note on zero delivery fee */}
      <View style={styles.guaranteeBox}>
        <MaterialCommunityIcons name="shield-check" size={18} color="#059669" />
        <Text style={styles.guaranteeText}>
          Guaranteed weight-and-density safety checklist conducted at site before fuel discharge.
        </Text>
      </View>

      <TouchableOpacity style={styles.confirmBtn} onPress={onConfirmSchedule} activeOpacity={0.8}>
        <Text style={styles.confirmBtnText}>Confirm Delivery Schedule</Text>
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
  toggleRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  toggleBtnActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.colors.textSecondary,
  },
  toggleTextActive: {
    color: "#FFFFFF",
  },
  slotsSection: {
    marginBottom: 14,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.colors.textSecondary,
    marginBottom: 8,
  },
  slotsGrid: {
    gap: 8,
  },
  slotPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  slotPillActive: {
    borderColor: THEME.colors.primary,
    backgroundColor: "#EFF6FF",
  },
  slotText: {
    fontSize: 12,
    fontWeight: "600",
    color: THEME.colors.textPrimary,
  },
  slotTextActive: {
    color: THEME.colors.primary,
    fontWeight: "700",
  },
  guaranteeBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F0FDF4",
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
  },
  guaranteeText: {
    fontSize: 11,
    color: "#166534",
    flex: 1,
    lineHeight: 16,
  },
  confirmBtn: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
});
