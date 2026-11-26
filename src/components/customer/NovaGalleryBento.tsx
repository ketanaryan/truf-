import React from 'react';
import { Camera, ShieldCheck, Trophy, Sparkles } from 'lucide-react';

export const NovaGalleryBento: React.FC = () => {
  const images = [
    {
      id: '01',
      title: 'Full Floodlit Box Arena',
      subtitle: '500-lux anti-glare night match illumination',
      span: 'sm:col-span-2 sm:row-span-2 min-h-[340px] sm:min-h-[440px]',
      src: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80',
      badge: 'MAIN ARENA'
    },
    {
      id: '02',
      title: '120ft Rebound Ceiling Netting',
      subtitle: 'High-tension roof nets & zero ball loss boundary',
      span: 'sm:col-span-2 min-h-[200px]',
      src: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
      badge: 'CAGE NETTING'
    },
    {
      id: '03',
      title: 'Match-Grade Wooden Stumps',
      subtitle: 'Regulation wooden bails, stumps & tennis balls',
      span: 'min-h-[200px]',
      src: 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?auto=format&fit=crop&w=800&q=80',
      badge: 'PRO GEAR'
    },
    {
      id: '04',
      title: 'Dugout & Player Locker Zone',
      subtitle: 'Spacious 12-seat dugouts with clean secure lockers',
      span: 'min-h-[200px]',
      src: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=800&q=80',
      badge: 'DUGOUT'
    },
    {
      id: '05',
      title: '50mm Monofilament Astroturf',
      subtitle: 'Dense shockpad grass for true ball bounce & player grip',
      span: 'min-h-[200px]',
      src: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
      badge: 'TURF PITCH'
    },
    {
      id: '06',
      title: '5v5 Football & Night Showdowns',
      subtitle: 'Multi-sport format with heavy boundary nets',
      span: 'min-h-[200px]',
      src: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=800&q=80',
      badge: 'FOOTBALL 5v5'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 font-body">
      
      {/* Header */}
      <div className="space-y-2 mb-8 sm:mb-10 text-center">
        <div className="inline-flex items-center gap-2 text-[#ff7a00] font-headline font-bold text-xs uppercase tracking-[0.24em]">
          <Camera className="w-4 h-4 text-[#ff7a00]" />
          <span>INSIDE SONAWANE'S</span>
        </div>
        <h3 className="font-headline font-black italic text-3xl sm:text-5xl uppercase tracking-tight text-white">
          ARENA <span className="text-[#ff7a00]">GALLERY</span>
        </h3>
        <p className="text-neutral-400 text-xs sm:text-sm font-light max-w-lg mx-auto">
          High-definition visual tour of Sonawane’s Multi Sport Turf facilities in Rane Nagar, Nashik.
        </p>
      </div>

      {/* Bento Grid (The Nova Club Standard) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {images.map((item) => (
          <div
            key={item.id}
            className={`group relative overflow-hidden rounded-3xl bg-[#1e2023] border border-white/10 hover:border-[#ff7a00]/50 p-2 transition-all duration-500 hover:-translate-y-1 shadow-[0_12px_30px_rgba(0,0,0,0.5)] ${item.span}`}
          >
            {/* Image Container with Hover Zoom & Ambient Fallback */}
            <div className="relative w-full h-full overflow-hidden rounded-2xl bg-gradient-to-tr from-[#16181b] via-[#23201d] to-[#1e2023] flex items-center justify-center">
              <img
                src={item.src}
                alt={item.title}
                loading="lazy"
                onError={(e) => {
                  // Gracefully hide broken img tag without showing ugly broken image icon
                  (e.target as HTMLElement).style.display = 'none';
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Dark Gradient Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e1013]/95 via-[#0e1013]/40 to-transparent" />

              {/* Numbered Pill Badge & Category Badge (The Nova Club Signature) */}
              <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                <div className="px-3 py-1 rounded-full bg-black/60 border border-white/15 backdrop-blur-md text-[11px] font-mono font-bold text-white shadow-md">
                  {item.id}
                </div>
                <div className="px-2.5 py-0.5 rounded-full bg-[#ff7a00]/20 border border-orange-500/30 text-[10px] font-mono font-bold text-[#ff7a00] uppercase tracking-wider">
                  {item.badge}
                </div>
              </div>

              {/* Bottom Caption without awkward truncation */}
              <div className="absolute bottom-3 inset-x-3 space-y-1 text-left">
                <h4 className="font-headline font-bold uppercase tracking-wider text-sm sm:text-base text-white group-hover:text-orange-300 transition-colors leading-tight line-clamp-1">
                  {item.title}
                </h4>
                <p className="font-body text-[11px] text-neutral-300 font-light leading-snug line-clamp-2">
                  {item.subtitle}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
