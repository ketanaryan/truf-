import React, { useState } from 'react';
import { Pitch, SportType } from '../../types';
import { Eye, ShieldCheck, Zap } from 'lucide-react';

interface PitchVisualizerProps {
  pitch: Pitch;
  sport?: SportType;
  onClose?: () => void;
  onBookPitch?: () => void;
}

export const PitchVisualizer: React.FC<PitchVisualizerProps> = ({ pitch }) => {
  const [showTacticalFielders, setShowTacticalFielders] = useState(false);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-[#0B1D2D] group font-sans">
      
      {/* Top Telemetry Header */}
      <div className="bg-[#061320] px-4 py-2.5 border-b border-white/10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-white font-bold uppercase tracking-wider">{pitch.name}</span>
          <span className="text-slate-500">•</span>
          <span className="text-[#FF6A00] font-bold">120 ft × 65 ft Enclosed Rebound Cage</span>
        </div>

        <button
          onClick={() => setShowTacticalFielders(!showTacticalFielders)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all border active:scale-95 ${
            showTacticalFielders
              ? 'bg-[#FF6A00] text-white border-[#E65F00] shadow-sm'
              : 'bg-white/10 hover:bg-white/20 text-slate-200 border-white/20'
          }`}
          aria-label="Toggle box cricket fielding positions"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{showTacticalFielders ? 'Hide Fielding Map' : 'Box Cricket Field Setup'}</span>
        </button>
      </div>

      {/* 2D Box Cricket Arena Canvas */}
      <div className="relative h-64 sm:h-80 w-full pitch-stripes p-4 sm:p-6 flex items-center justify-center select-none overflow-hidden">
        
        {/* Anti-Glare LED Floodlight Cones */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-amber-400/20 via-transparent to-transparent pointer-events-none rounded-br-full blur-xl"></div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-amber-400/20 via-transparent to-transparent pointer-events-none rounded-bl-full blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-amber-400/20 via-transparent to-transparent pointer-events-none rounded-tr-full blur-xl"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-amber-400/20 via-transparent to-transparent pointer-events-none rounded-tl-full blur-xl"></div>

        {/* Outer Heavy-Gauge Rebound Cage Netting (Perimeter Wall) */}
        <div className="relative w-full h-full border-2 border-white/70 rounded-xl flex items-center justify-center shadow-2xl bg-emerald-950/40">
          
          {/* Side Netting Rebound Run Markings */}
          <div className="absolute top-2 left-4 text-[10px] font-mono font-bold text-amber-300 bg-black/60 px-2 py-0.5 rounded border border-amber-400/30">
            Side Net: 1 Run
          </div>
          <div className="absolute bottom-2 left-4 text-[10px] font-mono font-bold text-amber-300 bg-black/60 px-2 py-0.5 rounded border border-amber-400/30">
            Side Net: 1 Run
          </div>
          <div className="absolute top-2 right-4 text-[10px] font-mono font-bold text-emerald-300 bg-black/60 px-2 py-0.5 rounded border border-emerald-400/30">
            Straight Drive: 4 Runs
          </div>
          <div className="absolute bottom-2 right-4 text-[10px] font-mono font-bold text-[#FF6A00] bg-black/60 px-2 py-0.5 rounded border border-[#FF6A00]/40">
            Direct Ceiling Hit: 6 Runs
          </div>

          {/* Center 22-Yard Cricket Astroturf Pitch Strip */}
          <div className="relative w-3/5 sm:w-2/3 h-16 sm:h-20 bg-amber-900/40 border-2 border-amber-300/80 rounded-md flex items-center justify-between px-3 shadow-2xl backdrop-blur-sm">
            
            {/* Bowling End Crease & Stumps */}
            <div className="flex items-center gap-2">
              <div className="h-12 w-1.5 bg-amber-300 flex flex-col justify-around py-1" title="Bowling Crease">
                <span className="w-1 h-2 bg-white rounded-full"></span>
                <span className="w-1 h-2 bg-white rounded-full"></span>
                <span className="w-1 h-2 bg-white rounded-full"></span>
              </div>
              <div className="text-[9px] font-mono text-amber-200 font-bold hidden sm:block">
                BOWLER
              </div>
            </div>

            {/* Pitch Center Badge */}
            <div className="text-center font-mono">
              <span className="text-[10px] sm:text-xs text-amber-300 font-black tracking-wider block">
                22-YD ASTROTURF WICKET
              </span>
              <span className="text-[8px] sm:text-[9px] text-slate-200 uppercase tracking-widest">
                TENNIS & TAPE BALL CERTIFIED
              </span>
            </div>

            {/* Batting End Crease & Stumps */}
            <div className="flex items-center gap-2">
              <div className="text-[9px] font-mono text-amber-200 font-bold hidden sm:block">
                BATSMAN
              </div>
              <div className="h-12 w-1.5 bg-amber-300 flex flex-col justify-around py-1" title="Batting Crease">
                <span className="w-1 h-2 bg-white rounded-full"></span>
                <span className="w-1 h-2 bg-white rounded-full"></span>
                <span className="w-1 h-2 bg-white rounded-full"></span>
              </div>
            </div>

          </div>

          {/* Tactical Box Cricket Fielders Formation */}
          {showTacticalFielders && (
            <div className="absolute inset-0 pointer-events-none p-4 flex items-center justify-between z-10">
              {/* Bowler Run-up position */}
              <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                <span className="w-6 h-6 rounded-full bg-[#FF6A00] text-white font-black text-[10px] flex items-center justify-center shadow-lg border border-white">
                  BW
                </span>
                <span className="text-[9px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded">Bowler</span>
              </div>

              {/* Mid-off & Mid-on */}
              <div className="absolute left-1/3 top-6 flex items-center gap-1">
                <span className="w-5 h-5 rounded-full bg-white text-black font-extrabold text-[9px] flex items-center justify-center shadow-md">
                  MO
                </span>
                <span className="text-[8px] text-white bg-black/50 px-1 rounded">Mid-Off</span>
              </div>
              <div className="absolute left-1/3 bottom-6 flex items-center gap-1">
                <span className="w-5 h-5 rounded-full bg-white text-black font-extrabold text-[9px] flex items-center justify-center shadow-md">
                  MN
                </span>
                <span className="text-[8px] text-white bg-black/50 px-1 rounded">Mid-On</span>
              </div>

              {/* Point & Square Leg */}
              <div className="absolute right-1/3 top-6 flex items-center gap-1">
                <span className="w-5 h-5 rounded-full bg-white text-black font-extrabold text-[9px] flex items-center justify-center shadow-md">
                  PT
                </span>
                <span className="text-[8px] text-white bg-black/50 px-1 rounded">Point</span>
              </div>
              <div className="absolute right-1/3 bottom-6 flex items-center gap-1">
                <span className="w-5 h-5 rounded-full bg-white text-black font-extrabold text-[9px] flex items-center justify-center shadow-md">
                  SQ
                </span>
                <span className="text-[8px] text-white bg-black/50 px-1 rounded">Square Leg</span>
              </div>

              {/* Wicketkeeper & Slips */}
              <div className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                <span className="w-6 h-6 rounded-full bg-emerald-400 text-black font-black text-[10px] flex items-center justify-center shadow-lg border border-black">
                  WK
                </span>
                <span className="text-[9px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded">Keeper</span>
              </div>
            </div>
          )}

          {/* 8 Perimeter Floodlight Points */}
          <div className="absolute -top-1.5 left-1/4 w-3 h-3 rounded-full bg-amber-300 shadow-[0_0_12px_#F59E0B] border border-white"></div>
          <div className="absolute -top-1.5 right-1/4 w-3 h-3 rounded-full bg-amber-300 shadow-[0_0_12px_#F59E0B] border border-white"></div>
          <div className="absolute -bottom-1.5 left-1/4 w-3 h-3 rounded-full bg-amber-300 shadow-[0_0_12px_#F59E0B] border border-white"></div>
          <div className="absolute -bottom-1.5 right-1/4 w-3 h-3 rounded-full bg-amber-300 shadow-[0_0_12px_#F59E0B] border border-white"></div>
        </div>
      </div>

      {/* Bottom Specs Strip */}
      <div className="bg-[#061320] px-4 py-2.5 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-bold text-white">120 ft × 65 ft Box Cricket Rebound Cage</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <span>50mm Dense Astroturf with Rubber Infill & Shockpad</span>
        </div>
        <div className="flex items-center gap-1.5 text-amber-400 font-bold">
          <Zap className="w-3.5 h-3.5 text-[#FF6A00]" />
          <span>500-Lux Anti-Glare Floodlights</span>
        </div>
      </div>
    </div>
  );
};
