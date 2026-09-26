import React, { useEffect, useState } from 'react';

interface OpeningSequenceProps {
  onComplete: () => void;
}

export const OpeningSequence: React.FC<OpeningSequenceProps> = ({ onComplete }) => {
  // Stages: 0: "ROOM 217", 1: "WELCOME, NEO." + Intro text
  const [stage, setStage] = useState<number>(0);

  useEffect(() => {
    // Automatically transition from "ROOM 217" to "WELCOME, NEO" after 1.8s
    const timer = setTimeout(() => {
      setStage(1);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  // Keyboard navigation: Space, Enter, or E
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyE' || e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        if (stage === 0) {
          setStage(1);
        } else {
          onComplete();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stage, onComplete]);

  return (
    <div className="absolute inset-0 bg-[#070709] flex flex-col items-center justify-center p-6 text-center select-none z-50 animate-fadeIn">
      {stage === 0 ? (
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-mono font-bold tracking-[0.25em] text-[#d4aa50] drop-shadow-md">
            ROOM 217
          </h1>
          <p className="text-[11px] font-mono text-[#5a4e40] tracking-widest animate-pulse">
            PRESS [E] OR WAIT
          </p>
        </div>
      ) : (
        <div className="max-w-lg w-full bg-[#12100e] border border-[#3e3226] p-6 sm:p-8 rounded-sm shadow-2xl text-left font-mono space-y-5 animate-fadeIn">
          <div className="border-b border-[#2e241b] pb-2">
            <h2 className="text-lg sm:text-xl font-bold tracking-widest text-[#d4aa50]">
              WELCOME, NEO.
            </h2>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-[#c4b9aa] leading-relaxed">
            <p>
              You have come to this old hostel to find a close friend who has been missing for several days.
            </p>
            <p>
              Their last confirmed room was <span className="text-[#d4aa50] font-semibold">Room 217</span>.
            </p>
            <p className="text-[#8e8172] italic">
              Find out what happened.
            </p>
          </div>

          <div className="pt-3 border-t border-[#2a2119] flex justify-between items-center text-xs">
            <span className="text-[#645849]">[E / Space] to Proceed</span>
            <button
              onClick={onComplete}
              className="px-4 py-1.5 bg-[#251e18] hover:bg-[#392e24] border border-[#524434] text-[#e8dfd3] font-mono tracking-wider transition-colors cursor-pointer"
            >
              Enter Hostel [E]
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
