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
  AlertCircle,
  Camera,
  UploadCloud,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Pitch, Slot, SportType, Booking, OwnerSettings, PaymentMethod, PaymentStatus } from '../../types';
import { isWeekend, compressImageFile } from '../../data/storage';

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
  const [paymentScreenshot, setPaymentScreenshot] = useState<string | null>(null);
  const [screenshotFileName, setScreenshotFileName] = useState('');
  const [isCompressingImage, setIsCompressingImage] = useState(false);
  const [showOptionalUtr, setShowOptionalUtr] = useState(false);
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
    navigator.clipboard.writeText(settings.upiId || '9403564779@okaxis');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressingImage(true);
      setScreenshotFileName(file.name);
      const compressedDataUrl = await compressImageFile(file);
      setPaymentScreenshot(compressedDataUrl);
      setErrors(prev => {
        const next = { ...prev };
        delete next.paymentProof;
        return next;
      });
    } catch (err) {
      console.error('Failed to compress receipt image', err);
    } finally {
      setIsCompressingImage(false);
    }
  };

  const handleRemoveScreenshot = () => {
    setPaymentScreenshot(null);
    setScreenshotFileName('');
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
      if (!paymentScreenshot && !upiUtr.trim()) {
        err.paymentProof = 'Please upload a photo of your payment screenshot (or enter UTR number)';
      }
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmitBooking = () => {
    if (!validate()) return;
    setIsProcessing(true);

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

    const methodPayment: PaymentMethod = 
      paymentPlan === 'pay_at_venue' ? 'cash' : 'upi';

    const newBooking: Booking = {
      id: randomRef,
      bookingRef: randomRef,
      pitchId: currentPitch.id,
      pitchName: 'Box Cricket Turf',
      date: selectedDate,
      slotIds: isFullDayActive ? slots.map(s => s.id) : selectedSlotIds,
      timeRange,
      durationHours,
      sport: 'Box Cricket',
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
      paymentMethod: methodPayment,
      source: 'online',
      upiUtr: upiUtr.trim() || undefined,
      paymentScreenshot: paymentScreenshot || undefined,
      isUpiVerified: false,
      createdAt: new Date().toISOString(),
      isCheckedIn: false,
      status: 'confirmed'
    };



    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    setIsProcessing(false);
    onBookingConfirmed(newBooking);
  };

  const upiIntentUri = `upi://pay?pa=${encodeURIComponent(settings.upiId || '9403564779@okaxis')}&pn=${encodeURIComponent(settings.turfName || "Sonawane's Multi Sport Turf")}&am=${amountToPayNow}&tn=PassBooking&cu=INR`;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto font-body"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#1e2023] border border-white/15 rounded-3xl w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in-95 text-white text-xs">
        
        {/* Header (The Nova Club Deep Obsidian) */}
        <div className="sticky top-0 z-10 bg-[#111317] px-5 py-4 border-b border-white/10 flex items-center justify-between text-white">
          <div>
            <h3 className="text-base font-black uppercase tracking-wider text-white font-headline">
              Confirm Box Cricket Reservation
            </h3>
            <p className="text-xs text-orange-400 font-bold">
              Box Cricket Turf • 120 ft Rebound Cage
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5 bg-[#1e2023]">

          {/* Booking Summary Card */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
            <div className="flex justify-between text-neutral-400">
              <span>Arena:</span>
              <strong className="text-white font-bold">Box Cricket Turf (120 ft)</strong>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Match Date:</span>
              <strong className="text-white font-mono font-bold">{selectedDate}</strong>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Timing:</span>
              <strong className="text-amber-400 font-mono font-bold">
                {isFullDayActive 
                  ? '06:00 AM – 01:00 AM (Full Day Tournament Pass)' 
                  : chosenSlots.map(s => s.displayTime).join(', ')
                }
              </strong>
            </div>
            <div className="flex justify-between text-neutral-300 pt-2 border-t border-white/10 font-semibold">
              <span className="font-bold text-white">Total Turf Fee:</span>
              <strong className="text-[#ff7a00] font-black text-base">₹{totalAmount}</strong>
            </div>
          </div>

          {/* Captain Contact Information */}
          <div className="space-y-3 pt-1 border-t border-white/10">
            <span className="text-xs text-[#ff7a00] uppercase tracking-wider font-extrabold block font-headline">
              Captain & Team Details
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-neutral-300 font-bold block mb-1">Captain Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={captainName}
                  onChange={e => {
                    setCaptainName(e.target.value);
                    if (errors.captainName) setErrors({ ...errors, captainName: '' });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-white/5 border text-white placeholder-neutral-500 focus:outline-none focus:border-[#ff7a00] focus:bg-white/10 ${
                    errors.captainName ? 'border-red-500' : 'border-white/10'
                  }`}
                />
                {errors.captainName && (
                  <span className="text-[10px] text-red-400 font-semibold mt-1 block">{errors.captainName}</span>
                )}
              </div>

              <div>
                <label className="text-neutral-300 font-bold block mb-1">WhatsApp Mobile *</label>
                <input
                  type="tel"
                  placeholder="e.g. 98201 88492"
                  value={captainPhone}
                  onChange={e => {
                    setCaptainPhone(e.target.value);
                    if (errors.captainPhone) setErrors({ ...errors, captainPhone: '' });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-white/5 border text-white placeholder-neutral-500 focus:outline-none focus:border-[#ff7a00] focus:bg-white/10 ${
                    errors.captainPhone ? 'border-red-500' : 'border-white/10'
                  }`}
                />
                {errors.captainPhone && (
                  <span className="text-[10px] text-red-400 font-semibold mt-1 block">{errors.captainPhone}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-neutral-300 font-bold block mb-1">Team / Squad Name</label>
                <input
                  type="text"
                  placeholder="e.g. Gully Blasters CC"
                  value={teamName}
                  onChange={e => setTeamName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-[#ff7a00] focus:bg-white/10"
                />
              </div>

              <div>
                <label className="text-neutral-300 font-bold block mb-1">Special Match Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Vicky hard tennis ball match"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-[#ff7a00] focus:bg-white/10"
                />
              </div>
            </div>
          </div>

          {/* Direct 0% Commission UPI Payment Plan */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#ff7a00] uppercase tracking-wider font-extrabold block font-headline">
                Choose Payment Option
              </span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                0% Gateway Fee (Direct UPI)
              </span>
            </div>

            {/* Payment Choice Pills */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentPlan('upi_direct')}
                className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                  paymentPlan === 'upi_direct'
                    ? 'bg-[#ff7a00]/15 border-[#ff7a00] text-white shadow-[0_0_16px_rgba(255,122,0,0.2)]'
                    : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-[11px] uppercase">Direct UPI</span>
                  {paymentPlan === 'upi_direct' && <Check className="w-3.5 h-3.5 text-[#ff7a00]" />}
                </div>
                <div className="text-[#ff7a00] font-black text-sm">₹{totalAmount}</div>
                <span className="text-[9px] text-neutral-400 block mt-0.5 font-medium">100% Full Pay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentPlan('advance_token')}
                className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                  paymentPlan === 'advance_token'
                    ? 'bg-[#ff7a00]/15 border-[#ff7a00] text-white shadow-[0_0_16px_rgba(255,122,0,0.2)]'
                    : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-[11px] uppercase">Token Advance</span>
                  {paymentPlan === 'advance_token' && <Check className="w-3.5 h-3.5 text-[#ff7a00]" />}
                </div>
                <div className="text-amber-400 font-black text-sm">₹{calculatedAdvance}</div>
                <span className="text-[9px] text-neutral-400 block mt-0.5 font-medium">30% to Lock Slot</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentPlan('pay_at_venue')}
                className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                  paymentPlan === 'pay_at_venue'
                    ? 'bg-[#ff7a00]/15 border-[#ff7a00] text-white shadow-[0_0_16px_rgba(255,122,0,0.2)]'
                    : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-[11px] uppercase">Pay at Turf</span>
                  {paymentPlan === 'pay_at_venue' && <Check className="w-3.5 h-3.5 text-[#ff7a00]" />}
                </div>
                <div className="text-white font-black text-sm">₹0 Now</div>
                <span className="text-[9px] text-neutral-400 block mt-0.5 font-medium">Pay on Arrival</span>
              </button>
            </div>

            {/* Direct UPI Box with Live QR + Copy UPI ID + UTR Input */}
            {(paymentPlan === 'upi_direct' || paymentPlan === 'advance_token') && (
              <div className="p-4 rounded-2xl bg-white/5 border-2 border-orange-500/30 space-y-3.5">
                
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-[#ff7a00]" />
                    <span className="font-extrabold text-white text-xs uppercase font-headline">
                      Scan UPI QR or Copy UPI ID
                    </span>
                  </div>
                  <span className="text-[#ff7a00] font-black text-sm">
                    Pay ₹{amountToPayNow}
                  </span>
                </div>

                {/* QR Display + UPI ID Details */}
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-black/40 p-3.5 rounded-xl border border-white/10 shadow-sm">
                  
                  {/* Clean Dynamic UPI QR Code */}
                  <div className="p-2 bg-white rounded-xl shadow border border-slate-200 shrink-0">
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

                      {/* QR modules */}
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
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-semibold">
                      Pay to Official Turf Account:
                    </span>
                    <strong className="text-white text-xs block font-bold">
                      {settings.turfName}
                    </strong>
                    
                    <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10 text-[11px]">
                      <span className="text-orange-400 font-mono font-bold">
                        {settings.upiId || '9403564779@okaxis'}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyUpiId}
                        className="flex items-center gap-1 text-[10px] text-neutral-300 hover:text-white font-bold ml-2 bg-white/10 px-2 py-0.5 rounded-lg border border-white/10 shadow-sm cursor-pointer"
                      >
                        {copiedUpi ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <a
                      href={upiIntentUri}
                      className="inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-full bg-[#ff7a00] hover:bg-amber-600 text-white text-[11px] font-bold sm:hidden shadow-[0_4px_16px_rgba(255,122,0,0.3)]"
                    >
                      <span>⚡ Open in PhonePe / GPay / Paytm</span>
                    </a>
                  </div>
                </div>

                {/* Photo Upload for Payment Screenshot */}
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-neutral-200 font-bold text-xs flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-[#ff7a00]" />
                      <span>Upload Payment Screenshot / Receipt Photo *</span>
                    </label>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                      Simple 1-Step Proof
                    </span>
                  </div>

                  <input
                    type="file"
                    id="payment-screenshot-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {!paymentScreenshot ? (
                    <label
                      htmlFor="payment-screenshot-upload"
                      className={`p-4 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                        errors.paymentProof 
                          ? 'border-red-500 bg-red-500/10' 
                          : 'border-white/20 bg-white/5 hover:border-[#ff7a00] hover:bg-orange-500/10'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#ff7a00]">
                        {isCompressingImage ? (
                          <div className="w-6 h-6 border-2 border-[#ff7a00] border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <UploadCloud className="w-6 h-6 stroke-[2]" />
                        )}
                      </div>
                      <div className="text-center">
                        <span className="text-white text-xs font-bold block">
                          {isCompressingImage ? 'Processing receipt photo...' : 'Tap to Upload Payment Screenshot'}
                        </span>
                        <span className="text-[11px] text-neutral-400 block mt-0.5">
                          Attach receipt from Google Pay, PhonePe, Paytm, or BHIM
                        </span>
                      </div>
                    </label>
                  ) : (
                    <div className="p-3 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-between gap-3 shadow-sm">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <img
                          src={paymentScreenshot}
                          alt="Payment Proof Preview"
                          className="w-14 h-14 rounded-xl object-cover border border-emerald-500/40 shrink-0 shadow-sm"
                        />
                        <div className="overflow-hidden">
                          <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>Screenshot Attached ✓</span>
                          </div>
                          <span className="text-[11px] text-neutral-300 truncate block mt-0.5 font-medium">
                            {screenshotFileName || 'Payment receipt ready'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <label
                          htmlFor="payment-screenshot-upload"
                          className="px-2.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold cursor-pointer border border-white/10 shadow-sm"
                        >
                          Change
                        </label>
                        <button
                          type="button"
                          onClick={handleRemoveScreenshot}
                          className="p-1.5 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 cursor-pointer"
                          title="Remove screenshot"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {errors.paymentProof && (
                    <span className="text-[10px] text-red-400 font-bold block mt-1">{errors.paymentProof}</span>
                  )}

                  {/* Optional UTR Input Toggle */}
                  <div className="pt-1">
                    {!showOptionalUtr ? (
                      <button
                        type="button"
                        onClick={() => setShowOptionalUtr(true)}
                        className="text-[11px] text-neutral-400 hover:text-[#ff7a00] font-medium underline decoration-dotted transition-colors cursor-pointer"
                      >
                        + Add 12-digit UPI UTR or Transaction Ref (Optional)
                      </button>
                    ) : (
                      <div className="space-y-1 pt-1 animate-in fade-in">
                        <div className="flex items-center justify-between">
                          <label className="text-neutral-300 text-[11px] font-bold">
                            UPI Ref / UTR (Optional)
                          </label>
                          <button
                            type="button"
                            onClick={() => setShowOptionalUtr(false)}
                            className="text-[10px] text-neutral-500 hover:text-neutral-300 cursor-pointer"
                          >
                            Hide
                          </button>
                        </div>
                        <input
                          type="text"
                          maxLength={24}
                          placeholder="e.g. 430982716352 or GPay reference"
                          value={upiUtr}
                          onChange={e => setUpiUtr(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#ff7a00]"
                        />
                      </div>
                    )}
                  </div>

                  <p className="text-[10px] text-neutral-400 pt-1 leading-relaxed">
                    💡 <strong>Owner Verification:</strong> Once submitted, the turf owner reviews your receipt photo directly in their portal. Zero gateway transaction fee!
                  </p>
                </div>

              </div>
            )}

            {paymentPlan === 'pay_at_venue' && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 space-y-1">
                <span className="font-bold block text-xs">Pay on Arrival at Turf Reception</span>
                <p className="text-[11px] text-amber-300">
                  Your slot is reserved. Please arrive 15 minutes before match start and pay ₹{totalAmount} via Cash or UPI at the desk.
                </p>
              </div>
            )}

          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-white/10">
            <span className="text-[11px] text-neutral-400 font-medium">
              🎟️ Generates official match pass with scannable gate QR
            </span>

            <div className="flex items-center gap-2.5 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 font-bold transition-colors cursor-pointer border border-white/10"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleSubmitBooking}
                className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#ff7a00] to-amber-600 hover:from-amber-600 hover:to-[#ff7a00] text-white font-black text-xs uppercase tracking-wider shadow-[0_4px_16px_rgba(255,122,0,0.3)] active:scale-95 transition-all cursor-pointer"
              >
                <span>{isProcessing ? 'Confirming...' : 'Confirm Reservation & Get Pass →'}</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
