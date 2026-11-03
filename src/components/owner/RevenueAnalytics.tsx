import React from 'react';
import { 
  TrendingUp, 
  Activity, 
  Layers, 
  CircleDollarSign, 
  PhoneCall, 
  Globe, 
  UserCheck, 
  Trophy,
  PieChart
} from 'lucide-react';
import { Booking, Pitch } from '../../types';

interface RevenueAnalyticsProps {
  bookings: Booking[];
  pitches: Pitch[];
}

export const RevenueAnalytics: React.FC<RevenueAnalyticsProps> = ({
  bookings,
  pitches
}) => {
  const nonCancelled = bookings.filter(b => b.status !== 'cancelled');

  const totalGrossRevenue = nonCancelled.reduce((acc, b) => acc + b.totalAmount, 0);
  const totalCollected = nonCancelled.reduce((acc, b) => acc + b.advancePaid, 0);
  const totalPendingDue = nonCancelled.reduce((acc, b) => acc + b.balanceDue, 0);

  const sportStats: { [sport: string]: { count: number; revenue: number } } = {};
  nonCancelled.forEach(b => {
    if (!sportStats[b.sport]) sportStats[b.sport] = { count: 0, revenue: 0 };
    sportStats[b.sport].count += 1;
    sportStats[b.sport].revenue += b.totalAmount;
  });

  const sourceStats = {
    online: nonCancelled.filter(b => b.source === 'online').length,
    walk_in: nonCancelled.filter(b => b.source === 'walk_in').length,
    phone_call: nonCancelled.filter(b => b.source === 'phone_call').length,
  };

  return (
    <div className="space-y-6 text-xs font-mono">
      
      {/* Top 3 KPI Financial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        <div className="p-5 sm:p-6 rounded-3xl bg-[#0c1810] border-2 border-[#1f3d28] space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] uppercase font-bold tracking-wider">Gross Slot Volume</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white font-display">
            ₹{totalGrossRevenue.toLocaleString()}
          </div>
          <span className="text-[11px] text-zinc-400 block pt-1 border-t border-[#172e1e]">
            {nonCancelled.length} active matches across both pitches
          </span>
        </div>

        <div className="p-5 sm:p-6 rounded-3xl bg-[#0c1810] border-2 border-emerald-500/40 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-[11px] uppercase font-bold tracking-wider">Inflow Realized</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400 font-display">
            ₹{totalCollected.toLocaleString()}
          </div>
          <span className="text-[11px] text-zinc-400 block pt-1 border-t border-[#172e1e]">
            Settled bank transfers + cash collected at desk
          </span>
        </div>

        <div className="p-5 sm:p-6 rounded-3xl bg-[#0c1810] border-2 border-amber-500/40 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-[11px] uppercase font-bold tracking-wider">Counter Receivables</span>
            <CircleDollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400 font-display">
            ₹{totalPendingDue.toLocaleString()}
          </div>
          <span className="text-[11px] text-zinc-400 block pt-1 border-t border-[#172e1e]">
            Balance due at arrival check-in counter
          </span>
        </div>

      </div>

      {/* Sport Breakdown & Acquisition Channels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Format Breakdown */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#0c1810] border-2 border-[#1f3d28] space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#1b3623] pb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-extrabold text-white uppercase tracking-wider">
                Revenue by Sport Format
              </span>
            </div>
            <span className="text-[11px] text-zinc-400">
              Contribution %
            </span>
          </div>

          <div className="space-y-4 pt-1">
            {Object.entries(sportStats).map(([sport, stat]) => {
              const percentage = totalGrossRevenue > 0 ? Math.round((stat.revenue / totalGrossRevenue) * 100) : 0;
              return (
                <div key={sport} className="space-y-1.5">
                  <div className="flex justify-between text-zinc-300 text-xs">
                    <span className="font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      {sport}
                    </span>
                    <span className="text-emerald-400 font-bold font-mono">
                      ₹{stat.revenue.toLocaleString()} <span className="text-zinc-500 font-normal">({stat.count} matches • {percentage}%)</span>
                    </span>
                  </div>

                  <div className="w-full h-2.5 rounded-full bg-[#122417] overflow-hidden p-0.5 border border-[#1d3d27]">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-500" 
                      style={{ width: `${Math.max(5, percentage)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Channel Distribution */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#0c1810] border-2 border-[#1f3d28] space-y-5 shadow-xl">
          <div className="flex items-center gap-2 border-b border-[#1b3623] pb-3">
            <PieChart className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-extrabold text-white uppercase tracking-wider">
              Booking Channel Distribution
            </span>
          </div>

          <div className="space-y-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-[#09140d] border border-[#204229] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-white font-bold block">Online Player Portal</span>
                  <span className="text-zinc-500 text-[10px]">Direct web & mobile reservations</span>
                </div>
              </div>
              <span className="text-sm font-black text-emerald-400">
                {sourceStats.online} <span className="text-zinc-500 text-xs font-normal">matches</span>
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#09140d] border border-[#204229] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-400/15 text-amber-400 flex items-center justify-center font-bold">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-white font-bold block">Phone Hotline Call-In</span>
                  <span className="text-zinc-500 text-[10px]">Owner desk manual telephone booking</span>
                </div>
              </div>
              <span className="text-sm font-black text-amber-400">
                {sourceStats.phone_call} <span className="text-zinc-500 text-xs font-normal">matches</span>
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#09140d] border border-[#204229] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-cyan-400/15 text-cyan-400 flex items-center justify-center font-bold">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-white font-bold block">Walk-In at Reception</span>
                  <span className="text-zinc-500 text-[10px]">Instant counter entry at turf gate</span>
                </div>
              </div>
              <span className="text-sm font-black text-cyan-400">
                {sourceStats.walk_in} <span className="text-zinc-500 text-xs font-normal">matches</span>
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
