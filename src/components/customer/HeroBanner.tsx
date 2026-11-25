import React, { useState } from 'react';
import { 
  Calendar, 
  Users, 
  Sun, 
  Zap, 
  CheckCircle2, 
  ShieldCheck,
  Award
} from 'lucide-react';
import { Pitch } from '../../types';
import { PitchVisualizer } from './PitchVisualizer';
import { SpotlightCard, AnimatedCounter, SpringButton } from '../motion/MotionPrimitives';

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
  const [showPitchModal, setShowPitchModal] = useState(false);
  const currentPitch = pitches[0];

  return (
    <section className="relative bg-[#F2F4F7] pt-8 sm:pt-12 pb-12 sm:pb-16 border-b border-slate-200 overflow-hidden font-sans">
      
      {/* Ambient background glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF6A00]/8 rounded-full blur-3xl pointer-events-none -mr-40 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#00B6C8]/10 rounded-full blur-3xl pointer-events-none -ml-40 -mb-20"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Athletic Cricket Headline & Action Buttons */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            
            {/* Orange Tag Badge (Hatrick Grounds Style) */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-[#FF6A00]/30 text-[#E65F00] text-xs font-bold uppercase tracking-wider shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#FF6A00] animate-pulse"></span>
              <span>📍 RANE NAGAR / CHETANA NAGAR • NASHIK</span>
            </div>

            {/* Display Headline */}
            <div className="space-y-1">
              <h1 className="font-display font-black text-3xl xs:text-4xl sm:text-5xl lg:text-6xl text-[#111827] uppercase tracking-tight leading-[0.95] break-words">
                SONAWANE'S MULTI SPORT TURF
                <span className="block text-[#FF6A00] mt-1 text-2xl xs:text-3xl sm:text-4xl lg:text-5xl">CRICKET & FOOTBALL ARENA</span>
              </h1>
            </div>

            {/* Subtitle - Authentic Indian Box Cricket details without AI slop */}
            <p className="text-[#4B5563] text-sm sm:text-base leading-relaxed max-w-xl font-normal">
              Located at Plot No. 1, Sonawane Mala, Chetana Nagar, Rane Nagar, Nashik. 
              Open daily 6:00 AM – 11:00 PM with sports floodlights, high-density astroturf, and heavy-gauge ceiling net protection.
            </p>

            {/* Social Proof Cluster */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex -space-x-2.5 overflow-hidden">
                <img 
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover" 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" 
                  alt="Captain" 
                />
                <img 
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover" 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" 
                  alt="Captain" 
                />
                <img 
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover" 
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80" 
                  alt="Captain" 
                />
              </div>
              <div className="text-xs text-[#1F2937]">
                <div className="font-bold flex items-center gap-1.5">
                  <span>★ 4.0 / 5.0 (22 Google Reviews)</span>
                  <span className="text-[#FF6A00] font-bold">•</span>
                  <span className="text-emerald-700 font-semibold">Verified Venue</span>
                </div>
                <span className="text-[#6B7280]">Plot No. 1, Sonawane Mala, Nashik • Desk: +91 94035 64779</span>
              </div>
            </div>

            {/* Action Buttons (Hatrick Grounds Orange Theme with Motion Primitives) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <SpringButton
                onClick={onScrollToSlots}
                className="flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-[#FF6A00] hover:bg-[#E65F00] text-white font-extrabold text-sm uppercase tracking-wider shadow-xl shadow-orange-500/30 animate-glow-orange cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>BOOK A SLOT NOW →</span>
              </SpringButton>

              <SpringButton
                onClick={onOpenMatchFinder}
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 text-[#1F2937] font-bold text-sm border border-slate-300 shadow-sm cursor-pointer"
              >
                <Users className="w-4 h-4 text-[#FF6A00]" />
                <span>FIND PLAYERS (PLAYERS BOARD)</span>
              </SpringButton>
            </div>

            {/* Quick Feature Tickers */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-[#4B5563]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Wooden Stumps & Bails Included</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>High Ceiling Nets (Zero Lost Balls)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#FF6A00]" />
                <span>0% Gateway Fee Direct UPI</span>
              </span>
            </div>

          </div>

          {/* Right Column: Showcase Ground Card with Kokonut UI Spotlight */}
          <div className="lg:col-span-5">
            <SpotlightCard
              spotlightColor="rgba(255, 106, 0, 0.12)"
              className="bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-200/90 space-y-4 relative"
            >
              
              {/* Full-Bleed Ground Photo Banner */}
              <div className="relative rounded-2xl overflow-hidden h-48 sm:h-52 border border-slate-200 bg-[#0B1D2D]">
                <img 
                  src={currentPitch.image} 
                  alt={currentPitch.name} 
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Fallback graphic if image blocked */}
                <div className="absolute inset-0 pointer-events-none opacity-20 flex items-center justify-center">
                  <div className="w-28 h-28 rounded-full border-2 border-white flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                  <div className="absolute inset-x-0 h-0.5 bg-white"></div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-between p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#00B6C8] text-white font-black text-[11px] tracking-wider uppercase shadow">
                      CRICKET & FOOTBALL
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white text-[#1F2937] text-xs font-bold shadow-md flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-radar-beacon"></span>
                      <span>Live Slots</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-display font-black text-white uppercase tracking-wide">
                      SONAWANE'S TURF
                    </h3>
                    <p className="text-xs text-orange-300 font-semibold">{currentPitch.dimensions} • High Netting</p>
                  </div>
                </div>

                {/* Floating '98% Happy Players' badge (Hatrick Grounds signature) */}
                <div className="absolute bottom-3 right-3 bg-white px-3 py-1.5 rounded-xl shadow-lg border-l-4 border-[#FF6A00] flex items-center gap-2 text-xs font-bold text-[#1F2937] animate-float-subtle">
                  <span className="text-sm">⚡</span>
                  <div>
                    <div className="text-[#FF6A00] leading-none font-extrabold">98%</div>
                    <div className="text-[10px] text-slate-500 font-medium">Happy Teams</div>
                  </div>
                </div>
              </div>

              {/* Title & Blue Pricing Format with Animated Numbers */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <h4 className="text-base font-black text-[#111827] uppercase tracking-wide">
                    {currentPitch.name} • {currentPitch.dimensions}
                  </h4>
                  <p className="text-xs text-slate-500">{currentPitch.surface}</p>
                </div>
                <div className="text-right whitespace-nowrap shrink-0">
                  <span className="text-xl font-black text-[#0D6EFD]">
                    <AnimatedCounter value={currentPitch.baseWeekdayPrice} prefix="₹" suffix=".00" />
                  </span>
                  <span className="text-xs text-slate-500 font-medium"> / hr</span>
                </div>
              </div>

              {/* Split Day / Night Pricing Box */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-0.5">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1 font-semibold">
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>Day Rate (6 AM - 5 PM)</span>
                  </span>
                  <div className="text-[#0D6EFD] font-black text-base">
                    ₹{currentPitch.baseWeekdayPrice} <span className="text-xs text-slate-500 font-normal">/ hr</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-orange-50/50 border border-orange-200 space-y-0.5">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1 font-semibold">
                    <Zap className="w-3.5 h-3.5 text-[#FF6A00]" />
                    <span>Night Lights (5 PM+)</span>
                  </span>
                  <div className="text-[#FF6A00] font-black text-base">
                    ₹{currentPitch.peakHourWeekdayPrice} <span className="text-xs text-slate-500 font-normal">/ hr</span>
                  </div>
                </div>
              </div>

              {/* Amenity Pills for Box Cricket */}
              <div className="flex flex-wrap gap-1.5 text-xs text-slate-700">
                <span className="px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200">🏏 Wooden Stumps</span>
                <span className="px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200">🕸️ Ceiling Nets</span>
                <span className="px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200">🔆 Floodlights</span>
                <span className="px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200">🅿️ Free Parking</span>
                <span className="px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200">💧 Chilled RO Water</span>
                <button
                  type="button"
                  onClick={() => setShowPitchModal(true)}
                  className="px-2.5 py-1 rounded-xl bg-orange-100/60 border border-orange-300 text-[#E65F00] font-bold hover:bg-orange-200/60 transition-colors cursor-pointer"
                >
                  👁️ 2D Field View
                </button>
              </div>

              {/* Primary Card CTA with Spring Micro-Bounce */}
              <SpringButton
                onClick={() => {
                  onSelectPitch?.(currentPitch.id);
                  onScrollToSlots();
                }}
                className="w-full py-4 rounded-2xl bg-[#FF6A00] hover:bg-[#E65F00] text-white font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>BOOK BOX CRICKET NOW →</span>
              </SpringButton>

            </SpotlightCard>
          </div>

        </div>
      </div>

      {/* 2D Pitch Modal Preview */}
      {showPitchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl p-5 sm:p-6 shadow-2xl relative space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-[#111827] uppercase tracking-wider">
                  {currentPitch.name} • 2D Field Diagram
                </h3>
                <p className="text-xs text-slate-500">
                  {currentPitch.dimensions} • {currentPitch.surface}
                </p>
              </div>
              <button
                onClick={() => setShowPitchModal(false)}
                className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-300 cursor-pointer"
              >
                Close ✕
              </button>
            </div>

            <PitchVisualizer pitch={currentPitch} sport={currentPitch.sports[0]} />

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>Wooden stumps, bails, umpire clicker, boundary safety nets included</span>
              <button
                onClick={() => {
                  setShowPitchModal(false);
                  onSelectPitch?.(currentPitch.id);
                  onScrollToSlots();
                }}
                className="px-4 py-2 rounded-xl bg-[#FF6A00] hover:bg-[#E65F00] text-white font-extrabold uppercase shadow-md cursor-pointer"
              >
                Book This Slot →
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
