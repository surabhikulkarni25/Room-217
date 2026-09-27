import React, { useEffect, useState } from 'react';

export interface PoemLine {
  text: string;
  isFinal?: boolean;
}

/**
 * Easily editable running poem lines.
 * Edit this array to customize or update the final poem.
 * The final entry must end with a question mark and have isFinal: true.
 */
export const POEM_LINES: PoemLine[] = [
  { text: "In the darkness lies the shadow,", isFinal: false },
  { text: "Those shadows are unknown.", isFinal: false },
  { text: "Lurks behind us is the past,", isFinal: false },
  { text: "The past we don't want to know.", isFinal: false },
  { text: "Sitting in silence,", isFinal: false },
  { text: "Sorrows we behold,", isFinal: false },
  { text: "It is the missing piece we try to find,", isFinal: false },
  { text: "The broken ones seem to unfold.", isFinal: false },
  { text: "No one cared when it mattered,", isFinal: false },
  { text: "No one came when things shattered,", isFinal: false },
  { text: "Beyond this story is where the cries were heard,", isFinal: false },
  { text: "Neo... are you willing to be heard?", isFinal: true },
];

export interface PoemSequenceProps {
  onRestart?: () => void;
}

export const PoemSequence: React.FC<PoemSequenceProps> = ({ onRestart }) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [showPlayAgain, setShowPlayAgain] = useState(false);

  useEffect(() => {
    // If we have reached the final line (Line 12):
    // Wait 5 seconds, then reveal the Play Again button.
    if (currentLineIndex >= POEM_LINES.length - 1) {
      setIsFading(false);
      const pauseTimer = window.setTimeout(() => {
        setShowPlayAgain(true);
      }, 5000);
      return () => {
        clearTimeout(pauseTimer);
      };
    }

    let isCancelled = false;
    let fadeTimer: number | null = null;

    // Display line for ~3.4s, then fade for ~0.6s into next line
    const displayTimer = window.setTimeout(() => {
      if (isCancelled) return;
      setIsFading(true);

      fadeTimer = window.setTimeout(() => {
        if (isCancelled) return;
        setCurrentLineIndex((prev) => Math.min(prev + 1, POEM_LINES.length - 1));
        setIsFading(false);
      }, 600);
    }, 3400);

    return () => {
      isCancelled = true;
      clearTimeout(displayTimer);
      if (fadeTimer !== null) {
        clearTimeout(fadeTimer);
      }
    };
  }, [currentLineIndex]);

  const safeIndex = Math.min(Math.max(0, currentLineIndex), POEM_LINES.length - 1);
  const currentLine = POEM_LINES[safeIndex] ?? POEM_LINES[0];
  const isFinalLine = Boolean(currentLine?.isFinal);

  return (
    <div className="absolute inset-0 bg-black flex flex-col items-center justify-center p-4 sm:p-6 text-center select-none z-50 animate-fadeIn">
      <div
        className={`transition-opacity duration-700 max-w-2xl px-2 sm:px-4 ${
          isFading ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {isFinalLine ? (
          <h2 className="text-base sm:text-2xl md:text-3xl font-mono font-bold tracking-[0.16em] sm:tracking-[0.2em] text-[#d4aa50] drop-shadow-[0_0_15px_rgba(212,170,80,0.45)] leading-relaxed animate-pulse">
            {currentLine?.text ?? ''}
          </h2>
        ) : (
          <p className="text-sm sm:text-lg md:text-xl font-mono text-[#dcd4c8] tracking-[0.1em] sm:tracking-[0.14em] leading-relaxed drop-shadow-md">
            {currentLine?.text ?? ''}
          </p>
        )}
      </div>

      {/* Part 13 & 14: After the 5-second pause on Line 12, Play Again button appears */}
      {showPlayAgain && (
        <div className="mt-8 sm:mt-10 flex flex-col items-center space-y-3 animate-fadeIn">
          <button
            type="button"
            onClick={() => onRestart?.()}
            className="min-h-[48px] px-6 py-2.5 bg-[#1b1510] hover:bg-[#2e2319] active:bg-[#120d09] border border-[#d4aa50] text-[#d4aa50] font-mono text-xs sm:text-sm transition-all cursor-pointer tracking-[0.2em] uppercase rounded-xs shadow-lg active:scale-95"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};
