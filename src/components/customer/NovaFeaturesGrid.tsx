import React from 'react';
import { Trophy, ShieldCheck, Layers, Users, Zap, Award, Sparkles } from 'lucide-react';

export const NovaFeaturesGrid: React.FC = () => {
  const features = [
    {
      id: 'gear',
      icon: <Trophy className="w-6 h-6 text-[#ffb020]" />,
      accentColor: '#ffb020',
      tag: 'EQUIPMENT INCLUDED',
      title: 'ELITE GEAR',
      description: 'Regulation wooden stumps, bails, heavy-grade tennis & tape balls, and umpire counter gear provided free with every match slot.'
    },
    {
      id: 'turf',
      icon: <ShieldCheck className="w-6 h-6 text-[#9df800]" />,
      accentColor: '#9df800',
      tag: '50MM CUSHIONING',
      title: 'PRO-LEVEL TURF',
      description: 'Dense monofilament astroturf with shock-absorbing underlay engineered for calibrated true bounce and knee protection.'
    },
    {
      id: 'cages',
      icon: <Layers className="w-6 h-6 text-[#ff7a00]" />,
      accentColor: '#ff7a00',
      tag: 'ZERO LOST BALLS',
      title: 'COURT SEPARATORS & CAGES',
      description: '120ft x 65ft arena with heavy-gauge ceiling net and full boundary cage to ensure continuous uninterrupted match play.'
    },
    {
      id: 'community',
      icon: <Users className="w-6 h-6 text-[#95ccff]" />,
      accentColor: '#95ccff',
      tag: '2,400+ REGISTERED',
      title: 'ELITE COMMUNITY',
      description: 'Nashik’s most competitive box cricket squads and corporate clubs. Challenge rival teams, track stats, and compete in weekend cups.'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      
      {/* Section Header (The Nova Club Standard) */}
      <div className="space-y-2 mb-8 sm:mb-10 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2 text-white/50 font-headline font-bold text-xs uppercase tracking-[0.24em]">
          <span className="w-2 h-2 rounded-full bg-[#ff7a00]"></span>
          <span>THE SPECIFICATION SUITE</span>
        </div>
        <h3 className="font-headline font-black italic text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-white">
          ENGINEERED FOR <span className="text-[#ff7a00]">PERFORMANCE</span>
        </h3>
        <p className="text-[#a1a1a5] text-xs sm:text-sm font-body max-w-xl">
          Every dimension of Sonawane’s Multi Sport Turf is crafted for competitive cricket and football under stadium lighting.
        </p>
      </div>

      {/* 4-Column Feature Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {features.map((item) => (
          <div
            key={item.id}
            style={{ borderTopColor: item.accentColor }}
            className="group relative rounded-3xl bg-[#1e2023] p-7 sm:p-8 border border-white/5 hover:border-white/15 border-t-2 transition-all duration-300 hover:-translate-y-1.5 shadow-[0_12px_32px_rgba(0,0,0,0.35)] flex flex-col justify-between"
          >
            {/* Ambient Corner Glow on Hover */}
            <div 
              style={{ backgroundColor: `${item.accentColor}10` }}
              className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
            />

            <div className="space-y-4">
              {/* Icon Container with subtle glass ring */}
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                {item.icon}
              </div>

              {/* Tag */}
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase font-bold text-white/40 block">
                {item.tag}
              </span>

              {/* Title */}
              <h4 className="font-headline font-black italic text-lg sm:text-xl uppercase tracking-wider text-white">
                {item.title}
              </h4>

              {/* Description */}
              <p className="font-body text-xs sm:text-sm text-[#a1a1a5] leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Bottom Subtle Pill Telemetry */}
            <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-white/40">
              <span>SONAWANE STANDARD</span>
              <span className="text-white/70 font-bold group-hover:text-white transition-colors">PRO TIER ✓</span>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
