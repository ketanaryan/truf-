import React, { useState } from 'react';
import { 
  Save, 
  CloudRain, 
  CheckCircle2, 
  Sliders, 
  Sparkles, 
  Sun, 
  Clock, 
  Percent,
  MapPin,
  PhoneCall,
  QrCode,
  ShieldCheck,
  Star,
  ExternalLink,
  DollarSign
} from 'lucide-react';
import { OwnerSettings, Pitch } from '../../types';

interface ArenaSettingsProps {
  settings: OwnerSettings;
  pitches: Pitch[];
  onSaveSettings: (settings: OwnerSettings) => void;
  onUpdatePitchPricing: (pitchId: string, updates: Partial<Pitch>) => void;
}

export const ArenaSettings: React.FC<ArenaSettingsProps> = ({
  settings,
  pitches,
  onSaveSettings,
  onUpdatePitchPricing
}) => {
  const [formData, setFormData] = useState<OwnerSettings>({ ...settings });
  const [pitchPricing, setPitchPricing] = useState<{ [id: string]: Partial<Pitch> }>(() => {
    const map: { [id: string]: Partial<Pitch> } = {};
    pitches.forEach(p => {
      map[p.id] = { ...p };
    });
    return map;
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    
    pitches.forEach(p => {
      if (pitchPricing[p.id]) {
        onUpdatePitchPricing(p.id, pitchPricing[p.id]);
      }
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handlePitchFieldChange = (pitchId: string, field: keyof Pitch, val: number) => {
    setPitchPricing(prev => ({
      ...prev,
      [pitchId]: {
        ...prev[pitchId],
        [field]: val
      }
    }));
  };

  const p1 = pitches[0];
  const p1Pricing = pitchPricing[p1?.id] || p1 || {};

  return (
    <form onSubmit={handleSaveAll} className="space-y-6 font-sans">
      
      {/* Action Header */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#FF6A00]" />
            <h3 className="text-base font-extrabold uppercase text-slate-900 tracking-wider">
              Pricing Engine & Operational Rules
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure hourly rates, floodlight peak periods, deposit policies, and venue info.
          </p>
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#FF6A00] hover:bg-[#E65F00] text-white font-extrabold uppercase tracking-wider text-xs shadow-md shadow-orange-500/20 active:scale-95 transition-all"
        >
          <Save className="w-4 h-4 stroke-[2.5]" />
          <span>Save Changes</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 flex items-center gap-2.5 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-bold text-xs">Settings saved! New rates and rules are immediately live on the player booking portal.</span>
        </div>
      )}

      {/* Emergency Weather Hold Toggle */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
            formData.isRainHalted ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
          }`}>
            <CloudRain className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm uppercase">
              Rain & Bad Weather Lockout
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Temporarily block all new customer reservations and show weather warning banner.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setFormData({ ...formData, isRainHalted: !formData.isRainHalted })}
          className={`px-5 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all shadow-sm ${
            formData.isRainHalted
              ? 'bg-amber-500 hover:bg-amber-400 text-white shadow-amber-500/30'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
          }`}
        >
          {formData.isRainHalted ? '🌧️ RAIN HOLD ACTIVE' : '☀️ CLEAR / NORMAL'}
        </button>
      </div>

      {/* Section 1: Dynamic Hourly Pricing Matrix */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <DollarSign className="w-5 h-5 text-emerald-600" />
          <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide">
            Dynamic Match Pricing Rules (Per Hour)
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <label className="text-[11px] font-bold text-slate-600 block uppercase">
              Weekday Day Rate (6 AM - 5 PM)
            </label>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-slate-400">₹</span>
              <input
                type="number"
                value={p1Pricing.baseWeekdayPrice ?? 600}
                onChange={e => p1 && handlePitchFieldChange(p1.id, 'baseWeekdayPrice', Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-bold text-sm text-slate-900 focus:outline-none focus:border-[#FF6A00]"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <label className="text-[11px] font-bold text-slate-600 block uppercase">
              Weekend Day Rate (Sat - Sun)
            </label>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-slate-400">₹</span>
              <input
                type="number"
                value={p1Pricing.baseWeekendPrice ?? 700}
                onChange={e => p1 && handlePitchFieldChange(p1.id, 'baseWeekendPrice', Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-bold text-sm text-slate-900 focus:outline-none focus:border-[#FF6A00]"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200 space-y-1.5">
            <label className="text-[11px] font-extrabold text-[#FF6A00] block uppercase">
              ⚡ Prime Floodlights Rate (5 PM+)
            </label>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-[#FF6A00]">₹</span>
              <input
                type="number"
                value={p1Pricing.peakHourWeekdayPrice ?? 800}
                onChange={e => p1 && handlePitchFieldChange(p1.id, 'peakHourWeekdayPrice', Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-white border border-orange-200 font-bold text-sm text-slate-900 focus:outline-none focus:border-[#FF6A00]"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-1.5">
            <label className="text-[11px] font-extrabold text-[#0D6EFD] block uppercase">
              🏆 Full Day Tournament Flat Fee
            </label>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-[#0D6EFD]">₹</span>
              <input
                type="number"
                value={p1Pricing.fullDayWeekdayPrice ?? 8000}
                onChange={e => p1 && handlePitchFieldChange(p1.id, 'fullDayWeekdayPrice', Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-white border border-blue-200 font-bold text-sm text-slate-900 focus:outline-none focus:border-[#0D6EFD]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Operating Hours & Deposit Terms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Operating Hours */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Clock className="w-4 h-4 text-[#00B6C8]" />
            <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide">
              Daily Operating Schedule
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-600 block mb-1 text-xs font-semibold">Opening Time</label>
              <input
                type="time"
                value={formData.openTime}
                onChange={e => setFormData({ ...formData, openTime: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="text-slate-600 block mb-1 text-xs font-semibold">Closing Time</label>
              <input
                type="time"
                value={formData.closeTime}
                onChange={e => setFormData({ ...formData, closeTime: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="text-slate-600 block mb-1 text-xs font-semibold">Peak Lights Start</label>
              <input
                type="time"
                value={formData.peakHourStart}
                onChange={e => setFormData({ ...formData, peakHourStart: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="text-slate-600 block mb-1 text-xs font-semibold">Peak Lights End</label>
              <input
                type="time"
                value={formData.peakHourEnd}
                onChange={e => setFormData({ ...formData, peakHourEnd: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Deposit & Cancellation Policies */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Percent className="w-4 h-4 text-emerald-600" />
            <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide">
              Token Deposit & Cancellation
            </h4>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-slate-600 block mb-1 text-xs font-semibold">
                Online Advance Token Deposit (%)
              </label>
              <input
                type="number"
                min="10"
                max="100"
                value={formData.advanceDepositPercentage}
                onChange={e => setFormData({ ...formData, advanceDepositPercentage: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="text-slate-600 block mb-1 text-xs font-semibold">
                Minimum Cancellation Notice (Hours before match)
              </label>
              <input
                type="number"
                min="1"
                max="48"
                value={formData.cancellationAllowedHours}
                onChange={e => setFormData({ ...formData, cancellationAllowedHours: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-xs text-slate-900"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Section 3: Official Venue Information & UPI Account */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <QrCode className="w-5 h-5 text-[#FF6A00]" />
          <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide">
            Direct UPI & Venue Reception Details
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-slate-600 block mb-1 text-xs font-semibold">
              Turf Name
            </label>
            <input
              type="text"
              value={formData.turfName}
              onChange={e => setFormData({ ...formData, turfName: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-xs text-slate-900"
              required
            />
          </div>

          <div>
            <label className="text-slate-600 block mb-1 text-xs font-semibold">
              Venue Physical Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
              required
            />
          </div>

          <div>
            <label className="text-slate-600 block mb-1 text-xs font-semibold">
              Official Desk Phone
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-900"
              required
            />
          </div>

          <div>
            <label className="text-slate-600 block mb-1 text-xs font-semibold">
              Turf Owner WhatsApp (For Instant Bookings)
            </label>
            <input
              type="text"
              value={formData.whatsapp}
              onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-900"
              required
            />
          </div>

          <div>
            <label className="text-slate-600 block mb-1 text-xs font-semibold">
              Direct UPI VPA ID (0% Fees)
            </label>
            <input
              type="text"
              value={formData.upiId}
              onChange={e => setFormData({ ...formData, upiId: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-[#0D6EFD] font-bold"
              required
            />
          </div>

          <div>
            <label className="text-slate-600 block mb-1 text-xs font-semibold">
              UPI Payee Account Name
            </label>
            <input
              type="text"
              value={formData.upiPayeeName}
              onChange={e => setFormData({ ...formData, upiPayeeName: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-semibold"
              required
            />
          </div>
        </div>
      </div>

    </form>
  );
};
