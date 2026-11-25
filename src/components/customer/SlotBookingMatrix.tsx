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
  onSelectBatchSlots?: (slotIds: string[]) => void;
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
  onSelectBatchSlots,
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

  const availableSlots = useMemo(() => slots.filter(s => s.status === 'available'), [slots]);
  const isFullDaySelected = availableSlots.length > 0 && availableSlots.every(s => selectedSlotIds.includes(s.id));
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
      const availIds = availableSlots.map(s => s.id);
      if (onSelectBatchSlots) {
        onSelectBatchSlots(availIds);
      }
    }
  };

  return (
    <div id="booking-matrix-section" className="space-y-6 scroll-mt-28 font-sans">
      
      {/* Step 1: Choose Pitch & Sport */}
      <div className="p-5 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-[#FF6A00] text-white font-black flex items-center justify-center text-xs shadow-sm">
              1
            </span>
            <h3 className="text-base sm:text-lg font-display font-black uppercase text-[#111827] tracking-wide">
              Choose Pitch & Sport Format
            </h3>
          </div>
          <span className="text-xs font-semibold text-[#0D6EFD]">
            {currentPitch.name} • {selectedSport}
          </span>
        </div>

        {/* Pitch Selection Cards (Side-by-side) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                className={`p-5 rounded-2xl cursor-pointer transition-all border-2 relative flex flex-col justify-between select-none active:scale-[0.99] ${
                  isSelected
                    ? 'bg-orange-50/50 border-[#FF6A00] shadow-md ring-2 ring-[#FF6A00]/20'
                    : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-slate-100/70'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#FF6A00] text-white flex items-center justify-center font-black text-xs shadow-md">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}

                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#FF6A00] font-bold block mb-1">
                    {pitch.id === 'pitch-1' ? '7v7 FOOTBALL & CRICKET' : '5v5 FOOTBALL & PICKLEBALL'}
                  </span>
                  <h4 className="text-lg font-black text-[#111827]">{pitch.name}</h4>
                  <p className="text-xs text-slate-500 mb-2">{pitch.subtitle}</p>

                  <div className="flex flex-wrap gap-2 text-xs text-slate-600 mb-3">
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-medium">
                      📐 {pitch.dimensions}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-medium">
                      🌱 {pitch.surface.split('(')[0]}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Hourly Rate:</span>
                  <span className="text-[#0D6EFD] font-black text-base">
                    ₹{baseRate} – ₹{peakRate} <span className="text-slate-500 text-xs font-normal">/ hr</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sport Format Pills */}
        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-600 font-bold mr-1">Select Sport:</span>
          {currentPitch.sports.map(sport => {
            const isSelected = sport === selectedSport;
            return (
              <button
                key={sport}
                type="button"
                onClick={() => onSportChange(sport)}
                className={`px-4 py-2 rounded-xl font-bold transition-all border active:scale-95 ${
                  isSelected
                    ? 'bg-[#FF6A00] text-white border-[#E65F00] shadow-md font-extrabold'
                    : 'bg-slate-100 text-slate-700 hover:text-black border-slate-200 hover:bg-slate-200'
                }`}
              >
                {sport}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Choose Date */}
      <div className="p-5 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-[#FF6A00] text-white font-black flex items-center justify-center text-xs shadow-sm">
              2
            </span>
            <h3 className="text-base sm:text-lg font-display font-black uppercase text-[#111827] tracking-wide">
              Select Match Date
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {weekend ? '🔥 Weekend Prime Pricing Active' : '⚡ Regular Weekday Pricing'}
          </span>
        </div>

        {/* Date Carousel Strip */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {dateOptions.map(item => {
            const isSelected = item.dateStr === selectedDate;
            return (
              <button
                key={item.dateStr}
                type="button"
                onClick={() => onDateChange(item.dateStr)}
                className={`flex-shrink-0 flex flex-col items-center justify-center min-w-[78px] py-3.5 px-2 rounded-2xl transition-all border-2 text-center relative active:scale-95 ${
                  isSelected
                    ? 'bg-[#FF6A00] text-white border-[#E65F00] shadow-lg font-bold scale-105'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-[#FF6A00] hover:bg-white'
                }`}
              >
                {item.weekend && !isSelected && (
                  <span className="absolute -top-2 px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-[9px] font-bold">
                    Weekend
                  </span>
                )}
                <span className={`text-[11px] uppercase tracking-wider font-bold ${isSelected ? 'text-white' : 'text-slate-500'}`}>
                  {item.dayName}
                </span>
                <span className={`text-xl font-black leading-none my-1 font-mono ${isSelected ? 'text-white' : 'text-[#111827]'}`}>
                  {item.dayNumber}
                </span>
                <span className={`text-[10px] uppercase font-bold ${isSelected ? 'text-orange-100' : 'text-slate-400'}`}>
                  {item.monthName}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 3: Choose Time Slot */}
      <div className="p-5 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xl space-y-4">
        
        {/* Full Day Booking Option Card (Hatrick Grounds Style Mint-Teal Tint) */}
        <div className={`p-5 rounded-2xl border-2 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          isFullDaySelected
            ? 'bg-orange-50 border-[#FF6A00] shadow-md'
            : 'bg-gradient-to-r from-teal-50/70 to-emerald-50/50 border-teal-200 hover:border-teal-300'
        }`}>
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#00B6C8]/15 text-[#00B6C8] border border-[#00B6C8]/30 flex items-center justify-center font-bold text-2xl">
              🏆
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[#111827] text-base">Full Day Turf Booking</span>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-[#0B1D2D] text-amber-300">
                  Tournament Package
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Reserve entire {currentPitch.name} for all operating hours (06:00 AM – 01:00 AM) at flat package rate
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            <div className="text-right">
              <span className="text-xs text-slate-400 block line-through">
                ₹{slots.reduce((sum, s) => sum + s.price, 0)}
              </span>
              <span className="text-lg font-black text-[#0D6EFD]">
                ₹{fullDayPrice}
              </span>
            </div>

            <button
              type="button"
              onClick={handleToggleFullDay}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all active:scale-95 shadow-sm ${
                isFullDaySelected
                  ? 'bg-[#FF6A00] text-white font-extrabold shadow-md'
                  : 'bg-[#0B1D2D] hover:bg-slate-800 text-white'
              }`}
            >
              {isFullDaySelected ? '✓ Full Day Reserved' : 'Reserve Full Day'}
            </button>
          </div>
        </div>

        {/* Regular Slots Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3 pt-2">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-[#FF6A00] text-white font-black flex items-center justify-center text-xs shadow-sm">
              3
            </span>
            <h3 className="text-base sm:text-lg font-display font-black uppercase text-[#111827] tracking-wide">
              Or Pick Hourly Slot(s)
            </h3>
          </div>

          {/* Quick Time Period Filters */}
          <div className="flex items-center gap-1.5 text-xs overflow-x-auto pb-1">
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
                className={`px-3.5 py-1.5 rounded-xl transition-all font-bold whitespace-nowrap ${
                  timeFilter === f.id
                    ? 'bg-[#0B1D2D] text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:text-black hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 pt-1">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-md bg-white border-2 border-slate-300 inline-block"></span>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-md bg-[#FF6A00] inline-block"></span>
            <span className="text-[#FF6A00] font-bold">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-md bg-slate-200 inline-block"></span>
            <span className="text-slate-400">Booked / Locked</span>
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
                    ? 'bg-[#FF6A00] border-[#E65F00] text-white font-bold shadow-lg transform -translate-y-0.5 cursor-pointer'
                    : isBooked
                    ? 'bg-slate-100 border-slate-200 opacity-70 cursor-not-allowed text-slate-400'
                    : isBlocked
                    ? 'bg-slate-100 border-slate-200 opacity-70 cursor-not-allowed text-slate-400'
                    : isPast
                    ? 'bg-slate-50 border-slate-100 opacity-40 cursor-not-allowed text-slate-400'
                    : 'bg-white border-slate-200 hover:border-[#FF6A00] hover:shadow-md cursor-pointer text-slate-900'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    isSelected
                      ? 'bg-black/20 text-white'
                      : slot.isPeak
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {slot.isPeak ? '⚡ PRIME LIGHTS' : 'STANDARD'}
                  </span>

                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-white text-[#FF6A00] flex items-center justify-center font-black text-xs shadow-sm">
                      ✓
                    </span>
                  )}
                  {isBooked && (
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>

                <div className="my-1">
                  <div className={`text-sm font-black font-mono tracking-tight leading-snug ${
                    isSelected ? 'text-white' : isBooked ? 'text-slate-400 line-through' : 'text-[#111827]'
                  }`}>
                    {slot.displayTime}
                  </div>
                  <span className={`text-[11px] block mt-0.5 font-medium ${isSelected ? 'text-orange-100' : 'text-slate-500'}`}>
                    60 mins match
                  </span>
                </div>

                <div className={`pt-2 mt-2 border-t flex items-center justify-between text-xs ${
                  isSelected ? 'border-white/20' : 'border-slate-100'
                }`}>
                  {isBooked ? (
                    <span className="text-slate-400 font-bold text-[11px]">BOOKED</span>
                  ) : isBlocked ? (
                    <span className="text-slate-400 font-bold text-[11px] truncate">LOCKED</span>
                  ) : isPast ? (
                    <span className="text-slate-400 text-[11px]">ENDED</span>
                  ) : (
                    <>
                      <span className={`text-xs ${isSelected ? 'text-white' : 'text-slate-500'}`}>
                        Fee:
                      </span>
                      <span className={`font-black text-sm ${isSelected ? 'text-white' : 'text-[#0D6EFD]'}`}>
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

      {/* Floating Bottom Drawer when slots are selected (Hatrick Grounds Deep Navy + Orange) */}
      {selectedSlotIds.length > 0 && (
        <div className="sticky bottom-5 z-40 p-4 sm:p-5 rounded-3xl bg-[#0B1D2D] border-2 border-[#FF6A00] shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FF6A00] text-white flex items-center justify-center font-black text-xl shadow-lg">
              {isFullDaySelected ? '19h' : selectedSlotIds.length}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-[#FF6A00] font-black">
                  {isFullDaySelected ? 'Full Day Turf Pass' : `${selectedSlotIds.length} ${selectedSlotIds.length === 1 ? 'Hour Selected' : 'Hours Selected'}`}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-xs font-bold text-white">
                  {currentPitch.name} ({selectedSport})
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Date: <strong className="text-white">{selectedDate}</strong> | Total: <strong className="text-white text-base font-black">₹{totalBasePrice}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClearSelectedSlots}
              className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-slate-200 text-xs font-bold uppercase transition-colors"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={onProceedToCheckout}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-[#FF6A00] hover:bg-[#E65F00] text-white font-extrabold text-xs uppercase tracking-wider shadow-xl shadow-orange-950/40 transition-all active:scale-95"
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
