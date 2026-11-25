import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Lock, 
  QrCode, 
  FileText, 
  Sliders, 
  BarChart3, 
  TrendingUp,
  Activity,
  ArrowRight,
  ShieldCheck,
  Flame,
  PhoneCall,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Users,
  DollarSign,
  Clock
} from 'lucide-react';
import { Pitch, Booking, OwnerSettings } from '../../types';
import { BlockedSlotRecord } from '../../data/storage';
import { getTodayString } from '../../data/mockTurfData';
import { MasterScheduleGrid } from './MasterScheduleGrid';
import { BookingsLedger } from './BookingsLedger';
import { ArenaSettings } from './ArenaSettings';
import { RevenueAnalytics } from './RevenueAnalytics';
import { CaptainsDirectory } from './CaptainsDirectory';
import { QuickBookingModal } from './QuickBookingModal';
import { SlotBlockerModal } from './SlotBlockerModal';
import { QrScannerModal } from './QrScannerModal';
import { PaymentScreenshotModal } from '../common/PaymentScreenshotModal';

interface OwnerDashboardProps {
  pitches: Pitch[];
  bookings: Booking[];
  blockedSlots: BlockedSlotRecord[];
  settings: OwnerSettings;
  onSaveBooking: (booking: Booking) => void;
  onCheckIn: (bookingId: string) => void;
  onCollectBalance: (bookingId: string) => void;
  onCancelBooking: (bookingId: string) => void;
  onToggleBlockSlot: (date: string, pitchId: string, time: string, reason: string) => void;
  onSaveSettings: (settings: OwnerSettings) => void;
  onUpdatePitchPricing: (pitchId: string, updates: Partial<Pitch>) => void;
  onSelectBookingForPass: (booking: Booking) => void;
  onApproveUpi?: (bookingId: string) => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  pitches,
  bookings,
  blockedSlots,
  settings,
  onSaveBooking,
  onCheckIn,
  onCollectBalance,
  onCancelBooking,
  onToggleBlockSlot,
  onSaveSettings,
  onUpdatePitchPricing,
  onSelectBookingForPass,
  onApproveUpi
}) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'ledger' | 'analytics' | 'captains' | 'settings'>('schedule');
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());

  const [quickBookingOpen, setQuickBookingOpen] = useState(false);
  const [targetQuickPitch, setTargetQuickPitch] = useState(pitches[0].id);
  const [targetQuickTime, setTargetQuickTime] = useState('18:00');

  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [targetBlockPitch, setTargetBlockPitch] = useState(pitches[0].id);
  const [targetBlockTime, setTargetBlockTime] = useState('15:00');

  const [qrScannerOpen, setQrScannerOpen] = useState(false);
  const [inspectScreenshotBooking, setInspectScreenshotBooking] = useState<Booking | null>(null);

  const todayStr = getTodayString();
  const todayBookings = bookings.filter(b => b.date === todayStr && b.status !== 'cancelled');

  const todayGross = todayBookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const todayCollected = todayBookings.reduce((sum, b) => {
    if (b.paymentStatus === 'paid_full' || b.paymentStatus === 'advance_deposit' || b.isUpiVerified) {
      return sum + b.advancePaid;
    }
    return sum;
  }, 0);
  const todayPendingDue = todayBookings.reduce((sum, b) => sum + b.balanceDue, 0);
  
  // Total slots booked today out of 17 operational hours (06:00 to 23:00)
  const totalSlotsBookedToday = todayBookings.reduce((sum, b) => {
    return sum + (b.isFullDayBooking ? 17 : (b.slotIds ? b.slotIds.length : b.durationHours || 1));
  }, 0);
  const occupancyPercent = Math.min(100, Math.round((totalSlotsBookedToday / 17) * 100));

  const pendingUpiBookings = bookings.filter(b => b.paymentStatus === 'upi_pending' && b.status !== 'cancelled');

  const handleOpenQuickFromGrid = (pitchId: string, time: string) => {
    setTargetQuickPitch(pitchId);
    setTargetQuickTime(time);
    setQuickBookingOpen(true);
  };

  const handleOpenBlockFromGrid = (pitchId: string, time: string) => {
    setTargetBlockPitch(pitchId);
    setTargetBlockTime(time);
    setBlockModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-200 font-sans">
      
      {/* Top Executive Venue Operations Card (Hatrick Grounds Deep Navy & Vibrant Orange) */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#0B1D2D] border border-white/10 shadow-xl text-white flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00B6C8] animate-pulse"></span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#00B6C8]">
              VENUE MANAGEMENT HUB • OWNER DESK
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
              ● Live 6:00 AM – 11:00 PM
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black font-display text-white uppercase italic tracking-wide">
            {settings.turfName}
          </h2>

          <p className="text-xs text-slate-300 flex items-center gap-2 flex-wrap">
            <span>{settings.address}</span>
            <span>•</span>
            <span>Desk Phone: <strong className="text-white font-mono">{settings.phone}</strong></span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              setTargetQuickPitch(pitches[0].id);
              setTargetQuickTime('18:00');
              setQuickBookingOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#FF6A00] hover:bg-[#E65F00] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Manual Desk Booking</span>
          </button>

          <button
            onClick={() => setQrScannerOpen(true)}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-colors border border-white/15 cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-[#00B6C8]" />
            <span>Gate Scanner</span>
          </button>

          <button
            onClick={() => {
              setTargetBlockPitch(pitches[0].id);
              setTargetBlockTime('14:00');
              setBlockModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/40 font-bold text-xs uppercase transition-colors cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock Slot</span>
          </button>
        </div>
      </div>

      {/* 0% Direct UPI Pending Verification Banner */}
      {pendingUpiBookings.length > 0 && (
        <div className="p-5 sm:p-6 rounded-3xl bg-amber-50 border-2 border-amber-300 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-black text-amber-950 uppercase tracking-wide">
                    {pendingUpiBookings.length} Direct UPI Payment{pendingUpiBookings.length > 1 ? 's' : ''} Awaiting Approval
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-extrabold font-mono">
                    0% Gateway Fee
                  </span>
                </div>
                <p className="text-xs text-amber-800 mt-0.5">
                  Customers paid directly to <strong className="text-black font-mono">{settings.upiId}</strong> and attached their payment receipt photo. Inspect and approve below.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('ledger')}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase transition-colors shrink-0"
            >
              View in CRM ({pendingUpiBookings.length}) →
            </button>
          </div>

          {/* Pending UPI Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {pendingUpiBookings.map(b => (
              <div 
                key={b.id}
                className="p-4 rounded-2xl bg-white border border-amber-300/80 shadow-sm space-y-3 text-xs flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[#FF6A00] font-mono text-sm">#{b.bookingRef}</span>
                    <span className="font-black text-slate-900 text-sm">₹{b.totalAmount}</span>
                  </div>
                  <div className="text-slate-900 font-bold">{b.captainName} ({b.teamName})</div>
                  <div className="text-[11px] text-slate-500">{b.date} • {b.timeRange}</div>
                  
                  {/* Photo Screenshot Preview Card */}
                  {b.paymentScreenshot ? (
                    <div 
                      onClick={() => setInspectScreenshotBooking(b)}
                      className="p-2 rounded-xl bg-amber-50/70 border border-amber-300 hover:border-amber-400 cursor-pointer flex items-center gap-2.5 transition-all group"
                      title="Click to view full payment photo"
                    >
                      <img 
                        src={b.paymentScreenshot} 
                        alt="Receipt Proof" 
                        className="w-12 h-12 rounded-lg object-cover border border-amber-400 shrink-0 group-hover:scale-105 transition-transform"
                      />
                      <div className="overflow-hidden">
                        <span className="text-amber-900 font-bold text-xs flex items-center gap-1">
                          <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                          <span>View Receipt Photo</span>
                        </span>
                        <span className="text-[10px] text-amber-700 block mt-0.5">
                          Click to inspect 🔍
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Customer UTR Ref:</span>
                      <span className="text-slate-900 font-mono font-black text-xs select-all">
                        {b.upiUtr || 'Pending Submission'}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => onApproveUpi?.(b.id)}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                    <span>
                      {b.balanceDue > 0 ? `Approve ₹${b.advancePaid} Token` : `Approve ₹${b.totalAmount}`}
                    </span>
                  </button>

                  <button
                    onClick={() => onSelectBookingForPass(b)}
                    className="py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold"
                    title="View Pass"
                  >
                    Pass
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KPI Telemetry Cards (Hatrick Grounds Style Clean White Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] uppercase text-slate-500 font-bold tracking-wider">
              Today's Scheduled Matches
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0D6EFD] flex items-center justify-center">
              <CalendarIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-display">
            {todayBookings.length} <span className="text-xs text-slate-400 font-normal font-sans">/ 17 slots</span>
          </div>
          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
            <span className="text-slate-500">Venue Occupancy:</span>
            <strong className="text-emerald-600 font-bold">{occupancyPercent}%</strong>
          </div>
        </div>

        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] uppercase text-slate-500 font-bold tracking-wider">
              Today's Gross Booked
            </span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF6A00] flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#FF6A00] font-display">
            ₹{todayGross.toLocaleString()}
          </div>
          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
            <span className="text-slate-500">Total Booked Volume</span>
            <span className="text-slate-700 font-bold">{todayBookings.length} Matches</span>
          </div>
        </div>

        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-[11px] uppercase text-slate-500 font-bold tracking-wider">
              Collected In Bank / Cash
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-600 font-display">
            ₹{todayCollected.toLocaleString()}
          </div>
          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
            <span className="text-slate-500">Reconciled Funds</span>
            <span className="text-emerald-700 font-bold">Cleared</span>
          </div>
        </div>

        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-[11px] uppercase text-slate-500 font-bold tracking-wider">
              Due at Reception Counter
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-600 font-display">
            ₹{todayPendingDue.toLocaleString()}
          </div>
          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
            <span className="text-slate-500">Uncollected Balance</span>
            <span className="text-amber-700 font-bold">Due on arrival</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation (5 Management Modules) */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold scrollbar-none">
        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all uppercase tracking-wider whitespace-nowrap ${
            activeTab === 'schedule'
              ? 'bg-[#FF6A00] text-white shadow-md'
              : 'bg-white text-slate-700 hover:text-black border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <CalendarIcon className="w-4 h-4" />
          <span>Court Schedule Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('ledger')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all uppercase tracking-wider whitespace-nowrap ${
            activeTab === 'ledger'
              ? 'bg-[#FF6A00] text-white shadow-md'
              : 'bg-white text-slate-700 hover:text-black border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Bookings CRM ({bookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all uppercase tracking-wider whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'bg-[#FF6A00] text-white shadow-md'
              : 'bg-white text-slate-700 hover:text-black border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Deep Revenue Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('captains')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all uppercase tracking-wider whitespace-nowrap ${
            activeTab === 'captains'
              ? 'bg-[#FF6A00] text-white shadow-md'
              : 'bg-white text-slate-700 hover:text-black border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Captains & Squads CRM</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all uppercase tracking-wider whitespace-nowrap ${
            activeTab === 'settings'
              ? 'bg-[#FF6A00] text-white shadow-md'
              : 'bg-white text-slate-700 hover:text-black border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Pricing & Rules</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'schedule' && (
        <MasterScheduleGrid
          pitches={pitches}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          bookings={bookings}
          blockedSlots={blockedSlots}
          onOpenQuickBooking={handleOpenQuickFromGrid}
          onOpenBlockSlot={handleOpenBlockFromGrid}
          onSelectBooking={onSelectBookingForPass}
          onCheckInBooking={onCheckIn}
          onCollectBalance={onCollectBalance}
          onApproveUpi={onApproveUpi}
          onInspectScreenshot={(b) => setInspectScreenshotBooking(b)}
          settings={settings}
        />
      )}

      {activeTab === 'ledger' && (
        <BookingsLedger
          bookings={bookings}
          onSelectBooking={onSelectBookingForPass}
          onCheckIn={onCheckIn}
          onCollectBalance={onCollectBalance}
          onCancelBooking={onCancelBooking}
          onApproveUpi={onApproveUpi}
          onInspectScreenshot={(b) => setInspectScreenshotBooking(b)}
        />
      )}

      {activeTab === 'analytics' && (
        <RevenueAnalytics
          bookings={bookings}
          pitches={pitches}
        />
      )}

      {activeTab === 'captains' && (
        <CaptainsDirectory
          bookings={bookings}
          turfPhone={settings.phone}
        />
      )}

      {activeTab === 'settings' && (
        <ArenaSettings
          settings={settings}
          pitches={pitches}
          onSaveSettings={onSaveSettings}
          onUpdatePitchPricing={onUpdatePitchPricing}
        />
      )}

      {/* Modals */}
      <QuickBookingModal
        isOpen={quickBookingOpen}
        onClose={() => setQuickBookingOpen(false)}
        pitches={pitches}
        initialPitchId={targetQuickPitch}
        initialTime={targetQuickTime}
        selectedDate={selectedDate}
        settings={settings}
        onSaveBooking={onSaveBooking}
        existingBookings={bookings}
        blockedSlots={blockedSlots}
      />

      <SlotBlockerModal
        isOpen={blockModalOpen}
        onClose={() => setBlockModalOpen(false)}
        pitches={pitches}
        selectedDate={selectedDate}
        initialPitchId={targetBlockPitch}
        initialTime={targetBlockTime}
        blockedSlots={blockedSlots}
        onToggleBlock={onToggleBlockSlot}
      />

      <QrScannerModal
        isOpen={qrScannerOpen}
        onClose={() => setQrScannerOpen(false)}
        bookings={bookings}
        onCheckIn={onCheckIn}
        onCollectBalance={onCollectBalance}
        onApproveUpi={onApproveUpi}
      />

      <PaymentScreenshotModal
        isOpen={Boolean(inspectScreenshotBooking)}
        onClose={() => setInspectScreenshotBooking(null)}
        booking={inspectScreenshotBooking}
        onApprove={onApproveUpi}
      />

    </div>
  );
};
