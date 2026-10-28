import React from 'react';
import { Play, Pause, SkipForward, SkipBack, Eye, Sparkles } from 'lucide-react';
import { StreetViewNode } from '../types/worldModel';

interface Props {
  corridors: StreetViewNode[];
  currentIndex: number;
  isPlaying: boolean;
  progressPercent: number; // 0 to 100 for current corridor
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSelectIndex: (index: number) => void;
}

export const HeroAutoplayBar: React.FC<Props> = ({
  corridors,
  currentIndex,
  isPlaying,
  progressPercent,
  onTogglePlay,
  onNext,
  onPrev,
  onSelectIndex,
}) => {
  const currentCorridor = corridors[currentIndex] || corridors[0];

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 pointer-events-auto w-full max-w-2xl px-4">
      <div className="bg-slate-950/90 border border-slate-700/80 rounded-2xl p-3 shadow-2xl backdrop-blur-md text-white transition-all">
        {/* Top: 9 Segmented Corridor Progress Indicators */}
        <div className="grid grid-cols-9 gap-1.5 mb-2.5">
          {corridors.map((c, idx) => {
            const isPast = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={c.id}
                onClick={() => onSelectIndex(idx)}
                title={`${idx + 1}. ${c.title}`}
                className="relative h-1.5 rounded-full overflow-hidden bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer group"
              >
                <div
                  className={`h-full transition-all duration-100 ${
                    isPast
                      ? 'bg-amber-400 w-full'
                      : isCurrent
                      ? 'bg-gradient-to-r from-amber-400 to-teal-400'
                      : 'w-0'
                  }`}
                  style={{
                    width: isCurrent ? `${progressPercent}%` : isPast ? '100%' : '0%',
                  }}
                />
              </button>
            );
          })}
        </div>

        {/* Middle: Corridor Title & Subtitle */}
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Corridor {String(currentIndex + 1).padStart(2, '0')} / {String(corridors.length).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">·</span>
              <span className="text-[10px] text-teal-300 font-mono hidden sm:inline truncate">
                {currentCorridor.corridor.split('(')[0]}
              </span>
            </div>

            <h3 className="text-xs sm:text-sm font-bold text-white truncate tracking-tight mt-0.5">
              {currentCorridor.title}
            </h3>
          </div>

          {/* Controls Cluster */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={onPrev}
              title="Previous Corridor"
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={onTogglePlay}
              title={isPlaying ? 'Pause Autoplay' : 'Resume Autoplay Tour'}
              className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-transform active:scale-95 shadow-md flex items-center justify-center"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950 ml-0.5" />}
            </button>

            <button
              onClick={onNext}
              title="Next Corridor"
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
