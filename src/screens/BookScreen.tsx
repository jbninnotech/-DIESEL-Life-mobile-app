import React, { useState, useEffect, useCallback, useRef, ElementRef } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { THEME } from "../constants/theme";
import { useCurrentLocation } from "../hooks/useCurrentLocation";
import { useBookingForm } from "../hooks/useBookingForm";
import { pricingService } from "../services/pricingService";
import { dieselBookingService } from "../services/dieselBookingService";
import { LocationSearchResult } from "../services/locationService";
import {
  BookingPaymentMethod,
  ConfirmedBookingResponse,
  DeliveryScheduleType,
  GeoCoordinates,
  PriceBreakdownResult,
  VehicleCategory,
} from "../types/booking.types";

// Booking Section Components
import { BookingHeader } from "../components/booking/BookingHeader";
import { SectionHeader } from "../components/common/SectionHeader";
import { LocationSelector } from "../components/booking/LocationSelector";
import { DieselQuantitySelector } from "../components/booking/DieselQuantitySelector";
import { VehicleDetails } from "../components/booking/VehicleDetails";
import { CustomerDetails } from "../components/booking/CustomerDetails";
import { DeliverySchedule } from "../components/booking/DeliverySchedule";
import { PriceBreakdown } from "../components/booking/PriceBreakdown";
import { PaymentSelector } from "../components/booking/PaymentSelector";
import { BookingSummary } from "../components/booking/BookingSummary";
import { ConfirmBookingButton } from "../components/booking/ConfirmBookingButton";

export default function BookScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ElementRef<typeof ScrollView>>(null);

  const todayStr = new Date().toISOString().split("T")[0];

  // Location Hook
  const {
    addressData,
    serviceability,
    isLoading: isLocationLoading,
    error: locationError,
    detectLocation,
    setCustomCoordinates,
    clearError: clearLocationError,
  } = useCurrentLocation(false);

  // Form Hook
  const form = useBookingForm(todayStr);
  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = form;

  const formValues = watch();

  // Dynamic Pricing State
  const [, setLiveRate] = useState<number>(89.62);
  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdownResult>({
    quantityLiters: 20,
    ratePerLiter: 89.62,
    dieselSubtotal: 1792.4,
    deliveryCharges: 150,
    additionalCharges: 0,
    discountAmount: 0,
    finalTotalAmount: 1942.4,
  });

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccessModal, setBookingSuccessModal] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedBookingResponse | null>(null);

  // Sync GPS Address into Form Values
  useEffect(() => {
    if (addressData) {
      setValue("deliveryAddress", addressData.formattedAddress, { shouldValidate: true });
      setValue("city", addressData.city, { shouldValidate: true });
      setValue("postalCode", addressData.postalCode || "560001", { shouldValidate: true });
      setValue("coordinates", addressData.coordinates, { shouldValidate: true });
    }
  }, [addressData, setValue]);

  // Recalculate Dynamic Pricing on changes
  const updatePricing = useCallback(async () => {
    const rate = await pricingService.getLiveDieselRate(formValues.city);
    setLiveRate(rate);

    const deliveryFee = serviceability?.deliveryCharge ?? (formValues.litres >= 50 ? 0 : 150);
    const breakdown = pricingService.calculateBreakdown(
      formValues.litres,
      rate,
      deliveryFee
    );
    setPriceBreakdown(breakdown);
  }, [formValues.city, formValues.litres, serviceability]);

  useEffect(() => {
    updatePricing();
  }, [updatePricing]);

  // Available Time Slots for current date
  const availableSlots = dieselBookingService.getAvailableSlots(formValues.deliveryDate);

  // Handlers for Location
  const handleDetectGPS = async () => {
    setValue("isLocationConfirmed", false);
    await detectLocation();
  };

  const handleSelectSearchResult = async (result: LocationSearchResult) => {
    setValue("deliveryAddress", result.fullAddress, { shouldValidate: true });
    setValue("isLocationConfirmed", false);
    if (result.coordinates) {
      await setCustomCoordinates(result.coordinates);
    }
  };

  const handlePinNudge = async (newCoords: GeoCoordinates) => {
    setValue("isLocationConfirmed", false);
    await setCustomCoordinates(newCoords);
  };

  const handleConfirmLocation = () => {
    setValue("isLocationConfirmed", true, { shouldValidate: true });
    Alert.alert(
      "Location Confirmed",
      "Delivery spot confirmed for Bowser fleet routing.",
      [{ text: "OK" }]
    );
  };

  const scrollToSection = (_section: string) => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  // Submit Booking Order
  const onBookingSubmit = async (data: typeof formValues) => {
    if (isSubmitting) return;

    // Serviceability check
    if (serviceability && !serviceability.isServiceable) {
      Alert.alert(
        "Serviceability Notice",
        serviceability.reason || "The selected coordinates are currently out of delivery range."
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await dieselBookingService.submitDieselBooking(data);
      setConfirmedOrder(response);
      setBookingSuccessModal(true);
    } catch (err: any) {
      Alert.alert(
        "Booking Error",
        err.message || "Failed to submit diesel booking. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.root}>
      {/* Header Gradient */}
      <LinearGradient
        colors={[THEME.colors.gradientStart, THEME.colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.headerGradient, { paddingTop: insets.top + 4 }]}
      >
        <BookingHeader onBack={() => router.back()} />
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* SECTION B: DELIVERY LOCATION */}
          <View style={styles.sectionCard}>
            <SectionHeader
              title="1. Delivery Location"
              subtitle="Pinpoint exact spot for mobile fuel bowser"
              icon="map-marker-radius"
            />
            <LocationSelector
              coordinates={formValues.coordinates}
              addressData={addressData}
              serviceability={serviceability}
              isLoading={isLocationLoading}
              error={locationError}
              isConfirmed={formValues.isLocationConfirmed}
              onDetectLocation={handleDetectGPS}
              onSelectSearchResult={handleSelectSearchResult}
              onPinNudged={handlePinNudge}
              onConfirmLocation={handleConfirmLocation}
              onClearError={clearLocationError}
            />
            {errors.isLocationConfirmed && (
              <Text style={styles.errorText}>{errors.isLocationConfirmed.message}</Text>
            )}
            {errors.deliveryAddress && (
              <Text style={styles.errorText}>{errors.deliveryAddress.message}</Text>
            )}
          </View>

          {/* SECTION C: DIESEL QUANTITY */}
          <View style={styles.sectionCard}>
            <SectionHeader
              title="2. Diesel Quantity"
              subtitle="Pure High-Speed Diesel (BS-VI Standard)"
              icon="gas-station"
            />
            <DieselQuantitySelector
              quantity={formValues.litres}
              onChangeQuantity={(q: number) => setValue("litres", q, { shouldValidate: true })}
              error={errors.litres?.message}
              minQuantity={serviceability?.minQuantity || 5}
              maxQuantity={serviceability?.maxQuantity || 10000}
            />
          </View>

          {/* SECTION D: ASSET & VEHICLE DETAILS */}
          <View style={styles.sectionCard}>
            <SectionHeader
              title="3. Fueling Asset & Category"
              subtitle="Select vehicle or stationary generator"
              icon="car-multiple"
            />
            <VehicleDetails
              selectedCategory={formValues.vehicleCategory}
              onSelectCategory={(cat: VehicleCategory) =>
                setValue("vehicleCategory", cat, { shouldValidate: true })
              }
              vehicleNumber={formValues.vehicleNumber || ""}
              onChangeVehicleNumber={(num: string) =>
                setValue("vehicleNumber", num, { shouldValidate: true })
              }
              categoryError={errors.vehicleCategory?.message}
              numberError={errors.vehicleNumber?.message}
            />
          </View>

          {/* SECTION D.2: CONTACT & INSTRUCTIONS */}
          <View style={styles.sectionCard}>
            <SectionHeader
              title="4. Contact & Gate Instructions"
              subtitle="Details for Bowser operator coordination"
              icon="account-box-outline"
            />
            <CustomerDetails
              contactName={formValues.contactName}
              onChangeContactName={(n: string) => setValue("contactName", n, { shouldValidate: true })}
              contactNumber={formValues.contactNumber}
              onChangeContactNumber={(p: string) =>
                setValue("contactNumber", p, { shouldValidate: true })
              }
              deliveryInstructions={formValues.deliveryInstructions}
              onChangeDeliveryInstructions={(i: string) => setValue("deliveryInstructions", i)}
              nameError={errors.contactName?.message}
              phoneError={errors.contactNumber?.message}
            />
          </View>

          {/* SECTION E: DELIVERY DATE AND TIME */}
          <View style={styles.sectionCard}>
            <SectionHeader
              title="5. Delivery Scheduling"
              subtitle="Immediate express dispatch or pre-scheduled slot"
              icon="clock-time-four"
            />
            <DeliverySchedule
              scheduleType={formValues.scheduleType}
              onChangeScheduleType={(t: DeliveryScheduleType) =>
                setValue("scheduleType", t, { shouldValidate: true })
              }
              selectedDate={formValues.deliveryDate}
              onSelectDate={(d: string) => setValue("deliveryDate", d, { shouldValidate: true })}
              selectedSlotId={formValues.deliverySlotId}
              onSelectSlot={(s: string) => setValue("deliverySlotId", s, { shouldValidate: true })}
              availableSlots={availableSlots}
              slotError={errors.deliverySlotId?.message}
              isServiceable={serviceability?.isServiceable}
            />
          </View>

          {/* SECTION F: DYNAMIC PRICE BREAKDOWN */}
          <PriceBreakdown breakdown={priceBreakdown} />

          {/* SECTION G: PAYMENT METHOD */}
          <View style={styles.sectionCard}>
            <SectionHeader
              title="6. Payment Method"
              subtitle="Select secure checkout option"
              icon="credit-card-check"
            />
            <PaymentSelector
              selectedMethod={formValues.paymentMethod}
              onSelectMethod={(m: BookingPaymentMethod) => setValue("paymentMethod", m, { shouldValidate: true })}
              error={errors.paymentMethod?.message}
            />
          </View>

          {/* SECTION H: BOOKING SUMMARY */}
          <BookingSummary
            formValues={formValues}
            priceBreakdown={priceBreakdown}
            onEditSection={scrollToSection}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* SECTION I: STICKY CONFIRM BOOKING BOTTOM BAR */}
      <ConfirmBookingButton
        onPress={handleSubmit(onBookingSubmit)}
        isLoading={isSubmitting}
        totalAmount={priceBreakdown.finalTotalAmount}
        disabled={isSubmitting}
      />

      {/* SUCCESS CONFIRMATION MODAL */}
      <Modal
        visible={bookingSuccessModal}
        animationType="fade"
        transparent
        onRequestClose={() => setBookingSuccessModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalSuccessIcon}>
              <MaterialCommunityIcons name="check-decagram" size={48} color="#FFFFFF" />
            </View>

            <Text style={styles.modalTitle}>Diesel Booking Confirmed!</Text>
            <Text style={styles.modalOrderNumber}>Order ID: {confirmedOrder?.orderId}</Text>
            <Text style={styles.modalMsg}>
              {confirmedOrder?.message ||
                "Your fuel order has been scheduled. Bowser operator assigned for dispensing."}
            </Text>

            <View style={styles.modalSummaryBox}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Fuel Quantity</Text>
                <Text style={styles.summaryVal}>{confirmedOrder?.bookingDetails.litres} Litres</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Total Amount</Text>
                <Text style={styles.summaryVal}>
                  ₹{confirmedOrder?.bookingDetails.priceSummary.finalTotalAmount.toLocaleString("en-IN")}
                </Text>
              </View>
            </View>

            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={styles.modalPrimaryBtn}
                onPress={() => {
                  setBookingSuccessModal(false);
                  router.push("/(tabs)/(orders)");
                }}
              >
                <Text style={styles.modalPrimaryText}>View In Orders</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalSecondaryBtn}
                onPress={() => {
                  setBookingSuccessModal(false);
                  router.push("/(tabs)/(home)");
                }}
              >
                <Text style={styles.modalSecondaryText}>Return to Home</Text>
              </TouchableOpacity>
            </View>
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
  headerGradient: {
    paddingHorizontal: 0,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
    gap: 16,
  },
  sectionCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  errorText: {
    color: THEME.colors.danger,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 4,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.75)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.xl,
    padding: 24,
    alignItems: "center",
    elevation: 10,
  },
  modalSuccessIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: THEME.colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
    textAlign: "center",
  },
  modalOrderNumber: {
    fontSize: 14,
    fontWeight: "700",
    color: THEME.colors.primary,
    marginTop: 4,
  },
  modalMsg: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 18,
  },
  modalSummaryBox: {
    width: "100%",
    backgroundColor: THEME.colors.background,
    borderRadius: THEME.radius.md,
    padding: 12,
    marginVertical: 16,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  summaryItem: {
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 10,
    color: THEME.colors.textMuted,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  summaryVal: {
    fontSize: 14,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
    marginTop: 2,
  },
  modalBtns: {
    width: "100%",
    gap: 10,
  },
  modalPrimaryBtn: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 14,
    borderRadius: THEME.radius.lg,
    alignItems: "center",
  },
  modalPrimaryText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  modalSecondaryBtn: {
    backgroundColor: THEME.colors.borderLight,
    paddingVertical: 12,
    borderRadius: THEME.radius.lg,
    alignItems: "center",
  },
  modalSecondaryText: {
    color: THEME.colors.textSecondary,
    fontSize: 13,
    fontWeight: "700",
  },
});
