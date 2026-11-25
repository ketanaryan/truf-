import React, { useState } from 'react';
import { 
  Shield, 
  Ticket, 
  PhoneCall, 
  MapPin, 
  Menu,
  X,
  Zap,
  Sparkles,
  Calendar,
  Users,
  Star,
  ArrowRight
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
    <header className="sticky top-0 z-50 bg-[#070e0a]/95 backdrop-blur-md border-b border-[#183020] shadow-xl">
      
      {/* Top Telemetry micro-bar with venue hotline and live status */}
      <div className="bg-[#050a07] border-b border-[#122418] px-3 sm:px-6 py-1.5 text-[11px] font-mono text-zinc-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px] hidden xs:inline">
              Arena Status:
            </span>
            <span className="text-zinc-200 font-medium truncate max-w-[220px] xs:max-w-none">
              {settings.isRainHalted ? '⚠️ Inclement Weather Hold' : 'Open 06:00 AM – 01:00 AM • Dual Pitches Floodlit'}
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-zinc-400">
            <div className="hidden md:flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate max-w-[200px]">{settings.address.split(',')[0]}</span>
            </div>
            <span className="hidden md:inline text-zinc-700">•</span>
            <a 
              href={`tel:${settings.phone}`} 
              className="flex items-center gap-1.5 text-emerald-300 hover:text-white transition-colors font-medium active:scale-95"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>Desk: <strong className="text-white font-mono">{settings.phone}</strong></span>
            </a>
          </div>
        </div>
      </div>

      {/* Hatrick Grounds Inspired High-Energy Announcement Ribbon */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-700 px-3 py-1.5 text-[11px] font-mono text-black font-extrabold tracking-wider uppercase text-center shadow-inner flex items-center justify-center gap-2 overflow-x-auto whitespace-nowrap">
        <span className="bg-black text-amber-300 px-1.5 py-0.5 rounded text-[10px] font-black">SPECIAL OFFER</span>
        <span>⚡ FLAT FULL-DAY TOURNAMENT PASSES NOW LIVE • 0% UPI FEES • INSTANT DIGITAL MATCH PASS</span>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand identity */}
        <div 
          onClick={() => {
            onSelectTab('booking');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 via-green-600 to-emerald-800 flex items-center justify-center shadow-lg shadow-emerald-950/70 border border-emerald-300/40 group-hover:scale-105 transition-all duration-200">
            <Shield className="w-5 h-5 text-black fill-black/20 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-xl tracking-tight text-white uppercase italic">
                BATTLE<span className="text-emerald-400">GROUNDS</span>
              </span>
              <span className="text-[9px] font-mono font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 tracking-wider">
                PRO TURF
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 font-mono -mt-0.5 hidden sm:block">
              Premier Sports Arena & Multi-Pitch Facility
            </p>
          </div>
        </div>

        {/* Center Navigation Links (Clean & Customer Facing) */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#0a150e] p-1.5 rounded-2xl border border-[#1d3824]">
          <button
            onClick={() => {
              onSelectTab('booking');
              onScrollToSlots();
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition-all duration-200 ${
              customerTab === 'booking'
                ? 'bg-gradient-to-r from-emerald-400 to-green-500 text-black shadow-md font-extrabold'
                : 'text-zinc-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book a Slot</span>
          </button>

          <button
            onClick={() => onSelectTab('facilities')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition-all duration-200 ${
              customerTab === 'facilities'
                ? 'bg-gradient-to-r from-emerald-400 to-green-500 text-black shadow-md font-extrabold'
                : 'text-zinc-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Pitches & Specs</span>
          </button>

          <button
            onClick={() => onSelectTab('matchfinder')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition-all duration-200 ${
              customerTab === 'matchfinder'
                ? 'bg-gradient-to-r from-emerald-400 to-green-500 text-black shadow-md font-extrabold'
                : 'text-zinc-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Battle Board</span>
          </button>

          <button
            onClick={() => onSelectTab('reviews')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition-all duration-200 ${
              customerTab === 'reviews'
                ? 'bg-gradient-to-r from-emerald-400 to-green-500 text-black shadow-md font-extrabold'
                : 'text-zinc-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Reviews</span>
          </button>
        </nav>

        {/* Right side actions */}
        <div className="hidden sm:flex items-center gap-2.5">
          <button
            onClick={onOpenMyBookings}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0f1d13] hover:bg-[#162b1d] border border-[#213e2a] text-zinc-200 text-xs font-semibold font-mono transition-all active:scale-95 hover:border-emerald-500/40"
          >
            <Ticket className="w-3.5 h-3.5 text-emerald-400" />
            <span>Find My Pass</span>
          </button>

          {selectedSlotsCount > 0 ? (
            <button
              onClick={onOpenCheckout}
              className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 hover:from-emerald-300 hover:to-green-300 text-black font-extrabold text-xs uppercase tracking-wider font-mono shadow-xl shadow-emerald-950/80 transition-all duration-200 active:scale-95 animate-pulse"
            >
              <span>Book ({selectedSlotsCount} {selectedSlotsCount === 1 ? 'Slot' : 'Slots'})</span>
              <span className="w-2 h-2 rounded-full bg-black"></span>
            </button>
          ) : (
            <button
              onClick={onScrollToSlots}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-300 text-black font-black text-xs uppercase tracking-wider font-mono shadow-md active:scale-95"
            >
              <span>Book Slot</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Mobile quick actions & menu trigger */}
        <div className="flex lg:hidden items-center gap-2">
          {selectedSlotsCount > 0 ? (
            <button
              onClick={onOpenCheckout}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-400 text-black font-black text-xs uppercase tracking-wider shadow-lg active:scale-95"
            >
              Book ({selectedSlotsCount})
            </button>
          ) : (
            <button
              onClick={onOpenMyBookings}
              className="p-2 rounded-xl bg-[#0f1d13] border border-[#213e2a] text-emerald-400 text-xs"
              title="Lookup Pass"
            >
              <Ticket className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-[#0f1d13] border border-[#213e2a] text-zinc-200 active:scale-95"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#09140e] border-b border-[#1b3322] px-4 py-4 space-y-2 animate-in slide-in-from-top-2 duration-200 font-mono text-xs">
          <button
            onClick={() => {
              onSelectTab('booking');
              onScrollToSlots();
              setMobileMenuOpen(false);
            }}
            className="w-full p-2.5 rounded-xl text-left font-bold flex items-center justify-between text-zinc-200 hover:bg-[#122217]"
          >
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Book a Slot</span>
            </span>
            <span className="text-emerald-400 font-mono text-[10px]">Instant Confirmation →</span>
          </button>

          <button
            onClick={() => {
              onSelectTab('facilities');
              setMobileMenuOpen(false);
            }}
            className="w-full p-2.5 rounded-xl text-left font-bold flex items-center justify-between text-zinc-200 hover:bg-[#122217]"
          >
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Pitches & Amenities</span>
            </span>
            <span className="text-zinc-500 text-[10px]">FIFA Spec Turf →</span>
          </button>

          <button
            onClick={() => {
              onSelectTab('matchfinder');
              setMobileMenuOpen(false);
            }}
            className="w-full p-2.5 rounded-xl text-left font-bold flex items-center justify-between text-zinc-200 hover:bg-[#122217]"
          >
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Battle Board (Find Players)</span>
            </span>
            <span className="text-zinc-500 text-[10px]">Community →</span>
          </button>

          <button
            onClick={() => {
              onSelectTab('reviews');
              setMobileMenuOpen(false);
            }}
            className="w-full p-2.5 rounded-xl text-left font-bold flex items-center justify-between text-zinc-200 hover:bg-[#122217]"
          >
            <span className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>Customer Reviews (4.9★)</span>
            </span>
            <span className="text-amber-400 text-[10px]">Google Verified →</span>
          </button>

          <div className="pt-3 border-t border-[#182e1f] flex items-center justify-between">
            <button
              onClick={() => {
                onOpenMyBookings();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-emerald-400 font-bold active:scale-95"
            >
              <Ticket className="w-4 h-4" />
              <span>Lookup My Match Pass</span>
            </button>
            <a
              href={`tel:${settings.phone}`}
              className="text-zinc-400 hover:text-white flex items-center gap-1"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>{settings.phone}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
