import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { THEME } from "../constants/theme";
import { useBookingWorkflow } from "../context/BookingWorkflowContext";
import { FuelSupplier } from "../types/orderWorkflow.types";

import { FlowDeliveryAddressCard } from "../components/booking/FlowDeliveryAddressCard";
import { FlowDeliveryScheduleCard } from "../components/booking/FlowDeliveryScheduleCard";
import { FlowPaymentCard } from "../components/booking/FlowPaymentCard";
import { FlowPaymentSuccessCard } from "../components/booking/FlowPaymentSuccessCard";
import { FlowQuantitySelector } from "../components/booking/FlowQuantitySelector";
import { SupplierDetailModal } from "../components/booking/SupplierDetailModal";
import { SupplierListCard } from "../components/booking/SupplierListCard";

const STEPS = [
  { key: "QUANTITY", label: "Fuel Qty" },
  { key: "SUPPLIER", label: "Supplier" },
  { key: "ADDRESS", label: "Address" },
  { key: "SCHEDULE", label: "Schedule" },
  { key: "PAYMENT", label: "Payment" },
];

export default function BookScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const {
    currentStep,
    goToStep,
    quantityLitres,
    setQuantityLitres,
    selectedSupplier,
    setSelectedSupplier,
    deliveryAddress,
    setDeliveryAddress,
    schedule,
    setSchedule,
    paymentMethod,
    setPaymentMethod,
    priceBreakdown,
    isCalculatingPrice,
    activeOrder,
    completeBookingAndPay,
    resetBooking,
  } = useBookingWorkflow();

  const [modalSupplier, setModalSupplier] = useState<FuelSupplier | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  // Stepper logic
  const stepIdx = STEPS.findIndex((s) => s.key === currentStep);

  const handleSupplierSelected = (sup: FuelSupplier) => {
    setSelectedSupplier(sup);
  };

  const handleViewSupplierDetails = (sup: FuelSupplier) => {
    setModalSupplier(sup);
    setIsDetailModalVisible(true);
  };

  const handlePaySuccess = async () => {
    await completeBookingAndPay();
    goToStep("SUCCESS");
  };

  const handleTrackOrder = () => {
    router.push("/(tabs)/(track)");
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* Modern Gradient Header */}
      <LinearGradient
        colors={["#0891B2", "#0284C7"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.headerGradient, { paddingTop: Math.max(insets.top, 16) }]}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>DIESEL Life Booking</Text>
            <Text style={styles.headerSubtitle}>
              On-demand high-density mobile bowser dispensing
            </Text>
          </View>
          <View style={styles.headerBadge}>
            <MaterialCommunityIcons name="shield-check" size={14} color="#0891B2" />
            <Text style={styles.headerBadgeText}>PESO Certified</Text>
          </View>
        </View>

        {/* Progress Stepper Bar (Hidden on Success) */}
        {currentStep !== "SUCCESS" && (
          <View style={styles.stepperRow}>
            {STEPS.map((s, idx) => {
              const isPast = idx < stepIdx;
              const isCurr = idx === stepIdx;

              return (
                <TouchableOpacity
                  key={s.key}
                  style={styles.stepCol}
                  onPress={() => {
                    // Only allow tapping previous completed steps
                    if (idx < stepIdx) goToStep(s.key as any);
                  }}
                  disabled={idx > stepIdx}
                >
                  <View
                    style={[
                      styles.stepCircle,
                      isCurr && styles.stepCircleCurr,
                      isPast && styles.stepCirclePast,
                    ]}
                  >
                    {isPast ? (
                      <MaterialCommunityIcons name="check" size={12} color="#FFFFFF" />
                    ) : (
                      <Text
                        style={[
                          styles.stepNum,
                          isCurr && styles.stepNumCurr,
                        ]}
                      >
                        {idx + 1}
                      </Text>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.stepLabel,
                      isCurr && styles.stepLabelCurr,
                    ]}
                  >
                    {s.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </LinearGradient>

      {/* Main Content Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* STEP 1: QUANTITY */}
          {currentStep === "QUANTITY" && (
            <View>
              <FlowQuantitySelector
                quantity={quantityLitres}
                onQuantityChange={setQuantityLitres}
                priceBreakdown={priceBreakdown}
                isCalculating={isCalculatingPrice}
              />

              <TouchableOpacity
                style={styles.nextStepBtn}
                onPress={() => goToStep("SUPPLIER")}
                activeOpacity={0.8}
              >
                <Text style={styles.nextStepBtnText}>
                  Continue to Select Supplier ({quantityLitres} L)
                </Text>
                <MaterialCommunityIcons name="arrow-right" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}

          {/* STEP 2: SUPPLIER */}
          {currentStep === "SUPPLIER" && (
            <View>
              <SupplierListCard
                selectedSupplier={selectedSupplier}
                onSelectSupplier={handleSupplierSelected}
                onViewDetails={handleViewSupplierDetails}
                quantityLitres={quantityLitres}
              />

              <View style={styles.navBtnsRow}>
                <TouchableOpacity
                  style={styles.backBtn}
                  onPress={() => goToStep("QUANTITY")}
                >
                  <MaterialCommunityIcons name="arrow-left" size={18} color={THEME.colors.textPrimary} />
                  <Text style={styles.backBtnText}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.nextStepBtn, { flex: 1 }, !selectedSupplier && styles.btnDisabled]}
                  onPress={() => {
                    if (selectedSupplier) goToStep("ADDRESS");
                  }}
                  disabled={!selectedSupplier}
                  activeOpacity={0.8}
                >
                  <Text style={styles.nextStepBtnText}>Next: Delivery Address</Text>
                  <MaterialCommunityIcons name="arrow-right" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* STEP 3: ADDRESS */}
          {currentStep === "ADDRESS" && (
            <View>
              <FlowDeliveryAddressCard
                address={deliveryAddress}
                onUpdateAddress={setDeliveryAddress}
                onConfirm={() => goToStep("SCHEDULE")}
              />

              <TouchableOpacity
                style={styles.backTextBtn}
                onPress={() => goToStep("SUPPLIER")}
              >
                <Text style={styles.backTextBtnTitle}>← Change Supplier</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* STEP 4: SCHEDULE */}
          {currentStep === "SCHEDULE" && (
            <View>
              <FlowDeliveryScheduleCard
                schedule={schedule}
                onUpdateSchedule={setSchedule}
                supplier={selectedSupplier}
                onConfirmSchedule={() => goToStep("PAYMENT")}
              />

              <TouchableOpacity
                style={styles.backTextBtn}
                onPress={() => goToStep("ADDRESS")}
              >
                <Text style={styles.backTextBtnTitle}>← Edit Delivery Address</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* STEP 5: PAYMENT */}
          {currentStep === "PAYMENT" && (
            <View>
              <FlowPaymentCard
                supplier={selectedSupplier}
                quantityLitres={quantityLitres}
                priceBreakdown={priceBreakdown}
                address={deliveryAddress}
                schedule={schedule}
                paymentMethod={paymentMethod}
                onSelectPaymentMethod={setPaymentMethod}
                onPaySuccess={handlePaySuccess}
              />

              <TouchableOpacity
                style={styles.backTextBtn}
                onPress={() => goToStep("SCHEDULE")}
              >
                <Text style={styles.backTextBtnTitle}>← Modify Schedule</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* STEP 6: CONFIRMATION SUCCESS */}
          {currentStep === "SUCCESS" && activeOrder && (
            <FlowPaymentSuccessCard
              order={activeOrder}
              onTrackOrder={handleTrackOrder}
              onDone={() => resetBooking()}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Supplier Details Modal */}
      <SupplierDetailModal
        supplier={modalSupplier}
        visible={isDetailModalVisible}
        onClose={() => setIsDetailModalVisible(false)}
        onConfirmSupplier={(sup) => {
          setSelectedSupplier(sup);
          goToStep("ADDRESS");
        }}
        quantityLitres={quantityLitres}
      />
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
    elevation: 6,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#E0F2FE",
    marginTop: 2,
  },
  headerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  headerBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#0891B2",
  },
  stepperRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stepCol: {
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  stepCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  stepCircleCurr: {
    backgroundColor: "#FFFFFF",
  },
  stepCirclePast: {
    backgroundColor: "#16A34A",
  },
  stepNum: {
    fontSize: 11,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  stepNumCurr: {
    color: "#0891B2",
  },
  stepLabel: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "600",
  },
  stepLabelCurr: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  nextStepBtn: {
    backgroundColor: THEME.colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    elevation: 3,
    shadowColor: THEME.colors.primary,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
  },
  nextStepBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  btnDisabled: {
    opacity: 0.5,
  },
  navBtnsRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    gap: 4,
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
  },
  backTextBtn: {
    alignItems: "center",
    paddingVertical: 8,
    marginTop: 4,
  },
  backTextBtnTitle: {
    fontSize: 13,
    color: THEME.colors.primary,
    fontWeight: "700",
  },
});
