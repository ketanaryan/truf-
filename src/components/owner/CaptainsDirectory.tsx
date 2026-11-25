import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  PhoneCall, 
  MessageSquare, 
  Trophy, 
  Calendar, 
  TrendingUp, 
  Award, 
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Star
} from 'lucide-react';
import { Booking } from '../../types';

interface CaptainsDirectoryProps {
  bookings: Booking[];
  turfPhone: string;
}

interface CaptainProfile {
  id: string;
  name: string;
  phone: string;
  cleanPhone: string;
  teamName: string;
  matchesCount: number;
  totalSpent: number;
  lastPlayedDate: string;
  sports: string[];
  recentBookingRef: string;
  allBookingRefs: string[];
}

export const CaptainsDirectory: React.FC<CaptainsDirectoryProps> = ({
  bookings,
  turfPhone
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'matches' | 'spent' | 'recent'>('matches');

  // Aggregate bookings into unique captain profiles
  const captains = useMemo(() => {
    const map = new Map<string, CaptainProfile>();

    bookings
      .filter(b => b.status !== 'cancelled')
      .forEach(b => {
        const key = b.captainPhone.replace(/\D/g, '') || b.captainName.toLowerCase().trim();
        const existing = map.get(key);

        const cleanPhone = b.captainPhone.replace(/\D/g, '');
        const formattedClean = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

        if (existing) {
          existing.matchesCount += 1;
          existing.totalSpent += b.totalAmount;
          if (b.date > existing.lastPlayedDate) {
            existing.lastPlayedDate = b.date;
            existing.recentBookingRef = b.bookingRef;
          }
          if (!existing.sports.includes(b.sport)) {
            existing.sports.push(b.sport);
          }
          if (!existing.allBookingRefs.includes(b.bookingRef)) {
            existing.allBookingRefs.push(b.bookingRef);
          }
          if (b.teamName && !existing.teamName) {
            existing.teamName = b.teamName;
          }
        } else {
          map.set(key, {
            id: key,
            name: b.captainName,
            phone: b.captainPhone,
            cleanPhone: formattedClean,
            teamName: b.teamName || `${b.captainName}'s Squad`,
            matchesCount: 1,
            totalSpent: b.totalAmount,
            lastPlayedDate: b.date,
            sports: [b.sport],
            recentBookingRef: b.bookingRef,
            allBookingRefs: [b.bookingRef]
          });
        }
      });

    const list = Array.from(map.values());

    if (sortBy === 'matches') {
      return list.sort((a, b) => b.matchesCount - a.matchesCount);
    } else if (sortBy === 'spent') {
      return list.sort((a, b) => b.totalSpent - a.totalSpent);
    } else {
      return list.sort((a, b) => b.lastPlayedDate.localeCompare(a.lastPlayedDate));
    }
  }, [bookings, sortBy]);

  const filteredCaptains = captains.filter(c => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.teamName.toLowerCase().includes(q) ||
      c.sports.some(s => s.toLowerCase().includes(q))
    );
  });

  const totalCaptains = captains.length;
  const totalRepeatCaptains = captains.filter(c => c.matchesCount > 1).length;
  const totalCustomerVolume = captains.reduce((sum, c) => sum + c.totalSpent, 0);

  const getWhatsAppInviteUrl = (captain: CaptainProfile) => {
    const text = 
      `Hi Captain ${captain.name}! 👋\n\n` +
      `Hope you and ${captain.teamName} are doing great! We have prime floodlit slots available this week at *Sonawane's Multi Sport Turf* (Rane Nagar, Nashik).\n\n` +
      `🏏 *Special Offer:* Book 2 hrs or tournament derby with 0% UPI fee.\n` +
      `Would you like to lock in a match slot for your team? Let me know! 🏆`;
    return `https://api.whatsapp.com/send?phone=${captain.cleanPhone}&text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top CRM Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs uppercase font-bold tracking-wider">Registered Captains</span>
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#FF6A00] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#111827] font-display">
            {totalCaptains}
          </div>
          <p className="text-xs text-slate-500">
            Active squads in Sonawane Turf database
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs uppercase font-bold tracking-wider">Repeat Squads</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-600 font-display">
            {totalRepeatCaptains}
            <span className="text-sm font-normal text-slate-500 ml-2 font-sans">
              ({totalCaptains ? Math.round((totalRepeatCaptains / totalCaptains) * 100) : 0}% retention)
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Captains with 2+ bookings at the venue
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs uppercase font-bold tracking-wider">Total Customer LTV</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0D6EFD] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#0D6EFD] font-display">
            ₹{totalCustomerVolume.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500">
            Combined spend across all captains
          </p>
        </div>
      </div>

      {/* Search & Sort Bar */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search captain, team name or phone..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-[#FF6A00] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">Sort by:</span>
          <button
            onClick={() => setSortBy('matches')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              sortBy === 'matches'
                ? 'bg-[#0B1D2D] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Most Matches
          </button>
          <button
            onClick={() => setSortBy('spent')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              sortBy === 'spent'
                ? 'bg-[#0B1D2D] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Highest Spend
          </button>
          <button
            onClick={() => setSortBy('recent')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              sortBy === 'recent'
                ? 'bg-[#0B1D2D] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Recently Played
          </button>
        </div>
      </div>

      {/* Captains Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCaptains.map((cap, idx) => (
          <div
            key={cap.id}
            className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-[#FF6A00]/50 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0B1D2D] to-[#16364D] text-white flex items-center justify-center font-display font-black text-xl shadow-md shrink-0">
                    {cap.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#111827] text-base leading-tight">
                      {cap.name}
                    </h4>
                    <p className="text-xs text-[#FF6A00] font-bold mt-0.5">
                      {cap.teamName}
                    </p>
                  </div>
                </div>

                {cap.matchesCount > 1 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-black uppercase tracking-wider shrink-0">
                    ★ VIP Squad
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Matches Played</span>
                  <strong className="text-sm font-black text-slate-900">{cap.matchesCount} match{cap.matchesCount > 1 ? 'es' : ''}</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Turf Spend</span>
                  <strong className="text-sm font-black text-emerald-600">₹{cap.totalSpent.toLocaleString()}</strong>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Preferred Sport:</span>
                  <span className="font-semibold text-slate-800">{cap.sports.join(', ')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Last Played:</span>
                  <span className="font-semibold text-slate-800">{cap.lastPlayedDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Pass IDs:</span>
                  <span className="font-mono text-[11px] text-[#0D6EFD] font-bold">
                    #{cap.recentBookingRef} {cap.allBookingRefs.length > 1 ? `(+${cap.allBookingRefs.length - 1} more)` : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions: Call & 1-Click WhatsApp Invite */}
            <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
              <a
                href={`tel:${cap.phone}`}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors shrink-0"
                title="Call Captain"
              >
                <PhoneCall className="w-3.5 h-3.5 text-slate-600" />
                <span>Call</span>
              </a>

              <a
                href={getWhatsAppInviteUrl(cap)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Invite</span>
              </a>
            </div>
          </div>
        ))}

        {filteredCaptains.length === 0 && (
          <div className="col-span-full py-16 text-center rounded-3xl bg-white border border-slate-200 p-8">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-800">No Captains Found</h4>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

    </div>
  );
};
