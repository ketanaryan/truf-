import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  MessageCircle, 
  Calendar, 
  Clock, 
  MapPin, 
  Sparkles,
  X
} from 'lucide-react';
import { CommunityLobbyPost, SportType } from '../../types';
import { getTodayString } from '../../data/mockTurfData';

interface MatchFinderBoardProps {
  posts: CommunityLobbyPost[];
  onAddPost: (post: CommunityLobbyPost) => void;
}

export const MatchFinderBoard: React.FC<MatchFinderBoardProps> = ({
  posts,
  onAddPost
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [levelFilter, setLevelFilter] = useState<string>('all');

  const [captainName, setCaptainName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [sport] = useState<SportType>('Box Cricket');
  const [date, setDate] = useState(getTodayString());
  const [timeSlot, setTimeSlot] = useState('08:00 PM - 09:00 PM');
  const [pitchName] = useState('Box Cricket Turf');
  const [playersNeeded, setPlayersNeeded] = useState(2);
  const [costPerPerson, setCostPerPerson] = useState(150);
  const [skillLevel, setSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Competitive' | 'Casual'>('Intermediate');
  const [whatsappContact, setWhatsappContact] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!captainName.trim() || !whatsappContact.trim()) return;

    const newPost: CommunityLobbyPost = {
      id: 'comm-' + Date.now(),
      captainName: captainName.trim(),
      teamName: teamName.trim() || `${captainName.trim()}'s Squad`,
      sport,
      date,
      timeSlot,
      pitchName,
      playersNeeded: Number(playersNeeded),
      costPerPerson: Number(costPerPerson),
      skillLevel,
      whatsappContact: whatsappContact.trim(),
      notes: notes.trim(),
      createdAt: 'Just now'
    };

    onAddPost(newPost);
    setIsModalOpen(false);
    setCaptainName('');
    setTeamName('');
    setNotes('');
  };

  const filtered = posts.filter(p => {
    if (levelFilter === 'all') return true;
    return p.skillLevel.toLowerCase() === levelFilter.toLowerCase();
  });

  return (
    <section id="community-match-finder" className="py-16 border-t border-white/10 bg-[#16181b] font-body text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-[#ff7a00]/30 text-[#ff7a00] text-xs font-bold uppercase tracking-wider font-headline">
              <Sparkles className="w-3.5 h-3.5 text-[#ff7a00]" />
              <span>COMMUNITY PLAYER LOBBY</span>
            </span>

            <h2 className="text-3xl sm:text-4xl font-black font-headline text-white uppercase tracking-tight">
              Players Board & Match Challenges
            </h2>
            <p className="text-neutral-400 text-sm max-w-xl font-normal leading-relaxed">
              Looking for extra players for your box cricket team? Or want to challenge another squad to a friendly weekend derby? Post your match or join open teams below.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#ff7a00] to-amber-600 hover:from-amber-600 hover:to-[#ff7a00] text-white font-black text-xs uppercase tracking-wider shadow-[0_4px_16px_rgba(255,122,0,0.3)] transition-all active:scale-95 self-start md:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Post Match Request</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: 'All Match Levels' },
            { id: 'casual', label: '🏏 Casual & Weekend' },
            { id: 'intermediate', label: '⚡ Intermediate' },
            { id: 'competitive', label: '🏆 Tournament Practice' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setLevelFilter(tab.id)}
              className={`px-4 py-2 rounded-full transition-all font-bold whitespace-nowrap active:scale-95 cursor-pointer ${
                levelFilter === tab.id
                  ? 'bg-[#ff7a00] text-white shadow-[0_0_20px_rgba(255,122,0,0.4)]'
                  : 'bg-white/5 text-neutral-300 hover:text-white border border-white/10 hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Match Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filtered.map(post => {
            return (
              <div
                key={post.id}
                className="p-5 sm:p-6 rounded-3xl bg-[#1e2023] border border-white/10 hover:border-[#ff7a00]/50 shadow-xl transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-0.5 rounded-lg border font-bold uppercase tracking-wider bg-orange-500/10 text-orange-400 border-orange-500/30">
                      🏏 Box Cricket
                    </span>
                    <span className="text-neutral-500">{post.createdAt}</span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-white mb-0.5 group-hover:text-[#ff7a00] transition-colors font-headline">
                      {post.teamName}
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Captain: <strong className="text-white">{post.captainName}</strong> • {post.skillLevel}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5 text-xs text-neutral-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#ff7a00] shrink-0" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{post.timeSlot}</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-400 text-[11px] pt-0.5">
                      <MapPin className="w-3 h-3 text-neutral-500 shrink-0" />
                      <span className="truncate">{post.pitchName} (120 ft)</span>
                    </div>
                  </div>

                  {post.notes && (
                    <p className="text-xs text-neutral-300 italic bg-white/5 p-3 rounded-xl border border-white/10 leading-relaxed">
                      "{post.notes}"
                    </p>
                  )}
                </div>

                {/* Card Footer */}
                <div className="pt-3.5 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase text-neutral-500 block font-bold">
                      Open Spots:
                    </span>
                    <span className="text-xs font-black text-amber-400 font-mono">
                      Needs +{post.playersNeeded} Players • ₹{post.costPerPerson}/ea
                    </span>
                  </div>

                  {(() => {
                    const rawDigits = post.whatsappContact.replace(/\D/g, '');
                    const cleanPhone = rawDigits.length === 10 ? `91${rawDigits}` : rawDigits;
                    return (
                      <a
                        href={`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(`Hi Captain ${post.captainName}, saw your match post for Sonawane Turf for ${post.date} (${post.timeSlot}). I would like to join your team!`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0B1D2D] hover:bg-[#FF6A00] text-white text-xs font-bold transition-all active:scale-95 shadow-sm"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Join Squad</span>
                      </a>
                    );
                  })()}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Post Match Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#1e2023] border border-white/15 rounded-3xl w-full max-w-lg p-6 sm:p-7 shadow-2xl relative text-xs animate-in fade-in zoom-in-95 text-white font-body">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
              <div>
                <h3 className="text-base font-extrabold text-white uppercase tracking-wider font-headline">
                  Post to Players Board
                </h3>
                <p className="text-neutral-400 text-xs">
                  Recruit cricket players or find an opponent squad for a match
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 flex items-center justify-center border border-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-300 font-bold block mb-1">Captain Name *</label>
                  <input
                    type="text"
                    required
                    value={captainName}
                    onChange={e => setCaptainName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#ff7a00]"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 font-bold block mb-1">Team / Squad Name</label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={e => setTeamName(e.target.value)}
                    placeholder="e.g. Gully Blasters CC"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#ff7a00]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-300 font-bold block mb-1">Match Format</label>
                  <div className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-200 font-semibold">
                    🏏 Box Cricket
                  </div>
                </div>

                <div>
                  <label className="text-neutral-300 font-bold block mb-1">Turf</label>
                  <div className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-200 font-semibold">
                    Box Cricket Turf (120 ft)
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-300 font-bold block mb-1">Match Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#ff7a00]"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 font-bold block mb-1">Time Slot</label>
                  <input
                    type="text"
                    required
                    value={timeSlot}
                    onChange={e => setTimeSlot(e.target.value)}
                    placeholder="e.g. 08:00 PM - 09:00 PM"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#ff7a00]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-neutral-300 font-bold block mb-1">Players Needed</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={playersNeeded}
                    onChange={e => setPlayersNeeded(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#ff7a00]"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 font-bold block mb-1">Split ₹ / Player</label>
                  <input
                    type="number"
                    min="50"
                    step="50"
                    value={costPerPerson}
                    onChange={e => setCostPerPerson(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#ff7a00]"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 font-bold block mb-1">Skill Level</label>
                  <select
                    value={skillLevel}
                    onChange={e => setSkillLevel(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1e2023] border border-white/10 text-white focus:outline-none focus:border-[#ff7a00]"
                  >
                    <option value="Casual">Casual</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Competitive">Tournament</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-neutral-300 font-bold block mb-1">WhatsApp Number *</label>
                <input
                  type="tel"
                  required
                  value={whatsappContact}
                  onChange={e => setWhatsappContact(e.target.value)}
                  placeholder="e.g. 98200 12345 (players will contact here)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#ff7a00]"
                />
              </div>

              <div>
                <label className="text-neutral-300 font-bold block mb-1">Notes / Player Requirements</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Need 1 fast bowler and 1 batsman. Vicky tennis ball provided."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#ff7a00]"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#ff7a00] to-amber-600 hover:from-amber-600 hover:to-[#ff7a00] text-white font-extrabold uppercase shadow-[0_4px_16px_rgba(255,122,0,0.3)] cursor-pointer"
                >
                  Publish Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
