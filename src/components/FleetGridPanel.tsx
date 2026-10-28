import React from 'react';
import { AutonomousRover, SmartWasteHub } from '../types/worldModel';
import { soundEngine } from '../utils/audioSynthesizer';
import { X, Battery, Cpu, Radar, Wind, Droplets, CheckCircle2, Bell } from 'lucide-react';

interface Props {
  rovers: AutonomousRover[];
  hub: SmartWasteHub;
  onClose: () => void;
  onSelectRover: (rover: AutonomousRover) => void;
  onDispatchAll: () => void;
}

export const FleetGridPanel: React.FC<Props> = ({
  rovers,
  hub,
  onClose,
  onSelectRover,
  onDispatchAll,
}) => {
  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full max-w-md bg-slate-950/95 border-l border-slate-800 p-6 shadow-2xl backdrop-blur-md overflow-y-auto text-slate-100 animate-in slide-in-from-right duration-300">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-semibold text-white tracking-tight">Harlem Sanitation & Eco-Grid</h3>
          <p className="text-xs text-teal-400 font-mono mt-0.5">Autonomous Fleet · Sub-Tropical Municipal Ops</p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="py-5 space-y-6">
        {/* District Overview Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              <span>Rain Cistern Storage</span>
            </div>
            <div className="text-xl font-mono font-bold text-white tabular-nums">74%</div>
            <div className="text-[10px] text-cyan-300 mt-0.5">Subterranean permeable capture</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Wind className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cleanliness Index</span>
            </div>
            <div className="text-xl font-mono font-bold text-white tabular-nums">99.8%</div>
            <div className="text-[10px] text-emerald-300 mt-0.5">Zero litter or gum detected</div>
          </div>
        </div>

        {/* Fleet Dispatch Action */}
        <div className="p-4 rounded-xl bg-teal-950/30 border border-teal-500/30 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-teal-200">Municipal Micro-Sweep Wave</div>
            <div className="text-[11px] text-slate-300">Sync all 4 sweepers across Harlem corridors</div>
          </div>
          <button
            onClick={() => {
              soundEngine.playRoverChime();
              onDispatchAll();
            }}
            className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs shadow-md transition-colors"
          >
            Dispatch All
          </button>
        </div>

        {/* Active Rovers List */}
        <div>
          <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-3">
            Autonomous Fleet Units ({rovers.length})
          </h4>
          <div className="space-y-2.5">
            {rovers.map((rover) => (
              <div
                key={rover.id}
                onClick={() => onSelectRover(rover)}
                className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-teal-500/50 cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-400" />
                    <span className="text-xs font-semibold text-white group-hover:text-teal-200">
                      {rover.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                    {rover.status.toUpperCase()}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 mb-2 truncate">{rover.sector}</p>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/60">
                  <span className="flex items-center gap-1">
                    <Battery className="w-3 h-3 text-emerald-400" /> {rover.batteryPercent}%
                  </span>
                  <span className="flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-cyan-400" /> {rover.brushesRpm} RPM
                  </span>
                  <span>{rover.distanceCoveredTodayKm} km</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Smart Receptacle Status */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-amber-200">Sub-Street Pneumatics</span>
            <span className="text-emerald-400 text-[11px] font-mono flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> 45 PSI Stable
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Total waste compacted today: <span className="text-white font-mono font-semibold">{hub.totalCompactedKg} kg</span> across
            50-meter interval art-deco hubs.
          </p>
        </div>
      </div>
    </div>
  );
};
