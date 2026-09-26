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
      className="absolute inset-0 bg-black/80 backdrop-blur-[2px] flex items-center justify-center p-3 sm:p-6 z-50 animate-fadeIn select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#1f1913] border-4 border-[#3a2c20] shadow-2xl p-4 sm:p-6 text-[#2a2219] font-mono rounded-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Binder Header */}
        <div className="flex items-center justify-between border-b-2 border-[#4d3a2b] pb-2 mb-3 text-[#d4aa50]">
          <div className="flex items-center space-x-2">
            <span className="text-base sm:text-lg">📋</span>
            <span className="font-bold tracking-wider text-xs sm:text-sm">
              HOSTEL 2ND FLOOR — MAINTENANCE LOG
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-xs px-2 py-0.5 border border-[#5a432f] text-[#c4a060] hover:bg-[#342416] transition-colors cursor-pointer"
          >
            [Close / Esc]
          </button>
        </div>

        {/* Aged Parchment / Ledger Page */}
        <div className="bg-[#ede4cb] border border-[#b8ab8b] p-3 sm:p-5 rounded-xs shadow-inner space-y-4 max-h-[65vh] overflow-y-auto">
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
        <div className="mt-3 flex items-center justify-between text-[11px] text-[#8c7b69]">
          <span>Notice Board Archive &bull; Pinned Record</span>
          <span className="text-[#d4aa50]">Press [E] to dismiss</span>
        </div>
      </div>
    </div>
  );
};
