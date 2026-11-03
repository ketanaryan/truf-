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
      icon: <Award className="w-5 h-5 text-emerald-400" />,
      title: 'FIFA Certified Astroturf',
      desc: '50mm dual-tone monofilament grass with shock-absorbing sub-base to protect knees and ankles.'
    },
    {
      icon: <SunMedium className="w-5 h-5 text-amber-400" />,
      title: '500-Lux LED Floodlights',
      desc: 'Zero-shadow broadcast-grade Philips sports lighting for high-speed night matches.'
    },
    {
      icon: <Video className="w-5 h-5 text-emerald-400" />,
      title: '4K Match Recording & Reels',
      desc: 'High-mount 4K camera system capturing match highlights, goals, and penalty drama.'
    },
    {
      icon: <Droplet className="w-5 h-5 text-cyan-400" />,
      title: 'Changing Rooms & RO Water',
      desc: 'Clean sanitised shower suites, lockers, and complimentary chilled purified drinking water.'
    },
    {
      icon: <Car className="w-5 h-5 text-amber-400" />,
      title: 'Secure On-Site Parking',
      desc: 'Dedicated free parking facility accommodating over 30 cars and 60 two-wheelers with security.'
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      title: 'Perimeter Netting & Dugouts',
      desc: 'Heavy-gauge ceiling and boundary nets to prevent ball losses, plus shaded team benches.'
    }
  ];

  return (
    <section className="py-16 border-t border-[#1a3322] bg-[#060c08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Heading */}
        <div className="max-w-xl space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block">
            ARENA INFRASTRUCTURE
          </span>
          <h2 className="text-2xl sm:text-4xl font-black font-display text-white uppercase italic leading-tight">
            Built for Competitive Matches & Tournaments
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
            Every specification at Battlegrounds is built to commercial tournament standards.
          </p>
        </div>

        {/* 6-Card Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {specs.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#0b160f] border border-[#1d3824] hover:border-emerald-500/50 transition-all space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-[#122417] border border-[#21422a] flex items-center justify-center">
                {item.icon}
              </div>
              <h3 className="text-base font-bold text-white uppercase">{item.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Location & Directions Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1a12] border-2 border-[#1f3d28] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block">
              VISIT BATTLEGROUNDS TODAY
            </span>
            <h3 className="text-lg sm:text-2xl font-black text-white uppercase font-display">
              {settings.address}
            </h3>
            <p className="text-xs text-zinc-400 font-mono">
              Direct Desk: {settings.phone} • WhatsApp Support: {settings.whatsapp}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(settings.address)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#152a1c] border border-[#24472f] hover:border-emerald-400 text-white text-xs font-bold uppercase tracking-wider transition-all"
            >
              <Navigation className="w-4 h-4 text-emerald-400" />
              <span>Get Directions</span>
            </a>

            <a
              href={`tel:${settings.phone}`}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-green-500 text-black text-xs font-black uppercase tracking-wider shadow-lg hover:from-emerald-300 hover:to-green-400 transition-all"
            >
              <PhoneCall className="w-4 h-4 fill-black" />
              <span>Call Reception</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
