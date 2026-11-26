import React, { useState } from 'react';
import { Star, ShieldCheck, ThumbsUp, ExternalLink, Plus, X, MessageSquare, CheckCircle2 } from 'lucide-react';
import { OwnerSettings, CustomerReview, SportType } from '../../types';
import { getStoredReviews, addCustomerReview } from '../../data/storage';

interface CustomerReviewsProps {
  settings?: OwnerSettings;
}

export const CustomerReviews: React.FC<CustomerReviewsProps> = ({ settings }) => {
  const [reviews, setReviews] = useState<CustomerReview[]>(getStoredReviews());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [team, setTeam] = useState('');
  const [sport, setSport] = useState<SportType>('Box Cricket');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [showGooglePrompt, setShowGooglePrompt] = useState(false);

  const googleReviewUrl = settings?.googleReviewUrl || "https://www.google.com/maps/place/Sonawane's+Multi+Sport+Turf/@19.9602879,73.7707331,17z/data=!4m8!3m7!1s0x3bddebed03becdf1:0x868ac5e0f1c6c8bf!8m2!3d19.9602879!4d73.7707331!9m1!1b1!16s%2Fg%2F11k4jz57b_";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    const newRev: CustomerReview = {
      id: 'rev-' + Date.now(),
      name: name.trim(),
      team: team.trim() || 'Arena Athlete',
      sport,
      rating,
      date: 'Just now',
      comment: comment.trim(),
      verified: true
    };

    const updated = addCustomerReview(newRev);
    setReviews(updated);
    setShowGooglePrompt(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setShowGooglePrompt(false);
    setName('');
    setTeam('');
    setComment('');
    setRating(5);
  };

  return (
    <section className="py-16 pb-24 sm:pb-28 border-t border-white/10 bg-[#16181b] font-body text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#ff7a00] font-bold block mb-1 font-headline">
              VERIFIED MATCH REVIEWS & GOOGLE RATINGS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-headline text-white uppercase leading-tight">
              Player Reviews & Ratings
            </h2>
            <p className="text-neutral-400 text-sm max-w-xl">
              From competitive box cricket matches to 5v5 football showdowns, 
              here is what teams and players say about Sonawane's Multi Sport Turf in Nashik.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 bg-[#1e2023] p-3.5 rounded-2xl border border-white/10 shadow-lg">
              <div className="text-3xl font-black text-[#ff7a00] font-mono">4.0</div>
              <div className="text-xs">
                <div className="flex text-amber-400">
                  {'★★★★☆'.split('').map((s, i) => (
                    <span key={i}>{s}</span>
                  ))}
                </div>
                <span className="text-neutral-400 text-[11px] font-medium">22 Google Reviews</span>
              </div>
            </div>

            <a
              href={googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3.5 rounded-full bg-gradient-to-r from-[#ff7a00] to-amber-600 hover:from-amber-600 hover:to-[#ff7a00] text-white font-extrabold text-xs uppercase tracking-wider shadow-[0_4px_16px_rgba(255,122,0,0.3)] transition-all active:scale-95"
            >
              <Star className="w-4 h-4 fill-white" />
              <span>Rate 5★ on Google</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3.5 rounded-full bg-white/5 hover:bg-white/10 text-white font-extrabold text-xs uppercase tracking-wider border border-white/10 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#ff7a00]" />
              <span>Write Review</span>
            </button>
          </div>
        </div>

        {/* Google Boost Callout Banner (The Nova Club Ambient Glow) */}
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-[#23201d] via-[#1e2023] to-[#23201d] border border-orange-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xl text-white">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#ff7a00]/20 border border-[#ff7a00]/40 flex items-center justify-center text-[#ff7a00] shrink-0">
              <Star className="w-6 h-6 fill-[#ff7a00]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2 font-headline">
                <span>Support Sonawane's Multi Sport Turf on Google Maps</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] lowercase font-sans font-normal">verified</span>
              </h3>
              <p className="text-xs text-neutral-300 mt-0.5">
                Every review helps local athletes find the best floodlit pitch in town. Takes under 30 seconds!
              </p>
            </div>
          </div>

          <a
            href={googleReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#ff7a00] hover:bg-amber-600 text-white font-extrabold text-xs uppercase tracking-wider shrink-0 shadow-[0_4px_16px_rgba(255,122,0,0.3)] active:scale-95 transition-all"
          >
            <span>Post Google Review</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Review Cards (The Nova Club Obsidian Elevated Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="p-6 rounded-3xl bg-[#1e2023] border border-white/10 hover:border-[#ff7a00]/50 transition-all flex flex-col justify-between space-y-4 shadow-xl group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400 text-sm">
                    {Array.from({ length: r.rating }).map((_, idx) => (
                      <span key={idx}>★</span>
                    ))}
                  </div>
                  <span className="text-xs text-neutral-400 font-medium">{r.date}</span>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed italic">
                  "{r.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-white font-headline">{r.name}</h4>
                  <span className="text-[11px] text-[#ff7a00] font-bold block">{r.team}</span>
                  <span className="text-[10px] text-neutral-400">{r.sport}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-neutral-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[10px] text-emerald-400">Verified</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Review Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#1e2023] border border-white/15 rounded-3xl w-full max-w-lg p-6 sm:p-7 shadow-2xl relative text-xs animate-in fade-in zoom-in-95 space-y-4 text-white font-body">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-white uppercase tracking-wider font-headline">
                  Write a Match Review
                </h3>
                <p className="text-neutral-400 text-xs">
                  Share your experience with 1,400+ captains & players
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 flex items-center justify-center border border-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {showGooglePrompt ? (
              <div className="py-4 space-y-4 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-extrabold text-white uppercase font-headline">Thank You, Captain!</h4>
                  <p className="text-xs text-neutral-400 max-w-md mx-auto">
                    Your review has been recorded! To help our turf facility reach more athletes, please also copy it to our official Google Maps profile:
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-orange-500/30 text-left space-y-2">
                  <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
                    {'★★★★★'.split('').map((s, idx) => (
                      <span key={idx}>{s}</span>
                    ))}
                    <span className="text-white ml-2 font-medium">"{comment}"</span>
                  </div>
                  <span className="text-xs text-neutral-400 block">— {name} ({team})</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                  <a
                    href={googleReviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleCloseModal}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#FF6A00] hover:bg-[#E65F00] text-white font-black uppercase tracking-wider shadow-lg transition-all"
                  >
                    <span>Paste on Google Maps</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-3 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sahil Khan"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-[#FF6A00]"
                    />
                  </div>
                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Team / Squad Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Red Devils FC"
                      value={team}
                      onChange={e => setTeam(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-[#FF6A00]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Match Format</label>
                    <div className="w-full px-3 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 font-semibold text-xs">
                      🏏 Box Cricket
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Rating</label>
                    <div className="flex items-center gap-1.5 pt-1.5 text-2xl cursor-pointer">
                      {[1, 2, 3, 4, 5].map((starVal) => (
                        <button
                          key={starVal}
                          type="button"
                          onClick={() => setRating(starVal)}
                          className={starVal <= rating ? 'text-amber-500' : 'text-slate-300'}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1">Your Match Feedback *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Tell captains about pitch bounce, floodlights, changing rooms, and turf grip..."
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-[#FF6A00]"
                  ></textarea>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#FF6A00] hover:bg-[#E65F00] text-white font-extrabold uppercase shadow-md transition-all active:scale-95"
                  >
                    Submit Review & Rate
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </section>
  );
};
