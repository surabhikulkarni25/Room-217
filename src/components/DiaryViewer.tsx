import React, { useEffect, useState } from 'react';
import { DIARY_ENTRIES } from '../game/data/diaryEntries';

interface DiaryViewerProps {
  onClose: () => void;
  initialPage?: number;
}

export const DiaryViewer: React.FC<DiaryViewerProps> = ({
  onClose,
  initialPage = 0,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);

  const totalPages = DIARY_ENTRIES.length;
  const page = DIARY_ENTRIES[currentPage] || DIARY_ENTRIES[0];

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyD' || e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.code === 'Escape' || e.code === 'KeyE') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages, onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/85 backdrop-blur-[3px] flex items-center justify-center p-2 sm:p-6 z-50 overflow-y-auto animate-fadeIn select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#231a14] border-4 border-[#4a3625] shadow-2xl p-3 sm:p-6 text-[#2b221a] font-mono rounded-xs my-auto max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Leather Notebook Outer Header */}
        <div className="flex items-center justify-between border-b-2 border-[#5a432f] pb-2 mb-3 text-[#d4aa50] gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-base sm:text-lg">📖</span>
            <span className="text-xs sm:text-sm font-bold tracking-widest uppercase">
              Friend&apos;s Diary
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] text-[#9c846f] font-mono hidden sm:inline">
              PAGE {currentPage + 1}/{totalPages}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-2.5 py-1 bg-[#2f2218] hover:bg-[#433123] active:scale-95 border border-[#5a432f] text-[#d4aa50] hover:text-[#f4e8d8] text-xs font-bold rounded-xs flex items-center space-x-1 cursor-pointer touch-manipulation transition-colors shadow-sm"
              aria-label="Close Diary"
            >
              <span>✕</span>
              <span>BACK</span>
            </button>
          </div>
        </div>

        {/* Aged Parchment Page Container */}
        <div
          className={`relative p-3.5 sm:p-5 bg-[#e3d8c2] border-2 border-[#baaa8f] shadow-inner rounded-xs min-h-[200px] sm:min-h-[290px] max-h-[55vh] sm:max-h-none overflow-y-auto flex flex-col justify-between ${
            page.damageType === 'charred' ? 'ring-1 ring-[#3a2010]' : ''
          }`}
          style={
            page.damageType === 'torn'
              ? {
                  clipPath:
                    'polygon(0% 0%, 100% 0%, 100% 74%, 88% 78%, 76% 68%, 62% 86%, 48% 70%, 34% 90%, 18% 76%, 0% 86%)',
                }
              : undefined
          }
        >
          {/* Burn / Tear / Water Damage Visual Background Accents */}
          {page.damageType === 'charred' && (
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#180f08] via-[#482814] to-transparent opacity-90 pointer-events-none" />
          )}
          {page.damageType === 'water' && (
            <div className="absolute bottom-2 right-2 w-32 h-24 bg-[#c8baa0]/70 rounded-full blur-[2px] pointer-events-none border border-[#b4a488]/40" />
          )}
          {page.damageType === 'torn' && (
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#1f150e] via-[#382214] to-transparent pointer-events-none" />
          )}

          {/* Page Lines */}
          <div className="space-y-3 z-10">
            {page?.lines?.map((line, idx) => {
              if (!line) return null;
              if (line.style === 'heading') {
                return (
                  <div
                    key={idx}
                    className="flex items-center text-xs sm:text-sm font-bold text-[#483321] tracking-wider border-b border-[#c8bc9f] pb-1 uppercase"
                  >
                    <span>{line?.text ?? ''}</span>
                    {/* Visual charred burn hole eating into the date */}
                    {line.damageEffect === 'charred_edge' && (
                      <span className="inline-flex items-center ml-1.5">
                        <span
                          className="w-16 h-4 bg-[#140c07] border-b border-[#4d2212] inline-block shadow-inner"
                          style={{
                            clipPath:
                              'polygon(0% 30%, 18% 5%, 35% 85%, 55% 15%, 72% 75%, 88% 25%, 100% 70%, 100% 100%, 0% 100%)',
                          }}
                        />
                        <span className="w-1.5 h-1.5 bg-[#8a3318] rounded-full blur-[0.5px] -ml-1 opacity-80 animate-pulse" />
                      </span>
                    )}
                  </div>
                );
              }

              if (line.damageEffect === 'water_smudge') {
                return (
                  <p
                    key={idx}
                    className="text-xs sm:text-[13px] leading-relaxed text-[#35281e]"
                  >
                    Beneath the{' '}
                    {/* Visual water damage blurred & smudged text */}
                    <span className="relative inline-block px-1 py-0.5 mx-0.5">
                      <span className="relative z-0 opacity-25 blur-[1.2px] select-none text-[#523d2a] font-serif">
                        floorboard seam
                      </span>
                      {/* Translucent water stain overlay */}
                      <span className="absolute inset-0 bg-[#8c7858]/35 rounded-full blur-[2px] pointer-events-none border border-[#7a684b]/40 scale-105" />
                    </span>{' '}
                    where the boards meet the wall near the{' '}
                    {/* Visual ink blot smudged text */}
                    <span className="relative inline-block px-1 py-0.5 mx-0.5">
                      <span className="relative z-0 opacity-20 blur-[1px] select-none text-[#1b140e]">
                        writing desk
                      </span>
                      {/* Ink blot patch */}
                      <span className="absolute inset-0 bg-[#160f0a]/90 rounded-full blur-[0.6px] -rotate-3 scale-95 pointer-events-none" />
                      <span className="absolute -bottom-1 -right-1 w-2.5 h-1.5 bg-[#160f0a]/80 rounded-full blur-[0.5px] pointer-events-none" />
                    </span>
                    ... there is a hollow space behind the wood.
                  </p>
                );
              }

              if (line.damageEffect === 'torn_gap') {
                return (
                  <p
                    key={idx}
                    className="text-xs sm:text-[13px] leading-relaxed text-[#35281e]"
                  >
                    <span>{line?.text ?? ''} </span>
                    {/* Visual jagged tear gap where words are physically missing */}
                    <span
                      className="inline-block w-20 h-4 bg-[#231a14] align-middle shadow-md"
                      style={{
                        clipPath:
                          'polygon(0% 45%, 15% 5%, 32% 80%, 48% 12%, 68% 85%, 85% 15%, 100% 75%, 100% 100%, 0% 100%)',
                      }}
                    />
                  </p>
                );
              }

              if (line.style === 'italic') {
                return (
                  <p
                    key={idx}
                    className="text-xs sm:text-[13px] leading-relaxed text-[#4e3d2c] italic"
                  >
                    {line?.text ?? ''}
                  </p>
                );
              }

              return (
                <p
                  key={idx}
                  className="text-xs sm:text-[13px] leading-relaxed text-[#35281e]"
                >
                  {line?.text ?? ''}
                </p>
              );
            })}
          </div>

          {/* Page Bottom Accent / Notebook Detail */}
          <div className="mt-4 pt-2 border-t border-[#c5b89a] flex justify-between items-center text-[10px] text-[#7a6b57] z-10">
            <span className="tracking-wide">Room 217 Notebook</span>
            <span className="font-bold tracking-widest">{page.entryTitle}</span>
          </div>
        </div>

        {/* Navigation & Dismissal Controls */}
        <div className="mt-3 sm:mt-4 flex items-center justify-between text-xs font-mono text-[#dcd1be] gap-2">
          {/* Previous Button */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentPage === 0}
            className={`px-3 py-2 border transition-colors flex items-center space-x-1.5 rounded-xs touch-manipulation active:scale-95 ${
              currentPage === 0
                ? 'opacity-40 cursor-not-allowed border-[#423223] text-[#786450]'
                : 'bg-[#2f2218] hover:bg-[#433123] border-[#5a432f] text-[#ecd8bd] cursor-pointer'
            }`}
          >
            <span>◀</span>
            <span>PREV</span>
            <kbd className="hidden sm:inline-block text-[10px] text-[#d4aa50]">[A]</kbd>
          </button>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#1b140f] hover:bg-[#2c2018] active:scale-95 border border-[#524434] text-[#d4aa50] font-bold tracking-wider transition-colors cursor-pointer rounded-xs touch-manipulation shadow-md flex items-center space-x-1"
          >
            <span>CLOSE</span>
            <kbd className="hidden sm:inline-block text-[10px] text-[#d4aa50]">[E]</kbd>
          </button>

          {/* Next Button */}
          <button
            type="button"
            onClick={handleNext}
            disabled={currentPage === totalPages - 1}
            className={`px-3 py-2 border transition-colors flex items-center space-x-1.5 rounded-xs touch-manipulation active:scale-95 ${
              currentPage === totalPages - 1
                ? 'opacity-40 cursor-not-allowed border-[#423223] text-[#786450]'
                : 'bg-[#2f2218] hover:bg-[#433123] border-[#5a432f] text-[#ecd8bd] cursor-pointer'
            }`}
          >
            <span>NEXT</span>
            <kbd className="hidden sm:inline-block text-[10px] text-[#d4aa50]">[D]</kbd>
            <span>▶</span>
          </button>
        </div>
      </div>
    </div>
  );
};
