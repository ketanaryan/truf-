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
  PhoneCall
} from 'lucide-react';
import { Pitch, Booking, OwnerSettings } from '../../types';
import { BlockedSlotRecord } from '../../data/storage';
import { getTodayString } from '../../data/mockTurfData';
import { MasterScheduleGrid } from './MasterScheduleGrid';
import { BookingsLedger } from './BookingsLedger';
import { ArenaSettings } from './ArenaSettings';
import { RevenueAnalytics } from './RevenueAnalytics';
import { QuickBookingModal } from './QuickBookingModal';
import { SlotBlockerModal } from './SlotBlockerModal';
import { QrScannerModal } from './QrScannerModal';

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
  onSelectBookingForPass
}) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'ledger' | 'settings' | 'analytics'>('schedule');
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());

  const [quickBookingOpen, setQuickBookingOpen] = useState(false);
  const [targetQuickPitch, setTargetQuickPitch] = useState(pitches[0].id);
  const [targetQuickTime, setTargetQuickTime] = useState('18:00');

  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [targetBlockPitch, setTargetBlockPitch] = useState(pitches[0].id);
  const [targetBlockTime, setTargetBlockTime] = useState('15:00');

  const [qrScannerOpen, setQrScannerOpen] = useState(false);

  const todayStr = getTodayString();
  const todayBookings = bookings.filter(b => b.date === todayStr && b.status !== 'cancelled');

  const todayGross = todayBookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const todayCollected = todayBookings.reduce((sum, b) => sum + b.advancePaid, 0);
  const todayPendingDue = todayBookings.reduce((sum, b) => sum + b.balanceDue, 0);
  const occupancyPercent = Math.min(100, Math.round((todayBookings.length / 38) * 100));

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Top Operations Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0c1810] border-2 border-[#1f3d28] shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400">
              OWNER COMMAND DESK • VENUE OPERATIONS HUB
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-display text-white uppercase italic">
            {settings.turfName}
          </h2>
          <p className="text-xs text-zinc-300 font-mono">
            {settings.address} • Desk Phone: {settings.phone}
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
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-transform"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Manual Desk Booking</span>
          </button>

          <button
            onClick={() => setQrScannerOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#14261a] hover:bg-[#1b3524] border border-[#23472d] text-emerald-300 font-bold text-xs uppercase tracking-wider transition-colors"
          >
            <QrCode className="w-4 h-4 text-emerald-400" />
            <span>Gate Scanner</span>
          </button>

          <button
            onClick={() => {
              setTargetBlockPitch(pitches[0].id);
              setTargetBlockTime('14:00');
              setBlockModalOpen(true);
            }}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#1a1414] hover:bg-[#281b1b] border border-red-900/50 text-red-300 font-bold text-xs uppercase transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Block Slot</span>
          </button>
        </div>
      </div>

      {/* KPI Telemetry Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
        <div className="p-5 rounded-2xl bg-[#0b160f] border border-[#1d3824] space-y-1">
          <span className="text-[10px] uppercase text-zinc-400 block font-semibold">
            Today's Scheduled Matches
          </span>
          <div className="text-3xl font-black text-white font-mono">
            {todayBookings.length} <span className="text-xs text-zinc-500 font-normal">/ 38 daily</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-bold">
            {occupancyPercent}% Arena Occupancy
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0b160f] border border-[#1d3824] space-y-1">
          <span className="text-[10px] uppercase text-zinc-400 block font-semibold">
            Today's Gross Booked
          </span>
          <div className="text-3xl font-black text-emerald-400 font-mono">
            ₹{todayGross.toLocaleString()}
          </div>
          <span className="text-[11px] text-zinc-400">
            Pitch A & B combined
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0b160f] border border-[#1d3824] space-y-1">
          <span className="text-[10px] uppercase text-zinc-400 block font-semibold">
            Collected In Bank / Cash
          </span>
          <div className="text-3xl font-black text-white font-mono">
            ₹{todayCollected.toLocaleString()}
          </div>
          <span className="text-[11px] text-zinc-400">
            Advance tokens & cleared
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#16140c] border border-amber-500/40 space-y-1">
          <span className="text-[10px] uppercase text-amber-400 block font-semibold">
            Due at Reception Counter
          </span>
          <div className="text-3xl font-black text-amber-400 font-mono">
            ₹{todayPendingDue.toLocaleString()}
          </div>
          <span className="text-[11px] text-zinc-300">
            Outstanding from players
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-[#1d3824] pb-2 overflow-x-auto text-xs font-mono">
        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-bold uppercase tracking-wider ${
            activeTab === 'schedule'
              ? 'bg-amber-400 text-black shadow-md'
              : 'text-zinc-400 hover:text-white bg-[#0e1b12] border border-[#1e3825]'
          }`}
        >
          <CalendarIcon className="w-3.5 h-3.5" />
          <span>Timeline Schedule</span>
        </button>

        <button
          onClick={() => setActiveTab('ledger')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-bold uppercase tracking-wider ${
            activeTab === 'ledger'
              ? 'bg-amber-400 text-black shadow-md'
              : 'text-zinc-400 hover:text-white bg-[#0e1b12] border border-[#1e3825]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Bookings CRM ({bookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-bold uppercase tracking-wider ${
            activeTab === 'settings'
              ? 'bg-amber-400 text-black shadow-md'
              : 'text-zinc-400 hover:text-white bg-[#0e1b12] border border-[#1e3825]'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Pricing & Rules</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-bold uppercase tracking-wider ${
            activeTab === 'analytics'
              ? 'bg-amber-400 text-black shadow-md'
              : 'text-zinc-400 hover:text-white bg-[#0e1b12] border border-[#1e3825]'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Revenue Analytics</span>
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

      {activeTab === 'analytics' && (
        <RevenueAnalytics
          bookings={bookings}
          pitches={pitches}
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
      />

    </div>
  );
};
