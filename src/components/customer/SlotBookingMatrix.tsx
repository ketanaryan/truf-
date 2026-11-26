import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Check, 
  Lock, 
  Flame, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  Trophy,
  Zap 
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

  const weekend = isWeekend(selectedDate);
  const totalBasePrice = useMemo(() => {
    return selectedSlots.reduce((acc, s) => acc + s.price, 0);
  }, [selectedSlots]);

  return (
    <div id="booking-matrix-section" className="space-y-6 scroll-mt-36 font-body text-white">
      
      {/* Section 1: Choose Match Date (The Nova Club Dark Luxury Card) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#1e2023] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-5">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-[0.24em] uppercase font-bold text-[#ff7a00] block">
              STEP 01 • REAL-TIME CALENDAR
            </span>
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-[#ff7a00] text-white font-headline font-black flex items-center justify-center text-xs shadow-md">
                1
              </span>
              <h3 className="font-headline font-black italic text-2xl sm:text-3xl uppercase tracking-tight text-white">
                SELECT MATCH DATE
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-3 py-1.5 rounded-full bg-white/5 text-white/80 border border-white/10">
              DAY: ₹{weekend ? currentPitch.baseWeekendPrice : currentPitch.baseWeekdayPrice}/HR
            </span>
            <span className="px-3 py-1.5 rounded-full bg-[#ff7a00]/15 text-[#ff7a00] border border-[#ff7a00]/30 font-bold">
              FLOODLIGHTS: ₹{weekend ? currentPitch.peakHourWeekendPrice : currentPitch.peakHourWeekdayPrice}/HR
            </span>
          </div>
        </div>

        {/* Date Carousel Strip */}
        <div className="flex items-center gap-3 overflow-x-auto pb-3 scrollbar-none">
          {dateOptions.map(item => {
            const isSelected = item.dateStr === selectedDate;
            return (
              <button
                key={item.dateStr}
                type="button"
                onClick={() => onDateChange(item.dateStr)}
                className={`flex-shrink-0 flex flex-col items-center justify-center min-w-[82px] py-4 px-2.5 rounded-2xl transition-all duration-300 text-center relative active:scale-95 cursor-pointer ${
                  isSelected
                    ? 'bg-[#ff7a00] text-white border-2 border-[#ff8a1a] shadow-[0_0_28px_rgba(255,122,0,0.5)] scale-105 font-bold z-10'
                    : 'bg-[#141619] border border-white/10 text-white/70 hover:border-[#ff7a00]/60 hover:text-white hover:bg-[#1a1d22]'
                }`}
              >
                {item.weekend && !isSelected && (
                  <span className="absolute -top-2 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-mono font-bold uppercase tracking-wider">
                    Weekend
                  </span>
                )}
                <span className={`text-[10px] font-headline uppercase tracking-[0.16em] font-bold ${isSelected ? 'text-white' : 'text-white/50'}`}>
                  {item.dayName}
                </span>
                <span className={`text-2xl font-headline font-black italic leading-none my-1.5 ${isSelected ? 'text-white' : 'text-white'}`}>
                  {item.dayNumber}
                </span>
                <span className={`text-[10px] font-mono uppercase tracking-wider ${isSelected ? 'text-white/90' : 'text-white/40'}`}>
                  {item.monthName}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 2: Choose Time Slot */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#1e2023] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-5">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-[0.24em] uppercase font-bold text-[#ff7a00] block">
              STEP 02 • ARENA TIMETABLE
            </span>
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-[#ff7a00] text-white font-headline font-black flex items-center justify-center text-xs shadow-md">
                2
              </span>
              <h3 className="font-headline font-black italic text-2xl sm:text-3xl uppercase tracking-tight text-white">
                PICK TIME SLOT(S)
              </h3>
            </div>
          </div>

          {/* Time Filter Pills */}
          <div className="flex items-center gap-1.5 text-xs font-headline font-bold overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: 'ALL SLOTS' },
              { id: 'morning', label: 'MORNING (6-12)' },
              { id: 'afternoon', label: 'AFTERNOON (12-5)' },
              { id: 'night', label: '⚡ FLOODLIGHTS (5-11 PM)' },
            ].map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setTimeFilter(f.id as any)}
                className={`px-4 py-2 rounded-xl transition-all uppercase tracking-wider whitespace-nowrap cursor-pointer ${
                  timeFilter === f.id
                    ? 'bg-[#ff7a00] text-white shadow-md font-black'
                    : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-white/50 pt-1">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-md bg-[#141619] border border-white/20 inline-block"></span>
            <span>AVAILABLE</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-md bg-[#ff7a00] shadow-[0_0_8px_#ff7a00] inline-block"></span>
            <span className="text-[#ff7a00] font-bold">SELECTED</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-md bg-[#111316] border border-white/5 inline-block opacity-40"></span>
            <span>BOOKED / LOCKED</span>
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
              <motion.button
                key={slot.id}
                type="button"
                whileHover={isAvailable ? { scale: 1.03 } : undefined}
                whileTap={isAvailable ? { scale: 0.96 } : undefined}
                transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                onClick={() => {
                  if (isAvailable || isSelected) {
                    onToggleSlot(slot.id);
                  }
                }}
                disabled={isBooked || isBlocked || isPast}
                className={`p-4 rounded-2xl border transition-all text-left flex flex-col justify-between select-none ${
                  isSelected
                    ? 'bg-gradient-to-br from-[#ff7a00]/30 to-[#ff5a00]/15 border-2 border-[#ff7a00] text-white shadow-[0_0_25px_rgba(255,122,0,0.4)] cursor-pointer'
                    : isBooked
                    ? 'bg-[#111316] border-white/5 opacity-40 cursor-not-allowed text-white/30'
                    : isBlocked
                    ? 'bg-[#111316] border-white/5 opacity-40 cursor-not-allowed text-white/30'
                    : isPast
                    ? 'bg-[#111316] border-white/5 opacity-25 cursor-not-allowed text-white/20'
                    : 'bg-[#141619] border-white/10 hover:border-[#ff7a00]/60 hover:bg-[#191c21] cursor-pointer text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-headline font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    isSelected
                      ? 'bg-[#ff7a00] text-white font-black'
                      : slot.isPeak
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-white/5 text-white/60'
                  }`}>
                    {slot.isPeak ? '⚡ PRIME LIGHTS' : 'STANDARD'}
                  </span>

                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-[#ff7a00] text-white flex items-center justify-center font-black text-xs shadow-md">
                      ✓
                    </span>
                  )}
                  {isBooked && (
                    <Lock className="w-3.5 h-3.5 text-white/30" />
                  )}
                </div>

                <div className="my-1">
                  <div className={`text-sm sm:text-base font-headline font-black italic tracking-tight leading-snug ${
                    isSelected ? 'text-white' : isBooked ? 'text-white/30 line-through' : 'text-white'
                  }`}>
                    {slot.displayTime}
                  </div>
                  <span className={`text-[11px] font-body block mt-0.5 ${isSelected ? 'text-[#ffb27e]' : 'text-white/40'}`}>
                    60 mins match
                  </span>
                </div>

                <div className={`pt-2.5 mt-2.5 border-t flex items-center justify-between text-xs font-mono ${
                  isSelected ? 'border-white/20' : 'border-white/5'
                }`}>
                  {isBooked ? (
                    <span className="text-white/30 font-bold text-[11px]">BOOKED</span>
                  ) : isBlocked ? (
                    <span className="text-white/30 font-bold text-[11px] truncate">LOCKED</span>
                  ) : isPast ? (
                    <span className="text-white/20 text-[11px]">ENDED</span>
                  ) : (
                    <>
                      <span className={`text-xs ${isSelected ? 'text-white/80' : 'text-white/50'}`}>
                        FEE:
                      </span>
                      <span className={`font-headline font-black italic text-base ${isSelected ? 'text-[#ff7a00]' : 'text-white'}`}>
                        ₹{slot.price}
                      </span>
                    </>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Floating Bottom Drawer when slots are selected */}
      <AnimatePresence>
        {selectedSlotIds.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 450, damping: 32 }}
            className="sticky bottom-5 z-40 p-4 sm:p-5 rounded-3xl bg-[#16181b]/95 backdrop-blur-2xl border-2 border-[#ff7a00] shadow-[0_20px_60px_rgba(255,122,0,0.4)] flex flex-col sm:flex-row items-center justify-between gap-4 text-white"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#ff7a00] text-white flex items-center justify-center font-headline font-black text-2xl shadow-lg">
                {selectedSlotIds.length}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-widest text-[#ff7a00] font-headline font-bold">
                    {selectedSlotIds.length} {selectedSlotIds.length === 1 ? 'HOUR SELECTED' : 'HOURS SELECTED'}
                  </span>
                  <span className="text-white/30">•</span>
                  <span className="text-xs font-bold text-white">
                    {currentPitch.name} ({selectedSport})
                  </span>
                </div>
                <p className="text-xs text-white/70 mt-0.5 font-mono">
                  DATE: <strong className="text-white">{selectedDate}</strong> | TOTAL: <strong className="text-white text-base font-headline font-black italic text-[#ff7a00]">₹{totalBasePrice}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClearSelectedSlots}
                className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-headline font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Clear
              </button>
              
              <button
                type="button"
                onClick={onProceedToCheckout}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#ff7a00] hover:bg-[#ff8a1a] text-white font-headline font-bold text-xs uppercase tracking-[0.18em] shadow-[0_10px_30px_rgba(255,122,0,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span>CONFIRM & BOOK MATCH</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
