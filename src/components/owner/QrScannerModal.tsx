import React, { useState, useEffect } from 'react';
import { 
  X, 
  QrCode, 
  Search, 
  CheckCircle2, 
  Camera, 
  User, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  AlertCircle,
  CheckSquare,
  Square,
  DollarSign
} from 'lucide-react';
import { Booking } from '../../types';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  onCheckIn: (bookingId: string) => void;
  onCollectBalance: (bookingId: string) => void;
  onApproveUpi?: (bookingId: string) => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  isOpen,
  onClose,
  bookings,
  onCheckIn,
  onCollectBalance,
  onApproveUpi
}) => {
  const [query, setQuery] = useState('');
  const [matchedBooking, setMatchedBooking] = useState<Booking | null>(null);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [equipmentIssued, setEquipmentIssued] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setMatchedBooking(null);
      setSearchAttempted(false);
      setEquipmentIssued(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleScanOrSearch = (codeToSearch?: string) => {
    const val = (codeToSearch || query).trim().toLowerCase();
    setSearchAttempted(true);

    const cleanVal = val.replace('#', '').trim();
    const cleanDigits = cleanVal.replace(/\D/g, '');
    const found = bookings.find(b => {
      const bDigits = b.captainPhone.replace(/\D/g, '');
      return (
        b.bookingRef.toLowerCase() === cleanVal || 
        b.bookingRef.toLowerCase() === val || 
        b.id.toLowerCase() === val ||
        (cleanDigits.length >= 4 && bDigits.includes(cleanDigits)) ||
        b.captainName.toLowerCase().includes(cleanVal)
      );
    });

    setMatchedBooking(found || null);
  };

  const handleClear = () => {
    setQuery('');
    setMatchedBooking(null);
    setSearchAttempted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto font-sans">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 text-xs text-slate-800">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 bg-[#0B1D2D] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF6A00] flex items-center justify-center text-white">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold uppercase text-white tracking-wider">
                Gate Scanner & Turnstile Check-In
              </h3>
              <p className="text-slate-300 text-xs">
                Verify player digital match pass or search booking ID
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Viewfinder Simulation Area */}
        <div className="p-5 sm:p-6 space-y-4">
          
          <div className="relative h-44 rounded-2xl bg-[#0B1D2D] border-2 border-slate-800 overflow-hidden flex flex-col items-center justify-center shadow-inner">
            
            {/* Corner Reticle Brackets */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#FF6A00]"></div>
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#FF6A00]"></div>
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#FF6A00]"></div>
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#FF6A00]"></div>

            {/* Laser Scanning Beam Line */}
            <div className="absolute left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-[#FF6A00] to-transparent shadow-[0_0_12px_#ff6a00] animate-[scannerSweep_2.5s_ease-in-out_infinite]"></div>

            <Camera className="w-7 h-7 text-[#FF6A00] mb-2" />
            <span className="text-xs font-bold text-white tracking-wider uppercase">
              Optical Pass Scanner Active
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5">
              Align player digital match QR inside reticle
            </span>

            {/* Quick Demo Simulator Buttons */}
            <div className="flex items-center gap-1.5 mt-3 z-10 flex-wrap justify-center px-4">
              <span className="text-[10px] text-slate-400 font-bold">Fast Test:</span>
              {bookings.slice(0, 3).map(b => (
                <button
                  key={b.id}
                  onClick={() => {
                    setQuery(b.bookingRef);
                    handleScanOrSearch(b.bookingRef);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-[#FF6A00] hover:text-white text-orange-300 border border-white/20 text-[10px] font-bold font-mono transition-all active:scale-95"
                >
                  #{b.bookingRef}
                </button>
              ))}
            </div>

          </div>

          {/* Manual Input Search */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter ref e.g. SMT-9102 or phone number..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleScanOrSearch()}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#FF6A00] text-xs font-mono"
              />
            </div>

            <button
              onClick={() => handleScanOrSearch()}
              className="px-5 py-2.5 rounded-xl bg-[#FF6A00] hover:bg-[#E65F00] text-white font-extrabold uppercase tracking-wider text-xs shadow-md transition-all active:scale-95"
            >
              Verify
            </button>
            {matchedBooking && (
              <button
                onClick={handleClear}
                className="px-3 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Validation Result Box */}
          {matchedBooking ? (
            <div className="p-5 rounded-2xl bg-emerald-50/70 border-2 border-emerald-400 shadow-lg space-y-4 animate-in fade-in zoom-in-95">
              
              {/* Top Match Result Header */}
              <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <div>
                    <span className="text-xs font-black text-emerald-800 uppercase tracking-wider block">
                      VALID MATCH PASS
                    </span>
                    <span className="text-xs text-slate-900 font-bold font-mono">
                      Pass #{matchedBooking.bookingRef}
                    </span>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${
                  matchedBooking.paymentStatus === 'paid_full' 
                    ? 'bg-emerald-600 text-white' 
                    : matchedBooking.paymentStatus === 'upi_pending'
                    ? 'bg-amber-500 text-white'
                    : 'bg-amber-500 text-white'
                }`}>
                  {matchedBooking.paymentStatus === 'paid_full' ? 'Paid in Full' : `Due: ₹${matchedBooking.balanceDue}`}
                </span>
              </div>

              {/* Match Particulars */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-0.5">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Captain & Squad</span>
                  <strong className="text-slate-900 font-bold text-sm block">
                    {matchedBooking.captainName}
                  </strong>
                  <span className="text-slate-600 font-semibold">{matchedBooking.teamName}</span>
                </div>

                <div className="space-y-0.5">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Scheduled Slot</span>
                  <strong className="text-slate-900 block font-mono">
                    {matchedBooking.date}
                  </strong>
                  <span className="text-[#0D6EFD] font-bold font-mono">{matchedBooking.timeRange}</span>
                </div>
              </div>

              {/* Check-In Status & Action */}
              <div className="pt-2 border-t border-emerald-200 flex items-center justify-between gap-3">
                {matchedBooking.isCheckedIn ? (
                  <span className="flex items-center gap-1.5 text-emerald-700 font-extrabold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Squad Checked In ({matchedBooking.checkedInAt || 'Active'})</span>
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      onCheckIn(matchedBooking.id);
                      setMatchedBooking({ ...matchedBooking, isCheckedIn: true });
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-all active:scale-95"
                  >
                    Confirm Gate Entry & Check-In
                  </button>
                )}

                {matchedBooking.balanceDue > 0 && (
                  <button
                    onClick={() => {
                      onCollectBalance(matchedBooking.id);
                      setMatchedBooking({ ...matchedBooking, balanceDue: 0, paymentStatus: 'paid_full' });
                    }}
                    className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 flex items-center gap-1"
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Collect ₹{matchedBooking.balanceDue}</span>
                  </button>
                )}
              </div>

            </div>
          ) : searchAttempted ? (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <div>
                <strong className="block font-bold">No Match Pass Found</strong>
                <span className="text-[11px] text-red-700">Please re-check the booking reference or captain phone number.</span>
              </div>
            </div>
          ) : null}

        </div>

      </div>
    </div>
  );
};
