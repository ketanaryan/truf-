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

  const handleSendToMyWhatsApp = () => {
    const rawCaptain = (booking.captainPhone || '').replace(/\D/g, '');
    const cleanCaptain = rawCaptain.length === 10 ? `91${rawCaptain}` : rawCaptain;
    const text = encodeURIComponent(
      `🏏 *SONAWANE'S MULTI SPORT TURF MATCH PASS*\n` +
      `-----------------------------------------\n` +
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
      `Venue: ${settings.address}\n` +
      `Turf Manager: Kiran Sonawane (${settings.phone})\n\n` +
      `Report 15 minutes before match start! Rubber studs or flat sneakers only.`
    );
    window.open(`https://api.whatsapp.com/send?phone=${cleanCaptain}&text=${text}`, '_blank');
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto font-body"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-md my-auto animate-in fade-in zoom-in-95">
        
        {/* Ticket Container (The Nova Club Dark Luxury Pass) */}
        <div className="bg-[#1e2023] border border-white/15 rounded-3xl shadow-2xl overflow-hidden text-white">
          
          {/* Ticket Header */}
          <div className="bg-[#111317] p-5 sm:p-6 text-white relative border-b border-white/10">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-5 h-5 text-[#ff7a00]" />
                  <span className="font-headline font-black text-xl tracking-wider text-white uppercase italic">
                    SONAWANE'S<span className="text-[#ff7a00]"> TURF</span>
                  </span>
                </div>
                <span className="text-[10px] block text-orange-400 font-bold uppercase tracking-wider font-headline">
                  OFFICIAL MULTI-SPORT MATCH PASS
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right">
                  <span className="text-[9px] text-neutral-400 uppercase tracking-wider block font-headline">Pass ID</span>
                  <span className="text-xs font-mono font-black text-white bg-white/10 px-2.5 py-0.5 rounded-lg border border-white/20">
                    #{booking.bookingRef}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10"
                  aria-label="Close pass"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Status Live Bar */}
            <div className="mt-3.5 flex items-center justify-between bg-white/5 border border-white/10 p-2.5 rounded-xl text-xs">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
                </span>
                <span className="text-emerald-400 font-bold uppercase tracking-wide text-[11px]">
                  {booking.isCheckedIn ? 'Checked In On Turf' : 'Slot Confirmed & Reserved'}
                </span>
              </div>
              
              <span className={`text-[10px] uppercase px-2.5 py-1 rounded-full font-black tracking-wider ${
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
          <div id="printable-ticket" className="p-5 sm:p-6 space-y-4 bg-[#1e2023]">
            
            {/* UPI Payment Proof status if applicable */}
            {isUpiPending && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-amber-300 font-bold text-[11px]">
                  <span>Payment Proof Attached ✓</span>
                  <span className="text-[10px] bg-amber-400/20 px-2 py-0.5 rounded text-amber-300 font-extrabold font-mono">0% Gateway Fee</span>
                </div>
                {booking.paymentScreenshot && (
                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 border border-white/10">
                    <img 
                      src={booking.paymentScreenshot} 
                      alt="Receipt" 
                      className="w-10 h-10 rounded-lg object-cover border border-amber-400/40 shrink-0" 
                    />
                    <div className="overflow-hidden">
                      <span className="text-white text-[11px] font-bold block truncate">Receipt Photo Uploaded</span>
                      <span className="text-neutral-400 text-[10px] block">Owner can verify from workstation</span>
                    </div>
                  </div>
                )}
                {booking.upiUtr && (
                  <div className="text-neutral-300 text-xs flex justify-between font-mono">
                    <span>UPI Reference:</span>
                    <strong className="text-amber-400">{booking.upiUtr}</strong>
                  </div>
                )}
              </div>
            )}

            {/* Match Details Grid */}
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-neutral-400 text-[10px] uppercase font-bold block mb-0.5 font-headline">Turf</span>
                <span className="text-white font-black block truncate text-sm font-headline">Box Cricket Turf</span>
                <span className="text-[#ff7a00] text-[11px] font-bold">120 ft Rebound Cage</span>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-neutral-400 text-[10px] uppercase font-bold block mb-0.5 font-headline">Date & Time</span>
                <span className="text-white font-bold block text-sm font-mono">{booking.date}</span>
                <span className="text-amber-400 text-[11px] font-bold font-mono">{booking.timeRange}</span>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-neutral-400 text-[10px] uppercase font-bold block mb-0.5 font-headline">Team Captain</span>
                <span className="text-white font-bold block truncate font-headline">{booking.captainName}</span>
                <span className="text-neutral-400 text-[11px] font-mono">{booking.captainPhone}</span>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-neutral-400 text-[10px] uppercase font-bold block mb-0.5 font-headline">Squad Name</span>
                <span className="text-white font-bold block truncate font-headline">{booking.teamName}</span>
                <span className="text-neutral-400 text-[11px]">
                  {booking.isFullDayBooking ? 'Full Day Tournament' : `${booking.durationHours} hr match`}
                </span>
              </div>
            </div>

            {/* Scannable Gate Verification Box */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4">
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
                  <span className="text-amber-400 font-bold block uppercase tracking-wider text-[10px] font-headline">
                    Reception Gate QR
                  </span>
                  <span className="text-white font-extrabold block">Scan at Turf Reception</span>
                  <span className="text-neutral-400 text-[11px] block">Quick check-in & bib issue</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-neutral-400 block text-[10px] uppercase font-bold font-headline">Paid</span>
                <span className="text-emerald-400 font-black text-lg font-mono">₹{booking.advancePaid}</span>
                {booking.balanceDue > 0 && (
                  <span className="text-amber-400 font-bold text-[10px] block font-mono">
                    +₹{booking.balanceDue} at desk
                  </span>
                )}
              </div>
            </div>

            {/* Google Review Prompt (Direct Google Maps Reviews Link) */}
            <a
              href={settings.googleReviewUrl || "https://www.google.com/maps/place/Sonawane's+Multi+Sport+Turf/@19.9602879,73.7707331,17z/data=!4m8!3m7!1s0x3bddebed03becdf1:0x868ac5e0f1c6c8bf!8m2!3d19.9602879!4d73.7707331!9m1!1b1!16s%2Fg%2F11k4jz57b_"}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-amber-500/30 hover:border-amber-400/50 flex items-center justify-between gap-2.5 transition-all group cursor-pointer shadow-sm"
              title="Rate 5★ on Google Maps for Sonawane's Multi Sport Turf"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                  <span>★★★★★</span>
                  <span className="text-white group-hover:text-[#ff7a00] transition-colors font-extrabold font-headline">Review on Google</span>
                </div>
                <p className="text-[10px] text-neutral-400">
                  Help fellow cricket & football squads discover Sonawane's Turf!
                </p>
              </div>

              <div className="flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#ff7a00] to-amber-600 group-hover:from-amber-600 group-hover:to-[#ff7a00] text-white text-[11px] font-black uppercase tracking-wider shrink-0 shadow-[0_2px_10px_rgba(255,122,0,0.3)] transition-all active:scale-95">
                <span>5★ Review</span>
                <ExternalLink className="w-3 h-3" />
              </div>
            </a>

            {/* Venue Address & Instructions */}
            <div className="text-xs text-neutral-400 space-y-1 pt-1 border-t border-white/10">
              <div className="flex items-start gap-1.5 text-neutral-300">
                <MapPin className="w-3.5 h-3.5 text-[#ff7a00] shrink-0 mt-0.5" />
                <span className="truncate">{settings.address}</span>
              </div>
              <p className="text-neutral-500 text-[11px] pl-5">
                • Please arrive 15 mins prior • Rubber studs or flat sneakers only.
              </p>
            </div>

          </div>

          {/* Modal Action Footer */}
          <div className="p-4 bg-[#111317] border-t border-white/10 flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 text-xs font-bold transition-all active:scale-95 shadow-sm cursor-pointer"
                title="Print Pass"
              >
                <Printer className="w-3.5 h-3.5 text-neutral-400" />
                <span>Print</span>
              </button>

              <button
                type="button"
                onClick={handleSendToMyWhatsApp}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold transition-all active:scale-95 shadow-sm cursor-pointer"
                title={`Send Match Pass to Captain's WhatsApp (${booking.captainPhone})`}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Send to My WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-bold transition-all active:scale-95 cursor-pointer border border-white/10"
                title="Share with Squad / Friends on WhatsApp"
              >
                <span>Share</span>
              </button>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-[#ff7a00] to-amber-600 hover:from-amber-600 hover:to-[#ff7a00] text-white text-xs font-black uppercase tracking-wider transition-all active:scale-95 shadow-[0_4px_16px_rgba(255,122,0,0.3)] cursor-pointer"
            >
              Done ✓
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
