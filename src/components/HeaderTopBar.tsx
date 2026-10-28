import React from 'react';
import { Sparkles } from 'lucide-react';

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
  const navLinks = [
    { id: 'node_apollo_125', label: '125th Corridor' },
    { id: 'node_malcolm_x', label: 'Malcolm X Boulevard' },
    { id: 'node_brownstone_stoop', label: 'Historic Stoops' },
    { id: 'node_mural_alley', label: 'Jazz Murals' },
    { id: 'node_rover_docking', label: 'Solar Dock Hub' },
  ];

  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-slate-950/95 border-b border-slate-800/80 z-40 shrink-0">
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

      {/* Zone 2: 4-5 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
        {navLinks.map((link) => {
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
