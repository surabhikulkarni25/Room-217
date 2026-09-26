import React, { useEffect } from 'react';

interface RegisterViewerProps {
  onClose: () => void;
}

export const RegisterViewer: React.FC<RegisterViewerProps> = ({ onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyE' || e.code === 'Escape' || e.code === 'Space') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/85 backdrop-blur-[3px] flex items-center justify-center p-2 sm:p-6 z-50 overflow-y-auto animate-fadeIn select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#1f1913] border-4 border-[#3a2c20] shadow-2xl p-3 sm:p-6 text-[#2a2219] font-mono rounded-xs my-auto max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Binder Header */}
        <div className="flex items-center justify-between border-b-2 border-[#4d3a2b] pb-2 mb-3 text-[#d4aa50] gap-2">
          <div className="flex items-center space-x-2 min-w-0">
            <span className="text-base sm:text-lg shrink-0">📋</span>
            <span className="font-bold tracking-wider text-xs sm:text-sm truncate">
              HOSTEL 2ND FLOOR — MAINTENANCE LOG
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 bg-[#2a1d12] hover:bg-[#3f2c1b] active:scale-95 border border-[#5a432f] text-[#d4aa50] hover:text-[#f5e8d5] text-xs font-bold rounded-xs flex items-center space-x-1 cursor-pointer touch-manipulation transition-colors shadow-sm shrink-0"
            aria-label="Close Log"
          >
            <span>✕</span>
            <span>BACK</span>
          </button>
        </div>

        {/* Aged Parchment / Ledger Page */}
        <div className="bg-[#ede4cb] border border-[#b8ab8b] p-3 sm:p-5 rounded-xs shadow-inner space-y-4 max-h-[60vh] sm:max-h-[65vh] overflow-y-auto">
          {/* Header watermark */}
          <div className="border-b border-[#c2b595] pb-2 text-center">
            <p className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-[#6d5b45] uppercase">
              The Grandview Hostel &bull; Floor 2 Maintenance Log
            </p>
          </div>

          {/* Entry 1 */}
          <div className="space-y-1 text-xs text-[#2a2219] leading-relaxed">
            <div className="flex justify-between items-center text-[11px] font-bold text-[#7a5b3a] border-b border-[#dfd4b7] pb-0.5">
              <span>OCTOBER 14</span>
              <span>INSPECTION</span>
            </div>
            <p>
              Radiator valve servicing completed for rooms 211 through 215. North riser continues to knock during early morning cold cycles. Replaced bleed valve washer on unit 212.
            </p>
          </div>

          {/* Entry 2 - The crucial code entry */}
          <div className="space-y-1 text-xs text-[#2a2219] leading-relaxed bg-[#e4dac0] p-2.5 border-l-2 border-[#8b6534]">
            <div className="flex justify-between items-center text-[11px] font-bold text-[#8b4d24] border-b border-[#d8ccaf] pb-0.5">
              <span>OCTOBER 19</span>
              <span>ROOM 214 REPAIR</span>
            </div>
            <p>
              Room 214 closed for plaster repair and moisture abatement. Heavy brass combination padlock fitted to door latch.
            </p>
            <p className="font-semibold text-[#663814]">
              Security code set to <span className="underline decoration-dotted tracking-widest text-[#882211] font-bold">8412</span>. Key to Room 217 transferred inside for safekeeping during inventory audit.
            </p>
          </div>

          {/* Entry 3 */}
          <div className="space-y-1 text-xs text-[#2a2219] leading-relaxed">
            <div className="flex justify-between items-center text-[11px] font-bold text-[#7a5b3a] border-b border-[#dfd4b7] pb-0.5">
              <span>OCTOBER 23</span>
              <span>ROOM 217 ANOMALY</span>
            </div>
            <p>
              Tenant in Room 217 has not responded to morning call. Heavy deadbolt engaged from within. Persistent faint scratching reported through shared wall with 216.
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-3.5 pt-2 border-t border-[#3a2c20] flex items-center justify-between text-xs text-[#8c7b69] gap-2">
          <span className="hidden sm:inline">Notice Board Archive &bull; Floor 2</span>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 bg-[#2a1d12] hover:bg-[#3f2c1b] active:scale-95 border border-[#5a432f] text-[#d4aa50] font-bold rounded-xs cursor-pointer touch-manipulation flex items-center justify-center space-x-1 shadow-md"
          >
            <span>RETURN TO GAME</span>
            <kbd className="hidden sm:inline-block text-[10px] text-[#8c7b69]">[E]</kbd>
          </button>
        </div>
      </div>
    </div>
  );
};
