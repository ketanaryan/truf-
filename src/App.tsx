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

  const [pitches, setPitches] = useState<Pitch[]>(PITCHES);
  const [settings, setSettings] = useState<OwnerSettings>(getStoredSettings());
  const [bookings, setBookings] = useState<Booking[]>(getStoredBookings());
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlotRecord[]>(getStoredBlockedSlots());
  const [communityPosts, setCommunityPosts] = useState<CommunityLobbyPost[]>(getStoredCommunityPosts());

  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  const [selectedPitchId, setSelectedPitchId] = useState<string>(PITCHES[0].id);
  const [selectedSport, setSelectedSport] = useState<SportType>('Football 7v7');
  const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>([]);

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [activeTicketBooking, setActiveTicketBooking] = useState<Booking | null>(null);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [myBookingsOpen, setMyBookingsOpen] = useState(false);

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
    setSelectedSlotIds(prev => {
      const willAdd = !prev.includes(slotId);
      if (willAdd) {
        showToast({
          title: 'Slot Selected',
          message: 'Slot added to session. Click Book to confirm.',
          type: 'info',
          duration: 2000
        });
        return [...prev, slotId];
      } else {
        return prev.filter(id => id !== slotId);
      }
    });
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

  const handleBookingConfirmed = (newBooking: Booking) => {
    const updated = addBooking(newBooking);
    setBookings(updated);
    setSelectedSlotIds([]);
    setCheckoutOpen(false);
    setActiveTicketBooking(newBooking);
    setTicketModalOpen(true);

    showToast({
      title: 'Match Confirmed! ⚽',
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

    showToast({
      title: 'UPI Payment Approved! ✅',
      message: `Booking #${target?.bookingRef} marked fully paid (0% gateway commission).`,
      type: 'success',
      duration: 4000
    });
  };

  const handleCancelBooking = (bookingId: string) => {
    const target = bookings.find(b => b.id === bookingId);
    const updated = updateBooking(bookingId, {
      status: 'cancelled',
      paymentStatus: 'refunded'
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
    setPitches(prev => prev.map(p => (p.id === pitchId ? { ...p, ...updates } : p)));
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
    <div className="min-h-screen bg-[#070d09] text-gray-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      
      {/* Navbar */}
      <Navbar
        currentView={currentView}
        onViewChange={setCurrentView}
        selectedSlotsCount={selectedSlotIds.length}
        onOpenCheckout={() => setCheckoutOpen(true)}
        onOpenMyBookings={() => setMyBookingsOpen(true)}
        settings={settings}
        onResetData={handleResetData}
      />

      {/* Main Content */}
      <main className="flex-1">
        {currentView === 'customer' ? (
          <div>
            <HeroBanner
              onScrollToSlots={scrollToSlots}
              onOpenMatchFinder={scrollToMatchFinder}
              pitches={pitches}
            />

            {/* Customer Section Navigation Bar */}
            <div className="sticky top-[73px] z-30 bg-[#070e0a]/95 backdrop-blur-md border-b border-[#183020] py-2.5 shadow-md">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 overflow-x-auto scrollbar-none">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setCustomerTab('booking');
                      scrollToSlots();
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all active:scale-95 whitespace-nowrap ${
                      customerTab === 'booking'
                        ? 'bg-gradient-to-r from-emerald-400 to-green-500 text-black shadow-md font-extrabold'
                        : 'bg-[#0c1810] text-zinc-300 hover:text-white border border-[#1f3d28]'
                    }`}
                  >
                    <span>⚽ Book a Pitch</span>
                  </button>

                  <button
                    onClick={() => {
                      setCustomerTab('matchfinder');
                      scrollToMatchFinder();
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all active:scale-95 whitespace-nowrap ${
                      customerTab === 'matchfinder'
                        ? 'bg-gradient-to-r from-emerald-400 to-green-500 text-black shadow-md font-extrabold'
                        : 'bg-[#0c1810] text-zinc-300 hover:text-white border border-[#1f3d28]'
                    }`}
                  >
                    <span>👥 Battle Board ({communityPosts.length})</span>
                  </button>

                  <button
                    onClick={() => setCustomerTab('facilities')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all active:scale-95 whitespace-nowrap ${
                      customerTab === 'facilities'
                        ? 'bg-gradient-to-r from-emerald-400 to-green-500 text-black shadow-md font-extrabold'
                        : 'bg-[#0c1810] text-zinc-300 hover:text-white border border-[#1f3d28]'
                    }`}
                  >
                    <span>🏟️ Arena Amenities</span>
                  </button>

                  <button
                    onClick={() => setCustomerTab('reviews')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all active:scale-95 whitespace-nowrap ${
                      customerTab === 'reviews'
                        ? 'bg-gradient-to-r from-emerald-400 to-green-500 text-black shadow-md font-extrabold'
                        : 'bg-[#0c1810] text-zinc-300 hover:text-white border border-[#1f3d28]'
                    }`}
                  >
                    <span>⭐ Reviews (4.9★)</span>
                  </button>
                </div>

                <div className="hidden lg:flex items-center gap-3 text-xs font-mono text-zinc-400">
                  <span className="flex items-center gap-1.5 text-zinc-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
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
                  onDateChange={setSelectedDate}
                  selectedPitchId={selectedPitchId}
                  onPitchChange={setSelectedPitchId}
                  selectedSport={selectedSport}
                  onSportChange={setSelectedSport}
                  slots={slots}
                  selectedSlotIds={selectedSlotIds}
                  onToggleSlot={handleToggleSlot}
                  onClearSelectedSlots={handleClearSelectedSlots}
                  onProceedToCheckout={() => setCheckoutOpen(true)}
                  settings={settings}
                />

                {/* Quick explore footer cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#183020]">
                  <div 
                    onClick={() => setCustomerTab('matchfinder')}
                    className="p-4 rounded-2xl bg-[#0c1810] border border-[#1f3d28] hover:border-emerald-500/40 cursor-pointer transition-all space-y-1"
                  >
                    <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold block">Community Lobby</span>
                    <h4 className="text-white font-bold text-sm">Need players for your squad?</h4>
                    <p className="text-zinc-400 text-xs">Join or post match requests on the Battle Board →</p>
                  </div>

                  <div 
                    onClick={() => setCustomerTab('facilities')}
                    className="p-4 rounded-2xl bg-[#0c1810] border border-[#1f3d28] hover:border-emerald-500/40 cursor-pointer transition-all space-y-1"
                  >
                    <span className="text-[10px] uppercase font-mono text-amber-400 font-bold block">Tournament Specs</span>
                    <h4 className="text-white font-bold text-sm">FIFA Grass & 500-Lux LEDs</h4>
                    <p className="text-zinc-400 text-xs">Explore changing rooms, showers & lockers →</p>
                  </div>

                  <div 
                    onClick={() => setCustomerTab('reviews')}
                    className="p-4 rounded-2xl bg-[#0c1810] border border-[#1f3d28] hover:border-emerald-500/40 cursor-pointer transition-all space-y-1"
                  >
                    <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold block">Player Rating</span>
                    <h4 className="text-white font-bold text-sm">4.9 / 5.0 Star Rating</h4>
                    <p className="text-zinc-400 text-xs">Read 1,480+ reviews from verified captains →</p>
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
                <CustomerReviews />
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

      {/* Floating Role Switcher Pill */}
      <div className="fixed bottom-5 right-5 z-40 hidden sm:flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#0c1810]/95 border border-[#1f3d28] backdrop-blur-xl shadow-2xl text-xs font-mono">
        <span className="text-[10px] uppercase px-2 text-zinc-400">View as:</span>
        <button
          onClick={() => setCurrentView('customer')}
          className={`px-3.5 py-1.5 rounded-xl transition-all font-bold ${
            currentView === 'customer'
              ? 'bg-emerald-500 text-black shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Player
        </button>
        <button
          onClick={() => setCurrentView('owner')}
          className={`px-3.5 py-1.5 rounded-xl transition-all font-bold ${
            currentView === 'owner'
              ? 'bg-amber-400 text-black shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Owner Desk
        </button>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#1a3322] bg-[#050a07] py-14 text-zinc-400 text-xs font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                <span className="font-display font-black text-lg text-white uppercase italic tracking-wider">
                  BATTLE<span className="text-emerald-400">GROUNDS</span>
                </span>
              </div>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Elite floodlit multi-sport arena engineered for Football 7v7, 5v5, Box Cricket, and Pickleball tournaments.
              </p>
              <div className="flex items-center gap-3 text-emerald-400 pt-1 font-bold">
                <span>⚡ 06:00 – 01:00 Daily</span>
                <span>•</span>
                <span>🌱 FIFA Certified Grass</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-white font-bold uppercase tracking-wider block">Arena Location</span>
              <p className="text-zinc-300">{settings.address}</p>
              <p className="text-zinc-300">Desk Phone: {settings.phone}</p>
              <p className="text-zinc-300">WhatsApp: {settings.whatsapp}</p>
            </div>

            <div className="space-y-2">
              <span className="text-white font-bold uppercase tracking-wider block">Turf Rules</span>
              <p>• Clean rubber studs or flat trainers only</p>
              <p>• Arrive 15 minutes prior to match time</p>
              <p>• Zero food or chewing gum on artificial grass</p>
              <p>• Free secure lockers & RO drinking water</p>
            </div>

            <div className="space-y-2">
              <span className="text-white font-bold uppercase tracking-wider block">Owner Operations</span>
              <p className="text-zinc-400">Turf reception workstation for counter walk-ins, phone entries, and gate check-in.</p>
              <button
                onClick={() => setCurrentView('owner')}
                className="mt-2 px-3.5 py-2 rounded-xl bg-amber-400/20 hover:bg-amber-400 hover:text-black text-amber-300 border border-amber-400/40 text-xs font-bold transition-colors"
              >
                Open Owner Command Desk →
              </button>
            </div>
          </div>

          <div className="border-t border-[#14261a] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
            <p>© {new Date().getFullYear()} BATTLEGROUNDS ARENA. All Rights Reserved.</p>
            <p>Premier Sports Turf Booking & Venue Management Software</p>
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
