import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import EmptyState from "../../../components/common/EmptyState";
import { THEME } from "../../../constants/theme";
import { MOCK_TRANSACTIONS, MOCK_USER } from "../../../data/mockData";
import { TransactionType, WalletTransaction } from "../../../types";

type TxnFilter = "All" | "Credits" | "Debits" | "Refunds" | "Payments";

const PRESET_AMOUNTS = [1000, 5000, 10000, 25000];

const PAYMENT_METHODS = [
  { id: "upi", name: "Instant UPI (GPay / PhonePe / Paytm)", icon: "qrcode-scan" },
  { id: "netbanking", name: "Corporate Net Banking", icon: "bank" },
  { id: "card", name: "Fleet Credit / Debit Card", icon: "credit-card-outline" },
  { id: "credit_line", name: "Diesel Life 30-Day Credit Line", icon: "timer-sand" },
];

export default function WalletScreen() {
  const insets = useSafeAreaInsets();
  const [balance, setBalance] = useState<number>(MOCK_USER.walletBalance);
  const [transactions, setTransactions] =
    useState<WalletTransaction[]>(MOCK_TRANSACTIONS);
  const [activeFilter, setActiveFilter] = useState<TxnFilter>("All");
  const [refreshing, setRefreshing] = useState(false);

  // Add Money Modal State
  const [addMoneyModalVisible, setAddMoneyModalVisible] = useState(false);
  const [addAmount, setAddAmount] = useState<string>("5000");
  const [selectedMethod, setSelectedMethod] = useState<string>("upi");

  // Transaction Details Modal State
  const [selectedTxn, setSelectedTxn] = useState<WalletTransaction | null>(null);
  const [txnDetailsModalVisible, setTxnDetailsModalVisible] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setTransactions(MOCK_TRANSACTIONS);
      setRefreshing(false);
    }, 900);
  }, []);

  // Compute Credits & Debits totals
  const totalCredits = useMemo(() => {
    return transactions
      .filter((t) => t.type === "credit" || t.type === "refund")
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const totalDebits = useMemo(() => {
    return transactions
      .filter((t) => t.type === "debit" || t.type === "payment")
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (activeFilter === "All") return true;
      if (activeFilter === "Credits") return t.type === "credit";
      if (activeFilter === "Debits") return t.type === "debit";
      if (activeFilter === "Refunds") return t.type === "refund";
      if (activeFilter === "Payments") return t.type === "payment";
      return true;
    });
  }, [transactions, activeFilter]);

  const handleConfirmAddMoney = () => {
    const num = parseFloat(addAmount);
    if (isNaN(num) || num <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid top-up amount.");
      return;
    }

    const newTxn: WalletTransaction = {
      id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      title: "Added Money to Wallet",
      description: `Top-up via ${
        PAYMENT_METHODS.find((p) => p.id === selectedMethod)?.name || "UPI"
      }`,
      date: "Today",
      time: "Just now",
      amount: num,
      type: "credit",
      status: "Completed",
      referenceId: `REF-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      paymentMethod:
        PAYMENT_METHODS.find((p) => p.id === selectedMethod)?.name || "UPI",
    };

    setBalance((prev) => prev + num);
    setTransactions((prev) => [newTxn, ...prev]);
    setAddMoneyModalVisible(false);

    Alert.alert(
      "Wallet Recharged",
      `₹${num.toLocaleString(
        "en-IN"
      )} successfully added to your Diesel Life wallet.`
    );
  };

  const handleOpenTxnDetails = (txn: WalletTransaction) => {
    setSelectedTxn(txn);
    setTxnDetailsModalVisible(true);
  };

  const handleDownloadStatement = () => {
    Alert.alert(
      "Statement Exported",
      "Official GST-compliant financial statement for your Diesel Life account has been downloaded (PDF format).",
      [{ text: "OK" }]
    );
  };

  const getTypeColor = (type: TransactionType) => {
    switch (type) {
      case "credit":
        return {
          color: "#16A34A",
          icon: "arrow-down-left",
          prefix: "+",
          bg: "#DCFCE7",
        };
      case "refund":
        return {
          color: "#0875D1",
          icon: "cash-refund",
          prefix: "+",
          bg: "#E8F3FC",
        };
      case "debit":
        return {
          color: "#EF4444",
          icon: "arrow-up-right",
          prefix: "-",
          bg: "#FEE2E2",
        };
      case "payment":
        return {
          color: "#D97706",
          icon: "gas-station",
          prefix: "-",
          bg: "#FEF3C7",
        };
      default:
        return {
          color: "#475569",
          icon: "cash",
          prefix: "",
          bg: "#F1F5F9",
        };
    }
  };

  return (
    <View style={styles.root}>
      {/* Top Header */}
      <LinearGradient
        colors={[THEME.colors.gradientStart, THEME.colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.headerGradient, { paddingTop: insets.top + 8 }]}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Diesel Digital Wallet</Text>
            <Text style={styles.headerSubtitle}>
              Instant cashless fuel dispensing balance
            </Text>
          </View>
          <TouchableOpacity
            style={styles.statementBtn}
            onPress={handleDownloadStatement}
            activeOpacity={0.8}
            accessibilityLabel="Download Statement"
          >
            <MaterialCommunityIcons
              name="file-download-outline"
              size={20}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        {/* Big Balance Card */}
        <View style={styles.walletCard}>
          <View style={styles.walletCardTop}>
            <View>
              <Text style={styles.balanceLabel}>AVAILABLE BALANCE</Text>
              <Text style={styles.balanceValue}>
                ₹{balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </Text>
            </View>
            <View style={styles.shieldBadge}>
              <MaterialCommunityIcons
                name="shield-check"
                size={16}
                color="#16A34A"
              />
              <Text style={styles.shieldText}>Secured</Text>
            </View>
          </View>

          {/* Credits & Debits Overview */}
          <View style={styles.creditsDebitsRow}>
            <View style={styles.metricItem}>
              <View style={[styles.metricDot, { backgroundColor: "#16A34A" }]} />
              <View>
                <Text style={styles.metricLabel}>Total Credits</Text>
                <Text style={[styles.metricVal, { color: "#16A34A" }]}>
                  +₹{totalCredits.toLocaleString("en-IN")}
                </Text>
              </View>
            </View>

            <View style={styles.metricDivider} />

            <View style={styles.metricItem}>
              <View style={[styles.metricDot, { backgroundColor: "#EF4444" }]} />
              <View>
                <Text style={styles.metricLabel}>Total Spent</Text>
                <Text style={[styles.metricVal, { color: "#EF4444" }]}>
                  -₹{totalDebits.toLocaleString("en-IN")}
                </Text>
              </View>
            </View>
          </View>

          {/* Add Money Action Button */}
          <TouchableOpacity
            style={styles.addMoneyBtn}
            onPress={() => setAddMoneyModalVisible(true)}
            activeOpacity={0.85}
          >
            <MaterialCommunityIcons
              name="plus-circle"
              size={20}
              color="#FFFFFF"
            />
            <Text style={styles.addMoneyBtnText}>Add Money to Wallet</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Filter Tabs */}
      <View style={styles.tabsContainer}>
        {(["All", "Credits", "Debits", "Refunds", "Payments"] as TxnFilter[]).map(
          (filter) => {
            const isActive = activeFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
                onPress={() => setActiveFilter(filter)}
                activeOpacity={0.7}
              >
                <Text
                  style={[styles.tabText, isActive && styles.tabTextActive]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          }
        )}
      </View>

      {/* Transaction History */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[THEME.colors.primary]}
            tintColor={THEME.colors.primary}
          />
        }
      >
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeaderTitle}>Transaction History</Text>
          <Text style={styles.sectionCountText}>
            {filteredTransactions.length} records
          </Text>
        </View>

        {filteredTransactions.length === 0 ? (
          <EmptyState
            icon="wallet-outline"
            title="No transactions yet"
            description={`No transactions found in category "${activeFilter}".`}
          />
        ) : (
          filteredTransactions.map((txn) => {
            const typeConfig = getTypeColor(txn.type);
            return (
              <TouchableOpacity
                key={txn.id}
                style={styles.txnCard}
                onPress={() => handleOpenTxnDetails(txn)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.txnIconWrap,
                    { backgroundColor: typeConfig.bg },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={typeConfig.icon as any}
                    size={22}
                    color={typeConfig.color}
                  />
                </View>

                <View style={styles.txnInfo}>
                  <Text style={styles.txnTitle}>{txn.title}</Text>
                  <Text style={styles.txnDescription} numberOfLines={1}>
                    {txn.description}
                  </Text>
                  <Text style={styles.txnDate}>
                    {txn.date} • {txn.time}
                  </Text>
                </View>

                <View style={styles.txnRight}>
                  <Text style={[styles.txnAmount, { color: typeConfig.color }]}>
                    {typeConfig.prefix}₹
                    {txn.amount.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </Text>
                  <View style={styles.statusPill}>
                    <Text style={styles.statusPillText}>{txn.status}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* Add Money Modal */}
      <Modal
        visible={addMoneyModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setAddMoneyModalVisible(false)}
      >
        <View style={styles.modalRoot}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Top Up Wallet</Text>
              <Text style={styles.modalSubtitle}>
                Add instant balance for automatic fuel delivery orders
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setAddMoneyModalVisible(false)}
              style={styles.modalCloseBtn}
            >
              <MaterialCommunityIcons
                name="close"
                size={22}
                color={THEME.colors.textPrimary}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={styles.modalScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Amount Input */}
            <Text style={styles.inputSectionTitle}>Enter Amount (₹)</Text>
            <View style={styles.amountInputWrap}>
              <Text style={styles.currencyPrefix}>₹</Text>
              <TextInput
                style={styles.amountInput}
                value={addAmount}
                onChangeText={(t) => setAddAmount(t.replace(/\D/g, ""))}
                placeholder="0"
                keyboardType="numeric"
                maxLength={6}
              />
            </View>

            {/* Quick preset chips */}
            <View style={styles.presetChipsRow}>
              {PRESET_AMOUNTS.map((amt) => (
                <TouchableOpacity
                  key={amt}
                  style={[
                    styles.presetChip,
                    addAmount === amt.toString() && styles.presetChipActive,
                  ]}
                  onPress={() => setAddAmount(amt.toString())}
                >
                  <Text
                    style={[
                      styles.presetChipText,
                      addAmount === amt.toString() && styles.presetChipTextActive,
                    ]}
                  >
                    +₹{amt.toLocaleString("en-IN")}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Payment Method Selection */}
            <Text style={[styles.inputSectionTitle, { marginTop: 20 }]}>
              Select Payment Method
            </Text>
            <View style={styles.methodsList}>
              {PAYMENT_METHODS.map((method) => {
                const isSelected = selectedMethod === method.id;
                return (
                  <TouchableOpacity
                    key={method.id}
                    style={[
                      styles.methodCard,
                      isSelected && styles.methodCardSelected,
                    ]}
                    onPress={() => setSelectedMethod(method.id)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.methodIconWrap}>
                      <MaterialCommunityIcons
                        name={method.icon as any}
                        size={22}
                        color={
                          isSelected
                            ? THEME.colors.primary
                            : THEME.colors.textSecondary
                        }
                      />
                    </View>
                    <Text
                      style={[
                        styles.methodName,
                        isSelected && styles.methodNameSelected,
                      ]}
                    >
                      {method.name}
                    </Text>
                    <MaterialCommunityIcons
                      name={
                        isSelected ? "radiobox-marked" : "radiobox-blank"
                      }
                      size={20}
                      color={
                        isSelected ? THEME.colors.primary : THEME.colors.border
                      }
                    />
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Safe Payment Guarantee notice */}
            <View style={styles.safetyNotice}>
              <MaterialCommunityIcons
                name="shield-lock-outline"
                size={18}
                color="#16A34A"
              />
              <Text style={styles.safetyNoticeText}>
                256-bit Bank Grade Security. Simulated test transaction. No real
                money will be deducted.
              </Text>
            </View>

            {/* Add Money Confirm Button */}
            <TouchableOpacity
              style={styles.modalConfirmBtn}
              onPress={handleConfirmAddMoney}
              activeOpacity={0.85}
            >
              <Text style={styles.modalConfirmText}>
                Proceed to Add ₹
                {parseInt(addAmount || "0", 10).toLocaleString("en-IN")}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Transaction Details Modal */}
      <Modal
        visible={txnDetailsModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setTxnDetailsModalVisible(false)}
      >
        <View style={styles.overlay}>
          {selectedTxn && (
            <View style={styles.txnDetailCard}>
              <View style={styles.txnDetailHeader}>
                <View>
                  <Text style={styles.txnDetailTitle}>{selectedTxn.title}</Text>
                  <Text style={styles.txnDetailId}>{selectedTxn.id}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setTxnDetailsModalVisible(false)}
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={20}
                    color={THEME.colors.textMuted}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.txnDetailAmountWrap}>
                <Text style={styles.txnDetailAmount}>
                  ₹
                  {selectedTxn.amount.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </Text>
                <View
                  style={[
                    styles.statusPill,
                    { backgroundColor: "#DCFCE7", marginTop: 4 },
                  ]}
                >
                  <Text style={[styles.statusPillText, { color: "#15803D" }]}>
                    {selectedTxn.status}
                  </Text>
                </View>
              </View>

              <View style={styles.txnDetailRows}>
                <View style={styles.txnDetailRow}>
                  <Text style={styles.detailRowLabel}>Reference ID</Text>
                  <Text style={styles.detailRowVal}>
                    {selectedTxn.referenceId}
                  </Text>
                </View>
                <View style={styles.txnDetailRow}>
                  <Text style={styles.detailRowLabel}>Payment Method</Text>
                  <Text style={styles.detailRowVal}>
                    {selectedTxn.paymentMethod}
                  </Text>
                </View>
                <View style={styles.txnDetailRow}>
                  <Text style={styles.detailRowLabel}>Timestamp</Text>
                  <Text style={styles.detailRowVal}>
                    {selectedTxn.date} at {selectedTxn.time}
                  </Text>
                </View>
                <View style={styles.txnDetailRow}>
                  <Text style={styles.detailRowLabel}>Description</Text>
                  <Text style={styles.detailRowVal}>
                    {selectedTxn.description}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.closeDetailBtn}
                onPress={() => setTxnDetailsModalVisible(false)}
              >
                <Text style={styles.closeDetailText}>Close Receipt</Text>
              </TouchableOpacity>
            </View>
          )}
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
  headerGradient: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 2,
  },
  statementBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  walletCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.lg,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
  },
  walletCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: THEME.colors.textMuted,
    letterSpacing: 0.8,
  },
  balanceValue: {
    fontSize: 28,
    fontWeight: "900",
    color: THEME.colors.textPrimary,
    marginTop: 4,
  },
  shieldBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  shieldText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#16A34A",
  },
  creditsDebitsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: THEME.colors.borderLight,
    borderRadius: THEME.radius.md,
    paddingVertical: 12,
    marginBottom: 16,
  },
  metricItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  metricDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  metricLabel: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    fontWeight: "500",
  },
  metricVal: {
    fontSize: 13,
    fontWeight: "800",
    marginTop: 1,
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: THEME.colors.border,
  },
  addMoneyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: THEME.colors.primary,
    height: 48,
    borderRadius: THEME.radius.md,
  },
  addMoneyBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
    justifyContent: "space-between",
  },
  tabButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: THEME.colors.borderLight,
  },
  tabButtonActive: {
    backgroundColor: THEME.colors.primary,
  },
  tabText: {
    fontSize: 12,
    fontWeight: "600",
    color: THEME.colors.textSecondary,
  },
  tabTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 10,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
  },
  sectionCountText: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    fontWeight: "500",
  },
  txnCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    gap: 12,
  },
  txnIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  txnInfo: {
    flex: 1,
  },
  txnTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
  },
  txnDescription: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  txnDate: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 3,
  },
  txnRight: {
    alignItems: "flex-end",
  },
  txnAmount: {
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 4,
  },
  statusPill: {
    backgroundColor: THEME.colors.borderLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: "600",
    color: THEME.colors.textSecondary,
  },
  modalRoot: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
    backgroundColor: THEME.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
  },
  modalSubtitle: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 6,
  },
  modalScroll: {
    flex: 1,
  },
  modalScrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  inputSectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
    marginBottom: 10,
  },
  amountInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.lg,
    borderWidth: 2,
    borderColor: THEME.colors.primary,
    paddingHorizontal: 16,
    height: 60,
  },
  currencyPrefix: {
    fontSize: 24,
    fontWeight: "800",
    color: THEME.colors.primary,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 26,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
    paddingVertical: 0,
  },
  presetChipsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  presetChip: {
    flex: 1,
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    paddingVertical: 8,
    borderRadius: THEME.radius.md,
    alignItems: "center",
  },
  presetChipActive: {
    borderColor: THEME.colors.primary,
    backgroundColor: THEME.colors.primaryLight,
  },
  presetChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.colors.textSecondary,
  },
  presetChipTextActive: {
    color: THEME.colors.primary,
  },
  methodsList: {
    gap: 10,
  },
  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.colors.surface,
    padding: 14,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    gap: 12,
  },
  methodCardSelected: {
    borderColor: THEME.colors.primary,
    backgroundColor: THEME.colors.primaryLight,
  },
  methodIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME.colors.borderLight,
    alignItems: "center",
    justifyContent: "center",
  },
  methodName: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: THEME.colors.textPrimary,
  },
  methodNameSelected: {
    color: THEME.colors.primary,
    fontWeight: "700",
  },
  safetyNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#DCFCE7",
    padding: 12,
    borderRadius: THEME.radius.md,
    marginTop: 20,
    marginBottom: 20,
  },
  safetyNoticeText: {
    flex: 1,
    fontSize: 12,
    color: "#15803D",
    lineHeight: 16,
  },
  modalConfirmBtn: {
    backgroundColor: THEME.colors.primary,
    height: 52,
    borderRadius: THEME.radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  modalConfirmText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  txnDetailCard: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.lg,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 10,
  },
  txnDetailHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  txnDetailTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
  },
  txnDetailId: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  txnDetailAmountWrap: {
    alignItems: "center",
    marginVertical: 18,
    paddingVertical: 14,
    backgroundColor: THEME.colors.borderLight,
    borderRadius: THEME.radius.md,
  },
  txnDetailAmount: {
    fontSize: 26,
    fontWeight: "900",
    color: THEME.colors.textPrimary,
  },
  txnDetailRows: {
    gap: 10,
    marginBottom: 18,
  },
  txnDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailRowLabel: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
  },
  detailRowVal: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
    maxWidth: 220,
    textAlign: "right",
  },
  closeDetailBtn: {
    backgroundColor: THEME.colors.borderLight,
    height: 44,
    borderRadius: THEME.radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  closeDetailText: {
    fontSize: 14,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
  },
});
