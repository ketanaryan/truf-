import React, { useState } from 'react';
import { motion } from 'motion/react';
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
  ArrowRight
} from 'lucide-react';
import { OwnerSettings } from '../../types';
import { SpringButton } from '../motion/MotionPrimitives';

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
    <header className="sticky top-0 z-50 bg-[#0B1D2D] border-b border-white/10 shadow-xl font-sans">
      
      {/* Top Telemetry micro-bar with venue hotline and live status */}
      <div className="bg-[#061320] border-b border-white/5 px-3 sm:px-6 py-1.5 text-[11px] text-slate-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="text-[#00B6C8] font-bold uppercase tracking-wider text-[10px] hidden xs:inline">
              Arena Status:
            </span>
            <span className="text-white font-medium truncate max-w-[220px] xs:max-w-none">
              {settings.isRainHalted ? '⚠️ Inclement Weather Hold' : 'Open 06:00 AM – 11:00 PM • Multi-Sport Cricket & Football Turf'}
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-slate-400">
            <div className="hidden md:flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#FF6A00] shrink-0" />
              <span className="truncate max-w-[200px] text-slate-300">{settings.address.split(',')[0]}</span>
            </div>
            <span className="hidden md:inline text-slate-600">•</span>
            <a 
              href={`tel:${settings.phone}`} 
              className="flex items-center gap-1.5 text-slate-200 hover:text-white transition-colors font-medium active:scale-95"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#FF6A00]" />
              <span>Desk: <strong className="text-white font-mono">{settings.phone}</strong></span>
            </a>
          </div>
        </div>
      </div>

      {/* Hatrick Grounds Inspired High-Energy Announcement Ribbon */}
      <div className="bg-gradient-to-r from-[#E65F00] via-[#FF6A00] to-[#E65F00] border-b-2 border-[#00B6C8] px-3 py-1.5 text-[12px] text-white font-bold tracking-wide text-center shadow-md flex items-center justify-center gap-2 overflow-x-auto whitespace-nowrap">
        <span className="bg-[#0B1D2D] text-amber-300 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">SPECIAL OFFER</span>
        <span>Offer: Weekdays — Book 2 hrs, pay for 1 | Weekends — Flat Tournament Package • 0% UPI Fees</span>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand identity (Hatrick Grounds Style) */}
        <div 
          onClick={() => {
            onSelectTab('booking');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF6A00] to-[#E65F00] flex items-center justify-center shadow-lg shadow-orange-950/40 border border-orange-300/30 group-hover:scale-105 transition-all duration-200">
            <Shield className="w-5 h-5 text-white fill-white/20 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-xl sm:text-2xl tracking-wide text-white uppercase italic">
                SONAWANE'S<span className="text-[#FF6A00]"> TURF</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-300 font-semibold uppercase tracking-wider -mt-0.5 hidden sm:block">
              CRICKET & FOOTBALL • NASHIK
            </p>
          </div>
        </div>

        {/* Center Navigation Links (Motion Primitives Sliding Indicator) */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#061320] p-1.5 rounded-2xl border border-white/10">
          {[
            { id: 'booking', label: 'Book a Slot', icon: <Calendar className="w-3.5 h-3.5" /> },
            { id: 'facilities', label: 'Turf Specs & Amenities', icon: <Zap className="w-3.5 h-3.5" /> },
            { id: 'matchfinder', label: 'Players Board', icon: <Users className="w-3.5 h-3.5" /> },
            { id: 'reviews', label: 'Reviews', icon: <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> }
          ].map((tab) => {
            const isActive = customerTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  onSelectTab(tab.id as any);
                  if (tab.id === 'booking') onScrollToSlots();
                }}
                className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-colors duration-200 flex items-center gap-1.5 ${
                  isActive ? 'text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-active-pill"
                    className="absolute inset-0 rounded-xl bg-[#FF6A00] shadow-md"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {tab.icon}
                  <span>{tab.label}</span>
                </span>
              </button>
            );
          })}
        </nav>

        {/* Right side actions */}
        <div className="hidden sm:flex items-center gap-2.5">
          <button
            onClick={onOpenMyBookings}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-semibold transition-all active:scale-95"
          >
            <Ticket className="w-3.5 h-3.5 text-[#FF6A00]" />
            <span>Find My Pass</span>
          </button>

          {selectedSlotsCount > 0 ? (
            <SpringButton
              onClick={onOpenCheckout}
              className="relative flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#FF6A00] to-[#E65F00] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-orange-950/50 animate-glow-orange"
            >
              <span>Confirm ({selectedSlotsCount})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </SpringButton>
          ) : (
            <SpringButton
              onClick={onScrollToSlots}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#FF6A00] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-950/40"
            >
              <span>BOOK SLOT</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </SpringButton>
          )}
        </div>

        {/* Mobile Menu Button & Mobile Quick Book */}
        <div className="lg:hidden flex items-center gap-2">
          {selectedSlotsCount > 0 && (
            <button
              onClick={onOpenCheckout}
              className="sm:hidden px-3 py-1.5 rounded-xl bg-[#FF6A00] text-white text-xs font-bold shadow-md active:scale-95"
            >
              Book ({selectedSlotsCount})
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white/10 text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0B1D2D] border-b border-white/10 px-4 py-4 space-y-3 animate-in slide-in-from-top-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onSelectTab('booking');
                onScrollToSlots();
                setMobileMenuOpen(false);
              }}
              className={`p-3 rounded-xl text-left text-xs font-bold ${
                customerTab === 'booking' ? 'bg-[#FF6A00] text-white' : 'bg-[#061320] text-slate-200'
              }`}
            >
              🏏 Book a Slot
            </button>
            <button
              onClick={() => {
                onSelectTab('facilities');
                setMobileMenuOpen(false);
              }}
              className={`p-3 rounded-xl text-left text-xs font-bold ${
                customerTab === 'facilities' ? 'bg-[#FF6A00] text-white' : 'bg-[#061320] text-slate-200'
              }`}
            >
              🏟️ Turf Specs
            </button>
            <button
              onClick={() => {
                onSelectTab('matchfinder');
                setMobileMenuOpen(false);
              }}
              className={`p-3 rounded-xl text-left text-xs font-bold ${
                customerTab === 'matchfinder' ? 'bg-[#FF6A00] text-white' : 'bg-[#061320] text-slate-200'
              }`}
            >
              👥 Players Board
            </button>
            <button
              onClick={() => {
                onSelectTab('reviews');
                setMobileMenuOpen(false);
              }}
              className={`p-3 rounded-xl text-left text-xs font-bold ${
                customerTab === 'reviews' ? 'bg-[#FF6A00] text-white' : 'bg-[#061320] text-slate-200'
              }`}
            >
              ⭐ Reviews (4.9★)
            </button>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={() => {
                onOpenMyBookings();
                setMobileMenuOpen(false);
              }}
              className="text-xs text-slate-300 font-semibold flex items-center gap-1.5"
            >
              <Ticket className="w-4 h-4 text-[#FF6A00]" />
              <span>Lookup My Pass</span>
            </button>
            <a href={`tel:${settings.phone}`} className="text-xs text-[#FF6A00] font-bold">
              Call Desk: {settings.phone}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
