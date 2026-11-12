import { z } from "zod";

export const editProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name cannot exceed 50 characters"),
  email: z
    .string()
    .email("Enter a valid email address (e.g. name@company.com)"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  dob: z.string().optional(),
  gender: z.string().optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "Current password must be at least 6 characters"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase letters and a number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  });

export const addVehicleSchema = z.object({
  name: z.string().min(2, "Asset name is required (e.g. Ashok Leyland 2820)"),
  registrationNumber: z
    .string()
    .min(4, "Registration or asset number is required")
    .transform((val) => val.toUpperCase()),
  category: z.enum([
    "heavy_truck",
    "generator",
    "construction_equipment",
    "fleet_bus",
    "agricultural_tractor",
    "other",
  ]),
  capacityLitres: z
    .number({ error: "Capacity must be a number" })
    .min(5, "Minimum capacity is 5 Litres")
    .max(50000, "Maximum capacity is 50,000 Litres"),
});

export const savedAddressSchema = z.object({
  tag: z.enum(["Home", "Work", "Fleet Depot", "Other"]),
  street: z.string().min(3, "Street address must be at least 3 characters"),
  area: z.string().min(2, "Area or landmark is required"),
  city: z.string().min(2, "City is required"),
  pincode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit PIN code"),
  isDefault: z.boolean().optional(),
});

export type EditProfileFormData = z.infer<typeof editProfileSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type AddVehicleFormData = z.infer<typeof addVehicleSchema>;
export type SavedAddressFormData = z.infer<typeof savedAddressSchema>;
