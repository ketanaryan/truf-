import React, { useState } from 'react';
import { 
  Calendar, 
  Users, 
  Star, 
  Sun, 
  Zap, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2, 
  Sparkles,
  Eye,
  Layers
} from 'lucide-react';
import { Pitch } from '../../types';
import { PitchVisualizer } from './PitchVisualizer';

interface HeroBannerProps {
  onScrollToSlots: () => void;
  onOpenMatchFinder: () => void;
  pitches: Pitch[];
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onScrollToSlots,
  onOpenMatchFinder,
  pitches
}) => {
  const [selectedPitchIdx, setSelectedPitchIdx] = useState(0);
  const [showPitchModal, setShowPitchModal] = useState(false);
  const currentPitch = pitches[selectedPitchIdx] || pitches[0];

  return (
    <section className="relative turf-stadium-bg pt-6 sm:pt-8 pb-10 sm:pb-12 border-b border-[#183020]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Top Badges Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0c1810] border border-[#1f3b26] text-zinc-200 shadow-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-white uppercase tracking-wider text-[11px]">BATTLEGROUNDS ARENA</span>
            <span className="text-zinc-600">•</span>
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>4.9</span>
              <span className="text-zinc-400 font-normal hidden xs:inline">(1,480+ player matches)</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-zinc-400">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0c1810] border border-[#1f3b26]">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-zinc-200">24°C Dry Turf</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0c1810] border border-[#1f3b26]">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-zinc-200">500-Lux Broadcast LEDs</span>
            </div>
          </div>
        </div>

        {/* Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Headlines & Instant Booking Trigger */}
          <div className="lg:col-span-7 space-y-5">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 font-mono text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Instant Slot Confirmation • 0 Booking Fee</span>
              </span>
              
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-white uppercase italic leading-[1.06]">
                PLAY UNDER THE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-300 to-amber-300 underline decoration-emerald-500/40">
                  FLOODLIGHTS.
                </span>
              </h1>

              <p className="text-zinc-300 text-sm sm:text-base max-w-xl font-normal leading-relaxed">
                Book premium artificial turf slots at <strong className="text-white font-semibold">Battlegrounds Arena</strong>. 
                Dual FIFA-certified pitches, 500-lux broadcast floodlights, 
                high ceiling derby ball nets, and instant digital gate passes.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
              <button
                onClick={onScrollToSlots}
                className="flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 hover:from-emerald-300 hover:to-green-300 text-black font-extrabold text-sm uppercase tracking-wider font-mono shadow-xl shadow-emerald-950/70 transition-all duration-200 active:scale-95 group"
              >
                <Calendar className="w-4 h-4 stroke-[2.5]" />
                <span>Book a Slot Now</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onOpenMatchFinder}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#0e1d13] hover:bg-[#162c1d] border border-[#213f29] hover:border-emerald-500/40 text-white font-bold text-sm uppercase tracking-wider font-mono transition-all active:scale-95"
              >
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Find Players (Battle Board)</span>
              </button>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-[#183020] text-xs font-mono text-zinc-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Waterlogging</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Floodlights Included</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Advance Token or Turf Pay</span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Venue & Pitch Showcase Card */}
          <div className="lg:col-span-5">
            <div className="p-5 sm:p-6 rounded-3xl bg-[#0c1810] border-2 border-[#1f3d28] shadow-2xl space-y-4">
              
              {/* Pitch Switcher Tabs */}
              <div className="flex bg-[#070f09] p-1.5 rounded-2xl border border-[#1a3522]">
                {pitches.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPitchIdx(idx)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold font-mono transition-all duration-200 active:scale-95 ${
                      selectedPitchIdx === idx
                        ? 'bg-gradient-to-r from-emerald-400 to-green-500 text-black shadow-md font-extrabold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {idx === 0 ? 'Pitch A • 7v7 Arena' : 'Pitch B • 5v5 Court'}
                  </button>
                ))}
              </div>

              {/* Pitch Information Box */}
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block">
                      {currentPitch.id === 'pitch-1' ? 'PITCH A • 7v7 & CRICKET' : 'PITCH B • 5v5 & PICKLEBALL'}
                    </span>
                    <h3 className="text-xl font-extrabold text-white mt-0.5">{currentPitch.name}</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">{currentPitch.subtitle}</p>
                  </div>

                  <span className="px-2.5 py-1 rounded-lg bg-[#14281a] border border-[#204029] text-emerald-300 font-mono text-[11px] font-bold">
                    {currentPitch.dimensions}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-[#070f09] border border-[#172e1e]">
                    <span className="text-zinc-500 text-[10px] uppercase block">Surface</span>
                    <span className="text-white font-bold text-[11px] truncate block">{currentPitch.surface}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#070f09] border border-[#172e1e]">
                    <span className="text-zinc-500 text-[10px] uppercase block">Lighting</span>
                    <span className="text-amber-300 font-bold text-[11px] truncate block">{currentPitch.lighting.split('(')[0]}</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#08120b] border border-[#183622] flex items-center justify-between font-mono text-xs">
                  <div>
                    <span className="text-[10px] uppercase text-zinc-400 block">Slot Fee:</span>
                    <span className="text-emerald-400 font-black text-sm">
                      ₹{currentPitch.baseWeekdayPrice} – ₹{currentPitch.peakHourWeekendPrice} <span className="text-xs text-zinc-500 font-normal">/ hour</span>
                    </span>
                  </div>

                  <button
                    onClick={() => setShowPitchModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#122417] hover:bg-emerald-500 hover:text-black border border-[#21422a] text-emerald-300 text-xs font-bold transition-all active:scale-95"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Field 2D</span>
                  </button>
                </div>
              </div>

              {/* Direct Booking CTA */}
              <button
                onClick={onScrollToSlots}
                className="w-full py-3 rounded-xl bg-[#13281a] hover:bg-[#1a3824] border border-[#22482e] hover:border-emerald-500/50 text-emerald-300 hover:text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
              >
                <span>Select Date & Time Slots Below</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

            </div>
          </div>

        </div>

      </div>

      {/* 2D Pitch Modal Preview (Clean Popup on demand instead of cluttering screen) */}
      {showPitchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0c1810] border-2 border-[#1f3d28] rounded-3xl w-full max-w-xl p-5 sm:p-6 shadow-2xl relative space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#1b3623] pb-3">
              <div>
                <h3 className="text-base font-extrabold text-white uppercase font-mono tracking-wider">
                  {currentPitch.name} • 2D Field Diagram
                </h3>
                <p className="text-xs text-zinc-400 font-mono">
                  {currentPitch.dimensions} • {currentPitch.surface}
                </p>
              </div>
              <button
                onClick={() => setShowPitchModal(false)}
                className="px-3 py-1 rounded-xl bg-[#122417] hover:bg-[#183522] text-zinc-300 hover:text-white text-xs font-mono font-bold border border-[#204229]"
              >
                Close ✕
              </button>
            </div>

            <PitchVisualizer pitch={currentPitch} sport={currentPitch.sports[0]} />

            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pt-1">
              <span>Goalposts, referee dugouts, boundary safety nets included</span>
              <button
                onClick={() => {
                  setShowPitchModal(false);
                  onScrollToSlots();
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-green-500 text-black font-extrabold uppercase"
              >
                Book This Pitch →
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
