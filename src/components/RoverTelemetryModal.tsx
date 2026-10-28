import React, { useState } from 'react';
import { AutonomousRover } from '../types/worldModel';
import { soundEngine } from '../utils/audioSynthesizer';
import { X, Battery, Cpu, Radar, Bell, RotateCcw, ShieldCheck, SunMedium, Play } from 'lucide-react';

interface Props {
  rover: AutonomousRover;
  onClose: () => void;
  onUpdateRover: (updated: Partial<AutonomousRover>) => void;
}

export const RoverTelemetryModal: React.FC<Props> = ({ rover, onClose, onUpdateRover }) => {
  const [chimeTriggered, setChimeTriggered] = useState(false);
  const [isSweepingActive, setIsSweepingActive] = useState(rover.status === 'sweeping');

  const handleChime = () => {
    setChimeTriggered(true);
    soundEngine.playRoverChime();
    setTimeout(() => {
      setChimeTriggered(false);
    }, 1200);
  };

  const handleToggleSweep = () => {
    const nextState = !isSweepingActive;
    setIsSweepingActive(nextState);
    if (nextState) {
      soundEngine.playRoverChime();
      onUpdateRover({
        status: 'sweeping',
        brushesRpm: 720,
        strayDebrisCleared: rover.strayDebrisCleared + 14,
      });
    } else {
      onUpdateRover({
        status: 'patrolling',
        brushesRpm: 300,
      });
    }
  };

  const handleDockStation = () => {
    soundEngine.playStepClick();
    onUpdateRover({
      status: 'docked',
      brushesRpm: 0,
      batteryPercent: 100,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-teal-500/30 rounded-2xl shadow-2xl overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Radar className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-white tracking-tight">{rover.name}</h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  {rover.callsign}
                </span>
              </div>
              <p className="text-xs text-slate-400">{rover.sector}</p>
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

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Telemetry Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Power Grid</span>
                <Battery className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-xl font-mono font-bold text-white tabular-nums">{rover.batteryPercent}%</div>
              <div className="text-[11px] text-emerald-400 mt-0.5">Solar Induction Ready</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Rotary Brushes</span>
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="text-xl font-mono font-bold text-white tabular-nums">
                {isSweepingActive ? '720' : rover.brushesRpm} <span className="text-xs font-normal text-slate-400">RPM</span>
              </div>
              <div className="text-[11px] text-cyan-300 mt-0.5">Whisper Brush Dual</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Hopper Load</span>
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-xl font-mono font-bold text-white tabular-nums">{rover.hopperCapacityPercent}%</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Auto-dump at Hub</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Patrol Distance</span>
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <div className="text-xl font-mono font-bold text-white tabular-nums">{rover.distanceCoveredTodayKm} <span className="text-xs font-normal text-slate-400">km</span></div>
              <div className="text-[11px] text-purple-300 mt-0.5">{rover.strayDebrisCleared} micro-debris</div>
            </div>
          </div>

          {/* Real-time LiDAR Optical Scanner Simulation */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                <Radar className="w-4 h-4" /> 360° LiDAR & Soft Silicone Bumper Perimeter
              </span>
              <span className="text-[11px] font-mono text-emerald-400">Optical Safe Distance: 1.8m</span>
            </div>

            <div className="relative h-28 bg-slate-900/90 rounded-lg overflow-hidden border border-teal-500/20 flex items-center justify-center">
              {/* Radar Grid Circles */}
              <div className="absolute w-20 h-20 rounded-full border border-teal-500/20" />
              <div className="absolute w-36 h-36 rounded-full border border-teal-500/20" />
              <div className="absolute w-52 h-52 rounded-full border border-teal-500/10" />

              {/* Sweeping Radar Line */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-1/2 h-0.5 bg-gradient-to-r from-teal-400 to-transparent origin-left animate-spin" />
              </div>

              {/* Detected targets */}
              <div className="absolute top-4 left-12 flex items-center gap-1 text-[10px] font-mono text-teal-300">
                <div className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                <span>Permeable Paver Edge [0.6m]</span>
              </div>

              <div className="absolute bottom-4 right-16 flex items-center gap-1 text-[10px] font-mono text-cyan-300">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>Canary Palm Planter [2.4m]</span>
              </div>

              <div className="absolute top-6 right-20 flex items-center gap-1 text-[10px] font-mono text-amber-300">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Pedestrian Footpath [3.1m]</span>
              </div>

              <div className="z-10 text-center">
                <div className="w-5 h-5 rounded-md bg-teal-400 border border-white mx-auto shadow-sm" />
                <span className="text-[10px] font-mono text-slate-300 mt-1 block">ROVER POV</span>
              </div>
            </div>
          </div>

          {/* Interactive Autonomous Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={handleChime}
              className="py-2.5 px-3 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Bell className="w-4 h-4 text-teal-400" />
              {chimeTriggered ? 'Chime Emitted (Two-Tone)' : 'Emit Pedestrian Chime'}
            </button>

            <button
              onClick={handleToggleSweep}
              className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                isSweepingActive
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-200'
                  : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200'
              }`}
            >
              <Play className="w-4 h-4" />
              {isSweepingActive ? 'Pause Rotary Brushes' : 'Start Micro-Sweep'}
            </button>

            <button
              onClick={handleDockStation}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <SunMedium className="w-4 h-4 text-amber-400" />
              Return to Solar Dock
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
