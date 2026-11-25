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
  ExternalLink,
  QrCode
} from 'lucide-react';
import { Booking, OwnerSettings } from '../../types';

interface TicketPassModalProps {
  isOpen: boolean;
  booking: Booking | null;
  onClose: () => void;
  settings: OwnerSettings;
}

export const TicketPassModal: React.FC<TicketPassModalProps> = ({
  isOpen,
  booking,
  onClose,
  settings
}) => {
  if (!isOpen || !booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🏏 *SONAWANE'S MULTI SPORT TURF MATCH PASS*\n` +
      `Booking ID: *#${booking.bookingRef}*\n` +
      `Turf: *${booking.pitchName}*\n` +
      `Date: *${booking.date}*\n` +
      `Slot: *${booking.timeRange}*\n` +
      `Captain: *${booking.captainName}* (${booking.teamName})\n` +
      `Payment: *${
        booking.paymentStatus === 'paid_full' 
          ? '100% FULLY PAID' 
          : booking.paymentStatus === 'upi_pending' 
          ? (booking.upiUtr ? `UPI SUBMITTED (UTR ${booking.upiUtr})` : 'UPI RECEIPT ATTACHED (Pending Verification)') 
          : booking.paymentStatus === 'pay_at_venue'
          ? `Pay at Turf (Counter Due ₹${booking.balanceDue})`
          : `Advance Token Paid (Counter Balance Due ₹${booking.balanceDue})`
      }*\n` +
      `Venue: ${settings.address}\n\n` +
      `Please report 15 minutes before match start! Managed by Kiran Sonawane.`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const isFullyPaid = booking.paymentStatus === 'paid_full';
  const isUpiPending = booking.paymentStatus === 'upi_pending';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto font-sans"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-md my-auto animate-in fade-in zoom-in-95">
        
        {/* Ticket Container (Hatrick Grounds Deep Navy & Crisp White Card) */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden text-slate-800">
          
          {/* Ticket Header */}
          <div className="bg-[#0B1D2D] p-5 sm:p-6 text-white relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-5 h-5 text-[#FF6A00]" />
                  <span className="font-display font-black text-xl tracking-wider text-white uppercase italic">
                    SONAWANE'S<span className="text-[#FF6A00]"> TURF</span>
                  </span>
                </div>
                <span className="text-[10px] block text-[#00B6C8] font-bold uppercase tracking-wider">
                  OFFICIAL MULTI-SPORT MATCH PASS
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right">
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Pass ID</span>
                  <span className="text-xs font-mono font-black text-white bg-white/10 px-2.5 py-0.5 rounded-lg border border-white/20">
                    #{booking.bookingRef}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close pass"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Status Live Bar */}
            <div className="mt-3.5 flex items-center justify-between bg-white/10 border border-white/10 p-2.5 rounded-xl text-xs">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
                </span>
                <span className="text-emerald-300 font-bold uppercase tracking-wide text-[11px]">
                  {booking.isCheckedIn ? 'Checked In On Turf' : 'Slot Confirmed & Reserved'}
                </span>
              </div>
              
              <span className={`text-[10px] uppercase px-2.5 py-1 rounded-lg font-black tracking-wider ${
                isFullyPaid
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : isUpiPending
                  ? 'bg-amber-400 text-black font-extrabold shadow-sm'
                  : 'bg-orange-500 text-white font-extrabold shadow-sm'
              }`}>
                {isFullyPaid ? '100% PAID' : isUpiPending ? 'UPI SUBMITTED' : `DUE ₹${booking.balanceDue}`}
              </span>
            </div>
          </div>

          {/* Ticket Body */}
          <div id="printable-ticket" className="p-5 sm:p-6 space-y-4">
            
            {/* UPI Payment Proof status if applicable */}
            {isUpiPending && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-amber-800 font-bold text-[11px]">
                  <span>Payment Proof Attached ✓</span>
                  <span className="text-[10px] bg-amber-200/80 px-2 py-0.5 rounded text-amber-900 font-extrabold">0% Gateway Fee</span>
                </div>
                {booking.paymentScreenshot && (
                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-amber-200">
                    <img 
                      src={booking.paymentScreenshot} 
                      alt="Receipt" 
                      className="w-10 h-10 rounded-lg object-cover border border-amber-300 shrink-0" 
                    />
                    <div className="overflow-hidden">
                      <span className="text-slate-800 text-[11px] font-bold block truncate">Receipt Photo Uploaded</span>
                      <span className="text-slate-500 text-[10px] block">Owner can verify from workstation</span>
                    </div>
                  </div>
                )}
                {booking.upiUtr && (
                  <div className="text-slate-700 text-xs flex justify-between font-mono">
                    <span>UPI Reference:</span>
                    <strong className="text-amber-800">{booking.upiUtr}</strong>
                  </div>
                )}
              </div>
            )}

            {/* Match Details Grid */}
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[10px] uppercase font-bold block mb-0.5">Turf</span>
                <span className="text-[#111827] font-black block truncate text-sm">Box Cricket Turf</span>
                <span className="text-[#FF6A00] text-[11px] font-bold">120 ft Rebound Cage</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[10px] uppercase font-bold block mb-0.5">Date & Time</span>
                <span className="text-[#111827] font-bold block text-sm font-mono">{booking.date}</span>
                <span className="text-[#0D6EFD] text-[11px] font-bold font-mono">{booking.timeRange}</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[10px] uppercase font-bold block mb-0.5">Team Captain</span>
                <span className="text-[#111827] font-bold block truncate">{booking.captainName}</span>
                <span className="text-slate-500 text-[11px] font-mono">{booking.captainPhone}</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[10px] uppercase font-bold block mb-0.5">Squad Name</span>
                <span className="text-[#111827] font-bold block truncate">{booking.teamName}</span>
                <span className="text-slate-500 text-[11px]">
                  {booking.isFullDayBooking ? 'Full Day Tournament' : `${booking.durationHours} hr match`}
                </span>
              </div>
            </div>

            {/* Scannable Gate Verification Box */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl shadow border border-slate-200">
                  <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none">
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
                  </svg>
                </div>

                <div className="text-xs space-y-0.5">
                  <span className="text-[#0D6EFD] font-bold block uppercase tracking-wider text-[10px]">
                    Reception Gate QR
                  </span>
                  <span className="text-slate-900 font-extrabold block">Scan at Turf Reception</span>
                  <span className="text-slate-500 text-[11px] block">Quick check-in & bib issue</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Paid</span>
                <span className="text-[#0D6EFD] font-black text-lg">₹{booking.advancePaid}</span>
                {booking.balanceDue > 0 && (
                  <span className="text-amber-600 font-bold text-[10px] block">
                    +₹{booking.balanceDue} at desk
                  </span>
                )}
              </div>
            </div>

            {/* Google Review Prompt */}
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between gap-2.5">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                  <span>★★★★★</span>
                  <span className="text-slate-800 ml-1 font-bold">Review on Google</span>
                </div>
                <p className="text-[10px] text-slate-500">
                  Help fellow cricket & football squads discover Sonawane's Turf!
                </p>
              </div>

              <a
                href={settings.googleReviewUrl || `https://www.google.com/search?q=sonawane+multisports+turf+nashik+reviews`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-[11px] font-black uppercase tracking-wider shrink-0 shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <span>5★ Review</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Venue Address & Instructions */}
            <div className="text-xs text-slate-500 space-y-1 pt-1 border-t border-slate-100">
              <div className="flex items-start gap-1.5 text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-[#FF6A00] shrink-0 mt-0.5" />
                <span className="truncate">{settings.address}</span>
              </div>
              <p className="text-slate-400 text-[11px] pl-5">
                • Please arrive 15 mins prior • Rubber studs or flat sneakers only.
              </p>
            </div>

          </div>

          {/* Modal Action Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-all active:scale-95 shadow-sm cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>Print</span>
              </button>

              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold transition-all active:scale-95 shadow-sm cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp</span>
              </button>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="px-8 py-2.5 rounded-xl bg-[#FF6A00] hover:bg-[#E65F00] text-white text-xs font-black uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-orange-500/30 cursor-pointer"
            >
              Done ✓
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
