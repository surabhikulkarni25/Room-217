import React, { useEffect, useRef } from 'react';
import { INSPECTION_CANVAS_SIZE, renderInspectionVisual } from '../game/engine/inspectionRenderer';
import { startWindowRainSound } from '../game/audio/minimalAudio';
import { InteractableObject } from '../types/game';

interface VisualInspectionViewProps {
  interactable: InteractableObject;
  onClose: () => void;
}

export const VisualInspectionView: React.FC<VisualInspectionViewProps> = ({
  interactable,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Play subtle rain ambient audio while inspecting the window (State 1 or State 2)
  useEffect(() => {
    if (
      interactable.visualType === 'window' ||
      interactable.visualType === 'window_transformed'
    ) {
      const isIntensified = interactable.visualType === 'window_transformed';
      const stopSound = startWindowRainSound(isIntensified);
      return () => {
        stopSound();
      };
    }
  }, [interactable.visualType]);

  // Render the close-up pixel visual whenever interactable changes
  useEffect(() => {
    if (!interactable.visualType || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    renderInspectionVisual(
      ctx,
      interactable.visualType,
      interactable.id,
      interactable.inspectTitle
    );
  }, [interactable]);

  // Key listeners for dismissal (E, Space, Enter, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.code === 'KeyE' ||
        e.code === 'Space' ||
        e.code === 'Enter' ||
        e.code === 'Escape'
      ) {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const hasVisual = Boolean(interactable.visualType);

  return (
    <div
      className="absolute inset-0 bg-black/80 backdrop-blur-[2px] flex items-center justify-center p-2 sm:p-5 z-40 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[92vh] flex flex-col bg-[#141210] border-2 border-[#524434] shadow-2xl p-3 sm:p-5 text-[#dfd7cc] font-mono select-none overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-[#362b21] pb-2 mb-3">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 bg-[#d4aa50]" />
            <h3 className="text-xs sm:text-base font-bold text-[#d4aa50] uppercase tracking-wider truncate">
              {interactable.inspectTitle}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Inspection"
            className="min-h-[40px] px-2.5 py-1 text-xs bg-[#241d16] hover:bg-[#382c20] border border-[#524434] text-[#d4aa50] flex items-center space-x-1 cursor-pointer transition-colors active:scale-95"
          >
            <span>✕</span>
            <span className="hidden sm:inline">[ESC]</span>
          </button>
        </div>

        {/* Content Area: Visual + Narrative Text */}
        <div
          className={`flex-1 flex ${
            hasVisual ? 'flex-col sm:flex-row gap-3 sm:gap-4 items-center sm:items-start' : 'flex-col'
          }`}
        >
          {/* Close-Up Pixel Art Viewport */}
          {hasVisual && (
            <div className="shrink-0 flex flex-col items-center">
              <div className="p-1 bg-[#1c1612] border-2 border-[#483726] rounded-xs shadow-inner">
                <canvas
                  ref={canvasRef}
                  width={INSPECTION_CANVAS_SIZE}
                  height={INSPECTION_CANVAS_SIZE}
                  className="w-28 h-28 sm:w-36 sm:h-36 [image-rendering:pixelated] [image-rendering:crisp-edges] block"
                />
              </div>
              <span className="text-[9px] text-[#6b5c4c] mt-1 tracking-widest uppercase">
                Close-Up View
              </span>
            </div>
          )}

          {/* Narrative Inspection Text */}
          <div className="flex-1 flex flex-col justify-between self-stretch min-h-[90px]">
            <div className="text-xs sm:text-sm leading-relaxed text-[#c7beaf] whitespace-pre-line overflow-y-auto max-h-[45vh] pr-1">
              {interactable.inspectText}
            </div>

            {/* Footer Action */}
            <div className="flex justify-end pt-3 mt-3 border-t border-[#261d15]">
              <button
                type="button"
                onClick={onClose}
                className="min-h-[44px] px-4 py-2 text-xs sm:text-sm bg-[#241d16] hover:bg-[#382c20] active:bg-[#18130e] border border-[#524434] text-[#e8dfd3] transition-colors cursor-pointer flex items-center space-x-2 font-bold"
              >
                <span>Continue</span>
                <kbd className="bg-[#14100c] px-1.5 py-0.5 text-[10px] text-[#d4aa50] border border-[#3e3124]">
                  E
                </kbd>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
