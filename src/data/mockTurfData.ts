import { Pitch, AddonItem, OwnerSettings, Booking, CommunityLobbyPost } from '../types';

export const PITCHES: Pitch[] = [
  {
    id: 'pitch-1',
    name: 'The Colosseum (Pitch A)',
    subtitle: 'FIFA 2-Star Grade 7v7 & Box Cricket Arena',
    sports: ['Football 7v7', 'Box Cricket', 'Football 5v5'],
    dimensions: '120 ft × 70 ft (FIFA Spec)',
    surface: '50mm Monofilament Astroturf with Cryogenic SBR Rubber Infill',
    lighting: '8-Pole 500 Lux Broadcast-Grade Philips LED Floodlights',
    baseWeekdayPrice: 1200,
    baseWeekendPrice: 1500,
    peakHourWeekdayPrice: 1800,
    peakHourWeekendPrice: 2200,
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
    name: 'The Thunder Cage (Pitch B)',
    subtitle: 'High-Paced 5v5 Football & Pro Pickleball Court',
    sports: ['Football 5v5', 'Pickleball', 'Box Cricket'],
    dimensions: '90 ft × 50 ft Rebound Enclosure',
    surface: '40mm High-Density Non-Abrasive Shockpad Turf',
    lighting: '6-Pole 400 Lux Anti-Glare GlareShield Lights',
    baseWeekdayPrice: 900,
    baseWeekendPrice: 1200,
    peakHourWeekdayPrice: 1400,
    peakHourWeekendPrice: 1700,
    features: [
      'Rebound side-boards for lightning-fast wall play',
      'Official Pickleball regulation net system & lines',
      'Dedicated spectator gallery & team benches',
      'High rebound impact perimeter protection'
    ],
    image: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=1200&q=80'
  }
];

export const ADDONS: AddonItem[] = [
  {
    id: 'addon-ball',
    name: 'Pro Match Ball Pack',
    description: 'FIFA Pro football or 4 high-seam heavy tennis balls for Box Cricket',
    price: 150,
    icon: 'CircleDot',
    perMatch: true
  },
  {
    id: 'addon-bibs',
    name: 'Team Bibs Set (14 Pcs)',
    description: 'Clean, sanitized breathable mesh bibs in dual high-contrast neon shades',
    price: 120,
    icon: 'Shirt',
    perMatch: true
  },
  {
    id: 'addon-referee',
    name: 'Official Turf Referee / Umpire',
    description: 'Trained match referee to officiate competitive clash or tournament game',
    price: 450,
    icon: 'ShieldCheck',
    perMatch: true
  },
  {
    id: 'addon-recording',
    name: '4K Match Recording & Reel',
    description: 'Full HD multi-angle match footage + cloud link delivered in 2 hours',
    price: 350,
    icon: 'Video',
    perMatch: true
  },
  {
    id: 'addon-hydration',
    name: 'Hydration & Energy Crate',
    description: '4 chilled Gatorades, 2 Red Bulls & 12 chilled sealed RO mineral waters',
    price: 499,
    icon: 'Zap',
    perMatch: true
  },
  {
    id: 'addon-turf-shoes',
    name: 'Turf Cleat / Boots Rental',
    description: 'Specialized rubber stud turf shoes (available sizes: UK 7 - 11)',
    price: 100,
    icon: 'Footprints',
    perMatch: false
  }
];

export const DEFAULT_SETTINGS: OwnerSettings = {
  turfName: 'BATTLEGROUNDS ARENA',
  tagline: 'Premier 24/7 Floodlit Sports Arena & Turf',
  address: 'Plot 42, Arena Boulevard, Next to Metro Pillar 328, Sports Hub',
  phone: '+91 98204 77123',
  whatsapp: '+91 98204 77123',
  upiId: 'battlegroundsarena@icici',
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

export const SEED_BOOKINGS: Booking[] = [
  {
    id: 'BG-9102',
    bookingRef: 'BG-9102',
    pitchId: 'pitch-1',
    pitchName: 'The Colosseum (Pitch A)',
    date: getTodayString(),
    slotIds: ['slot-p1-07:00'],
    timeRange: '07:00 AM - 08:00 AM',
    durationHours: 1,
    sport: 'Football 7v7',
    captainName: 'Aman Sharma',
    captainPhone: '+91 98112 34567',
    teamName: 'Sunrise Strikers',
    notes: 'Morning fitness league warmup match',
    baseAmount: 1200,
    addonsAmount: 150,
    totalAmount: 1350,
    advancePaid: 1350,
    balanceDue: 0,
    paymentStatus: 'paid_full',
    paymentMethod: 'upi',
    source: 'online',
    selectedAddons: [{ id: 'addon-ball', name: 'Pro Match Ball Pack', price: 150, qty: 1 }],
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    isCheckedIn: true,
    checkedInAt: '06:55 AM',
    status: 'completed'
  },
  {
    id: 'BG-9105',
    bookingRef: 'BG-9105',
    pitchId: 'pitch-1',
    pitchName: 'The Colosseum (Pitch A)',
    date: getTodayString(),
    slotIds: ['slot-p1-18:00', 'slot-p1-19:00'],
    timeRange: '06:00 PM - 08:00 PM',
    durationHours: 2,
    sport: 'Football 7v7',
    captainName: 'Karan Mehra',
    captainPhone: '+91 99201 88492',
    teamName: 'Viper FC',
    notes: '2-hour friendly derby vs Red Devils',
    baseAmount: 3600,
    addonsAmount: 620,
    totalAmount: 4220,
    advancePaid: 1500,
    balanceDue: 2720,
    paymentStatus: 'advance_deposit',
    paymentMethod: 'upi',
    source: 'online',
    selectedAddons: [
      { id: 'addon-ball', name: 'Pro Match Ball Pack', price: 150, qty: 1 },
      { id: 'addon-bibs', name: 'Team Bibs Set (14 Pcs)', price: 120, qty: 1 },
      { id: 'addon-recording', name: '4K Match Recording & Reel', price: 350, qty: 1 }
    ],
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    isCheckedIn: false,
    status: 'confirmed'
  },
  {
    id: 'BG-9108',
    bookingRef: 'BG-9108',
    pitchId: 'pitch-2',
    pitchName: 'The Thunder Cage (Pitch B)',
    date: getTodayString(),
    slotIds: ['slot-p2-19:00'],
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
    paymentStatus: 'paid_full',
    paymentMethod: 'card',
    source: 'online',
    selectedAddons: [],
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    isCheckedIn: false,
    status: 'confirmed'
  },
  {
    id: 'BG-9112',
    bookingRef: 'BG-9112',
    pitchId: 'pitch-1',
    pitchName: 'The Colosseum (Pitch A)',
    date: getTodayString(),
    slotIds: ['slot-p1-20:00'],
    timeRange: '08:00 PM - 09:00 PM',
    durationHours: 1,
    sport: 'Box Cricket',
    captainName: 'Vikram Rajput',
    captainPhone: '+91 98334 11223',
    teamName: 'Gully Blasters',
    notes: 'Phone call booking - requested referee',
    baseAmount: 1800,
    addonsAmount: 450,
    totalAmount: 2250,
    advancePaid: 700,
    balanceDue: 1550,
    paymentStatus: 'advance_deposit',
    paymentMethod: 'cash',
    source: 'phone_call',
    selectedAddons: [{ id: 'addon-referee', name: 'Official Turf Referee / Umpire', price: 450, qty: 1 }],
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    isCheckedIn: false,
    status: 'confirmed'
  },
  {
    id: 'BG-9115',
    bookingRef: 'BG-9115',
    pitchId: 'pitch-2',
    pitchName: 'The Thunder Cage (Pitch B)',
    date: getTodayString(),
    slotIds: ['slot-p2-21:00'],
    timeRange: '09:00 PM - 10:00 PM',
    durationHours: 1,
    sport: 'Football 5v5',
    captainName: 'Arjun Das',
    captainPhone: '+91 98450 99887',
    teamName: 'NightOwls 5s',
    notes: 'Walk-in booking registered by desk staff',
    baseAmount: 1400,
    addonsAmount: 499,
    totalAmount: 1899,
    advancePaid: 1899,
    balanceDue: 0,
    paymentStatus: 'paid_full',
    paymentMethod: 'upi',
    source: 'walk_in',
    selectedAddons: [{ id: 'addon-hydration', name: 'Hydration & Energy Crate', price: 499, qty: 1 }],
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
    pitchName: 'The Colosseum (Pitch A)',
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
    pitchName: 'The Colosseum (Pitch A)',
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
    pitchName: 'The Thunder Cage (Pitch B)',
    playersNeeded: 1,
    costPerPerson: 250,
    skillLevel: 'Beginner',
    whatsappContact: '+91 99300 98765',
    notes: 'Looking for a 4th player for mixed doubles fun rally. Paddles can be borrowed from reception!',
    createdAt: '5 hours ago'
  }
];
