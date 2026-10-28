import React, { useState, useEffect } from 'react';
import { HARLEM_NODES, INITIAL_ROVERS, INITIAL_SMART_HUB } from './data/harlemData';
import { StreetViewNode, Hotspot, PovMode, TimeOfDay, AutonomousRover, SmartWasteHub } from './types/worldModel';
import { soundEngine } from './utils/audioSynthesizer';
import { HeaderTopBar } from './components/HeaderTopBar';
import { StreetViewController } from './components/StreetViewController';
import { HarlemStreetGridMap } from './components/HarlemStreetGridMap';
import { WaypointRail } from './components/WaypointRail';
import { SmartWasteHubModal } from './components/SmartWasteHubModal';
import { RoverTelemetryModal } from './components/RoverTelemetryModal';
import { CanopyMistModal } from './components/CanopyMistModal';
import { VignetteNarrator } from './components/VignetteNarrator';
import { FleetGridPanel } from './components/FleetGridPanel';
import { Radio, Sparkles } from 'lucide-react';

export default function App() {
  const [currentNodeId, setCurrentNodeId] = useState<string>('node_apollo_125');
  const currentNode = HARLEM_NODES[currentNodeId] || HARLEM_NODES.node_apollo_125;

  const [heading, setHeading] = useState<number>(currentNode.defaultHeading);
  const [pitch, setPitch] = useState<number>(currentNode.defaultPitch);
  const [fov, setFov] = useState<number>(currentNode.defaultFov);
  const [povMode, setPovMode] = useState<PovMode>('pedestrian');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('midday');
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [mistActive, setMistActive] = useState<boolean>(false);

  // Modals & Drawers
  const [activeModal, setActiveModal] = useState<'waste_hub' | 'rover' | 'mist' | 'fleet_grid' | null>(null);
  const [selectedRover, setSelectedRover] = useState<AutonomousRover>(INITIAL_ROVERS[0]);
  const [rovers, setRovers] = useState<AutonomousRover[]>(INITIAL_ROVERS);
  const [smartHub, setSmartHub] = useState<SmartWasteHub>(INITIAL_SMART_HUB);
  const [isVignetteOpen, setIsVignetteOpen] = useState<boolean>(false);

  // Switch node and restore default camera orientation smoothly
  const handleSelectNode = (nodeId: string, customHeading?: number, customPitch?: number) => {
    const target = HARLEM_NODES[nodeId];
    if (target) {
      setCurrentNodeId(nodeId);
      setHeading(customHeading !== undefined ? customHeading : target.defaultHeading);
      setPitch(customPitch !== undefined ? customPitch : target.defaultPitch);
      setFov(target.defaultFov);
    }
  };

  const handleOpenHotspot = (hotspot: Hotspot) => {
    soundEngine.playStepClick();
    if (hotspot.type === 'waste_hub') {
      setActiveModal('waste_hub');
    } else if (hotspot.type === 'sweeper_rover') {
      const match = rovers.find((r) => r.id === 'rover_07') || rovers[0];
      setSelectedRover(match);
      setActiveModal('rover');
    } else if (hotspot.type === 'mist_nozzle') {
      setActiveModal('mist');
    } else if (hotspot.type === 'apollo_marquee') {
      soundEngine.playJazzChord();
    } else if (hotspot.type === 'solar_dock') {
      const match = rovers.find((r) => r.id === 'rover_214') || rovers[2];
      setSelectedRover(match);
      setActiveModal('rover');
    } else if (hotspot.type === 'stoop_polisher') {
      const match = rovers.find((r) => r.id === 'polisher_02') || rovers[3];
      setSelectedRover(match);
      setActiveModal('rover');
    }
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEngine.setMuted(nextMuted);
    if (!nextMuted) {
      soundEngine.startAmbientEngine();
      soundEngine.playJazzChord();
    } else {
      soundEngine.stopAmbientEngine();
    }
  };

  const handleTriggerMistBurst = () => {
    setMistActive(true);
    soundEngine.playMistHiss();
    setTimeout(() => {
      setMistActive(false);
    }, 3200);
  };

  const handleUpdateRover = (updated: Partial<AutonomousRover>) => {
    setRovers((prev) =>
      prev.map((r) => (r.id === selectedRover.id ? { ...r, ...updated } : r))
    );
    setSelectedRover((prev) => ({ ...prev, ...updated }));
  };

  const handleUpdateHub = (updated: Partial<SmartWasteHub>) => {
    setSmartHub((prev) => ({ ...prev, ...updated }));
  };

  const handleDispatchAllRovers = () => {
    setRovers((prev) =>
      prev.map((r) => ({
        ...r,
        status: 'sweeping',
        brushesRpm: 700,
        strayDebrisCleared: r.strayDebrisCleared + 20,
      }))
    );
  };

  // Autonomous rover gentle background movement simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setRovers((prev) =>
        prev.map((r) => {
          if (r.status === 'sweeping' || r.status === 'patrolling') {
            const dx = (Math.random() - 0.5) * 1.5;
            const dy = (Math.random() - 0.5) * 1.5;
            return {
              ...r,
              position: {
                x: Math.max(10, Math.min(90, r.position.x + dx)),
                y: Math.max(10, Math.min(90, r.position.y + dy)),
              },
              distanceCoveredTodayKm: Number((r.distanceCoveredTodayKm + 0.01).toFixed(2)),
            };
          }
          return r;
        })
      );
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col bg-black text-slate-100">
      {/* 3-Zone Clean Header */}
      <HeaderTopBar
        activeCorridorId={currentNodeId}
        onSelectNode={handleSelectNode}
        onStartVignette={() => {
          soundEngine.playJazzChord();
          setIsVignetteOpen(true);
        }}
      />

      {/* Main Street View Viewport */}
      <div className="relative flex-1 w-full h-[calc(100vh-57px)] overflow-hidden">
        <StreetViewController
          node={currentNode}
          heading={heading}
          pitch={pitch}
          fov={fov}
          povMode={povMode}
          timeOfDay={timeOfDay}
          isMuted={isMuted}
          mistActive={mistActive}
          onHeadingChange={setHeading}
          onPitchChange={setPitch}
          onFovChange={setFov}
          onSelectWaypoint={handleSelectNode}
          onOpenHotspot={handleOpenHotspot}
          onPovModeChange={setPovMode}
          onTimeOfDayChange={setTimeOfDay}
          onToggleMute={handleToggleMute}
          onTriggerMist={handleTriggerMistBurst}
        />

        {/* Floating Harlem Eco-Grid Minimap (Bottom-Left) */}
        <div className="absolute bottom-6 left-6 z-30 pointer-events-auto">
          <HarlemStreetGridMap
            currentNodeId={currentNodeId}
            currentHeading={heading}
            rovers={rovers}
            onSelectNode={handleSelectNode}
          />
        </div>

        {/* Quick Corridor Waypoint Thumbnails (Adjacent to minimap on desktop) */}
        <div className="hidden xl:block absolute bottom-6 left-68 z-25 pointer-events-auto">
          <WaypointRail
            currentNodeId={currentNodeId}
            onSelectNode={handleSelectNode}
          />
        </div>

        {/* Open Fleet Telemetry Grid Button (Bottom-Right overlay) */}
        <div className="absolute bottom-6 right-24 z-30 pointer-events-auto">
          <button
            onClick={() => setActiveModal('fleet_grid')}
            className="px-3.5 py-2 rounded-xl bg-slate-950/90 hover:bg-slate-900 border border-teal-500/40 text-teal-300 text-xs font-semibold shadow-2xl backdrop-blur-md flex items-center gap-2 transition-all hover:border-teal-400 hover:text-teal-200"
          >
            <Radio className="w-4 h-4 animate-pulse" />
            <span className="hidden sm:inline">Fleet Grid Telemetry</span>
            <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-200">
              4 Active
            </span>
          </button>
        </div>

        {/* Vignette Walkthrough Modal / Overlay */}
        {isVignetteOpen && (
          <VignetteNarrator
            onClose={() => setIsVignetteOpen(false)}
            onJumpToNode={handleSelectNode}
          />
        )}

        {/* Smart Waste Hub Interactive Modal */}
        {activeModal === 'waste_hub' && (
          <SmartWasteHubModal
            hub={smartHub}
            onClose={() => setActiveModal(null)}
            onUpdateHub={handleUpdateHub}
          />
        )}

        {/* Autonomous Rover Telemetry Modal */}
        {activeModal === 'rover' && (
          <RoverTelemetryModal
            rover={selectedRover}
            onClose={() => setActiveModal(null)}
            onUpdateRover={handleUpdateRover}
          />
        )}

        {/* Sunlit Palm Mist Nozzle Modal */}
        {activeModal === 'mist' && (
          <CanopyMistModal
            onClose={() => setActiveModal(null)}
            onMistActiveToggle={setMistActive}
          />
        )}

        {/* Municipal Fleet Drawer */}
        {activeModal === 'fleet_grid' && (
          <FleetGridPanel
            rovers={rovers}
            hub={smartHub}
            onClose={() => setActiveModal(null)}
            onSelectRover={(rover) => {
              setSelectedRover(rover);
              setActiveModal('rover');
            }}
            onDispatchAll={handleDispatchAllRovers}
          />
        )}
      </div>
    </div>
  );
}
