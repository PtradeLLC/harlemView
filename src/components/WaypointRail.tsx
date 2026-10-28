import React from 'react';
import { HARLEM_NODES } from '../data/harlemData';
import { ChevronRight } from 'lucide-react';

interface Props {
  currentNodeId: string;
  onSelectNode: (nodeId: string) => void;
}

export const WaypointRail: React.FC<Props> = ({ currentNodeId, onSelectNode }) => {
  return (
    <div className="absolute bottom-6 left-6 z-30 pointer-events-auto flex items-end gap-3">
      {/* Waypoints Thumbnail Rail */}
      <div className="hidden lg:flex items-center gap-2 p-1.5 rounded-2xl bg-slate-950/90 border border-slate-800 shadow-2xl backdrop-blur-md overflow-x-auto max-w-[58vw] scrollbar-none">
        {Object.values(HARLEM_NODES).map((node) => {
          const isCurrent = node.id === currentNodeId;
          return (
            <button
              key={node.id}
              onClick={() => onSelectNode(node.id)}
              className={`group relative rounded-xl overflow-hidden border transition-all text-left w-36 h-20 shrink-0 ${
                isCurrent
                  ? 'border-amber-400 ring-2 ring-amber-400/30'
                  : 'border-slate-800 opacity-70 hover:opacity-100 hover:border-slate-600'
              }`}
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
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-2 flex flex-col justify-end">
                <span className="text-[10px] font-semibold text-white leading-tight truncate">
                  {node.title.split('&')[0]}
                </span>
                <span className="text-[9px] font-mono text-slate-300 truncate">
                  {node.telemetry.fragranceNotes[0]}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
