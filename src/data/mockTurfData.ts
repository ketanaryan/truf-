import { Pitch, AddonItem, OwnerSettings, Booking, CommunityLobbyPost } from '../types';

export const PITCHES: Pitch[] = [
  {
    id: 'pitch-1',
    name: 'Pitch A',
    subtitle: '7v7 Football & Box Cricket',
    sports: ['Football 7v7', 'Box Cricket', 'Football 5v5'],
    dimensions: '120 ft × 70 ft (FIFA Spec)',
    surface: '50mm Monofilament Astroturf with Cryogenic SBR Rubber Infill',
    lighting: '8-Pole 500 Lux Broadcast-Grade Philips LED Floodlights',
    baseWeekdayPrice: 1200,
    baseWeekendPrice: 1500,
    peakHourWeekdayPrice: 1800,
    peakHourWeekendPrice: 2200,
    fullDayWeekdayPrice: 15000,
    fullDayWeekendPrice: 20000,
    features: [
      'Pro Dugouts with padded seating for 12 players',
      'Electronic Digital Scoreboard display',
      'High-speed 4K Camera angle setup for match recording',
      'Ceiling netting for zero ball loss cricket play'
    ],
    image: 'https://images.unsplash.com/photo-1529900241451-b05215b2e9ca?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'pitch-2',
    name: 'Pitch B',
    subtitle: '5v5 Football & Pickleball',
    sports: ['Football 5v5', 'Pickleball', 'Box Cricket'],
    dimensions: '90 ft × 50 ft Rebound Enclosure',
    surface: '40mm High-Density Non-Abrasive Shockpad Turf',
    lighting: '6-Pole 400 Lux Anti-Glare GlareShield Lights',
    baseWeekdayPrice: 900,
    baseWeekendPrice: 1200,
    peakHourWeekdayPrice: 1400,
    peakHourWeekendPrice: 1700,
    fullDayWeekdayPrice: 12000,
    fullDayWeekendPrice: 16000,
    features: [
      'Rebound side-boards for lightning-fast wall play',
      'Official Pickleball regulation net system & lines',
      'Dedicated spectator gallery & team benches',
      'High rebound impact perimeter protection'
    ],
    image: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=1200&q=80'
  }
];

// No bulky equipment add-ons per user request
export const ADDONS: AddonItem[] = [];

export const DEFAULT_SETTINGS: OwnerSettings = {
  turfName: 'BATTLEGROUNDS ARENA',
  tagline: 'Premier 24/7 Floodlit Sports Arena & Turf',
  address: 'Plot 42, Arena Boulevard, Next to Metro Pillar 328, Sports Hub',
  phone: '+91 98204 77123',
  whatsapp: '+91 98204 77123',
  upiId: 'battlegroundsturf@icici',
  upiPayeeName: 'Battlegrounds Arena',
  openTime: '06:00',
  closeTime: '01:00',
  slotDurationMinutes: 60,
  advanceDepositPercentage: 30,
  peakHourStart: '17:00',
  peakHourEnd: '23:00',
  isRainHalted: false,
  cancellationAllowedHours: 6,
  refundPercentage: 80
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

export const SAMPLE_RECEIPT_IMAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600" fill="%230b130e"><rect width="400" height="600" rx="24" fill="%230f1b13" stroke="%231f452b" stroke-width="3"/><circle cx="200" cy="100" r="40" fill="%2310b981"/><path d="M185 100l10 10 20-20" stroke="white" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><text x="200" y="170" fill="white" font-size="22" font-family="sans-serif" font-weight="bold" text-anchor="middle">Payment Successful</text><text x="200" y="200" fill="%239ca3af" font-size="13" font-family="sans-serif" text-anchor="middle">Google Pay • UPI Transfer</text><text x="200" y="270" fill="%2334d399" font-size="44" font-family="sans-serif" font-weight="900" text-anchor="middle">₹1,400</text><rect x="30" y="320" width="340" height="220" rx="16" fill="%2308110b" stroke="%23193623"/><text x="50" y="360" fill="%239ca3af" font-size="12" font-family="sans-serif">Paid To</text><text x="50" y="385" fill="white" font-size="16" font-family="sans-serif" font-weight="bold">Battlegrounds Arena</text><text x="50" y="405" fill="%236ee7b7" font-size="12" font-family="monospace">battlegroundsturf@icici</text><line x1="50" y1="425" x2="350" y2="425" stroke="%231f3d28"/><text x="50" y="455" fill="%239ca3af" font-size="12" font-family="sans-serif">UPI Transaction ID / UTR</text><text x="50" y="480" fill="%23fbbf24" font-size="14" font-family="monospace" font-weight="bold">431289012345</text><text x="50" y="515" fill="%239ca3af" font-size="11" font-family="sans-serif">Date: Today • Time: 05:22 PM</text></svg>`;

export const SEED_BOOKINGS: Booking[] = [
  {
    id: 'BG-9102',
    bookingRef: 'BG-9102',
    pitchId: 'pitch-1',
    pitchName: 'Pitch A',
    date: getTodayString(),
    slotIds: ['slot-pitch-1-07:00'],
    timeRange: '07:00 AM - 08:00 AM',
    durationHours: 1,
    sport: 'Football 7v7',
    captainName: 'Aman Sharma',
    captainPhone: '+91 98112 34567',
    teamName: 'Sunrise Strikers',
    notes: 'Morning fitness league warmup match',
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
    pitchId: 'pitch-1',
    pitchName: 'Pitch A',
    date: getTodayString(),
    slotIds: ['slot-pitch-1-18:00', 'slot-pitch-1-19:00'],
    timeRange: '06:00 PM - 08:00 PM',
    durationHours: 2,
    sport: 'Football 7v7',
    captainName: 'Karan Mehra',
    captainPhone: '+91 99201 88492',
    teamName: 'Viper FC',
    notes: '2-hour friendly derby',
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
    pitchId: 'pitch-2',
    pitchName: 'Pitch B',
    date: getTodayString(),
    slotIds: ['slot-pitch-2-19:00'],
    timeRange: '07:00 PM - 08:00 PM',
    durationHours: 1,
    sport: 'Pickleball',
    captainName: 'Sneha Rao',
    captainPhone: '+91 97654 32109',
    teamName: 'Smash Masters',
    notes: 'Mixed doubles practice session',
    baseAmount: 1400,
    addonsAmount: 0,
    totalAmount: 1400,
    advancePaid: 1400,
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
    pitchId: 'pitch-1',
    pitchName: 'Pitch A',
    date: getTodayString(),
    slotIds: ['slot-pitch-1-20:00'],
    timeRange: '08:00 PM - 09:00 PM',
    durationHours: 1,
    sport: 'Box Cricket',
    captainName: 'Vikram Rajput',
    captainPhone: '+91 98334 11223',
    teamName: 'Gully Blasters',
    notes: 'Phone call booking',
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
    pitchId: 'pitch-2',
    pitchName: 'Pitch B',
    date: getTodayString(),
    slotIds: ['slot-pitch-2-21:00'],
    timeRange: '09:00 PM - 10:00 PM',
    durationHours: 1,
    sport: 'Football 5v5',
    captainName: 'Arjun Das',
    captainPhone: '+91 98450 99887',
    teamName: 'NightOwls 5s',
    notes: 'Walk-in booking registered by desk staff',
    baseAmount: 1400,
    addonsAmount: 0,
    totalAmount: 1400,
    advancePaid: 1400,
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
    teamName: 'Metro Strikers',
    sport: 'Football 7v7',
    date: getTodayString(),
    timeSlot: '09:00 PM - 10:00 PM',
    pitchName: 'Pitch A',
    playersNeeded: 2,
    costPerPerson: 180,
    skillLevel: 'Intermediate',
    whatsappContact: '+91 98200 12345',
    notes: 'Need 1 central defender and 1 fast winger for high tempo friendly! Bibs & ball provided.',
    createdAt: '1 hour ago'
  },
  {
    id: 'comm-2',
    captainName: 'Deepak Patel',
    teamName: 'Mavericks Cricket Club',
    sport: 'Box Cricket',
    date: getOffsetDateString(1),
    timeSlot: '07:00 PM - 09:00 PM',
    pitchName: 'Pitch A',
    playersNeeded: 3,
    costPerPerson: 220,
    skillLevel: 'Casual',
    whatsappContact: '+91 98765 43210',
    notes: '8-over tennis ball box cricket showdown! Looking for good all-rounders.',
    createdAt: '3 hours ago'
  },
  {
    id: 'comm-3',
    captainName: 'Tanvi Shah',
    teamName: 'Pickle Smashers',
    sport: 'Pickleball',
    date: getOffsetDateString(1),
    timeSlot: '06:00 PM - 07:00 PM',
    pitchName: 'Pitch B',
    playersNeeded: 1,
    costPerPerson: 250,
    skillLevel: 'Beginner',
    whatsappContact: '+91 99300 98765',
    notes: 'Looking for a 4th player for mixed doubles fun rally. Paddles available at reception!',
    createdAt: '5 hours ago'
  }
];
