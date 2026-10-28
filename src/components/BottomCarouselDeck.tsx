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
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-auto w-[94vw] max-w-4xl xl:max-w-5xl 2xl:max-w-6xl transition-all">
      <div className="bg-slate-950/92 border border-slate-700/80 rounded-2xl p-2.5 sm:p-3 shadow-2xl backdrop-blur-md text-white flex flex-col gap-2.5">
        
        {/* ROW 1: Street View Image Carousel */}
        <div className="relative group/carousel">
          {/* Scroll Left Button */}
          <button
            onClick={handleScrollLeft}
            title="Scroll thumbnails left"
            className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity backdrop-blur-sm"
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
                      ? 'border-amber-400 ring-2 ring-amber-400/40 shadow-lg shadow-amber-500/10 scale-[1.02]'
                      : 'border-slate-800/90 opacity-70 hover:opacity-100 hover:border-slate-600'
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent p-1.5 sm:p-2 flex flex-col justify-end">
                    <span className="text-[10px] font-semibold text-white leading-tight truncate">
                      {node.title.split('&')[0]}
                    </span>
                    <span className="text-[9px] font-mono text-amber-200/90 truncate">
                      {node.telemetry.fragranceNotes[0]}
                    </span>
                  </div>
                  {isCurrent && (
                    <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Scroll Right Button */}
          <button
            onClick={handleScrollRight}
            title="Scroll thumbnails right"
            className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity backdrop-blur-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* ROW 2: Segmented Corridor Progress Bar */}
        <div className="grid grid-cols-9 gap-1.5">
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

        {/* ROW 3: Controls Strip Directly Beneath Carousel & Progress Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-0.5">
          
          {/* Corridor Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Corridor {String(currentIndex + 1).padStart(2, '0')} / {String(corridors.length).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">·</span>
              <span className="text-[10px] text-teal-300 font-mono hidden sm:inline truncate">
                {currentCorridor.corridor.split('(')[0]}
              </span>
            </div>

            <h3 className="text-xs sm:text-sm font-bold text-white truncate tracking-tight mt-0.5">
              {currentCorridor.title}
            </h3>
          </div>

          {/* Autoplay Playback Controls (Center) */}
          <div className="flex items-center gap-1.5 shrink-0 bg-slate-900/80 px-2 py-1 rounded-xl border border-slate-800">
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
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-transform active:scale-95 shadow-md flex items-center gap-1.5"
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
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Action Tools (Right) */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenVideoExporter}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-amber-500/40 text-amber-300 text-xs font-semibold shadow-lg backdrop-blur-md flex items-center gap-1.5 transition-all hover:border-amber-400 hover:text-amber-200 cursor-pointer"
            >
              <Film className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Save Video Tour</span>
              <span className="sm:hidden">Video</span>
            </button>

            <button
              onClick={onOpenFleetGrid}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-teal-500/40 text-teal-300 text-xs font-semibold shadow-lg backdrop-blur-md flex items-center gap-1.5 transition-all hover:border-teal-400 hover:text-teal-200 cursor-pointer"
            >
              <Radio className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
              <span className="hidden md:inline">Fleet Grid Telemetry</span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-200">
                {roverCount} Active
              </span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
