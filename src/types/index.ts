export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "In Progress"
  | "Completed"
  | "Cancelled";

export type PaymentStatus = "Paid" | "Pending" | "Refunded" | "Failed";

export interface TimelineEvent {
  title: string;
  time: string;
  description: string;
  done: boolean;
  active?: boolean;
}

export interface Order {
  id: string;
  serviceName: string;
  serviceCategory: string;
  orderDate: string;
  orderTime: string;
  amount: number;
  quantityLiters: number;
  ratePerLiter: number;
  deliveryFee: number;
  tax: number;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  status: OrderStatus;
  location: {
    address: string;
    city: string;
    pincode: string;
    landmark?: string;
  };
  customer: {
    name: string;
    phone: string;
    email: string;
    vehicleOrAsset?: string;
  };
  deliveryPartner?: {
    name: string;
    phone: string;
    vehicleNo: string;
    rating: number;
  };
  timeline: TimelineEvent[];
}

export type TransactionType = "credit" | "debit" | "refund" | "payment";
export type TransactionStatus = "Completed" | "Pending" | "Failed";

export interface WalletTransaction {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  referenceId: string;
  paymentMethod: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  tag?: string;
  pricePerLiter?: number;
  available: boolean;
}

export interface FuelStation {
  id: string;
  name: string;
  address: string;
  distance: string;
  openStatus: string;
  rating: number;
  dieselPrice: number;
  hasBulkDelivery: boolean;
  phone: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  discount: string;
  gradientColors: [string, string];
  actionText: string;
}

export interface UserAddress {
  id: string;
  tag: "Home" | "Work" | "Fleet Depot" | "Other";
  street: string;
  area: string;
  city: string;
  pincode: string;
  isDefault: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  avatarUrl: string;
  walletBalance: number;
  totalOrdersCount: number;
  activeOrdersCount: number;
  loyaltyPoints: number;
  memberTier: string;
}
