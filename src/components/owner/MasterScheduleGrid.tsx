import React from 'react';
import { 
  Calendar as CalendarIcon, 
  Lock, 
  Ban, 
  Plus, 
  Check, 
  Clock, 
  User, 
  PhoneCall, 
  CheckCircle2, 
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { Pitch, Booking, OwnerSettings } from '../../types';
import { BlockedSlotRecord } from '../../data/storage';
import { OPERATING_HOURS, formatDisplayTime, isPeakHour } from '../../data/storage';
import { getTodayString, getOffsetDateString } from '../../data/mockTurfData';

interface MasterScheduleGridProps {
  pitches: Pitch[];
  selectedDate: string;
  onDateChange: (date: string) => void;
  bookings: Booking[];
  blockedSlots: BlockedSlotRecord[];
  onOpenQuickBooking: (pitchId: string, time: string) => void;
  onOpenBlockSlot: (pitchId: string, time: string) => void;
  onSelectBooking: (booking: Booking) => void;
  onCheckInBooking: (bookingId: string) => void;
  onCollectBalance: (bookingId: string) => void;
  settings: OwnerSettings;
}

export const MasterScheduleGrid: React.FC<MasterScheduleGridProps> = ({
  pitches,
  selectedDate,
  onDateChange,
  bookings,
  blockedSlots,
  onOpenQuickBooking,
  onOpenBlockSlot,
  onSelectBooking,
  onCheckInBooking,
  onCollectBalance,
  settings
}) => {
  const dateBookings = bookings.filter(b => b.date === selectedDate && b.status !== 'cancelled');
  const todayStr = getTodayString();
  const tomorrowStr = getOffsetDateString(1);

  // Exact slot matcher without false AM/PM collision
  const matchBookingForPitchAndTime = (pitchId: string, time: string, displayTime: string) => {
    return dateBookings.find(b => {
      if (b.pitchId !== pitchId) return false;
      if (b.slotIds.includes(`slot-${pitchId}-${selectedDate}-${time}`)) return true;
      if (b.slotIds.includes(`slot-${pitchId}-${time}`)) return true;
      if (b.slotIds.some(s => s.endsWith(`-${time}`))) return true;
      if (b.timeRange && (b.timeRange.includes(displayTime) || b.timeRange.startsWith(displayTime.split(' - ')[0]))) return true;
      return false;
    });
  };

  return (
    <div className="space-y-4">
      
      {/* Date & Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#0c1810] border-2 border-[#1f3d28] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono shadow-xl">
        <div className="flex items-center gap-2.5">
          <CalendarIcon className="w-4 h-4 text-emerald-400" />
          <span className="text-white font-extrabold uppercase tracking-wider text-sm">
            Court Timetable Matrix
          </span>
          <span className="text-zinc-500">•</span>
          <span className="text-zinc-400 text-xs">
            {dateBookings.length} matches booked on this date
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onDateChange(todayStr)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              selectedDate === todayStr
                ? 'bg-emerald-500 text-black shadow-md'
                : 'bg-[#122417] text-zinc-300 hover:text-white border border-[#21422a]'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => onDateChange(tomorrowStr)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              selectedDate === tomorrowStr
                ? 'bg-emerald-500 text-black shadow-md'
                : 'bg-[#122417] text-zinc-300 hover:text-white border border-[#21422a]'
            }`}
          >
            Tomorrow
          </button>

          <input
            type="date"
            value={selectedDate}
            onChange={e => onDateChange(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#122417] border border-[#21422a] text-white focus:outline-none focus:border-emerald-400 font-mono text-xs"
          />
        </div>
      </div>

      {/* Grid Matrix Table */}
      <div className="bg-[#0c1810] border-2 border-[#1f3d28] rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Table Header: Pitches */}
        <div className="grid grid-cols-12 bg-[#09140d] border-b-2 border-[#1f3d28] p-4 text-xs font-mono uppercase tracking-wider font-bold">
          <div className="col-span-2 text-center text-zinc-400 flex items-center justify-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Time Slot</span>
          </div>

          <div className="col-span-5 px-4 border-l-2 border-[#1f3d28] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span className="text-white text-sm font-extrabold">{pitches[0]?.name}</span>
            </div>
            <span className="px-2 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[10px] normal-case">
              7v7 Football / Box Cricket (120×70ft)
            </span>
          </div>

          <div className="col-span-5 px-4 border-l-2 border-[#1f3d28] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span className="text-white text-sm font-extrabold">{pitches[1]?.name}</span>
            </div>
            <span className="px-2 py-0.5 rounded-lg bg-amber-400/15 border border-amber-400/30 text-amber-300 text-[10px] normal-case">
              5v5 Football / Pickleball (90×50ft)
            </span>
          </div>
        </div>

        {/* Operating Hours Rows */}
        <div className="divide-y divide-[#172c1c]">
          {OPERATING_HOURS.map(time => {
            const displayTime = formatDisplayTime(time);
            const isPeak = isPeakHour(time, settings);

            const p1Booking = matchBookingForPitchAndTime(pitches[0]?.id, time, displayTime);
            const p2Booking = matchBookingForPitchAndTime(pitches[1]?.id, time, displayTime);

            const p1Blocked = blockedSlots.find(b => b.key === `${selectedDate}_${pitches[0]?.id}_${time}`);
            const p2Blocked = blockedSlots.find(b => b.key === `${selectedDate}_${pitches[1]?.id}_${time}`);

            return (
              <div 
                key={time} 
                className="grid grid-cols-12 min-h-[72px] items-stretch text-xs hover:bg-[#0e1d13]/60 transition-colors"
              >
                
                {/* Time Column */}
                <div className="col-span-2 p-3 flex flex-col justify-center items-center text-center border-r-2 border-[#1f3d28] bg-[#08120b]">
                  <span className="font-mono font-extrabold text-white text-xs">{displayTime}</span>
                  {isPeak ? (
                    <span className="text-[9px] font-mono text-amber-400 font-bold mt-1 px-1.5 py-0.2 rounded bg-amber-400/10 border border-amber-400/20">
                      ⚡ Floodlit Peak
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono text-zinc-500 mt-1">
                      Standard
                    </span>
                  )}
                </div>

                {/* Pitch 1 Cell */}
                <div className="col-span-5 p-2.5 border-r-2 border-[#1f3d28] flex items-center">
                  {p1Booking ? (
                    <div 
                      onClick={() => onSelectBooking(p1Booking)}
                      className="w-full h-full p-3 rounded-2xl bg-[#0f2416] border border-emerald-500/40 hover:border-emerald-400 cursor-pointer transition-all flex flex-col justify-between shadow-md group"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-white truncate mr-2">
                          <User className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{p1Booking.captainName}</span>
                          <span className="text-zinc-400 text-[10px] font-normal">({p1Booking.teamName})</span>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-emerald-300 bg-[#163822] px-2 py-0.5 rounded-md border border-emerald-400/30 shrink-0">
                          #{p1Booking.bookingRef}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono pt-1.5 text-zinc-300 border-t border-[#1a3f27] mt-1.5">
                        <span className="text-emerald-300 font-semibold">{p1Booking.sport}</span>
                        
                        <div className="flex items-center gap-2">
                          {p1Booking.isCheckedIn ? (
                            <span className="flex items-center gap-1 text-emerald-400 font-bold text-[10px]">
                              <CheckCircle2 className="w-3 h-3" />
                              On Turf
                            </span>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onCheckInBooking(p1Booking.id);
                              }}
                              className="px-2 py-0.5 rounded bg-[#183d25] hover:bg-emerald-500 hover:text-black text-emerald-300 text-[10px] font-bold transition-colors"
                            >
                              Check In
                            </button>
                          )}

                          {p1Booking.balanceDue > 0 ? (
                            <span className="text-amber-400 font-black text-[10px] bg-amber-400/15 px-1.5 py-0.5 rounded">
                              Due: ₹{p1Booking.balanceDue}
                            </span>
                          ) : (
                            <span className="text-emerald-400 font-bold text-[10px]">
                              Paid ✓
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : p1Blocked ? (
                    <div className="w-full h-full p-2.5 rounded-2xl bg-[#1f1212] border border-red-500/30 flex items-center justify-between text-zinc-300 text-xs shadow-inner">
                      <div className="flex items-center gap-2">
                        <Ban className="w-4 h-4 text-red-400 shrink-0" />
                        <div>
                          <span className="text-red-300 text-[11px] font-mono font-bold block">
                            SLOT LOCKED
                          </span>
                          <span className="text-zinc-400 text-[10px] font-mono truncate max-w-[180px] block">
                            {p1Blocked.reason}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => onOpenBlockSlot(pitches[0].id, time)}
                        className="text-[11px] font-mono text-zinc-200 hover:text-white px-3 py-1 rounded-xl bg-[#2e1818] hover:bg-red-900/50 border border-red-700/40 font-bold"
                      >
                        Unblock
                      </button>
                    </div>
                  ) : (
                    <div className="w-full h-full p-2.5 rounded-2xl border-2 border-dashed border-[#1d3a24] hover:border-emerald-400/60 hover:bg-[#102416]/50 flex items-center justify-between px-4 group transition-all">
                      <span className="text-zinc-500 font-mono text-xs font-semibold group-hover:text-zinc-300">
                        Available Slot
                      </span>
                      <div className="flex items-center gap-2 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onOpenQuickBooking(pitches[0].id, time)}
                          className="px-3 py-1 rounded-xl bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-300 hover:to-green-400 text-black font-mono font-black text-[11px] uppercase tracking-wider shadow-sm transition-transform active:scale-95"
                        >
                          + Book Walk-in
                        </button>
                        <button
                          onClick={() => onOpenBlockSlot(pitches[0].id, time)}
                          className="p-1.5 rounded-xl bg-[#14281a] hover:bg-red-900/40 text-zinc-400 hover:text-red-400 border border-[#204029] transition-colors"
                          title="Block for Maintenance or Rain"
                        >
                          <Lock className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Pitch 2 Cell */}
                <div className="col-span-5 p-2.5 flex items-center">
                  {p2Booking ? (
                    <div 
                      onClick={() => onSelectBooking(p2Booking)}
                      className="w-full h-full p-3 rounded-2xl bg-[#182613] border border-amber-500/40 hover:border-amber-400 cursor-pointer transition-all flex flex-col justify-between shadow-md group"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-white truncate mr-2">
                          <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="truncate">{p2Booking.captainName}</span>
                          <span className="text-zinc-400 text-[10px] font-normal">({p2Booking.teamName})</span>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-amber-300 bg-[#2d3a1e] px-2 py-0.5 rounded-md border border-amber-400/30 shrink-0">
                          #{p2Booking.bookingRef}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono pt-1.5 text-zinc-300 border-t border-[#314220] mt-1.5">
                        <span className="text-amber-300 font-semibold">{p2Booking.sport}</span>
                        
                        <div className="flex items-center gap-2">
                          {p2Booking.isCheckedIn ? (
                            <span className="flex items-center gap-1 text-emerald-400 font-bold text-[10px]">
                              <CheckCircle2 className="w-3 h-3" />
                              On Turf
                            </span>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onCheckInBooking(p2Booking.id);
                              }}
                              className="px-2 py-0.5 rounded bg-[#2a381d] hover:bg-amber-400 hover:text-black text-amber-300 text-[10px] font-bold transition-colors"
                            >
                              Check In
                            </button>
                          )}

                          {p2Booking.balanceDue > 0 ? (
                            <span className="text-amber-400 font-black text-[10px] bg-amber-400/15 px-1.5 py-0.5 rounded">
                              Due: ₹{p2Booking.balanceDue}
                            </span>
                          ) : (
                            <span className="text-emerald-400 font-bold text-[10px]">
                              Paid ✓
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : p2Blocked ? (
                    <div className="w-full h-full p-2.5 rounded-2xl bg-[#1f1212] border border-red-500/30 flex items-center justify-between text-zinc-300 text-xs shadow-inner">
                      <div className="flex items-center gap-2">
                        <Ban className="w-4 h-4 text-red-400 shrink-0" />
                        <div>
                          <span className="text-red-300 text-[11px] font-mono font-bold block">
                            SLOT LOCKED
                          </span>
                          <span className="text-zinc-400 text-[10px] font-mono truncate max-w-[180px] block">
                            {p2Blocked.reason}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => onOpenBlockSlot(pitches[1].id, time)}
                        className="text-[11px] font-mono text-zinc-200 hover:text-white px-3 py-1 rounded-xl bg-[#2e1818] hover:bg-red-900/50 border border-red-700/40 font-bold"
                      >
                        Unblock
                      </button>
                    </div>
                  ) : (
                    <div className="w-full h-full p-2.5 rounded-2xl border-2 border-dashed border-[#1d3a24] hover:border-amber-400/60 hover:bg-[#1c2912]/50 flex items-center justify-between px-4 group transition-all">
                      <span className="text-zinc-500 font-mono text-xs font-semibold group-hover:text-zinc-300">
                        Available Slot
                      </span>
                      <div className="flex items-center gap-2 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onOpenQuickBooking(pitches[1].id, time)}
                          className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-mono font-black text-[11px] uppercase tracking-wider shadow-sm transition-transform active:scale-95"
                        >
                          + Book Walk-in
                        </button>
                        <button
                          onClick={() => onOpenBlockSlot(pitches[1].id, time)}
                          className="p-1.5 rounded-xl bg-[#14281a] hover:bg-red-900/40 text-zinc-400 hover:text-red-400 border border-[#204029] transition-colors"
                          title="Block for Maintenance or Rain"
                        >
                          <Lock className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
