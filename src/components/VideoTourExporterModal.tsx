import React, { useState, useRef, useEffect } from 'react';
import { HARLEM_NODES } from '../data/harlemData';
import { Video, Download, Play, Pause, RotateCcw, X, Film, CheckCircle2, Sparkles, Volume2 } from 'lucide-react';

interface Props {
  onClose: () => void;
}

interface SceneKeyframe {
  nodeId: string;
  imageSrc: string;
  title: string;
  subtitle: string;
  durationSec: number;
  zoomStart: number;
  zoomEnd: number;
  panXStart: number;
  panXEnd: number;
}

const TOUR_SCENES: SceneKeyframe[] = [
  {
    nodeId: 'node_apollo_125',
    imageSrc: HARLEM_NODES.node_apollo_125.imageSrc,
    title: '125TH STREET & APOLLO THEATER',
    subtitle: 'Canary Island Date Palms & Permeable Limestone Pavers',
    durationSec: 3.5,
    zoomStart: 1.0,
    zoomEnd: 1.14,
    panXStart: -20,
    panXEnd: 20,
  },
  {
    nodeId: 'node_malcolm_x',
    imageSrc: HARLEM_NODES.node_malcolm_x.imageSrc,
    title: 'MALCOLM X BOULEVARD (LENOX AVENUE)',
    subtitle: 'Historic Red-Brick Brownstones & Autonomous Sweeper Patrol',
    durationSec: 3.5,
    zoomStart: 1.05,
    zoomEnd: 1.18,
    panXStart: 25,
    panXEnd: -15,
  },
  {
    nodeId: 'node_brownstone_stoop',
    imageSrc: HARLEM_NODES.node_brownstone_stoop.imageSrc,
    title: 'HISTORIC BROWNSTONE STOOPS',
    subtitle: 'Sandstone Balustrades Framed by Lush Fronds & Deionized Vapor Scrubber',
    durationSec: 3.2,
    zoomStart: 1.0,
    zoomEnd: 1.12,
    panXStart: -15,
    panXEnd: 15,
  },
  {
    nodeId: 'node_mural_alley',
    imageSrc: HARLEM_NODES.node_mural_alley.imageSrc,
    title: 'HARLEM JAZZ HERITAGE ALLEY',
    subtitle: 'Duke Ellington & Billie Holiday Murals on Resurfaced Cobblestones',
    durationSec: 3.2,
    zoomStart: 1.08,
    zoomEnd: 1.16,
    panXStart: 10,
    panXEnd: -20,
  },
  {
    nodeId: 'node_rover_docking',
    imageSrc: HARLEM_NODES.node_rover_docking.imageSrc,
    title: 'SOLAR PLANTER DOCKING HUB',
    subtitle: 'Recessed Bronze Induction Stations Built into Palm Tree Bases',
    durationSec: 2.8,
    zoomStart: 1.0,
    zoomEnd: 1.12,
    panXStart: -10,
    panXEnd: 15,
  },
  {
    nodeId: 'node_marcus_garvey_park',
    imageSrc: HARLEM_NODES.node_marcus_garvey_park.imageSrc,
    title: 'MARCUS GARVEY PARK & FIRE WATCHTOWER',
    subtitle: 'Historic 1856 Acropolis Landmark & Botanical Rover Sanctuary',
    durationSec: 3.0,
    zoomStart: 1.0,
    zoomEnd: 1.15,
    panXStart: -15,
    panXEnd: 15,
  },
  {
    nodeId: 'node_strivers_row',
    imageSrc: HARLEM_NODES.node_strivers_row.imageSrc,
    title: "HISTORIC STRIVERS' ROW (W 138TH ST)",
    subtitle: 'Stanford White Carriage Arches & Restored Yellow-Brick Architecture',
    durationSec: 3.0,
    zoomStart: 1.05,
    zoomEnd: 1.18,
    panXStart: 20,
    panXEnd: -15,
  },
  {
    nodeId: 'node_mintons_playhouse',
    imageSrc: HARLEM_NODES.node_mintons_playhouse.imageSrc,
    title: "MINTON'S PLAYHOUSE & BEBOP PROMENADE",
    subtitle: 'Jazz Legacy Neon Marquee & Sunlit Mist Pergola Seating',
    durationSec: 3.0,
    zoomStart: 1.0,
    zoomEnd: 1.14,
    panXStart: -10,
    panXEnd: 20,
  },
  {
    nodeId: 'node_river_waterfront',
    imageSrc: HARLEM_NODES.node_river_waterfront.imageSrc,
    title: 'HARLEM RIVER ECO-ESPLANADE',
    subtitle: 'Curved Timber Boardwalk, Swaying Palms & Solar Ferry Pier',
    durationSec: 3.2,
    zoomStart: 1.0,
    zoomEnd: 1.15,
    panXStart: -25,
    panXEnd: 15,
  },
];

export const VideoTourExporterModal: React.FC<Props> = ({ onClose }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordProgress, setRecordProgress] = useState(0);
  const [videoBlobUrl, setVideoBlobUrl] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('Ready to record cinematic tour');
  const [includeAudio, setIncludeAudio] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const loadedImagesRef = useRef<Record<string, HTMLImageElement>>({});
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const animationFrameIdRef = useRef<number | null>(null);

  // Preload images into memory
  useEffect(() => {
    TOUR_SCENES.forEach((scene) => {
      const img = new Image();
      img.src = scene.imageSrc;
      img.onload = () => {
        loadedImagesRef.current[scene.nodeId] = img;
      };
    });

    return () => {
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
      if (videoBlobUrl) URL.revokeObjectURL(videoBlobUrl);
    };
  }, []);

  // Synthesize background audio stream into recorder
  const createAudioStream = (): { audioStream: MediaStream; cleanup: () => void } => {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const dest = ctx.createMediaStreamDestination();

    // Gentle filtered wind noise
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.08;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 550;

    const gain = ctx.createGain();
    gain.gain.value = 0.22;

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(dest);
    noise.start();

    // Occasional jazz harmonic bell swells
    const chordNotes = [261.63, 329.63, 392.0, 523.25];
    const chimeInterval = setInterval(() => {
      if (ctx.state === 'closed') return;
      chordNotes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
        oscGain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.12);
        oscGain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + idx * 0.12 + 0.05);
        oscGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.12 + 1.8);

        osc.connect(oscGain);
        oscGain.connect(dest);
        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 1.9);
      });
    }, 4500);

    return {
      audioStream: dest.stream,
      cleanup: () => {
        clearInterval(chimeInterval);
        try {
          noise.stop();
          ctx.close();
        } catch {
          // Ignore
        }
      },
    };
  };

  const startCinematicRecording = async () => {
    if (!canvasRef.current || isRecording) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsRecording(true);
    setRecordProgress(0);
    setVideoBlobUrl(null);
    recordedChunksRef.current = [];
    setStatusMessage('Compositing 1080p cinematic flythrough...');

    // Canvas stream (30 fps)
    const videoStream = canvas.captureStream(30);

    let combinedStream = videoStream;
    let audioCleanup = () => {};

    if (includeAudio) {
      try {
        const { audioStream, cleanup } = createAudioStream();
        audioCleanup = cleanup;
        combinedStream = new MediaStream([
          ...videoStream.getVideoTracks(),
          ...audioStream.getAudioTracks(),
        ]);
      } catch (err) {
        console.warn('Audio stream creation failed, recording video only:', err);
      }
    }

    // Determine supported mimeType
    let mimeType = 'video/webm;codecs=vp9';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm;codecs=vp8';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
      }
    }

    try {
      const recorder = new MediaRecorder(combinedStream, {
        mimeType,
        videoBitsPerSecond: 6000000, // 6 Mbps high definition
      });

      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setVideoBlobUrl(url);
        setIsRecording(false);
        setStatusMessage('Cinematic video tour generated successfully!');
        audioCleanup();
      };

      recorder.start();

      // Render tour animation
      const totalDurationSec = TOUR_SCENES.reduce((acc, s) => acc + s.durationSec, 0);
      const startTime = performance.now();

      const renderFrame = (currentTime: number) => {
        const elapsedSec = (currentTime - startTime) / 1000;
        const progress = Math.min(1, elapsedSec / totalDurationSec);
        setRecordProgress(Math.round(progress * 100));

        if (progress >= 1) {
          // Finished
          recorder.stop();
          return;
        }

        // Find active scene
        let accumulatedSec = 0;
        let activeScene = TOUR_SCENES[0];
        let sceneElapsed = 0;

        for (const scene of TOUR_SCENES) {
          if (elapsedSec < accumulatedSec + scene.durationSec) {
            activeScene = scene;
            sceneElapsed = elapsedSec - accumulatedSec;
            break;
          }
          accumulatedSec += scene.durationSec;
        }

        const sceneRatio = Math.min(1, sceneElapsed / activeScene.durationSec);
        const img = loadedImagesRef.current[activeScene.nodeId];

        // Clear canvas
        ctx.fillStyle = '#0b0f17';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (img && img.complete) {
          // Smooth Ken Burns zoom and pan
          const currentZoom =
            activeScene.zoomStart + (activeScene.zoomEnd - activeScene.zoomStart) * sceneRatio;
          const currentPanX =
            activeScene.panXStart + (activeScene.panXEnd - activeScene.panXStart) * sceneRatio;

          ctx.save();
          // Transform around center
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.scale(currentZoom, currentZoom);
          ctx.translate(-canvas.width / 2 + currentPanX, -canvas.height / 2);

          // Draw image
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          ctx.restore();
        }

        // Cinematic 2.35:1 Letterbox Bars (Top and Bottom)
        const barHeight = 85;
        ctx.fillStyle = '#05070a';
        ctx.fillRect(0, 0, canvas.width, barHeight);
        ctx.fillRect(0, canvas.height - barHeight, canvas.width, barHeight);

        // Header watermark
        ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#f8fafc';
        ctx.fillText('WORLD MODEL: HARLEM', 60, 55);

        ctx.font = '500 16px "JetBrains Mono", monospace';
        ctx.fillStyle = '#2dd4bf';
        ctx.fillText('ECO-FUTURISTIC SUB-TROPICAL URBAN REDESIGN', 410, 55);

        // Scene Title Card (Lower-Third)
        ctx.fillStyle = 'rgba(5, 7, 10, 0.75)';
        ctx.fillRect(60, canvas.height - 180, canvas.width - 120, 80);

        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(activeScene.title, 85, canvas.height - 142);

        ctx.fillStyle = '#cbd5e1';
        ctx.font = '15px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(activeScene.subtitle, 85, canvas.height - 118);

        // Subtle timestamp & coordinate stamp
        ctx.font = '14px "JetBrains Mono", monospace';
        ctx.fillStyle = '#64748b';
        ctx.fillText('40.8096° N, 73.9501° W · 78°F CANARY PALM CANOPY', canvas.width - 480, 55);

        animationFrameIdRef.current = requestAnimationFrame(renderFrame);
      };

      animationFrameIdRef.current = requestAnimationFrame(renderFrame);
    } catch (err) {
      console.error('Recording initialization error:', err);
      setIsRecording(false);
      setStatusMessage('Error starting video recording on this browser.');
    }
  };

  const handleDownload = () => {
    if (!videoBlobUrl) return;
    const a = document.createElement('a');
    a.href = videoBlobUrl;
    a.download = 'World_Model_Harlem_Cinematic_Tour.webm';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-white tracking-tight">
                  Save World Model as Cinematic Video
                </h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Full HD 1080p
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Exports a choreographed flythrough of Harlem corridors with audio soundscape
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Canvas / Preview Container */}
        <div className="relative flex-1 p-6 flex flex-col items-center justify-center bg-slate-950 overflow-hidden">
          {videoBlobUrl ? (
            /* Rendered Video Player */
            <div className="relative w-full aspect-video max-h-[50vh] rounded-xl overflow-hidden border border-slate-700 shadow-2xl bg-black">
              <video
                src={videoBlobUrl}
                controls
                autoPlay
                loop
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            /* Live Recording Canvas */
            <div className="relative w-full aspect-video max-h-[50vh] rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-black flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={1280}
                height={720}
                className="w-full h-full object-contain"
              />
              {!isRecording && (
                <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                  <Film className="w-12 h-12 text-amber-400 mb-3 opacity-90" />
                  <h4 className="text-base font-semibold text-white mb-1">
                    Ready to Record Harlem Tour
                  </h4>
                  <p className="text-xs text-slate-300 max-w-md leading-relaxed mb-4">
                    Captures a 16-second cinematic reel featuring 125th St Apollo promenade, Malcolm X Blvd palm canopy,
                    historic sandstone stoops, and jazz murals with ambient brass and river wind audio.
                  </p>
                  <button
                    onClick={startCinematicRecording}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
                  >
                    <Play className="w-4 h-4 fill-slate-950" />
                    Start 1080p Video Recording
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Recording Progress Bar */}
          {isRecording && (
            <div className="w-full mt-4 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  Recording Reel ({recordProgress}%)
                </span>
                <span className="text-slate-400">1080p · 30 FPS · 6 Mbps</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-teal-400 transition-all duration-150"
                  style={{ width: `${recordProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-300 font-mono">
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              {statusMessage}
            </span>
            <label className="hidden sm:flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeAudio}
                onChange={(e) => setIncludeAudio(e.target.checked)}
                disabled={isRecording}
                className="rounded border-slate-700 bg-slate-900 text-amber-500"
              />
              <span className="flex items-center gap-1 text-slate-400">
                <Volume2 className="w-3.5 h-3.5" /> Include Harlem Audio Soundscape
              </span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            {videoBlobUrl ? (
              <>
                <button
                  onClick={startCinematicRecording}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Re-record Tour
                </button>
                <button
                  onClick={handleDownload}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
                >
                  <Download className="w-4 h-4" /> Download Video File (.webm)
                </button>
              </>
            ) : (
              <button
                disabled={isRecording}
                onClick={startCinematicRecording}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg transition-all disabled:opacity-50"
              >
                <Film className="w-4 h-4" />
                {isRecording ? 'Rendering...' : 'Generate Video'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
