import React, { useState } from 'react';
import { Trophy, ArrowRight, Calendar, Users, Zap, CheckCircle2, X } from 'lucide-react';

interface NovaTournamentBannerProps {
  onRegisterClick?: () => void;
}

export const NovaTournamentBanner: React.FC<NovaTournamentBannerProps> = ({ onRegisterClick }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [squadName, setSquadName] = useState('');
  const [captainName, setCaptainName] = useState('');
  const [captainPhone, setCaptainPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!squadName.trim() || !captainName.trim() || !captainPhone.trim()) return;

    // Direct WhatsApp message to Kiran Sonawane for tournament entry
    const text = encodeURIComponent(
      `🏆 *SONAWANE SLAM 2026 - TOURNAMENT REGISTRATION*\n` +
      `-----------------------------------------\n` +
      `Squad Name: *${squadName.trim()}*\n` +
      `Captain: *${captainName.trim()}*\n` +
      `Phone: *${captainPhone.trim()}*\n` +
      `Format: Box Cricket / Football Night Championship\n` +
      `Entry Fee: ₹1,500\n` +
      `-----------------------------------------\n` +
      `Hello Kiran Sonawane, please register our squad for the upcoming tournament at Sonawane's Turf!`
    );
    window.open(`https://api.whatsapp.com/send?phone=919403564779&text=${text}`, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      
      {/* Warm Ambient Tournament Banner (The Nova Club Standard) */}
      <div className="relative overflow-hidden rounded-3xl bg-[#23201d] border border-orange-500/30 p-6 sm:p-9 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
        
        {/* Right Radial Orange Ambient Glow */}
        <div className="absolute top-1/2 -right-20 -translate-y-1/2 w-96 h-96 bg-[#ff7a00]/25 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="space-y-3 max-w-2xl">
            {/* Eyebrow */}
            <div className="flex items-center gap-2 text-orange-400 font-headline font-bold text-xs uppercase tracking-[0.24em]">
              <Trophy className="w-4 h-4 text-[#ff7a00]" />
              <span>THE AUCTION LEAGUE • BOX CRICKET & 5V5 NIGHT CUP</span>
            </div>

            {/* Title */}
            <h2 className="font-headline font-black italic text-3xl sm:text-5xl uppercase tracking-tight text-white leading-none">
              SONAWANE SLAM <span className="text-[#ff7a00]">2026</span>
            </h2>

            {/* Subtitle / Details */}
            <p className="text-white/70 text-xs sm:text-sm font-light leading-relaxed">
              Squad entry • ₹1,500 registration • Floodlit knockout rounds • Player auction & championship trophy with cash prizes.
            </p>
          </div>

          {/* Action Button */}
          <div className="shrink-0">
            <button
              onClick={() => {
                if (onRegisterClick) {
                  onRegisterClick();
                } else {
                  setModalOpen(true);
                }
              }}
              className="group flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#ff7a00] hover:bg-[#ff8a1a] text-white font-headline font-bold text-xs uppercase tracking-[0.18em] shadow-[0_10px_30px_rgba(255,122,0,0.4)] hover:shadow-[0_14px_40px_rgba(255,122,0,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <span>Register as a squad</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
            </button>
          </div>

        </div>
      </div>

      {/* Quick Tournament Registration Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#1c1e22] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-white space-y-5 font-headline">
            
            <button 
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <span className="text-[#ff7a00] text-xs font-bold uppercase tracking-wider block">
                Official Tournament Entry
              </span>
              <h3 className="text-2xl font-black italic uppercase text-white">
                Register for Sonawane Slam 2026
              </h3>
              <p className="text-white/60 text-xs font-body">
                Knockout box cricket tournament at Sonawane's Turf, Rane Nagar.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-white">Registration Forwarded!</h4>
                <p className="text-xs text-white/70 font-body">
                  Your squad details were sent to Kiran Sonawane (+91 94035 64779). We will reach out with the fixture schedule!
                </p>
                <button
                  onClick={() => setModalOpen(false)}
                  className="mt-3 px-6 py-2 rounded-full bg-[#ff7a00] text-white text-xs font-bold uppercase tracking-wider"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 font-body text-xs">
                <div>
                  <label className="text-white/70 block mb-1 font-semibold uppercase text-[11px]">
                    Squad / Team Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={squadName}
                    onChange={e => setSquadName(e.target.value)}
                    placeholder="e.g. Nashik Strikers XI"
                    className="w-full px-4 py-3 rounded-xl bg-[#141619] border border-white/10 text-white focus:outline-none focus:border-[#ff7a00]"
                  />
                </div>

                <div>
                  <label className="text-white/70 block mb-1 font-semibold uppercase text-[11px]">
                    Captain Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={captainName}
                    onChange={e => setCaptainName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-3 rounded-xl bg-[#141619] border border-white/10 text-white focus:outline-none focus:border-[#ff7a00]"
                  />
                </div>

                <div>
                  <label className="text-white/70 block mb-1 font-semibold uppercase text-[11px]">
                    Captain WhatsApp Mobile *
                  </label>
                  <input
                    type="tel"
                    required
                    value={captainPhone}
                    onChange={e => setCaptainPhone(e.target.value)}
                    placeholder="e.g. 98201 88492"
                    className="w-full px-4 py-3 rounded-xl bg-[#141619] border border-white/10 text-white font-mono focus:outline-none focus:border-[#ff7a00]"
                  />
                </div>

                <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-200 text-[11px]">
                  <span>🏆 Entry Fee: ₹1,500 per squad • Paid directly to Kiran Sonawane at venue or UPI.</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[#ff7a00] hover:bg-[#ff8a1a] text-white font-headline font-bold text-xs uppercase tracking-[0.2em] shadow-lg shadow-orange-500/30 transition-all cursor-pointer"
                >
                  Submit Registration →
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
