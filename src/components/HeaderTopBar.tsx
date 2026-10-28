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
    <header className="relative flex items-center justify-between gap-8 px-6 py-3.5 bg-slate-950/60 backdrop-blur-2xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] z-40 shrink-0">
      {/* Zone 1: Single text element wordmark */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onSelectNode('node_apollo_125');
        }}
        className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-amber-300 transition-colors drop-shadow-sm flex items-center gap-2"
      >
        <span>World Model: Harlem</span>
      </a>

      {/* Zone 2: Navigation Links + All Corridors Dropdown */}
      <nav className="hidden lg:flex items-center gap-5 text-xs font-medium text-slate-300">
        {featuredLinks.map((link) => {
          const isActive = activeCorridorId === link.id;
          return (
            <button
              key={link.id}
              onClick={() => onSelectNode(link.id)}
              className={`whitespace-nowrap shrink-0 transition-all relative py-1 cursor-pointer ${
                isActive
                  ? 'text-amber-300 font-bold drop-shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {link.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full shadow-[0_0_8px_#f59e0b]" />
              )}
            </button>
          );
        })}

        {/* All Corridors Selector */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 py-1 px-3 rounded-xl liquid-glass-btn text-slate-200 hover:text-white transition-all cursor-pointer"
          >
            <span>All 9 Corridors</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 liquid-glass-panel rounded-xl shadow-2xl overflow-hidden py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              {allCorridors.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    onSelectNode(c.id);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    activeCorridorId === c.id
                      ? 'bg-amber-400/20 text-amber-200 font-bold'
                      : 'text-slate-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="truncate">{c.label}</span>
                  {activeCorridorId === c.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b] shrink-0 ml-2" />
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
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 liquid-glass-btn rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer"
        >
          Google Street View
        </button>

        <button
          onClick={onOpenVideoExporter}
          title="Export and save 1080p video tour"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-200 liquid-glass-btn border-amber-400/40 hover:border-amber-400/80 hover:text-amber-100 rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer"
        >
          Save Video
        </button>

        <button
          onClick={onStartVignette}
          className="liquid-glass-amber-btn px-3.5 py-1.5 text-xs font-bold text-slate-950 rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
          A Day in the Life
        </button>
      </div>
    </header>
  );
};
