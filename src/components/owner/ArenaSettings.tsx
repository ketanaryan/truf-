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
  ShieldCheck
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
  const [pitchPricing, setPitchPricing] = useState<{ [id: string]: Partial<Pitch> }>({
    [pitches[0].id]: { ...pitches[0] },
    [pitches[1].id]: { ...pitches[1] }
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

  return (
    <form onSubmit={handleSaveAll} className="space-y-6 text-xs font-mono">
      
      {/* Action Header */}
      <div className="p-5 rounded-3xl bg-[#0c1810] border-2 border-[#1f3d28] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-extrabold uppercase text-white tracking-wider">
              Pricing Engine & Operational Rules
            </h3>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Configure hourly rates, floodlight peak periods, deposit policies, and venue info.
          </p>
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-300 hover:to-green-400 text-black font-extrabold uppercase tracking-wider text-xs shadow-lg active:scale-95 transition-all"
        >
          <Save className="w-4 h-4 stroke-[2.5]" />
          <span>Save Arena Rules</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-[#0e2417] border-2 border-emerald-400/80 text-emerald-200 flex items-center gap-2.5 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-bold">Settings saved! New rates and rules are immediately live on the player booking portal.</span>
        </div>
      )}

      {/* Emergency Weather Hold */}
      <div className="p-5 rounded-3xl bg-[#0c1810] border-2 border-[#1f3d28] flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
            formData.isRainHalted ? 'bg-amber-400/20 text-amber-300' : 'bg-[#122417] text-emerald-400'
          }`}>
            <CloudRain className="w-6 h-6" />
          </div>
          <div>
            <span className="text-sm font-extrabold text-white uppercase block">
              Emergency Weather / Monsoon Rain Hold
            </span>
            <p className="text-zinc-400 text-xs">
              When toggled ON, all open slots across all pitches show as "Rain Hold / Wet Turf Warning" and prevent new player bookings.
            </p>
          </div>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isRainHalted}
            onChange={e => setFormData({ ...formData, isRainHalted: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-[#162e1e] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-400"></div>
        </label>
      </div>

      {/* Pitch Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {pitches.map(pitch => {
          const currentData = pitchPricing[pitch.id] || pitch;
          return (
            <div 
              key={pitch.id} 
              className="p-6 rounded-3xl bg-[#0c1810] border-2 border-[#1f3d28] space-y-4 shadow-xl"
            >
              <div className="border-b border-[#1b3623] pb-3 flex justify-between items-center">
                <div>
                  <span className="text-sm font-extrabold text-white uppercase block">{pitch.name}</span>
                  <span className="text-xs text-emerald-400 font-bold">{pitch.dimensions} • {pitch.surface}</span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-[#122417] border border-[#204029] text-zinc-300 text-[10px] font-bold">
                  {pitch.sports.join(' / ')}
                </span>
              </div>

              {/* Base Prices */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Weekday Base (₹/hr)</label>
                  <input
                    type="number"
                    value={currentData.baseWeekdayPrice || pitch.baseWeekdayPrice}
                    onChange={e => handlePitchFieldChange(pitch.id, 'baseWeekdayPrice', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#09140d] border border-[#204229] text-white font-extrabold text-sm focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Weekend Base (₹/hr)</label>
                  <input
                    type="number"
                    value={currentData.baseWeekendPrice || pitch.baseWeekendPrice}
                    onChange={e => handlePitchFieldChange(pitch.id, 'baseWeekendPrice', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#09140d] border border-[#204229] text-white font-extrabold text-sm focus:border-emerald-400"
                  />
                </div>
              </div>

              {/* Peak Floodlight Prices */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#162b1d]">
                <div>
                  <label className="text-amber-400/90 block mb-1 font-bold">Weekday Floodlit (₹/hr)</label>
                  <input
                    type="number"
                    value={currentData.peakHourWeekdayPrice || pitch.peakHourWeekdayPrice}
                    onChange={e => handlePitchFieldChange(pitch.id, 'peakHourWeekdayPrice', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#09140d] border border-amber-500/40 text-amber-300 font-extrabold text-sm focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-amber-400/90 block mb-1 font-bold">Weekend Floodlit (₹/hr)</label>
                  <input
                    type="number"
                    value={currentData.peakHourWeekendPrice || pitch.peakHourWeekendPrice}
                    onChange={e => handlePitchFieldChange(pitch.id, 'peakHourWeekendPrice', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#09140d] border border-amber-500/40 text-amber-300 font-extrabold text-sm focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Direct UPI & Settlement Details (0% Gateway Commission) */}
      <div className="p-6 rounded-3xl bg-[#0c1810] border-2 border-[#1f3d28] space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#1b3623] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#14281a] border border-[#234d2e] text-emerald-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-extrabold text-white uppercase block">
                Direct UPI & Instant QR Settlement
              </span>
              <span className="text-[11px] text-zinc-400">
                0% Gateway Fees • Direct Bank Credit via PhonePe / GPay / BHIM
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
            Zero Commission P2M
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-zinc-300 block mb-1 font-bold">
              Turf UPI ID (VPA) <span className="text-emerald-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. battlegroundsturf@icici or 9820477123@okaxis"
              value={formData.upiId || ''}
              onChange={e => setFormData({ ...formData, upiId: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#09140d] border border-[#204229] text-white font-mono text-xs focus:border-emerald-400"
              required
            />
            <span className="text-[10px] text-zinc-500 mt-1 block">
              Players scan this QR or copy this UPI ID to pay via Google Pay, PhonePe, or Paytm.
            </span>
          </div>

          <div>
            <label className="text-zinc-300 block mb-1 font-bold">
              UPI Payee / Account Name <span className="text-emerald-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Battlegrounds Arena"
              value={formData.upiPayeeName || ''}
              onChange={e => setFormData({ ...formData, upiPayeeName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#09140d] border border-[#204229] text-white font-mono text-xs focus:border-emerald-400"
              required
            />
            <span className="text-[10px] text-zinc-500 mt-1 block">
              The merchant or legal name shown on the player's UPI payment app.
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#08120b] border border-[#1b3623] flex items-start gap-3 text-xs text-zinc-400">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-white font-bold block text-[11px]">How Direct UPI Works without Payment Gateway Cuts:</span>
            <p className="text-[10px] leading-relaxed text-zinc-400">
              When a player books a slot online, they scan your arena's UPI QR code and enter their 12-digit UPI UTR transaction reference number from their payment receipt. You'll receive a push alert on your Owner Desk to cross-check the UTR with your bank app SMS / PhonePe Business notification and approve it in 1 click. No Razorpay 2.36% fee deducted!
            </p>
          </div>
        </div>
      </div>

      {/* Operating Timing & Token Policy */}
      <div className="p-6 rounded-3xl bg-[#0c1810] border-2 border-[#1f3d28] space-y-4 shadow-xl">
        <span className="text-sm font-extrabold text-white uppercase block border-b border-[#1b3623] pb-3">
          Arena Operating Hours & Deposit Token
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-zinc-400 block mb-1 font-bold">Floodlights Start Time</label>
            <input
              type="time"
              value={formData.peakHourStart}
              onChange={e => setFormData({ ...formData, peakHourStart: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#09140d] border border-[#204229] text-white"
            />
          </div>

          <div>
            <label className="text-zinc-400 block mb-1 font-bold">Floodlights End Time</label>
            <input
              type="time"
              value={formData.peakHourEnd}
              onChange={e => setFormData({ ...formData, peakHourEnd: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#09140d] border border-[#204229] text-white"
            />
          </div>

          <div>
            <label className="text-zinc-400 block mb-1 font-bold">Advance Deposit Token (%)</label>
            <input
              type="number"
              min="10"
              max="100"
              value={formData.advanceDepositPercentage}
              onChange={e => setFormData({ ...formData, advanceDepositPercentage: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl bg-[#09140d] border border-[#204229] text-emerald-400 font-bold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-[#172c1c]">
          <div>
            <label className="text-zinc-400 block mb-1 font-bold">Reception Hotline</label>
            <input
              type="text"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#09140d] border border-[#204229] text-white"
            />
          </div>

          <div>
            <label className="text-zinc-400 block mb-1 font-bold">WhatsApp Hotline</label>
            <input
              type="text"
              value={formData.whatsapp}
              onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#09140d] border border-[#204229] text-white"
            />
          </div>

          <div>
            <label className="text-zinc-400 block mb-1 font-bold">Arena Physical Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#09140d] border border-[#204229] text-white"
            />
          </div>
        </div>

      </div>

    </form>
  );
};
