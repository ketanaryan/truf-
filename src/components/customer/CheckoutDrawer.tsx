import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  Smartphone, 
  ArrowRight,
  QrCode, 
  CheckCircle2, 
  User,
  Copy,
  Check,
  Trophy,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Pitch, Slot, SportType, Booking, OwnerSettings, PaymentMethod, PaymentStatus } from '../../types';
import { isWeekend } from '../../data/storage';

interface CheckoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  pitches: Pitch[];
  selectedPitchId: string;
  selectedSport: SportType;
  selectedDate: string;
  selectedSlotIds: string[];
  slots: Slot[];
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
  settings,
  onBookingConfirmed
}) => {
  const [captainName, setCaptainName] = useState('');
  const [captainPhone, setCaptainPhone] = useState('');
  const [teamName, setTeamName] = useState('');
  const [notes, setNotes] = useState('');
  const [upiUtr, setUpiUtr] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isFullDayUpgrade, setIsFullDayUpgrade] = useState(false);
  const [paymentPlan, setPaymentPlan] = useState<'upi_direct' | 'advance_token' | 'pay_at_venue'>('upi_direct');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const currentPitch = pitches.find(p => p.id === selectedPitchId) || pitches[0];
  const chosenSlots = slots.filter(s => selectedSlotIds.includes(s.id));
  chosenSlots.sort((a, b) => a.startTime.localeCompare(b.startTime));

  const weekend = isWeekend(selectedDate);
  const fullDayPackageRate = weekend 
    ? (currentPitch.fullDayWeekendPrice || 20000) 
    : (currentPitch.fullDayWeekdayPrice || 15000);

  const isFullDayAlready = selectedSlotIds.length >= 18;
  const isFullDayActive = isFullDayAlready || isFullDayUpgrade;

  const durationHours = isFullDayActive ? 19 : chosenSlots.length;
  const regularBaseAmount = chosenSlots.reduce((sum, s) => sum + s.price, 0);
  const baseAmount = isFullDayActive ? fullDayPackageRate : regularBaseAmount;

  const totalAmount = baseAmount;
  const depositPercent = settings.advanceDepositPercentage || 30;
  const calculatedAdvance = Math.round((totalAmount * depositPercent) / 100);

  const amountToPayNow = 
    paymentPlan === 'upi_direct' 
      ? totalAmount 
      : paymentPlan === 'advance_token' 
      ? calculatedAdvance 
      : 0;

  const balanceDue = totalAmount - amountToPayNow;

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(settings.upiId || 'battlegroundsturf@icici');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const validate = () => {
    const err: { [key: string]: string } = {};
    if (!captainName.trim()) err.captainName = 'Captain name is required';
    if (!captainPhone.trim()) {
      err.captainPhone = 'Phone number is required';
    } else if (captainPhone.replace(/\D/g, '').length < 10) {
      err.captainPhone = 'Enter valid 10-digit mobile number';
    }

    if (paymentPlan === 'upi_direct' || paymentPlan === 'advance_token') {
      if (!upiUtr.trim()) {
        err.upiUtr = 'Enter 12-digit UPI Transaction / UTR Number from your GPay/PhonePe receipt';
      } else if (upiUtr.trim().length < 8) {
        err.upiUtr = 'Please enter a valid UPI Reference / UTR Number';
      }
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmitBooking = () => {
    if (!validate()) return;
    setIsProcessing(true);

    setTimeout(() => {
      const randomRef = 'BG-' + Math.floor(1000 + Math.random() * 9000);
      const timeRange = isFullDayActive
        ? '06:00 AM - 01:00 AM (Full Day)'
        : chosenSlots.length > 0
        ? `${chosenSlots[0].displayTime.split('-')[0].trim()} - ${chosenSlots[chosenSlots.length - 1].displayTime.split('-')[1].trim()}`
        : '06:00 PM - 07:00 PM';

      let statusPayment: PaymentStatus = 'paid_full';
      if (paymentPlan === 'upi_direct') statusPayment = 'upi_pending';
      if (paymentPlan === 'advance_token') statusPayment = 'upi_pending';
      if (paymentPlan === 'pay_at_venue') statusPayment = 'pay_at_venue';

      const newBooking: Booking = {
        id: randomRef,
        bookingRef: randomRef,
        pitchId: currentPitch.id,
        pitchName: currentPitch.name,
        date: selectedDate,
        slotIds: isFullDayActive ? slots.map(s => s.id) : selectedSlotIds,
        timeRange,
        durationHours,
        sport: selectedSport,
        isFullDayBooking: isFullDayActive,
        captainName: captainName.trim(),
        captainPhone: captainPhone.trim(),
        teamName: teamName.trim() || `${captainName.trim()}'s Squad`,
        notes: notes.trim(),
        baseAmount,
        addonsAmount: 0,
        totalAmount,
        advancePaid: amountToPayNow,
        balanceDue,
        paymentStatus: statusPayment,
        paymentMethod: paymentPlan === 'pay_at_venue' ? 'cash' : 'upi',
        upiUtr: upiUtr.trim() || undefined,
        isUpiVerified: false,
        source: 'online',
        selectedAddons: [],
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

  const upiIntentUri = `upi://pay?pa=${encodeURIComponent(settings.upiId || 'battlegroundsturf@icici')}&pn=${encodeURIComponent(settings.turfName || 'Battlegrounds Turf')}&am=${amountToPayNow}&tn=PassBooking&cu=INR`;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#0c1810] border-2 border-[#1f3d28] rounded-3xl w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in-95 font-mono text-xs">
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#0c1810]/98 backdrop-blur-md px-5 py-4 border-b border-[#1b3623] flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold uppercase text-white font-mono tracking-wider">
              Confirm Turf Booking
            </h3>
            <p className="text-xs text-emerald-400 font-mono">
              {currentPitch.name} • {selectedSport}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#122417] text-zinc-400 hover:text-white flex items-center justify-center border border-[#204029] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5">

          {/* Booking Summary Card */}
          <div className="p-4 rounded-2xl bg-[#09140d] border border-[#1b3823] space-y-2 text-xs">
            <div className="flex justify-between text-zinc-300">
              <span>Court:</span>
              <strong className="text-white">{currentPitch.name} ({selectedSport})</strong>
            </div>
            <div className="flex justify-between text-zinc-300">
              <span>Match Date:</span>
              <strong className="text-white">{selectedDate}</strong>
            </div>
            <div className="flex justify-between text-zinc-300">
              <span>Timing:</span>
              <strong className="text-amber-400">
                {isFullDayActive 
                  ? '06:00 AM – 01:00 AM (Full Day Pass)' 
                  : chosenSlots.map(s => s.displayTime).join(', ')
                }
              </strong>
            </div>
            <div className="flex justify-between text-zinc-300 pt-2 border-t border-[#172e1e]">
              <span className="font-bold">Total Turf Fee:</span>
              <strong className="text-emerald-400 font-black text-base">₹{totalAmount}</strong>
            </div>
          </div>

          {/* Full Day Turf Booking Option */}
          {!isFullDayAlready && (
            <div 
              onClick={() => setIsFullDayUpgrade(!isFullDayUpgrade)}
              className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                isFullDayUpgrade
                  ? 'bg-[#102416] border-emerald-400 shadow-md'
                  : 'bg-[#09140d] border-[#1c3824] hover:border-emerald-500/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center justify-center font-bold text-base">
                  🏆
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white text-xs">Full Day Turf Booking</span>
                    <span className="text-[9px] bg-amber-400 text-black px-1.5 py-0.2 rounded font-bold uppercase">
                      Tournament Package
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Book all 19 hours (06:00 AM to 01:00 AM) for flat ₹{fullDayPackageRate}
                  </p>
                </div>
              </div>

              <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                isFullDayUpgrade ? 'bg-emerald-500 border-emerald-400 text-black' : 'border-[#234b2e] bg-[#0c1810]'
              }`}>
                {isFullDayUpgrade && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>
          )}

          {/* Captain Contact Information */}
          <div className="space-y-3 pt-1 border-t border-[#172c1c]">
            <span className="text-xs text-emerald-400 uppercase tracking-wider font-bold block">
              Captain & Team Details
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-zinc-300 font-bold block mb-1">Captain Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={captainName}
                  onChange={e => {
                    setCaptainName(e.target.value);
                    if (errors.captainName) setErrors({ ...errors, captainName: '' });
                  }}
                  className={`w-full px-3 py-2.5 rounded-xl bg-[#09140d] border text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400 ${
                    errors.captainName ? 'border-red-500' : 'border-[#1f3d28]'
                  }`}
                />
                {errors.captainName && (
                  <span className="text-[10px] text-red-400 mt-1 block">{errors.captainName}</span>
                )}
              </div>

              <div>
                <label className="text-zinc-300 font-bold block mb-1">WhatsApp Mobile *</label>
                <input
                  type="tel"
                  placeholder="e.g. 98201 88492"
                  value={captainPhone}
                  onChange={e => {
                    setCaptainPhone(e.target.value);
                    if (errors.captainPhone) setErrors({ ...errors, captainPhone: '' });
                  }}
                  className={`w-full px-3 py-2.5 rounded-xl bg-[#09140d] border text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400 ${
                    errors.captainPhone ? 'border-red-500' : 'border-[#1f3d28]'
                  }`}
                />
                {errors.captainPhone && (
                  <span className="text-[10px] text-red-400 mt-1 block">{errors.captainPhone}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-zinc-300 font-bold block mb-1">Team / Squad Name</label>
                <input
                  type="text"
                  placeholder="e.g. Red Devils FC"
                  value={teamName}
                  onChange={e => setTeamName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#09140d] border border-[#1f3d28] text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-zinc-300 font-bold block mb-1">Special Match Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Playing with tennis ball"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#09140d] border border-[#1f3d28] text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>
          </div>

          {/* Direct 0% Commission UPI Payment Plan */}
          <div className="space-y-3 pt-2 border-t border-[#172c1c]">
            <div className="flex items-center justify-between">
              <span className="text-xs text-emerald-400 uppercase tracking-wider font-bold block">
                Choose Payment Option
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">0% Gateway Fee (Direct Bank Transfer)</span>
            </div>

            {/* Payment Choice Pills */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentPlan('upi_direct')}
                className={`p-3 rounded-2xl border-2 text-left transition-all ${
                  paymentPlan === 'upi_direct'
                    ? 'bg-[#102416] border-emerald-400 text-white shadow-md'
                    : 'bg-[#09140d] border-[#1c3824] text-zinc-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-[11px] uppercase">Direct UPI</span>
                  {paymentPlan === 'upi_direct' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <div className="text-emerald-400 font-black text-sm">₹{totalAmount}</div>
                <span className="text-[9px] text-zinc-400 block mt-0.5">100% Full Pay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentPlan('advance_token')}
                className={`p-3 rounded-2xl border-2 text-left transition-all ${
                  paymentPlan === 'advance_token'
                    ? 'bg-[#102416] border-emerald-400 text-white shadow-md'
                    : 'bg-[#09140d] border-[#1c3824] text-zinc-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-[11px] uppercase">Token Advance</span>
                  {paymentPlan === 'advance_token' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <div className="text-emerald-400 font-black text-sm">₹{calculatedAdvance}</div>
                <span className="text-[9px] text-zinc-400 block mt-0.5">30% to Lock Slot</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentPlan('pay_at_venue')}
                className={`p-3 rounded-2xl border-2 text-left transition-all ${
                  paymentPlan === 'pay_at_venue'
                    ? 'bg-[#102416] border-emerald-400 text-white shadow-md'
                    : 'bg-[#09140d] border-[#1c3824] text-zinc-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-[11px] uppercase">Pay at Turf</span>
                  {paymentPlan === 'pay_at_venue' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <div className="text-zinc-200 font-black text-sm">₹0 Now</div>
                <span className="text-[9px] text-zinc-400 block mt-0.5">Cash on Arrival</span>
              </button>
            </div>

            {/* Direct UPI Box with Live QR + Copy UPI ID + UTR Input */}
            {(paymentPlan === 'upi_direct' || paymentPlan === 'advance_token') && (
              <div className="p-4 rounded-2xl bg-[#09140d] border-2 border-emerald-500/50 space-y-3.5 shadow-inner">
                
                <div className="flex items-center justify-between border-b border-[#1b3823] pb-2">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-emerald-400" />
                    <span className="font-extrabold text-white text-xs uppercase">
                      Scan UPI QR or Copy UPI ID
                    </span>
                  </div>
                  <span className="text-emerald-400 font-black text-sm">
                    Pay ₹{amountToPayNow}
                  </span>
                </div>

                {/* QR Display + UPI ID Details */}
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#070f09] p-3 rounded-xl border border-[#172c1c]">
                  
                  {/* Clean Dynamic UPI QR Code */}
                  <div className="p-2 bg-white rounded-xl shadow-md border-2 border-emerald-400/80 shrink-0">
                    <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none">
                      <rect width="100" height="100" fill="white" />
                      <rect x="8" y="8" width="28" height="28" fill="black" />
                      <rect x="12" y="12" width="20" height="20" fill="white" />
                      <rect x="16" y="16" width="12" height="12" fill="black" />
                      
                      <rect x="64" y="8" width="28" height="28" fill="black" />
                      <rect x="68" y="12" width="20" height="20" fill="white" />
                      <rect x="72" y="16" width="12" height="12" fill="black" />

                      <rect x="8" y="64" width="28" height="28" fill="black" />
                      <rect x="12" y="68" width="20" height="20" fill="white" />
                      <rect x="16" y="72" width="12" height="12" fill="black" />

                      {/* Random aesthetic QR modules */}
                      <rect x="42" y="15" width="8" height="8" fill="black" />
                      <rect x="42" y="32" width="16" height="8" fill="black" />
                      <rect x="42" y="48" width="8" height="16" fill="black" />
                      <rect x="60" y="48" width="12" height="8" fill="black" />
                      <rect x="25" y="42" width="8" height="12" fill="black" />
                      <rect x="75" y="60" width="8" height="16" fill="black" />
                      <rect x="65" y="78" width="16" height="8" fill="black" />
                      <rect x="45" y="75" width="8" height="8" fill="black" />
                    </svg>
                  </div>

                  {/* UPI Details & 1-Click Copy */}
                  <div className="space-y-1.5 w-full">
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">
                      Pay to Official Turf Account:
                    </span>
                    <strong className="text-white text-xs block font-bold">
                      {settings.turfName}
                    </strong>
                    
                    <div className="flex items-center justify-between p-2 rounded-lg bg-[#0e2216] border border-[#1f452b] text-[11px]">
                      <span className="text-emerald-300 font-bold font-mono">
                        {settings.upiId || 'battlegroundsturf@icici'}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyUpiId}
                        className="flex items-center gap-1 text-[10px] text-emerald-400 hover:text-white font-bold ml-2 bg-[#14301f] px-2 py-0.5 rounded border border-[#235332]"
                      >
                        {copiedUpi ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <a
                      href={upiIntentUri}
                      className="inline-flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-[11px] font-bold sm:hidden"
                    >
                      <span>⚡ Open in PhonePe / GPay / Paytm</span>
                    </a>
                  </div>
                </div>

                {/* 12-Digit UTR Input */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-white font-bold text-xs">
                      Enter 12-Digit UPI UTR / Ref No *
                    </label>
                    <span className="text-[10px] text-zinc-400 font-mono">From GPay/PhonePe receipt</span>
                  </div>

                  <input
                    type="text"
                    required
                    maxLength={16}
                    placeholder="e.g. 430982716352"
                    value={upiUtr}
                    onChange={e => {
                      setUpiUtr(e.target.value);
                      if (errors.upiUtr) setErrors({ ...errors, upiUtr: '' });
                    }}
                    className={`w-full px-3 py-2.5 rounded-xl bg-[#070f09] border text-white font-mono text-sm tracking-wider placeholder-zinc-600 focus:outline-none focus:border-emerald-400 ${
                      errors.upiUtr ? 'border-red-500' : 'border-[#1f3d28]'
                    }`}
                  />
                  {errors.upiUtr && (
                    <span className="text-[10px] text-red-400 mt-1 block">{errors.upiUtr}</span>
                  )}

                  <p className="text-[10px] text-zinc-400 pt-1 leading-relaxed">
                    💡 <strong>Owner Verification:</strong> Once you submit, the owner directly matches this UTR number with their PhonePe/GPay bank notification. No gateway fee deducted!
                  </p>
                </div>

              </div>
            )}

            {paymentPlan === 'pay_at_venue' && (
              <div className="p-3.5 rounded-2xl bg-[#09140d] border border-[#1b3823] text-xs text-zinc-300 space-y-1">
                <span className="text-amber-400 font-bold block text-xs">Pay on Arrival at Reception Counter</span>
                <p className="text-[11px] text-zinc-400">
                  Your slot is reserved. Please arrive 15 minutes before kick-off and settle ₹{totalAmount} via Cash or QR at the turf gate.
                </p>
              </div>
            )}

          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#172c1c]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-[#122417] text-zinc-300 hover:text-white font-bold transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isProcessing}
              onClick={handleSubmitBooking}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-300 hover:to-green-400 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all"
            >
              <span>{isProcessing ? 'Confirming...' : 'Confirm Booking & Get Pass'}</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
