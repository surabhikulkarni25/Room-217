import React, { useEffect, useState, useRef } from 'react';
import { playFinalImpactSound } from '../game/audio/minimalAudio';
import { PoemSequence } from './PoemSequence';

interface EndingSequenceProps {
  onRestart: () => void;
}

export const EndingSequence: React.FC<EndingSequenceProps> = ({ onRestart }) => {
  // Stages:
  // 0: "YOU THOUGHT IT WAS OVER, DIDN'T YOU?" + Impact Sound (3.8s)
  // 1: Short pause in pitch darkness (1.2s)
  // 2: Poem starts directly!
  const [stage, setStage] = useState<number>(0);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    // Play impact sound cue immediately on entry
    playFinalImpactSound();

    // Stage 0 -> 1: Short pause into pitch black after reading
    const t1 = window.setTimeout(() => {
      setStage(1);
    }, 3800);

    // Stage 1 -> 2: Transition directly into the poem sequence (NO button click required)
    const t2 = window.setTimeout(() => {
      setStage(2);
    }, 5000);

    timersRef.current = [t1, t2];

    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current = [];
    };
  }, []);

  if (stage === 2) {
    return <PoemSequence onRestart={onRestart} />;
  }

  return (
    <div className="absolute inset-0 bg-[#000000] flex flex-col items-center justify-center p-4 sm:p-6 text-center select-none z-50">
      {stage === 0 && (
        <h1 className="text-base sm:text-2xl md:text-3xl font-mono font-bold tracking-[0.18em] sm:tracking-[0.22em] text-[#f4efe8] drop-shadow-xl max-w-2xl leading-relaxed animate-fadeIn uppercase px-2">
          YOU THOUGHT IT WAS OVER, DIDN'T YOU?
        </h1>
      )}
      {/* Stage 1 is pure black short pause */}
    </div>
  );
};
