import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Unlock, 
  AlertTriangle, 
  CloudRain, 
  Wrench, 
  Trophy 
} from 'lucide-react';
import { Pitch } from '../../types';
import { BlockedSlotRecord } from '../../data/storage';
import { OPERATING_HOURS, formatDisplayTime } from '../../data/storage';

interface SlotBlockerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pitches: Pitch[];
  initialPitchId?: string;
  initialTime?: string;
  selectedDate: string;
  blockedSlots: BlockedSlotRecord[];
  onToggleBlock: (date: string, pitchId: string, time: string, reason: string) => void;
}

export const SlotBlockerModal: React.FC<SlotBlockerModalProps> = ({
  isOpen,
  onClose,
  pitches,
  initialPitchId,
  initialTime,
  selectedDate,
  blockedSlots,
  onToggleBlock
}) => {
  const [pitchId, setPitchId] = useState(initialPitchId || pitches[0].id);
  const [date, setDate] = useState(selectedDate);
  const [time, setTime] = useState(initialTime || '15:00');
  const [reason, setReason] = useState('Groundskeeping / Turf Grooming');

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0c1810] border-2 border-[#1f3d28] rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 text-xs font-mono">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#1b3623] bg-[#0e1d13] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isCurrentlyBlocked 
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' 
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {isCurrentlyBlocked ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white uppercase tracking-wider">
                {isCurrentlyBlocked ? 'Unlock Court Slot' : 'Lock Slot from Booking'}
              </h3>
              <p className="text-zinc-400 text-xs">
                {isCurrentlyBlocked ? 'Restore this slot back to public availability' : 'Hold slot for maintenance, rain, or private event'}
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

        {/* Form */}
        <form onSubmit={handleToggle} className="p-5 sm:p-6 space-y-4">
          
          {isCurrentlyBlocked && (
            <div className="p-3.5 rounded-2xl bg-[#221313] border border-red-500/40 text-red-200 space-y-1">
              <span className="font-bold text-xs uppercase block text-red-300">Currently Blocked</span>
              <p className="text-[11px] text-zinc-300">
                Reason: <strong>{existingBlock?.reason}</strong>
              </p>
              <p className="text-[10px] text-zinc-400">
                Clicking confirm below will release this slot immediately.
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-zinc-300 font-bold block mb-1">Court / Pitch</label>
              <select
                value={pitchId}
                onChange={e => setPitchId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#09140d] border border-[#204229] text-white focus:outline-none focus:border-emerald-400"
              >
                {pitches.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-zinc-300 font-bold block mb-1">Time Slot</label>
              <select
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#09140d] border border-[#204229] text-white focus:outline-none focus:border-emerald-400"
              >
                {OPERATING_HOURS.map(t => (
                  <option key={t} value={t}>{formatDisplayTime(t)}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-zinc-300 font-bold block mb-1">Target Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#09140d] border border-[#204229] text-white focus:outline-none focus:border-emerald-400"
            />
          </div>

          {!isCurrentlyBlocked && (
            <div className="space-y-2">
              <label className="text-zinc-300 font-bold block mb-1">Reason for Hold</label>
              <input
                type="text"
                required
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#09140d] border border-[#204229] text-white focus:outline-none focus:border-emerald-400"
              />

              <div className="flex flex-wrap gap-1.5 pt-1">
                {presets.map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setReason(p)}
                    className="text-[10px] px-2.5 py-1 rounded-lg bg-[#122417] text-zinc-300 hover:text-white border border-[#204229] transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-[#172c1c] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-[#122417] text-zinc-300 hover:text-white font-bold"
            >
              Cancel
            </button>

            <button
              type="submit"
              className={`px-6 py-2.5 rounded-xl font-extrabold uppercase tracking-wider text-black shadow-lg active:scale-95 transition-all ${
                isCurrentlyBlocked
                  ? 'bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-300 hover:to-green-400'
                  : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400'
              }`}
            >
              {isCurrentlyBlocked ? 'Release / Unblock Slot' : 'Lock Slot Now'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
