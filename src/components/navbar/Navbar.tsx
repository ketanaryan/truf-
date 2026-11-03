import React, { useState } from 'react';
import { 
  Shield, 
  LayoutDashboard, 
  User, 
  Ticket, 
  PhoneCall, 
  MapPin, 
  RotateCcw,
  Menu,
  X,
  Zap,
  Sparkles
} from 'lucide-react';
import { OwnerSettings } from '../../types';
import { useToast } from '../common/ToastContext';

interface NavbarProps {
  currentView: 'customer' | 'owner';
  onViewChange: (view: 'customer' | 'owner') => void;
  selectedSlotsCount: number;
  onOpenCheckout: () => void;
  onOpenMyBookings: () => void;
  settings: OwnerSettings;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  selectedSlotsCount,
  onOpenCheckout,
  onOpenMyBookings,
  settings,
  onResetData
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { showToast } = useToast();

  const handleResetWithToast = () => {
    onResetData();
    showToast({
      title: 'Demo State Reset',
      message: 'Arena slots, bookings & settings restored to pristine demo state.',
      type: 'info'
    });
  };

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

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand identity */}
        <div 
          onClick={() => onViewChange('customer')}
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

        {/* Center Mode Switcher (Athletic Stadium Pill) */}
        <div className="hidden md:flex items-center bg-[#0a150e] p-1 rounded-2xl border border-[#1d3824] shadow-inner">
          <button
            onClick={() => {
              onViewChange('customer');
              showToast({ title: 'Player View', message: 'Switched to Player Booking matrix.', type: 'info', duration: 2000 });
            }}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold font-mono transition-all duration-200 active:scale-95 ${
              currentView === 'customer'
                ? 'bg-gradient-to-r from-emerald-400 to-green-500 text-black shadow-lg font-extrabold'
                : 'text-zinc-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <User className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Player Booking</span>
          </button>
          
          <button
            onClick={() => {
              onViewChange('owner');
              showToast({ title: 'Owner Command Desk', message: 'Switched to Reception & Turf Operations Desk.', type: 'warning', duration: 2000 });
            }}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold font-mono transition-all duration-200 active:scale-95 ${
              currentView === 'owner'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-lg font-extrabold'
                : 'text-zinc-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Turf Owner Desk</span>
          </button>
        </div>

        {/* Right side actions */}
        <div className="hidden md:flex items-center gap-2.5">
          <button
            onClick={onOpenMyBookings}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0f1d13] hover:bg-[#162b1d] border border-[#213e2a] text-zinc-200 text-xs font-semibold font-mono transition-all active:scale-95 hover:border-emerald-500/40"
          >
            <Ticket className="w-3.5 h-3.5 text-emerald-400" />
            <span>Lookup Pass</span>
          </button>

          {selectedSlotsCount > 0 && currentView === 'customer' && (
            <button
              onClick={onOpenCheckout}
              className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 hover:from-emerald-300 hover:to-green-300 text-black font-extrabold text-xs uppercase tracking-wider font-mono shadow-xl shadow-emerald-950/80 transition-all duration-200 active:scale-95 animate-pulse"
            >
              <span>Book ({selectedSlotsCount} {selectedSlotsCount === 1 ? 'Slot' : 'Slots'})</span>
              <span className="w-2 h-2 rounded-full bg-black"></span>
            </button>
          )}

          <button
            onClick={handleResetWithToast}
            className="p-2.5 rounded-xl bg-[#0f1d13] hover:bg-[#162b1d] border border-[#213e2a] text-zinc-400 hover:text-white transition-all active:scale-90"
            title="Reset sample bookings and demo data"
            aria-label="Reset sample data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile quick actions & menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          {selectedSlotsCount > 0 && currentView === 'customer' && (
            <button
              onClick={onOpenCheckout}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-400 text-black font-black text-xs uppercase tracking-wider shadow-lg active:scale-95"
            >
              Book ({selectedSlotsCount})
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
        <div className="md:hidden bg-[#09140e] border-b border-[#1b3322] px-4 py-4 space-y-3.5 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onViewChange('customer');
                setMobileMenuOpen(false);
              }}
              className={`p-3 rounded-xl text-center text-xs font-bold font-mono transition-all ${
                currentView === 'customer'
                  ? 'bg-gradient-to-r from-emerald-400 to-green-500 text-black shadow-md'
                  : 'bg-[#122217] text-zinc-300 border border-[#223d2b]'
              }`}
            >
              Player Booking
            </button>
            <button
              onClick={() => {
                onViewChange('owner');
                setMobileMenuOpen(false);
              }}
              className={`p-3 rounded-xl text-center text-xs font-bold font-mono transition-all ${
                currentView === 'owner'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-md'
                  : 'bg-[#122217] text-zinc-300 border border-[#223d2b]'
              }`}
            >
              Turf Owner Desk
            </button>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#182e1f] text-xs font-mono">
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
            
            <button
              onClick={() => {
                handleResetWithToast();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 text-zinc-400 hover:text-white"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
