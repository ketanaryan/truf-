import React, { useState } from 'react';
import { 
  Search, 
  Printer, 
  PhoneCall, 
  CheckCircle2, 
  XCircle, 
  User, 
  Calendar, 
  Clock, 
  Ticket, 
  ArrowRight,
  Filter,
  Image as ImageIcon,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { Booking } from '../../types';
import { getTodayString } from '../../data/mockTurfData';

interface BookingsLedgerProps {
  bookings: Booking[];
  onSelectBooking: (booking: Booking) => void;
  onCheckIn: (bookingId: string) => void;
  onCollectBalance: (bookingId: string) => void;
  onCancelBooking: (bookingId: string) => void;
  onApproveUpi?: (bookingId: string) => void;
  onInspectScreenshot?: (booking: Booking) => void;
}

export const BookingsLedger: React.FC<BookingsLedgerProps> = ({
  bookings,
  onSelectBooking,
  onCheckIn,
  onCollectBalance,
  onCancelBooking,
  onApproveUpi,
  onInspectScreenshot
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'today' | 'pending_balance' | 'upi_pending' | 'checked_in'>('all');
  const todayStr = getTodayString();

  const filtered = bookings.filter(b => {
    if (statusFilter === 'today' && b.date !== todayStr) return false;
    if (statusFilter === 'pending_balance' && (b.balanceDue <= 0 || b.status === 'cancelled')) return false;
    if (statusFilter === 'upi_pending' && b.paymentStatus !== 'upi_pending') return false;
    if (statusFilter === 'checked_in' && !b.isCheckedIn) return false;

    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      b.captainName.toLowerCase().includes(term) ||
      b.captainPhone.includes(term) ||
      b.bookingRef.toLowerCase().includes(term) ||
      (b.upiUtr && b.upiUtr.toLowerCase().includes(term)) ||
      (b.teamName && b.teamName.toLowerCase().includes(term)) ||
      b.pitchName.toLowerCase().includes(term)
    );
  });

  const handlePrintManifest = () => {
    window.print();
  };

  const todayCount = bookings.filter(b => b.date === todayStr && b.status !== 'cancelled').length;
  const balanceDueCount = bookings.filter(b => b.balanceDue > 0 && b.status !== 'cancelled').length;
  const upiPendingCount = bookings.filter(b => b.paymentStatus === 'upi_pending' && b.status !== 'cancelled').length;
  const checkedInCount = bookings.filter(b => b.isCheckedIn && b.status !== 'cancelled').length;

  return (
    <div className="space-y-5 font-sans">
      
      {/* Search & Filter Toolbar (Hatrick Grounds Style White Card) */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search captain name, phone, or #SMT ref..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-[#FF6A00] transition-colors"
          />
        </div>

        {/* Filter Tabs & Print */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          {[
            { id: 'all', label: `All (${bookings.length})` },
            { id: 'today', label: `Today (${todayCount})` },
            { id: 'upi_pending', label: `Pending UPI (${upiPendingCount})` },
            { id: 'pending_balance', label: `Due (${balanceDueCount})` },
            { id: 'checked_in', label: `On Turf (${checkedInCount})` }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === f.id
                  ? 'bg-[#0B1D2D] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}

          <button
            onClick={handlePrintManifest}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors shrink-0"
            title="Print Manifest"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bookings List Cards */}
      <div className="space-y-3.5">
        {filtered.map(b => {
          const isCancelled = b.status === 'cancelled';
          const isToday = b.date === todayStr;

          return (
            <div
              key={b.id}
              className={`p-5 rounded-3xl bg-white border transition-all shadow-sm hover:shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                isCancelled
                  ? 'opacity-60 border-slate-200 bg-slate-50/50'
                  : b.paymentStatus === 'upi_pending'
                  ? 'border-amber-300 ring-2 ring-amber-400/20'
                  : 'border-slate-200/90 hover:border-[#FF6A00]/50'
              }`}
            >
              {/* Left Column: Booking Info */}
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-black text-sm text-[#FF6A00]">
                    #{b.bookingRef}
                  </span>
                  
                  {isToday && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                      Today's Match
                    </span>
                  )}

                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] uppercase">
                    {b.sport}
                  </span>

                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px] font-mono">
                    {b.source.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-slate-900 font-extrabold text-sm sm:text-base">
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-slate-400" />
                    <span>Captain {b.captainName}</span>
                  </div>
                  <span className="text-slate-400 font-normal">•</span>
                  <span className="text-slate-600 font-semibold text-xs sm:text-sm">
                    {b.teamName}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                  <span className="flex items-center gap-1 font-semibold text-slate-800">
                    <Calendar className="w-3.5 h-3.5 text-[#FF6A00]" />
                    <span>{b.date}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-semibold text-slate-800">
                    <Clock className="w-3.5 h-3.5 text-[#00B6C8]" />
                    <span>{b.timeRange}</span>
                  </span>
                  <span>•</span>
                  <a 
                    href={`tel:${b.captainPhone}`} 
                    className="flex items-center gap-1 text-[#0D6EFD] font-mono font-bold hover:underline"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>{b.captainPhone}</span>
                  </a>
                </div>

                {b.notes && (
                  <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-xl border border-slate-100">
                    Note: "{b.notes}"
                  </p>
                )}
              </div>

              {/* Middle: Financial & Payment Status */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 min-w-[220px]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Total Turf Fee:</span>
                  <strong className="text-slate-900 font-black text-sm">₹{b.totalAmount}</strong>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Paid / Advance:</span>
                  <strong className="text-emerald-600 font-black">₹{b.advancePaid}</strong>
                </div>

                {b.balanceDue > 0 && (
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
                    <span className="text-amber-700 font-bold">Counter Due:</span>
                    <strong className="text-amber-600 font-black">₹{b.balanceDue}</strong>
                  </div>
                )}

                {/* Screenshot proof preview if available */}
                {b.paymentScreenshot && (
                  <div 
                    onClick={() => onInspectScreenshot?.(b)}
                    className="pt-1.5 flex items-center gap-2 cursor-pointer text-[11px] text-amber-700 hover:text-amber-900 font-bold"
                  >
                    <img 
                      src={b.paymentScreenshot} 
                      alt="Receipt" 
                      className="w-7 h-7 rounded-md object-cover border border-amber-300"
                    />
                    <span>Inspect Receipt Screenshot 🔍</span>
                  </div>
                )}

                {b.upiUtr && (
                  <div className="text-[10px] text-slate-500 font-mono">
                    UTR: <strong className="text-slate-800">{b.upiUtr}</strong>
                  </div>
                )}
              </div>

              {/* Right: Actions */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-2 justify-center shrink-0">
                {b.paymentStatus === 'upi_pending' && onApproveUpi && !isCancelled && (
                  <button
                    onClick={() => onApproveUpi(b.id)}
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase shadow-sm transition-all"
                  >
                    Approve UPI
                  </button>
                )}

                {b.balanceDue > 0 && !isCancelled && (
                  <button
                    onClick={() => onCollectBalance(b.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase shadow-sm transition-all flex items-center justify-center gap-1.5"
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Collect ₹{b.balanceDue}</span>
                  </button>
                )}

                {!b.isCheckedIn && !isCancelled && (
                  <button
                    onClick={() => onCheckIn(b.id)}
                    className="px-4 py-2 rounded-xl bg-[#0B1D2D] hover:bg-slate-800 text-white font-extrabold text-xs uppercase shadow-sm transition-all flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Check In</span>
                  </button>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectBooking(b)}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
                  >
                    View Pass
                  </button>

                  {!isCancelled && (
                    <button
                      onClick={() => onCancelBooking(b.id)}
                      className="px-2.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs transition-colors"
                      title="Cancel Booking"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-16 text-center rounded-3xl bg-white border border-slate-200 p-8">
            <Filter className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-800">No Bookings Found</h4>
            <p className="text-xs text-slate-500 mt-1">Try changing the status filter or search query</p>
          </div>
        )}
      </div>

    </div>
  );
};
