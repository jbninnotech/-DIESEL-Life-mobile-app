import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { THEME } from "../../constants/theme";
import { BookingPaymentMethod } from "../../types/booking.types";

interface PaymentSelectorProps {
  selectedMethod: BookingPaymentMethod;
  onSelectMethod: (method: BookingPaymentMethod) => void;
  walletBalance?: number;
  error?: string;
}

const PAYMENT_OPTIONS: {
  id: BookingPaymentMethod;
  title: string;
  subtitle: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
}[] = [
  {
    id: "upi",
    title: "UPI / QR Code",
    subtitle: "Google Pay, PhonePe, Paytm, BHIM",
    icon: "qrcode-scan",
  },
  {
    id: "wallet",
    title: "Diesel Wallet",
    subtitle: "Instant one-tap deduction",
    icon: "wallet-outline",
  },
  {
    id: "online",
    title: "Net Banking / Corporate Card",
    subtitle: "Credit/Debit Cards & Net Banking",
    icon: "credit-card-outline",
  },
  {
    id: "cod",
    title: "Cash on Delivery",
    subtitle: "Pay bowser driver after smart fueling",
    icon: "cash",
  },
];

export const PaymentSelector: React.FC<PaymentSelectorProps> = ({
  selectedMethod,
  onSelectMethod,
  walletBalance = 14850.5,
  error,
}) => {
  return (
    <View style={styles.container}>
      {PAYMENT_OPTIONS.map((option) => {
        const active = option.id === selectedMethod;
        return (
          <TouchableOpacity
            key={option.id}
            onPress={() => onSelectMethod(option.id)}
            style={[styles.card, active && styles.cardActive]}
            activeOpacity={0.75}
          >
            <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
              <MaterialCommunityIcons
                name={option.icon}
                size={22}
                color={active ? "#FFFFFF" : THEME.colors.primary}
              />
            </View>

            <View style={styles.textWrap}>
              <View style={styles.titleRow}>
                <Text style={styles.title}>{option.title}</Text>
                {option.id === "wallet" && (
                  <Text style={styles.walletBadge}>
                    Bal: ₹{walletBalance.toLocaleString("en-IN")}
                  </Text>
                )}
              </View>
              <Text style={styles.subtitle}>{option.subtitle}</Text>
            </View>

            <MaterialCommunityIcons
              name={active ? "radiobox-marked" : "radiobox-blank"}
              size={22}
              color={active ? THEME.colors.primary : THEME.colors.textMuted}
            />
          </TouchableOpacity>
        );
      })}

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.colors.surface,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    borderRadius: THEME.radius.lg,
    padding: 12,
    marginBottom: 8,
  },
  cardActive: {
    borderColor: THEME.colors.primary,
    backgroundColor: THEME.colors.primaryLight,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  iconWrapActive: {
    backgroundColor: THEME.colors.primary,
  },
  textWrap: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
  },
  walletBadge: {
    fontSize: 10,
    fontWeight: "700",
    color: THEME.colors.secondaryDark,
    backgroundColor: THEME.colors.secondaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  subtitle: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: THEME.colors.danger,
    fontWeight: "600",
  },
});
