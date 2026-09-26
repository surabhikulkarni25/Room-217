import React, { useEffect, useState } from 'react';
import { playFinalImpactSound } from '../game/audio/minimalAudio';

interface EndingSequenceProps {
  onRestart: () => void;
}

export const EndingSequence: React.FC<EndingSequenceProps> = ({ onRestart }) => {
  // Stages:
  // 0: Initial Fade to Black (1.2s)
  // 1: "CASE CLOSED" (2.2s)
  // 2: "..." (1.8s)
  // 3: "BUT WHO DID THIS?" + Impact Sound (0.65s)
  // 4: Cut to Pitch Black (3.5s)
  // 5: Final Black Screen with unobtrusive restart option
  const [stage, setStage] = useState<number>(0);

  useEffect(() => {
    // Stage 0 -> 1: Blackout pause into "CASE CLOSED"
    const t1 = setTimeout(() => {
      setStage(1);
    }, 1000);

    // Stage 1 -> 2: "CASE CLOSED" into "..."
    const t2 = setTimeout(() => {
      setStage(2);
    }, 3200);

    // Stage 2 -> 3: "..." into "but where is my friend and who kept those things there" + Impact sound cue
    const t3 = setTimeout(() => {
      setStage(3);
      playFinalImpactSound();
    }, 5000);

    // Stage 3 -> 4: Immediate cut to pitch black right after impact sound
    const t4 = setTimeout(() => {
      setStage(4);
    }, 5800);

    // Stage 4 -> 5: Quiet post-ending state with minimal replay option
    const t5 = setTimeout(() => {
      setStage(5);
    }, 9000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  return (
    <div className="absolute inset-0 bg-[#000000] flex flex-col items-center justify-center p-6 text-center select-none z-50 transition-colors duration-700">
      {stage === 1 && (
        <h1 className="text-2xl sm:text-3xl font-mono font-bold tracking-[0.3em] text-[#d4aa50] drop-shadow-md animate-fadeIn">
          CASE CLOSED
        </h1>
      )}

      {stage === 2 && (
        <div className="space-y-4 animate-fadeIn">
          <p className="text-2xl sm:text-3xl font-mono font-bold tracking-[0.4em] text-[#8a7f70]">
            ...
          </p>
        </div>
      )}

      {stage === 3 && (
        <h1 className="text-base sm:text-xl font-mono font-medium tracking-[0.18em] text-[#f4efe8] drop-shadow-lg max-w-xl leading-relaxed">
          but where is my friend and who kept those things there
        </h1>
      )}

      {/* Stage 4 is pure, uninterrupted black silence */}

      {/* Stage 5: Unobtrusive restart option appearing only after the final beat */}
      {stage === 5 && (
        <div className="absolute bottom-8 flex flex-col items-center space-y-3 animate-fadeIn">
          <button
            onClick={onRestart}
            className="text-xs font-mono text-[#54493c] hover:text-[#c4b59d] transition-colors border-b border-[#2d241c] hover:border-[#6b5a45] pb-0.5 cursor-pointer tracking-wider"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};
