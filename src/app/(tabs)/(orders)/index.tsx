import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import EmptyState from "../../../components/common/EmptyState";
import SearchBar from "../../../components/common/SearchBar";
import { THEME } from "../../../constants/theme";
import { MOCK_ORDERS } from "../../../data/mockData";
import { Order, OrderStatus } from "../../../types";

type FilterTab = "All Orders" | OrderStatus;

const TABS: FilterTab[] = [
  "All Orders",
  "In Progress",
  "Confirmed",
  "Pending",
  "Completed",
  "Cancelled",
];

export default function OrdersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [activeTab, setActiveTab] = useState<FilterTab>("All Orders");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setOrders(MOCK_ORDERS);
      setRefreshing(false);
    }, 900);
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesTab =
        activeTab === "All Orders" || order.status === activeTab;
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.location.city.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [orders, activeTab, searchQuery]);

  const handleOpenDetails = (order: Order) => {
    setSelectedOrder(order);
    setDetailsModalVisible(true);
  };

  const handleCancelOrder = (orderId: string) => {
    Alert.alert(
      "Cancel Fuel Order",
      `Are you sure you want to cancel ${orderId}? If fuel bowser is already dispatched, cancellation policy applies.`,
      [
        { text: "No, Keep Order", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: () => {
            setOrders((prev) =>
              prev.map((o) =>
                o.id === orderId
                  ? {
                      ...o,
                      status: "Cancelled",
                      paymentStatus: "Refunded",
                      timeline: [
                        ...o.timeline,
                        {
                          title: "Cancelled by User",
                          time: "Just now",
                          description:
                            "Order cancelled. 100% amount refunded to Diesel Wallet.",
                          done: true,
                        },
                      ],
                    }
                  : o
              )
            );
            if (selectedOrder?.id === orderId) {
              setSelectedOrder((prev) =>
                prev ? { ...prev, status: "Cancelled", paymentStatus: "Refunded" } : null
              );
            }
            Alert.alert(
              "Order Cancelled",
              "Your order has been cancelled and funds refunded to your wallet."
            );
          },
        },
      ]
    );
  };

  const handleReorder = (order: Order) => {
    const newOrderId = `DL-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      ...order,
      id: newOrderId,
      orderDate: "Today",
      orderTime: "Just now",
      status: "In Progress",
      paymentStatus: "Paid",
      timeline: [
        {
          title: "Order Placed & Scheduled",
          time: "Just now",
          description: "Reorder placed successfully. Bowser assigned.",
          done: true,
          active: true,
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    setDetailsModalVisible(false);
    Alert.alert(
      "Reorder Confirmed",
      `New order ${newOrderId} has been created for ${order.quantityLiters}L of ${order.serviceName}. Bowser will dispatch shortly.`
    );
  };

  const handleDownloadInvoice = (order: Order) => {
    Alert.alert(
      "Invoice Generated",
      `Tax Invoice & PESO Calibration certificate for ${order.id} downloaded to your device storage (PDF).`,
      [{ text: "Done" }]
    );
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "Completed":
        return { bg: "#DCFCE7", text: "#15803D", icon: "check-circle" };
      case "In Progress":
        return { bg: "#E8F3FC", text: "#0875D1", icon: "truck-fast" };
      case "Confirmed":
        return { bg: "#FEF3C7", text: "#B45309", icon: "clock-check" };
      case "Pending":
        return { bg: "#FEF9C3", text: "#A16207", icon: "timer-sand" };
      case "Cancelled":
        return { bg: "#FEE2E2", text: "#DC2626", icon: "close-circle" };
      default:
        return { bg: "#F1F5F9", text: "#475569", icon: "help-circle" };
    }
  };

  return (
    <View style={styles.root}>
      {/* Screen Header */}
      <LinearGradient
        colors={[THEME.colors.gradientStart, THEME.colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.headerGradient, { paddingTop: insets.top + 8 }]}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Orders & Deliveries</Text>
            <Text style={styles.headerSubtitle}>
              Live dispensing tracking & history
            </Text>
          </View>
          <View style={styles.headerBadge}>
            <MaterialCommunityIcons
              name="clipboard-list-outline"
              size={22}
              color="#FFFFFF"
            />
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchWrapper}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by order ID, location or fuel type..."
          />
        </View>
      </LinearGradient>

      {/* Filter Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScroll}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.7}
              >
                <Text
                  style={[styles.tabText, isActive && styles.tabTextActive]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Orders List */}
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
        {filteredOrders.length === 0 ? (
          <EmptyState
            icon="clipboard-text-search-outline"
            title="No orders found"
            description={
              searchQuery
                ? `No orders match "${searchQuery}". Try a different keyword or reset filter.`
                : `You don't have any orders under "${activeTab}".`
            }
            action={
              <TouchableOpacity
                style={styles.resetBtn}
                onPress={() => {
                  setActiveTab("All Orders");
                  setSearchQuery("");
                }}
              >
                <Text style={styles.resetBtnText}>View All Orders</Text>
              </TouchableOpacity>
            }
          />
        ) : (
          filteredOrders.map((order) => {
            const statusConfig = getStatusColor(order.status);
            return (
              <View key={order.id} style={styles.orderCard}>
                {/* Card Top Row */}
                <View style={styles.cardTop}>
                  <View style={styles.orderIdRow}>
                    <Text style={styles.orderId}>{order.id}</Text>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: statusConfig.bg },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={statusConfig.icon as any}
                        size={12}
                        color={statusConfig.text}
                      />
                      <Text
                        style={[
                          styles.statusBadgeText,
                          { color: statusConfig.text },
                        ]}
                      >
                        {order.status}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.orderDate}>
                    {order.orderDate} • {order.orderTime}
                  </Text>
                </View>

                {/* Service Details */}
                <View style={styles.serviceRow}>
                  <View style={styles.serviceIconWrap}>
                    <MaterialCommunityIcons
                      name="gas-station"
                      size={24}
                      color={THEME.colors.primary}
                    />
                  </View>
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceTitle}>{order.serviceName}</Text>
                    <Text style={styles.quantityInfo}>
                      {order.quantityLiters} Liters @ ₹{order.ratePerLiter}/L
                    </Text>
                  </View>
                  <View style={styles.amountWrap}>
                    <Text style={styles.amountLabel}>Total Amount</Text>
                    <Text style={styles.amountValue}>
                      ₹{order.amount.toLocaleString("en-IN")}
                    </Text>
                  </View>
                </View>

                {/* Delivery Location */}
                <View style={styles.locationRow}>
                  <MaterialCommunityIcons
                    name="map-marker-outline"
                    size={16}
                    color={THEME.colors.textMuted}
                  />
                  <Text style={styles.locationText} numberOfLines={1}>
                    {order.location.address}, {order.location.city}
                  </Text>
                </View>

                {/* Payment & Action Footer */}
                <View style={styles.cardFooter}>
                  <View style={styles.paymentInfoRow}>
                    <MaterialCommunityIcons
                      name={
                        order.paymentStatus === "Paid"
                          ? "shield-check"
                          : "alert-circle-outline"
                      }
                      size={15}
                      color={
                        order.paymentStatus === "Paid" ? "#16A34A" : "#D97706"
                      }
                    />
                    <Text style={styles.paymentStatusText}>
                      {order.paymentStatus} via {order.paymentMethod}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.detailsBtn}
                    onPress={() => handleOpenDetails(order)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.detailsBtnText}>View Details</Text>
                    <MaterialCommunityIcons
                      name="arrow-right"
                      size={14}
                      color={THEME.colors.primary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Order Details Full Modal */}
      <Modal
        visible={detailsModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setDetailsModalVisible(false)}
      >
        {selectedOrder && (
          <View style={styles.modalRoot}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalHeaderTitle}>Order Details</Text>
                <Text style={styles.modalHeaderSub}>{selectedOrder.id}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setDetailsModalVisible(false)}
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
              {/* Status Banner */}
              <View
                style={[
                  styles.detailsStatusBanner,
                  {
                    backgroundColor: getStatusColor(selectedOrder.status).bg,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name={getStatusColor(selectedOrder.status).icon as any}
                  size={24}
                  color={getStatusColor(selectedOrder.status).text}
                />
                <View style={styles.statusBannerTexts}>
                  <Text
                    style={[
                      styles.statusBannerTitle,
                      {
                        color: getStatusColor(selectedOrder.status).text,
                      },
                    ]}
                  >
                    Order Status: {selectedOrder.status}
                  </Text>
                  <Text style={styles.statusBannerSub}>
                    Placed on {selectedOrder.orderDate} at{" "}
                    {selectedOrder.orderTime}
                  </Text>
                </View>
              </View>

              {/* Live Tracking Timeline */}
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>
                  Live Tracking Timeline
                </Text>
                <View style={styles.timelineList}>
                  {selectedOrder.timeline.map((step, idx) => {
                    const isLast = idx === selectedOrder.timeline.length - 1;
                    return (
                      <View key={idx} style={styles.timelineItem}>
                        <View style={styles.timelineLeft}>
                          <View
                            style={[
                              styles.timelineDot,
                              step.done && styles.timelineDotDone,
                              step.active && styles.timelineDotActive,
                            ]}
                          >
                            <MaterialCommunityIcons
                              name={step.done ? "check" : "circle-medium"}
                              size={14}
                              color={step.done ? "#FFFFFF" : THEME.colors.textMuted}
                            />
                          </View>
                          {!isLast && (
                            <View
                              style={[
                                styles.timelineLine,
                                step.done && styles.timelineLineDone,
                              ]}
                            />
                          )}
                        </View>
                        <View style={styles.timelineRight}>
                          <Text style={styles.timelineStepTitle}>
                            {step.title}
                          </Text>
                          <Text style={styles.timelineStepTime}>
                            {step.time}
                          </Text>
                          <Text style={styles.timelineStepDesc}>
                            {step.description}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>

              {/* Delivery Partner Info */}
              {selectedOrder.deliveryPartner && (
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>
                    Bowser & Delivery Driver
                  </Text>
                  <View style={styles.partnerCard}>
                    <View style={styles.partnerAvatar}>
                      <MaterialCommunityIcons
                        name="account-hard-hat"
                        size={26}
                        color={THEME.colors.primary}
                      />
                    </View>
                    <View style={styles.partnerInfo}>
                      <Text style={styles.partnerName}>
                        {selectedOrder.deliveryPartner.name}
                      </Text>
                      <Text style={styles.partnerVehicle}>
                        {selectedOrder.deliveryPartner.vehicleNo}
                      </Text>
                      <View style={styles.partnerRating}>
                        <MaterialCommunityIcons
                          name="star"
                          size={13}
                          color="#F59E0B"
                        />
                        <Text style={styles.partnerRatingText}>
                          {selectedOrder.deliveryPartner.rating} Verified Operator
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.callDriverBtn}
                      onPress={() =>
                        Alert.alert(
                          "Calling Operator",
                          `Dialing ${selectedOrder.deliveryPartner?.phone}`
                        )
                      }
                    >
                      <MaterialCommunityIcons
                        name="phone"
                        size={18}
                        color="#FFFFFF"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Customer & Location Details */}
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Delivery Location</Text>
                <View style={styles.infoBox}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Address</Text>
                    <Text style={styles.infoVal}>
                      {selectedOrder.location.address},{" "}
                      {selectedOrder.location.city} -{" "}
                      {selectedOrder.location.pincode}
                    </Text>
                  </View>
                  {selectedOrder.location.landmark && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Landmark</Text>
                      <Text style={styles.infoVal}>
                        {selectedOrder.location.landmark}
                      </Text>
                    </View>
                  )}
                  {selectedOrder.customer.vehicleOrAsset && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Target Asset</Text>
                      <Text style={styles.infoVal}>
                        {selectedOrder.customer.vehicleOrAsset}
                      </Text>
                    </View>
                  )}
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Recipient</Text>
                    <Text style={styles.infoVal}>
                      {selectedOrder.customer.name} (
                      {selectedOrder.customer.phone})
                    </Text>
                  </View>
                </View>
              </View>

              {/* Payment Summary */}
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Payment Summary</Text>
                <View style={styles.infoBox}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>
                      Diesel Rate ({selectedOrder.quantityLiters}L × ₹
                      {selectedOrder.ratePerLiter})
                    </Text>
                    <Text style={styles.infoVal}>
                      ₹{selectedOrder.amount.toLocaleString("en-IN")}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Delivery & Bowser Fee</Text>
                    <Text style={[styles.infoVal, { color: "#16A34A" }]}>
                      FREE
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>GST & Cess</Text>
                    <Text style={styles.infoVal}>Included</Text>
                  </View>
                  <View style={[styles.infoRow, styles.totalRow]}>
                    <Text style={styles.totalLabel}>Total Paid</Text>
                    <Text style={styles.totalVal}>
                      ₹{selectedOrder.amount.toLocaleString("en-IN")}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Actions */}
              <View style={styles.detailActions}>
                {selectedOrder.status === "In Progress" && (
                  <TouchableOpacity
                    style={[styles.reorderBtn, { backgroundColor: THEME.colors.primary, marginBottom: 4 }]}
                    onPress={() => {
                      setDetailsModalVisible(false);
                      router.push("/(tabs)/(track)");
                    }}
                    activeOpacity={0.85}
                  >
                    <MaterialCommunityIcons
                      name="radar"
                      size={20}
                      color="#FFFFFF"
                    />
                    <Text style={styles.reorderBtnText}>Open Live Tracking</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.invoiceBtn}
                  onPress={() => handleDownloadInvoice(selectedOrder)}
                  activeOpacity={0.8}
                >
                  <MaterialCommunityIcons
                    name="file-download-outline"
                    size={20}
                    color={THEME.colors.primary}
                  />
                  <Text style={styles.invoiceBtnText}>Download Invoice</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.reorderBtn}
                  onPress={() => handleReorder(selectedOrder)}
                  activeOpacity={0.85}
                >
                  <MaterialCommunityIcons
                    name="repeat"
                    size={20}
                    color="#FFFFFF"
                  />
                  <Text style={styles.reorderBtnText}>Reorder Again</Text>
                </TouchableOpacity>

                {selectedOrder.status !== "Completed" &&
                  selectedOrder.status !== "Cancelled" && (
                    <TouchableOpacity
                      style={styles.cancelOrderBtn}
                      onPress={() => handleCancelOrder(selectedOrder.id)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.cancelOrderText}>Cancel Order</Text>
                    </TouchableOpacity>
                  )}
              </View>
            </ScrollView>
          </View>
        )}
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
    paddingBottom: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
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
  headerBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  searchWrapper: {
    marginTop: 4,
  },
  tabsContainer: {
    backgroundColor: THEME.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
    paddingVertical: 10,
  },
  tabsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tabButton: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
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
    gap: 14,
  },
  orderCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.borderLight,
    paddingBottom: 10,
    marginBottom: 12,
  },
  orderIdRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  orderId: {
    fontSize: 13,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  orderDate: {
    fontSize: 11,
    color: THEME.colors.textMuted,
  },
  serviceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  serviceIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: THEME.colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
  },
  quantityInfo: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  amountWrap: {
    alignItems: "flex-end",
  },
  amountLabel: {
    fontSize: 10,
    color: THEME.colors.textMuted,
  },
  amountValue: {
    fontSize: 15,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
    marginTop: 2,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: THEME.colors.borderLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
  },
  locationText: {
    flex: 1,
    fontSize: 12,
    color: THEME.colors.textSecondary,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: THEME.colors.borderLight,
    paddingTop: 10,
  },
  paymentInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  paymentStatusText: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    fontWeight: "500",
  },
  detailsBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  detailsBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.colors.primary,
  },
  resetBtn: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: "center",
  },
  resetBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
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
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
  },
  modalHeaderSub: {
    fontSize: 12,
    color: THEME.colors.primary,
    fontWeight: "700",
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 6,
  },
  modalScroll: {
    flex: 1,
  },
  modalScrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  detailsStatusBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: THEME.radius.md,
  },
  statusBannerTexts: {
    flex: 1,
  },
  statusBannerTitle: {
    fontSize: 14,
    fontWeight: "800",
  },
  statusBannerSub: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  detailSection: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  detailSectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
    marginBottom: 14,
  },
  timelineList: {
    paddingLeft: 4,
  },
  timelineItem: {
    flexDirection: "row",
    minHeight: 56,
  },
  timelineLeft: {
    alignItems: "center",
    width: 24,
    marginRight: 12,
  },
  timelineDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: THEME.colors.borderLight,
    alignItems: "center",
    justifyContent: "center",
  },
  timelineDotDone: {
    backgroundColor: "#16A34A",
  },
  timelineDotActive: {
    backgroundColor: "#0875D1",
    borderWidth: 3,
    borderColor: "#DCFCE7",
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: THEME.colors.border,
    marginVertical: 4,
  },
  timelineLineDone: {
    backgroundColor: "#16A34A",
  },
  timelineRight: {
    flex: 1,
    paddingBottom: 16,
  },
  timelineStepTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
  },
  timelineStepTime: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  timelineStepDesc: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 4,
    lineHeight: 17,
  },
  partnerCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  partnerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: THEME.colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  partnerInfo: {
    flex: 1,
  },
  partnerName: {
    fontSize: 14,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
  },
  partnerVehicle: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  partnerRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  partnerRatingText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#B45309",
  },
  callDriverBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  infoBox: {
    gap: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    flex: 1,
  },
  infoVal: {
    fontSize: 12,
    fontWeight: "600",
    color: THEME.colors.textPrimary,
    flex: 1,
    textAlign: "right",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: THEME.colors.borderLight,
    paddingTop: 10,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
  },
  totalVal: {
    fontSize: 16,
    fontWeight: "900",
    color: THEME.colors.primary,
  },
  detailActions: {
    gap: 12,
    marginTop: 4,
  },
  invoiceBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: THEME.colors.primaryLight,
    borderWidth: 1,
    borderColor: THEME.colors.primary,
    height: 48,
    borderRadius: THEME.radius.md,
  },
  invoiceBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: THEME.colors.primary,
  },
  reorderBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: THEME.colors.primary,
    height: 48,
    borderRadius: THEME.radius.md,
  },
  reorderBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  cancelOrderBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  cancelOrderText: {
    fontSize: 13,
    fontWeight: "700",
    color: THEME.colors.danger,
  },
});
