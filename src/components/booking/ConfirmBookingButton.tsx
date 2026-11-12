import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { THEME } from "../../constants/theme";
import { CustomButton } from "../common/CustomButton";

interface ConfirmBookingButtonProps {
  onPress: () => void;
  isLoading: boolean;
  totalAmount: number;
  disabled?: boolean;
}

export const ConfirmBookingButton: React.FC<ConfirmBookingButtonProps> = ({
  onPress,
  isLoading,
  totalAmount,
  disabled = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.priceRow}>
        <View>
          <Text style={styles.label}>Total Payable</Text>
          <Text style={styles.amount}>
            ₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </Text>
        </View>

        <View style={styles.btnWrap}>
          <CustomButton
            title="CONFIRM DIESEL BOOKING"
            onPress={onPress}
            loading={isLoading}
            disabled={disabled}
            size="large"
            icon="check-decagram"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.colors.surface,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 10,
    elevation: 8,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  label: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  amount: {
    fontSize: 18,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
    marginTop: 1,
  },
  btnWrap: {
    flex: 1,
  },
});
