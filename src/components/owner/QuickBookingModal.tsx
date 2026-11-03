import React, { useState } from 'react';
import { 
  X, 
  PhoneCall, 
  Calendar, 
  Clock, 
  User, 
  CircleDollarSign, 
  Sparkles,
  ShieldCheck,
  Check
} from 'lucide-react';
import { Pitch, SportType, Booking, OwnerSettings, PaymentMethod, PaymentStatus, BookingSource } from '../../types';
import { OPERATING_HOURS, formatDisplayTime, getSlotPrice } from '../../data/storage';

interface QuickBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  pitches: Pitch[];
  initialPitchId?: string;
  initialTime?: string;
  selectedDate: string;
  settings: OwnerSettings;
  onSaveBooking: (newBooking: Booking) => void;
}

export const QuickBookingModal: React.FC<QuickBookingModalProps> = ({
  isOpen,
  onClose,
  pitches,
  initialPitchId,
  initialTime,
  selectedDate,
  settings,
  onSaveBooking
}) => {
  const [pitchId, setPitchId] = useState(initialPitchId || pitches[0].id);
  const [date, setDate] = useState(selectedDate);
  const [startTime, setStartTime] = useState(initialTime || '18:00');
  const [captainName, setCaptainName] = useState('');
  const [captainPhone, setCaptainPhone] = useState('');
  const [teamName, setTeamName] = useState('');
  const [source, setSource] = useState<BookingSource>('phone_call');
  const [advancePaid, setAdvancePaid] = useState<number>(500);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const currentPitch = pitches.find(p => p.id === pitchId) || pitches[0];
  const [sport, setSport] = useState<SportType>(currentPitch.sports[0]);

  const slotPrice = getSlotPrice(pitchId, date, startTime, settings, pitches);
  const balanceDue = Math.max(0, slotPrice - advancePaid);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!captainName.trim() || !captainPhone.trim()) return;

    const ref = 'BG-OFF-' + Math.floor(1000 + Math.random() * 9000);
    const displayTime = formatDisplayTime(startTime);

    let paymentStatus: PaymentStatus = 'advance_deposit';
    if (advancePaid >= slotPrice) paymentStatus = 'paid_full';
    if (advancePaid === 0) paymentStatus = 'pay_at_venue';

    const newBooking: Booking = {
      id: ref,
      bookingRef: ref,
      pitchId,
      pitchName: currentPitch.name,
      date,
      slotIds: [`slot-${pitchId}-${date}-${startTime}`],
      timeRange: displayTime,
      durationHours: 1,
      sport,
      captainName: captainName.trim(),
      captainPhone: captainPhone.trim(),
      teamName: teamName.trim() || `${captainName.trim()}'s Squad`,
      notes: notes.trim(),
      baseAmount: slotPrice,
      addonsAmount: 0,
      totalAmount: slotPrice,
      advancePaid,
      balanceDue,
      paymentStatus,
      paymentMethod,
      source,
      selectedAddons: [],
      createdAt: new Date().toISOString(),
      isCheckedIn: false,
      status: 'confirmed'
    };

    onSaveBooking(newBooking);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0c1810] border-2 border-[#1f3d28] rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 text-xs font-mono">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#1b3623] bg-[#0e1d13] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white uppercase tracking-wider">
                Desk Quick Booking
              </h3>
              <p className="text-zinc-400 text-xs">
                Manual reservation for phone calls or counter walk-ins
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          
          {/* Source Selector */}
          <div>
            <label className="text-zinc-300 font-bold block mb-1.5 uppercase text-[11px]">
              Booking Channel
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSource('phone_call')}
                className={`py-2 rounded-xl font-bold transition-all border ${
                  source === 'phone_call'
                    ? 'bg-amber-400 text-black border-amber-300 font-extrabold'
                    : 'bg-[#122417] text-zinc-400 border-[#204029]'
                }`}
              >
                📞 Phone Hotline
              </button>
              <button
                type="button"
                onClick={() => setSource('walk_in')}
                className={`py-2 rounded-xl font-bold transition-all border ${
                  source === 'walk_in'
                    ? 'bg-emerald-500 text-black border-emerald-400 font-extrabold'
                    : 'bg-[#122417] text-zinc-400 border-[#204029]'
                }`}
              >
                🏃 Walk-In at Gate
              </button>
            </div>
          </div>

          {/* Court & Sport */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-zinc-300 font-bold block mb-1">Select Pitch *</label>
              <select
                value={pitchId}
                onChange={e => {
                  setPitchId(e.target.value);
                  const p = pitches.find(x => x.id === e.target.value);
                  if (p) setSport(p.sports[0]);
                }}
                className="w-full px-3 py-2.5 rounded-xl bg-[#09140d] border border-[#204229] text-white focus:outline-none focus:border-emerald-400"
              >
                {pitches.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-zinc-300 font-bold block mb-1">Sport Format *</label>
              <select
                value={sport}
                onChange={e => setSport(e.target.value as SportType)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#09140d] border border-[#204229] text-white focus:outline-none focus:border-emerald-400"
              >
                {currentPitch.sports.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-zinc-300 font-bold block mb-1">Match Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#09140d] border border-[#204229] text-white focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-bold block mb-1">Operating Slot *</label>
              <select
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#09140d] border border-[#204229] text-white focus:outline-none focus:border-emerald-400"
              >
                {OPERATING_HOURS.map(t => (
                  <option key={t} value={t}>{formatDisplayTime(t)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Captain & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-zinc-300 font-bold block mb-1">Captain Name *</label>
              <input
                type="text"
                required
                value={captainName}
                onChange={e => setCaptainName(e.target.value)}
                placeholder="e.g. Sameer Khan"
                className="w-full px-3 py-2.5 rounded-xl bg-[#09140d] border border-[#204229] text-white focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-bold block mb-1">Mobile Phone *</label>
              <input
                type="tel"
                required
                value={captainPhone}
                onChange={e => setCaptainPhone(e.target.value)}
                placeholder="e.g. 9820188492"
                className="w-full px-3 py-2.5 rounded-xl bg-[#09140d] border border-[#204229] text-white focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          {/* Squad Name & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-zinc-300 font-bold block mb-1">Squad Name (Optional)</label>
              <input
                type="text"
                value={teamName}
                onChange={e => setTeamName(e.target.value)}
                placeholder="e.g. Red Devils FC"
                className="w-full px-3 py-2.5 rounded-xl bg-[#09140d] border border-[#204229] text-white focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-bold block mb-1">Desk Notes</label>
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="e.g. Request 2 extra footballs"
                className="w-full px-3 py-2.5 rounded-xl bg-[#09140d] border border-[#204229] text-white focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          {/* Pricing & Advance Token Settlement */}
          <div className="p-4 rounded-2xl bg-[#09140d] border border-[#204229] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Total Slot Fee:</span>
              <span className="text-base font-extrabold text-white">₹{slotPrice}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-[#172c1c]">
              <div>
                <label className="text-zinc-400 block mb-1">Amount Collected Now (₹)</label>
                <input
                  type="number"
                  min="0"
                  max={slotPrice}
                  value={advancePaid}
                  onChange={e => setAdvancePaid(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#122417] border border-[#244b2f] text-emerald-400 font-bold text-sm"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-2 rounded-xl bg-[#122417] border border-[#244b2f] text-white"
                >
                  <option value="cash">Cash at Reception</option>
                  <option value="upi">Direct UPI / QR</option>
                  <option value="card">Card Terminal (POS)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-zinc-400">Balance Due at Entry:</span>
              <span className={`font-black ${balanceDue > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {balanceDue > 0 ? `₹${balanceDue} (Pending)` : 'Cleared ₹0'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-[#122417] text-zinc-300 hover:text-white font-bold"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-300 hover:to-green-400 text-black font-extrabold uppercase tracking-wider shadow-lg active:scale-95"
            >
              Confirm Reservation
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
