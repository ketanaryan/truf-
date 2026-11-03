import React from 'react';
import { 
  X, 
  Printer, 
  Share2, 
  CheckCircle2, 
  Shield, 
  Calendar, 
  Clock, 
  MapPin, 
  Sparkles,
  Award,
  CircleDollarSign
} from 'lucide-react';
import { Booking, OwnerSettings } from '../../types';

interface TicketPassModalProps {
  booking: Booking | null;
  onClose: () => void;
  settings: OwnerSettings;
}

export const TicketPassModal: React.FC<TicketPassModalProps> = ({
  booking,
  onClose,
  settings
}) => {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `⚽ *BATTLEGROUNDS MATCH PASS*\n` +
      `Booking ID: *#${booking.bookingRef}*\n` +
      `Pitch: *${booking.pitchName}*\n` +
      `Format: *${booking.sport}*\n` +
      `Date: *${booking.date}*\n` +
      `Slot: *${booking.timeRange}*\n` +
      `Captain: *${booking.captainName}* (${booking.teamName})\n` +
      `Payment: *${booking.paymentStatus === 'paid_full' ? '100% FULLY PAID' : 'Token Paid (Counter Balance ₹' + booking.balanceDue + ')'}*\n` +
      `Venue: ${settings.address}\n\n` +
      `Please arrive 15 minutes before kick-off!`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const isFullyPaid = booking.paymentStatus === 'paid_full';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md my-auto animate-in fade-in zoom-in-95">
        
        {/* Ticket Container */}
        <div className="bg-[#0c1810] border-2 border-[#1f3d28] rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden">
          
          {/* Printable Ticket Area */}
          <div id="printable-ticket" className="relative p-6 sm:p-7 space-y-5 bg-gradient-to-b from-[#0f2216] via-[#0c1810] to-[#08100b]">
            
            {/* Ticket Notches (Decorative punch notches on left & right) */}
            <div className="ticket-notch-left"></div>
            <div className="ticket-notch-right"></div>

            {/* Stadium Glow Arc at top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-12 bg-emerald-400/20 blur-2xl pointer-events-none rounded-full"></div>

            {/* Pass Header */}
            <div className="flex items-center justify-between border-b border-[#1c3824] pb-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span className="font-display font-black text-xl tracking-wider text-white uppercase italic">
                    BATTLE<span className="text-emerald-400">GROUNDS</span>
                  </span>
                </div>
                <span className="text-[10px] block font-mono text-emerald-400/90 font-bold uppercase tracking-widest">
                  OFFICIAL DIGITAL MATCH PASS
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Pass ID</span>
                <span className="text-xs font-mono font-black text-emerald-300 bg-[#122619] px-3 py-1 rounded-lg border border-[#234b2f] shadow-inner">
                  #{booking.bookingRef}
                </span>
              </div>
            </div>

            {/* Status Live Bar */}
            <div className="flex items-center justify-between bg-[#122619]/90 border border-[#20442a] p-3 rounded-2xl text-xs font-mono shadow-sm">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
                </span>
                <span className="text-emerald-200 font-bold uppercase tracking-wide text-[11px]">
                  {booking.isCheckedIn ? 'Player On Turf' : 'Confirmed & Slot Reserved'}
                </span>
              </div>
              
              <span className={`text-[10px] uppercase px-2.5 py-1 rounded-lg font-black tracking-wider ${
                isFullyPaid
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
              }`}>
                {isFullyPaid ? '100% PAID' : `DUE ₹${booking.balanceDue}`}
              </span>
            </div>

            {/* Match Grid Telemetry */}
            <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
              <div className="p-3.5 rounded-2xl bg-[#09140d] border border-[#1b3623]">
                <span className="text-zinc-400 text-[10px] uppercase tracking-wider block mb-1">Court & Pitch</span>
                <span className="text-white font-bold block truncate text-sm">{booking.pitchName}</span>
                <span className="text-emerald-400 text-[11px] font-semibold">{booking.sport}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#09140d] border border-[#1b3623]">
                <span className="text-zinc-400 text-[10px] uppercase tracking-wider block mb-1">Date & Time</span>
                <span className="text-white font-bold block text-sm">{booking.date}</span>
                <span className="text-amber-400 text-[11px] font-semibold">{booking.timeRange}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#09140d] border border-[#1b3623]">
                <span className="text-zinc-400 text-[10px] uppercase tracking-wider block mb-1">Team Captain</span>
                <span className="text-white font-bold block truncate">{booking.captainName}</span>
                <span className="text-zinc-400 text-[11px]">{booking.captainPhone}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#09140d] border border-[#1b3623]">
                <span className="text-zinc-400 text-[10px] uppercase tracking-wider block mb-1">Squad Name</span>
                <span className="text-white font-bold block truncate">{booking.teamName}</span>
                <span className="text-zinc-400 text-[11px]">{booking.durationHours} hr match</span>
              </div>
            </div>

            {/* Equipment Add-ons (if any) */}
            {booking.selectedAddons && booking.selectedAddons.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-[#09140d] border border-[#1b3623] text-xs font-mono">
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1.5 font-bold">
                  Reserved Equipment & Match Add-ons:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {booking.selectedAddons.map((addon, idx) => (
                    <span 
                      key={idx} 
                      className="px-2.5 py-1 rounded-lg bg-[#122619] text-emerald-300 text-[11px] border border-[#1e4229] font-medium"
                    >
                      {addon.qty}x {addon.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Scannable Gate Verification Box */}
            <div className="p-4 rounded-2xl bg-[#070f09] border-2 border-[#1c3824] flex items-center justify-between gap-4 shadow-inner">
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 bg-white rounded-xl shadow-md border-2 border-emerald-500/50">
                  <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
                    <rect width="100" height="100" fill="white" />
                    <rect x="10" y="10" width="30" height="30" fill="black" />
                    <rect x="15" y="15" width="20" height="20" fill="white" />
                    <rect x="20" y="20" width="10" height="10" fill="black" />
                    <rect x="60" y="10" width="30" height="30" fill="black" />
                    <rect x="65" y="15" width="20" height="20" fill="white" />
                    <rect x="70" y="20" width="10" height="10" fill="black" />
                    <rect x="10" y="60" width="30" height="30" fill="black" />
                    <rect x="15" y="65" width="20" height="20" fill="white" />
                    <rect x="20" y="70" width="10" height="10" fill="black" />
                    <rect x="50" y="50" width="15" height="15" fill="black" />
                    <rect x="70" y="60" width="10" height="25" fill="black" />
                    <rect x="55" y="75" width="20" height="10" fill="black" />
                    <rect x="42" y="25" width="10" height="10" fill="black" />
                    <rect x="42" y="65" width="10" height="10" fill="black" />
                  </svg>
                </div>

                <div className="text-[11px] font-mono space-y-0.5">
                  <span className="text-emerald-400 font-bold block uppercase tracking-wider text-[10px]">
                    Reception Gate QR
                  </span>
                  <span className="text-white font-bold block">Scan at Turf Counter</span>
                  <span className="text-zinc-400 text-[10px] block">Quick check-in & bib issue</span>
                </div>
              </div>

              <div className="text-right font-mono">
                <span className="text-zinc-400 block text-[10px] uppercase">Paid Online</span>
                <span className="text-emerald-400 font-black text-base">₹{booking.advancePaid}</span>
                {booking.balanceDue > 0 && (
                  <span className="text-amber-400 font-bold text-[10px] block">
                    +₹{booking.balanceDue} due at gate
                  </span>
                )}
              </div>
            </div>

            {/* Venue Address & Instructions */}
            <div className="text-[10px] text-zinc-400 font-mono space-y-1 pt-1 border-t border-[#162b1d]">
              <div className="flex items-start gap-1.5 text-zinc-300">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="truncate">{settings.address}</span>
              </div>
              <p className="text-zinc-400 pl-5">
                • Please report 15 mins prior • Clean rubber studs or turf trainers only.
              </p>
            </div>

          </div>

          {/* Modal Action Footer */}
          <div className="p-4 sm:p-5 bg-[#09140d] border-t border-[#1b3623] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#122417] hover:bg-[#1a3321] border border-[#21422a] text-zinc-200 text-xs font-mono font-bold transition-all active:scale-95"
              >
                <Printer className="w-3.5 h-3.5 text-emerald-400" />
                <span>Print</span>
              </button>

              <button
                onClick={handleShareWhatsApp}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#122e1b] hover:bg-[#183d24] border border-[#24522f] text-emerald-300 text-xs font-mono font-bold transition-all active:scale-95"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-300 hover:to-green-400 text-black text-xs font-black font-mono uppercase tracking-wider transition-all active:scale-95 shadow-md"
            >
              Done
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
