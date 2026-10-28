import React, { useState } from 'react';
import { soundEngine } from '../utils/audioSynthesizer';
import { X, Play, ArrowRight, ArrowLeft, Volume2, Sparkles, Check } from 'lucide-react';

interface Props {
  onClose: () => void;
  onJumpToNode: (nodeId: string, heading?: number, pitch?: number) => void;
}

interface VignetteStep {
  title: string;
  location: string;
  nodeId: string;
  heading: number;
  pitch: number;
  text: string;
  actionPrompt: string;
  soundType: 'wind' | 'chime' | 'whoosh' | 'jazz' | 'mist';
}

const VIGNETTE_STEPS: VignetteStep[] = [
  {
    title: 'Midday Canopy on 125th Street',
    location: 'West 125th Street Promenade',
    nodeId: 'node_apollo_125',
    heading: 350,
    pitch: 5,
    text: 'Midday on 125th Street. The sun hits the fronds of thirty-foot Canary palms lining the boulevard, their leaves catching the river breeze and casting dancing lattice shadows across restored red-brick and limestone facades.',
    actionPrompt: 'Feel the sub-tropical river breeze',
    soundType: 'wind',
  },
  {
    title: 'Sidewalk Café & Jazz Atmosphere',
    location: 'Terrace at Apollo Corridor',
    nodeId: 'node_apollo_125',
    heading: 295,
    pitch: -2,
    text: 'A couple sips iced tea on a restaurant patio while outdoor terrace seating sprawls across clean white limestone sidewalks. Brass bands play under sun-shielded awnings as the air fills with sweet frangipani and roasting espresso.',
    actionPrompt: 'Listen to Harlem brass horns swell',
    soundType: 'jazz',
  },
  {
    title: 'The Whisper Sweeper Rover',
    location: 'Malcolm X Boulevard Curb',
    nodeId: 'node_malcolm_x',
    heading: 140,
    pitch: -18,
    text: 'A small, matte-black hexagonal sanitation rover quietly glides past, sweeping a stray palm leaf into its collection hopper with a soft hum. As it approaches pedestrians, it slows gently and emits a soft polite chime.',
    actionPrompt: 'Trigger rover pedestrian chime',
    soundType: 'chime',
  },
  {
    title: 'Pneumatic Smart Waste Hub',
    location: '125th St Promenade Hub #01',
    nodeId: 'node_apollo_125',
    heading: 142,
    pitch: -16,
    text: 'A teenager tosses a paper cup near a bronze-accented smart receptacle; before it even touches the rim, the contactless aperture slides open silently, vacuuming the cup downward with a soft whoosh and flashing a gentle green pulse of light.',
    actionPrompt: 'Trigger pneumatic sub-street whoosh',
    soundType: 'whoosh',
  },
  {
    title: 'Sub-Tropical Harlem Renaissance',
    location: 'Astor Row Historic Brownstones',
    nodeId: 'node_brownstone_stoop',
    heading: 25,
    pitch: -2,
    text: 'The streets are wide, immaculate, and alive with conversation, brass horns, and the rhythmic rustle of palm trees against century-old brick. Harlem has harmonized its rich cultural heritage with an eco-futuristic paradise.',
    actionPrompt: 'Finish Tour & Explore Freely',
    soundType: 'jazz',
  },
];

export const VignetteNarrator: React.FC<Props> = ({ onClose, onJumpToNode }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const currentStep = VIGNETTE_STEPS[currentStepIdx];

  const handleApplyStep = (idx: number) => {
    setCurrentStepIdx(idx);
    const step = VIGNETTE_STEPS[idx];
    onJumpToNode(step.nodeId, step.heading, step.pitch);

    // Trigger associated sound
    if (step.soundType === 'jazz') soundEngine.playJazzChord();
    if (step.soundType === 'chime') soundEngine.playRoverChime();
    if (step.soundType === 'whoosh') soundEngine.playPneumaticWhoosh();
    if (step.soundType === 'mist') soundEngine.playMistHiss();
  };

  const handleNext = () => {
    if (currentStepIdx < VIGNETTE_STEPS.length - 1) {
      handleApplyStep(currentStepIdx + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      handleApplyStep(currentStepIdx - 1);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-xl px-4 pointer-events-auto">
      <div className="bg-slate-900/95 border border-amber-500/40 rounded-2xl p-5 shadow-2xl backdrop-blur-md text-white">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
              A Day in the Life · Vignette Walkthrough
            </h4>
            <span className="text-[11px] font-mono text-slate-400">
              {currentStepIdx + 1} / {VIGNETTE_STEPS.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Exit vignette"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-3">
          <div className="flex items-baseline justify-between mb-1">
            <h3 className="text-sm font-semibold text-white">{currentStep.title}</h3>
            <span className="text-[11px] font-mono text-amber-200/80">{currentStep.location}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed italic">{currentStep.text}</p>
        </div>

        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStepIdx === 0}
            className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300 hover:bg-slate-800 disabled:opacity-40 flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Previous
          </button>

          <button
            onClick={() => {
              if (currentStep.soundType === 'jazz') soundEngine.playJazzChord();
              if (currentStep.soundType === 'chime') soundEngine.playRoverChime();
              if (currentStep.soundType === 'whoosh') soundEngine.playPneumaticWhoosh();
              if (currentStep.soundType === 'mist') soundEngine.playMistHiss();
            }}
            className="px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs font-medium hover:bg-amber-500/30 flex items-center gap-1.5 transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5" /> Replay Ambient Sound
          </button>

          <button
            onClick={handleNext}
            className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs flex items-center gap-1 shadow-md transition-colors"
          >
            {currentStepIdx === VIGNETTE_STEPS.length - 1 ? (
              <>
                <Check className="w-3.5 h-3.5" /> Complete
              </>
            ) : (
              <>
                Next <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
