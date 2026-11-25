import React, { useState, useEffect } from 'react';
import { 
  X, 
  PhoneCall, 
  Calendar, 
  Clock, 
  User, 
  CircleDollarSign, 
  Sparkles,
  ShieldCheck,
  Check,
  AlertTriangle,
  Users
} from 'lucide-react';
import { Pitch, SportType, Booking, OwnerSettings, PaymentMethod, PaymentStatus, BookingSource } from '../../types';
import { OPERATING_HOURS, formatDisplayTime, getSlotPrice, BlockedSlotRecord } from '../../data/storage';

interface QuickBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  pitches: Pitch[];
  initialPitchId?: string;
  initialTime?: string;
  selectedDate: string;
  settings: OwnerSettings;
  onSaveBooking: (newBooking: Booking) => void;
  existingBookings?: Booking[];
  blockedSlots?: BlockedSlotRecord[];
}

export const QuickBookingModal: React.FC<QuickBookingModalProps> = ({
  isOpen,
  onClose,
  pitches,
  initialPitchId,
  initialTime,
  selectedDate,
  settings,
  onSaveBooking,
  existingBookings = [],
  blockedSlots = []
}) => {
  const [pitchId, setPitchId] = useState(initialPitchId || pitches[0].id);
  const [date, setDate] = useState(selectedDate);
  const [startTime, setStartTime] = useState(initialTime || '18:00');
  const [sport, setSport] = useState<SportType>(pitches[0]?.sports[0] || 'Box Cricket');
  const [captainName, setCaptainName] = useState('');
  const [captainPhone, setCaptainPhone] = useState('');
  const [teamName, setTeamName] = useState('');
  const [source, setSource] = useState<BookingSource>('phone_call');
  const [advancePaid, setAdvancePaid] = useState<number>(500);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [notes, setNotes] = useState('');
  const [isCheckedInNow, setIsCheckedInNow] = useState(false);

  useEffect(() => {
    if (initialPitchId) setPitchId(initialPitchId);
    if (initialTime) setStartTime(initialTime);
    if (selectedDate) setDate(selectedDate);
  }, [initialPitchId, initialTime, selectedDate, isOpen]);

  if (!isOpen) return null;

  const currentPitch = pitches.find(p => p.id === pitchId) || pitches[0];
  const totalAmount = getSlotPrice(pitchId, date, startTime, settings, pitches);
  const balanceDue = Math.max(0, totalAmount - advancePaid);
  const timeRange = formatDisplayTime(startTime);

  // Check collision
  const isAlreadyBooked = existingBookings.some(
    b => b.date === date && b.pitchId === pitchId && b.status !== 'cancelled' &&
         (b.slotIds.includes(`slot-${pitchId}-${date}-${startTime}`) ||
          b.slotIds.includes(`slot-${pitchId}-${startTime}`) ||
          b.timeRange.includes(timeRange))
  );

  const isAlreadyBlocked = blockedSlots.some(
    b => b.key === `${date}_${pitchId}_${startTime}`
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!captainName.trim() || !captainPhone.trim()) return;

    let paymentStatus: PaymentStatus = 'pay_at_venue';
    if (advancePaid >= totalAmount) {
      paymentStatus = 'paid_full';
    } else if (advancePaid > 0) {
      paymentStatus = 'advance_deposit';
    }

    const bookingRef = `SMT-${Math.floor(1000 + Math.random() * 9000)}`;
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newBooking: Booking = {
      id: `manual-${Date.now()}`,
      bookingRef,
      pitchId,
      pitchName: currentPitch.name,
      date,
      slotIds: [`slot-${pitchId}-${date}-${startTime}`],
      timeRange,
      durationHours: 1,
      sport,
      captainName: captainName.trim(),
      captainPhone: captainPhone.trim(),
      teamName: teamName.trim() || `${captainName.trim()}'s Squad`,
      notes: notes.trim(),
      baseAmount: totalAmount,
      addonsAmount: 0,
      totalAmount,
      advancePaid,
      balanceDue,
      paymentStatus,
      paymentMethod,
      source,
      isUpiVerified: paymentMethod === 'upi',
      createdAt: new Date().toISOString(),
      isCheckedIn: isCheckedInNow,
      checkedInAt: isCheckedInNow ? timeNow : undefined,
      status: 'confirmed'
    };

    onSaveBooking(newBooking);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto font-sans">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 text-xs">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 bg-[#0B1D2D] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF6A00] flex items-center justify-center text-white">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white uppercase tracking-wider">
                Desk Manual Reservation
              </h3>
              <p className="text-slate-300 text-xs">
                Quick entry for telephone inquiries or reception counter walk-ins
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-slate-800">
          
          {(isAlreadyBooked || isAlreadyBlocked) && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 flex items-start gap-3 text-amber-900">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold uppercase tracking-wider block">⚠️ Slot Warning</span>
                <span>
                  {isAlreadyBooked
                    ? `This slot (${date} at ${startTime}) already has a booking recorded.`
                    : `This slot (${date} at ${startTime}) is currently locked under maintenance.`}
                </span>
              </div>
            </div>
          )}
          
          {/* Source Selector */}
          <div>
            <label className="text-slate-600 font-bold block mb-1.5 uppercase text-[11px]">
              Booking Channel
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSource('phone_call')}
                className={`py-2 rounded-xl font-bold transition-all border ${
                  source === 'phone_call'
                    ? 'bg-[#0B1D2D] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                📞 Phone / WhatsApp Call
              </button>
              <button
                type="button"
                onClick={() => setSource('walk_in')}
                className={`py-2 rounded-xl font-bold transition-all border ${
                  source === 'walk_in'
                    ? 'bg-[#FF6A00] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                🏃 Walk-In at Turf Reception
              </button>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-600 font-bold block mb-1">Match Date *</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#FF6A00]"
                required
              />
            </div>

            <div>
              <label className="text-slate-600 font-bold block mb-1">Start Time (1 Hour) *</label>
              <select
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#FF6A00]"
              >
                {OPERATING_HOURS.map(t => (
                  <option key={t} value={t}>{formatDisplayTime(t)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sport Format */}
          <div>
            <label className="text-slate-600 font-bold block mb-1">Sport Format *</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSport('Box Cricket')}
                className={`py-2 rounded-xl font-bold transition-all border ${
                  sport === 'Box Cricket'
                    ? 'bg-[#FF6A00] text-white border-[#E65F00] shadow-sm'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                🏏 Box Cricket
              </button>
              <button
                type="button"
                onClick={() => setSport('Football')}
                className={`py-2 rounded-xl font-bold transition-all border ${
                  sport === 'Football'
                    ? 'bg-[#00B6C8] text-white border-[#00B6C8] shadow-sm'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                ⚽ 5v5 Football
              </button>
            </div>
          </div>

          {/* Captain & Team Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-600 font-bold block mb-1">Captain Name *</label>
              <input
                type="text"
                value={captainName}
                onChange={e => setCaptainName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#FF6A00]"
                required
              />
            </div>

            <div>
              <label className="text-slate-600 font-bold block mb-1">WhatsApp Mobile *</label>
              <input
                type="tel"
                value={captainPhone}
                onChange={e => setCaptainPhone(e.target.value)}
                placeholder="e.g. 9820188492"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:outline-none focus:border-[#FF6A00]"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-slate-600 font-bold block mb-1">Squad / Team Name (Optional)</label>
            <input
              type="text"
              value={teamName}
              onChange={e => setTeamName(e.target.value)}
              placeholder="e.g. Gully Blasters CC"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#FF6A00]"
            />
          </div>

          {/* Pricing & Deposit */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-600">Standard Slot Fee:</span>
              <strong className="text-base text-slate-900 font-mono">₹{totalAmount}</strong>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
              <div>
                <label className="text-slate-600 font-bold block mb-1">Deposit Collected (₹)</label>
                <input
                  type="number"
                  min="0"
                  max={totalAmount}
                  value={advancePaid}
                  onChange={e => setAdvancePaid(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 font-bold text-slate-900 font-mono text-xs"
                />
              </div>

              <div>
                <label className="text-slate-600 font-bold block mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold text-xs"
                >
                  <option value="cash">Cash at Desk</option>
                  <option value="upi">Direct GPay / UPI</option>
                  <option value="card">Debit / Credit Card</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500">Remaining Balance Due:</span>
              <strong className={balanceDue > 0 ? 'text-amber-600 font-mono font-bold' : 'text-emerald-600 font-bold'}>
                {balanceDue > 0 ? `₹${balanceDue} (Counter Due)` : '₹0 (Fully Paid)'}
              </strong>
            </div>
          </div>

          {/* Immediate Check In Checkbox */}
          <label className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 cursor-pointer text-xs font-semibold text-emerald-800">
            <input
              type="checkbox"
              checked={isCheckedInNow}
              onChange={e => setIsCheckedInNow(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
            />
            <span>Mark team checked in right now (Players already on turf)</span>
          </label>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#FF6A00] hover:bg-[#E65F00] text-white font-extrabold text-xs uppercase tracking-wider shadow-md shadow-orange-500/20 active:scale-95 transition-all"
            >
              Confirm Reservation
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
