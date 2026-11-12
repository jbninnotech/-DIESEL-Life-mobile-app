import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  dieselBookingSchema,
  DieselBookingSchemaType,
} from "../schemas/dieselBookingSchema";
import { MOCK_USER } from "../data/mockData";

export function useBookingForm(
  defaultDate: string
): UseFormReturn<DieselBookingSchemaType> {
  const form = useForm<DieselBookingSchemaType>({
    resolver: zodResolver(dieselBookingSchema) as any,
    defaultValues: {
      deliveryAddress: "",
      city: "",
      postalCode: "",
      landmark: "",
      coordinates: {
        latitude: 12.9716,
        longitude: 77.5946,
      },
      isLocationConfirmed: false,
      litres: 20,
      vehicleCategory: "Generator",
      vehicleNumber: "",
      contactName: MOCK_USER.name || "Vikram Malhotra",
      contactNumber: MOCK_USER.phone.replace(/\D/g, "").slice(-10) || "9876543210",
      deliveryInstructions: "",
      scheduleType: "now",
      deliveryDate: defaultDate,
      deliverySlotId: "slot-2",
      paymentMethod: "upi",
    },
    mode: "onTouched",
  });

  return form;
}
