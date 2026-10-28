import React, { useState } from 'react';
import { HARLEM_NODES } from '../data/harlemData';
import { AutonomousRover } from '../types/worldModel';
import { MapPin, Navigation, Maximize2, Minimize2, ChevronDown, Layers, ShieldCheck } from 'lucide-react';

interface Props {
  currentNodeId: string;
  currentHeading: number;
  rovers: AutonomousRover[];
  onSelectNode: (nodeId: string) => void;
}

export const HarlemStreetGridMap: React.FC<Props> = ({
  currentNodeId,
  currentHeading,
  rovers,
  onSelectNode,
}) => {
  const [viewState, setViewState] = useState<'compact' | 'standard' | 'expanded'>('standard');
  const [showCisternLayer, setShowCisternLayer] = useState(false);

  // Map coordinates relative to SVG canvas (0 to 300)
  const nodeMapPositions: Record<string, { x: number; y: number; label: string }> = {
    node_apollo_125: { x: 120, y: 190, label: '125th & Apollo' },
    node_malcolm_x: { x: 210, y: 155, label: 'Malcolm X Blvd' },
    node_brownstone_stoop: { x: 215, y: 65, label: 'W 130th Stoops' },
    node_mural_alley: { x: 150, y: 130, label: 'Jazz Alley' },
    node_rover_docking: { x: 65, y: 210, label: 'Solar Dock Hub' },
    node_marcus_garvey_park: { x: 215, y: 235, label: 'Marcus Garvey Pk' },
    node_strivers_row: { x: 140, y: 35, label: "Strivers' Row" },
    node_mintons_playhouse: { x: 85, y: 245, label: "Minton's Playhouse" },
    node_river_waterfront: { x: 275, y: 175, label: 'River Esplanade' },
  };

  const currentNode = nodeMapPositions[currentNodeId] || { x: 120, y: 190, label: 'Harlem' };

  // Compact Liquid Glass Pill Mode (Zero obstruction)
  if (viewState === 'compact') {
    return (
      <button
        onClick={() => setViewState('standard')}
        className="liquid-glass-panel rounded-xl px-3 py-2 text-white flex items-center gap-2 hover:border-teal-400/60 transition-all cursor-pointer group shadow-xl"
        title="Open Harlem Eco-Grid Minimap"
      >
        <Navigation className="w-3.5 h-3.5 text-teal-400 group-hover:scale-110 transition-transform" />
        <span className="text-xs font-bold tracking-wide">Eco-Grid</span>
        <span className="text-[10px] font-mono text-teal-200 bg-teal-500/20 px-1.5 py-0.5 rounded-full border border-teal-400/30">
          {rovers.length} Rovers
        </span>
        <Maximize2 className="w-3 h-3 text-slate-400 group-hover:text-white transition-colors ml-0.5" />
      </button>
    );
  }

  const isExpanded = viewState === 'expanded';

  return (
    <div
      className={`transition-all duration-300 ease-in-out liquid-glass-panel rounded-2xl overflow-hidden ${
        isExpanded ? 'w-80 h-96' : 'w-52 h-44'
      }`}
    >
      {/* Liquid Header Bar */}
      <div className="px-3 py-1.5 border-b border-white/10 flex items-center justify-between bg-white/[0.04]">
        <div className="flex items-center gap-1.5">
          <Navigation className="w-3.5 h-3.5 text-teal-400" />
          <span className="text-[10px] font-bold text-slate-200 uppercase tracking-wider">Harlem Eco-Grid</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowCisternLayer(!showCisternLayer)}
            title="Toggle Subterranean Cistern Layer"
            className={`p-1 rounded text-[10px] flex items-center gap-0.5 border transition-all cursor-pointer ${
              showCisternLayer
                ? 'bg-cyan-500/25 text-cyan-200 border-cyan-400/50 shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                : 'bg-white/5 text-slate-400 border-white/10 hover:text-white hover:bg-white/10'
            }`}
          >
            <Layers className="w-3 h-3" />
          </button>
          <button
            onClick={() => setViewState(isExpanded ? 'standard' : 'expanded')}
            title={isExpanded ? 'Standard map size' : 'Expand map'}
            className="p-1 rounded bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            {isExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          </button>
          <button
            onClick={() => setViewState('compact')}
            title="Fold to compact pill"
            className="p-1 rounded bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* SVG Harlem Street Map */}
      <div className="relative w-full h-[calc(100%-32px)] bg-slate-950/60 select-none">
        <svg viewBox="0 0 300 280" className="w-full h-full">
          {/* Subterranean Cistern Rainwater Grid Pattern */}
          {showCisternLayer && (
            <pattern id="cisternGrid" width="16" height="16" patternUnits="userSpaceOnUse">
              <rect width="16" height="16" fill="#042f2e" opacity="0.35" />
              <circle cx="8" cy="8" r="1.5" fill="#14b8a6" opacity="0.4" />
            </pattern>
          )}
          {showCisternLayer && (
            <rect width="300" height="280" fill="url(#cisternGrid)" />
          )}

          {/* Major Street Corridors */}
          {/* West 125th Street */}
          <line x1="20" y1="195" x2="280" y2="185" stroke="#334155" strokeWidth="18" strokeLinecap="round" />
          <line x1="20" y1="195" x2="280" y2="185" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />

          {/* Malcolm X Blvd (Lenox Ave) */}
          <line x1="210" y1="20" x2="205" y2="265" stroke="#334155" strokeWidth="16" strokeLinecap="round" />
          <line x1="210" y1="20" x2="205" y2="265" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />

          {/* Adam Clayton Powell Jr Blvd */}
          <line x1="70" y1="20" x2="65" y2="265" stroke="#1e293b" strokeWidth="14" strokeLinecap="round" />

          {/* West 130th Street */}
          <line x1="50" y1="65" x2="260" y2="60" stroke="#1e293b" strokeWidth="10" strokeLinecap="round" />

          {/* Jazz Heritage Alley */}
          <line x1="120" y1="190" x2="160" y2="110" stroke="#0d9488" strokeWidth="4" strokeDasharray="3 3" opacity="0.8" />
          <line x1="160" y1="110" x2="215" y2="65" stroke="#0d9488" strokeWidth="4" strokeDasharray="3 3" opacity="0.8" />

          {/* Street Labels */}
          <text x="32" y="180" fill="#94a3b8" fontSize="8" fontWeight="600" letterSpacing="0.5">W 125TH ST (APOLLO CORRIDOR)</text>
          <text x="215" y="250" fill="#94a3b8" fontSize="8" fontWeight="600" letterSpacing="0.5">MALCOLM X BLVD</text>
          <text x="75" y="45" fill="#64748b" fontSize="7" fontWeight="500">AC POWELL BLVD</text>
          <text x="145" y="55" fill="#64748b" fontSize="7" fontWeight="500">W 130TH ST (ASTOR ROW)</text>

          {/* Canary Palm Canopy Indicators */}
          <g opacity="0.75">
            <circle cx="100" cy="188" r="6" fill="#10b981" opacity="0.3" />
            <circle cx="140" cy="186" r="6" fill="#10b981" opacity="0.3" />
            <circle cx="180" cy="184" r="6" fill="#10b981" opacity="0.3" />
            <circle cx="208" cy="120" r="6" fill="#10b981" opacity="0.3" />
            <circle cx="209" cy="90" r="6" fill="#10b981" opacity="0.3" />
          </g>

          {/* Autonomous Rovers Fleet Live Positions */}
          {rovers.map((r) => {
            const rx = 30 + (r.position.x / 100) * 240;
            const ry = 30 + (r.position.y / 100) * 220;
            return (
              <g key={r.id}>
                <circle cx={rx} cy={ry} r="3" fill="#2dd4bf" />
                <circle cx={rx} cy={ry} r="6" stroke="#2dd4bf" strokeWidth="0.8" opacity="0.6" />
                {isExpanded && (
                  <text x={rx + 5} y={ry + 3} fill="#a5f3fc" fontSize="6" fontFamily="monospace">
                    {r.callsign}
                  </text>
                )}
              </g>
            );
          })}

          {/* Clickable Waypoint Nodes */}
          {Object.entries(nodeMapPositions).map(([id, pos]) => {
            const isSelected = id === currentNodeId;
            return (
              <g
                key={id}
                className="cursor-pointer group"
                onClick={() => onSelectNode(id)}
              >
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isSelected ? 6 : 4}
                  fill={isSelected ? '#f59e0b' : '#38bdf8'}
                  className="transition-all"
                />
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isSelected ? 10 : 7}
                  stroke={isSelected ? '#fbbf24' : '#38bdf8'}
                  strokeWidth="1.5"
                  opacity={isSelected ? 0.8 : 0.4}
                />
                {isExpanded && (
                  <text
                    x={pos.x}
                    y={pos.y - 8}
                    textAnchor="middle"
                    fill={isSelected ? '#fde68a' : '#cbd5e1'}
                    fontSize="7"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                  >
                    {pos.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Street View Pegman & Viewing Cone Frustum */}
          <g transform={`translate(${currentNode.x}, ${currentNode.y})`}>
            {/* View Direction Wedge (Cone) */}
            <path
              d="M 0 0 L -18 -42 A 45 45 0 0 1 18 -42 Z"
              fill="#fbbf24"
              opacity="0.25"
              transform={`rotate(${currentHeading})`}
            />
            {/* Compass Heading Needle */}
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="-26"
              stroke="#f59e0b"
              strokeWidth="2"
              transform={`rotate(${currentHeading})`}
            />
            {/* Center Pegman Core */}
            <circle cx="0" cy="0" r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
          </g>
        </svg>

        {/* Legend / Overlay bar */}
        <div className="absolute bottom-1 left-1.5 right-1.5 flex items-center justify-between text-[8px] font-mono text-slate-300 bg-slate-950/60 px-2 py-0.5 rounded backdrop-blur-md border border-white/10">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" /> Pegman POV
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_6px_#2dd4bf]" /> {rovers.length} Rovers
          </span>
        </div>
      </div>
    </div>
  );
};

