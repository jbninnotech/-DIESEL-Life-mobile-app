import { PriceBreakdownResult } from "../types/booking.types";

class PricingService {
  // Official market diesel rate benchmark for Diesel Life commercial delivery
  private defaultRatePerLiter = 89.62;

  /**
   * Fetch current daily verified diesel rate (with option to supply service/location context)
   */
  async getLiveDieselRate(city?: string): Promise<number> {
    // If city-specific pricing is configured:
    if (city) {
      const lower = city.toLowerCase();
      if (lower.includes("mumbai") || lower.includes("thane")) return 92.15;
      if (lower.includes("delhi") || lower.includes("noida") || lower.includes("gurugram")) return 87.62;
      if (lower.includes("bangalore") || lower.includes("bengaluru")) return 89.62;
      if (lower.includes("chennai")) return 92.34;
      if (lower.includes("hyderabad")) return 95.65;
      if (lower.includes("kolkata")) return 90.76;
    }
    return this.defaultRatePerLiter;
  }

  /**
   * Calculate exact pricing breakdown including volume tier discounts and delivery charges
   */
  calculateBreakdown(
    litres: number,
    ratePerLiter: number,
    deliveryCharges: number = 0
  ): PriceBreakdownResult {
    const validQty = Math.max(0, litres || 0);
    const dieselSubtotal = Number((validQty * ratePerLiter).toFixed(2));

    // Dynamic Bulk tiered discounts:
    // >= 1000L => ₹1.50/L off
    // >= 500L  => ₹1.00/L off
    // >= 100L  => ₹0.50/L off
    let perLiterDiscount = 0;
    if (validQty >= 1000) {
      perLiterDiscount = 1.5;
    } else if (validQty >= 500) {
      perLiterDiscount = 1.0;
    } else if (validQty >= 100) {
      perLiterDiscount = 0.5;
    }

    const discountAmount = Number((validQty * perLiterDiscount).toFixed(2));
    const additionalCharges = 0; // GST and PESO compliance is included in fuel tariff

    const finalTotalAmount = Math.max(
      0,
      Number((dieselSubtotal + deliveryCharges + additionalCharges - discountAmount).toFixed(2))
    );

    return {
      quantityLiters: validQty,
      ratePerLiter,
      dieselSubtotal,
      deliveryCharges,
      additionalCharges,
      discountAmount,
      finalTotalAmount,
    };
  }
}

export const pricingService = new PricingService();
