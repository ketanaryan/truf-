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
  PieChart,
  Calendar,
  Clock,
  Sparkles,
  CreditCard,
  Zap,
  Target
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

  // Key Financial Metrics
  const totalGrossRevenue = nonCancelled.reduce((acc, b) => acc + b.totalAmount, 0);
  const totalCollected = nonCancelled.reduce((acc, b) => acc + b.advancePaid, 0);
  const totalPendingDue = nonCancelled.reduce((acc, b) => acc + b.balanceDue, 0);
  const avgBookingValue = nonCancelled.length ? Math.round(totalGrossRevenue / nonCancelled.length) : 0;
  const projectedMonthlyRevenue = totalGrossRevenue * 4; // Monthly run-rate estimation

  // Sport format breakdown
  const sportStats: { [sport: string]: { count: number; revenue: number } } = {
    'Box Cricket': { count: 0, revenue: 0 },
    'Football': { count: 0, revenue: 0 }
  };
  nonCancelled.forEach(b => {
    const sp = b.sport || 'Box Cricket';
    if (!sportStats[sp]) sportStats[sp] = { count: 0, revenue: 0 };
    sportStats[sp].count += 1;
    sportStats[sp].revenue += b.totalAmount;
  });

  // Source distribution
  const sourceStats = {
    online: nonCancelled.filter(b => b.source === 'online').length,
    walk_in: nonCancelled.filter(b => b.source === 'walk_in').length,
    phone_call: nonCancelled.filter(b => b.source === 'phone_call' || b.source === 'whatsapp').length,
  };

  // Payment status distribution
  const paymentStats = {
    fullyPaid: nonCancelled.filter(b => b.paymentStatus === 'paid_full').length,
    advanceToken: nonCancelled.filter(b => b.paymentStatus === 'advance_deposit').length,
    pendingUpi: nonCancelled.filter(b => b.paymentStatus === 'upi_pending').length,
    counterPay: nonCancelled.filter(b => b.paymentStatus === 'pay_at_venue').length,
  };

  // Hourly Period Demand Analysis
  let morningMatches = 0;
  let afternoonMatches = 0;
  let primeNightMatches = 0;

  nonCancelled.forEach(b => {
    const tr = b.timeRange || '';
    if (tr.includes('AM')) {
      morningMatches += 1;
    } else if (tr.includes('12:00 PM') || tr.includes('01:00 PM') || tr.includes('02:00 PM') || tr.includes('03:00 PM') || tr.includes('04:00 PM')) {
      afternoonMatches += 1;
    } else {
      primeNightMatches += 1;
    }
  });

  const totalMatches = nonCancelled.length || 1;
  const morningPct = Math.round((morningMatches / totalMatches) * 100);
  const afternoonPct = Math.round((afternoonMatches / totalMatches) * 100);
  const nightPct = Math.round((primeNightMatches / totalMatches) * 100);

  return (
    <div className="space-y-6 font-sans">
      
      {/* 4 Financial KPI Tiles (Hatrick Grounds Style White Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs uppercase font-bold tracking-wider">Gross Slot Volume</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF6A00] flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#111827] font-display">
            ₹{totalGrossRevenue.toLocaleString()}
          </div>
          <span className="text-xs text-slate-500 block pt-1 border-t border-slate-100">
            {nonCancelled.length} total active matches
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-xs uppercase font-bold tracking-wider">Inflow Realized</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-600 font-display">
            ₹{totalCollected.toLocaleString()}
          </div>
          <span className="text-xs text-slate-500 block pt-1 border-t border-slate-100">
            Settled via Google Pay & cash at desk
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-xs uppercase font-bold tracking-wider">Counter Receivables</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <CircleDollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-600 font-display">
            ₹{totalPendingDue.toLocaleString()}
          </div>
          <span className="text-xs text-slate-500 block pt-1 border-t border-slate-100">
            Pending player balances to collect
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#0D6EFD]">
            <span className="text-xs uppercase font-bold tracking-wider">Avg. Booking Value</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0D6EFD] flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#0D6EFD] font-display">
            ₹{avgBookingValue.toLocaleString()}
          </div>
          <span className="text-xs text-slate-500 block pt-1 border-t border-slate-100">
            Average ticket size per match reservation
          </span>
        </div>

      </div>

      {/* Hourly Occupancy Demand Heatmap & Timing Breakdown */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#FF6A00] flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide">
                Hourly Demand & Time Period Breakdown
              </h3>
              <p className="text-xs text-slate-500">
                Peak floodlight utilization vs morning practice sessions
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            6:00 AM – 11:00 PM Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Morning Period */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">Morning (6 AM - 12 PM)</span>
              <strong className="text-slate-900">{morningMatches} matches</strong>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-[#00B6C8] h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.max(5, morningPct)}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span>Standard rates (₹600/hr)</span>
              <span className="font-bold text-slate-700">{morningPct}% share</span>
            </div>
          </div>

          {/* Afternoon Period */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">Afternoon (12 PM - 5 PM)</span>
              <strong className="text-slate-900">{afternoonMatches} matches</strong>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-amber-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.max(5, afternoonPct)}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span>Day rates (₹600/hr)</span>
              <span className="font-bold text-slate-700">{afternoonPct}% share</span>
            </div>
          </div>

          {/* Prime Floodlights Period */}
          <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-[#FF6A00]">⚡ Prime Floodlights (5 PM - 11 PM)</span>
              <strong className="text-slate-900 font-black">{primeNightMatches} matches</strong>
            </div>
            <div className="w-full bg-orange-200 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-[#FF6A00] h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.max(5, nightPct)}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span>Night surge (₹800/hr)</span>
              <span className="font-bold text-[#FF6A00]">{nightPct}% share</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sport Breakdown & Acquisition Channels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Format Breakdown */}
        <div className="lg:col-span-7 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#FF6A00]" />
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Revenue by Sport Format
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-semibold">
              Sonawane's Turf
            </span>
          </div>

          <div className="space-y-4">
            {Object.entries(sportStats).map(([sport, stat]) => {
              const pct = totalGrossRevenue ? Math.round((stat.revenue / totalGrossRevenue) * 100) : 0;
              return (
                <div key={sport} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{sport}</span>
                      <span className="text-slate-400">({stat.count} match{stat.count === 1 ? '' : 'es'})</span>
                    </div>
                    <strong className="text-sm font-black text-slate-900">₹{stat.revenue.toLocaleString()}</strong>
                  </div>
                  
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${sport === 'Box Cricket' ? 'bg-[#FF6A00]' : 'bg-[#00B6C8]'}`}
                      style={{ width: `${Math.max(5, pct)}%` }}
                    ></div>
                  </div>

                  <div className="text-[11px] text-slate-500 text-right">
                    <span>{pct}% of venue gross revenue</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Acquisition Channels & Payment Methods */}
        <div className="lg:col-span-5 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#0D6EFD]" />
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Booking Inflow Sources
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-semibold">
              Conversion Channels
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-slate-800">Direct Website (0% Fee UPI)</span>
              </div>
              <strong className="text-sm font-black text-slate-900">{sourceStats.online}</strong>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <PhoneCall className="w-4 h-4 text-[#FF6A00]" />
                <span className="font-bold text-slate-800">WhatsApp / Phone Reservation</span>
              </div>
              <strong className="text-sm font-black text-slate-900">{sourceStats.phone_call}</strong>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-4 h-4 text-[#0D6EFD]" />
                <span className="font-bold text-slate-800">Walk-in Counter Reception</span>
              </div>
              <strong className="text-sm font-black text-slate-900">{sourceStats.walk_in}</strong>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-1">
            <span className="font-extrabold block">💡 0% Gateway Commission Active</span>
            <p className="text-[11px] text-blue-800 leading-relaxed">
              Every online match booking is paid directly to Kiran Sonawane's UPI account with zero platform deduction.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
