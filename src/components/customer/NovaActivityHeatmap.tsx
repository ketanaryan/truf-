import React from 'react';
import { Activity, Clock, Award, Shield, Flame, Sparkles } from 'lucide-react';

export const NovaActivityHeatmap: React.FC = () => {
  // Generate a realistic 12 weeks x 7 days heatmap matrix
  const weeks = 12;
  const days = 7;
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Seeded pattern with heavy weekend and prime floodlight activity
  const heatmapData = Array.from({ length: weeks }, (_, wIndex) => 
    Array.from({ length: days }, (_, dIndex) => {
      if (dIndex >= 4) { // Friday, Saturday, Sunday
        return (wIndex + dIndex) % 3 === 0 ? 3 : 2;
      }
      return (wIndex * 3 + dIndex) % 4; // 0, 1, 2, 3
    })
  );

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 font-body">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Customer Analytics & 2x2 Telemetry Cards */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#ff7a00] font-headline font-bold text-xs uppercase tracking-[0.24em]">
              <Activity className="w-4 h-4 text-[#ff7a00]" />
              <span>TELEMETRY DATA</span>
            </div>
            
            <h3 className="font-headline font-black italic text-3xl sm:text-5xl uppercase tracking-tight text-white leading-none">
              CUSTOMER <span className="text-[#ff7a00]">ANALYTICS</span>
            </h3>

            <p className="text-[#a1a1a5] text-xs sm:text-sm font-light leading-relaxed max-w-lg">
              Live match tracking, squad momentum, and pitch telemetry for verified captains playing at Sonawane’s Multi Sport Turf.
            </p>
          </div>

          {/* 2x2 Metric Cards with Colored Left Accent Bars (The Nova Club Standard) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Metric 1 */}
            <div className="relative rounded-2xl bg-[#1e2023] border border-white/5 p-4 sm:p-5 overflow-hidden flex items-start gap-3">
              <div className="w-1 self-stretch rounded-full bg-[#ff7a00] shrink-0" />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-white/50 block">
                  HOURS PLAYED
                </span>
                <div className="font-headline font-black italic text-2xl sm:text-3xl text-white mt-0.5">
                  184.5 <span className="text-xs font-normal text-[#ff7a00]">HRS</span>
                </div>
                <span className="text-[11px] text-[#a1a1a5] block mt-1">
                  Floodlit box cricket matches
                </span>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="relative rounded-2xl bg-[#1e2023] border border-white/5 p-4 sm:p-5 overflow-hidden flex items-start gap-3">
              <div className="w-1 self-stretch rounded-full bg-[#9df800] shrink-0" />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-white/50 block">
                  SQUAD TIER
                </span>
                <div className="font-headline font-black italic text-2xl sm:text-3xl text-white mt-0.5">
                  PRO XI <span className="text-xs font-normal text-[#9df800]">★</span>
                </div>
                <span className="text-[11px] text-[#a1a1a5] block mt-1">
                  Nashik Division 1 Ranking
                </span>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="relative rounded-2xl bg-[#1e2023] border border-white/5 p-4 sm:p-5 overflow-hidden flex items-start gap-3">
              <div className="w-1 self-stretch rounded-full bg-[#95ccff] shrink-0" />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-white/50 block">
                  TOTAL BOOKINGS
                </span>
                <div className="font-headline font-black italic text-2xl sm:text-3xl text-white mt-0.5">
                  142 <span className="text-xs font-normal text-[#95ccff]">SLOTS</span>
                </div>
                <span className="text-[11px] text-[#a1a1a5] block mt-1">
                  99.4% check-in reliability
                </span>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="relative rounded-2xl bg-[#1e2023] border border-white/5 p-4 sm:p-5 overflow-hidden flex items-start gap-3">
              <div className="w-1 self-stretch rounded-full bg-[#ffb020] shrink-0" />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-white/50 block">
                  FLOODLIGHT SPEED
                </span>
                <div className="font-headline font-black italic text-2xl sm:text-3xl text-white mt-0.5">
                  500 <span className="text-xs font-normal text-[#ffb020]">LUX</span>
                </div>
                <span className="text-[11px] text-[#a1a1a5] block mt-1">
                  Anti-glare shadowless arena
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Activity Heatmap Card */}
        <div className="lg:col-span-6">
          <div className="rounded-3xl bg-[#1e2023] border border-white/10 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-5">
            
            {/* Card Header with macOS style dots */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <span className="text-[11px] font-headline font-bold uppercase tracking-[0.2em] text-[#ff7a00] block">
                  PITCH UTILIZATION
                </span>
                <h4 className="font-headline font-black italic text-xl uppercase text-white mt-0.5">
                  ACTIVITY HEATMAP
                </h4>
              </div>

              {/* Window Status Dots */}
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff7a00] animate-pulse shadow-[0_0_10px_#ff7a00]" />
              </div>
            </div>

            {/* Inner Dark Well Surface */}
            <div className="rounded-2xl bg-[#111317] border border-white/5 p-4 sm:p-5 overflow-x-auto">
              <div className="min-w-[360px] space-y-2">
                
                {/* Heatmap Grid */}
                <div className="grid grid-cols-12 gap-1.5 sm:gap-2">
                  {heatmapData.map((week, wIdx) => (
                    <div key={wIdx} className="flex flex-col gap-1.5 sm:gap-2">
                      {week.map((level, dIdx) => {
                        let cellClass = "bg-white/5";
                        if (level === 1) cellClass = "bg-[#ff7a00]/30";
                        if (level === 2) cellClass = "bg-[#ff7a00]/60";
                        if (level === 3) cellClass = "bg-[#ff7a00] shadow-[0_0_12px_rgba(255,122,0,0.45)]";

                        return (
                          <div
                            key={dIdx}
                            className={`w-full aspect-square rounded-md ${cellClass} hover:scale-125 transition-transform duration-200 cursor-pointer`}
                            title={`Week ${wIdx + 1}, ${dayNames[dIdx]}: Intensity ${level}`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>

                {/* Day Labels and Sub-legend */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-white/50">
                  <span>PAST 12 WEEKS • PLAYER MOMENTUM</span>
                  <div className="flex items-center gap-1.5">
                    <span>Less</span>
                    <span className="w-2 h-2 rounded bg-white/5" />
                    <span className="w-2 h-2 rounded bg-[#ff7a00]/30" />
                    <span className="w-2 h-2 rounded bg-[#ff7a00]/60" />
                    <span className="w-2 h-2 rounded bg-[#ff7a00]" />
                    <span>More</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Callout */}
            <div className="flex items-center justify-between text-xs text-white/60 pt-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#9df800]" />
                <span className="font-semibold text-white/80">Peak Hours: 06:00 PM – 11:00 PM</span>
              </span>
              <span className="font-mono text-[#ffb27e] font-bold">100% FLOODLIT</span>
            </div>

          </div>
        </div>

      </div>

    </section>
  );
};
