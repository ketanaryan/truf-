import React from 'react';
import { 
  CircleDot, 
  Shirt, 
  ShieldCheck, 
  Video, 
  Zap, 
  Footprints, 
  Plus, 
  Minus 
} from 'lucide-react';
import { AddonItem } from '../../types';

interface AddonsSelectorProps {
  addons: AddonItem[];
  selectedAddons: { [addonId: string]: number };
  onToggleAddon: (addonId: string) => void;
  onUpdateQty: (addonId: string, delta: number) => void;
}

export const AddonsSelector: React.FC<AddonsSelectorProps> = ({
  addons,
  selectedAddons,
  onToggleAddon,
  onUpdateQty
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'CircleDot': return <CircleDot className="w-4 h-4 text-emerald-400" />;
      case 'Shirt': return <Shirt className="w-4 h-4 text-emerald-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'Video': return <Video className="w-4 h-4 text-emerald-400" />;
      case 'Zap': return <Zap className="w-4 h-4 text-emerald-400" />;
      case 'Footprints': return <Footprints className="w-4 h-4 text-emerald-400" />;
      default: return <CircleDot className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-zinc-400 uppercase tracking-wider font-semibold">
          Match Add-ons & Equipment
        </span>
        <span className="text-zinc-500">Optional</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {addons.map(addon => {
          const qty = selectedAddons[addon.id] || 0;
          const isSelected = qty > 0;

          return (
            <div
              key={addon.id}
              className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                isSelected
                  ? 'bg-[#141a16] border-emerald-500/40'
                  : 'bg-[#090c0a] border-white/5 hover:border-white/15'
              }`}
            >
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <div className="p-2 rounded-lg bg-[#121614] border border-white/5 shrink-0">
                  {getIcon(addon.icon)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white truncate">{addon.name}</span>
                    <span className="text-[11px] font-mono text-emerald-400 font-bold shrink-0">+₹{addon.price}</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 truncate">
                    {addon.description}
                  </p>
                </div>
              </div>

              {/* Stepper */}
              <div className="shrink-0">
                {isSelected ? (
                  <div className="flex items-center gap-1 bg-[#0d110f] p-1 rounded-lg border border-white/10">
                    <button
                      onClick={() => onUpdateQty(addon.id, -1)}
                      className="w-5 h-5 rounded flex items-center justify-center text-zinc-400 hover:text-white"
                    >
                      <Minus className="w-2.5 h-2.5" />
                    </button>
                    <span className="text-xs font-mono font-bold text-white px-1.5">{qty}</span>
                    <button
                      onClick={() => onUpdateQty(addon.id, 1)}
                      className="w-5 h-5 rounded flex items-center justify-center text-zinc-400 hover:text-white"
                    >
                      <Plus className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onToggleAddon(addon.id)}
                    className="px-2.5 py-1 rounded-lg bg-[#151a17] hover:bg-white hover:text-black border border-white/5 text-[11px] font-mono text-zinc-300 transition-colors"
                  >
                    + Add
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
