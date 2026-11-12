import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { THEME } from "../../constants/theme";
import { MOCK_TRANSACTIONS } from "../../data/mockData";
import { WalletTransaction } from "../../types";
import { ScreenHeader } from "../../components/common/ScreenHeader";

type TxnFilter = "All" | "Credits" | "Debits" | "Refunds" | "Payments";

export default function TransactionHistoryScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ filter?: string }>();
  const initialFilter: TxnFilter =
    params.filter === "Refunds"
      ? "Refunds"
      : params.filter === "Payments"
      ? "Payments"
      : params.filter === "Credits"
      ? "Credits"
      : "All";

  const [activeFilter, setActiveFilter] = useState<TxnFilter>(initialFilter);
  const [transactions] = useState<WalletTransaction[]>(MOCK_TRANSACTIONS);

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

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScreenHeader title="Transaction History" subtitle="Statements & Payment Logs" />

      {/* Filter Tabs */}
      <View style={styles.filterBar}>
        {(["All", "Credits", "Debits", "Refunds", "Payments"] as TxnFilter[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.filterTab, activeFilter === tab && styles.filterTabActive]}
            onPress={() => setActiveFilter(tab)}
          >
            <Text style={[styles.filterTabText, activeFilter === tab && styles.filterTabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <MaterialCommunityIcons name="swap-horizontal" size={48} color={THEME.colors.textMuted} />
            <Text style={styles.emptyTitle}>No Transactions in this Category</Text>
          </View>
        }
        renderItem={({ item }) => {
          const isCredit = item.type === "credit" || item.type === "refund";
          return (
            <View style={styles.card}>
              <View
                style={[
                  styles.iconWrap,
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

              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDesc} numberOfLines={1}>
                  {item.description}
                </Text>
                <Text style={styles.cardMeta}>
                  {item.date} • {item.time} • Ref: {item.referenceId}
                </Text>
              </View>

              <View style={styles.amountCol}>
                <Text
                  style={[
                    styles.amountText,
                    { color: isCredit ? THEME.colors.secondaryDark : THEME.colors.textPrimary },
                  ]}
                >
                  {isCredit ? "+" : "-"}₹{item.amount.toLocaleString("en-IN")}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        item.status === "Completed"
                          ? THEME.colors.secondaryLight
                          : THEME.colors.accentLight,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color:
                          item.status === "Completed"
                            ? THEME.colors.secondaryDark
                            : THEME.colors.accent,
                      },
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  filterBar: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: THEME.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
    gap: 8,
  },
  filterTab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: THEME.colors.background,
  },
  filterTabActive: {
    backgroundColor: THEME.colors.primary,
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.colors.textSecondary,
  },
  filterTabTextActive: {
    color: "#FFFFFF",
  },
  listContent: {
    padding: 16,
    gap: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.colors.surface,
    padding: 14,
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  cardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
  },
  cardDesc: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  cardMeta: {
    fontSize: 10,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  amountCol: {
    alignItems: "flex-end",
  },
  amountText: {
    fontSize: 14,
    fontWeight: "800",
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  statusText: {
    fontSize: 9,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  emptyWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: THEME.colors.textMuted,
    marginTop: 10,
  },
});
