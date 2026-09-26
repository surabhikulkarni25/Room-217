import React, { useEffect } from 'react';
import { InteractableObject } from '../types/game';

interface InteractionDialogProps {
  interactable: InteractableObject;
  onClose: () => void;
}

export const InteractionDialog: React.FC<InteractionDialogProps> = ({
  interactable,
  onClose,
}) => {
  // Listen for dismiss keys (E, Space, Enter, Escape)
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

  return (
    <div
      className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-end justify-center p-4 z-40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[#141210] border-2 border-[#524434] shadow-2xl p-4 sm:p-5 text-[#dfd7cc] font-mono select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Title and Close indicator */}
        <div className="flex items-center justify-between border-b border-[#362b21] pb-2 mb-3">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 bg-[#d4aa50]" />
            <h3 className="text-sm sm:text-base font-bold text-[#d4aa50] uppercase tracking-wider">
              {interactable.inspectTitle}
            </h3>
          </div>
          <span className="text-xs text-[#8c8071]">
            [ESC / E] Close
          </span>
        </div>

        {/* Inspection Text */}
        <p className="text-xs sm:text-sm leading-relaxed text-[#c7beaf] mb-4 min-h-[48px]">
          {interactable.inspectText}
        </p>

        {/* Footer Prompt */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1 text-xs bg-[#241d16] hover:bg-[#342a20] border border-[#524434] text-[#e8dfd3] transition-colors cursor-pointer"
          >
            Continue [E]
          </button>
        </div>
      </div>
    </div>
  );
};
