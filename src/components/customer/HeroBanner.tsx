import React, { useState } from 'react';
import { 
  Calendar, 
  Users, 
  Zap, 
  Star,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles
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
  const [showPitchModal, setShowPitchModal] = useState(false);
  const currentPitch = pitches[0];

  return (
    <section className="relative min-h-[75vh] sm:min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#16181b] font-body text-white pt-24 sm:pt-28 pb-12 sm:pb-16">
      
      {/* Cinematic Night Floodlight Turf Photography Backdrop */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=2400&q=85" 
          alt="Sonawane Multi Sport Turf Floodlights" 
          className="w-full h-full object-cover object-center filter brightness-[0.45] contrast-[1.15] scale-105"
        />
        
        {/* Nova Club Directional & Radial Vignette Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0e11] via-[#0d0e11]/85 sm:via-[#0d0e11]/75 to-transparent"></div>
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#16181b]/50 to-[#16181b]"></div>
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#16181b] to-transparent"></div>

        {/* Ambient Orange Energy Glow Spotlights */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#ff7a00]/15 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[#00B6C8]/10 rounded-full blur-[120px] pointer-events-none"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-4xl space-y-5 sm:space-y-6">
          
          {/* Eyebrow Treatment: Thin Rule + Nova Orange Accent */}
          <div className="flex items-center gap-3">
            <span className="w-8 h-[2px] bg-[#ff7a00]"></span>
            <span className="text-[#ffb27e] font-headline font-bold text-xs sm:text-sm uppercase tracking-[0.26em]">
              UNLEASH THE HEAT • NASHIK ATHLETIC CLUB
            </span>
          </div>

          {/* The Nova Club Signature Massive Skewed Display Headline */}
          <div className="space-y-1">
            <h1 className="font-headline font-black text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] tracking-tight uppercase leading-[0.94] text-white select-none">
              <span className="block text-white/95">WHERE</span>
              <span className="block text-white/95">NASHIK PLAYS</span>
              <span className="block italic text-[#ff7a00] drop-shadow-[0_0_40px_rgba(255,122,0,0.45)]">
                CRICKET & FOOTBALL
              </span>
            </h1>
          </div>

          {/* Subtitle with Premium Editorial Spacing */}
          <p className="text-white/70 text-sm sm:text-base leading-relaxed max-w-2xl font-light">
            Welcome to <strong className="text-white font-semibold">Sonawane's Multi Sport Turf</strong> — a premium 
            floodlit box cricket and 5v5 football arena in Rane Nagar, Nashik with 50mm FIFA-grade astroturf, 
            heavy-gauge 360° ceiling netting, wooden match stumps, and effortless 0% fee online slot reservations.
          </p>

          {/* Telemetry Status Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-white/70">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#9df800] animate-pulse"></span>
              <span className="font-headline font-bold tracking-wider text-white">500-LUX FLOODLIT</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="text-amber-400 font-bold">★ 4.0 / 5.0</span>
              <span className="text-white/60">•</span>
              <span className="text-white/80">22 Google Reviews</span>
            </div>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="text-[#00B6C8] font-bold">⚡ 0% Gateway Fee</span>
              <span className="text-white/60">•</span>
              <span className="text-white/80 font-mono">Direct UPI Pass</span>
            </div>
          </div>

          {/* Dual Pill CTA Buttons (The Nova Club Standard) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <button
              onClick={onScrollToSlots}
              className="group flex items-center justify-center gap-3 px-8 sm:px-9 py-4 rounded-full bg-[#ff7a00] hover:bg-[#ff8a1a] text-white font-headline font-bold text-sm uppercase tracking-[0.2em] shadow-[0_14px_36px_rgba(255,122,0,0.42)] hover:shadow-[0_16px_46px_rgba(255,122,0,0.6)] hover:scale-[1.03] active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>BOOK NOW</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
            </button>

            <button
              onClick={() => setShowPitchModal(true)}
              className="flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-white/8 hover:bg-white/15 border border-white/20 hover:border-[#ffb27e]/70 text-white font-headline font-bold text-sm uppercase tracking-[0.2em] backdrop-blur-md hover:scale-[1.02] active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <Users className="w-4 h-4 text-[#ff7a00]" />
              <span>EXPLORE ARENA →</span>
            </button>
          </div>

          {/* Quick Location & Pricing Footnote */}
          <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-white/50 border-t border-white/10 font-mono">
            <span className="flex items-center gap-1.5 text-white/70">
              <MapPin className="w-3.5 h-3.5 text-[#ff7a00]" />
              <span>Chetana Nagar, Rane Nagar, Nashik - 422009</span>
            </span>
            <span className="hidden md:inline">•</span>
            <span className="text-[#ffb27e] font-sans font-semibold">
              Rates: ₹600/hr (Day) • ₹800/hr (Floodlights)
            </span>
            <span className="hidden md:inline">•</span>
            <span>Managed by Kiran Sonawane</span>
          </div>

        </div>
      </div>

      {/* Arena Specs Visualizer Modal */}
      {showPitchModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto font-body"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowPitchModal(false);
          }}
        >
          <div className="relative w-full max-w-4xl bg-[#1e2023] border border-white/15 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-lg font-black uppercase tracking-wider text-white font-headline">
                  Sonawane's Turf Arena Visualizer
                </h3>
                <p className="text-xs text-neutral-400">
                  120 ft × 65 ft Enclosed Rebound Cage with 500-Lux Anti-Glare Floodlights
                </p>
              </div>
              <button
                onClick={() => setShowPitchModal(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white flex items-center justify-center border border-white/10 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <PitchVisualizer
              pitch={currentPitch}
              sport="Box Cricket"
              onClose={() => setShowPitchModal(false)}
              onBookPitch={() => {
                setShowPitchModal(false);
                onScrollToSlots();
              }}
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowPitchModal(false)}
                className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 font-bold text-xs cursor-pointer border border-white/10"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowPitchModal(false);
                  onScrollToSlots();
                }}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#ff7a00] to-amber-600 hover:from-amber-600 hover:to-[#ff7a00] text-white font-extrabold text-xs uppercase tracking-wider shadow-[0_4px_16px_rgba(255,122,0,0.3)] cursor-pointer"
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
