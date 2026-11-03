import React, { useState } from 'react';
import { Pitch, SportType } from '../../types';
import { Eye, ShieldCheck, Sun, Zap, Info } from 'lucide-react';

interface PitchVisualizerProps {
  pitch: Pitch;
  sport: SportType;
}

export const PitchVisualizer: React.FC<PitchVisualizerProps> = ({ pitch, sport }) => {
  const [showTacticalLineup, setShowTacticalLineup] = useState(false);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-[#203c27] shadow-2xl bg-[#08120b] group">
      
      {/* Top Telemetry Header */}
      <div className="bg-[#0a160e] px-4 py-2.5 border-b border-[#1b3322] flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-white font-bold uppercase tracking-wider">{pitch.name}</span>
          <span className="text-zinc-600">•</span>
          <span className="text-emerald-400 font-semibold">{sport}</span>
        </div>

        <button
          onClick={() => setShowTacticalLineup(!showTacticalLineup)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all border active:scale-95 ${
            showTacticalLineup
              ? 'bg-emerald-500 text-black font-bold border-emerald-400 shadow-sm'
              : 'bg-[#122217] hover:bg-[#193322] text-zinc-300 hover:text-white border-[#223d2b]'
          }`}
          aria-label="Toggle tactical lineup view"
        >
          <Eye className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>{showTacticalLineup ? 'Hide Tactical Lineup' : 'Tactical 2D View'}</span>
        </button>
      </div>

      {/* 2D Synthetic Grass Pitch Canvas */}
      <div className="relative h-60 sm:h-72 w-full pitch-stripes p-3.5 sm:p-5 flex items-center justify-center select-none overflow-hidden">
        
        {/* Floodlight Beam Ambiance (4 Warm Gold Cones) */}
        <div className="absolute top-0 left-0 w-36 h-36 bg-gradient-to-br from-amber-400/15 via-transparent to-transparent pointer-events-none rounded-br-full blur-xl"></div>
        <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-amber-400/15 via-transparent to-transparent pointer-events-none rounded-bl-full blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-gradient-to-tr from-amber-400/15 via-transparent to-transparent pointer-events-none rounded-tr-full blur-xl"></div>
        <div className="absolute bottom-0 right-0 w-36 h-36 bg-gradient-to-tl from-amber-400/15 via-transparent to-transparent pointer-events-none rounded-tl-full blur-xl"></div>

        {/* Outer White Pitch Boundary Line */}
        <div className="relative w-full h-full border-2 border-white/40 rounded-lg flex items-center justify-center shadow-inner">
          
          {/* Halfway Line */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-white/35"></div>
          
          {/* Center Circle */}
          <div className="absolute w-20 h-20 sm:w-28 sm:h-28 rounded-full border-2 border-white/40 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white/80 shadow-[0_0_8px_white]"></div>
          </div>

          {/* Left Goal Area & Penalty Box */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 sm:w-16 h-28 sm:h-36 border-r-2 border-y-2 border-white/40 bg-white/5">
            <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-2.5 h-14 border-2 border-white/70 bg-white/20 rounded-l"></div>
            {/* Penalty Spot */}
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/90"></div>
            {/* Penalty Arc */}
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-14 border-r-2 border-white/40 rounded-r-full pointer-events-none"></div>
          </div>

          {/* Right Goal Area & Penalty Box */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-12 sm:w-16 h-28 sm:h-36 border-l-2 border-y-2 border-white/40 bg-white/5">
            <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-2.5 h-14 border-2 border-white/70 bg-white/20 rounded-r"></div>
            {/* Penalty Spot */}
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/90"></div>
            {/* Penalty Arc */}
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-14 border-l-2 border-white/40 rounded-l-full pointer-events-none"></div>
          </div>

          {/* Corner Arcs */}
          <div className="absolute -top-0.5 -left-0.5 w-4 h-4 border-b-2 border-r-2 border-white/40 rounded-br-full"></div>
          <div className="absolute -top-0.5 -right-0.5 w-4 h-4 border-b-2 border-l-2 border-white/40 rounded-bl-full"></div>
          <div className="absolute -bottom-0.5 -left-0.5 w-4 h-4 border-t-2 border-r-2 border-white/40 rounded-tr-full"></div>
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 border-t-2 border-l-2 border-white/40 rounded-tl-full"></div>

          {/* Box Cricket Pitch Overlay */}
          {sport === 'Box Cricket' && (
            <div className="absolute w-44 sm:w-60 h-14 sm:h-16 bg-amber-950/45 border-2 border-amber-400/70 rounded-md flex items-center justify-between px-3 shadow-xl backdrop-blur-[1px]">
              <div className="h-full w-1.5 bg-amber-400 flex flex-col justify-around py-1" title="Bowling Crease">
                <span className="w-1 h-2 bg-white rounded-full"></span>
                <span className="w-1 h-2 bg-white rounded-full"></span>
                <span className="w-1 h-2 bg-white rounded-full"></span>
              </div>
              <div className="text-center font-mono">
                <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">
                  22-YD ASTROTURF WICKET
                </span>
                <span className="text-[8px] text-zinc-300 uppercase">
                  HIGH CEILING DERBY CAGE
                </span>
              </div>
              <div className="h-full w-1.5 bg-amber-400 flex flex-col justify-around py-1" title="Batting Crease">
                <span className="w-1 h-2 bg-white rounded-full"></span>
                <span className="w-1 h-2 bg-white rounded-full"></span>
                <span className="w-1 h-2 bg-white rounded-full"></span>
              </div>
            </div>
          )}

          {/* Pickleball Court Overlay */}
          {sport === 'Pickleball' && (
            <div className="absolute w-48 sm:w-64 h-32 sm:h-40 border-2 border-cyan-400/80 bg-cyan-950/20 rounded flex items-center justify-center">
              {/* Center Net */}
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-white/90 shadow-[0_0_8px_white]"></div>
              {/* Kitchen / Non-Volley Zone Lines (7ft on either side) */}
              <div className="absolute top-0 bottom-0 left-[35%] w-0.5 bg-cyan-300/70 border-dashed"></div>
              <div className="absolute top-0 bottom-0 right-[35%] w-0.5 bg-cyan-300/70 border-dashed"></div>
              {/* Center Service Line */}
              <div className="absolute left-0 right-[65%] top-1/2 -translate-y-1/2 h-0.5 bg-cyan-300/60"></div>
              <div className="absolute left-[65%] right-0 top-1/2 -translate-y-1/2 h-0.5 bg-cyan-300/60"></div>
              <span className="text-[9px] font-mono text-cyan-300 font-bold uppercase tracking-widest bg-black/60 px-2 py-0.5 rounded border border-cyan-400/40">
                PRO PICKLEBALL CAGE
              </span>
            </div>
          )}

          {/* Tactical Player Formation Overlay if toggled */}
          {showTacticalLineup && (
            <div className="absolute inset-0 pointer-events-none p-3 flex items-center justify-around z-10">
              {/* Home Team (Emerald Squad) */}
              <div className="flex flex-col justify-around h-full">
                <span className="w-5 h-5 rounded-full bg-emerald-400 text-black font-extrabold text-[9px] flex items-center justify-center shadow-lg border border-black animate-pulse">GK</span>
              </div>
              <div className="flex flex-col justify-around h-full space-y-4">
                <span className="w-5 h-5 rounded-full bg-white text-black font-extrabold text-[9px] flex items-center justify-center shadow-lg border border-black">DF</span>
                <span className="w-5 h-5 rounded-full bg-white text-black font-extrabold text-[9px] flex items-center justify-center shadow-lg border border-black">DF</span>
              </div>
              <div className="flex flex-col justify-around h-full space-y-3">
                <span className="w-5 h-5 rounded-full bg-white text-black font-extrabold text-[9px] flex items-center justify-center shadow-lg border border-black">MF</span>
                <span className="w-5 h-5 rounded-full bg-white text-black font-extrabold text-[9px] flex items-center justify-center shadow-lg border border-black">MF</span>
              </div>
              <div className="flex flex-col justify-around h-full">
                <span className="w-5 h-5 rounded-full bg-white text-black font-extrabold text-[9px] flex items-center justify-center shadow-lg border border-black">ST</span>
              </div>

              {/* Away Team (Amber Squad) */}
              <div className="flex flex-col justify-around h-full">
                <span className="w-5 h-5 rounded-full bg-amber-400 text-black font-extrabold text-[9px] flex items-center justify-center shadow-lg border border-black">ST</span>
              </div>
              <div className="flex flex-col justify-around h-full space-y-3">
                <span className="w-5 h-5 rounded-full bg-amber-400 text-black font-extrabold text-[9px] flex items-center justify-center shadow-lg border border-black">MF</span>
                <span className="w-5 h-5 rounded-full bg-amber-400 text-black font-extrabold text-[9px] flex items-center justify-center shadow-lg border border-black">MF</span>
              </div>
              <div className="flex flex-col justify-around h-full space-y-4">
                <span className="w-5 h-5 rounded-full bg-amber-400 text-black font-extrabold text-[9px] flex items-center justify-center shadow-lg border border-black">DF</span>
                <span className="w-5 h-5 rounded-full bg-amber-400 text-black font-extrabold text-[9px] flex items-center justify-center shadow-lg border border-black">DF</span>
              </div>
              <div className="flex flex-col justify-around h-full">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-black font-extrabold text-[9px] flex items-center justify-center shadow-lg border border-black">GK</span>
              </div>
            </div>
          )}

          {/* 4 Corner Floodlight Simulators */}
          <div className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-amber-300 shadow-[0_0_14px_rgba(251,191,36,1)] border border-white"></div>
          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-amber-300 shadow-[0_0_14px_rgba(251,191,36,1)] border border-white"></div>
          <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 rounded-full bg-amber-300 shadow-[0_0_14px_rgba(251,191,36,1)] border border-white"></div>
          <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 rounded-full bg-amber-300 shadow-[0_0_14px_rgba(251,191,36,1)] border border-white"></div>
        </div>
      </div>

      {/* Bottom Specs Strip */}
      <div className="bg-[#0a160e] px-4 py-2.5 border-t border-[#1b3322] flex flex-wrap items-center justify-between text-[11px] font-mono text-zinc-300 gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="font-bold text-white">{pitch.dimensions}</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-400">
          <span>50mm FIFA Certified Monofilament</span>
        </div>
        <div className="flex items-center gap-1.5 text-amber-400 font-bold">
          <Zap className="w-3 h-3" />
          <span>500-Lux Broadcast Ready</span>
        </div>
      </div>
    </div>
  );
};
