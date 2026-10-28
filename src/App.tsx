import React, { useState, useEffect } from 'react';
import { HARLEM_NODES, INITIAL_ROVERS, INITIAL_SMART_HUB } from './data/harlemData';
import { StreetViewNode, Hotspot, PovMode, TimeOfDay, AutonomousRover, SmartWasteHub } from './types/worldModel';
import { soundEngine } from './utils/audioSynthesizer';
import { HeaderTopBar } from './components/HeaderTopBar';
import { StreetViewController } from './components/StreetViewController';
import { HarlemStreetGridMap } from './components/HarlemStreetGridMap';
import { SmartWasteHubModal } from './components/SmartWasteHubModal';
import { RoverTelemetryModal } from './components/RoverTelemetryModal';
import { CanopyMistModal } from './components/CanopyMistModal';
import { VignetteNarrator } from './components/VignetteNarrator';
import { FleetGridPanel } from './components/FleetGridPanel';
import { RealStreetViewModal } from './components/RealStreetViewModal';
import { VideoTourExporterModal } from './components/VideoTourExporterModal';
import { BottomCarouselDeck } from './components/BottomCarouselDeck';

const ALL_CORRIDOR_NODES = Object.values(HARLEM_NODES);

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

  // Hero Corridors Autoplay State
  const [isAutoplay, setIsAutoplay] = useState<boolean>(true);
  const [autoplayProgress, setAutoplayProgress] = useState<number>(0);

  // Modals & Drawers
  const [activeModal, setActiveModal] = useState<
    'waste_hub' | 'rover' | 'mist' | 'fleet_grid' | 'real_street_view' | 'video_exporter' | null
  >(null);
  const [selectedRover, setSelectedRover] = useState<AutonomousRover>(INITIAL_ROVERS[0]);
  const [rovers, setRovers] = useState<AutonomousRover[]>(INITIAL_ROVERS);
  const [smartHub, setSmartHub] = useState<SmartWasteHub>(INITIAL_SMART_HUB);
  const [isVignetteOpen, setIsVignetteOpen] = useState<boolean>(false);

  const currentCorridorIndex = Math.max(
    0,
    ALL_CORRIDOR_NODES.findIndex((n) => n.id === currentNodeId)
  );

  // Switch node and restore default camera orientation smoothly
  const handleSelectNode = (nodeId: string, customHeading?: number, customPitch?: number) => {
    const target = HARLEM_NODES[nodeId];
    if (target) {
      setCurrentNodeId(nodeId);
      setHeading(customHeading !== undefined ? customHeading : target.defaultHeading);
      setPitch(customPitch !== undefined ? customPitch : target.defaultPitch);
      setFov(target.defaultFov);
      setAutoplayProgress(0);
    }
  };

  const handleNextCorridor = () => {
    const nextIdx = (currentCorridorIndex + 1) % ALL_CORRIDOR_NODES.length;
    handleSelectNode(ALL_CORRIDOR_NODES[nextIdx].id);
    soundEngine.playStepClick();
  };

  const handlePrevCorridor = () => {
    const prevIdx = (currentCorridorIndex - 1 + ALL_CORRIDOR_NODES.length) % ALL_CORRIDOR_NODES.length;
    handleSelectNode(ALL_CORRIDOR_NODES[prevIdx].id);
    soundEngine.playStepClick();
  };

  // Hero Continuous Autoplay Timer (cycles corridors every 7 seconds)
  useEffect(() => {
    if (!isAutoplay || activeModal !== null || isVignetteOpen) return;

    const interval = setInterval(() => {
      setAutoplayProgress((prev) => {
        if (prev >= 100) {
          const nextIdx = (currentCorridorIndex + 1) % ALL_CORRIDOR_NODES.length;
          const nextNode = ALL_CORRIDOR_NODES[nextIdx];
          setCurrentNodeId(nextNode.id);
          setHeading(nextNode.defaultHeading);
          setPitch(nextNode.defaultPitch);
          setFov(nextNode.defaultFov);

          // Subtle transition acoustic cue
          soundEngine.playStepClick();
          if (nextNode.id.includes('mural') || nextNode.id.includes('mintons') || nextNode.id.includes('apollo')) {
            soundEngine.playJazzChord();
          }
          return 0;
        }
        return prev + 1.5; // ~6.6s per corridor
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isAutoplay, activeModal, isVignetteOpen, currentCorridorIndex]);

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
        onOpenRealStreetView={() => setActiveModal('real_street_view')}
        onOpenVideoExporter={() => setActiveModal('video_exporter')}
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
          isAutoplay={isAutoplay}
          onUserInteract={() => setIsAutoplay(false)}
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

        {/* Unified Bottom Deck: Corridors Image Carousel with Autoplay & Telemetry Controls Directly Beneath */}
        <BottomCarouselDeck
          corridors={ALL_CORRIDOR_NODES}
          currentNodeId={currentNodeId}
          currentIndex={currentCorridorIndex}
          isPlaying={isAutoplay}
          progressPercent={autoplayProgress}
          onTogglePlay={() => setIsAutoplay(!isAutoplay)}
          onNext={handleNextCorridor}
          onPrev={handlePrevCorridor}
          onSelectNode={(nodeId) => {
            handleSelectNode(nodeId);
            soundEngine.playStepClick();
          }}
          onSelectIndex={(idx) => {
            handleSelectNode(ALL_CORRIDOR_NODES[idx].id);
            soundEngine.playStepClick();
          }}
          onOpenVideoExporter={() => setActiveModal('video_exporter')}
          onOpenFleetGrid={() => setActiveModal('fleet_grid')}
          roverCount={rovers.filter((r) => r.status === 'sweeping' || r.status === 'patrolling').length || 4}
        />

        {/* Floating Harlem Eco-Grid Minimap (Bottom-Left) */}
        <div className="hidden lg:block absolute bottom-6 left-6 z-30 pointer-events-auto">
          <HarlemStreetGridMap
            currentNodeId={currentNodeId}
            currentHeading={heading}
            rovers={rovers}
            onSelectNode={handleSelectNode}
          />
        </div>

        {/* Vignette Walkthrough Modal / Overlay */}
        {isVignetteOpen && (
          <VignetteNarrator
            onClose={() => setIsVignetteOpen(false)}
            onJumpToNode={handleSelectNode}
          />
        )}

        {/* Real Google Street View & Maps Comparison Modal */}
        {activeModal === 'real_street_view' && (
          <RealStreetViewModal
            currentNodeId={currentNodeId}
            onClose={() => setActiveModal(null)}
          />
        )}

        {/* Cinematic Video Tour Exporter & Player Modal */}
        {activeModal === 'video_exporter' && (
          <VideoTourExporterModal
            onClose={() => setActiveModal(null)}
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
