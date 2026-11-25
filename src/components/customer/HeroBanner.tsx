import React, { useState } from 'react';
import { 
  Calendar, 
  Users, 
  Star, 
  Sun, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Eye,
  MapPin,
  Clock,
  ShieldCheck,
  Award
} from 'lucide-react';
import { Pitch } from '../../types';
import { PitchVisualizer } from './PitchVisualizer';

interface HeroBannerProps {
  onScrollToSlots: () => void;
  onOpenMatchFinder: () => void;
  pitches: Pitch[];
  onSelectPitch?: (pitchId: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onScrollToSlots,
  onOpenMatchFinder,
  pitches,
  onSelectPitch
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
              <span className="text-zinc-400 font-normal hidden xs:inline">(1,480+ player ratings)</span>
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
          
          {/* Left Column: Headlines, Avatars & Instant Booking */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3.5">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 font-mono text-xs font-bold uppercase tracking-wider shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>PREMIER MULTI-SPORT ARENA • DUAL FLOODLIT COURTS</span>
              </span>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-white uppercase italic leading-[1.05]">
                PLAY UNDER THE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-300 to-amber-300 underline decoration-emerald-500/40">
                  FLOODLIGHTS.
                </span>
              </h1>

              <p className="text-zinc-300 text-sm sm:text-base max-w-xl font-normal leading-relaxed">
                Experience international-grade artificial turf at <strong className="text-white font-semibold">Battlegrounds Arena</strong>. 
                Dual FIFA-certified pitches, 500-lux anti-glare floodlights, zero waterlogging, and seamless 0% gateway fee UPI reservations.
              </p>
            </div>

            {/* Hatrick Grounds Inspired Social Proof Cluster */}
            <div className="flex items-center gap-3 py-1">
              <div className="flex -space-x-2.5 overflow-hidden">
                <img 
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-[#0c1810] object-cover" 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80" 
                  alt="Player avatar"
                />
                <img 
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-[#0c1810] object-cover" 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80" 
                  alt="Player avatar"
                />
                <img 
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-[#0c1810] object-cover" 
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80" 
                  alt="Player avatar"
                />
              </div>
              <div className="text-xs font-mono">
                <span className="text-white font-bold block">Visited by 2,400+ captains & squads</span>
                <span className="text-emerald-400 text-[11px]">★★★★★ 4.9 Verified Arena Rating</span>
              </div>
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

          {/* Right Column: Hatrick Grounds Inspired Showcase Ground Card */}
          <div className="lg:col-span-5">
            <div className="p-4 sm:p-5 rounded-3xl bg-[#0c1810] border-2 border-[#1f3d28] shadow-2xl space-y-4">
              
              {/* Pitch Switcher Tabs */}
              <div className="flex bg-[#070f09] p-1.5 rounded-2xl border border-[#1a3522]">
                {pitches.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedPitchIdx(idx);
                      onSelectPitch?.(p.id);
                    }}
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

              {/* Real Full-Bleed Ground Photo Banner (Inspired by Hatrick Grounds) */}
              <div className="relative rounded-2xl overflow-hidden h-44 sm:h-48 border border-[#1f3d28] group bg-[#0d2215] bg-gradient-to-br from-[#122c1b] to-[#07130b]">
                <img 
                  src={currentPitch.image} 
                  alt={currentPitch.name} 
                  onError={(e) => {
                    // Clean graceful fallback if external CDN image is blocked
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                {/* Athletic Pitch markings graphic fallback */}
                <div className="absolute inset-0 pointer-events-none opacity-25 flex items-center justify-center">
                  <div className="w-28 h-28 rounded-full border-2 border-emerald-400/50 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                  </div>
                  <div className="absolute inset-x-0 h-0.5 bg-emerald-400/50"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent flex flex-col justify-between p-3.5 font-mono">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-black font-extrabold text-[10px] tracking-wider uppercase shadow">
                      {currentPitch.id === 'pitch-1' ? 'MAIN ARENA' : 'PRO CAGE'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold">
                      📍 {currentPitch.dimensions}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tight">{currentPitch.name}</h3>
                    <p className="text-xs text-emerald-300 font-semibold">{currentPitch.subtitle}</p>
                  </div>
                </div>
              </div>

              {/* Hatrick Grounds Inspired Split Day / Night Pricing Box */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-3 rounded-2xl bg-[#08120b] border border-[#1b3623] space-y-0.5">
                  <span className="text-[10px] uppercase text-zinc-400 flex items-center gap-1">
                    <Sun className="w-3 h-3 text-amber-400" />
                    <span>Day Rate (6 AM - 5 PM)</span>
                  </span>
                  <div className="text-emerald-400 font-black text-base">
                    ₹{currentPitch.baseWeekdayPrice} <span className="text-[10px] text-zinc-500 font-normal">/ hr</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#08120b] border border-amber-500/30 space-y-0.5">
                  <span className="text-[10px] uppercase text-amber-300 flex items-center gap-1 font-bold">
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>Night Lights (5 PM+)</span>
                  </span>
                  <div className="text-amber-400 font-black text-base">
                    ₹{currentPitch.peakHourWeekdayPrice} <span className="text-[10px] text-zinc-500 font-normal">/ hr</span>
                  </div>
                </div>
              </div>

              {/* Compact Amenities Pills (Hatrick Grounds Style) */}
              <div className="flex flex-wrap gap-1.5 text-[10px] font-mono text-zinc-300">
                <span className="px-2 py-1 rounded-lg bg-[#070e0a] border border-[#183621]">⚡ 500-Lux LEDs</span>
                <span className="px-2 py-1 rounded-lg bg-[#070e0a] border border-[#183621]">⚽ 50mm Grass</span>
                <span className="px-2 py-1 rounded-lg bg-[#070e0a] border border-[#183621]">🚿 Changing Rooms</span>
                <span className="px-2 py-1 rounded-lg bg-[#070e0a] border border-[#183621]">🚰 Chilled RO</span>
                <span className="px-2 py-1 rounded-lg bg-[#070e0a] border border-[#183621]">🚗 Free Parking</span>
                <button
                  type="button"
                  onClick={() => setShowPitchModal(true)}
                  className="px-2 py-1 rounded-lg bg-[#14291a] text-emerald-300 hover:text-white border border-[#21442a] font-bold"
                >
                  👁️ 2D Layout
                </button>
              </div>

              {/* Direct Booking CTA */}
              <button
                onClick={() => {
                  onSelectPitch?.(currentPitch.id);
                  onScrollToSlots();
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-300 hover:to-green-400 text-black font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
              >
                <span>Book {currentPitch.name} Now</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
              </button>

            </div>
          </div>

        </div>

      </div>

      {/* 2D Pitch Modal Preview */}
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
                  onSelectPitch?.(currentPitch.id);
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
