import React, { useState } from 'react';
import { X, CheckCircle2, Download, ExternalLink, ShieldCheck, AlertCircle, ZoomIn, ZoomOut } from 'lucide-react';
import { Booking } from '../../types';

interface PaymentScreenshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onApprove?: (bookingId: string) => void;
}

export const PaymentScreenshotModal: React.FC<PaymentScreenshotModalProps> = ({
  isOpen,
  onClose,
  booking,
  onApprove
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  if (!isOpen || !booking) return null;

  const isPending = booking.paymentStatus === 'upi_pending';
  const hasScreenshot = Boolean(booking.paymentScreenshot);
  const isToken = booking.balanceDue > 0 && booking.advancePaid < booking.totalAmount;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-xl max-h-[90vh] bg-[#0c1810] border-2 border-[#1f3d28] rounded-3xl shadow-2xl overflow-hidden flex flex-col font-mono animate-in zoom-in-95">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#1b3823] flex items-center justify-between bg-[#08120b]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                PAYMENT PROOF VERIFICATION
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
              Pass #{booking.bookingRef} • Captain {booking.captainName}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#122417] hover:bg-[#1a3823] text-zinc-400 hover:text-white flex items-center justify-center border border-[#204229] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          
          {/* Booking Summary Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs p-3 rounded-2xl bg-[#08120b] border border-[#172c1c]">
            <div>
              <span className="text-[10px] text-zinc-400 uppercase block">Pitch & Sport</span>
              <strong className="text-white text-xs">{booking.pitchName}</strong>
              <span className="text-[10px] text-emerald-400 block">{booking.sport}</span>
            </div>

            <div>
              <span className="text-[10px] text-zinc-400 uppercase block">Time & Date</span>
              <strong className="text-white text-xs">{booking.date}</strong>
              <span className="text-[10px] text-amber-300 block">{booking.timeRange}</span>
            </div>

            <div>
              <span className="text-[10px] text-zinc-400 uppercase block">Total Amount</span>
              <strong className="text-emerald-400 text-sm">₹{booking.totalAmount}</strong>
              <span className="text-[10px] text-zinc-400 block">₹{booking.advancePaid} Paid</span>
            </div>

            <div>
              <span className="text-[10px] text-zinc-400 uppercase block">Status</span>
              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase mt-0.5 ${
                isPending 
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40' 
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}>
                {isPending ? 'Verification Due' : 'Paid & Verified'}
              </span>
            </div>
          </div>

          {/* Screenshot Display Area */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-zinc-300 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Customer Payment Screenshot Receipt
              </span>
              
              {hasScreenshot && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-[#122619] rounded-lg border border-[#20442a] p-0.5">
                    <button
                      type="button"
                      onClick={() => setZoomLevel(prev => Math.max(1, prev - 0.5))}
                      disabled={zoomLevel <= 1}
                      className="px-2 py-0.5 text-zinc-300 hover:text-white disabled:opacity-40 text-xs"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] text-emerald-400 font-mono px-1.5">{zoomLevel}x</span>
                    <button
                      type="button"
                      onClick={() => setZoomLevel(prev => Math.min(2.5, prev + 0.5))}
                      disabled={zoomLevel >= 2.5}
                      className="px-2 py-0.5 text-zinc-300 hover:text-white disabled:opacity-40 text-xs"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <a
                    href={booking.paymentScreenshot}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-300 hover:text-white text-[11px] font-bold flex items-center gap-1 bg-[#122619] px-2.5 py-1 rounded-lg border border-[#20442a]"
                    title="Open Full Image in New Tab"
                  >
                    <ExternalLink className="w-3 h-3 text-emerald-400" />
                    <span className="hidden sm:inline">Inspect Full</span>
                  </a>

                  <a
                    href={booking.paymentScreenshot}
                    download={`receipt-${booking.bookingRef}.jpg`}
                    className="text-emerald-400 hover:text-white text-[11px] font-bold flex items-center gap-1 bg-[#122619] px-2.5 py-1 rounded-lg border border-[#20442a]"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </a>
                </div>
              )}
            </div>

            <div className="relative rounded-2xl border-2 border-[#1f3d28] bg-black/60 p-2 flex items-center justify-center min-h-[260px] max-h-[420px] overflow-auto">
              {hasScreenshot ? (
                <img 
                  src={booking.paymentScreenshot} 
                  alt={`Payment proof for ${booking.bookingRef}`}
                  style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center', transition: 'transform 0.2s ease-in-out' }}
                  className="max-h-[380px] w-auto max-w-full rounded-xl object-contain shadow-lg"
                />
              ) : (
                <div className="text-center p-6 space-y-2 text-zinc-400">
                  <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
                  <p className="text-sm font-bold text-white">No screenshot image attached.</p>
                  <p className="text-xs">
                    Customer registered UTR: <strong className="text-amber-300 font-mono">{booking.upiUtr || 'N/A'}</strong>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Optional UTR Number if present */}
          {booking.upiUtr && (
            <div className="p-3 rounded-xl bg-[#08120b] border border-[#1b3623] flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-bold">UTR / Ref Number:</span>
              <span className="text-amber-300 font-mono font-black text-sm select-all">
                {booking.upiUtr}
              </span>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-[#1b3823] bg-[#08120b] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#122417] hover:bg-[#1a3823] text-zinc-300 hover:text-white text-xs font-bold transition-colors"
          >
            Close
          </button>

          {isPending && onApprove && (
            <button
              type="button"
              onClick={() => {
                onApprove(booking.id);
                onClose();
              }}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-300 hover:to-green-400 text-black font-black text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all"
            >
              <CheckCircle2 className="w-4 h-4 stroke-[3]" />
              <span>
                {isToken 
                  ? `Approve ₹${booking.advancePaid} Token (₹${booking.balanceDue} Due at Turf)` 
                  : `Approve ₹${booking.totalAmount} Full Payment`}
              </span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
