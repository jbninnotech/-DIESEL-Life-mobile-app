import { GeoCoordinates, PriceBreakdownResult } from "./booking.types";

export interface FuelSupplier {
  id: string;
  name: string;
  tagline: string;
  logoUrl?: string;
  address: string;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  pricePerLitre: number;
  isAvailable: boolean;
  minOrderLitres: number;
  maxOrderLitres: number;
  contactNumber: string;
  availableSlots: string[];
}

export type BookingStep =
  | "QUANTITY"
  | "SUPPLIER"
  | "SUPPLIER_DETAILS"
  | "ADDRESS"
  | "SCHEDULE"
  | "PAYMENT"
  | "SUCCESS";

export interface DeliveryScheduleSelection {
  type: "now" | "scheduled";
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "Morning (08:00 AM - 11:00 AM)"
  instructions?: string;
}

export interface DeliveryAddressData {
  fullName: string;
  phone: string;
  alternativePhone?: string;
  buildingNumber: string;
  streetName: string;
  area: string;
  city: string;
  state: string;
  pinCode: string;
  deliveryInstructions?: string;
  coordinates: GeoCoordinates;
  isLocationConfirmed: boolean;
}

export type OrderTrackingStatus =
  | "BOOKING_PLACED"
  | "PAYMENT_CONFIRMED"
  | "SUPPLIER_CONFIRMED"
  | "DIESEL_PREPARATION"
  | "DELIVERY_PARTNER_ASSIGNED"
  | "OUT_FOR_DELIVERY"
  | "ARRIVING_AT_DESTINATION"
  | "OTP_VERIFICATION"
  | "DELIVERED_SUCCESSFULLY"
  | "CANCELLED";

export interface DeliveryPartnerInfo {
  id: string;
  name: string;
  phone: string;
  avatarUrl?: string;
  vehicleType: string;
  vehicleRegistration: string;
  rating: number;
}

export interface LiveTrackingState {
  orderId: string;
  currentStatus: OrderTrackingStatus;
  currentStepIndex: number;
  driverLocation: GeoCoordinates;
  destinationLocation: GeoCoordinates;
  routeCoordinates: GeoCoordinates[];
  partner: DeliveryPartnerInfo;
  estimatedArrivalText: string;
  remainingMinutes: number;
  distanceKm: number;
  lastUpdatedAt: string;
  otpCode: string; // Used for DEMO mode verification
  otpVerified: boolean;
  isLiveTrackingActive: boolean;
  isDemoMode: boolean;
}

export interface CompleteOrderData {
  orderId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  supplier: FuelSupplier;
  quantityLitres: number;
  pricePerLitre: number;
  priceBreakdown: PriceBreakdownResult;
  deliveryAddress: DeliveryAddressData;
  schedule: DeliveryScheduleSelection;
  paymentMethod: "upi" | "card" | "netbanking" | "wallet" | "cod";
  paymentStatus: "Paid" | "Pending" | "Failed";
  isDemoPayment: boolean;
  orderStatus: OrderTrackingStatus;
  placedAt: string;
  tracking: LiveTrackingState;
}
