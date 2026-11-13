import React, { createContext, useContext, useEffect, useState } from "react";
import { pricingService } from "../services/pricingService";
import { trackingService } from "../services/trackingService";
import { PriceBreakdownResult } from "../types/booking.types";
import {
  BookingStep,
  CompleteOrderData,
  DeliveryAddressData,
  DeliveryScheduleSelection,
  FuelSupplier,
  LiveTrackingState,
} from "../types/orderWorkflow.types";

interface BookingWorkflowContextType {
  // Step Navigation
  currentStep: BookingStep;
  goToStep: (step: BookingStep) => void;

  // Selected State
  quantityLitres: number;
  setQuantityLitres: (qty: number) => void;
  selectedSupplier: FuelSupplier | null;
  setSelectedSupplier: (supplier: FuelSupplier | null) => void;
  deliveryAddress: DeliveryAddressData;
  setDeliveryAddress: (address: DeliveryAddressData) => void;
  schedule: DeliveryScheduleSelection;
  setSchedule: (schedule: DeliveryScheduleSelection) => void;
  paymentMethod: "upi" | "card" | "netbanking" | "wallet" | "cod";
  setPaymentMethod: (method: "upi" | "card" | "netbanking" | "wallet" | "cod") => void;

  // Calculations
  priceBreakdown: PriceBreakdownResult;
  isCalculatingPrice: boolean;

  // Final Order & Tracking
  activeOrder: CompleteOrderData | null;
  completeBookingAndPay: () => Promise<CompleteOrderData>;
  resetBooking: () => void;
  loadOrderForTracking: (orderId: string) => Promise<CompleteOrderData | null>;
}

const defaultAddress: DeliveryAddressData = {
  fullName: "Vikram Malhotra",
  phone: "9876543210",
  alternativePhone: "",
  buildingNumber: "Gate 4, Farm Shed",
  streetName: "Devanahalli Road",
  area: "Agro Zone",
  city: "Bengaluru",
  state: "Karnataka",
  pinCode: "562110",
  deliveryInstructions: "Call driver upon reaching main farm security gate.",
  coordinates: { latitude: 12.9716, longitude: 77.5946 },
  isLocationConfirmed: true,
};

const defaultSchedule: DeliveryScheduleSelection = {
  type: "now",
  date: new Date().toISOString().split("T")[0],
  timeSlot: "Morning (08:00 AM - 11:00 AM)",
};

const BookingWorkflowContext = createContext<BookingWorkflowContextType | null>(null);

export const BookingWorkflowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState<BookingStep>("QUANTITY");
  const [quantityLitres, setQuantityLitres] = useState<number>(20);
  const [selectedSupplier, setSelectedSupplier] = useState<FuelSupplier | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddressData>(defaultAddress);
  const [schedule, setSchedule] = useState<DeliveryScheduleSelection>(defaultSchedule);
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking" | "wallet" | "cod">("upi");
  const [activeOrder, setActiveOrder] = useState<CompleteOrderData | null>(null);
  const [isCalculatingPrice, setIsCalculatingPrice] = useState(false);

  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdownResult>({
    quantityLiters: 20,
    ratePerLiter: 89.62,
    dieselSubtotal: 1792.4,
    deliveryCharges: 0,
    additionalCharges: 40.0,
    discountAmount: 0,
    finalTotalAmount: 1832.4,
  });

  // Calculate pricing dynamically whenever quantity or supplier changes
  useEffect(() => {
    let isMounted = true;
    const updatePrice = async () => {
      setIsCalculatingPrice(true);
      try {
        const rate = selectedSupplier?.pricePerLitre || 89.62;
        const res = pricingService.calculateBreakdown(
          Math.max(20, quantityLitres),
          rate,
          0
        );
        if (isMounted) {
          setPriceBreakdown(res);
        }
      } catch (e) {
        // Fallback calculation
        const rate = selectedSupplier?.pricePerLitre || 89.62;
        const subtotal = quantityLitres * rate;
        if (isMounted) {
          setPriceBreakdown({
            quantityLiters: quantityLitres,
            ratePerLiter: rate,
            dieselSubtotal: subtotal,
            deliveryCharges: 0,
            additionalCharges: 40.0,
            discountAmount: 0,
            finalTotalAmount: subtotal + 40.0,
          });
        }
      } finally {
        if (isMounted) setIsCalculatingPrice(false);
      }
    };
    updatePrice();
    return () => {
      isMounted = false;
    };
  }, [quantityLitres, selectedSupplier, schedule.type]);

  const goToStep = (step: BookingStep) => {
    setCurrentStep(step);
  };

  const completeBookingAndPay = async (): Promise<CompleteOrderData> => {
    const demoBookingId = `DEMO-DL-${Math.floor(10000 + Math.random() * 90000)}`;
    const initialDriverLoc = {
      latitude: deliveryAddress.coordinates.latitude + 0.035,
      longitude: deliveryAddress.coordinates.longitude + 0.025,
    };

    const trackingState: LiveTrackingState = {
      orderId: demoBookingId,
      currentStatus: "OUT_FOR_DELIVERY",
      currentStepIndex: 5,
      driverLocation: initialDriverLoc,
      destinationLocation: deliveryAddress.coordinates,
      routeCoordinates: [
        initialDriverLoc,
        {
          latitude: deliveryAddress.coordinates.latitude + 0.018,
          longitude: deliveryAddress.coordinates.longitude + 0.012,
        },
        deliveryAddress.coordinates,
      ],
      partner: {
        id: "DRV-102",
        name: "Rohit Sharma",
        phone: "+91 99887 76655",
        vehicleType: "Smart Bowser Tanker (5000L)",
        vehicleRegistration: "KA 01 EK 4482",
        rating: 4.9,
      },
      estimatedArrivalText: "25-35 mins",
      remainingMinutes: 30,
      distanceKm: 6.2,
      lastUpdatedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      otpCode: String(Math.floor(1000 + Math.random() * 9000)),
      otpVerified: false,
      isLiveTrackingActive: true,
      isDemoMode: true,
    };

    const newOrder: CompleteOrderData = {
      orderId: demoBookingId,
      customerId: "usr-demo",
      customerName: deliveryAddress.fullName,
      customerPhone: deliveryAddress.phone,
      supplier: selectedSupplier || {
        id: "sup-1",
        name: "GreenField Bio-Diesel & Fuel Depot",
        tagline: "Certified ISO 9001 High-Density Farm Fuel",
        address: "Devanahalli Agro Belt, Bengaluru",
        distanceKm: 4.2,
        rating: 4.9,
        reviewCount: 312,
        pricePerLitre: 89.62,
        isAvailable: true,
        minOrderLitres: 20,
        maxOrderLitres: 5000,
        contactNumber: "+91 80 4910 2200",
        availableSlots: ["Morning", "Afternoon", "Evening"],
      },
      quantityLitres,
      pricePerLitre: selectedSupplier?.pricePerLitre || 89.62,
      priceBreakdown,
      deliveryAddress,
      schedule,
      paymentMethod,
      paymentStatus: "Paid",
      isDemoPayment: true,
      orderStatus: "OUT_FOR_DELIVERY",
      placedAt: "Just now",
      tracking: trackingState,
    };

    await trackingService.saveOrder(newOrder);
    setActiveOrder(newOrder);
    return newOrder;
  };

  const loadOrderForTracking = async (orderId: string): Promise<CompleteOrderData | null> => {
    const order = await trackingService.getOrder(orderId);
    if (order) {
      setActiveOrder(order);
    }
    return order;
  };

  const resetBooking = () => {
    setCurrentStep("QUANTITY");
    setQuantityLitres(20);
    setSelectedSupplier(null);
  };

  return (
    <BookingWorkflowContext.Provider
      value={{
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
        loadOrderForTracking,
      }}
    >
      {children}
    </BookingWorkflowContext.Provider>
  );
};

export const useBookingWorkflow = () => {
  const context = useContext(BookingWorkflowContext);
  if (!context) {
    throw new Error("useBookingWorkflow must be used within a BookingWorkflowProvider");
  }
  return context;
};
