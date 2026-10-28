import React, { useState } from 'react';
import { SmartWasteHub } from '../types/worldModel';
import { soundEngine } from '../utils/audioSynthesizer';
import { X, Sparkles, Wind, Layers, CheckCircle2 } from 'lucide-react';

interface Props {
  hub: SmartWasteHub;
  onClose: () => void;
  onUpdateHub: (updated: Partial<SmartWasteHub>) => void;
}

export const SmartWasteHubModal: React.FC<Props> = ({ hub, onClose, onUpdateHub }) => {
  const [selectedInlet, setSelectedInlet] = useState<'compost' | 'recycle' | 'landfill'>('recycle');
  const [isProcessing, setIsProcessing] = useState(false);
  const [sensorTriggered, setSensorTriggered] = useState(false);
  const [lastItemDisposed, setLastItemDisposed] = useState<string | null>(null);

  const sampleItems = [
    { name: 'Paper Iced Tea Cup (125th St Café)', category: 'recycle' as const, weightKg: 0.05 },
    { name: 'Canary Palm Dried Frond Cutting', category: 'compost' as const, weightKg: 0.22 },
    { name: 'Espresso Grounds & Sugar Husk', category: 'compost' as const, weightKg: 0.08 },
    { name: 'Aluminum Sparkling Water Can', category: 'recycle' as const, weightKg: 0.03 },
    { name: 'Degraded Napkin & Wax Wrapper', category: 'landfill' as const, weightKg: 0.04 },
  ];

  const handleTriggerSensor = () => {
    setSensorTriggered(true);
    soundEngine.playRoverChime();
    setTimeout(() => {
      setSensorTriggered(false);
    }, 1800);
  };

  const handleDisposeItem = (item: { name: string; category: 'compost' | 'recycle' | 'landfill'; weightKg: number }) => {
    if (isProcessing) return;

    setSelectedInlet(item.category);
    setIsProcessing(true);
    setLastItemDisposed(item.name);

    // Audio SFX: Pneumatic suction whoosh
    soundEngine.playPneumaticWhoosh();

    setTimeout(() => {
      onUpdateHub({
        compostLevelPercent: item.category === 'compost' ? Math.min(100, hub.compostLevelPercent + 3) : hub.compostLevelPercent,
        recycleLevelPercent: item.category === 'recycle' ? Math.min(100, hub.recycleLevelPercent + 2) : hub.recycleLevelPercent,
        landfillLevelPercent: item.category === 'landfill' ? Math.min(100, hub.landfillLevelPercent + 2) : hub.landfillLevelPercent,
        totalCompactedKg: Number((hub.totalCompactedKg + item.weightKg).toFixed(2)),
      });
      setIsProcessing(false);
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-900/40 rounded-2xl shadow-2xl overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Art Deco Brushed-Bronze Header Banner */}
        <div className="px-6 py-4 bg-gradient-to-r from-stone-900 via-amber-950/60 to-stone-900 border-b border-amber-700/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-amber-100 tracking-tight">Smart Waste Hub · Art-Deco Sub-Street Terminal</h3>
              <p className="text-xs text-amber-300/70">{hub.location}</p>
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

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Visual Receptacle Representation */}
          <div className="flex flex-col items-center justify-between p-5 bg-slate-950/80 rounded-xl border border-slate-800">
            {/* Illuminated Art-Deco Status Ring */}
            <div className="flex flex-col items-center gap-2 mb-4">
              <div className="relative flex items-center justify-center">
                <div
                  className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-500 ${
                    isProcessing
                      ? 'border-emerald-400 bg-emerald-950/40 shadow-[0_0_30px_rgba(52,211,153,0.7)]'
                      : hub.ringColor === 'teal'
                      ? 'border-teal-400/80 bg-teal-950/30 glow-teal-ring'
                      : 'border-amber-400/80 bg-amber-950/30'
                  }`}
                >
                  <Wind className={`w-8 h-8 ${isProcessing ? 'text-emerald-300 animate-spin' : 'text-teal-300'}`} />
                  <span className="text-[11px] font-mono tracking-wider text-teal-200 mt-1 uppercase">
                    {isProcessing ? 'COMPACTING' : 'READY / EMPTY'}
                  </span>
                </div>
              </div>
              <span className="text-xs text-slate-400 text-center">
                Brushed bronze & matte-black Harlem Renaissance casing
              </span>
            </div>

            {/* Contactless Wave Sensor Bar */}
            <div className="w-full bg-slate-900/90 rounded-lg p-3 border border-slate-700/60 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Contactless Sensor Inlet</span>
                <span className="text-teal-400 font-mono text-[11px]">Foot/Hand Wave Active</span>
              </div>
              <button
                onClick={handleTriggerSensor}
                className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-teal-500/20 border border-teal-500/40 text-teal-200 hover:bg-teal-500/30 transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {sensorTriggered ? 'Aperture Open · Sensor Verified' : 'Test Contactless Sensor Wave'}
              </button>
            </div>

            {/* Pneumatic Conduit Sub-Street Status */}
            <div className="w-full mt-3 pt-3 border-t border-slate-800 text-[11px] font-mono flex items-center justify-between text-slate-400">
              <span>Vacuum Line: {hub.subStreetVacuumPressurePsi} PSI</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Sub-Street Vault Online
              </span>
            </div>
          </div>

          {/* Right Column: Inlets & Disposal Simulator */}
          <div className="flex flex-col justify-between space-y-4">
            <div>
              <h4 className="text-xs uppercase tracking-wider font-semibold text-amber-300/80 mb-2">
                Three-Stream Dedicated Chutes
              </h4>
              <div className="grid grid-cols-3 gap-2">
                <div
                  className={`p-2.5 rounded-lg border text-center transition-all ${
                    selectedInlet === 'compost'
                      ? 'border-emerald-500/80 bg-emerald-500/20 text-emerald-200'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400'
                  }`}
                >
                  <div className="text-xs font-medium">Compost</div>
                  <div className="text-lg font-mono font-bold mt-1 tabular-nums">{hub.compostLevelPercent}%</div>
                  <div className="text-[10px] text-slate-400">Palm & Food</div>
                </div>

                <div
                  className={`p-2.5 rounded-lg border text-center transition-all ${
                    selectedInlet === 'recycle'
                      ? 'border-cyan-500/80 bg-cyan-500/20 text-cyan-200'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400'
                  }`}
                >
                  <div className="text-xs font-medium">Recycle</div>
                  <div className="text-lg font-mono font-bold mt-1 tabular-nums">{hub.recycleLevelPercent}%</div>
                  <div className="text-[10px] text-slate-400">Clean Fiber/Can</div>
                </div>

                <div
                  className={`p-2.5 rounded-lg border text-center transition-all ${
                    selectedInlet === 'landfill'
                      ? 'border-slate-500/80 bg-slate-500/20 text-slate-200'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400'
                  }`}
                >
                  <div className="text-xs font-medium">Landfill</div>
                  <div className="text-lg font-mono font-bold mt-1 tabular-nums">{hub.landfillLevelPercent}%</div>
                  <div className="text-[10px] text-slate-400">Residual</div>
                </div>
              </div>
            </div>

            {/* Test Disposal Item List */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                  Simulate Street Disposal (Vignette)
                </h4>
                <span className="text-[11px] text-teal-400 font-mono">Pneumatic Compaction</span>
              </div>
              <div className="space-y-1.5">
                {sampleItems.map((item) => (
                  <button
                    key={item.name}
                    disabled={isProcessing}
                    onClick={() => handleDisposeItem(item)}
                    className="w-full text-left p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-xs transition-colors flex items-center justify-between group disabled:opacity-50"
                  >
                    <span className="text-slate-200 group-hover:text-white truncate">{item.name}</span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-900 text-slate-400 ml-2 shrink-0">
                      Drop & Vacuum
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Last Disposed Result Banner */}
            {lastItemDisposed && (
              <div className="p-2.5 rounded-lg bg-teal-950/50 border border-teal-500/30 text-teal-200 text-xs flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-400 shrink-0" />
                <span className="truncate">
                  Vacuumed <span className="font-semibold text-white">{lastItemDisposed}</span> into subterranean conduits with 45 PSI pulse!
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
