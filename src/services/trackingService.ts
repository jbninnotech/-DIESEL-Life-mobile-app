import { GeoCoordinates } from "../types/booking.types";
import {
  CompleteOrderData,
  DeliveryAddressData,
  DeliveryScheduleSelection,
  FuelSupplier,
  LiveTrackingState,
  OrderTrackingStatus,
} from "../types/orderWorkflow.types";

export interface ITrackingService {
  getOrder(orderId: string): Promise<CompleteOrderData | null>;
  saveOrder(order: CompleteOrderData): Promise<CompleteOrderData>;
  getActiveOrder(): Promise<CompleteOrderData | null>;
  verifyOtp(orderId: string, enteredOtp: string): Promise<{ success: boolean; message: string }>;
  subscribeToLocationUpdates(
    orderId: string,
    callback: (coords: GeoCoordinates, etaMinutes: number) => void
  ): () => void;
  updateOrderStatus(orderId: string, status: OrderTrackingStatus): Promise<boolean>;
}

// Memory & Local state adapter (DEMO mode clearly designated)
class TrackingServiceImpl implements ITrackingService {
  private activeOrders: Map<string, CompleteOrderData> = new Map();
  private listeners: Map<string, Array<(coords: GeoCoordinates, etaMinutes: number) => void>> = new Map();
  private intervalIds: Map<string, any> = new Map();

  constructor() {
    this.initDefaultDemoOrder();
  }

  private initDefaultDemoOrder() {
    const demoOrigin: GeoCoordinates = { latitude: 12.985, longitude: 77.72 };
    const demoDest: GeoCoordinates = { latitude: 12.9716, longitude: 77.5946 };

    const demoTracking: LiveTrackingState = {
      orderId: "DL-89421",
      currentStatus: "OUT_FOR_DELIVERY",
      currentStepIndex: 5,
      driverLocation: demoOrigin,
      destinationLocation: demoDest,
      routeCoordinates: [
        demoOrigin,
        { latitude: 12.981, longitude: 77.68 },
        { latitude: 12.977, longitude: 77.64 },
        demoDest,
      ],
      partner: {
        id: "DRV-102",
        name: "Rohit Sharma",
        phone: "+91 99887 76655",
        vehicleType: "Smart Bowser Tanker (5000L)",
        vehicleRegistration: "KA 01 EK 4482",
        rating: 4.9,
      },
      estimatedArrivalText: "18-25 mins",
      remainingMinutes: 22,
      distanceKm: 4.8,
      lastUpdatedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      otpCode: "4829",
      otpVerified: false,
      isLiveTrackingActive: true,
      isDemoMode: true,
    };

    const demoAddress: DeliveryAddressData = {
      fullName: "Vikram Malhotra",
      phone: "+91 98765 43210",
      buildingNumber: "Gate 3, Agro Depot",
      streetName: "Whitefield Main Rd",
      area: "Mahadevapura",
      city: "Bengaluru",
      state: "Karnataka",
      pinCode: "560048",
      coordinates: demoDest,
      isLocationConfirmed: true,
    };

    const demoSupplier: FuelSupplier = {
      id: "sup-1",
      name: "GreenField Bio-Diesel & Fuel Depot",
      tagline: "Certified ISO 9001 High-Density Farm & Commercial Fuel",
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
    };

    const demoOrder: CompleteOrderData = {
      orderId: "DL-89421",
      customerId: "usr-1",
      customerName: "Vikram Malhotra",
      customerPhone: "+91 98765 43210",
      supplier: demoSupplier,
      quantityLitres: 50,
      pricePerLitre: 89.62,
      priceBreakdown: {
        quantityLiters: 50,
        ratePerLiter: 89.62,
        dieselSubtotal: 4481.0,
        deliveryCharges: 0,
        additionalCharges: 40.0,
        discountAmount: 0,
        finalTotalAmount: 4521.0,
      },
      deliveryAddress: demoAddress,
      schedule: {
        type: "now",
        date: new Date().toISOString().split("T")[0],
        timeSlot: "Immediate Express Bowser",
      },
      paymentMethod: "upi",
      paymentStatus: "Paid",
      isDemoPayment: true,
      orderStatus: "OUT_FOR_DELIVERY",
      placedAt: "Today, 10:15 AM",
      tracking: demoTracking,
    };

    this.activeOrders.set(demoOrder.orderId, demoOrder);
  }

  async getOrder(orderId: string): Promise<CompleteOrderData | null> {
    return this.activeOrders.get(orderId) || null;
  }

  async getActiveOrder(): Promise<CompleteOrderData | null> {
    const list = Array.from(this.activeOrders.values());
    if (list.length === 0) return null;
    return list[list.length - 1];
  }

  async saveOrder(order: CompleteOrderData): Promise<CompleteOrderData> {
    this.activeOrders.set(order.orderId, order);
    return order;
  }

  async verifyOtp(orderId: string, enteredOtp: string): Promise<{ success: boolean; message: string }> {
    const order = this.activeOrders.get(orderId);
    if (!order) return { success: false, message: "Order not found" };

    if (order.tracking.otpCode === enteredOtp.trim()) {
      order.tracking.otpVerified = true;
      order.tracking.currentStatus = "DELIVERED_SUCCESSFULLY";
      order.tracking.currentStepIndex = 8;
      order.orderStatus = "DELIVERED_SUCCESSFULLY";
      this.activeOrders.set(orderId, order);
      return { success: true, message: "OTP verified successfully. Fuel dispensing confirmed!" };
    }
    return { success: false, message: "Invalid OTP. Please check with your driver." };
  }

  async updateOrderStatus(orderId: string, status: OrderTrackingStatus): Promise<boolean> {
    const order = this.activeOrders.get(orderId);
    if (!order) return false;
    order.tracking.currentStatus = status;
    order.orderStatus = status;
    this.activeOrders.set(orderId, order);
    return true;
  }

  subscribeToLocationUpdates(
    orderId: string,
    callback: (coords: GeoCoordinates, etaMinutes: number) => void
  ): () => void {
    if (!this.listeners.has(orderId)) {
      this.listeners.set(orderId, []);
    }
    this.listeners.get(orderId)?.push(callback);

    // DEMO simulation: update every 6 seconds smoothly interpolating
    if (!this.intervalIds.has(orderId)) {
      let stepProgress = 0;
      const interval = setInterval(() => {
        const order = this.activeOrders.get(orderId);
        if (!order || !order.tracking.isLiveTrackingActive || order.tracking.otpVerified) {
          return;
        }

        stepProgress = (stepProgress + 0.05) % 1;
        const currentLoc = order.tracking.driverLocation;
        const targetLoc = order.tracking.destinationLocation;

        const updatedLat = currentLoc.latitude + (targetLoc.latitude - currentLoc.latitude) * 0.04;
        const updatedLng = currentLoc.longitude + (targetLoc.longitude - currentLoc.longitude) * 0.04;

        const newCoords: GeoCoordinates = {
          latitude: updatedLat,
          longitude: updatedLng,
        };

        const updatedEta = Math.max(2, Math.round(order.tracking.remainingMinutes * 0.98));
        order.tracking.driverLocation = newCoords;
        order.tracking.remainingMinutes = updatedEta;
        order.tracking.lastUpdatedAt = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        const subscribers = this.listeners.get(orderId) || [];
        subscribers.forEach((fn) => fn(newCoords, updatedEta));
      }, 5000);

      this.intervalIds.set(orderId, interval);
    }

    return () => {
      const subs = this.listeners.get(orderId) || [];
      const idx = subs.indexOf(callback);
      if (idx !== -1) subs.splice(idx, 1);
      if (subs.length === 0) {
        clearInterval(this.intervalIds.get(orderId));
        this.intervalIds.delete(orderId);
      }
    };
  }
}

export const trackingService = new TrackingServiceImpl();
