import { Pitch, AddonItem, OwnerSettings, Booking, CommunityLobbyPost, CustomerReview } from '../types';

export const PITCHES: Pitch[] = [
  {
    id: 'sonawane-pitch-1',
    name: "Sonawane's Multi Sport Turf",
    subtitle: 'Enclosed Floodlit Turf for Cricket & Football with Heavy Netting',
    sports: ['Box Cricket', 'Football'],
    dimensions: '120 ft × 65 ft Enclosed Rebound Cage',
    surface: '50mm High-Density Astroturf with Shockpad Cushioning',
    lighting: 'Anti-Glare High-Lumen Sports Floodlights',
    baseWeekdayPrice: 600,
    baseWeekendPrice: 700,
    peakHourWeekdayPrice: 800,
    peakHourWeekendPrice: 800,
    fullDayWeekdayPrice: 8000,
    fullDayWeekendPrice: 10000,
    features: [
      'Heavy-gauge ceiling and perimeter netting (zero ball loss)',
      'Match-grade wooden stumps, bails & match gear provided',
      'Dual player dugouts with shaded seating for squads',
      'Marked batting crease, bowling crease & bowler run-up',
      'Rubber studs, turf trainers & flat sneakers allowed'
    ],
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80'
  }
];

// No bulky equipment add-ons per user request
export const SONAWANE_GOOGLE_REVIEW_URL = "https://www.google.com/maps/place/Sonawane's+Multi+Sport+Turf/@19.9602879,73.7707331,17z/data=!4m8!3m7!1s0x3bddebed03becdf1:0x868ac5e0f1c6c8bf!8m2!3d19.9602879!4d73.7707331!9m1!1b1!16s%2Fg%2F11k4jz57b_";

export const ADDONS: AddonItem[] = [];

export const DEFAULT_SETTINGS: OwnerSettings = {
  turfName: "Sonawane's Multi Sport Turf",
  tagline: 'Cricket & Football Turf in Rane Nagar, Nashik',
  address: 'Plot No. 1, Sonawane Mala, Chetana Nagar, Rane Nagar, Nashik, Maharashtra 422009',
  phone: '+91 94035 64779',
  whatsapp: '+91 94035 64779',
  upiId: '9403564779@okaxis',
  upiPayeeName: 'Kiran Sonawane (Sonawane Multi Sport Turf)',
  openTime: '06:00',
  closeTime: '23:00',
  slotDurationMinutes: 60,
  advanceDepositPercentage: 30,
  peakHourStart: '17:00',
  peakHourEnd: '23:00',
  isRainHalted: false,
  cancellationAllowedHours: 6,
  refundPercentage: 80,
  googleReviewUrl: SONAWANE_GOOGLE_REVIEW_URL
};

// Generate today's date formatted as YYYY-MM-DD in local time
export const getTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getOffsetDateString = (offsetDays: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const SAMPLE_RECEIPT_IMAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600" fill="%230b130e"><rect width="400" height="600" rx="24" fill="%230f1b13" stroke="%231f452b" stroke-width="3"/><circle cx="200" cy="100" r="40" fill="%2310b981"/><path d="M185 100l10 10 20-20" stroke="white" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><text x="200" y="170" fill="white" font-size="22" font-family="sans-serif" font-weight="bold" text-anchor="middle">Payment Successful</text><text x="200" y="200" fill="%239ca3af" font-size="13" font-family="sans-serif" text-anchor="middle">Google Pay • UPI Transfer</text><text x="200" y="270" fill="%2334d399" font-size="44" font-family="sans-serif" font-weight="900" text-anchor="middle">₹800</text><rect x="30" y="320" width="340" height="220" rx="16" fill="%2308110b" stroke="%23193623"/><text x="50" y="360" fill="%239ca3af" font-size="12" font-family="sans-serif">Paid To</text><text x="50" y="385" fill="white" font-size="16" font-family="sans-serif" font-weight="bold">Sonawane's Multi Sport Turf</text><text x="50" y="405" fill="%236ee7b7" font-size="12" font-family="monospace">9403564779@okaxis</text><line x1="50" y1="425" x2="350" y2="425" stroke="%231f3d28"/><text x="50" y="455" fill="%239ca3af" font-size="12" font-family="sans-serif">UPI Transaction ID / UTR</text><text x="50" y="480" fill="%23fbbf24" font-size="14" font-family="monospace" font-weight="bold">431289012345</text><text x="50" y="515" fill="%239ca3af" font-size="11" font-family="sans-serif">Date: Today • Time: 05:22 PM</text></svg>`;

export const SEED_BOOKINGS: Booking[] = [
  {
    id: 'SMT-9102',
    bookingRef: 'SMT-9102',
    pitchId: 'sonawane-pitch-1',
    pitchName: "Sonawane's Multi Sport Turf",
    date: getTodayString(),
    slotIds: ['slot-sonawane-pitch-1-07:00'],
    timeRange: '07:00 AM - 08:00 AM',
    durationHours: 1,
    sport: 'Box Cricket',
    captainName: 'Aman Sharma',
    captainPhone: '+91 98112 34567',
    teamName: 'Sunrise Strikers',
    notes: 'Morning tennis ball practice session',
    baseAmount: 600,
    addonsAmount: 0,
    totalAmount: 600,
    advancePaid: 600,
    balanceDue: 0,
    paymentStatus: 'paid_full',
    paymentMethod: 'upi',
    upiUtr: '430982716352',
    isUpiVerified: true,
    source: 'online',
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    isCheckedIn: true,
    checkedInAt: '06:55 AM',
    status: 'completed'
  },
  {
    id: 'SMT-9105',
    bookingRef: 'SMT-9105',
    pitchId: 'sonawane-pitch-1',
    pitchName: "Sonawane's Multi Sport Turf",
    date: getTodayString(),
    slotIds: ['slot-sonawane-pitch-1-18:00', 'slot-sonawane-pitch-1-19:00'],
    timeRange: '06:00 PM - 08:00 PM',
    durationHours: 2,
    sport: 'Box Cricket',
    captainName: 'Karan Mehra',
    captainPhone: '+91 99201 88492',
    teamName: 'Nashik Kings XI',
    notes: '2-hour evening friendly derby under floodlights',
    baseAmount: 1600,
    addonsAmount: 0,
    totalAmount: 1600,
    advancePaid: 480,
    balanceDue: 1120,
    paymentStatus: 'advance_deposit',
    paymentMethod: 'upi',
    upiUtr: '431098234190',
    isUpiVerified: true,
    source: 'online',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    isCheckedIn: false,
    status: 'confirmed'
  },
  {
    id: 'SMT-9108',
    bookingRef: 'SMT-9108',
    pitchId: 'sonawane-pitch-1',
    pitchName: "Sonawane's Multi Sport Turf",
    date: getTodayString(),
    slotIds: ['slot-sonawane-pitch-1-20:00'],
    timeRange: '08:00 PM - 09:00 PM',
    durationHours: 1,
    sport: 'Football',
    captainName: 'Sneha Rao',
    captainPhone: '+91 97654 32109',
    teamName: 'Nashik FC',
    notes: '5v5 football night match',
    baseAmount: 800,
    addonsAmount: 0,
    totalAmount: 800,
    advancePaid: 800,
    balanceDue: 0,
    paymentStatus: 'paid_full',
    paymentMethod: 'upi',
    upiUtr: '431109482103',
    isUpiVerified: true,
    source: 'online',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    isCheckedIn: false,
    status: 'confirmed'
  }
];

export const SEED_COMMUNITY_POSTS: CommunityLobbyPost[] = [
  {
    id: 'comm-1',
    captainName: 'Rohit Verma',
    teamName: 'Nashik Strikers CC',
    sport: 'Box Cricket',
    date: getTodayString(),
    timeSlot: '09:00 PM - 10:00 PM',
    pitchName: "Sonawane's Multi Sport Turf",
    playersNeeded: 2,
    costPerPerson: 100,
    skillLevel: 'Intermediate',
    whatsappContact: '+91 94035 64779',
    notes: 'Need 1 all-rounder and 1 fast bowler for high tempo 8-over box cricket at Sonawane Turf. Stumps and Vicky tennis balls ready.',
    createdAt: '1 hour ago'
  },
  {
    id: 'comm-2',
    captainName: 'Deepak Patel',
    teamName: 'Rane Nagar Warriors',
    sport: 'Football',
    date: getOffsetDateString(1),
    timeSlot: '07:00 PM - 09:00 PM',
    pitchName: "Sonawane's Multi Sport Turf",
    playersNeeded: 3,
    costPerPerson: 120,
    skillLevel: 'Casual',
    whatsappContact: '+91 94035 64779',
    notes: '5v5 friendly football showdown at Sonawane Turf. Looking for 2 midfielders and a goalkeeper.',
    createdAt: '3 hours ago'
  },
  {
    id: 'comm-3',
    captainName: 'Kunal Joshi',
    teamName: 'Chetana Nagar Cricket Club',
    sport: 'Box Cricket',
    date: getOffsetDateString(1),
    timeSlot: '08:00 PM - 10:00 PM',
    pitchName: "Sonawane's Multi Sport Turf",
    playersNeeded: 2,
    costPerPerson: 100,
    skillLevel: 'Competitive',
    whatsappContact: '+91 94035 64779',
    notes: 'Tournament practice match. Looking for solid batsman and wicketkeeper.',
    createdAt: '5 hours ago'
  }
];

export const SEED_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    name: 'Karan Mehra',
    team: 'Nashik Kings XI',
    sport: 'Box Cricket',
    rating: 5,
    date: 'Played 2 days ago',
    comment: 'Great turf in Rane Nagar area! The ceiling net height is spacious, and the pitch bounce is very consistent for tennis balls. Kiran bhai was very helpful with booking.',
    verified: true
  },
  {
    id: 'rev-2',
    name: 'Vikram Rajput',
    team: 'Chetana Nagar CC',
    sport: 'Box Cricket',
    rating: 4,
    date: 'Played yesterday',
    comment: 'Very good multi-sport turf for both cricket and football. High perimeter nets mean zero balls lost into the surrounding mala. Reasonable rates starting ₹500-₹800/hr.',
    verified: true
  },
  {
    id: 'rev-3',
    name: 'Sneha Rao',
    team: 'Nashik FC',
    sport: 'Football',
    rating: 4,
    date: 'Weekly Regular',
    comment: 'Ideal for 5v5 football and weekend box cricket. Floodlights are bright and clean drinking water is provided. Easy booking via WhatsApp and Google Pay.',
    verified: true
  },
  {
    id: 'rev-4',
    name: 'Aman Sharma',
    team: 'Sunrise Strikers',
    sport: 'Box Cricket',
    rating: 5,
    date: '3 days ago',
    comment: 'Early morning 7 AM slot was ready on time. Stumps were in place and direct GPay confirmation made the check-in smooth.',
    verified: true
  }
];
