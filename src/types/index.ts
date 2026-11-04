export type SportType = 'Football 7v7' | 'Football 5v5' | 'Box Cricket' | 'Pickleball';

export type SlotStatus = 'available' | 'booked' | 'blocked' | 'selected' | 'past';

export type PaymentStatus = 'paid_full' | 'advance_deposit' | 'pay_at_venue' | 'refunded' | 'upi_pending';

export type PaymentMethod = 'upi' | 'card' | 'cash' | 'split';

export type BookingSource = 'online' | 'walk_in' | 'phone_call' | 'whatsapp';

export interface Pitch {
  id: string;
  name: string;
  subtitle: string;
  sports: SportType[];
  dimensions: string;
  surface: string;
  lighting: string;
  baseWeekdayPrice: number;
  baseWeekendPrice: number;
  peakHourWeekdayPrice: number;
  peakHourWeekendPrice: number;
  fullDayWeekdayPrice: number;
  fullDayWeekendPrice: number;
  features: string[];
  image: string;
}

export interface AddonItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  perMatch?: boolean;
}

export interface Slot {
  id: string;
  pitchId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  displayTime: string; // e.g. "07:00 PM - 08:00 PM"
  price: number;
  isPeak: boolean;
  status: SlotStatus;
  bookingId?: string;
  blockReason?: string;
}

export interface Booking {
  id: string; // e.g. "BG-8921"
  bookingRef: string;
  pitchId: string;
  pitchName: string;
  date: string;
  slotIds: string[];
  timeRange: string;
  durationHours: number;
  sport: SportType;
  
  // Full Day Booking Flag
  isFullDayBooking?: boolean;

  // Customer info
  captainName: string;
  captainPhone: string;
  captainEmail?: string;
  teamName?: string;
  notes?: string;

  // Pricing & Payment
  baseAmount: number;
  addonsAmount: number;
  totalAmount: number;
  advancePaid: number;
  balanceDue: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  source: BookingSource;

  // Direct 0% UPI Verification (Zero Gateway Fees)
  upiUtr?: string;
  paymentScreenshot?: string;
  isUpiVerified?: boolean;
  
  // Selected Addons (preserved for type safety)
  selectedAddons?: {
    id: string;
    name: string;
    price: number;
    qty: number;
  }[];

  // Metadata
  createdAt: string;
  isCheckedIn: boolean;
  checkedInAt?: string;
  status: 'confirmed' | 'completed' | 'cancelled';
}

export interface OwnerSettings {
  turfName: string;
  tagline: string;
  address: string;
  phone: string;
  whatsapp: string;
  upiId: string;
  upiPayeeName: string;
  openTime: string; // "06:00"
  closeTime: string; // "01:00" (next day)
  slotDurationMinutes: number; // 60
  advanceDepositPercentage: number; // 30%
  peakHourStart: string; // "17:00"
  peakHourEnd: string; // "23:00"
  isRainHalted: boolean;
  cancellationAllowedHours: number; // 6 hours before match
  refundPercentage: number; // 80%
}

export interface CommunityLobbyPost {
  id: string;
  captainName: string;
  teamName: string;
  sport: SportType;
  date: string;
  timeSlot: string;
  pitchName: string;
  playersNeeded: number;
  costPerPerson: number;
  skillLevel: 'Beginner' | 'Intermediate' | 'Competitive' | 'Casual';
  whatsappContact: string;
  notes: string;
  createdAt: string;
}

export interface ArenaStats {
  todayBookingsCount: number;
  todayRevenueTotal: number;
  todayAdvanceCollected: number;
  todayBalancePending: number;
  occupancyPercentage: number;
  totalActiveMatches: number;
  pitch1Occupancy: number;
  pitch2Occupancy: number;
}
