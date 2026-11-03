import React, { useState } from 'react';
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
  AlertCircle
} from 'lucide-react';
import { Booking } from '../../types';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  onCheckIn: (bookingId: string) => void;
  onCollectBalance: (bookingId: string) => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  isOpen,
  onClose,
  bookings,
  onCheckIn,
  onCollectBalance
}) => {
  const [query, setQuery] = useState('');
  const [matchedBooking, setMatchedBooking] = useState<Booking | null>(null);
  const [searchAttempted, setSearchAttempted] = useState(false);

  if (!isOpen) return null;

  const handleScanOrSearch = (codeToSearch?: string) => {
    const val = (codeToSearch || query).trim().toLowerCase();
    setSearchAttempted(true);

    const cleanVal = val.replace('#', '');
    const found = bookings.find(b => 
      b.bookingRef.toLowerCase() === cleanVal || 
      b.bookingRef.toLowerCase() === val || 
      b.id.toLowerCase() === val ||
      b.captainPhone.includes(cleanVal)
    );

    setMatchedBooking(found || null);
  };

  const handleClear = () => {
    setQuery('');
    setMatchedBooking(null);
    setSearchAttempted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0c1810] border-2 border-[#1f3d28] rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 font-mono text-xs">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#1b3623] bg-[#0e1d13] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold uppercase text-white tracking-wider">
                Gate Scanner & Turnstile Check-In
              </h3>
              <p className="text-zinc-400 text-xs">
                Scan player match pass or search booking ID
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-[#14281a] hover:bg-[#1a3523] text-zinc-300 hover:text-white flex items-center justify-center border border-[#21422a]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Viewfinder Simulation Area */}
        <div className="p-5 sm:p-6 space-y-4">
          
          <div className="relative h-44 rounded-2xl bg-[#070e0a] border-2 border-[#1c3924] overflow-hidden flex flex-col items-center justify-center shadow-inner">
            
            {/* Corner Reticle Brackets */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-emerald-400"></div>
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-emerald-400"></div>
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-emerald-400"></div>
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-emerald-400"></div>

            {/* Laser Scanning Beam Line */}
            <div className="absolute left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#22c55e] animate-[scannerSweep_2.5s_ease-in-out_infinite]"></div>

            <Camera className="w-7 h-7 text-emerald-400/80 mb-2" />
            <span className="text-xs font-bold text-white tracking-wider">
              OPTICAL SCANNER READY
            </span>
            <span className="text-[11px] text-zinc-400 mt-0.5">
              Align player digital match QR inside reticle
            </span>

            {/* Quick Demo Simulator Buttons */}
            <div className="flex items-center gap-1.5 mt-3 z-10">
              <span className="text-[10px] text-zinc-400 font-bold">Fast Test:</span>
              {bookings.slice(0, 3).map(b => (
                <button
                  key={b.id}
                  onClick={() => {
                    setQuery(b.bookingRef);
                    handleScanOrSearch(b.bookingRef);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#122417] hover:bg-emerald-500 hover:text-black text-emerald-300 border border-[#244b2f] text-[10px] font-bold transition-all active:scale-95"
                >
                  #{b.bookingRef}
                </button>
              ))}
            </div>

          </div>

          {/* Manual Input Search */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter ref e.g. BG-9105 or 9820188492..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleScanOrSearch()}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#09140d] border border-[#204229] text-white focus:outline-none focus:border-emerald-400 text-xs"
              />
            </div>

            <button
              onClick={() => handleScanOrSearch()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-300 hover:to-green-400 text-black font-extrabold uppercase tracking-wider text-xs shadow-md transition-all active:scale-95"
            >
              Verify
            </button>
            {matchedBooking && (
              <button
                onClick={handleClear}
                className="px-3 py-2.5 rounded-xl bg-[#122417] text-zinc-300 hover:text-white border border-[#204229]"
              >
                Clear
              </button>
            )}
          </div>

          {/* Validation Result Box */}
          {matchedBooking ? (
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0a1a0f] border-2 border-emerald-400/80 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
              
              {/* Top Match Result Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#1b3d26]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <div>
                    <span className="text-xs font-black text-emerald-300 uppercase tracking-wider block">
                      VALID PASS FOUND
                    </span>
                    <span className="text-[11px] text-white font-bold">
                      Pass #{matchedBooking.bookingRef}
                    </span>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${
                  matchedBooking.paymentStatus === 'paid_full' 
                    ? 'bg-emerald-500 text-black' 
                    : 'bg-amber-400 text-black'
                }`}>
                  {matchedBooking.paymentStatus === 'paid_full' ? '100% PAID' : `DUE ₹${matchedBooking.balanceDue}`}
                </span>
              </div>

              {/* Match Telemetry */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#07130a] border border-[#183621]">
                  <span className="text-zinc-400 text-[10px] uppercase block">Captain & Squad</span>
                  <span className="text-white font-bold block truncate">{matchedBooking.captainName}</span>
                  <span className="text-emerald-400 text-[11px] truncate">{matchedBooking.teamName}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#07130a] border border-[#183621]">
                  <span className="text-zinc-400 text-[10px] uppercase block">Slot Reserved</span>
                  <span className="text-white font-bold block">{matchedBooking.date}</span>
                  <span className="text-amber-400 text-[11px] font-semibold">{matchedBooking.timeRange}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                {matchedBooking.balanceDue > 0 && (
                  <button
                    onClick={() => {
                      onCollectBalance(matchedBooking.id);
                      setMatchedBooking(prev => prev ? { ...prev, balanceDue: 0, paymentStatus: 'paid_full' } : null);
                    }}
                    className="w-full sm:flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold uppercase tracking-wider text-xs shadow-md active:scale-95"
                  >
                    Collect Due ₹{matchedBooking.balanceDue}
                  </button>
                )}

                <button
                  onClick={() => {
                    onCheckIn(matchedBooking.id);
                    setMatchedBooking(prev => prev ? { ...prev, isCheckedIn: true } : null);
                  }}
                  disabled={matchedBooking.isCheckedIn}
                  className={`w-full sm:flex-1 py-2.5 rounded-xl font-extrabold uppercase tracking-wider text-xs shadow-md transition-all ${
                    matchedBooking.isCheckedIn
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 cursor-default'
                      : 'bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-300 hover:to-green-400 text-black active:scale-95'
                  }`}
                >
                  {matchedBooking.isCheckedIn ? '✓ Player On Turf' : 'Admit Squad to Turf'}
                </button>
              </div>

            </div>
          ) : searchAttempted ? (
            <div className="p-4 rounded-2xl bg-[#1c1010] border border-red-500/40 text-center space-y-1">
              <AlertCircle className="w-5 h-5 text-red-400 mx-auto" />
              <span className="font-bold text-red-300 text-xs block uppercase">No Match Pass Found</span>
              <p className="text-zinc-400 text-[11px]">
                No active booking matches "{query}". Please check the Booking Reference.
              </p>
            </div>
          ) : null}

        </div>

      </div>
    </div>
  );
};
