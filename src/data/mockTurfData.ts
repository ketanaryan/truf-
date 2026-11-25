import { Pitch, AddonItem, OwnerSettings, Booking, CommunityLobbyPost, CustomerReview } from '../types';

export const PITCHES: Pitch[] = [
  {
    id: 'box-cricket-1',
    name: 'Box Cricket Turf',
    subtitle: 'Floodlit Box Cricket Arena with Heavy Ceiling Netting',
    sports: ['Box Cricket'],
    dimensions: '120 ft × 65 ft Enclosed Rebound Cage',
    surface: '50mm Monofilament Astroturf with Rubber Infill & Shockpad',
    lighting: '8-Pole 500 Lux Broadcast-Grade Sports Floodlights',
    baseWeekdayPrice: 1200,
    baseWeekendPrice: 1500,
    peakHourWeekdayPrice: 1800,
    peakHourWeekendPrice: 2200,
    fullDayWeekdayPrice: 15000,
    fullDayWeekendPrice: 20000,
    features: [
      'Heavy-gauge ceiling and perimeter netting (zero ball loss)',
      'Match-grade wooden stumps, bails & umpire gear provided',
      'Dual player dugouts with shaded seating for 12 players per side',
      'Marked batting crease, bowling crease & 15m bowler run-up',
      'Rubber studs, turf trainers & flat sneakers allowed'
    ],
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80'
  }
];

// No bulky equipment add-ons per user request
export const ADDONS: AddonItem[] = [];

export const DEFAULT_SETTINGS: OwnerSettings = {
  turfName: 'BATTLEGROUNDS CRICKET TURF',
  tagline: 'Premier 24/7 Floodlit Box Cricket Arena',
  address: 'Plot 42, Arena Boulevard, Next to Metro Pillar 328, Sports Hub',
  phone: '+91 98204 77123',
  whatsapp: '+91 98204 77123',
  upiId: 'battlegroundsturf@icici',
  upiPayeeName: 'Battlegrounds Box Cricket Turf',
  openTime: '06:00',
  closeTime: '01:00',
  slotDurationMinutes: 60,
  advanceDepositPercentage: 30,
  peakHourStart: '17:00',
  peakHourEnd: '23:00',
  isRainHalted: false,
  cancellationAllowedHours: 6,
  refundPercentage: 80,
  googleReviewUrl: 'https://search.google.com/local/writereview?placeid=battlegrounds-arena'
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

export const SAMPLE_RECEIPT_IMAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600" fill="%230b130e"><rect width="400" height="600" rx="24" fill="%230f1b13" stroke="%231f452b" stroke-width="3"/><circle cx="200" cy="100" r="40" fill="%2310b981"/><path d="M185 100l10 10 20-20" stroke="white" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><text x="200" y="170" fill="white" font-size="22" font-family="sans-serif" font-weight="bold" text-anchor="middle">Payment Successful</text><text x="200" y="200" fill="%239ca3af" font-size="13" font-family="sans-serif" text-anchor="middle">Google Pay • UPI Transfer</text><text x="200" y="270" fill="%2334d399" font-size="44" font-family="sans-serif" font-weight="900" text-anchor="middle">₹1,400</text><rect x="30" y="320" width="340" height="220" rx="16" fill="%2308110b" stroke="%23193623"/><text x="50" y="360" fill="%239ca3af" font-size="12" font-family="sans-serif">Paid To</text><text x="50" y="385" fill="white" font-size="16" font-family="sans-serif" font-weight="bold">Battlegrounds Cricket Turf</text><text x="50" y="405" fill="%236ee7b7" font-size="12" font-family="monospace">battlegroundsturf@icici</text><line x1="50" y1="425" x2="350" y2="425" stroke="%231f3d28"/><text x="50" y="455" fill="%239ca3af" font-size="12" font-family="sans-serif">UPI Transaction ID / UTR</text><text x="50" y="480" fill="%23fbbf24" font-size="14" font-family="monospace" font-weight="bold">431289012345</text><text x="50" y="515" fill="%239ca3af" font-size="11" font-family="sans-serif">Date: Today • Time: 05:22 PM</text></svg>`;

export const SEED_BOOKINGS: Booking[] = [
  {
    id: 'BG-9102',
    bookingRef: 'BG-9102',
    pitchId: 'box-cricket-1',
    pitchName: 'Box Cricket Turf',
    date: getTodayString(),
    slotIds: ['slot-box-cricket-1-07:00'],
    timeRange: '07:00 AM - 08:00 AM',
    durationHours: 1,
    sport: 'Box Cricket',
    captainName: 'Aman Sharma',
    captainPhone: '+91 98112 34567',
    teamName: 'Sunrise Strikers',
    notes: 'Morning tennis ball practice session',
    baseAmount: 1200,
    addonsAmount: 0,
    totalAmount: 1200,
    advancePaid: 1200,
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
    id: 'BG-9105',
    bookingRef: 'BG-9105',
    pitchId: 'box-cricket-1',
    pitchName: 'Box Cricket Turf',
    date: getTodayString(),
    slotIds: ['slot-box-cricket-1-18:00', 'slot-box-cricket-1-19:00'],
    timeRange: '06:00 PM - 08:00 PM',
    durationHours: 2,
    sport: 'Box Cricket',
    captainName: 'Karan Mehra',
    captainPhone: '+91 99201 88492',
    teamName: 'Gully Kings XI',
    notes: '2-hour 8-over friendly derby',
    baseAmount: 3600,
    addonsAmount: 0,
    totalAmount: 3600,
    advancePaid: 1200,
    balanceDue: 2400,
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
    id: 'BG-9108',
    bookingRef: 'BG-9108',
    pitchId: 'box-cricket-1',
    pitchName: 'Box Cricket Turf',
    date: getTodayString(),
    slotIds: ['slot-box-cricket-1-19:00'],
    timeRange: '07:00 PM - 08:00 PM',
    durationHours: 1,
    sport: 'Box Cricket',
    captainName: 'Sneha Rao',
    captainPhone: '+91 97654 32109',
    teamName: 'Smash Hitters',
    notes: 'Corporate box cricket match',
    baseAmount: 1800,
    addonsAmount: 0,
    totalAmount: 1800,
    advancePaid: 1800,
    balanceDue: 0,
    paymentStatus: 'upi_pending',
    paymentMethod: 'upi',
    upiUtr: '431289012345',
    paymentScreenshot: SAMPLE_RECEIPT_IMAGE,
    isUpiVerified: false,
    source: 'online',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    isCheckedIn: false,
    status: 'confirmed'
  },
  {
    id: 'BG-9112',
    bookingRef: 'BG-9112',
    pitchId: 'box-cricket-1',
    pitchName: 'Box Cricket Turf',
    date: getTodayString(),
    slotIds: ['slot-box-cricket-1-20:00'],
    timeRange: '08:00 PM - 09:00 PM',
    durationHours: 1,
    sport: 'Box Cricket',
    captainName: 'Vikram Rajput',
    captainPhone: '+91 98334 11223',
    teamName: 'Gully Blasters',
    notes: 'Phone reservation for tennis ball cricket',
    baseAmount: 1800,
    addonsAmount: 0,
    totalAmount: 1800,
    advancePaid: 500,
    balanceDue: 1300,
    paymentStatus: 'advance_deposit',
    paymentMethod: 'cash',
    source: 'phone_call',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    isCheckedIn: false,
    status: 'confirmed'
  },
  {
    id: 'BG-9115',
    bookingRef: 'BG-9115',
    pitchId: 'box-cricket-1',
    pitchName: 'Box Cricket Turf',
    date: getTodayString(),
    slotIds: ['slot-box-cricket-1-21:00'],
    timeRange: '09:00 PM - 10:00 PM',
    durationHours: 1,
    sport: 'Box Cricket',
    captainName: 'Arjun Das',
    captainPhone: '+91 98450 99887',
    teamName: 'NightOwls XI',
    notes: 'Walk-in booking for floodlit cricket match',
    baseAmount: 1800,
    addonsAmount: 0,
    totalAmount: 1800,
    advancePaid: 1800,
    balanceDue: 0,
    paymentStatus: 'paid_full',
    paymentMethod: 'cash',
    source: 'walk_in',
    createdAt: new Date().toISOString(),
    isCheckedIn: false,
    status: 'confirmed'
  }
];

export const SEED_COMMUNITY_POSTS: CommunityLobbyPost[] = [
  {
    id: 'comm-1',
    captainName: 'Rohit Verma',
    teamName: 'Metro Strikers CC',
    sport: 'Box Cricket',
    date: getTodayString(),
    timeSlot: '09:00 PM - 10:00 PM',
    pitchName: 'Box Cricket Turf',
    playersNeeded: 2,
    costPerPerson: 180,
    skillLevel: 'Intermediate',
    whatsappContact: '+91 98200 12345',
    notes: 'Need 1 all-rounder and 1 fast bowler for high tempo 8-over box cricket. Stumps and Vicky tennis balls provided.',
    createdAt: '1 hour ago'
  },
  {
    id: 'comm-2',
    captainName: 'Deepak Patel',
    teamName: 'Mavericks Cricket Club',
    sport: 'Box Cricket',
    date: getOffsetDateString(1),
    timeSlot: '07:00 PM - 09:00 PM',
    pitchName: 'Box Cricket Turf',
    playersNeeded: 3,
    costPerPerson: 220,
    skillLevel: 'Casual',
    whatsappContact: '+91 98765 43210',
    notes: '8-over tennis ball box cricket showdown! Looking for good batsmen and all-rounders.',
    createdAt: '3 hours ago'
  },
  {
    id: 'comm-3',
    captainName: 'Kunal Joshi',
    teamName: 'Royal Challengers Turf XI',
    sport: 'Box Cricket',
    date: getOffsetDateString(1),
    timeSlot: '08:00 PM - 10:00 PM',
    pitchName: 'Box Cricket Turf',
    playersNeeded: 2,
    costPerPerson: 200,
    skillLevel: 'Competitive',
    whatsappContact: '+91 99300 98765',
    notes: 'Weekend tournament practice. Looking for top-order batsman and wicketkeeper.',
    createdAt: '5 hours ago'
  }
];

export const SEED_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    name: 'Karan Mehra',
    team: 'Gully Kings XI',
    sport: 'Box Cricket',
    rating: 5,
    date: 'Played 2 days ago',
    comment: 'The ceiling net height is fantastic — you can play lofted shots without the ball getting tangled immediately. Rubber studs had great grip on the 50mm grass with zero slipping.',
    verified: true
  },
  {
    id: 'rev-2',
    name: 'Vikram Rajput',
    team: 'Gully Blasters CC',
    sport: 'Box Cricket',
    rating: 5,
    date: 'Played yesterday',
    comment: 'Booked 2 hours for our weekend cricket derby. High perimeter nets mean not a single tennis ball is lost. Chilled RO water and clean dugouts were top notch!',
    verified: true
  },
  {
    id: 'rev-3',
    name: 'Sneha Rao',
    team: 'Corporate XI',
    sport: 'Box Cricket',
    rating: 5,
    date: 'Weekly Regular',
    comment: 'Consistent pitch bounce for hard tennis ball cricket. Booking online with token deposit was seamless, and the QR match pass verified instantly at the counter.',
    verified: true
  },
  {
    id: 'rev-4',
    name: 'Aman Sharma',
    team: 'Sunrise Strikers',
    sport: 'Box Cricket',
    rating: 5,
    date: '3 days ago',
    comment: 'Early morning 7 AM slot was ready with wooden stumps already pitched. Direct 0% UPI transfer with screenshot upload saved us transaction charges.',
    verified: true
  }
];
