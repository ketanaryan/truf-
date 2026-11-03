import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  Smartphone, 
  ArrowRight,
  QrCode, 
  CheckCircle2, 
  User
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Pitch, Slot, SportType, AddonItem, Booking, OwnerSettings, PaymentMethod, PaymentStatus } from '../../types';
import { AddonsSelector } from './AddonsSelector';

interface CheckoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  pitches: Pitch[];
  selectedPitchId: string;
  selectedSport: SportType;
  selectedDate: string;
  selectedSlotIds: string[];
  slots: Slot[];
  addons: AddonItem[];
  settings: OwnerSettings;
  onBookingConfirmed: (newBooking: Booking) => void;
}

export const CheckoutDrawer: React.FC<CheckoutDrawerProps> = ({
  isOpen,
  onClose,
  pitches,
  selectedPitchId,
  selectedSport,
  selectedDate,
  selectedSlotIds,
  slots,
  addons,
  settings,
  onBookingConfirmed
}) => {
  const [captainName, setCaptainName] = useState('');
  const [captainPhone, setCaptainPhone] = useState('');
  const [teamName, setTeamName] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [selectedAddons, setSelectedAddons] = useState<{ [id: string]: number }>({});
  const [paymentPlan, setPaymentPlan] = useState<'full' | 'advance' | 'venue'>('full');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const currentPitch = pitches.find(p => p.id === selectedPitchId) || pitches[0];
  const chosenSlots = slots.filter(s => selectedSlotIds.includes(s.id));
  chosenSlots.sort((a, b) => a.startTime.localeCompare(b.startTime));

  const durationHours = chosenSlots.length;
  const baseAmount = chosenSlots.reduce((sum, s) => sum + s.price, 0);

  const addonsAmount = Object.entries(selectedAddons).reduce((sum, [addonId, qty]) => {
    const item = addons.find(a => a.id === addonId);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const totalAmount = baseAmount + addonsAmount;
  const depositPercent = settings.advanceDepositPercentage || 30;
  const calculatedAdvance = Math.round((totalAmount * depositPercent) / 100);

  const amountToPayNow = 
    paymentPlan === 'full' 
      ? totalAmount 
      : paymentPlan === 'advance' 
      ? calculatedAdvance 
      : 0;

  const balanceDue = totalAmount - amountToPayNow;

  const handleToggleAddon = (addonId: string) => {
    setSelectedAddons(prev => ({
      ...prev,
      [addonId]: (prev[addonId] || 0) > 0 ? 0 : 1
    }));
  };

  const handleUpdateAddonQty = (addonId: string, delta: number) => {
    setSelectedAddons(prev => {
      const next = (prev[addonId] || 0) + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[addonId];
        return copy;
      }
      return { ...prev, [addonId]: next };
    });
  };

  const validate = () => {
    const err: { [key: string]: string } = {};
    if (!captainName.trim()) err.captainName = 'Captain name is required';
    if (!captainPhone.trim()) {
      err.captainPhone = 'Phone number is required';
    } else if (captainPhone.replace(/\D/g, '').length < 10) {
      err.captainPhone = 'Enter valid 10-digit mobile number';
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmitBooking = () => {
    if (!validate()) return;
    setIsProcessing(true);

    setTimeout(() => {
      const randomRef = 'BG-' + Math.floor(1000 + Math.random() * 9000);
      const firstSlot = chosenSlots[0];
      const lastSlot = chosenSlots[chosenSlots.length - 1];
      const timeRange = `${firstSlot.displayTime.split('-')[0].trim()} - ${lastSlot.displayTime.split('-')[1].trim()}`;

      const bookedAddons = Object.entries(selectedAddons).map(([id, qty]) => {
        const item = addons.find(a => a.id === id);
        return {
          id,
          name: item?.name || 'Addon',
          price: (item?.price || 0) * qty,
          qty
        };
      });

      let statusPayment: PaymentStatus = 'paid_full';
      if (paymentPlan === 'advance') statusPayment = 'advance_deposit';
      if (paymentPlan === 'venue') statusPayment = 'pay_at_venue';

      const newBooking: Booking = {
        id: randomRef,
        bookingRef: randomRef,
        pitchId: currentPitch.id,
        pitchName: currentPitch.name,
        date: selectedDate,
        slotIds: selectedSlotIds,
        timeRange,
        durationHours,
        sport: selectedSport,
        captainName: captainName.trim(),
        captainPhone: captainPhone.trim(),
        teamName: teamName.trim() || 'Team ' + captainName.split(' ')[0],
        notes: notes.trim(),
        baseAmount,
        addonsAmount,
        totalAmount,
        advancePaid: amountToPayNow,
        balanceDue,
        paymentStatus: statusPayment,
        paymentMethod: paymentPlan === 'venue' ? 'cash' : paymentMethod,
        source: 'online',
        selectedAddons: bookedAddons,
        createdAt: new Date().toISOString(),
        isCheckedIn: false,
        status: 'confirmed'
      };

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {}

      setIsProcessing(false);
      onBookingConfirmed(newBooking);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0c1810] border-2 border-[#1f3d28] rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#0c1810]/95 backdrop-blur-md px-6 py-4 border-b border-[#1a3322] flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold uppercase text-white font-mono">
              Confirm Match Reservation
            </h3>
            <p className="text-xs text-zinc-400 font-mono">
              {currentPitch.name} • {selectedSport}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#132619] text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6">

          {/* Match Overview Summary */}
          <div className="p-4 rounded-2xl bg-[#0f2115] border border-[#1f422a] space-y-2 text-xs font-mono">
            <div className="flex justify-between text-zinc-300">
              <span>Date:</span>
              <span className="text-white font-bold">{selectedDate}</span>
            </div>
            <div className="flex justify-between text-zinc-300">
              <span>Duration ({durationHours} hr):</span>
              <span className="text-emerald-400 font-bold">
                {chosenSlots.map(s => s.displayTime).join(' & ')}
              </span>
            </div>
            <div className="flex justify-between text-zinc-300 pt-1 border-t border-[#1a3824]">
              <span>Slot Base Fee:</span>
              <span className="text-white font-bold">₹{baseAmount}</span>
            </div>
          </div>

          {/* Add-ons */}
          <AddonsSelector
            addons={addons}
            selectedAddons={selectedAddons}
            onToggleAddon={handleToggleAddon}
            onUpdateQty={handleUpdateAddonQty}
          />

          {/* Captain Contact Information */}
          <div className="space-y-3 pt-2 border-t border-[#1a3322]">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-bold block">
              Captain & Team Details
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <label className="text-zinc-300 block mb-1">Captain Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Sahil Khan"
                  value={captainName}
                  onChange={e => {
                    setCaptainName(e.target.value);
                    if (errors.captainName) setErrors({ ...errors, captainName: '' });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-[#09130d] border text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400 ${
                    errors.captainName ? 'border-red-500' : 'border-[#1f3d28]'
                  }`}
                />
                {errors.captainName && (
                  <span className="text-[10px] text-red-400 mt-1 block">{errors.captainName}</span>
                )}
              </div>

              <div>
                <label className="text-zinc-300 block mb-1">WhatsApp Mobile *</label>
                <input
                  type="tel"
                  placeholder="e.g. 98201 54321"
                  value={captainPhone}
                  onChange={e => {
                    setCaptainPhone(e.target.value);
                    if (errors.captainPhone) setErrors({ ...errors, captainPhone: '' });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-[#09130d] border text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400 ${
                    errors.captainPhone ? 'border-red-500' : 'border-[#1f3d28]'
                  }`}
                />
                {errors.captainPhone && (
                  <span className="text-[10px] text-red-400 mt-1 block">{errors.captainPhone}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <label className="text-zinc-300 block mb-1">Team Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Thunderbolts FC"
                  value={teamName}
                  onChange={e => setTeamName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#09130d] border border-[#1f3d28] text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-zinc-300 block mb-1">Match Notes</label>
                <input
                  type="text"
                  placeholder="e.g. 5v5 balls, extra water"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#09130d] border border-[#1f3d28] text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>
          </div>

          {/* Payment Plan */}
          <div className="space-y-3 pt-2 border-t border-[#1a3322]">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-bold block">
              Payment Method
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div
                onClick={() => setPaymentPlan('full')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  paymentPlan === 'full'
                    ? 'bg-[#152e1d] border-emerald-400 text-white shadow-md'
                    : 'bg-[#09130d] border-[#1f3d28] text-zinc-300 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold uppercase">100% Full</span>
                  {paymentPlan === 'full' && <span className="text-emerald-400 text-xs font-bold">✓</span>}
                </div>
                <span className="text-sm font-black font-mono text-emerald-400">₹{totalAmount}</span>
              </div>

              <div
                onClick={() => setPaymentPlan('advance')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  paymentPlan === 'advance'
                    ? 'bg-[#152e1d] border-emerald-400 text-white shadow-md'
                    : 'bg-[#09130d] border-[#1f3d28] text-zinc-300 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold uppercase">{depositPercent}% Token</span>
                  {paymentPlan === 'advance' && <span className="text-emerald-400 text-xs font-bold">✓</span>}
                </div>
                <span className="text-sm font-black font-mono text-emerald-400">₹{calculatedAdvance}</span>
              </div>

              <div
                onClick={() => setPaymentPlan('venue')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  paymentPlan === 'venue'
                    ? 'bg-[#152e1d] border-emerald-400 text-white shadow-md'
                    : 'bg-[#09130d] border-[#1f3d28] text-zinc-300 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold uppercase">Pay on Turf</span>
                  {paymentPlan === 'venue' && <span className="text-emerald-400 text-xs font-bold">✓</span>}
                </div>
                <span className="text-sm font-black font-mono text-zinc-300">₹0 Now</span>
              </div>
            </div>

            {paymentPlan !== 'venue' && (
              <div className="p-3.5 rounded-2xl bg-[#09130d] border border-[#1f3d28] space-y-2 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPaymentMethod('upi')}
                    className={`flex-1 py-2 rounded-lg border text-center font-bold ${
                      paymentMethod === 'upi' ? 'bg-emerald-500/20 border-emerald-400 text-white' : 'border-[#1f3d28] text-zinc-400'
                    }`}
                  >
                    UPI Transfer
                  </button>
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`flex-1 py-2 rounded-lg border text-center font-bold ${
                      paymentMethod === 'card' ? 'bg-emerald-500/20 border-emerald-400 text-white' : 'border-[#1f3d28] text-zinc-400'
                    }`}
                  >
                    Credit / Debit
                  </button>
                </div>
                {paymentMethod === 'upi' && (
                  <p className="text-[11px] text-zinc-300 pt-1">
                    UPI ID: <strong className="text-emerald-400 font-mono">{settings.upiId}</strong>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Total Bar */}
          <div className="p-4 rounded-2xl bg-[#112417] border border-[#234d31] flex items-center justify-between font-mono">
            <div>
              <span className="text-xs text-zinc-300 block uppercase font-bold">Due Immediately</span>
              <span className="text-2xl font-black text-emerald-400">₹{amountToPayNow}</span>
            </div>
            {balanceDue > 0 && (
              <div className="text-right text-xs text-zinc-300">
                <span>Remaining on turf: </span>
                <span className="text-amber-400 font-bold block text-sm">₹{balanceDue}</span>
              </div>
            )}
          </div>

        </div>

        {/* Footer actions */}
        <div className="sticky bottom-0 bg-[#0c1810]/95 backdrop-blur-md px-6 py-4 border-t border-[#1a3322] flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-[#132619] border border-[#1f3d28] text-xs font-mono text-zinc-300 hover:text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmitBooking}
            disabled={isProcessing}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-300 hover:to-green-400 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg transition-transform active:scale-95 disabled:opacity-50"
          >
            {isProcessing ? (
              <span>Securing Match Slot...</span>
            ) : (
              <>
                <span>Confirm & Generate Match Pass</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
