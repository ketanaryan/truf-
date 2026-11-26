import React from 'react';
import { Check, Sparkles, Zap, ArrowRight, ShieldCheck, Flame } from 'lucide-react';

interface NovaTierSystemProps {
  onSelectBooking: () => void;
}

export const NovaTierSystem: React.FC<NovaTierSystemProps> = ({ onSelectBooking }) => {
  const tiers = [
    {
      id: 'single',
      name: 'TIER 01',
      title: 'SINGLE MATCH PASS',
      price: '₹600',
      period: '/ Hour (Day) • ₹800 (Night)',
      isFeatured: false,
      badge: 'POPULAR FOR WALK-INS',
      features: [
        '60 mins exclusive arena access',
        'Regulation wooden stumps & bails provided',
        'Heavy tennis & tape balls included',
        'Instant scannable Reception Gate QR pass',
        'Direct 0% UPI fee to Kiran Sonawane'
      ],
      cta: 'BOOK MATCH SLOT'
    },
    {
      id: 'squad',
      name: 'TIER 02',
      title: 'WEEKEND WARRIOR SQUAD',
      price: '₹2,400',
      period: '/ 4 Matches (1 Month Valid)',
      isFeatured: true,
      badge: 'MOST BOUGHT',
      features: [
        '4 match slots for your regular squad',
        'Priority floodlight booking (5 PM - 11 PM)',
        'Free extra cricket balls & batting gloves',
        'Reserved team dugout & storage locker',
        'Listed on Nashik Captains Directory'
      ],
      cta: 'RESERVE SQUAD PASS'
    },
    {
      id: 'tournament',
      name: 'TIER 03',
      title: 'TOURNAMENT & LEAGUE CUP',
      price: '₹6,999',
      period: '/ Full Day Buyout',
      isFeatured: false,
      badge: 'CHAMPIONSHIP PACKAGE',
      features: [
        'Full day dedicated pitch reservation',
        'Knockout tournament fixture coordination',
        'Dedicated umpire counter & match balls',
        'Trophy presentation area & sound system',
        'Complete facility privatization'
      ],
      cta: 'WHATSAPP CONCIERGE'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20 font-body">
      
      {/* Header */}
      <div className="space-y-2 mb-10 sm:mb-14 text-center">
        <div className="inline-flex items-center gap-2 text-[#ff7a00] font-headline font-bold text-xs uppercase tracking-[0.24em]">
          <Sparkles className="w-4 h-4 text-[#ff7a00]" />
          <span>PASS & PRICING ARCHITECTURE</span>
        </div>
        <h3 className="font-headline font-black italic text-3xl sm:text-5xl uppercase tracking-tight text-white">
          THE TIER <span className="text-[#ff7a00]">SYSTEM</span>
        </h3>
        <p className="text-[#a1a1a5] text-xs sm:text-sm font-light max-w-lg mx-auto">
          Transparent match pricing with 0% gateway commission. Pay directly via UPI or at the reception counter.
        </p>
      </div>

      {/* 3-Column Tier Grid (The Nova Club Standard) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className={`relative rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
              tier.isFeatured
                ? 'bg-[#282a2d] border-2 border-[#ff7a00] shadow-[0_20px_50px_rgba(255,122,0,0.25)] md:-translate-y-2'
                : 'bg-[#1e2023] border border-white/8 hover:border-white/15 shadow-[0_12px_32px_rgba(0,0,0,0.4)]'
            }`}
          >
            {/* Top Subtle Diagonal Line Texture on Featured Card */}
            {tier.isFeatured && (
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff7a00]/15 rounded-full blur-2xl pointer-events-none" />
            )}

            <div>
              {/* Badge & Tier Identifier */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="text-[11px] font-mono tracking-[0.2em] uppercase font-bold text-white/50">
                  {tier.name}
                </span>

                <span 
                  className={`px-3 py-1 rounded-full text-[10px] font-headline font-black uppercase tracking-wider ${
                    tier.isFeatured 
                      ? 'bg-[#ff7a00] text-white shadow-md' 
                      : 'bg-white/5 text-white/70 border border-white/10'
                  }`}
                >
                  {tier.badge}
                </span>
              </div>

              {/* Title */}
              <h4 className="font-headline font-black italic text-xl sm:text-2xl uppercase tracking-tight text-white">
                {tier.title}
              </h4>

              {/* Price Display */}
              <div className="mt-4 mb-6 pb-6 border-b border-white/10">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-headline font-black italic text-4xl sm:text-5xl text-white">
                    {tier.price}
                  </span>
                </div>
                <span className="text-xs text-[#a1a1a5] font-light block mt-1">
                  {tier.period}
                </span>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-3 mb-8 text-xs text-[#e2e2e6] font-light">
                {tier.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      tier.isFeatured ? 'bg-[#ff7a00] text-white' : 'bg-white/10 text-white/80'
                    }`}>
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <div>
              <button
                onClick={() => {
                  if (tier.id === 'tournament') {
                    window.open(`https://api.whatsapp.com/send?phone=919403564779&text=${encodeURIComponent("Hello Kiran Sonawane, I want to inquire about Tournament / Full Day Booking at Sonawane's Turf.")}`, '_blank');
                  } else {
                    onSelectBooking();
                  }
                }}
                className={`w-full py-4 rounded-full font-headline font-bold text-xs uppercase tracking-[0.18em] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  tier.isFeatured
                    ? 'bg-[#ff7a00] hover:bg-[#ff8a1a] text-white shadow-[0_10px_28px_rgba(255,122,0,0.4)] hover:scale-105 active:scale-95'
                    : 'bg-white/10 hover:bg-white/15 text-white border border-white/10 hover:border-white/20 active:scale-95'
                }`}
              >
                <span>{tier.cta}</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Bottom Venue Contact Note */}
      <div className="mt-10 p-4 rounded-2xl bg-[#1e2023] border border-white/5 text-center text-xs text-white/50 font-mono">
        <span>📍 Plot No. 1, Sonawane Mala, Chetana Nagar, Rane Nagar, Nashik • Desk: +91 94035 64779</span>
      </div>

    </section>
  );
};
