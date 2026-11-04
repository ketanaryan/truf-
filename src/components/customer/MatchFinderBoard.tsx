import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  MessageCircle, 
  Calendar, 
  Clock, 
  MapPin, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
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
  const [sportFilter, setSportFilter] = useState<string>('all');

  const [captainName, setCaptainName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [sport, setSport] = useState<SportType>('Football 7v7');
  const [date, setDate] = useState(getTodayString());
  const [timeSlot, setTimeSlot] = useState('08:00 PM - 09:00 PM');
  const [pitchName, setPitchName] = useState('Pitch A');
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
    if (sportFilter === 'all') return true;
    return p.sport.toLowerCase().includes(sportFilter.toLowerCase());
  });

  return (
    <section id="community-match-finder" className="py-16 border-t border-[#1a3322] bg-[#070e0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 font-mono text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>COMMUNITY PLAYER LOBBY</span>
            </span>

            <h2 className="text-2xl sm:text-4xl font-black font-display text-white uppercase italic">
              Battle Board Match Finder
            </h2>
            <p className="text-zinc-300 text-sm max-w-xl font-normal leading-relaxed">
              Short on players for your 7v7 football squad? Or want to challenge another team at Battlegrounds? 
              Post or join open game slots below.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-300 hover:to-green-400 text-black font-extrabold text-xs uppercase tracking-wider font-mono shadow-lg transition-all active:scale-95 self-start md:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Post Match Request</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
          {[
            { id: 'all', label: 'All Match Formats' },
            { id: 'football', label: '⚽ Football 7v7 / 5v5' },
            { id: 'cricket', label: '🏏 Box Cricket' },
            { id: 'pickleball', label: '🏓 Pickleball' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSportFilter(tab.id)}
              className={`px-4 py-2 rounded-xl transition-all font-bold whitespace-nowrap active:scale-95 ${
                sportFilter === tab.id
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'bg-[#0d1a12] text-zinc-400 hover:text-white border border-[#1d3824] hover:bg-[#122417]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Match Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filtered.map(post => {
            const isCricket = post.sport.includes('Cricket');
            const isPickleball = post.sport.includes('Pickleball');
            const badgeColor = isCricket 
              ? 'bg-amber-400/15 text-amber-300 border-amber-400/30' 
              : isPickleball 
              ? 'bg-cyan-400/15 text-cyan-300 border-cyan-400/30' 
              : 'bg-emerald-400/15 text-emerald-300 border-emerald-400/30';

            return (
              <div
                key={post.id}
                className="p-5 sm:p-6 rounded-2xl bg-[#0b160f] border border-[#1d3824] hover:border-emerald-500/50 hover:bg-[#0e1d13] transition-all flex flex-col justify-between space-y-4 shadow-xl group"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className={`px-2.5 py-0.5 rounded-lg border font-bold uppercase tracking-wider ${badgeColor}`}>
                      {post.sport}
                    </span>
                    <span className="text-zinc-400">{post.createdAt}</span>
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-white mb-0.5 group-hover:text-emerald-300 transition-colors">
                      {post.teamName}
                    </h3>
                    <p className="text-xs text-zinc-300 font-mono">
                      Captain: <strong className="text-white">{post.captainName}</strong> • {post.skillLevel}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#070f09] border border-[#172c1c] space-y-1.5 text-xs font-mono text-zinc-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{post.timeSlot}</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-400 text-[11px] pt-0.5">
                      <MapPin className="w-3 h-3 text-zinc-500 shrink-0" />
                      <span className="truncate">{post.pitchName}</span>
                    </div>
                  </div>

                  {post.notes && (
                    <p className="text-xs text-zinc-300 italic bg-[#070e09] p-3 rounded-xl border border-[#183020] leading-relaxed">
                      "{post.notes}"
                    </p>
                  )}
                </div>

                {/* Card Footer */}
                <div className="pt-3.5 border-t border-[#182e1f] flex items-center justify-between font-mono">
                  <div>
                    <span className="text-[10px] uppercase text-zinc-400 block font-bold">
                      Open Slots & Share:
                    </span>
                    <span className="text-xs font-extrabold text-emerald-400">
                      Needs +{post.playersNeeded} Players • ₹{post.costPerPerson}/ea
                    </span>
                  </div>

                  <a
                    href={`https://api.whatsapp.com/send?phone=${post.whatsappContact.replace(/\D/g, '')}&text=${encodeURIComponent(`Hi Captain ${post.captainName}, saw your Battlegrounds match post for ${post.sport} on ${post.date} (${post.timeSlot}). I would like to join!`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#122e1b] hover:bg-emerald-500 hover:text-black text-emerald-300 text-xs font-bold border border-[#245431] transition-all active:scale-95"
                  >
                    <MessageCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Join Squad</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Post Match Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#0c1810] border-2 border-[#1f3d28] rounded-3xl w-full max-w-lg p-6 sm:p-7 shadow-2xl relative font-mono text-xs animate-in fade-in zoom-in-95">
            
            <div className="flex items-center justify-between border-b border-[#1b3623] pb-4 mb-5">
              <div>
                <h3 className="text-base font-extrabold text-white uppercase tracking-wider">
                  Post to Battle Board
                </h3>
                <p className="text-zinc-400 text-xs">
                  Recruit players or find an opponent squad for your match
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-[#122417] hover:bg-[#1a3523] text-zinc-400 hover:text-white flex items-center justify-center border border-[#1f3d28]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Your Name (Captain) *</label>
                  <input
                    type="text"
                    required
                    value={captainName}
                    onChange={e => setCaptainName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#09130d] border border-[#204029] text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Team / Squad Name</label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={e => setTeamName(e.target.value)}
                    placeholder="e.g. Thunder FC"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#09130d] border border-[#204029] text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Sport Format</label>
                  <select
                    value={sport}
                    onChange={e => setSport(e.target.value as SportType)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#09130d] border border-[#204029] text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="Football 7v7">Football 7v7</option>
                    <option value="Football 5v5">Football 5v5</option>
                    <option value="Box Cricket">Box Cricket</option>
                    <option value="Pickleball">Pickleball</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Court / Pitch</label>
                  <select
                    value={pitchName}
                    onChange={e => setPitchName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#09130d] border border-[#204029] text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="Pitch A">Pitch A (7v7 & Cricket)</option>
                    <option value="Pitch B">Pitch B (5v5 & Pickleball)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Match Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#09130d] border border-[#204029] text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Time Slot</label>
                  <input
                    type="text"
                    required
                    value={timeSlot}
                    onChange={e => setTimeSlot(e.target.value)}
                    placeholder="e.g. 08:00 PM - 09:00 PM"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#09130d] border border-[#204029] text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Players Needed</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={playersNeeded}
                    onChange={e => setPlayersNeeded(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#09130d] border border-[#204029] text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Split ₹ / Player</label>
                  <input
                    type="number"
                    min="50"
                    step="50"
                    value={costPerPerson}
                    onChange={e => setCostPerPerson(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#09130d] border border-[#204029] text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Skill Level</label>
                  <select
                    value={skillLevel}
                    onChange={e => setSkillLevel(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#09130d] border border-[#204029] text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="Casual">Casual</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Competitive">Competitive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-zinc-300 font-bold block mb-1">WhatsApp Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={whatsappContact}
                  onChange={e => setWhatsappContact(e.target.value)}
                  placeholder="e.g. 9820188492 (players will tap to WhatsApp you)"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#09130d] border border-[#204029] text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-zinc-300 font-bold block mb-1">Match Note / Requirements</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Need 1 goalkeeper and 2 defenders, bibs and match ball provided."
                  className="w-full px-3 py-2 rounded-xl bg-[#09130d] border border-[#204029] text-white focus:outline-none focus:border-emerald-400 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-[#1b3623] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#122417] text-zinc-300 hover:text-white font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-300 hover:to-green-400 text-black font-extrabold uppercase tracking-wider"
                >
                  Publish Match Request
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </section>
  );
};
