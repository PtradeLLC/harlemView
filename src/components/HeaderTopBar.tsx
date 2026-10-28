import React, { useState } from 'react';
import { Sparkles, MapPin, ChevronDown } from 'lucide-react';

interface Props {
  activeCorridorId: string;
  onSelectNode: (nodeId: string) => void;
  onStartVignette: () => void;
  onOpenRealStreetView: () => void;
  onOpenVideoExporter: () => void;
}

export const HeaderTopBar: React.FC<Props> = ({
  activeCorridorId,
  onSelectNode,
  onStartVignette,
  onOpenRealStreetView,
  onOpenVideoExporter,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const featuredLinks = [
    { id: 'node_apollo_125', label: '125th Promenade' },
    { id: 'node_malcolm_x', label: 'Malcolm X Blvd' },
    { id: 'node_strivers_row', label: "Strivers' Row" },
    { id: 'node_marcus_garvey_park', label: 'Marcus Garvey Park' },
    { id: 'node_river_waterfront', label: 'River Esplanade' },
  ];

  const allCorridors = [
    { id: 'node_apollo_125', label: '125th St & Apollo Theater' },
    { id: 'node_malcolm_x', label: 'Malcolm X Blvd (Lenox Ave)' },
    { id: 'node_brownstone_stoop', label: 'Historic Brownstone Stoops' },
    { id: 'node_mural_alley', label: 'Harlem Jazz Mural Alley' },
    { id: 'node_rover_docking', label: 'Solar Planter Docking Hub' },
    { id: 'node_marcus_garvey_park', label: 'Marcus Garvey Park & Watchtower' },
    { id: 'node_strivers_row', label: "Historic Strivers' Row (W 138th)" },
    { id: 'node_mintons_playhouse', label: "Minton's Playhouse (W 118th)" },
    { id: 'node_river_waterfront', label: 'Harlem River Eco-Esplanade' },
  ];

  return (
    <header className="relative flex items-center justify-between gap-8 px-6 py-3.5 bg-slate-950/95 border-b border-slate-800/80 z-40 shrink-0">
      {/* Zone 1: Single text element wordmark */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onSelectNode('node_apollo_125');
        }}
        className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-amber-300 transition-colors"
      >
        World Model: Harlem
      </a>

      {/* Zone 2: Navigation Links + All Corridors Dropdown */}
      <nav className="hidden lg:flex items-center gap-5 text-xs font-medium text-slate-300">
        {featuredLinks.map((link) => {
          const isActive = activeCorridorId === link.id;
          return (
            <button
              key={link.id}
              onClick={() => onSelectNode(link.id)}
              className={`whitespace-nowrap shrink-0 transition-colors relative py-1 ${
                isActive
                  ? 'text-amber-300 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {link.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
              )}
            </button>
          );
        })}

        {/* All Corridors Selector */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1 py-1 px-2.5 rounded-lg bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
          >
            <span>All 9 Corridors</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              {allCorridors.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    onSelectNode(c.id);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors ${
                    activeCorridorId === c.id
                      ? 'bg-amber-500/20 text-amber-200 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="truncate">{c.label}</span>
                  {activeCorridorId === c.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 ml-2" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Zone 3: Primary action cluster */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={onOpenRealStreetView}
          title="Compare with real Google Street View"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-850 hover:text-white border border-slate-700/80 rounded-lg transition-colors whitespace-nowrap shrink-0"
        >
          Google Street View
        </button>

        <button
          onClick={onOpenVideoExporter}
          title="Export and save 1080p video tour"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-200 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 rounded-lg transition-colors whitespace-nowrap shrink-0"
        >
          Save Video
        </button>

        <button
          onClick={onStartVignette}
          className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          A Day in the Life
        </button>
      </div>
    </header>
  );
};
