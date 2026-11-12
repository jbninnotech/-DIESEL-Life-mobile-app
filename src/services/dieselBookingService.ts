import {
  ConfirmedBookingResponse,
  DeliverySlot,
  DieselBookingFormValues,
} from "../types/booking.types";
import { Order } from "../types";
import { MOCK_ORDERS } from "../data/mockData";
import { pricingService } from "./pricingService";
import { locationService } from "./locationService";

class DieselBookingService {
  /**
   * Get dynamic scheduling delivery slots based on date and operational hours
   */
  getAvailableSlots(selectedDateStr: string): DeliverySlot[] {
    const rawSlots = [
      { id: "slot-1", label: "07:00 AM - 09:00 AM", startHour: 7, endHour: 9 },
      { id: "slot-2", label: "09:00 AM - 11:00 AM", startHour: 9, endHour: 11 },
      { id: "slot-3", label: "11:00 AM - 01:00 PM", startHour: 11, endHour: 13 },
      { id: "slot-4", label: "01:00 PM - 03:00 PM", startHour: 13, endHour: 15 },
      { id: "slot-5", label: "03:00 PM - 05:00 PM", startHour: 15, endHour: 17 },
      { id: "slot-6", label: "05:00 PM - 07:00 PM", startHour: 17, endHour: 19 },
      { id: "slot-7", label: "07:00 PM - 10:00 PM", startHour: 19, endHour: 22 },
    ];

    const todayStr = new Date().toISOString().split("T")[0];
    const currentHour = new Date().getHours();

    return rawSlots.map((slot) => {
      // If today and time has passed, disable
      let isAvailable = true;
      if (selectedDateStr === todayStr && currentHour >= slot.startHour) {
        isAvailable = false;
      }
      return {
        ...slot,
        available: isAvailable,
      };
    });
  }

  /**
   * Submit booking payload to backend API (or store with realistic verification)
   */
  async submitDieselBooking(
    payload: DieselBookingFormValues
  ): Promise<ConfirmedBookingResponse> {
    // 1. Double verify serviceability
    const serviceability = await locationService.checkServiceability(
      payload.coordinates,
      payload.litres
    );

    if (!serviceability.isServiceable) {
      throw new Error(
        serviceability.reason || "Delivery location is currently unserviceable by our Bowser fleet."
      );
    }

    // 2. Fetch official rate and calculate final pricing
    const liveRate = await pricingService.getLiveDieselRate(payload.city);
    const priceSummary = pricingService.calculateBreakdown(
      payload.litres,
      liveRate,
      serviceability.deliveryCharge
    );

    // 3. Generate unique order ID
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderId = `DL-${randomNum}`;

    const orderTime = payload.scheduleType === "now" ? "Immediate Dispatch (Est. 45 mins)" : `Slot: ${payload.deliverySlotId || "Standard"}`;

    // 4. Construct comprehensive Order representation and push to app active orders
    const newOrderRecord: Order = {
      id: orderId,
      serviceName: "Doorstep Diesel Delivery",
      serviceCategory: payload.vehicleCategory,
      orderDate: payload.deliveryDate,
      orderTime: orderTime,
      amount: priceSummary.finalTotalAmount,
      quantityLiters: payload.litres,
      ratePerLiter: priceSummary.ratePerLiter,
      deliveryFee: priceSummary.deliveryCharges,
      tax: 0,
      paymentStatus: payload.paymentMethod === "cod" ? "Pending" : "Paid",
      paymentMethod:
        payload.paymentMethod === "upi"
          ? "UPI / QR"
          : payload.paymentMethod === "wallet"
          ? "Diesel Wallet"
          : payload.paymentMethod === "online"
          ? "Net Banking / Card"
          : "Cash on Delivery",
      status: "Confirmed",
      location: {
        address: payload.deliveryAddress,
        city: payload.city,
        pincode: payload.postalCode,
        landmark: payload.landmark,
      },
      customer: {
        name: payload.contactName,
        phone: payload.contactNumber,
        email: "customer@diesellife.in",
        vehicleOrAsset: payload.vehicleNumber
          ? `${payload.vehicleCategory} (${payload.vehicleNumber})`
          : payload.vehicleCategory,
      },
      deliveryPartner: {
        name: "Bowser Unit 09 (Smart Dispenser)",
        phone: "+91 91234 56789",
        vehicleNo: "MH 12 DL 4421",
        rating: 4.9,
      },
      timeline: [
        {
          title: "Order Placed & Confirmed",
          time: "Just now",
          description: `Booking confirmed for ${payload.litres}L of BS-VI High Speed Diesel.`,
          done: true,
          active: true,
        },
        {
          title: "Bowser Assigned",
          time: "Next step",
          description: "Smart meter calibration & PESO dispatch underway.",
          done: false,
        },
        {
          title: "Doorstep Dispensing",
          time: payload.deliveryDate,
          description: "Fuel delivered through automated zero-loss nozzle.",
          done: false,
        },
      ],
    };

    // Prepend to mock database so it displays immediately on the Orders screen
    MOCK_ORDERS.unshift(newOrderRecord);

    return {
      success: true,
      orderId,
      message: `Diesel booking confirmed for ${payload.litres}L at ${payload.deliveryAddress}`,
      bookingDetails: {
        ...payload,
        priceSummary,
        scheduledSummary: `${payload.deliveryDate} • ${orderTime}`,
        placedAt: new Date().toISOString(),
      },
    };
  }
}

export const dieselBookingService = new DieselBookingService();
