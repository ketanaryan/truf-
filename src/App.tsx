import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/navbar/Navbar';
import { HeroBanner } from './components/customer/HeroBanner';
import { SlotBookingMatrix } from './components/customer/SlotBookingMatrix';
import { CheckoutDrawer } from './components/customer/CheckoutDrawer';
import { TicketPassModal } from './components/customer/TicketPassModal';
import { MyBookingsModal } from './components/customer/MyBookingsModal';
import { MatchFinderBoard } from './components/customer/MatchFinderBoard';
import { CustomerReviews } from './components/customer/CustomerReviews';
import { ArenaFacilities } from './components/customer/ArenaFacilities';
import { OwnerDashboard } from './components/owner/OwnerDashboard';
import { ToastProvider, useToast } from './components/common/ToastContext';

import { Pitch, Booking, OwnerSettings, SportType, CommunityLobbyPost } from './types';
import { PITCHES, getTodayString } from './data/mockTurfData';
import { 
  getStoredBookings, 
  saveBookings, 
  addBooking, 
  updateBooking,
  approveUpiBooking,
  getStoredPitches,
  savePitches,
  getStoredSettings, 
  saveSettings, 
  getStoredBlockedSlots, 
  toggleBlockSlot,
  getStoredCommunityPosts,
  addCommunityPost,
  generateDailySlotsForPitch,
  resetDemoData,
  BlockedSlotRecord
} from './data/storage';

import { Shield, PhoneCall, MapPin, Mail } from 'lucide-react';

const TurfAppContent: React.FC = () => {
  const { showToast } = useToast();
  const [currentView, setCurrentView] = useState<'customer' | 'owner'>('customer');
  const [customerTab, setCustomerTab] = useState<'booking' | 'matchfinder' | 'facilities' | 'reviews'>('booking');

  const [pitches, setPitches] = useState<Pitch[]>(getStoredPitches());
  const [settings, setSettings] = useState<OwnerSettings>(getStoredSettings());
  const [bookings, setBookings] = useState<Booking[]>(getStoredBookings());
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlotRecord[]>(getStoredBlockedSlots());
  const [communityPosts, setCommunityPosts] = useState<CommunityLobbyPost[]>(getStoredCommunityPosts());

  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  const [selectedPitchId, setSelectedPitchId] = useState<string>(PITCHES[0].id);
  const [selectedSport, setSelectedSport] = useState<SportType>('Box Cricket');
  const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>([]);

  const handlePitchChange = (pitchId: string) => {
    setSelectedPitchId(pitchId);
    setSelectedSlotIds([]); // Prevent orphaned slot selections from other pitches
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedSlotIds([]); // Prevent orphaned slot selections from previous date
  };

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [activeTicketBooking, setActiveTicketBooking] = useState<Booking | null>(null);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [myBookingsOpen, setMyBookingsOpen] = useState(false);

  // Hidden staff/owner portal mode: activated via URL param (?mode=owner, ?admin=true) or path (/admin, /owner)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const path = window.location.pathname.toLowerCase();
      if (
        params.get('mode') === 'owner' ||
        params.get('admin') === 'true' ||
        path.startsWith('/admin') ||
        path.startsWith('/owner')
      ) {
        setCurrentView('owner');
      }
    }
  }, []);

  useEffect(() => {
    saveBookings(bookings);
  }, [bookings]);

  useEffect(() => {
    const cur = pitches.find(p => p.id === selectedPitchId);
    if (cur && !cur.sports.includes(selectedSport)) {
      setSelectedSport(cur.sports[0]);
    }
  }, [selectedPitchId, pitches]);

  // Compute daily slots dynamically using up-to-date pitches and settings
  const slots = useMemo(() => {
    return generateDailySlotsForPitch(
      selectedPitchId,
      selectedDate,
      bookings,
      blockedSlots,
      settings,
      pitches
    );
  }, [selectedPitchId, selectedDate, bookings, blockedSlots, settings, pitches]);

  const handleToggleSlot = (slotId: string) => {
    const isAlreadySelected = selectedSlotIds.includes(slotId);
    if (!isAlreadySelected) {
      setSelectedSlotIds(prev => [...prev, slotId]);
      showToast({
        title: 'Slot Selected',
        message: 'Slot added to session. Click Book to confirm.',
        type: 'info',
        duration: 2000
      });
    } else {
      setSelectedSlotIds(prev => prev.filter(id => id !== slotId));
    }
  };

  const handleClearSelectedSlots = () => {
    setSelectedSlotIds([]);
    showToast({
      title: 'Selection Cleared',
      message: 'All chosen slots removed.',
      type: 'info',
      duration: 2000
    });
  };

  const handleSelectBatchSlots = (slotIds: string[]) => {
    setSelectedSlotIds(slotIds);
    if (slotIds.length > 0) {
      showToast({
        title: 'Full Day Package Selected! 🏆',
        message: `${slotIds.length} slots reserved under flat package rate.`,
        type: 'success',
        duration: 3000
      });
    }
  };

  const handleBookingConfirmed = (newBooking: Booking) => {
    const updated = addBooking(newBooking);
    setBookings(updated);
    setSelectedSlotIds([]);
    setCheckoutOpen(false);
    setActiveTicketBooking(newBooking);
    setTicketModalOpen(true);

    showToast({
      title: 'Match Confirmed! 🏏',
      message: `Pass #${newBooking.bookingRef} ready for Captain ${newBooking.captainName}`,
      type: 'success',
      duration: 5000
    });
  };

  const handleCheckIn = (bookingId: string) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const target = bookings.find(b => b.id === bookingId);
    const updated = updateBooking(bookingId, { isCheckedIn: true, checkedInAt: timeNow });
    setBookings(updated);

    showToast({
      title: 'Player Checked In',
      message: `Captain ${target?.captainName || ''} squad checked into pitch.`,
      type: 'success'
    });
  };

  const handleCollectBalance = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;
    const collectedAmount = booking.balanceDue;
    const updated = updateBooking(bookingId, {
      advancePaid: booking.totalAmount,
      balanceDue: 0,
      paymentStatus: 'paid_full'
    });
    setBookings(updated);

    showToast({
      title: 'Payment Cleared',
      message: `Collected ₹${collectedAmount} at reception counter. Account settled.`,
      type: 'success'
    });
  };

  const handleApproveUpi = (bookingId: string) => {
    const updated = approveUpiBooking(bookingId);
    setBookings(updated);
    const target = updated.find(b => b.id === bookingId);
    const isToken = target && target.balanceDue > 0;

    showToast({
      title: 'UPI Payment Approved! ✅',
      message: isToken
        ? `Token ₹${target?.advancePaid} verified. Remaining ₹${target?.balanceDue} due at turf counter.`
        : `Booking #${target?.bookingRef} marked fully paid (0% gateway commission).`,
      type: 'success',
      duration: 4000
    });
  };

  const handleCancelBooking = (bookingId: string) => {
    const target = bookings.find(b => b.id === bookingId);
    const updated = updateBooking(bookingId, {
      status: 'cancelled',
      paymentStatus: 'refunded',
      balanceDue: 0
    });
    setBookings(updated);

    showToast({
      title: 'Booking Cancelled',
      message: `Match #${target?.bookingRef} released back to calendar.`,
      type: 'warning'
    });
  };

  const handleToggleBlockSlot = (date: string, pitchId: string, time: string, reason: string) => {
    const updated = toggleBlockSlot(date, pitchId, time, reason);
    setBlockedSlots(updated);

    showToast({
      title: 'Slot Lock Toggled',
      message: `Maintenance / private hold updated for ${time}.`,
      type: 'info'
    });
  };

  const handleSaveSettings = (newSettings: OwnerSettings) => {
    saveSettings(newSettings);
    setSettings(newSettings);

    showToast({
      title: 'Settings Saved',
      message: 'Venue operating hours & surge rules applied live.',
      type: 'success'
    });
  };

  const handleUpdatePitchPricing = (pitchId: string, updates: Partial<Pitch>) => {
    setPitches(prev => {
      const updated = prev.map(p => (p.id === pitchId ? { ...p, ...updates } : p));
      savePitches(updated);
      return updated;
    });
  };

  const handleAddCommunityPost = (post: CommunityLobbyPost) => {
    const updated = addCommunityPost(post);
    setCommunityPosts(updated);

    showToast({
      title: 'Battle Board Post Published!',
      message: `Seeking ${post.playersNeeded} players for ${post.sport}. Players can contact you.`,
      type: 'success'
    });
  };

  const handleResetData = () => {
    if (window.confirm('Reset turf bookings and settings to default demo state?')) {
      resetDemoData();
      setBookings(getStoredBookings());
      setSettings(getStoredSettings());
      setBlockedSlots(getStoredBlockedSlots());
      setCommunityPosts(getStoredCommunityPosts());
      setSelectedSlotIds([]);

      showToast({
        title: 'Demo Data Reset',
        message: 'Default sample matches and court schedules restored.',
        type: 'warning'
      });
    }
  };

  const scrollToSlots = () => {
    setCustomerTab('booking');
    setTimeout(() => {
      const elem = document.getElementById('booking-matrix-section');
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const scrollToMatchFinder = () => {
    setCustomerTab('matchfinder');
    setTimeout(() => {
      const elem = document.getElementById('community-match-finder');
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <div className="min-h-screen bg-[#F2F4F7] text-[#1F2937] flex flex-col font-sans selection:bg-[#FF6A00] selection:text-white">
      
      {/* Header: Dedicated Venue Operations Top Header for Owner, or Customer Navbar for Players */}
      {currentView === 'owner' ? (
        <header className="sticky top-0 z-50 bg-[#0B1D2D] border-b border-white/10 shadow-lg font-sans">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-[#FF6A00] to-amber-500 flex items-center justify-center text-white font-black text-xl shadow-md border border-white/20">
                ⚡
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-black text-base sm:text-xl tracking-tight uppercase">
                    SONAWANE'S TURF
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#FF6A00]/20 border border-[#FF6A00]/30 text-[#FF6A00] text-[10px] font-black uppercase tracking-wider">
                    Owner Desk
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] font-medium hidden sm:block">
                  Venue Operations & Management Suite • Rane Nagar, Nashik
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-slate-300 font-medium">Turf Manager:</span>
                <span className="text-white font-bold">Kiran Sonawane</span>
                <span className="text-slate-500">•</span>
                <span className="text-[#FF6A00] font-mono font-bold">+91 94035 64779</span>
              </div>

              <button
                onClick={() => {
                  setCurrentView('customer');
                  if (typeof window !== 'undefined' && (window.location.pathname.startsWith('/admin') || window.location.pathname.startsWith('/owner'))) {
                    window.history.pushState({}, '', '/');
                  }
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF6A00] to-amber-600 hover:from-amber-600 hover:to-[#FF6A00] text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <span>← Live Player View</span>
              </button>
            </div>
          </div>
        </header>
      ) : (
        <Navbar
          customerTab={customerTab}
          onSelectTab={(tab) => {
            setCustomerTab(tab);
            if (tab === 'booking') scrollToSlots();
            if (tab === 'matchfinder') scrollToMatchFinder();
          }}
          selectedSlotsCount={selectedSlotIds.length}
          onOpenCheckout={() => setCheckoutOpen(true)}
          onOpenMyBookings={() => setMyBookingsOpen(true)}
          settings={settings}
          onResetData={handleResetData}
          onScrollToSlots={scrollToSlots}
        />
      )}

      {/* Main Content */}
      <main className="flex-1">
        {currentView === 'customer' ? (
          <div>
            <HeroBanner
              onScrollToSlots={scrollToSlots}
              onOpenMatchFinder={scrollToMatchFinder}
              pitches={pitches}
              onSelectPitch={handlePitchChange}
            />

            {/* Customer Section Navigation Bar (Hatrick Grounds Clean White Theme) */}
            <div className="sticky top-[108px] z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 overflow-x-auto scrollbar-none">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setCustomerTab('booking');
                      scrollToSlots();
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all active:scale-95 whitespace-nowrap ${
                      customerTab === 'booking'
                        ? 'bg-[#FF6A00] text-white shadow-md font-extrabold'
                        : 'bg-slate-100 text-slate-700 hover:text-black border border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    <span>🏏 Book Box Cricket Slot</span>
                  </button>

                  <button
                    onClick={() => {
                      setCustomerTab('matchfinder');
                      scrollToMatchFinder();
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all active:scale-95 whitespace-nowrap ${
                      customerTab === 'matchfinder'
                        ? 'bg-[#FF6A00] text-white shadow-md font-extrabold'
                        : 'bg-slate-100 text-slate-700 hover:text-black border border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    <span>👥 Players Board ({communityPosts.length})</span>
                  </button>

                  <button
                    onClick={() => setCustomerTab('facilities')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all active:scale-95 whitespace-nowrap ${
                      customerTab === 'facilities'
                        ? 'bg-[#FF6A00] text-white shadow-md font-extrabold'
                        : 'bg-slate-100 text-slate-700 hover:text-black border border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    <span>🏟️ Turf Specs & Amenities</span>
                  </button>

                  <button
                    onClick={() => setCustomerTab('reviews')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all active:scale-95 whitespace-nowrap ${
                      customerTab === 'reviews'
                        ? 'bg-[#FF6A00] text-white shadow-md font-extrabold'
                        : 'bg-slate-100 text-slate-700 hover:text-black border border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    <span>⭐ Reviews (4.9★)</span>
                  </button>
                </div>

                <div className="hidden lg:flex items-center gap-3 text-xs text-slate-500 font-semibold">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Instant Pass Confirmation</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Tabbed Content View */}
            {customerTab === 'booking' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
                <SlotBookingMatrix
                  pitches={pitches}
                  selectedDate={selectedDate}
                  onDateChange={handleDateChange}
                  selectedPitchId={selectedPitchId}
                  onPitchChange={handlePitchChange}
                  selectedSport={selectedSport}
                  onSportChange={setSelectedSport}
                  slots={slots}
                  selectedSlotIds={selectedSlotIds}
                  onToggleSlot={handleToggleSlot}
                  onClearSelectedSlots={handleClearSelectedSlots}
                  onSelectBatchSlots={handleSelectBatchSlots}
                  onProceedToCheckout={() => setCheckoutOpen(true)}
                  settings={settings}
                />

                {/* Quick explore footer cards (Hatrick Grounds Style) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                  <div 
                    onClick={() => setCustomerTab('matchfinder')}
                    className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#FF6A00] cursor-pointer transition-all space-y-1 shadow-sm hover:shadow-md"
                  >
                    <span className="text-[10px] uppercase font-bold text-[#FF6A00] tracking-wider block">Community Lobby</span>
                    <h4 className="text-[#111827] font-bold text-sm">Need players for your squad?</h4>
                    <p className="text-slate-500 text-xs">Join or post match requests on the Battle Board →</p>
                  </div>

                  <div 
                    onClick={() => setCustomerTab('facilities')}
                    className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#FF6A00] cursor-pointer transition-all space-y-1 shadow-sm hover:shadow-md"
                  >
                    <span className="text-[10px] uppercase font-bold text-amber-600 tracking-wider block">Turf Specifications</span>
                    <h4 className="text-[#111827] font-bold text-sm">50mm Astroturf & 500-Lux Floodlights</h4>
                    <p className="text-slate-500 text-xs">Ceiling nets, wooden stumps, dugouts & lockers →</p>
                  </div>

                  <div 
                    onClick={() => setCustomerTab('reviews')}
                    className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#FF6A00] cursor-pointer transition-all space-y-1 shadow-sm hover:shadow-md"
                  >
                    <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider block">Player Rating</span>
                    <h4 className="text-[#111827] font-bold text-sm">4.9 / 5.0 Star Rating</h4>
                    <p className="text-slate-500 text-xs">Read 1,480+ reviews from verified captains →</p>
                  </div>
                </div>
              </div>
            )}

            {customerTab === 'matchfinder' && (
              <div className="animate-in fade-in duration-200">
                <MatchFinderBoard
                  posts={communityPosts}
                  onAddPost={handleAddCommunityPost}
                />
              </div>
            )}

            {customerTab === 'facilities' && (
              <div className="animate-in fade-in duration-200">
                <ArenaFacilities settings={settings} />
              </div>
            )}

            {customerTab === 'reviews' && (
              <div className="animate-in fade-in duration-200">
                <CustomerReviews settings={settings} />
              </div>
            )}

          </div>
        ) : (
          <OwnerDashboard
            pitches={pitches}
            bookings={bookings}
            blockedSlots={blockedSlots}
            settings={settings}
            onSaveBooking={(b) => {
              const updated = addBooking(b);
              setBookings(updated);
              showToast({
                title: 'Manual Booking Created',
                message: `Ref #${b.bookingRef} registered for Captain ${b.captainName}`,
                type: 'success'
              });
            }}
            onCheckIn={handleCheckIn}
            onCollectBalance={handleCollectBalance}
            onCancelBooking={handleCancelBooking}
            onToggleBlockSlot={handleToggleBlockSlot}
            onSaveSettings={handleSaveSettings}
            onUpdatePitchPricing={handleUpdatePitchPricing}
            onSelectBookingForPass={(b) => {
              setActiveTicketBooking(b);
              setTicketModalOpen(true);
            }}
            onApproveUpi={handleApproveUpi}
          />
        )}
      </main>

      {/* Modals */}
      <CheckoutDrawer
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        pitches={pitches}
        selectedPitchId={selectedPitchId}
        selectedSport={selectedSport}
        selectedDate={selectedDate}
        selectedSlotIds={selectedSlotIds}
        slots={slots}
        settings={settings}
        onBookingConfirmed={handleBookingConfirmed}
      />

      <TicketPassModal
        isOpen={ticketModalOpen}
        booking={activeTicketBooking}
        onClose={() => {
          setTicketModalOpen(false);
          setActiveTicketBooking(null);
        }}
        settings={settings}
      />

      <MyBookingsModal
        isOpen={myBookingsOpen}
        onClose={() => setMyBookingsOpen(false)}
        bookings={bookings}
        onSelectBooking={(b) => {
          setActiveTicketBooking(b);
          setTicketModalOpen(true);
        }}
        settings={settings}
      />

      {/* Footer (Hatrick Grounds Deep Navy) */}
      <footer className="border-t border-slate-200 bg-[#0B1D2D] py-14 text-slate-400 text-xs font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#FF6A00] flex items-center justify-center text-white font-black text-xs">
                  ⚡
                </div>
                <span className="font-display font-black text-xl text-white uppercase italic tracking-wider">
                  SONAWANE'S <span className="text-[#FF6A00]">TURF</span>
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Premier box cricket & football arena in Rane Nagar, Nashik. 50mm heavy astroturf with shockpad cushioning, high ceiling nets, 500-lux floodlights, and zero-convenience-fee booking.
              </p>
              <div className="flex items-center gap-3 text-slate-300 pt-1 font-semibold">
                <span>⚡ 06:00 AM – 11:00 PM Daily</span>
                <span>•</span>
                <span>🏏 Box Cricket & Football</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-white font-bold uppercase tracking-wider block">Arena Location</span>
              <p className="text-slate-300">{settings.address}</p>
              <p className="text-slate-300">Desk Phone: {settings.phone}</p>
              <p className="text-slate-300">WhatsApp: {settings.whatsapp}</p>
            </div>

            <div className="space-y-2">
              <span className="text-white font-bold uppercase tracking-wider block">Turf Rules</span>
              <p>• Clean rubber studs or flat trainers only</p>
              <p>• Arrive 15 minutes prior to match time</p>
              <p>• Zero food or chewing gum on artificial grass</p>
              <p>• Free secure lockers & RO drinking water</p>
            </div>

            <div className="space-y-2">
              <span className="text-white font-bold uppercase tracking-wider block">Direct Turf Pay</span>
              <p className="text-slate-400 leading-relaxed">
                Direct UPI to arena account. Zero intermediary gateway charges, instant slot generation & verified digital match passes.
              </p>
              <div className="pt-2 text-[#FF6A00] font-mono text-[11px] font-bold">
                UPI ID: {settings.upiId}
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} SONAWANE'S MULTI SPORT TURF (NASHIK). All Rights Reserved.</p>
            <div className="flex items-center gap-4">
              <p>Cricket & Football Turf • Rane Nagar, Nashik</p>
              <button
                onClick={() => {
                  setCurrentView('owner');
                  if (typeof window !== 'undefined') {
                    window.history.pushState({}, '', '/admin');
                  }
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all text-xs font-semibold border border-white/15 cursor-pointer shadow-sm"
                title="Turf Owner Admin Workstation"
              >
                <span>🔐 Admin / Owner Desk</span>
              </button>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <TurfAppContent />
    </ToastProvider>
  );
};
