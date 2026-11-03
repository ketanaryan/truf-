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
  Filter
} from 'lucide-react';
import { Booking } from '../../types';
import { getTodayString } from '../../data/mockTurfData';

interface BookingsLedgerProps {
  bookings: Booking[];
  onSelectBooking: (booking: Booking) => void;
  onCheckIn: (bookingId: string) => void;
  onCollectBalance: (bookingId: string) => void;
  onCancelBooking: (bookingId: string) => void;
}

export const BookingsLedger: React.FC<BookingsLedgerProps> = ({
  bookings,
  onSelectBooking,
  onCheckIn,
  onCollectBalance,
  onCancelBooking
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'today' | 'pending_balance' | 'checked_in'>('all');
  const todayStr = getTodayString();

  const filtered = bookings.filter(b => {
    if (statusFilter === 'today' && b.date !== todayStr) return false;
    if (statusFilter === 'pending_balance' && b.balanceDue <= 0) return false;
    if (statusFilter === 'checked_in' && !b.isCheckedIn) return false;

    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      b.captainName.toLowerCase().includes(term) ||
      b.captainPhone.includes(term) ||
      b.bookingRef.toLowerCase().includes(term) ||
      (b.teamName && b.teamName.toLowerCase().includes(term)) ||
      b.pitchName.toLowerCase().includes(term)
    );
  });

  const handlePrintManifest = () => {
    window.print();
  };

  const todayCount = bookings.filter(b => b.date === todayStr).length;
  const balanceDueCount = bookings.filter(b => b.balanceDue > 0 && b.status !== 'cancelled').length;
  const checkedInCount = bookings.filter(b => b.isCheckedIn).length;

  return (
    <div className="space-y-4">
      
      {/* Search & Filter Toolbar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0c1810] border-2 border-[#1f3d28] flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono shadow-xl">
        
        {/* Search */}
        <div className="relative w-full md:w-88">
          <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search captain name, phone, or #BG Ref..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#09140d] border border-[#204229] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400 shadow-inner"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl transition-all font-bold ${
              statusFilter === 'all'
                ? 'bg-emerald-500 text-black shadow-md'
                : 'bg-[#122417] text-zinc-300 hover:text-white border border-[#21422a]'
            }`}
          >
            All Bookings ({bookings.length})
          </button>
          
          <button
            onClick={() => setStatusFilter('today')}
            className={`px-3 py-1.5 rounded-xl transition-all font-bold ${
              statusFilter === 'today'
                ? 'bg-emerald-500 text-black shadow-md'
                : 'bg-[#122417] text-zinc-300 hover:text-white border border-[#21422a]'
            }`}
          >
            Today ({todayCount})
          </button>

          <button
            onClick={() => setStatusFilter('pending_balance')}
            className={`px-3 py-1.5 rounded-xl transition-all font-bold ${
              statusFilter === 'pending_balance'
                ? 'bg-amber-400 text-black shadow-md'
                : 'bg-[#221c10] text-amber-300 hover:text-white border border-amber-500/30'
            }`}
          >
            Balance Due ({balanceDueCount})
          </button>

          <button
            onClick={() => setStatusFilter('checked_in')}
            className={`px-3 py-1.5 rounded-xl transition-all font-bold ${
              statusFilter === 'checked_in'
                ? 'bg-emerald-400 text-black shadow-md'
                : 'bg-[#122417] text-zinc-300 hover:text-white border border-[#21422a]'
            }`}
          >
            On Turf ({checkedInCount})
          </button>

          <button
            onClick={handlePrintManifest}
            className="px-3.5 py-1.5 rounded-xl bg-[#122417] hover:bg-[#1a3523] text-zinc-300 hover:text-white flex items-center gap-1.5 ml-auto border border-[#21422a] font-bold"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-400" />
            <span>Print Manifest</span>
          </button>
        </div>
      </div>

      {/* Bookings CRM Table */}
      <div className="bg-[#0c1810] border-2 border-[#1f3d28] rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#09140d] border-b-2 border-[#1f3d28] uppercase text-zinc-400 text-[10px] tracking-wider font-bold">
              <tr>
                <th className="p-4">Ref & Date</th>
                <th className="p-4">Player / Captain</th>
                <th className="p-4">Court & Slot Time</th>
                <th className="p-4">Payment & Financials</th>
                <th className="p-4">Gate Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-[#172c1c]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-zinc-400">
                    <p className="font-bold text-sm text-white mb-1">No bookings match your filter criteria.</p>
                    <span className="text-zinc-500 text-xs">Try clearing search or choosing another filter tab.</span>
                  </td>
                </tr>
              ) : (
                filtered.map(booking => {
                  const isCancelled = booking.status === 'cancelled';
                  const isCleared = booking.balanceDue <= 0;

                  return (
                    <tr 
                      key={booking.id} 
                      className={`hover:bg-[#0e1e13] transition-colors ${
                        isCancelled ? 'opacity-50 bg-[#160e0e]' : ''
                      }`}
                    >
                      
                      {/* Ref & Date */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-emerald-400 text-sm block">
                            #{booking.bookingRef}
                          </span>
                          {booking.source && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] uppercase font-bold bg-[#14281a] text-zinc-300 border border-[#204029]">
                              {booking.source === 'online' ? 'Online' : booking.source === 'phone_call' ? 'Phone' : 'Walk-in'}
                            </span>
                          )}
                        </div>
                        <span className="text-zinc-300 text-[11px] block mt-0.5">{booking.date}</span>
                      </td>

                      {/* Captain & Squad */}
                      <td className="p-4">
                        <div className="font-bold text-white text-sm block">
                          {booking.captainName}
                        </div>
                        <div className="text-zinc-400 text-[11px]">
                          Squad: <span className="text-zinc-200">{booking.teamName}</span>
                        </div>
                        <a 
                          href={`tel:${booking.captainPhone}`} 
                          className="text-emerald-400 hover:text-emerald-300 text-[11px] flex items-center gap-1 mt-0.5"
                        >
                          <PhoneCall className="w-3 h-3 text-emerald-400" />
                          <span>{booking.captainPhone}</span>
                        </a>
                      </td>

                      {/* Pitch & Time */}
                      <td className="p-4">
                        <span className="text-white font-bold block">{booking.pitchName}</span>
                        <span className="text-amber-400 font-bold text-[11px] block">{booking.timeRange}</span>
                        <span className="text-emerald-300 text-[10px] uppercase font-semibold">{booking.sport}</span>
                      </td>

                      {/* Financials */}
                      <td className="p-4">
                        <div className="text-zinc-200 text-xs">
                          Total: <strong className="text-white">₹{booking.totalAmount}</strong>
                        </div>
                        <div className="text-zinc-400 text-[11px]">
                          Paid: ₹{booking.advancePaid}
                        </div>
                        {booking.balanceDue > 0 ? (
                          <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-amber-400/20 border border-amber-400/30 text-amber-300 font-extrabold text-[11px]">
                            Counter Due: ₹{booking.balanceDue}
                          </span>
                        ) : (
                          <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                            Fully Cleared ✓
                          </span>
                        )}
                      </td>

                      {/* Gate Status */}
                      <td className="p-4">
                        {booking.isCheckedIn ? (
                          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>Checked In</span>
                          </div>
                        ) : isCancelled ? (
                          <span className="text-red-400 font-bold uppercase text-[10px]">
                            Cancelled
                          </span>
                        ) : (
                          <button
                            onClick={() => onCheckIn(booking.id)}
                            className="px-3 py-1.5 rounded-xl bg-[#14281a] hover:bg-emerald-500 hover:text-black border border-[#21422a] text-zinc-200 font-bold text-[11px] transition-colors active:scale-95 shadow-sm"
                          >
                            Check In
                          </button>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right space-x-2">
                        {booking.balanceDue > 0 && !isCancelled && (
                          <button
                            onClick={() => onCollectBalance(booking.id)}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-[11px] shadow-sm active:scale-95"
                          >
                            Collect ₹{booking.balanceDue}
                          </button>
                        )}

                        <button
                          onClick={() => onSelectBooking(booking)}
                          className="px-3 py-1.5 rounded-xl bg-[#122417] hover:bg-[#1a3523] text-emerald-300 hover:text-white border border-[#21422a] text-[11px] font-bold transition-colors"
                        >
                          Pass
                        </button>

                        {!isCancelled && (
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to cancel booking #${booking.bookingRef} for Captain ${booking.captainName}?`)) {
                                onCancelBooking(booking.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-950/30 transition-colors"
                            title="Cancel Booking"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
