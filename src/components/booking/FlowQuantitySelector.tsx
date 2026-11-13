import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { THEME } from "../../constants/theme";
import { PriceBreakdownResult } from "../../types/booking.types";

interface Props {
  quantity: number;
  onQuantityChange: (qty: number) => void;
  priceBreakdown: PriceBreakdownResult;
  isCalculating?: boolean;
}

const PRESET_QUANTITIES = [20, 25, 30, 40, 50, 100];

export const FlowQuantitySelector: React.FC<Props> = ({
  quantity,
  onQuantityChange,
  priceBreakdown,
  isCalculating,
}) => {
  const handleDecrement = () => {
    if (quantity > 20) {
      onQuantityChange(Math.max(20, quantity - 5));
    }
  };

  const handleIncrement = () => {
    onQuantityChange(quantity + 5);
  };

  const handleCustomInput = (text: string) => {
    const numeric = parseInt(text.replace(/[^0-9]/g, ""), 10);
    if (isNaN(numeric)) {
      onQuantityChange(20);
    } else {
      onQuantityChange(Math.min(10000, numeric));
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="gas-station" size={24} color={THEME.colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>Diesel Fuel Quantity</Text>
          <Text style={styles.cardSubtitle}>Minimum order starts from 20 Litres</Text>
        </View>
      </View>

      {/* Preset Pills */}
      <Text style={styles.sectionSublabel}>Popular Quantities (Litres)</Text>
      <View style={styles.presetsGrid}>
        {PRESET_QUANTITIES.map((qty) => {
          const isSelected = quantity === qty;
          return (
            <TouchableOpacity
              key={qty}
              style={[styles.presetPill, isSelected && styles.presetPillActive]}
              onPress={() => onQuantityChange(qty)}
              activeOpacity={0.7}
            >
              <Text style={[styles.presetText, isSelected && styles.presetTextActive]}>
                {qty} L
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Stepper & Manual Entry */}
      <View style={styles.stepperContainer}>
        <TouchableOpacity
          style={[styles.stepBtn, quantity <= 20 && styles.stepBtnDisabled]}
          onPress={handleDecrement}
          disabled={quantity <= 20}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="minus"
            size={22}
            color={quantity <= 20 ? THEME.colors.textMuted : THEME.colors.textPrimary}
          />
        </TouchableOpacity>

        <View style={styles.qtyDisplay}>
          <TextInput
            style={styles.qtyInput}
            keyboardType="number-pad"
            value={String(quantity)}
            onChangeText={handleCustomInput}
            maxLength={5}
            selectTextOnFocus
          />
          <Text style={styles.qtyUnit}>Litres</Text>
        </View>

        <TouchableOpacity style={styles.stepBtn} onPress={handleIncrement} activeOpacity={0.7}>
          <MaterialCommunityIcons name="plus" size={22} color={THEME.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Price Summary Strip */}
      <View style={styles.priceStrip}>
        <View>
          <Text style={styles.priceLabel}>Estimated Fuel Total (Demo Price)</Text>
          <Text style={styles.rateNote}>
            @ ₹{priceBreakdown.ratePerLiter.toFixed(2)}/Litre (Demo Rate)
          </Text>
        </View>
        <Text style={styles.priceValue}>
          {isCalculating ? "..." : `₹${Math.round(priceBreakdown.finalTotalAmount).toLocaleString("en-IN")}`}
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
    borderWidth: 1,
    borderColor: THEME.colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
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
    backgroundColor: "#E0F2FE",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
  },
  cardSubtitle: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  sectionSublabel: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.colors.textSecondary,
    marginBottom: 8,
  },
  presetsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  presetPill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: THEME.colors.background,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  presetPillActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  presetText: {
    fontSize: 13,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
  },
  presetTextActive: {
    color: "#FFFFFF",
  },
  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: THEME.colors.background,
    borderRadius: THEME.radius.md,
    padding: 6,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: 14,
  },
  stepBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: THEME.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  stepBtnDisabled: {
    opacity: 0.5,
    backgroundColor: "#F1F5F9",
  },
  qtyDisplay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  qtyInput: {
    fontSize: 22,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
    textAlign: "center",
    minWidth: 60,
  },
  qtyUnit: {
    fontSize: 14,
    fontWeight: "700",
    color: THEME.colors.textSecondary,
  },
  priceStrip: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#DCFCE7",
  },
  priceLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#166534",
  },
  rateNote: {
    fontSize: 11,
    color: "#15803D",
    marginTop: 2,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: "900",
    color: "#166534",
  },
});
