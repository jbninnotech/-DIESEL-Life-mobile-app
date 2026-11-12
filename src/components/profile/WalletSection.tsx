import React from "react";
import { View, StyleSheet } from "react-native";
import { ProfileMenuSection } from "./ProfileMenuSection";
import { ProfileMenuItem } from "./ProfileMenuItem";
import { THEME } from "../../constants/theme";

interface WalletSectionProps {
  walletBalance: number;
  onWalletDashboard: () => void;
  onAddMoney: () => void;
  onTransactionHistory: () => void;
  onRefundHistory: () => void;
  onPaymentHistory: () => void;
}

export const WalletSection: React.FC<WalletSectionProps> = ({
  walletBalance,
  onWalletDashboard,
  onAddMoney,
  onTransactionHistory,
  onRefundHistory,
  onPaymentHistory,
}) => {
  return (
    <ProfileMenuSection title="C. My Wallet" icon="wallet-outline">
      <ProfileMenuItem
        icon="wallet"
        title="Wallet Dashboard"
        subtitle="Manage fleet credits & fast checkout"
        badge={`₹${walletBalance?.toLocaleString("en-IN") || "0"}`}
        badgeColor={THEME.colors.secondaryDark}
        onPress={onWalletDashboard}
      />
      <View style={styles.divider} />
      <ProfileMenuItem
        icon="cash-plus"
        title="Add Money"
        subtitle="Top up your balance via UPI, NetBanking or Card"
        onPress={onAddMoney}
      />
      <View style={styles.divider} />
      <ProfileMenuItem
        icon="swap-horizontal"
        title="Transaction History"
        subtitle="View all credits, debits & automated deductions"
        onPress={onTransactionHistory}
      />
      <View style={styles.divider} />
      <ProfileMenuItem
        icon="undo-variant"
        title="Refund History"
        subtitle="Cancellations and meter overcharge adjustments"
        onPress={onRefundHistory}
      />
      <View style={styles.divider} />
      <ProfileMenuItem
        icon="receipt"
        title="Payment History"
        subtitle="GST tax invoices & business expense records"
        onPress={onPaymentHistory}
      />
    </ProfileMenuSection>
  );
};

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: THEME.colors.borderLight,
    marginLeft: 68,
  },
});
