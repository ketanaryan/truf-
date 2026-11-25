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
      title: 'FIFA Certified Astroturf',
      desc: '50mm dual-tone monofilament grass with shock-absorbing sub-base to protect knees and ankles.'
    },
    {
      icon: <SunMedium className="w-5 h-5 text-[#FF6A00]" />,
      title: '500-Lux LED Floodlights',
      desc: 'Zero-shadow broadcast-grade Philips sports lighting for high-speed night matches.'
    },
    {
      icon: <Video className="w-5 h-5 text-[#00B6C8]" />,
      title: '4K Match Recording & Reels',
      desc: 'High-mount 4K camera system capturing match highlights, goals, and penalty drama.'
    },
    {
      icon: <Droplet className="w-5 h-5 text-[#00B6C8]" />,
      title: 'Changing Rooms & RO Water',
      desc: 'Clean sanitised shower suites, lockers, and complimentary chilled purified drinking water.'
    },
    {
      icon: <Car className="w-5 h-5 text-[#FF6A00]" />,
      title: 'Secure On-Site Parking',
      desc: 'Dedicated free parking facility accommodating over 30 cars and 60 two-wheelers with security.'
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      title: 'Perimeter Netting & Dugouts',
      desc: 'Heavy-gauge ceiling and boundary nets to prevent ball losses, plus shaded team benches.'
    }
  ];

  return (
    <section className="py-16 border-t border-slate-200 bg-[#F2F4F7] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Heading */}
        <div className="max-w-xl space-y-2">
          <span className="text-xs uppercase tracking-wider text-[#FF6A00] font-bold block">
            ARENA INFRASTRUCTURE
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-[#111827] uppercase leading-tight">
            Built for Competitive Matches & Tournaments
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Every specification at Battlegrounds is built to commercial tournament standards, guaranteeing maximum grip and safety.
          </p>
        </div>

        {/* 6-Card Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {specs.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-[#FF6A00] shadow-sm hover:shadow-md transition-all space-y-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200/80 flex items-center justify-center">
                {item.icon}
              </div>
              <h3 className="text-base font-bold text-[#111827] uppercase">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Location & Directions Banner (Hatrick Grounds Deep Navy + Orange) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0B1D2D] border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl text-white">
          <div className="space-y-1.5">
            <span className="text-xs uppercase tracking-wider text-[#FF6A00] font-bold block">
              VISIT BATTLEGROUNDS TODAY
            </span>
            <h3 className="text-lg sm:text-2xl font-black text-white uppercase font-display tracking-wide">
              {settings.address}
            </h3>
            <p className="text-xs text-slate-300">
              Direct Desk: {settings.phone} • WhatsApp Support: {settings.whatsapp}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(settings.address)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-all"
            >
              <Navigation className="w-4 h-4 text-[#FF6A00]" />
              <span>Get Directions</span>
            </a>

            <a
              href={`tel:${settings.phone}`}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#FF6A00] hover:bg-[#E65F00] text-white text-xs font-black uppercase tracking-wider shadow-lg transition-all active:scale-95"
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
