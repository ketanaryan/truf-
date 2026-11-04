import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Check, 
  Lock, 
  Flame, 
  Info, 
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight,
  Trophy
} from 'lucide-react';
import { Pitch, Slot, SportType, OwnerSettings } from '../../types';
import { getOffsetDateString } from '../../data/mockTurfData';
import { isWeekend } from '../../data/storage';

interface SlotBookingMatrixProps {
  pitches: Pitch[];
  selectedDate: string;
  onDateChange: (date: string) => void;
  selectedPitchId: string;
  onPitchChange: (pitchId: string) => void;
  selectedSport: SportType;
  onSportChange: (sport: SportType) => void;
  slots: Slot[];
  selectedSlotIds: string[];
  onToggleSlot: (slotId: string) => void;
  onClearSelectedSlots: () => void;
  onProceedToCheckout: () => void;
  settings: OwnerSettings;
}

export const SlotBookingMatrix: React.FC<SlotBookingMatrixProps> = ({
  pitches,
  selectedDate,
  onDateChange,
  selectedPitchId,
  onPitchChange,
  selectedSport,
  onSportChange,
  slots,
  selectedSlotIds,
  onToggleSlot,
  onClearSelectedSlots,
  onProceedToCheckout,
  settings
}) => {
  const [timeFilter, setTimeFilter] = useState<'all' | 'morning' | 'afternoon' | 'night'>('all');

  // 14 Selectable Dates
  const dateOptions = useMemo(() => {
    const list = [];
    for (let i = 0; i < 14; i++) {
      const dateStr = getOffsetDateString(i);
      const d = new Date(dateStr + 'T00:00:00');
      const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNumber = d.getDate();
      const monthName = d.toLocaleDateString('en-US', { month: 'short' });
      const weekend = isWeekend(dateStr);
      list.push({ dateStr, dayName, dayNumber, monthName, weekend, isToday: i === 0 });
    }
    return list;
  }, []);

  const currentPitch = pitches.find(p => p.id === selectedPitchId) || pitches[0];

  const filteredSlots = useMemo(() => {
    return slots.filter(slot => {
      const hour = parseInt(slot.startTime.split(':')[0], 10);
      if (timeFilter === 'morning') return hour >= 6 && hour < 12;
      if (timeFilter === 'afternoon') return hour >= 12 && hour < 17;
      if (timeFilter === 'night') return hour >= 17 || hour === 0;
      return true;
    });
  }, [slots, timeFilter]);

  const selectedSlots = useMemo(() => {
    return slots.filter(s => selectedSlotIds.includes(s.id));
  }, [slots, selectedSlotIds]);

  const isFullDaySelected = selectedSlotIds.length >= 18;
  const weekend = isWeekend(selectedDate);
  const fullDayPrice = weekend 
    ? (currentPitch.fullDayWeekendPrice || 20000) 
    : (currentPitch.fullDayWeekdayPrice || 15000);

  const totalBasePrice = useMemo(() => {
    if (isFullDaySelected) {
      return fullDayPrice;
    }
    return selectedSlots.reduce((acc, s) => acc + s.price, 0);
  }, [selectedSlots, isFullDaySelected, fullDayPrice]);

  const handleToggleFullDay = () => {
    if (isFullDaySelected) {
      onClearSelectedSlots();
    } else {
      const availableIds = slots
        .filter(s => s.status === 'available')
        .map(s => s.id);
      
      onClearSelectedSlots();
      // Select all slots
      availableIds.forEach(id => onToggleSlot(id));
    }
  };

  return (
    <div id="booking-matrix-section" className="space-y-6 scroll-mt-24">
      
      {/* Step 1: Choose Pitch & Sport */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#0c1810] border-2 border-[#1f3d28] shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1b3623] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-500 text-black font-extrabold flex items-center justify-center text-xs font-mono">
              1
            </span>
            <h3 className="text-sm sm:text-base font-extrabold uppercase text-white font-mono tracking-wider">
              Choose Pitch & Sport Format
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-400">
            {currentPitch.name} • {selectedSport}
          </span>
        </div>

        {/* Pitch Selection Cards (Side-by-side) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {pitches.map(pitch => {
            const isSelected = pitch.id === selectedPitchId;
            const baseRate = weekend ? pitch.baseWeekendPrice : pitch.baseWeekdayPrice;
            const peakRate = weekend ? pitch.peakHourWeekendPrice : pitch.peakHourWeekdayPrice;

            return (
              <div
                key={pitch.id}
                onClick={() => {
                  onPitchChange(pitch.id);
                  if (!pitch.sports.includes(selectedSport)) {
                    onSportChange(pitch.sports[0]);
                  }
                }}
                className={`p-4 rounded-2xl cursor-pointer transition-all border-2 relative flex flex-col justify-between select-none active:scale-[0.99] ${
                  isSelected
                    ? 'bg-[#102416] border-emerald-400 shadow-xl'
                    : 'bg-[#09140d] border-[#1c3824] hover:border-emerald-500/40 hover:bg-[#0d1d13]'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3.5 right-3.5 w-6 h-6 rounded-full bg-emerald-400 text-black flex items-center justify-center font-black text-xs shadow-md">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block mb-1">
                    {pitch.id === 'pitch-1' ? '7v7 FOOTBALL & CRICKET' : '5v5 FOOTBALL & PICKLEBALL'}
                  </span>
                  <h4 className="text-base font-black text-white">{pitch.name}</h4>
                  <p className="text-xs text-zinc-400 mb-2">{pitch.subtitle}</p>

                  <div className="flex flex-wrap gap-2 text-[11px] font-mono text-zinc-300 mb-3">
                    <span className="px-2 py-0.5 rounded-md bg-[#13281a] border border-[#20442b]">
                      📐 {pitch.dimensions}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#13281a] border border-[#20442b]">
                      🌱 {pitch.surface.split('(')[0]}
                    </span>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-[#1a3824] flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">Hourly Rate:</span>
                  <span className="text-emerald-400 font-black text-sm">
                    ₹{baseRate} – ₹{peakRate} <span className="text-zinc-500 text-xs font-normal">/ hr</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sport Format Pills */}
        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-zinc-400 font-semibold mr-1">Select Sport:</span>
          {currentPitch.sports.map(sport => {
            const isSelected = sport === selectedSport;
            return (
              <button
                key={sport}
                type="button"
                onClick={() => onSportChange(sport)}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all border active:scale-95 ${
                  isSelected
                    ? 'bg-emerald-500 text-black border-emerald-400 shadow-md font-extrabold'
                    : 'bg-[#09140d] text-zinc-300 hover:text-white border-[#1d3a25] hover:bg-[#122619]'
                }`}
              >
                {sport}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Choose Date */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#0c1810] border-2 border-[#1f3d28] shadow-2xl space-y-3.5">
        <div className="flex items-center justify-between border-b border-[#1b3623] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-500 text-black font-extrabold flex items-center justify-center text-xs font-mono">
              2
            </span>
            <h3 className="text-sm sm:text-base font-extrabold uppercase text-white font-mono tracking-wider">
              Select Match Date
            </h3>
          </div>
          <span className="text-xs font-mono text-zinc-400">
            {weekend ? '🔥 Weekend Prime Pricing Active' : '⚡ Regular Weekday Pricing'}
          </span>
        </div>

        {/* Date Carousel Strip */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
          {dateOptions.map(item => {
            const isSelected = item.dateStr === selectedDate;
            return (
              <button
                key={item.dateStr}
                type="button"
                onClick={() => onDateChange(item.dateStr)}
                className={`flex-shrink-0 flex flex-col items-center justify-center min-w-[76px] py-3 px-2 rounded-2xl transition-all border-2 text-center relative active:scale-95 ${
                  isSelected
                    ? 'bg-gradient-to-b from-emerald-400 to-green-500 text-black border-emerald-300 shadow-lg font-bold'
                    : 'bg-[#09140d] border-[#1b3823] text-zinc-300 hover:border-emerald-500/50 hover:bg-[#102216]'
                }`}
              >
                {item.weekend && !isSelected && (
                  <span className="absolute -top-2 px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-mono font-bold">
                    Weekend
                  </span>
                )}
                <span className={`text-[11px] uppercase tracking-wider font-semibold ${isSelected ? 'text-black font-extrabold' : 'text-zinc-400'}`}>
                  {item.dayName}
                </span>
                <span className={`text-xl font-black font-mono leading-none my-1 ${isSelected ? 'text-black' : 'text-white'}`}>
                  {item.dayNumber}
                </span>
                <span className={`text-[10px] uppercase font-mono ${isSelected ? 'text-emerald-950 font-bold' : 'text-zinc-500'}`}>
                  {item.monthName}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 3: Choose Time Slot */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#0c1810] border-2 border-[#1f3d28] shadow-2xl space-y-4">
        
        {/* Full Day Booking Option Card */}
        <div className={`p-4 rounded-2xl border-2 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          isFullDaySelected
            ? 'bg-gradient-to-r from-emerald-500/20 via-emerald-600/15 to-[#09140d] border-emerald-400 shadow-lg'
            : 'bg-[#09140d] border-[#1f3d28] hover:border-emerald-500/50'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center justify-center font-bold text-lg">
              🏆
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-sm">Full Day Turf Booking</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-400 text-black">
                  Tournament / Corporate Day
                </span>
              </div>
              <p className="text-xs text-zinc-300 font-mono">
                Book entire {currentPitch.name} for all 19 operating hours (06:00 AM – 01:00 AM) at flat package rate
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            <div className="text-right font-mono">
              <span className="text-[10px] text-zinc-400 block line-through">
                ₹{slots.reduce((sum, s) => sum + s.price, 0)}
              </span>
              <span className="text-base font-black text-emerald-400">
                ₹{fullDayPrice}
              </span>
            </div>

            <button
              type="button"
              onClick={handleToggleFullDay}
              className={`px-4 py-2 rounded-xl font-bold text-xs font-mono uppercase tracking-wider transition-all active:scale-95 ${
                isFullDaySelected
                  ? 'bg-emerald-500 text-black font-extrabold shadow-md'
                  : 'bg-[#122619] hover:bg-emerald-500 hover:text-black text-emerald-300 border border-[#214b2d]'
              }`}
            >
              {isFullDaySelected ? '✓ Full Day Locked' : 'Select Full Day'}
            </button>
          </div>
        </div>

        {/* Regular Slots Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1b3623] pb-3 pt-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-500 text-black font-extrabold flex items-center justify-center text-xs font-mono">
              3
            </span>
            <h3 className="text-sm sm:text-base font-extrabold uppercase text-white font-mono tracking-wider">
              Or Pick Hourly Slot(s)
            </h3>
          </div>

          {/* Quick Time Period Filters */}
          <div className="flex items-center gap-1.5 text-xs font-mono overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'All Slots' },
              { id: 'morning', label: 'Morning (6-12)' },
              { id: 'afternoon', label: 'Afternoon (12-5)' },
              { id: 'night', label: '⚡ Floodlights (5-1 AM)' },
            ].map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setTimeFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-xl transition-all font-bold whitespace-nowrap ${
                  timeFilter === f.id
                    ? 'bg-emerald-500 text-black shadow-md'
                    : 'bg-[#09140d] text-zinc-400 hover:text-white border border-[#1b3823]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400 pt-1">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-md bg-[#0e2216] border border-emerald-400 inline-block"></span>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-md bg-emerald-400 inline-block"></span>
            <span className="text-emerald-400 font-bold">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-md bg-[#1f1212] border border-red-500/40 inline-block"></span>
            <span className="text-red-300">Booked / Locked</span>
          </div>
        </div>

        {/* Slots Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 pt-2">
          {filteredSlots.map(slot => {
            const isSelected = selectedSlotIds.includes(slot.id);
            const isBooked = slot.status === 'booked';
            const isBlocked = slot.status === 'blocked';
            const isPast = slot.status === 'past';
            const isAvailable = slot.status === 'available';

            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => {
                  if (isAvailable || isSelected) {
                    onToggleSlot(slot.id);
                  }
                }}
                disabled={isBooked || isBlocked || isPast}
                className={`p-3.5 rounded-2xl border-2 transition-all text-left flex flex-col justify-between select-none active:scale-[0.98] ${
                  isSelected
                    ? 'bg-gradient-to-br from-emerald-400 to-green-500 border-emerald-300 text-black font-bold shadow-lg transform -translate-y-0.5 cursor-pointer'
                    : isBooked
                    ? 'bg-[#181111] border-red-900/40 opacity-70 cursor-not-allowed text-zinc-500'
                    : isBlocked
                    ? 'bg-[#181111] border-amber-900/40 opacity-70 cursor-not-allowed text-zinc-500'
                    : isPast
                    ? 'bg-[#0a120c] border-transparent opacity-30 cursor-not-allowed text-zinc-600'
                    : 'bg-[#09140d] border-[#1c3824] hover:border-emerald-400 hover:bg-[#0f2416] cursor-pointer text-zinc-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    isSelected
                      ? 'bg-black/20 text-black'
                      : slot.isPeak
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                      : 'bg-[#122417] text-zinc-400'
                  }`}>
                    {slot.isPeak ? '⚡ PRIME LIGHTS' : 'STANDARD'}
                  </span>

                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-black text-emerald-400 flex items-center justify-center font-black text-xs shadow-sm">
                      ✓
                    </span>
                  )}
                  {isBooked && (
                    <Lock className="w-3.5 h-3.5 text-red-400" />
                  )}
                </div>

                <div className="my-1">
                  <div className={`text-sm font-black font-mono tracking-tight leading-snug ${
                    isSelected ? 'text-black' : isBooked ? 'text-zinc-500 line-through' : 'text-white'
                  }`}>
                    {slot.displayTime}
                  </div>
                  <span className={`text-[10px] font-mono block mt-0.5 ${isSelected ? 'text-emerald-950 font-bold' : 'text-zinc-400'}`}>
                    60 mins match
                  </span>
                </div>

                <div className={`pt-2 mt-2 border-t flex items-center justify-between text-xs font-mono ${
                  isSelected ? 'border-black/20' : 'border-[#172c1c]'
                }`}>
                  {isBooked ? (
                    <span className="text-red-400 font-bold text-[11px]">BOOKED</span>
                  ) : isBlocked ? (
                    <span className="text-amber-400 font-bold text-[11px] truncate">
                      LOCKED
                    </span>
                  ) : isPast ? (
                    <span className="text-zinc-500 text-[11px]">ENDED</span>
                  ) : (
                    <>
                      <span className={`text-xs ${isSelected ? 'text-black font-bold' : 'text-zinc-400'}`}>
                        Fee:
                      </span>
                      <span className={`font-black text-sm ${isSelected ? 'text-black' : 'text-emerald-400'}`}>
                        ₹{slot.price}
                      </span>
                    </>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating Bottom Drawer when slots are selected */}
      {selectedSlotIds.length > 0 && (
        <div className="sticky bottom-5 z-40 p-4 sm:p-5 rounded-3xl bg-[#0c1810]/98 border-2 border-emerald-400 shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 text-black flex items-center justify-center font-black text-xl shadow-lg">
              {isFullDaySelected ? '19h' : selectedSlotIds.length}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-mono tracking-wider text-emerald-400 font-extrabold">
                  {isFullDaySelected ? 'Full Day Turf Pass' : `${selectedSlotIds.length} ${selectedSlotIds.length === 1 ? 'Hour Selected' : 'Hours Selected'}`}
                </span>
                <span className="text-zinc-500">•</span>
                <span className="text-xs font-bold text-white">
                  {currentPitch.name} ({selectedSport})
                </span>
              </div>
              <p className="text-xs text-zinc-300 font-mono mt-0.5">
                Date: <strong className="text-white">{selectedDate}</strong> | Total: <strong className="text-emerald-400 text-base font-black">₹{totalBasePrice}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClearSelectedSlots}
              className="px-4 py-3 rounded-xl bg-[#122417] border border-[#21422a] text-zinc-300 text-xs font-mono font-bold uppercase hover:text-white transition-colors"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={onProceedToCheckout}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-300 hover:to-green-400 text-black font-extrabold text-xs uppercase tracking-wider font-mono shadow-xl transition-all active:scale-95"
            >
              <span>Confirm & Book Match</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
