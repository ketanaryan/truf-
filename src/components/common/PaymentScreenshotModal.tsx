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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200 font-sans"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-xl max-h-[90vh] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-800 animate-in zoom-in-95">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#0B1D2D] text-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF6A00] animate-pulse"></span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF6A00]">
                PAYMENT PROOF VERIFICATION
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
              Pass #{booking.bookingRef} • Captain {booking.captainName}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          
          {/* Booking Summary Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-bold">Pitch & Sport</span>
              <strong className="text-slate-900 text-xs">{booking.pitchName}</strong>
              <span className="text-[10px] text-[#00B6C8] font-bold block">{booking.sport}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-bold">Time & Date</span>
              <strong className="text-slate-900 text-xs font-mono">{booking.date}</strong>
              <span className="text-[10px] text-slate-600 font-mono block">{booking.timeRange}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-bold">Total Amount</span>
              <strong className="text-slate-900 text-sm font-mono">₹{booking.totalAmount}</strong>
              <span className="text-[10px] text-emerald-600 font-bold block">₹{booking.advancePaid} Paid</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-bold">Status</span>
              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase mt-0.5 ${
                isPending 
                  ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}>
                {isPending ? 'Verification Due' : 'Paid & Verified'}
              </span>
            </div>
          </div>

          {/* Screenshot Display Area */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-slate-800 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Customer Payment Screenshot Receipt
              </span>
              
              {hasScreenshot && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-slate-100 rounded-lg border border-slate-200 p-0.5">
                    <button
                      type="button"
                      onClick={() => setZoomLevel(prev => Math.max(1, prev - 0.5))}
                      disabled={zoomLevel <= 1}
                      className="px-2 py-0.5 text-slate-700 hover:text-black disabled:opacity-40 text-xs"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] text-slate-700 font-mono px-1.5 font-bold">{zoomLevel}x</span>
                    <button
                      type="button"
                      onClick={() => setZoomLevel(prev => Math.min(2.5, prev + 0.5))}
                      disabled={zoomLevel >= 2.5}
                      className="px-2 py-0.5 text-slate-700 hover:text-black disabled:opacity-40 text-xs"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <a
                    href={booking.paymentScreenshot}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-700 hover:text-black text-[11px] font-bold flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200"
                    title="Open Full Image in New Tab"
                  >
                    <ExternalLink className="w-3 h-3 text-[#FF6A00]" />
                    <span className="hidden sm:inline">Inspect Full</span>
                  </a>

                  <a
                    href={booking.paymentScreenshot}
                    download={`receipt-${booking.bookingRef}.jpg`}
                    className="text-emerald-700 hover:text-emerald-900 text-[11px] font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </a>
                </div>
              )}
            </div>

            <div className="relative rounded-2xl border-2 border-slate-200 bg-slate-900/90 p-2 flex items-center justify-center min-h-[260px] max-h-[420px] overflow-auto">
              {hasScreenshot ? (
                <img 
                  src={booking.paymentScreenshot} 
                  alt={`Payment proof for ${booking.bookingRef}`}
                  style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center', transition: 'transform 0.2s ease-in-out' }}
                  className="max-h-[380px] w-auto max-w-full rounded-xl object-contain shadow-lg"
                />
              ) : (
                <div className="text-center p-6 space-y-2 text-slate-400">
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
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-bold">Customer UPI Transaction / UTR:</span>
              <span className="text-slate-900 font-mono font-black text-sm select-all">
                {booking.upiUtr}
              </span>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition-colors"
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
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#FF6A00] hover:bg-[#E65F00] text-white font-black text-xs uppercase tracking-wider shadow-md transition-all active:scale-95"
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
