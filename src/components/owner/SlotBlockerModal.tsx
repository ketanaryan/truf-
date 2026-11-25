import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Unlock, 
  Clock, 
  Calendar, 
  Ban, 
  AlertCircle,
  Wrench,
  CloudRain
} from 'lucide-react';
import { Pitch } from '../../types';
import { BlockedSlotRecord, OPERATING_HOURS, formatDisplayTime } from '../../data/storage';

interface SlotBlockerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pitches: Pitch[];
  selectedDate: string;
  initialPitchId?: string;
  initialTime?: string;
  blockedSlots: BlockedSlotRecord[];
  onToggleBlock: (date: string, pitchId: string, time: string, reason: string) => void;
}

export const SlotBlockerModal: React.FC<SlotBlockerModalProps> = ({
  isOpen,
  onClose,
  pitches,
  selectedDate,
  initialPitchId,
  initialTime,
  blockedSlots,
  onToggleBlock
}) => {
  const [pitchId, setPitchId] = useState(initialPitchId || pitches[0].id);
  const [date, setDate] = useState(selectedDate);
  const [time, setTime] = useState(initialTime || '15:00');
  const [reason, setReason] = useState('Groundskeeping / Turf Grooming & Infill');

  if (!isOpen) return null;

  const key = `${date}_${pitchId}_${time}`;
  const existingBlock = blockedSlots.find(b => b.key === key);
  const isCurrentlyBlocked = Boolean(existingBlock);

  const presets = [
    'Groundskeeping / Turf Grooming & Infill',
    'Private Corporate Tournament',
    'Rain / Surface Water Caution',
    'Floodlight Mast Maintenance',
    'Academy Coaching Session'
  ];

  const handleToggle = (e: React.FormEvent) => {
    e.preventDefault();
    onToggleBlock(date, pitchId, time, reason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto font-sans">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 text-xs text-slate-800">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 bg-[#0B1D2D] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
              isCurrentlyBlocked 
                ? 'bg-amber-500 text-white' 
                : 'bg-red-500 text-white'
            }`}>
              {isCurrentlyBlocked ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white uppercase tracking-wider">
                {isCurrentlyBlocked ? 'Unlock Court Slot' : 'Lock Slot from Booking'}
              </h3>
              <p className="text-slate-300 text-xs">
                {isCurrentlyBlocked ? 'Restore slot back to public availability' : 'Hold slot for maintenance, rain, or private match'}
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

        {/* Body */}
        <form onSubmit={handleToggle} className="p-5 sm:p-6 space-y-4">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-600 font-bold block mb-1">Target Date</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs focus:outline-none focus:border-[#FF6A00]"
                required
              />
            </div>

            <div>
              <label className="text-slate-600 font-bold block mb-1">Target Time Slot</label>
              <select
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-[#FF6A00]"
              >
                {OPERATING_HOURS.map(t => (
                  <option key={t} value={t}>{formatDisplayTime(t)}</option>
                ))}
              </select>
            </div>
          </div>

          {!isCurrentlyBlocked ? (
            <div className="space-y-2">
              <label className="text-slate-600 font-bold block mb-1">Reason for Lockout</label>
              <input
                type="text"
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-[#FF6A00]"
                placeholder="Enter maintenance reason..."
                required
              />

              <div className="flex flex-wrap gap-1.5 pt-1">
                {presets.map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setReason(p)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 space-y-1">
              <span className="font-extrabold uppercase text-xs block">Slot is Currently Locked</span>
              <p className="text-xs">
                Reason: <strong>{existingBlock?.reason}</strong>
              </p>
              <span className="text-[11px] text-amber-700 block mt-1">
                Click below to unlock and reopen this slot on the player booking portal.
              </span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-6 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider text-white shadow-md active:scale-95 transition-all ${
                isCurrentlyBlocked 
                  ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30' 
                  : 'bg-red-600 hover:bg-red-500 shadow-red-600/30'
              }`}
            >
              {isCurrentlyBlocked ? 'Confirm Slot Unlock' : 'Confirm Slot Lock'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
