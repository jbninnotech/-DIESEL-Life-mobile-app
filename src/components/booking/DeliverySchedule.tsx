import React, { useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { THEME } from "../../constants/theme";
import { DeliveryScheduleType, DeliverySlot } from "../../types/booking.types";

interface DeliveryScheduleProps {
  scheduleType: DeliveryScheduleType;
  onChangeScheduleType: (type: DeliveryScheduleType) => void;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  selectedSlotId?: string;
  onSelectSlot: (slotId: string) => void;
  availableSlots: DeliverySlot[];
  slotError?: string;
  isServiceable?: boolean;
}

export const DeliverySchedule: React.FC<DeliveryScheduleProps> = ({
  scheduleType,
  onChangeScheduleType,
  selectedDate,
  onSelectDate,
  selectedSlotId,
  onSelectSlot,
  availableSlots,
  slotError,
  isServiceable = true,
}) => {
  // Build next 7 days list
  const next7Days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const iso = d.toISOString().split("T")[0];
      return {
        iso,
        dayName: i === 0 ? "Today" : d.toLocaleDateString("en-IN", { weekday: "short" }),
        dateNum: d.getDate(),
        month: d.toLocaleDateString("en-IN", { month: "short" }),
      };
    });
  }, []);

  return (
    <View style={styles.container}>
      {/* Option Switches: Deliver Now vs Schedule */}
      <View style={styles.toggleRow}>
        <TouchableOpacity
          onPress={() => onChangeScheduleType("now")}
          style={[styles.toggleBtn, scheduleType === "now" && styles.toggleBtnActive]}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name="lightning-bolt"
            size={18}
            color={scheduleType === "now" ? "#FFFFFF" : THEME.colors.primary}
          />
          <View style={styles.toggleTextWrap}>
            <Text
              style={[styles.toggleTitle, scheduleType === "now" && styles.toggleTitleActive]}
            >
              Deliver Now
            </Text>
            <Text
              style={[styles.toggleSub, scheduleType === "now" && styles.toggleSubActive]}
            >
              Priority Bowser dispatch
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onChangeScheduleType("scheduled")}
          style={[styles.toggleBtn, scheduleType === "scheduled" && styles.toggleBtnActive]}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name="calendar-clock"
            size={18}
            color={scheduleType === "scheduled" ? "#FFFFFF" : THEME.colors.primary}
          />
          <View style={styles.toggleTextWrap}>
            <Text
              style={[
                styles.toggleTitle,
                scheduleType === "scheduled" && styles.toggleTitleActive,
              ]}
            >
              Schedule Slot
            </Text>
            <Text
              style={[
                styles.toggleSub,
                scheduleType === "scheduled" && styles.toggleSubActive,
              ]}
            >
              Select date & time
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Deliver Now Alert Info */}
      {scheduleType === "now" && (
        <View style={styles.nowNotice}>
          <MaterialCommunityIcons name="truck-fast" size={20} color={THEME.colors.primary} />
          <View style={styles.nowNoticeTextWrap}>
            <Text style={styles.nowNoticeTitle}>Direct Bowser Dispatch Enabled</Text>
            <Text style={styles.nowNoticeSub}>
              Nearest automated fuel tanker will calibrate meter and dispatch to your location
              upon confirmation.
            </Text>
          </View>
        </View>
      )}

      {/* Scheduled Options */}
      {scheduleType === "scheduled" && (
        <View style={styles.scheduledSection}>
          <Text style={styles.subhead}>Select Delivery Date</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dateScroll}
          >
            {next7Days.map((d) => {
              const active = d.iso === selectedDate;
              return (
                <TouchableOpacity
                  key={d.iso}
                  onPress={() => onSelectDate(d.iso)}
                  style={[styles.dateCard, active && styles.dateCardActive]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.dayText, active && styles.dateTextActive]}>
                    {d.dayName}
                  </Text>
                  <Text style={[styles.numText, active && styles.dateTextActive]}>
                    {d.dateNum}
                  </Text>
                  <Text style={[styles.monthText, active && styles.dateTextActive]}>
                    {d.month}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <Text style={styles.subhead}>Select Time Slot</Text>
          <View style={styles.slotsGrid}>
            {availableSlots.map((slot) => {
              const active = slot.id === selectedSlotId;
              const disabled = !slot.available;
              return (
                <TouchableOpacity
                  key={slot.id}
                  disabled={disabled}
                  onPress={() => onSelectSlot(slot.id)}
                  style={[
                    styles.slotCard,
                    active && styles.slotCardActive,
                    disabled && styles.slotCardDisabled,
                  ]}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons
                    name="clock-time-four-outline"
                    size={16}
                    color={
                      disabled
                        ? THEME.colors.textMuted
                        : active
                        ? "#FFFFFF"
                        : THEME.colors.primary
                    }
                  />
                  <Text
                    style={[
                      styles.slotLabel,
                      active && styles.slotLabelActive,
                      disabled && styles.slotLabelDisabled,
                    ]}
                  >
                    {slot.label}
                  </Text>
                  {disabled && <Text style={styles.slotFullTag}>Past / Full</Text>}
                </TouchableOpacity>
              );
            })}
          </View>

          {slotError && <Text style={styles.errorText}>{slotError}</Text>}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  toggleRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.colors.surface,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    borderRadius: THEME.radius.lg,
    padding: 12,
  },
  toggleBtnActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  toggleTextWrap: {
    marginLeft: 8,
    flex: 1,
  },
  toggleTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
  },
  toggleTitleActive: {
    color: "#FFFFFF",
  },
  toggleSub: {
    fontSize: 10,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  toggleSubActive: {
    color: "rgba(255, 255, 255, 0.8)",
  },
  nowNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: THEME.colors.primaryLight,
    padding: 12,
    borderRadius: THEME.radius.md,
    marginTop: 4,
  },
  nowNoticeTextWrap: {
    flex: 1,
  },
  nowNoticeTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.colors.primaryDark,
  },
  nowNoticeSub: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  scheduledSection: {
    marginTop: 6,
  },
  subhead: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.colors.textSecondary,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dateScroll: {
    gap: 8,
    paddingBottom: 10,
  },
  dateCard: {
    width: 60,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.surface,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
  },
  dateCardActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  dayText: {
    fontSize: 11,
    fontWeight: "700",
    color: THEME.colors.textMuted,
  },
  numText: {
    fontSize: 18,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
    marginVertical: 2,
  },
  monthText: {
    fontSize: 11,
    fontWeight: "600",
    color: THEME.colors.textMuted,
  },
  dateTextActive: {
    color: "#FFFFFF",
  },
  slotsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  slotCard: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.surface,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    gap: 6,
  },
  slotCardActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  slotCardDisabled: {
    backgroundColor: THEME.colors.borderLight,
    borderColor: THEME.colors.border,
    opacity: 0.6,
  },
  slotLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
    flex: 1,
  },
  slotLabelActive: {
    color: "#FFFFFF",
  },
  slotLabelDisabled: {
    color: THEME.colors.textMuted,
  },
  slotFullTag: {
    fontSize: 9,
    color: THEME.colors.danger,
    fontWeight: "700",
  },
  errorText: {
    marginTop: 6,
    fontSize: 12,
    color: THEME.colors.danger,
    fontWeight: "600",
  },
});
