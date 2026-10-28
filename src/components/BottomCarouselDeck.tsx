import React, { useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Sparkles, Film, Radio, ChevronLeft, ChevronRight } from 'lucide-react';
import { StreetViewNode } from '../types/worldModel';

interface Props {
  corridors: StreetViewNode[];
  currentNodeId: string;
  currentIndex: number;
  isPlaying: boolean;
  progressPercent: number; // 0 to 100 for current corridor
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSelectNode: (nodeId: string) => void;
  onSelectIndex: (index: number) => void;
  onOpenVideoExporter: () => void;
  onOpenFleetGrid: () => void;
  roverCount?: number;
}

export const BottomCarouselDeck: React.FC<Props> = ({
  corridors,
  currentNodeId,
  currentIndex,
  isPlaying,
  progressPercent,
  onTogglePlay,
  onNext,
  onPrev,
  onSelectNode,
  onSelectIndex,
  onOpenVideoExporter,
  onOpenFleetGrid,
  roverCount = 4,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeThumbnailRef = useRef<HTMLButtonElement>(null);

  const currentCorridor = corridors[currentIndex] || corridors[0];

  // Auto-scroll active thumbnail into view when corridor changes
  useEffect(() => {
    if (activeThumbnailRef.current && scrollContainerRef.current) {
      activeThumbnailRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [currentNodeId]);

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -260, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 260, behavior: 'smooth' });
    }
  };

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-auto w-[94vw] max-w-2xl sm:max-w-3xl lg:max-w-3xl xl:max-w-4xl transition-all">
      <div className="liquid-glass-panel rounded-2xl p-2.5 sm:p-3 text-white flex flex-col gap-2.5">
        
        {/* ROW 1: Street View Image Carousel */}
        <div className="relative group/carousel">
          {/* Scroll Left Button */}
          <button
            onClick={handleScrollLeft}
            title="Scroll thumbnails left"
            className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full liquid-glass-btn text-slate-200 hover:text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Thumbnails Rail */}
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5 px-0.5 scroll-smooth"
          >
            {corridors.map((node, idx) => {
              const isCurrent = node.id === currentNodeId;
              return (
                <button
                  key={node.id}
                  ref={isCurrent ? activeThumbnailRef : null}
                  onClick={() => {
                    onSelectNode(node.id);
                  }}
                  className={`group relative rounded-xl overflow-hidden border transition-all text-left w-32 sm:w-36 h-18 sm:h-20 shrink-0 cursor-pointer ${
                    isCurrent
                      ? 'border-amber-400/90 ring-2 ring-amber-400/40 shadow-[0_0_20px_rgba(251,191,36,0.35)] scale-[1.02]'
                      : 'border-white/15 opacity-75 hover:opacity-100 hover:border-white/35 hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)]'
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
                  {/* Liquid glass gradient scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-transparent p-1.5 sm:p-2 flex flex-col justify-end backdrop-blur-[1px]">
                    <span className="text-[10px] font-semibold text-white leading-tight truncate drop-shadow-sm">
                      {node.title.split('&')[0]}
                    </span>
                    <span className="text-[9px] font-mono text-amber-200/90 truncate drop-shadow-sm">
                      {node.telemetry.fragranceNotes[0]}
                    </span>
                  </div>
                  {isCurrent && (
                    <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b] animate-ping" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Scroll Right Button */}
          <button
            onClick={handleScrollRight}
            title="Scroll thumbnails right"
            className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full liquid-glass-btn text-slate-200 hover:text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* ROW 2: Liquid Segmented Corridor Progress Bar */}
        <div className="grid grid-cols-9 gap-1.5">
          {corridors.map((c, idx) => {
            const isPast = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={c.id}
                onClick={() => onSelectIndex(idx)}
                title={`${idx + 1}. ${c.title}`}
                className="relative h-1.5 rounded-full overflow-hidden bg-white/10 hover:bg-white/20 border border-white/10 transition-colors cursor-pointer group"
              >
                <div
                  className={`h-full transition-all duration-100 ${
                    isPast
                      ? 'bg-amber-400 w-full shadow-[0_0_8px_rgba(251,191,36,0.4)]'
                      : isCurrent
                      ? 'bg-gradient-to-r from-amber-400 to-teal-400 shadow-[0_0_12px_rgba(45,212,191,0.6)]'
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

        {/* ROW 3: Controls Strip Directly Beneath Carousel & Progress Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-0.5">
          
          {/* Corridor Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-semibold flex items-center gap-1 drop-shadow-sm">
                <Sparkles className="w-3 h-3 text-amber-400 drop-shadow" />
                Corridor {String(currentIndex + 1).padStart(2, '0')} / {String(corridors.length).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-white/30 font-mono hidden sm:inline">·</span>
              <span className="text-[10px] text-teal-300 font-mono hidden sm:inline truncate drop-shadow-sm">
                {currentCorridor.corridor.split('(')[0]}
              </span>
            </div>

            <h3 className="text-xs sm:text-sm font-bold text-white truncate tracking-tight mt-0.5 drop-shadow-sm">
              {currentCorridor.title}
            </h3>
          </div>

          {/* Autoplay Playback Controls (Center) */}
          <div className="flex items-center gap-1.5 shrink-0 liquid-glass-panel-subtle px-2 py-1 rounded-xl">
            <button
              onClick={onPrev}
              title="Previous Corridor"
              className="p-1.5 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 transition-all cursor-pointer active:scale-95"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={onTogglePlay}
              title={isPlaying ? 'Pause Autoplay' : 'Resume Autoplay Tour'}
              className="liquid-glass-amber-btn px-3 py-1.5 rounded-lg text-slate-950 font-bold transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-slate-950" />
                  <span className="text-xs font-semibold">Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-slate-950 ml-0.5" />
                  <span className="text-xs font-semibold">Auto-Tour</span>
                </>
              )}
            </button>

            <button
              onClick={onNext}
              title="Next Corridor"
              className="p-1.5 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 transition-all cursor-pointer active:scale-95"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Action Tools (Right) */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenVideoExporter}
              className="liquid-glass-btn px-2.5 sm:px-3 py-1.5 rounded-xl border-amber-400/35 text-amber-200 text-xs font-semibold flex items-center gap-1.5 transition-all hover:border-amber-400/70 hover:text-amber-100 cursor-pointer"
            >
              <Film className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Save Video Tour</span>
              <span className="sm:hidden">Video</span>
            </button>

            <button
              onClick={onOpenFleetGrid}
              className="liquid-glass-btn px-2.5 sm:px-3 py-1.5 rounded-xl border-teal-400/35 text-teal-200 text-xs font-semibold flex items-center gap-1.5 transition-all hover:border-teal-400/70 hover:text-teal-100 cursor-pointer"
            >
              <Radio className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
              <span className="hidden md:inline">Fleet Grid Telemetry</span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-full bg-teal-500/25 text-teal-100 border border-teal-400/30">
                {roverCount} Active
              </span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
