import React, { useState } from 'react';
import { soundEngine } from '../utils/audioSynthesizer';
import { X, CloudRain, Thermometer, Wind, Sparkles } from 'lucide-react';

interface Props {
  onClose: () => void;
  onMistActiveToggle?: (active: boolean) => void;
}

export const CanopyMistModal: React.FC<Props> = ({ onClose, onMistActiveToggle }) => {
  const [isMisting, setIsMisting] = useState(false);
  const [mistCyclesRun, setMistCyclesRun] = useState(3);

  const handleTriggerMist = () => {
    setIsMisting(true);
    soundEngine.playMistHiss();
    if (onMistActiveToggle) onMistActiveToggle(true);

    setTimeout(() => {
      setIsMisting(false);
      setMistCyclesRun((prev) => prev + 1);
      if (onMistActiveToggle) onMistActiveToggle(false);
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border-b border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CloudRain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white tracking-tight">Sunlit Trunk Mist Nozzle Controller</h3>
              <p className="text-xs text-emerald-300/80">Micro-Cooling & Atmosphere Regulation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <p className="text-xs text-slate-300 leading-relaxed">
            Sunlit mist nozzles nestled within Canary palm and fan palm tree trunks deliver intermittent micro-cooling
            for Harlem pedestrians. Rainwater captured by permeable white limestone pavers is filtered through subterranean
            cisterns before atomization.
          </p>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="flex items-center justify-center text-slate-400 mb-1">
                <Thermometer className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-lg font-mono font-bold text-white tabular-nums">{isMisting ? '74°F' : '78°F'}</div>
              <div className="text-[10px] text-emerald-300 mt-0.5">Sidewalk Comfort</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="flex items-center justify-center text-slate-400 mb-1">
                <Wind className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-lg font-mono font-bold text-white tabular-nums">48 <span className="text-xs font-normal">PSI</span></div>
              <div className="text-[10px] text-cyan-300 mt-0.5">Atomization Pressure</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="flex items-center justify-center text-slate-400 mb-1">
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-lg font-mono font-bold text-white tabular-nums">{mistCyclesRun}</div>
              <div className="text-[10px] text-purple-300 mt-0.5">Today's Micro-Bursts</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-xs font-medium text-slate-300 flex items-center justify-between">
              <span>Sub-Tropical Olfactory Notes</span>
              <span className="text-emerald-400 text-[11px] font-mono">100% Organic Ambient</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-700/60 text-xs text-amber-200">
                Sweet Frangipani Blossoms
              </span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-700/60 text-xs text-amber-300">
                Sidewalk Café Roasting Espresso
              </span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-700/60 text-xs text-emerald-300">
                Rain-washed White Granite
              </span>
            </div>
          </div>

          <button
            disabled={isMisting}
            onClick={handleTriggerMist}
            className={`w-full py-3 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
              isMisting
                ? 'bg-emerald-500/40 text-emerald-100 border border-emerald-400'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50'
            }`}
          >
            <CloudRain className={`w-4 h-4 ${isMisting ? 'animate-bounce' : ''}`} />
            {isMisting ? 'Atomizing Micro-Cooling Vapor...' : 'Trigger Trunk Mist Nozzle Burst'}
          </button>
        </div>
      </div>
    </div>
  );
};
