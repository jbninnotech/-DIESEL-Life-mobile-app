import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FlowDeliveryOtpCard } from "@/components/tracking/FlowDeliveryOtpCard";
import { FlowDeliveryPartnerCard } from "@/components/tracking/FlowDeliveryPartnerCard";
import { FlowLiveTrackingMap } from "@/components/tracking/FlowLiveTrackingMap";
import { FlowOrderStatusTimeline } from "@/components/tracking/FlowOrderStatusTimeline";
import { FlowOrderSummaryCard } from "@/components/tracking/FlowOrderSummaryCard";
import { THEME } from "@/constants/theme";
import { useBookingWorkflow } from "@/context/BookingWorkflowContext";
import { trackingService } from "@/services/trackingService";
import { CompleteOrderData } from "@/types/orderWorkflow.types";

export default function TrackOrderScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { activeOrder: contextOrder } = useBookingWorkflow();

  const [order, setOrder] = useState<CompleteOrderData | null>(contextOrder);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Load latest active order
  const loadOrder = async () => {
    try {
      const current = await trackingService.getActiveOrder();
      if (current) {
        setOrder({ ...current });
      }
    } catch (e) {
      console.log("Error loading active tracking order", e);
    }
  };

  useEffect(() => {
    if (!order) {
      loadOrder();
    }
  }, []);

  // Subscribe to live GPS coordinates stream
  useEffect(() => {
    if (!order) return;

    const unsubscribe = trackingService.subscribeToLocationUpdates(
      order.orderId,
      (newCoords, eta) => {
        setOrder((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            tracking: {
              ...prev.tracking,
              driverLocation: newCoords,
              remainingMinutes: eta,
              lastUpdatedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          };
        });
      }
    );

    return () => {
      unsubscribe();
    };
  }, [order?.orderId]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrder();
    setRefreshing(false);
  };

  const handleVerifyOtp = async (otp: string): Promise<boolean> => {
    if (!order) return false;
    const res = await trackingService.verifyOtp(order.orderId, otp);
    if (res.success) {
      Alert.alert("Fuel Dispensing Confirmed", res.message);
      await loadOrder();
      return true;
    }
    return false;
  };

  if (!order) {
    return (
      <View style={styles.centerRoot}>
        <ActivityIndicator size="large" color={THEME.colors.primary} />
        <Text style={styles.loadingText}>Fetching Live Tracking Dispatch...</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* Modern Gradient Header */}
      <LinearGradient
        colors={["#0891B2", "#0284C7"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.headerGradient, { paddingTop: Math.max(insets.top, 16) }]}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="arrow-left" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>Live Order Tracking</Text>
            <Text style={styles.headerSubtitle}>
              {order.orderId} • {order.quantityLitres}L Diesel
            </Text>
          </View>

          <TouchableOpacity
            style={styles.refreshBtn}
            onPress={loadOrder}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="refresh" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Main Tracking Content */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* 1. Live Delivery Map (45-55% visual prominence) */}
        <FlowLiveTrackingMap
          driverLocation={order.tracking.driverLocation}
          destinationLocation={order.tracking.destinationLocation}
          routeCoordinates={order.tracking.routeCoordinates}
          partnerName={order.tracking.partner.name}
          isLiveTrackingActive={order.tracking.isLiveTrackingActive}
          isDemoMode={order.tracking.isDemoMode}
          lastUpdated={order.tracking.lastUpdatedAt}
        />

        {/* 2. Delivery Partner Information Card */}
        <FlowDeliveryPartnerCard
          partner={order.tracking.partner}
          estimatedArrival={order.tracking.estimatedArrivalText}
          remainingMinutes={order.tracking.remainingMinutes}
        />

        {/* 3. Live OTP Verification Component */}
        <FlowDeliveryOtpCard
          otpCode={order.tracking.otpCode}
          isVerified={order.tracking.otpVerified}
          onVerify={handleVerifyOtp}
        />

        {/* 4. Order Tracking Status Timeline */}
        <FlowOrderStatusTimeline
          currentStatus={order.tracking.currentStatus}
          currentStepIndex={order.tracking.currentStepIndex}
        />

        {/* 5. Complete Order & Site Summary */}
        <FlowOrderSummaryCard order={order} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  centerRoot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: THEME.colors.background,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    fontWeight: "600",
  },
  headerGradient: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#E0F2FE",
    marginTop: 2,
  },
  refreshBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
});
