import React, { useState, useRef, useEffect, useCallback } from 'react';
import { StreetViewNode, Hotspot, WaypointConnection, PovMode, TimeOfDay } from '../types/worldModel';
import { soundEngine } from '../utils/audioSynthesizer';
import {
  Compass,
  Plus,
  Minus,
  Maximize,
  Minimize,
  Eye,
  Sun,
  Sunset,
  Moon,
  Sparkles,
  CloudRain,
  Radio,
  Volume2,
  VolumeX,
  Layers,
  ChevronUp,
} from 'lucide-react';

interface Props {
  node: StreetViewNode;
  heading: number;
  pitch: number;
  fov: number;
  povMode: PovMode;
  timeOfDay: TimeOfDay;
  isMuted: boolean;
  mistActive: boolean;
  isAutoplay?: boolean;
  onUserInteract?: () => void;
  onHeadingChange: (heading: number | ((prev: number) => number)) => void;
  onPitchChange: (pitch: number) => void;
  onFovChange: (fov: number) => void;
  onSelectWaypoint: (targetId: string) => void;
  onOpenHotspot: (hotspot: Hotspot) => void;
  onPovModeChange: (mode: PovMode) => void;
  onTimeOfDayChange: (time: TimeOfDay) => void;
  onToggleMute: () => void;
  onTriggerMist: () => void;
}

export const StreetViewController: React.FC<Props> = ({
  node,
  heading,
  pitch,
  fov,
  povMode,
  timeOfDay,
  isMuted,
  mistActive,
  isAutoplay = false,
  onUserInteract,
  onHeadingChange,
  onPitchChange,
  onFovChange,
  onSelectWaypoint,
  onOpenHotspot,
  onPovModeChange,
  onTimeOfDayChange,
  onToggleMute,
  onTriggerMist,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startMousePos = useRef({ x: 0, y: 0 });
  const startAngles = useRef({ heading: 0, pitch: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Smooth continuous pan drift when in Autoplay mode
  useEffect(() => {
    if (!isAutoplay) return;
    let animId: number;
    const driftLoop = () => {
      if (!isDraggingRef.current) {
        onHeadingChange((prev: number) => (prev + 0.04) % 360);
      }
      animId = requestAnimationFrame(driftLoop);
    };
    animId = requestAnimationFrame(driftLoop);
    return () => cancelAnimationFrame(animId);
  }, [isAutoplay, onHeadingChange]);

  // Smooth angle normalization
  const normalizeAngle = (angle: number) => {
    return ((angle % 360) + 360) % 360;
  };

  // Drag look around handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.interactive-control')) return;
    if (onUserInteract) onUserInteract();
    isDraggingRef.current = true;
    startMousePos.current = { x: e.clientX, y: e.clientY };
    startAngles.current = { heading, pitch };
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - startMousePos.current.x;
      const dy = e.clientY - startMousePos.current.y;

      const sensitivity = fov / 650;
      const newHeading = normalizeAngle(startAngles.current.heading - dx * sensitivity);
      const newPitch = Math.max(-36, Math.min(48, startAngles.current.pitch + dy * sensitivity));

      onHeadingChange(newHeading);
      onPitchChange(newPitch);
    },
    [fov, onHeadingChange, onPitchChange]
  );

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('.interactive-control')) return;
    if (onUserInteract) onUserInteract();
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      startMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      startAngles.current = { heading, pitch };
    }
  };

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - startMousePos.current.x;
      const dy = e.touches[0].clientY - startMousePos.current.y;

      const sensitivity = fov / 550;
      const newHeading = normalizeAngle(startAngles.current.heading - dx * sensitivity);
      const newPitch = Math.max(-36, Math.min(48, startAngles.current.pitch + dy * sensitivity));

      onHeadingChange(newHeading);
      onPitchChange(newPitch);
    },
    [fov, onHeadingChange, onPitchChange]
  );

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * 0.05;
    const newFov = Math.max(45, Math.min(95, fov + delta));
    onFovChange(newFov);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp, handleTouchMove]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        onHeadingChange(normalizeAngle(heading - 8));
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        onHeadingChange(normalizeAngle(heading + 8));
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        onPitchChange(Math.min(48, pitch + 5));
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        onPitchChange(Math.max(-36, pitch - 5));
      } else if (e.key === '+' || e.key === '=') {
        onFovChange(Math.max(45, fov - 5));
      } else if (e.key === '-' || e.key === '_') {
        onFovChange(Math.min(95, fov + 5));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [heading, pitch, fov, onHeadingChange, onPitchChange, onFovChange]);

  const handleWaypointClick = (targetId: string) => {
    setIsTransitioning(true);
    soundEngine.playStepClick();
    setTimeout(() => {
      onSelectWaypoint(targetId);
      setIsTransitioning(false);
    }, 280);
  };

  const handleResetNorth = () => {
    onHeadingChange(0);
    soundEngine.playStepClick();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Convert spherical yaw/pitch difference to 2D screen percentage
  const getScreenCoordinates = (targetYaw: number, targetPitch: number) => {
    let diffYaw = targetYaw - heading;
    while (diffYaw > 180) diffYaw -= 360;
    while (diffYaw < -180) diffYaw += 360;

    const diffPitch = targetPitch - pitch;

    // Projected horizontal & vertical
    const fovRad = (fov * Math.PI) / 180;
    const xPct = 50 + (diffYaw / (fov * 0.9)) * 50;
    const yPct = 50 - (diffPitch / (fov * 0.6)) * 50;

    const isVisible = Math.abs(diffYaw) < fov * 0.7 && Math.abs(diffPitch) < fov * 0.55;
    return { xPct, yPct, isVisible, diffYaw };
  };

  // Atmospheric lighting filters
  const getAtmosphereFilter = () => {
    if (timeOfDay === 'golden_hour') {
      return 'sepia(0.2) saturate(1.25) contrast(1.08) brightness(0.96)';
    }
    if (timeOfDay === 'twilight') {
      return 'brightness(0.72) contrast(1.2) hue-rotate(-12deg) saturate(1.15)';
    }
    return 'brightness(1.02) contrast(1.02)';
  };

  // POV mode transformation
  const getPovTransform = () => {
    if (povMode === 'rover_lidar') {
      return 'scale(1.08) translateY(12%)';
    }
    if (povMode === 'stoop_balcony') {
      return 'scale(1.02) translateY(-6%)';
    }
    if (povMode === 'canopy_drone') {
      return 'scale(1.15) translateY(-14%)';
    }
    return 'scale(1.04) translateY(0%)';
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onWheel={handleWheel}
      className="relative w-full h-full overflow-hidden select-none cursor-grab active:cursor-grabbing bg-black"
    >
      {/* 360° Panoramic Viewport Canvas */}
      <div
        className={`relative w-full h-full transition-opacity duration-300 ${
          isTransitioning ? 'opacity-30 scale-105' : 'opacity-100 scale-100'
        }`}
        style={{
          transform: getPovTransform(),
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.28s ease',
        }}
      >
        <img
          src={node.imageSrc}
          alt={node.title}
          referrerPolicy="no-referrer"
          onError={(e) => {
            const filename = node.imageSrc.split('/').pop()?.split('?')[0];
            if (filename && !e.currentTarget.src.includes('/assets/images/' + filename)) {
              e.currentTarget.src = '/assets/images/' + filename;
            }
          }}
          className="w-full h-full object-cover pointer-events-none transition-all duration-700"
          style={{
            filter: getAtmosphereFilter(),
            transform: `scale(${1 + (95 - fov) / 95}) translate(${((heading - node.defaultHeading) / 360) * -18}%, ${
              (pitch / 90) * 14
            }%)`,
            transformOrigin: 'center center',
          }}
        />

        {/* Ambient Dappled Palm Lattice Shadows Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_rgba(0,0,0,0)_0%,_rgba(0,0,0,0.35)_100%)]" />

        {/* Rover LiDAR Scanning HUD Overlay (When in Rover POV Mode) */}
        {povMode === 'rover_lidar' && (
          <div className="absolute inset-0 pointer-events-none z-10 border-4 border-teal-500/30">
            {/* Scanlines */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(45,212,191,0.06)_1px,transparent_1px)] bg-[size:100%_4px]" />
            <div className="absolute top-24 left-6 font-mono text-xs text-teal-400 space-y-1 bg-black/60 p-3 rounded-lg border border-teal-500/30">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                <span className="font-bold">LIDAR TELEMETRY · 0.45M GROUND SENSOR</span>
              </div>
              <div>SWEEP ROTARY: 650 RPM</div>
              <div>SILICONE BUMPER: CLEAR</div>
              <div>SURFACE: SELF-CLEANING LIMESTONE PAVERS</div>
            </div>
            {/* Crosshair */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-12 h-12 border border-teal-400/40 rounded-full flex items-center justify-center">
                <div className="w-1 h-1 bg-teal-400 rounded-full" />
              </div>
            </div>
          </div>
        )}

        {/* Micro-Cooling Mist Particle Clouds (When Mist is Triggered) */}
        {mistActive && (
          <div className="absolute inset-0 pointer-events-none z-15 overflow-hidden">
            <div className="absolute inset-0 bg-emerald-500/5 backdrop-blur-[0.5px] transition-all" />
            <div className="absolute bottom-1/4 left-1/3 w-96 h-96 rounded-full bg-gradient-to-t from-white/25 via-emerald-200/20 to-transparent blur-3xl mist-particle" />
            <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-gradient-to-t from-white/20 via-cyan-200/15 to-transparent blur-2xl mist-particle delay-700" />
          </div>
        )}

        {/* 3D Pavement Navigation Chevrons / Waypoint Arrows */}
        {node.connections.map((conn) => {
          const coords = getScreenCoordinates(conn.yaw, -22);
          if (!coords.isVisible) return null;

          return (
            <div
              key={conn.targetId}
              style={{
                left: `${coords.xPct}%`,
                top: `${coords.yPct}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute z-20 interactive-control pointer-events-auto"
            >
              <button
                onClick={() => handleWaypointClick(conn.targetId)}
                className="group flex flex-col items-center cursor-pointer transition-transform hover:scale-110 active:scale-95"
              >
                {/* Floating Chevron Target Ring */}
                <div className="relative flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full liquid-glass-panel border-2 border-white/70 shadow-2xl flex items-center justify-center group-hover:border-teal-400 group-hover:shadow-[0_0_24px_rgba(45,212,191,0.6)] transition-all">
                    <ChevronUp className="w-7 h-7 text-white group-hover:text-teal-300 transition-colors" />
                  </div>
                  <div className="absolute inset-0 rounded-full border border-teal-400/50 animate-ping" />
                </div>
                {/* Street Label Kicker */}
                <span className="mt-2 px-2.5 py-1 rounded-lg liquid-glass-panel text-xs font-semibold text-white whitespace-nowrap shadow-xl group-hover:border-teal-400/80 group-hover:text-teal-200 transition-colors">
                  {conn.label} ({conn.distanceMeters}m)
                </span>
              </button>
            </div>
          );
        })}

        {/* 3D Interactive Hotspots in Scene with Liquid Glass */}
        {node.hotspots.map((hotspot) => {
          const coords = getScreenCoordinates(hotspot.yaw, hotspot.pitch);
          if (!coords.isVisible) return null;

          return (
            <div
              key={hotspot.id}
              style={{
                left: `${coords.xPct}%`,
                top: `${coords.yPct}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute z-20 interactive-control pointer-events-auto"
            >
              <button
                onClick={() => onOpenHotspot(hotspot)}
                className="group relative flex items-center gap-2 p-1.5 pr-3 rounded-full liquid-glass-panel border-amber-400/60 shadow-xl hover:border-amber-400 hover:shadow-[0_0_20px_rgba(251,191,36,0.4)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shadow-inner ${
                    hotspot.type === 'waste_hub'
                      ? 'bg-amber-500/25 text-amber-200 glow-teal-ring border border-amber-400/40'
                      : hotspot.type === 'sweeper_rover'
                      ? 'bg-teal-500/25 text-teal-200 border border-teal-400/40'
                      : hotspot.type === 'mist_nozzle'
                      ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-400/40'
                      : 'bg-purple-500/25 text-purple-200 border border-purple-400/40'
                  }`}
                >
                  {hotspot.type === 'waste_hub' && <Sparkles className="w-4 h-4" />}
                  {hotspot.type === 'sweeper_rover' && <Radio className="w-4 h-4" />}
                  {hotspot.type === 'mist_nozzle' && <CloudRain className="w-4 h-4" />}
                  {hotspot.type === 'apollo_marquee' && <Sparkles className="w-4 h-4" />}
                  {hotspot.type === 'solar_dock' && <Sun className="w-4 h-4" />}
                  {hotspot.type === 'stoop_polisher' && <Sparkles className="w-4 h-4" />}
                </div>

                <div className="text-left">
                  <div className="text-[11px] font-semibold text-white tracking-tight leading-none group-hover:text-amber-200 drop-shadow-sm">
                    {hotspot.title}
                  </div>
                  <div className="text-[9px] text-slate-300/80 font-mono mt-0.5">{hotspot.distance} · Inspect</div>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* TOP-LEFT: Authentic Google Street View Address Bar with Liquid Glass */}
      <div className="absolute top-4 left-4 z-30 interactive-control pointer-events-auto max-w-sm sm:max-w-md">
        <div className="liquid-glass-panel rounded-2xl p-3 sm:p-3.5 text-white">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-teal-300 font-semibold flex items-center gap-1 drop-shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_6px_#2dd4bf]" />
              Harlem Eco-District · World Model
            </span>
            <span className="text-[10px] font-mono text-slate-300/80 tabular-nums">
              {node.coordinates.lat.toFixed(4)}° N, {Math.abs(node.coordinates.lng).toFixed(4)}° W
            </span>
          </div>

          <h2 className="text-sm sm:text-base font-bold text-white tracking-tight truncate drop-shadow-sm">{node.title}</h2>
          <p className="text-xs text-slate-300/90 truncate mt-0.5">{node.address}</p>

          <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300 font-mono">
            <span>Canopy: {node.telemetry.canopyDensity.split(' ')[0]} 88%</span>
            <span className="text-emerald-300 font-semibold drop-shadow-sm">AQI: {node.telemetry.airQualityIndex} (Pristine)</span>
            <span className="text-amber-200/90">{node.telemetry.ambientTempF}°F</span>
          </div>
        </div>
      </div>

      {/* TOP-RIGHT: Street View Controls & Tools Bar with Liquid Glass */}
      <div className="absolute top-4 right-4 z-30 interactive-control pointer-events-auto flex items-center gap-2">
        {/* POV Mode Selector */}
        <div className="liquid-glass-panel rounded-xl p-1 flex items-center gap-1">
          <button
            onClick={() => onPovModeChange('pedestrian')}
            title="Pedestrian Eye-Level View (1.75m)"
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              povMode === 'pedestrian'
                ? 'liquid-glass-amber-btn text-slate-950 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Pedestrian
          </button>
          <button
            onClick={() => onPovModeChange('rover_lidar')}
            title="Sweeper Rover LiDAR Cockpit View (0.45m)"
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              povMode === 'rover_lidar'
                ? 'bg-teal-400 text-slate-950 font-bold shadow-[0_0_12px_rgba(45,212,191,0.5)] border border-white/40'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Rover LiDAR
          </button>
          <button
            onClick={() => onPovModeChange('stoop_balcony')}
            title="Brownstone Stoop Balcony View (3.4m)"
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              povMode === 'stoop_balcony'
                ? 'bg-purple-500 text-white font-bold shadow-[0_0_12px_rgba(168,85,247,0.5)] border border-white/40'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Stoop View
          </button>
          <button
            onClick={() => onPovModeChange('canopy_drone')}
            title="Canopy Drone Aerial View (14m)"
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              povMode === 'canopy_drone'
                ? 'bg-emerald-400 text-slate-950 font-bold shadow-[0_0_12px_rgba(52,211,153,0.5)] border border-white/40'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Canopy Drone
          </button>
        </div>

        {/* Time of Day Lighting Toggle */}
        <div className="liquid-glass-panel rounded-xl p-1 flex items-center">
          <button
            onClick={() => onTimeOfDayChange('midday')}
            title="Midday Sun (Sharp palm shadows)"
            className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
              timeOfDay === 'midday'
                ? 'bg-amber-400/30 text-amber-200 border border-amber-400/40 shadow-[0_0_8px_rgba(251,191,36,0.4)]'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Sun className="w-4 h-4" />
          </button>
          <button
            onClick={() => onTimeOfDayChange('golden_hour')}
            title="Golden Hour (Warm brownstone glow)"
            className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
              timeOfDay === 'golden_hour'
                ? 'bg-amber-400/30 text-amber-200 border border-amber-400/40 shadow-[0_0_8px_rgba(251,191,36,0.4)]'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Sunset className="w-4 h-4" />
          </button>
          <button
            onClick={() => onTimeOfDayChange('twilight')}
            title="Twilight / Neon Night (Apollo marquee & teal waste rings)"
            className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
              timeOfDay === 'twilight'
                ? 'bg-teal-400/30 text-teal-200 border border-teal-400/40 shadow-[0_0_8px_rgba(45,212,191,0.4)]'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Moon className="w-4 h-4" />
          </button>
        </div>

        {/* Mist Burst Button */}
        <button
          onClick={onTriggerMist}
          title="Trigger Sunlit Tree Trunk Mist Micro-Cooling"
          className={`p-2 rounded-xl liquid-glass-btn transition-all cursor-pointer ${
            mistActive ? 'bg-emerald-500/30 text-emerald-200 border-emerald-400/60 shadow-[0_0_12px_rgba(52,211,153,0.5)]' : 'text-slate-200 hover:text-white'
          }`}
        >
          <CloudRain className="w-4 h-4" />
        </button>

        {/* Audio Ambiance Mute Toggle */}
        <button
          onClick={onToggleMute}
          title={isMuted ? 'Unmute Harlem ambient soundscape' : 'Mute soundscape'}
          className="p-2 rounded-xl liquid-glass-btn text-slate-200 hover:text-white transition-all cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-300" /> : <Volume2 className="w-4 h-4 text-teal-300" />}
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          className="p-2 rounded-xl liquid-glass-btn text-slate-200 hover:text-white transition-all cursor-pointer"
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>
      </div>

      {/* BOTTOM-RIGHT: Compass & Zoom Controls with Liquid Glass */}
      <div className="absolute bottom-6 right-6 z-30 interactive-control pointer-events-auto flex flex-col items-center gap-2">
        {/* Compass Widget */}
        <button
          onClick={handleResetNorth}
          title="Click to face North (0°)"
          className="relative w-11 h-11 rounded-full liquid-glass-panel flex items-center justify-center hover:border-amber-400/80 transition-all group cursor-pointer"
        >
          <div
            className="w-full h-full flex items-center justify-center transition-transform duration-150"
            style={{ transform: `rotate(${-heading}deg)` }}
          >
            {/* North Red Pointer */}
            <div className="w-0.5 h-3.5 bg-rose-500 absolute top-1 rounded-t shadow-[0_0_4px_#f43f5e]" />
            <div className="w-0.5 h-3.5 bg-slate-300 absolute bottom-1 rounded-b" />
            <span className="text-[8px] font-bold text-rose-300 absolute top-4 font-mono">N</span>
          </div>
        </button>

        {/* Zoom In/Out Buttons */}
        <div className="liquid-glass-panel rounded-xl overflow-hidden flex flex-col">
          <button
            onClick={() => onFovChange(Math.max(45, fov - 8))}
            title="Zoom in (+)"
            className="p-2 text-slate-200 hover:text-white hover:bg-white/10 border-b border-white/10 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => onFovChange(Math.min(95, fov + 8))}
            title="Zoom out (-)"
            className="p-2 text-slate-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Keyboard Hints helper */}
        <div className="hidden sm:block text-[9px] font-mono text-slate-300 liquid-glass-panel-subtle px-2 py-1 rounded text-center">
          DRAG OR ARROWS
        </div>
      </div>
    </div>
  );
};
