import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Ticket, 
  PhoneCall, 
  MapPin, 
  Menu,
  X,
  Zap,
  Calendar,
  Users,
  Star,
  ArrowRight,
  User,
  Sparkles
} from 'lucide-react';
import { OwnerSettings } from '../../types';

interface NavbarProps {
  customerTab: 'booking' | 'matchfinder' | 'facilities' | 'reviews';
  onSelectTab: (tab: 'booking' | 'matchfinder' | 'facilities' | 'reviews') => void;
  selectedSlotsCount: number;
  onOpenCheckout: () => void;
  onOpenMyBookings: () => void;
  settings: OwnerSettings;
  onResetData: () => void;
  onScrollToSlots: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  customerTab,
  onSelectTab,
  selectedSlotsCount,
  onOpenCheckout,
  onOpenMyBookings,
  settings,
  onResetData,
  onScrollToSlots
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top Telemetry Ticker Ribbon */}
      <div className="bg-[#0e1013] border-b border-white/5 px-4 py-1.5 text-[11px] text-slate-400 font-mono">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 truncate">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9df800] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#9df800]"></span>
            </span>
            <span className="text-white/60 uppercase tracking-widest text-[10px] hidden sm:inline">
              LIVE ARENA TELEMETRY:
            </span>
            <span className="text-[#9df800] font-bold">
              OPEN 06:00 AM – 11:00 PM
            </span>
            <span className="text-white/20 hidden md:inline">•</span>
            <span className="text-white/80 hidden md:inline font-sans truncate">
              Plot No. 1, Sonawane Mala, Chetana Nagar, Rane Nagar, Nashik
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-[#ff7a00]/15 border border-[#ff7a00]/30 text-[#ff7a00] text-[10px] font-bold font-sans">
              WEEKDAYS ₹600/HR • NIGHTS ₹800/HR
            </span>
            <a 
              href={`tel:${settings.phone}`}
              className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors text-xs font-bold font-sans"
            >
              <PhoneCall className="w-3 h-3 text-[#ff7a00]" />
              <span className="hidden xs:inline">{settings.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Floating Island Glass Navigation Bar (The Nova Club Standard) */}
      <header className="sticky top-3 z-50 px-3 sm:px-6 pointer-events-none">
        <div className="max-w-7xl mx-auto pointer-events-auto">
          <div className="rounded-full bg-[#16181b]/90 backdrop-blur-2xl border border-white/10 px-4 sm:px-6 py-2.5 sm:py-3 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex items-center justify-between gap-4 transition-all">
            
            {/* Brand Logo & Wordmark (The Nova Club Aesthetic) */}
            <div 
              onClick={() => {
                onSelectTab('booking');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#ff7a00] to-[#ff5a00] p-[1px] shadow-[0_0_20px_rgba(255,122,0,0.4)] group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-full bg-[#16181b] flex items-center justify-center">
                  <span className="font-headline font-black text-white text-base italic">S</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-headline font-black text-lg sm:text-xl tracking-tight text-white uppercase italic">
                    SONAWANE'S <span className="text-[#ff7a00]">TURF</span>
                  </span>
                </div>
                <p className="text-[9px] sm:text-[10px] font-mono tracking-[0.2em] uppercase text-white/50 -mt-0.5 hidden xs:block">
                  ATHLETIC CLUB • NASHIK
                </p>
              </div>
            </div>

            {/* Desktop Center Navigation Links with Gradient Underline */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {[
                { id: 'booking', label: 'COURTS' },
                { id: 'facilities', label: 'SPECS & AMENITIES' },
                { id: 'matchfinder', label: 'COMMUNITY BOARD' },
                { id: 'reviews', label: 'REVIEWS' }
              ].map((tab) => {
                const isActive = customerTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      onSelectTab(tab.id as any);
                      if (tab.id === 'booking') onScrollToSlots();
                    }}
                    className={`relative py-1 text-xs font-headline font-bold uppercase tracking-[0.22em] transition-colors group ${
                      isActive ? 'text-[#ff7a00]' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    <span>{tab.label}</span>
                    
                    {/* Hover & Active Gradient Underline Bar */}
                    <span 
                      className={`absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-[#ffb36b] via-[#ff7a00] to-[#ff5a00] rounded-full transition-transform duration-300 origin-center ${
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </button>
                );
              })}
            </nav>

            {/* Right Action Icons & Primary CTA Pill */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Profile / Find Pass Icon Button */}
              <button
                onClick={onOpenMyBookings}
                className="w-10 h-10 rounded-full border border-white/12 bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer relative"
                title="Find My Match Pass"
              >
                <Ticket className="w-4 h-4 text-[#ffb07a]" />
                {selectedSlotsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ff7a00] text-white text-[9px] font-black flex items-center justify-center shadow-lg">
                    {selectedSlotsCount}
                  </span>
                )}
              </button>

              {/* Primary Glowing Pill CTA Button */}
              <button
                onClick={onScrollToSlots}
                className="hidden sm:flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#ff7a00] hover:bg-[#ff8a1a] text-white font-headline font-bold text-xs uppercase tracking-[0.16em] shadow-[0_10px_28px_rgba(255,122,0,0.4)] hover:shadow-[0_12px_36px_rgba(255,122,0,0.6)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span>BOOK A SLOT</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-[#ff7a00]" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Full-Screen Glass Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="lg:hidden pointer-events-auto mt-2 max-w-7xl mx-auto rounded-3xl bg-[#16181b]/95 backdrop-blur-3xl border border-white/10 p-5 shadow-2xl text-white space-y-4 font-headline"
            >
              <div className="flex flex-col gap-2">
                {[
                  { id: 'booking', label: '🏏 Book Box Cricket / Football' },
                  { id: 'facilities', label: '🏟️ Turf Specs & Amenities' },
                  { id: 'matchfinder', label: '👥 Players Community Board' },
                  { id: 'reviews', label: '⭐ Google Reviews (4.0★)' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      onSelectTab(tab.id as any);
                      setMobileMenuOpen(false);
                      if (tab.id === 'booking') onScrollToSlots();
                    }}
                    className={`px-4 py-3 rounded-2xl text-left text-sm font-bold uppercase tracking-wider transition-colors ${
                      customerTab === tab.id
                        ? 'bg-[#ff7a00] text-white shadow-md'
                        : 'bg-white/5 text-white/80 hover:bg-white/10'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenMyBookings();
                  }}
                  className="w-full py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <Ticket className="w-4 h-4 text-[#ff7a00]" />
                  <span>Find My Match Pass</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onScrollToSlots();
                  }}
                  className="w-full py-3.5 rounded-2xl bg-[#ff7a00] text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2"
                >
                  <span>Book Match Slot Now →</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};
