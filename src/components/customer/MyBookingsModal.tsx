import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Ticket, 
  Calendar, 
  Clock, 
  ChevronRight, 
  Star,
  MapPin
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
    const cleanDigits = term.replace(/\D/g, '');
    const bookingDigits = b.captainPhone.replace(/\D/g, '');
    return (
      (cleanDigits.length >= 3 && bookingDigits.includes(cleanDigits)) ||
      b.captainPhone.includes(term) ||
      b.captainName.toLowerCase().includes(term) ||
      b.bookingRef.toLowerCase().includes(term) ||
      (b.teamName && b.teamName.toLowerCase().includes(term))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto font-body">
      <div className="bg-[#1e2023] border border-white/15 rounded-3xl w-full max-w-lg max-h-[85vh] overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 flex flex-col text-white">
        
        {/* Header (The Nova Club Dark Luxury) */}
        <div className="p-5 sm:p-6 border-b border-white/10 bg-[#111317] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#ff7a00] to-amber-500 flex items-center justify-center text-white shadow-[0_4px_16px_rgba(255,122,0,0.3)]">
              <Ticket className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase tracking-wide text-white font-headline">
                Find My Match Pass
              </h3>
              <p className="text-xs text-neutral-400">
                Enter your 10-digit mobile number or Pass ID
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-[#16181b]">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by mobile number (e.g. 98201) or #BG ref..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#ff7a00] focus:ring-2 focus:ring-[#ff7a00]/20 shadow-sm"
              autoFocus
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-2 px-1 font-medium">
            <span>Tip: Enter the phone number used while booking</span>
            <span>Passes: {bookings.length}</span>
          </div>
        </div>

        {/* Bookings List Area */}
        <div className="p-4 sm:p-5 space-y-3 overflow-y-auto flex-1 bg-[#1e2023]">
          {filtered.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <div className="w-12 h-12 rounded-full bg-white/5 text-neutral-400 mx-auto flex items-center justify-center border border-white/10">
                <Ticket className="w-6 h-6" />
              </div>
              <p className="text-white font-bold text-sm font-headline">No match passes found</p>
              <p className="text-neutral-400 text-xs">
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
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#ff7a00]/50 hover:bg-white/10 transition-all cursor-pointer flex items-center justify-between group shadow-lg active:scale-[0.99]"
                >
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-amber-400 text-sm">
                        #{booking.bookingRef}
                      </span>
                      <span className="text-neutral-600">•</span>
                      <span className="text-white font-extrabold font-headline">Box Cricket Turf</span>
                    </div>

                    <div className="flex items-center gap-2 text-neutral-400 text-[11px]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#ff7a00]" />
                        <span className="font-mono font-semibold text-neutral-300">{booking.date}</span>
                      </span>
                      <span className="text-neutral-600">•</span>
                      <span className="flex items-center gap-1 text-neutral-300 font-mono font-semibold">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        {booking.timeRange}
                      </span>
                    </div>

                    <div className="text-neutral-400 text-[11px] flex items-center gap-2">
                      <span>Captain: <strong className="text-white">{booking.captainName}</strong></span>
                      <span className="text-neutral-600">•</span>
                      <span className="text-orange-400 font-bold">🏏 Box Cricket</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      {booking.status === 'cancelled' ? (
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full block bg-red-500/20 text-red-300 border border-red-500/30">
                          CANCELLED
                        </span>
                      ) : isPaid ? (
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full block bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          PAID IN FULL
                        </span>
                      ) : booking.paymentStatus === 'upi_pending' ? (
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full block bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {booking.balanceDue > 0 ? `DUE ₹${booking.balanceDue}` : 'UPI SUBMITTED'}
                        </span>
                      ) : (
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full block bg-orange-500/20 text-orange-300 border border-orange-500/30">
                          DUE ₹${booking.balanceDue}
                        </span>
                      )}
                      <span className="text-sm font-black text-white mt-1 block font-mono">
                        ₹{booking.totalAmount}
                      </span>
                    </div>

                    <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 group-hover:bg-[#ff7a00] group-hover:text-white text-neutral-400 flex items-center justify-center transition-colors shadow-sm">
                      <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#111317] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <span>Desk: <strong className="text-white font-mono">{settings.phone}</strong></span>
            <span className="text-neutral-600">•</span>
            <a
              href={settings.googleReviewUrl || "https://www.google.com/maps/place/Sonawane's+Multi+Sport+Turf/@19.9602879,73.7707331,17z/data=!4m8!3m7!1s0x3bddebed03becdf1:0x868ac5e0f1c6c8bf!8m2!3d19.9602879!4d73.7707331!9m1!1b1!16s%2Fg%2F11k4jz57b_"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ff7a00] hover:underline font-bold flex items-center gap-1 font-headline"
            >
              <span>⭐ Rate on Google</span>
            </a>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-200 font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
