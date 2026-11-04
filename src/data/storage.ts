import { Booking, OwnerSettings, Slot, SlotStatus, CommunityLobbyPost, Pitch } from '../types';
import { PITCHES, DEFAULT_SETTINGS, SEED_BOOKINGS, SEED_COMMUNITY_POSTS, getTodayString } from './mockTurfData';

const STORAGE_KEYS = {
  BOOKINGS: 'battlegrounds_turf_bookings_v1',
  SETTINGS: 'battlegrounds_turf_settings_v1',
  BLOCKED_SLOTS: 'battlegrounds_turf_blocked_slots_v1',
  COMMUNITY_POSTS: 'battlegrounds_turf_community_posts_v1',
};

// Initialize or get bookings
export const getStoredBookings = (): Booking[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(SEED_BOOKINGS));
      return SEED_BOOKINGS;
    }
    const parsed: Booking[] = JSON.parse(data);
    return parsed.map(b => ({
      ...b,
      pitchName: b.pitchName
        ? b.pitchName
            .replace('The Colosseum (Pitch A)', 'Pitch A')
            .replace('The Thunder Cage (Pitch B)', 'Pitch B')
            .replace('The Colosseum', 'Pitch A')
            .replace('The Thunder Cage', 'Pitch B')
        : (b.pitchId === 'pitch-2' ? 'Pitch B' : 'Pitch A')
    }));
  } catch (e) {
    console.error('Failed to load bookings from storage', e);
    return SEED_BOOKINGS;
  }
};

export const saveBookings = (bookings: Booking[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  } catch (e) {
    console.error('Failed to save bookings', e);
  }
};

export const addBooking = (booking: Booking): Booking[] => {
  const current = getStoredBookings();
  const updated = [booking, ...current];
  saveBookings(updated);
  return updated;
};

export const updateBooking = (bookingId: string, updates: Partial<Booking>): Booking[] => {
  const current = getStoredBookings();
  const updated = current.map(b => (b.id === bookingId ? { ...b, ...updates } : b));
  saveBookings(updated);
  return updated;
};

export const approveUpiBooking = (bookingId: string): Booking[] => {
  const current = getStoredBookings();
  const updated = current.map(b => {
    if (b.id === bookingId) {
      return {
        ...b,
        isUpiVerified: true,
        paymentStatus: 'paid_full' as const,
        advancePaid: b.totalAmount,
        balanceDue: 0
      };
    }
    return b;
  });
  saveBookings(updated);
  return updated;
};

// Settings
export const getStoredSettings = (): OwnerSettings => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings: OwnerSettings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
};

// Blocked slots: Map of string keys -> reason
// Key format: `${date}_${pitchId}_${time}` e.g. "2026-11-03_pitch-1_15:00"
export interface BlockedSlotRecord {
  key: string;
  date: string;
  pitchId: string;
  time: string;
  reason: string;
  blockedAt: string;
}

export const getStoredBlockedSlots = (): BlockedSlotRecord[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BLOCKED_SLOTS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveBlockedSlots = (blocked: BlockedSlotRecord[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.BLOCKED_SLOTS, JSON.stringify(blocked));
  } catch (e) {
    console.error('Failed to save blocked slots', e);
  }
};

export const toggleBlockSlot = (date: string, pitchId: string, time: string, reason: string): BlockedSlotRecord[] => {
  const current = getStoredBlockedSlots();
  const key = `${date}_${pitchId}_${time}`;
  const existingIndex = current.findIndex(b => b.key === key);

  let updated: BlockedSlotRecord[];
  if (existingIndex >= 0) {
    // Unblock
    updated = current.filter(b => b.key !== key);
  } else {
    // Block
    updated = [...current, {
      key,
      date,
      pitchId,
      time,
      reason: reason || 'Facility Maintenance / Private Event',
      blockedAt: new Date().toISOString()
    }];
  }
  saveBlockedSlots(updated);
  return updated;
};

// Community posts
export const getStoredCommunityPosts = (): CommunityLobbyPost[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.COMMUNITY_POSTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.COMMUNITY_POSTS, JSON.stringify(SEED_COMMUNITY_POSTS));
      return SEED_COMMUNITY_POSTS;
    }
    return JSON.parse(data);
  } catch (e) {
    return SEED_COMMUNITY_POSTS;
  }
};

export const addCommunityPost = (post: CommunityLobbyPost): CommunityLobbyPost[] => {
  const current = getStoredCommunityPosts();
  const updated = [post, ...current];
  try {
    localStorage.setItem(STORAGE_KEYS.COMMUNITY_POSTS, JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }
  return updated;
};

// Reset demo data
export const resetDemoData = () => {
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(SEED_BOOKINGS));
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
  localStorage.removeItem(STORAGE_KEYS.BLOCKED_SLOTS);
  localStorage.setItem(STORAGE_KEYS.COMMUNITY_POSTS, JSON.stringify(SEED_COMMUNITY_POSTS));
};

// Slot Generation Engine
export const OPERATING_HOURS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00'
];

export const formatDisplayTime = (startHour24: string): string => {
  const [hourStr, minStr] = startHour24.split(':');
  const h = parseInt(hourStr, 10);
  const nextH = (h + 1) % 24;

  const formatH = (num: number) => {
    const period = num >= 12 ? 'PM' : 'AM';
    const displayNum = num % 12 === 0 ? 12 : num % 12;
    return `${displayNum.toString().padStart(2, '0')}:${minStr} ${period}`;
  };

  return `${formatH(h)} - ${formatH(nextH)}`;
};

export const isWeekend = (dateStr: string): boolean => {
  const d = new Date(dateStr + 'T00:00:00');
  const day = d.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
};

export const isPeakHour = (timeStr: string, settings: OwnerSettings): boolean => {
  const [h] = timeStr.split(':').map(Number);
  const [startH] = settings.peakHourStart.split(':').map(Number);
  const [endH] = settings.peakHourEnd.split(':').map(Number);
  
  if (h >= startH && h <= endH) return true;
  if (h === 0) return true; // Midnight floodlight is high demand
  return false;
};

export const getSlotPrice = (
  pitchId: string,
  dateStr: string,
  timeStr: string,
  settings: OwnerSettings,
  currentPitches?: Pitch[]
): number => {
  const pitchPool = currentPitches && currentPitches.length > 0 ? currentPitches : PITCHES;
  const pitch = pitchPool.find(p => p.id === pitchId) || pitchPool[0];
  const weekend = isWeekend(dateStr);
  const peak = isPeakHour(timeStr, settings);

  if (weekend) {
    return peak ? pitch.peakHourWeekendPrice : pitch.baseWeekendPrice;
  } else {
    return peak ? pitch.peakHourWeekdayPrice : pitch.baseWeekdayPrice;
  }
};

export const generateDailySlotsForPitch = (
  pitchId: string,
  dateStr: string,
  bookings: Booking[],
  blockedRecords: BlockedSlotRecord[],
  settings: OwnerSettings,
  currentPitches?: Pitch[]
): Slot[] => {
  const now = new Date();
  const todayStr = getTodayString();
  const isToday = dateStr === todayStr;
  const currentHour = now.getHours();

  // Find all active bookings on this pitch & date
  const pitchBookings = bookings.filter(
    b => b.pitchId === pitchId && b.date === dateStr && b.status !== 'cancelled'
  );

  return OPERATING_HOURS.map(time => {
    const slotId = `slot-${pitchId}-${dateStr}-${time}`;
    const [slotHour] = time.split(':').map(Number);
    const displayTime = formatDisplayTime(time);
    const price = getSlotPrice(pitchId, dateStr, time, settings, currentPitches);
    const peak = isPeakHour(time, settings);

    // Check if blocked
    const blockKey = `${dateStr}_${pitchId}_${time}`;
    const blockRec = blockedRecords.find(b => b.key === blockKey);

    // Check if booked with precise matching (no false AM/PM substring collision)
    const matchingBooking = pitchBookings.find(b => {
      if (b.slotIds.includes(slotId)) return true;
      if (b.slotIds.includes(`slot-${pitchId}-${time}`)) return true;
      if (b.slotIds.includes(`slot-${pitchId}-${dateStr}-${time}`)) return true;
      if (b.timeRange && (b.timeRange.includes(displayTime) || b.timeRange.startsWith(displayTime.split(' - ')[0]))) return true;
      return false;
    });

    let status: SlotStatus = 'available';
    let blockReason: string | undefined = undefined;

    if (settings.isRainHalted) {
      status = 'blocked';
      blockReason = 'Rain Hold / Wet Turf Weather Warning';
    } else if (blockRec) {
      status = 'blocked';
      blockReason = blockRec.reason;
    } else if (matchingBooking) {
      status = 'booked';
    } else if (isToday && slotHour < currentHour && slotHour !== 0) {
      // Slot is in past
      status = 'past';
    }

    return {
      id: slotId,
      pitchId,
      date: dateStr,
      startTime: time,
      endTime: `${((slotHour + 1) % 24).toString().padStart(2, '0')}:00`,
      displayTime,
      price,
      isPeak: peak,
      status,
      bookingId: matchingBooking?.id,
      blockReason
    };
  });
};

// Client-side image compression for payment receipts (prevents localStorage quota blowouts)
export const compressImageFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 900;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(readerEvent.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.75);
        resolve(compressedBase64);
      };
      img.onerror = () => {
        resolve(readerEvent.target?.result as string);
      };
      img.src = readerEvent.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
