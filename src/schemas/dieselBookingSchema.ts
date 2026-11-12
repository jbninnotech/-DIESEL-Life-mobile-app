import { z } from "zod";

export const vehicleCategories = [
  "Car",
  "Truck",
  "Bus",
  "Tractor",
  "Generator",
  "Construction Equipment",
  "Industrial Equipment",
  "Other",
] as const;

export const paymentMethods = ["upi", "cod", "online", "wallet"] as const;

export const dieselBookingSchema = z
  .object({
    deliveryAddress: z
      .string()
      .min(5, "Delivery address must be at least 5 characters long"),
    city: z.string().min(2, "City name is required"),
    postalCode: z
      .string()
      .min(3, "PIN code is required")
      .regex(/^[0-9A-Za-z -]{3,10}$/, "Invalid postal / PIN code format"),
    landmark: z.string().optional(),
    coordinates: z.object({
      latitude: z.number().refine((lat) => lat >= -90 && lat <= 90, "Invalid latitude"),
      longitude: z.number().refine((lng) => lng >= -180 && lng <= 180, "Invalid longitude"),
      accuracy: z.number().nullable().optional(),
    }),
    isLocationConfirmed: z.boolean().refine((val) => val === true, {
      message: "Please confirm your delivery location on the map",
    }),

    litres: z
      .number()
      .min(5, "Minimum order quantity is 5 Litres")
      .max(10000, "Maximum booking capacity per vehicle is 10,000 Litres"),

    vehicleCategory: z.enum(vehicleCategories),
    vehicleNumber: z
      .string()
      .optional()
      .transform((val) => (val ? val.trim().toUpperCase() : "")),

    contactName: z
      .string()
      .min(2, "Contact person name must be at least 2 characters"),
    contactNumber: z
      .string()
      .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
    deliveryInstructions: z.string().max(300, "Instructions cannot exceed 300 characters").optional(),

    scheduleType: z.enum(["now", "scheduled"]),
    deliveryDate: z.string().min(1, "Delivery date is required"),
    deliverySlotId: z.string().optional(),

    paymentMethod: z.enum(paymentMethods),
  })
  .superRefine((data, ctx) => {
    if (data.scheduleType === "scheduled" && (!data.deliverySlotId || data.deliverySlotId.trim() === "")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select a delivery time slot for scheduled delivery",
        path: ["deliverySlotId"],
      });
    }

    if (["Car", "Truck", "Bus"].includes(data.vehicleCategory)) {
      if (!data.vehicleNumber || data.vehicleNumber.length < 4) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Registration number is required for on-road vehicles",
          path: ["vehicleNumber"],
        });
      }
    }
  });

export type DieselBookingSchemaType = z.infer<typeof dieselBookingSchema>;
