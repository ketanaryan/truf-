import React from 'react';
import { Star, ShieldCheck, ThumbsUp } from 'lucide-react';

export const CustomerReviews: React.FC = () => {
  const reviews = [
    {
      name: 'Karan Mehra',
      team: 'Viper FC (7v7)',
      rating: 5,
      date: 'Played 2 days ago',
      comment: 'Best turf in the western corridor. The floodlights have zero blind spots or glare, and the 50mm grass with rubber infill protects your knees during high-speed cuts.'
    },
    {
      name: 'Vikram Rajput',
      team: 'Gully Blasters Box Cricket',
      rating: 5,
      date: 'Played yesterday',
      comment: 'Booked Pitch A for 2 hours cricket derby. High perimeter nets mean not a single tennis ball is lost. Chilled water and clean dugouts were top notch!'
    },
    {
      name: 'Sneha Rao',
      team: 'Smash Masters Pickleball',
      rating: 5,
      date: 'Weekly Regular',
      comment: 'The rebound cage on Pitch B makes fast 5v5 football and pickleball so much fun. Booking online with token deposit was seamless. Scannable match pass worked instantly at the counter.'
    }
  ];

  return (
    <section className="py-16 border-t border-[#1a3322] bg-[#070e0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block mb-1">
              VERIFIED MATCH REVIEWS
            </span>
            <h2 className="text-2xl sm:text-4xl font-black font-display text-white uppercase italic">
              Loved by 1,400+ Squads & Captains
            </h2>
            <p className="text-zinc-400 text-sm max-w-xl">
              From corporate leagues and weekend derbies to evening pickleball rallies, 
              here is what teams say about playing at Battlegrounds.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#0d1a12] p-3 rounded-2xl border border-[#1d3824]">
            <div className="text-3xl font-black text-amber-400 font-mono">4.9</div>
            <div className="text-xs">
              <div className="flex text-amber-400">
                {'★★★★★'.split('').map((s, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <span className="text-zinc-400 text-[11px]">1,480+ Match Ratings</span>
            </div>
          </div>
        </div>

        {/* Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-[#0b160f] border border-[#1d3824] hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400 text-sm">
                    {Array.from({ length: r.rating }).map((_, idx) => (
                      <span key={idx}>★</span>
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">{r.date}</span>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed italic">
                  "{r.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-[#182e1f] flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-white">{r.name}</h4>
                  <span className="text-[11px] text-emerald-400 font-mono">{r.team}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified Player</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
