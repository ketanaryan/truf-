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
  const [sport, setSport] = useState<SportType>('Football 7v7');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [showGooglePrompt, setShowGooglePrompt] = useState(false);

  const googleReviewUrl = settings?.googleReviewUrl || 'https://search.google.com/local/writereview?placeid=battlegrounds-arena';

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
    <section className="py-16 border-t border-[#1a3322] bg-[#070e0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block mb-1">
              VERIFIED MATCH REVIEWS & GOOGLE RATINGS
            </span>
            <h2 className="text-2xl sm:text-4xl font-black font-display text-white uppercase italic">
              Loved by 1,400+ Squads & Captains
            </h2>
            <p className="text-zinc-400 text-sm max-w-xl">
              From corporate leagues and weekend derbies to evening pickleball rallies, 
              here is what teams say about playing at Battlegrounds.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 bg-[#0d1a12] p-3 rounded-2xl border border-[#1d3824]">
              <div className="text-3xl font-black text-amber-400 font-mono">4.9</div>
              <div className="text-xs">
                <div className="flex text-amber-400">
                  {'★★★★★'.split('').map((s, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <span className="text-zinc-400 text-[11px] font-mono">1,480+ Match Ratings</span>
              </div>
            </div>

            <a
              href={googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-xs uppercase tracking-wider font-mono shadow-lg transition-all active:scale-95"
            >
              <Star className="w-4 h-4 fill-black" />
              <span>Rate 5★ on Google</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#122417] hover:bg-[#1a3823] text-emerald-300 hover:text-white border border-[#20442a] font-extrabold text-xs uppercase tracking-wider font-mono transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Write Review</span>
            </button>
          </div>
        </div>

        {/* Google Boost Callout Banner */}
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#0c1f13] via-[#09170e] to-[#07120b] border-2 border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
              <Star className="w-6 h-6 fill-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                <span>Support Battlegrounds Arena on Google Maps</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] lowercase font-normal">verified</span>
              </h3>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                Every review helps local athletes find the best floodlit pitch in town. Takes under 30 seconds!
              </p>
            </div>
          </div>

          <a
            href={googleReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs font-mono uppercase tracking-wider shrink-0 transition-all active:scale-95 shadow-md"
          >
            <span>Post Google Review</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="p-5 rounded-2xl bg-[#0b160f] border border-[#1d3824] hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-4 shadow-sm"
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
                  <span className="text-[11px] text-emerald-400 font-mono block">{r.team}</span>
                  <span className="text-[10px] text-zinc-500 font-mono">{r.sport}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[10px] font-mono">Verified</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Review Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#0c1810] border-2 border-[#1f3d28] rounded-3xl w-full max-w-lg p-6 sm:p-7 shadow-2xl relative font-mono text-xs animate-in fade-in zoom-in-95 space-y-4">
            
            <div className="flex items-center justify-between border-b border-[#1b3623] pb-3">
              <div>
                <h3 className="text-base font-extrabold text-white uppercase tracking-wider">
                  Write a Match Review
                </h3>
                <p className="text-zinc-400 text-xs">
                  Share your experience with 1,400+ captains & players
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-xl bg-[#14281a] hover:bg-[#1a3523] text-zinc-300 hover:text-white flex items-center justify-center border border-[#21422a]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {showGooglePrompt ? (
              <div className="py-4 space-y-4 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-extrabold text-white uppercase">Thank You, Captain!</h4>
                  <p className="text-xs text-zinc-300 max-w-md mx-auto">
                    Your review has been recorded! To help our turf facility reach more athletes, please also copy it to our official Google Maps profile:
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#09140d] border border-amber-500/40 text-left space-y-2">
                  <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
                    {'★★★★★'.split('').map((s, idx) => (
                      <span key={idx}>{s}</span>
                    ))}
                    <span className="text-white ml-2">"{comment}"</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 block">— {name} ({team})</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                  <a
                    href={googleReviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleCloseModal}
                    className="w-full sm:flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Star className="w-4 h-4 fill-black" />
                    <span>Post on Google Reviews ↗</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#122417] text-zinc-300 hover:text-white border border-[#204029] font-bold"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Your Rating</label>
                  <div className="flex items-center gap-2 text-2xl cursor-pointer">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`transition-transform hover:scale-110 ${star <= rating ? 'text-amber-400' : 'text-zinc-700'}`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="text-xs text-amber-400 font-bold ml-2">{rating} / 5 Stars</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-300 font-bold block mb-1">Captain Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Sahil Khan"
                      className="w-full px-3 py-2 rounded-xl bg-[#09140d] border border-[#204229] text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-300 font-bold block mb-1">Squad / Club</label>
                    <input
                      type="text"
                      value={team}
                      onChange={e => setTeam(e.target.value)}
                      placeholder="e.g. Thunder Strikers"
                      className="w-full px-3 py-2 rounded-xl bg-[#09140d] border border-[#204229] text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Sport Played</label>
                  <select
                    value={sport}
                    onChange={e => setSport(e.target.value as SportType)}
                    className="w-full px-3 py-2 rounded-xl bg-[#09140d] border border-[#204229] text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="Football 7v7">Football 7v7</option>
                    <option value="Box Cricket">Box Cricket</option>
                    <option value="Football 5v5">Football 5v5</option>
                    <option value="Pickleball">Pickleball</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Your Match Feedback *</label>
                  <textarea
                    required
                    rows={3}
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="How was the turf grass, floodlight brightness, bounce, ball return, or facility staff?"
                    className="w-full px-3 py-2 rounded-xl bg-[#09140d] border border-[#204229] text-white focus:outline-none focus:border-emerald-400 resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#1b3623]">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 rounded-xl bg-[#122417] text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-300 text-black font-extrabold uppercase tracking-wider shadow-md active:scale-95"
                  >
                    Submit Review
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
