import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Ticket, 
  Calendar, 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  Shield 
} from 'lucide-react';
import { Booking, OwnerSettings } from '../../types';

interface MyBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  onSelectBooking: (booking: Booking) => void;
  settings: OwnerSettings;
}

export const MyBookingsModal: React.FC<MyBookingsModalProps> = ({
  isOpen,
  onClose,
  bookings,
  onSelectBooking,
  settings
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filtered = bookings.filter(b => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      b.captainPhone.includes(term) ||
      b.captainName.toLowerCase().includes(term) ||
      b.bookingRef.toLowerCase().includes(term) ||
      (b.teamName && b.teamName.toLowerCase().includes(term))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0c1810] border-2 border-[#1f3d28] rounded-3xl w-full max-w-lg max-h-[85vh] overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 flex flex-col">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#1b3623] bg-[#0e1d13] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Ticket className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold uppercase text-white font-mono tracking-wider">
                Find My Match Pass
              </h3>
              <p className="text-xs text-zinc-400">
                Enter your 10-digit mobile number or Pass ID
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-[#14281a] hover:bg-[#1a3523] text-zinc-300 hover:text-white flex items-center justify-center border border-[#21422a] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-[#1b3623] bg-[#09130d]">
          <div className="relative">
            <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by mobile number (e.g. 98201) or #BG ref..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0f2216] border border-[#23482d] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400 font-mono shadow-inner"
              autoFocus
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mt-2 px-1">
            <span>Tip: Enter your phone number used at booking</span>
            <span>Total match passes: {bookings.length}</span>
          </div>
        </div>

        {/* Bookings List Area */}
        <div className="p-4 sm:p-5 space-y-3 overflow-y-auto flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#122417] text-zinc-500 mx-auto flex items-center justify-center">
                <Ticket className="w-6 h-6" />
              </div>
              <p className="text-white font-mono font-bold text-sm">No match passes found</p>
              <p className="text-zinc-500 text-xs font-mono">
                Check the mobile number or booking reference and try again.
              </p>
            </div>
          ) : (
            filtered.map(booking => {
              const isPaid = booking.paymentStatus === 'paid_full';
              return (
                <div
                  key={booking.id}
                  onClick={() => {
                    onSelectBooking(booking);
                    onClose();
                  }}
                  className="p-4 rounded-2xl bg-[#0e1d13] border border-[#1f3d28] hover:border-emerald-400/60 hover:bg-[#122417] transition-all cursor-pointer flex items-center justify-between group shadow-sm active:scale-[0.99]"
                >
                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-emerald-400 text-sm">
                        #{booking.bookingRef}
                      </span>
                      <span className="text-zinc-500">•</span>
                      <span className="text-white font-bold">{booking.pitchName}</span>
                    </div>

                    <div className="flex items-center gap-2 text-zinc-300 text-[11px]">
                      <span className="flex items-center gap-1 text-zinc-400">
                        <Calendar className="w-3 h-3 text-emerald-400" />
                        {booking.date}
                      </span>
                      <span className="text-zinc-600">•</span>
                      <span className="flex items-center gap-1 text-amber-300">
                        <Clock className="w-3 h-3 text-amber-400" />
                        {booking.timeRange}
                      </span>
                    </div>

                    <div className="text-zinc-400 text-[11px] flex items-center gap-2">
                      <span>Captain: <strong className="text-white">{booking.captainName}</strong></span>
                      <span className="text-zinc-600">•</span>
                      <span>{booking.sport}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right font-mono">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md block ${
                        isPaid ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-400/20 text-amber-300'
                      }`}>
                        {isPaid ? 'PAID' : `DUE ₹${booking.balanceDue}`}
                      </span>
                      <span className="text-xs font-bold text-white mt-1 block">
                        ₹{booking.totalAmount}
                      </span>
                    </div>

                    <div className="w-8 h-8 rounded-xl bg-[#14291b] group-hover:bg-emerald-500 group-hover:text-black text-emerald-400 flex items-center justify-center transition-colors">
                      <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#09130d] border-t border-[#1b3623] flex items-center justify-between text-xs font-mono text-zinc-400">
          <span>Need help? Contact turf desk: {settings.phone}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#14281a] hover:bg-[#1b3623] text-white font-bold transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
