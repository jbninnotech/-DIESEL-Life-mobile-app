import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Pressable,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { THEME } from "../../constants/theme";

interface DieselQuantitySelectorProps {
  quantity: number;
  onChangeQuantity: (qty: number) => void;
  error?: string;
  minQuantity?: number;
  maxQuantity?: number;
}

const PRESET_CARDS = [5, 10, 20, 50, 100];

export const DieselQuantitySelector: React.FC<DieselQuantitySelectorProps> = ({
  quantity,
  onChangeQuantity,
  error,
  minQuantity = 5,
  maxQuantity = 10000,
}) => {
  const handleStep = (step: number) => {
    const next = Math.min(maxQuantity, Math.max(minQuantity, quantity + step));
    onChangeQuantity(next);
  };

  const handleManualInput = (val: string) => {
    const cleaned = val.replace(/\D/g, "");
    if (!cleaned) {
      onChangeQuantity(0);
      return;
    }
    const num = parseInt(cleaned, 10);
    onChangeQuantity(num);
  };

  const isPresetActive = (val: number) => quantity === val;

  return (
    <View style={styles.container}>
      {/* Cards Row */}
      <Text style={styles.subhead}>Quick Selection</Text>
      <View style={styles.cardsGrid}>
        {PRESET_CARDS.map((val) => {
          const active = isPresetActive(val);
          return (
            <Pressable
              key={val}
              onPress={() => onChangeQuantity(val)}
              style={({ pressed }) => [
                styles.card,
                active && styles.cardActive,
                pressed && { opacity: 0.8 },
              ]}
            >
              <MaterialCommunityIcons
                name="gas-station"
                size={18}
                color={active ? THEME.colors.primary : THEME.colors.textMuted}
              />
              <Text style={[styles.cardLitres, active && styles.cardLitresActive]}>
                {val} L
              </Text>
              <Text style={[styles.cardSub, active && styles.cardSubActive]}>
                {val < 50 ? "Standard" : "Bulk Tank"}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Manual Stepper & Custom Input */}
      <View style={[styles.stepperContainer, !!error && styles.stepperError]}>
        <TouchableOpacity
          onPress={() => handleStep(-5)}
          disabled={quantity <= minQuantity}
          style={[styles.stepBtn, quantity <= minQuantity && styles.stepBtnDisabled]}
        >
          <MaterialCommunityIcons name="minus" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.centerInputWrap}>
          <View style={styles.inputRow}>
            <TextInput
              value={quantity > 0 ? String(quantity) : ""}
              onChangeText={handleManualInput}
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor={THEME.colors.textMuted}
              style={styles.inputVal}
              maxLength={5}
            />
            <Text style={styles.unitText}>Litres</Text>
          </View>
          <Text style={styles.rangeText}>
            Min {minQuantity}L – Max {maxQuantity.toLocaleString()}L per delivery
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => handleStep(5)}
          disabled={quantity >= maxQuantity}
          style={[styles.stepBtn, quantity >= maxQuantity && styles.stepBtnDisabled]}
        >
          <MaterialCommunityIcons name="plus" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  subhead: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.colors.textSecondary,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },
  card: {
    flex: 1,
    minWidth: "18%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    backgroundColor: THEME.colors.surface,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    borderRadius: THEME.radius.md,
  },
  cardActive: {
    borderColor: THEME.colors.primary,
    backgroundColor: THEME.colors.primaryLight,
  },
  cardLitres: {
    fontSize: 14,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
    marginTop: 4,
  },
  cardLitresActive: {
    color: THEME.colors.primary,
  },
  cardSub: {
    fontSize: 9,
    fontWeight: "600",
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  cardSubActive: {
    color: THEME.colors.primaryDark,
  },
  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: THEME.colors.surface,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    borderRadius: THEME.radius.lg,
    padding: 8,
  },
  stepperError: {
    borderColor: THEME.colors.danger,
    backgroundColor: THEME.colors.dangerLight,
  },
  stepBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: THEME.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  stepBtnDisabled: {
    backgroundColor: THEME.colors.border,
  },
  centerInputWrap: {
    alignItems: "center",
    flex: 1,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  inputVal: {
    fontSize: 28,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
    textAlign: "center",
    minWidth: 70,
    padding: 0,
  },
  unitText: {
    fontSize: 14,
    fontWeight: "700",
    color: THEME.colors.textSecondary,
  },
  rangeText: {
    fontSize: 10,
    color: THEME.colors.textMuted,
    fontWeight: "600",
    marginTop: 2,
  },
  errorText: {
    marginTop: 6,
    fontSize: 12,
    color: THEME.colors.danger,
    fontWeight: "600",
  },
});
