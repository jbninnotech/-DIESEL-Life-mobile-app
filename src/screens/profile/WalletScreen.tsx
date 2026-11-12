import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { THEME } from "../../constants/theme";
import { MOCK_TRANSACTIONS, MOCK_USER } from "../../data/mockData";
import { WalletTransaction } from "../../types";
import { ScreenHeader } from "../../components/common/ScreenHeader";

const PRESET_AMOUNTS = [1000, 5000, 10000, 25000];

const PAYMENT_METHODS = [
  { id: "upi", name: "Instant UPI (GPay / PhonePe / Paytm)", icon: "qrcode-scan" },
  { id: "netbanking", name: "Corporate Net Banking", icon: "bank" },
  { id: "card", name: "Fleet Credit / Debit Card", icon: "credit-card-outline" },
  { id: "credit_line", name: "Diesel Life 30-Day Credit Line", icon: "timer-sand" },
];

export default function WalletScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [balance, setBalance] = useState<number>(MOCK_USER.walletBalance);
  const [transactions, setTransactions] = useState<WalletTransaction[]>(MOCK_TRANSACTIONS);
  const [addMoneyModal, setAddMoneyModal] = useState(false);
  const [amountStr, setAmountStr] = useState("5000");
  const [selectedMethod, setSelectedMethod] = useState("upi");

  const recentTransactions = useMemo(() => transactions.slice(0, 5), [transactions]);

  const handleTopUp = () => {
    const val = parseFloat(amountStr);
    if (isNaN(val) || val <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid recharge amount.");
      return;
    }

    const newTxn: WalletTransaction = {
      id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      title: "Added Money to Wallet",
      description: `Recharge via ${
        PAYMENT_METHODS.find((p) => p.id === selectedMethod)?.name || "UPI"
      }`,
      date: "Today",
      time: "Just now",
      amount: val,
      type: "credit",
      status: "Completed",
      referenceId: `REF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      paymentMethod: selectedMethod.toUpperCase(),
    };

    setBalance((prev) => prev + val);
    setTransactions([newTxn, ...transactions]);
    setAddMoneyModal(false);
    Alert.alert("Top-Up Successful", `₹${val.toLocaleString("en-IN")} credited to your wallet.`);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScreenHeader
        title="Fleet Wallet"
        subtitle="Credits & Fast Bowser Checkout"
        rightAction={
          <TouchableOpacity
            style={styles.historyBtn}
            onPress={() => router.push("/(others)/TransactionHistory" as any)}
          >
            <MaterialCommunityIcons name="history" size={22} color={THEME.colors.primary} />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Balance Gradient Card */}
        <LinearGradient
          colors={[THEME.colors.gradientStart, THEME.colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.balanceCard}
        >
          <View style={styles.balanceHeader}>
            <View>
              <Text style={styles.balanceLabel}>Available Fleet Balance</Text>
              <Text style={styles.balanceAmount}>₹{balance.toLocaleString("en-IN")}</Text>
            </View>
            <View style={styles.walletIconWrap}>
              <MaterialCommunityIcons name="wallet" size={32} color="#FFFFFF" />
            </View>
          </View>

          <View style={styles.cardActions}>
            <TouchableOpacity
              style={styles.addMoneyBtn}
              onPress={() => setAddMoneyModal(true)}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="plus-circle" size={18} color={THEME.colors.primary} />
              <Text style={styles.addMoneyText}>Add Money</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.historyPill}
              onPress={() => router.push("/(others)/TransactionHistory" as any)}
            >
              <Text style={styles.historyPillText}>Statement & Invoices</Text>
              <MaterialCommunityIcons name="chevron-right" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Quick Features Row */}
        <View style={styles.quickFeatures}>
          <TouchableOpacity
            style={styles.featureItem}
            onPress={() => router.push("/(others)/TransactionHistory?filter=Refunds" as any)}
          >
            <View style={[styles.featureIcon, { backgroundColor: THEME.colors.accentLight }]}>
              <MaterialCommunityIcons name="undo-variant" size={22} color={THEME.colors.accent} />
            </View>
            <Text style={styles.featureTitle}>Refunds</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.featureItem}
            onPress={() => router.push("/(others)/TransactionHistory?filter=Payments" as any)}
          >
            <View style={[styles.featureIcon, { backgroundColor: THEME.colors.secondaryLight }]}>
              <MaterialCommunityIcons name="receipt" size={22} color={THEME.colors.secondaryDark} />
            </View>
            <Text style={styles.featureTitle}>GST Bills</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.featureItem}
            onPress={() => router.push("/(others)/TransactionHistory?filter=Credits" as any)}
          >
            <View style={[styles.featureIcon, { backgroundColor: THEME.colors.primaryLight }]}>
              <MaterialCommunityIcons name="gift-outline" size={22} color={THEME.colors.primary} />
            </View>
            <Text style={styles.featureTitle}>Cashback</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.featureItem}
            onPress={() =>
              Alert.alert(
                "30-Day Fleet Credit",
                "Your enterprise account is eligible for up to ₹2,50,000 monthly credit facility. Contact corporate support to activate."
              )
            }
          >
            <View style={[styles.featureIcon, { backgroundColor: "#F3E8FF" }]}>
              <MaterialCommunityIcons name="timer-sand" size={22} color="#9333EA" />
            </View>
            <Text style={styles.featureTitle}>Credit Line</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Transactions List */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => router.push("/(others)/TransactionHistory" as any)}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {recentTransactions.map((item) => {
            const isCredit = item.type === "credit" || item.type === "refund";
            return (
              <View key={item.id} style={styles.txnRow}>
                <View
                  style={[
                    styles.txnIconWrap,
                    {
                      backgroundColor: isCredit
                        ? THEME.colors.secondaryLight
                        : THEME.colors.dangerLight,
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={isCredit ? "arrow-down-left" : "arrow-up-right"}
                    size={20}
                    color={isCredit ? THEME.colors.secondaryDark : THEME.colors.danger}
                  />
                </View>

                <View style={styles.txnInfo}>
                  <Text style={styles.txnTitle}>{item.title}</Text>
                  <Text style={styles.txnDate}>
                    {item.date} • {item.time}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.txnAmount,
                    { color: isCredit ? THEME.colors.secondaryDark : THEME.colors.textPrimary },
                  ]}
                >
                  {isCredit ? "+" : "-"}₹{item.amount.toLocaleString("en-IN")}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Add Money Modal */}
      <Modal
        visible={addMoneyModal}
        transparent
        animationType="slide"
        onRequestClose={() => setAddMoneyModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeading}>Recharge Fleet Wallet</Text>
              <TouchableOpacity onPress={() => setAddMoneyModal(false)}>
                <MaterialCommunityIcons name="close" size={24} color={THEME.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Enter Recharge Amount (₹)</Text>
            <View style={styles.amountInputWrap}>
              <Text style={styles.rupeeSign}>₹</Text>
              <TextInput
                style={styles.amountInput}
                value={amountStr}
                onChangeText={setAmountStr}
                keyboardType="number-pad"
                placeholder="1000"
              />
            </View>

            <View style={styles.presetRow}>
              {PRESET_AMOUNTS.map((amt) => (
                <TouchableOpacity
                  key={amt}
                  style={[
                    styles.presetPill,
                    amountStr === String(amt) && styles.presetPillActive,
                  ]}
                  onPress={() => setAmountStr(String(amt))}
                >
                  <Text
                    style={[
                      styles.presetText,
                      amountStr === String(amt) && styles.presetTextActive,
                    ]}
                  >
                    +₹{amt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Select Payment Mode</Text>
            {PAYMENT_METHODS.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.methodRow,
                  selectedMethod === method.id && styles.methodRowActive,
                ]}
                onPress={() => setSelectedMethod(method.id)}
              >
                <MaterialCommunityIcons
                  name={method.icon as any}
                  size={20}
                  color={selectedMethod === method.id ? THEME.colors.primary : THEME.colors.textMuted}
                />
                <Text
                  style={[
                    styles.methodName,
                    selectedMethod === method.id && styles.methodNameActive,
                  ]}
                >
                  {method.name}
                </Text>
                {selectedMethod === method.id && (
                  <MaterialCommunityIcons name="check-circle" size={18} color={THEME.colors.primary} />
                )}
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.confirmRechargeBtn} onPress={handleTopUp}>
              <Text style={styles.confirmRechargeText}>Proceed to Recharge</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  historyBtn: {
    padding: 6,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  balanceCard: {
    borderRadius: THEME.radius.xl,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  balanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  balanceLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "600",
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFFFFF",
    marginTop: 4,
  },
  walletIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.25)",
  },
  addMoneyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addMoneyText: {
    fontSize: 13,
    fontWeight: "800",
    color: THEME.colors.primary,
  },
  historyPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  historyPillText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  quickFeatures: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: THEME.colors.surface,
    padding: 16,
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    elevation: 1,
  },
  featureItem: {
    alignItems: "center",
    flex: 1,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  featureTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: THEME.colors.textSecondary,
  },
  recentSection: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.colors.primary,
  },
  txnRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.borderLight,
  },
  txnIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  txnInfo: {
    flex: 1,
    marginLeft: 12,
  },
  txnTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
  },
  txnDate: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  txnAmount: {
    fontSize: 14,
    fontWeight: "800",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalBox: {
    backgroundColor: THEME.colors.surface,
    borderTopLeftRadius: THEME.radius.xl,
    borderTopRightRadius: THEME.radius.xl,
    padding: 20,
    gap: 12,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.colors.textSecondary,
    marginTop: 4,
  },
  amountInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.colors.background,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    borderRadius: THEME.radius.md,
    paddingHorizontal: 14,
    height: 52,
  },
  rupeeSign: {
    fontSize: 22,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
    marginRight: 6,
  },
  amountInput: {
    flex: 1,
    fontSize: 22,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
  },
  presetRow: {
    flexDirection: "row",
    gap: 8,
  },
  presetPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: THEME.colors.background,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: "center",
  },
  presetPillActive: {
    backgroundColor: THEME.colors.primaryLight,
    borderColor: THEME.colors.primary,
  },
  presetText: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.colors.textSecondary,
  },
  presetTextActive: {
    color: THEME.colors.primary,
  },
  methodRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.background,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    gap: 10,
  },
  methodRowActive: {
    backgroundColor: THEME.colors.primaryLight,
    borderColor: THEME.colors.primary,
  },
  methodName: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: THEME.colors.textPrimary,
  },
  methodNameActive: {
    color: THEME.colors.primaryDark,
    fontWeight: "700",
  },
  confirmRechargeBtn: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 14,
    borderRadius: THEME.radius.lg,
    alignItems: "center",
    marginTop: 10,
  },
  confirmRechargeText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
