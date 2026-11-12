export interface GeoCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
  altitude?: number | null;
  heading?: number | null;
  speed?: number | null;
}

export interface GeocodedAddress {
  formattedAddress: string;
  name?: string;
  street?: string;
  district?: string;
  subregion?: string;
  city: string;
  region?: string;
  postalCode: string;
  country?: string;
  coordinates: GeoCoordinates;
}

export type VehicleCategory =
  | "Car"
  | "Truck"
  | "Bus"
  | "Tractor"
  | "Generator"
  | "Construction Equipment"
  | "Industrial Equipment"
  | "Other";

export type DeliveryScheduleType = "now" | "scheduled";

export type BookingPaymentMethod = "upi" | "cod" | "online" | "wallet";

export interface ServiceabilityResult {
  isServiceable: boolean;
  zoneName?: string;
  deliveryCharge: number;
  minQuantity: number;
  maxQuantity: number;
  estimatedDeliveryMinutes?: number;
  reason?: string;
}

export interface PriceBreakdownResult {
  quantityLiters: number;
  ratePerLiter: number;
  dieselSubtotal: number;
  deliveryCharges: number;
  additionalCharges: number;
  discountAmount: number;
  finalTotalAmount: number;
}

export interface DeliverySlot {
  id: string;
  label: string;
  startHour: number;
  endHour: number;
  available: boolean;
}

export interface DieselBookingFormValues {
  deliveryAddress: string;
  city: string;
  postalCode: string;
  landmark?: string;
  coordinates: GeoCoordinates;
  isLocationConfirmed: boolean;

  litres: number;
  vehicleCategory: VehicleCategory;
  vehicleNumber?: string;

  contactName: string;
  contactNumber: string;
  deliveryInstructions?: string;

  scheduleType: DeliveryScheduleType;
  deliveryDate: string; // YYYY-MM-DD
  deliverySlotId?: string; // Slot ID if scheduled

  paymentMethod: BookingPaymentMethod;
}

export interface ConfirmedBookingResponse {
  success: boolean;
  orderId: string;
  message: string;
  bookingDetails: DieselBookingFormValues & {
    priceSummary: PriceBreakdownResult;
    scheduledSummary: string;
    placedAt: string;
  };
}
