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
import { NovaTournamentBanner } from './components/customer/NovaTournamentBanner';
import { NovaFeaturesGrid } from './components/customer/NovaFeaturesGrid';
import { NovaActivityHeatmap } from './components/customer/NovaActivityHeatmap';
import { NovaGalleryBento } from './components/customer/NovaGalleryBento';
import { NovaTierSystem } from './components/customer/NovaTierSystem';

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
    <div className="min-h-screen bg-[#16181b] text-white flex flex-col font-body selection:bg-[#ff7a00] selection:text-black">
      
      {/* Header: Dedicated Venue Operations Top Header for Owner, or Customer Navbar for Players */}
      {currentView === 'owner' ? (
        <header className="sticky top-0 z-50 bg-[#111317] border-b border-white/10 shadow-2xl font-body">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-[#ff7a00] to-amber-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-500/20 border border-white/20">
                ⚡
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-black text-base sm:text-xl tracking-tight uppercase font-headline">
                    SONAWANE'S TURF
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#ff7a00]/20 border border-[#ff7a00]/30 text-[#ff7a00] text-[10px] font-black uppercase tracking-wider">
                    Owner Desk
                  </span>
                </div>
                <p className="text-neutral-400 text-[11px] font-medium hidden sm:block">
                  Venue Operations & Management Suite • Rane Nagar, Nashik
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-neutral-400 font-medium">Turf Manager:</span>
                <span className="text-white font-bold">Kiran Sonawane</span>
                <span className="text-neutral-600">•</span>
                <span className="text-[#ff7a00] font-mono font-bold">+91 94035 64779</span>
              </div>

              <button
                onClick={() => {
                  setCurrentView('customer');
                  if (typeof window !== 'undefined' && (window.location.pathname.startsWith('/admin') || window.location.pathname.startsWith('/owner'))) {
                    window.history.pushState({}, '', '/');
                  }
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#ff7a00] to-amber-600 hover:from-amber-600 hover:to-[#ff7a00] text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_4px_16px_rgba(255,122,0,0.3)] active:scale-95 cursor-pointer"
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

            {/* The Nova Club Tournament Highlight Banner */}
            <NovaTournamentBanner onRegisterClick={scrollToSlots} />

            {/* The Nova Club 4-Pillars Luxury Feature Bento Grid */}
            <NovaFeaturesGrid />

            {/* Customer Section Navigation Bar (The Nova Club Dark Glass Island Ribbon) */}
            <div className="sticky top-[76px] z-30 bg-[#16181b]/95 backdrop-blur-xl border-y border-white/10 py-3 shadow-2xl">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 overflow-x-auto scrollbar-none">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setCustomerTab('booking');
                      scrollToSlots();
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all active:scale-95 whitespace-nowrap cursor-pointer ${
                      customerTab === 'booking'
                        ? 'bg-[#ff7a00] text-white shadow-[0_0_24px_rgba(255,122,0,0.4)] font-extrabold'
                        : 'bg-white/5 text-neutral-300 hover:text-white border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <span>⚡ Book Match Slot</span>
                  </button>

                  <button
                    onClick={() => {
                      setCustomerTab('matchfinder');
                      scrollToMatchFinder();
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all active:scale-95 whitespace-nowrap cursor-pointer ${
                      customerTab === 'matchfinder'
                        ? 'bg-[#ff7a00] text-white shadow-[0_0_24px_rgba(255,122,0,0.4)] font-extrabold'
                        : 'bg-white/5 text-neutral-300 hover:text-white border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <span>👥 Players Lobby ({communityPosts.length})</span>
                  </button>

                  <button
                    onClick={() => setCustomerTab('facilities')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all active:scale-95 whitespace-nowrap cursor-pointer ${
                      customerTab === 'facilities'
                        ? 'bg-[#ff7a00] text-white shadow-[0_0_24px_rgba(255,122,0,0.4)] font-extrabold'
                        : 'bg-white/5 text-neutral-300 hover:text-white border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <span>🏟️ Specs & Amenities</span>
                  </button>

                  <button
                    onClick={() => setCustomerTab('reviews')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all active:scale-95 whitespace-nowrap cursor-pointer ${
                      customerTab === 'reviews'
                        ? 'bg-[#ff7a00] text-white shadow-[0_0_24px_rgba(255,122,0,0.4)] font-extrabold'
                        : 'bg-white/5 text-neutral-300 hover:text-white border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <span>⭐ Reviews (4.0★)</span>
                  </button>
                </div>

                <div className="hidden lg:flex items-center gap-3 text-xs text-neutral-400 font-semibold">
                  <span className="flex items-center gap-1.5 text-neutral-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Instant Digital Match Pass</span>
                  </span>
                  <span className="text-neutral-600">•</span>
                  <span className="text-orange-400 font-mono">0% UPI Surcharge</span>
                </div>
              </div>
            </div>

            {/* Tabbed Content View */}
            {customerTab === 'booking' && (
              <div className="space-y-16 py-8 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
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
                </div>

                {/* Customer Analytics & Activity Heatmap (The Nova Club Standard) */}
                <NovaActivityHeatmap />

                {/* Visual Gallery Bento (The Nova Club 01-06 Numbered Cards) */}
                <NovaGalleryBento />

                {/* Membership & Match Pass Tier System */}
                <NovaTierSystem onSelectBooking={scrollToSlots} />

                {/* Quick explore footer cards (Nova Dark Obsidian Style) */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                    <div 
                      onClick={() => setCustomerTab('matchfinder')}
                      className="p-6 rounded-3xl bg-[#1e2023] border border-white/10 hover:border-[#ff7a00]/50 cursor-pointer transition-all space-y-2 group shadow-xl"
                    >
                      <span className="text-[10px] uppercase font-bold text-[#ff7a00] tracking-wider block">Community Lobby</span>
                      <h4 className="text-white font-bold text-base group-hover:text-orange-400 transition-colors">Need players for your squad?</h4>
                      <p className="text-neutral-400 text-xs">Join or post match requests on the Battle Board →</p>
                    </div>

                    <div 
                      onClick={() => setCustomerTab('facilities')}
                      className="p-6 rounded-3xl bg-[#1e2023] border border-white/10 hover:border-amber-500/50 cursor-pointer transition-all space-y-2 group shadow-xl"
                    >
                      <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">Turf Specifications</span>
                      <h4 className="text-white font-bold text-base group-hover:text-amber-400 transition-colors">50mm Astroturf & 500-Lux Floodlights</h4>
                      <p className="text-neutral-400 text-xs">Ceiling nets, wooden stumps, dugouts & lockers →</p>
                    </div>

                    <div 
                      onClick={() => setCustomerTab('reviews')}
                      className="p-6 rounded-3xl bg-[#1e2023] border border-white/10 hover:border-emerald-500/50 cursor-pointer transition-all space-y-2 group shadow-xl"
                    >
                      <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">Player Rating</span>
                      <h4 className="text-white font-bold text-base group-hover:text-emerald-400 transition-colors">4.0 / 5.0 Google Rating</h4>
                      <p className="text-neutral-400 text-xs">Read 22+ verified reviews on Google Maps →</p>
                    </div>
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

      {/* Footer (The Nova Club Dark Luxury Minimalist Design) */}
      <footer className="border-t border-white/10 bg-[#111317] py-16 text-neutral-400 text-xs font-body">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#ff7a00] to-amber-500 flex items-center justify-center text-white font-black text-sm shadow-[0_4px_16px_rgba(255,122,0,0.3)]">
                  ⚡
                </div>
                <span className="font-headline font-black text-xl text-white uppercase italic tracking-wider">
                  SONAWANE'S <span className="text-[#ff7a00]">TURF</span>
                </span>
              </div>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Premier box cricket & football arena in Rane Nagar, Nashik. 50mm shockpad-cushioned astroturf, ceiling rebound net engineering, 500-lux anti-glare floodlights, and direct zero-gateway-fee slot passes.
              </p>
              <div className="flex flex-wrap items-center gap-3 text-neutral-300 pt-1 font-semibold text-[11px]">
                <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[#ff7a00]">⚡ Open 06:00 AM – 11:00 PM</span>
                <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-emerald-400">🏏 Box Cricket & Football</span>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-white font-bold uppercase tracking-wider text-xs block font-headline">Arena Location</span>
              <p className="text-neutral-300 leading-relaxed">{settings.address}</p>
              <p className="text-neutral-300">Desk Phone: <span className="text-white font-bold">{settings.phone}</span></p>
              <p className="text-neutral-300">WhatsApp: <span className="text-[#ff7a00] font-bold">{settings.whatsapp}</span></p>
              <p className="text-neutral-400 text-[11px]">Turf Manager: <span className="text-white">Kiran Sonawane</span></p>
            </div>

            <div className="space-y-3">
              <span className="text-white font-bold uppercase tracking-wider text-xs block font-headline">Turf Guidelines</span>
              <ul className="space-y-1.5 text-neutral-400">
                <li className="flex items-center gap-2"><span className="text-[#ff7a00]">•</span> Clean rubber studs or flat sneakers only</li>
                <li className="flex items-center gap-2"><span className="text-[#ff7a00]">•</span> Arrive 15 minutes prior to match schedule</li>
                <li className="flex items-center gap-2"><span className="text-[#ff7a00]">•</span> Zero chewing gum or food inside arena turf</li>
                <li className="flex items-center gap-2"><span className="text-[#ff7a00]">•</span> Free secure lockers & chilled RO drinking water</li>
              </ul>
            </div>

            <div className="space-y-3">
              <span className="text-white font-bold uppercase tracking-wider text-xs block font-headline">Direct Venue Booking</span>
              <p className="text-neutral-400 leading-relaxed text-xs">
                Direct UPI to arena merchant account. Zero convenience surcharges, automated WhatsApp match pass dispatch & instant gate check-in pass.
              </p>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-[#ff7a00] font-mono text-xs font-bold flex items-center justify-between">
                <span>UPI: {settings.upiId}</span>
                <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-sans">0% Fee</span>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
            <p>© {new Date().getFullYear()} SONAWANE'S MULTI SPORT TURF (NASHIK). WHERE NASHIK PLAYS CRICKET & FOOTBALL.</p>
            <div className="flex items-center gap-4">
              <p className="hidden md:block">Plot No. 1, Sonawane Mala, Chetana Nagar, Rane Nagar, Nashik</p>
              <button
                onClick={() => {
                  setCurrentView('owner');
                  if (typeof window !== 'undefined') {
                    window.history.pushState({}, '', '/admin');
                  }
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-all text-xs font-semibold border border-white/10 cursor-pointer shadow-sm active:scale-95"
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
