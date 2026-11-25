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
  ShieldAlert,
  Image as ImageIcon,
  DollarSign
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
  onApproveUpi?: (bookingId: string) => void;
  onInspectScreenshot?: (booking: Booking) => void;
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
  onApproveUpi,
  onInspectScreenshot,
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
    <div className="space-y-5 font-sans">
      
      {/* Date & Filter Bar (Hatrick Grounds Style White Card) */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#FF6A00] flex items-center justify-center font-bold">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-slate-900 font-extrabold text-sm uppercase tracking-wider">
                Court Timetable Matrix
              </span>
              <span className="px-2 py-0.5 rounded-full bg-orange-500/10 text-[#FF6A00] text-[10px] font-bold">
                {dateBookings.length} Match{dateBookings.length === 1 ? '' : 'es'}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Live court occupancy & check-in manifest for {selectedDate}
            </p>
          </div>
        </div>

        {/* Date Selector Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onDateChange(todayStr)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
              selectedDate === todayStr
                ? 'bg-[#FF6A00] text-white font-extrabold shadow-orange-500/20'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => onDateChange(tomorrowStr)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
              selectedDate === tomorrowStr
                ? 'bg-[#FF6A00] text-white font-extrabold shadow-orange-500/20'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            Tomorrow
          </button>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 text-xs font-mono focus:border-[#FF6A00] focus:outline-none"
          />
        </div>
      </div>

      {/* Main Timetable Matrix Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md overflow-hidden">
        
        {/* Table Top Header */}
        <div className="grid grid-cols-12 bg-[#0B1D2D] text-white p-3.5 sm:p-4 text-xs font-bold uppercase tracking-wider items-center border-b border-slate-200">
          <div className="col-span-3 sm:col-span-2 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#FF6A00]" />
            <span>Time Slot</span>
          </div>

          <div className="col-span-9 sm:col-span-10 flex items-center justify-between pl-3 border-l border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00B6C8] animate-pulse"></span>
              <span className="text-white text-xs sm:text-sm font-black">{pitches[0]?.name || "Sonawane's Turf"}</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-orange-300 text-[10px] font-bold">
              120 ft × 65 ft Box Cricket & Football
            </span>
          </div>
        </div>

        {/* Operating Hours Rows */}
        <div className="divide-y divide-slate-100">
          {OPERATING_HOURS.map(time => {
            const displayTime = formatDisplayTime(time);
            const isPeak = isPeakHour(time, settings);

            const booking = matchBookingForPitchAndTime(pitches[0]?.id, time, displayTime);
            const isBlocked = blockedSlots.find(b => b.key === `${selectedDate}_${pitches[0]?.id}_${time}`);

            return (
              <div 
                key={time} 
                className="grid grid-cols-12 min-h-[76px] items-stretch hover:bg-slate-50/70 transition-colors"
              >
                {/* Time Column */}
                <div className="col-span-3 sm:col-span-2 p-3 sm:p-3.5 flex flex-col justify-center items-center text-center border-r border-slate-100 bg-slate-50/60">
                  <span className="font-mono font-extrabold text-slate-900 text-xs sm:text-sm">{displayTime}</span>
                  {isPeak ? (
                    <span className="text-[10px] font-bold text-[#FF6A00] mt-1 px-2 py-0.5 rounded-full bg-orange-50 border border-orange-200">
                      ⚡ Floodlights
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-slate-500 mt-1">
                      Day Slot
                    </span>
                  )}
                </div>

                {/* Match Cell */}
                <div className="col-span-9 sm:col-span-10 p-2.5 sm:p-3 flex items-center">
                  {booking ? (
                    <div 
                      onClick={() => onSelectBooking(booking)}
                      className="w-full p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#0B1D2D] to-[#122A3F] text-white border border-white/10 hover:border-orange-400 cursor-pointer transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md group"
                    >
                      {/* Left: Captain & Squad Info */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-white font-extrabold text-sm flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-[#FF6A00]" />
                            <span>Captain {booking.captainName}</span>
                          </span>
                          <span className="text-orange-300 font-semibold text-xs">
                            • {booking.teamName}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-white/10 text-[#00B6C8] font-mono text-[10px] font-bold">
                            #{booking.bookingRef}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-300">
                          <span className="text-emerald-300 font-bold">{booking.sport}</span>
                          <span>•</span>
                          <span>Fee: ₹{booking.totalAmount}</span>
                          {booking.balanceDue > 0 ? (
                            <span className="text-amber-400 font-bold bg-amber-400/20 px-2 py-0.5 rounded">
                              Counter Due: ₹{booking.balanceDue}
                            </span>
                          ) : (
                            <span className="text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded">
                              Paid in Full ✓
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
                        {booking.paymentStatus === 'upi_pending' && (
                          <div className="flex items-center gap-1.5">
                            {booking.paymentScreenshot && onInspectScreenshot && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onInspectScreenshot(booking);
                                }}
                                className="p-1.5 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-300 hover:bg-amber-400 hover:text-black transition-colors"
                                title="View Receipt Screenshot"
                              >
                                <ImageIcon className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {onApproveUpi && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onApproveUpi(booking.id);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-amber-400 text-black font-extrabold text-xs uppercase hover:bg-amber-300 transition-colors shadow-sm"
                              >
                                Approve UPI
                              </button>
                            )}
                          </div>
                        )}

                        {booking.balanceDue > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onCollectBalance(booking.id);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-extrabold text-xs transition-colors shadow-sm flex items-center gap-1"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                            <span>Collect ₹{booking.balanceDue}</span>
                          </button>
                        )}

                        {booking.isCheckedIn ? (
                          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-extrabold text-xs border border-emerald-500/30">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>On Turf</span>
                          </span>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onCheckInBooking(booking.id);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-colors shadow-sm flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Check In</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ) : isBlocked ? (
                    <div className="w-full p-3 rounded-2xl bg-red-50 border border-red-200 text-red-900 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Ban className="w-4 h-4 text-red-600 shrink-0" />
                        <div>
                          <strong className="text-red-700 font-bold uppercase block text-xs">
                            SLOT LOCKED ({isBlocked.reason})
                          </strong>
                          <span className="text-slate-500 text-[11px]">
                            Slot held private / under turf maintenance
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => onOpenBlockSlot(pitches[0].id, time)}
                        className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-red-100 text-red-700 border border-red-300 font-bold text-xs transition-colors"
                      >
                        Unblock Slot
                      </button>
                    </div>
                  ) : (
                    <div className="w-full p-2.5 sm:p-3 rounded-2xl border-2 border-dashed border-slate-200 hover:border-[#FF6A00] hover:bg-orange-50/40 flex items-center justify-between px-4 group transition-all">
                      <div className="flex items-center gap-2 text-slate-500 group-hover:text-slate-900 text-xs font-semibold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span>Available Slot</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-600 font-mono">
                          ₹{isPeak ? (pitches[0]?.peakHourWeekdayPrice || 800) : (pitches[0]?.baseWeekdayPrice || 600)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onOpenQuickBooking(pitches[0].id, time)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#0B1D2D] hover:bg-[#FF6A00] text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95"
                        >
                          + Walk-in
                        </button>
                        <button
                          onClick={() => onOpenBlockSlot(pitches[0].id, time)}
                          className="p-1.5 rounded-xl bg-slate-100 hover:bg-red-100 text-slate-400 hover:text-red-600 border border-slate-200 transition-colors"
                          title="Lock Slot for Rain or Private Event"
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
