import React from 'react';
import { 
  Award, 
  SunMedium, 
  Video, 
  Droplet, 
  Car, 
  ShieldCheck, 
  Navigation, 
  PhoneCall,
  Clock,
  Sparkles
} from 'lucide-react';
import { OwnerSettings } from '../../types';

interface ArenaFacilitiesProps {
  settings: OwnerSettings;
}

export const ArenaFacilities: React.FC<ArenaFacilitiesProps> = ({ settings }) => {
  const specs = [
    {
      icon: <Award className="w-5 h-5 text-[#FF6A00]" />,
      title: '50mm Cricket Astroturf',
      desc: 'High-density monofilament turf with calibrated rubber shockpad for consistent ball bounce and joint protection.'
    },
    {
      icon: <SunMedium className="w-5 h-5 text-[#FF6A00]" />,
      title: '500-Lux Anti-Glare Floodlights',
      desc: 'Uniform high-intensity lighting engineered specifically for night cricket with zero blind spots.'
    },
    {
      icon: <Video className="w-5 h-5 text-[#00B6C8]" />,
      title: 'Wooden Stumps & Bails Included',
      desc: 'Regulation wooden wickets, bails, umpire counter, and match balls provided free on request.'
    },
    {
      icon: <Droplet className="w-5 h-5 text-[#00B6C8]" />,
      title: 'Changing Rooms & RO Water',
      desc: 'Clean sanitised washrooms, secure player lockers, and unlimited chilled RO drinking water.'
    },
    {
      icon: <Car className="w-5 h-5 text-[#FF6A00]" />,
      title: 'Secure On-Site Parking',
      desc: 'Dedicated free parking facility accommodating over 30 cars and 60 two-wheelers with security.'
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      title: 'High Ceiling Rebound Netting',
      desc: 'Heavy-gauge ceiling and 360° perimeter netting ensures zero lost balls and fast wall rebounds.'
    }
  ];

  return (
    <section className="py-16 border-t border-white/10 bg-[#16181b] font-body text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Heading */}
        <div className="max-w-xl space-y-2">
          <span className="text-xs uppercase tracking-wider text-[#ff7a00] font-bold block font-headline">
            ARENA INFRASTRUCTURE
          </span>
          <h2 className="text-3xl sm:text-4xl font-headline font-black text-white uppercase tracking-tight">
            Built for Competitive Matches & Tournaments
          </h2>
          <p className="text-neutral-400 text-sm leading-relaxed">
            Every specification at Sonawane's Multi Sport Turf is built for intense box cricket & football matches, guaranteeing maximum grip and player comfort.
          </p>
        </div>

        {/* 6-Card Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {specs.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-[#1e2023] border border-white/10 hover:border-[#ff7a00]/50 shadow-xl transition-all space-y-3 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-base font-bold text-white uppercase font-headline">{item.title}</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Location & Directions Banner (The Nova Club Deep Obsidian + Orange) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#111317] border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl text-white">
          <div className="space-y-1.5">
            <span className="text-xs uppercase tracking-wider text-[#ff7a00] font-bold block font-headline">
              VISIT SONAWANE'S TURF TODAY • NASHIK
            </span>
            <h3 className="text-lg sm:text-2xl font-black text-white uppercase font-headline tracking-wide">
              {settings.address}
            </h3>
            <p className="text-xs text-neutral-400">
              Direct Desk: <span className="text-white font-bold">{settings.phone}</span> • WhatsApp Support: <span className="text-[#ff7a00] font-bold">{settings.whatsapp}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(settings.address)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider transition-all"
            >
              <Navigation className="w-4 h-4 text-[#ff7a00]" />
              <span>Get Directions</span>
            </a>

            <a
              href={`tel:${settings.phone}`}
              className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#ff7a00] to-amber-600 hover:from-amber-600 hover:to-[#ff7a00] text-white text-xs font-black uppercase tracking-wider shadow-[0_4px_16px_rgba(255,122,0,0.3)] transition-all active:scale-95"
            >
              <PhoneCall className="w-4 h-4 fill-white" />
              <span>Call Reception</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
