import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  PHONE_MESSAGES,
  PHONE_NOTES,
  PHONE_AUDIO_MEMO,
} from '../game/data/phoneData';
import {
  playPhoneClickSound,
} from '../game/audio/minimalAudio';

interface PhoneViewerProps {
  onClose: () => void;
}

type PhoneTab = 'messages' | 'notes' | 'audio';

export const PhoneViewer: React.FC<PhoneViewerProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<PhoneTab>('messages');
  const [isPlayingMemo, setIsPlayingMemo] = useState(false);
  const playTimeoutRef = useRef<number | null>(null);

  const stopMemoPlayback = useCallback(() => {
    if (playTimeoutRef.current !== null) {
      clearTimeout(playTimeoutRef.current);
      playTimeoutRef.current = null;
    }
    setIsPlayingMemo(false);
  }, []);

  const handleToggleMemo = () => {
    if (isPlayingMemo) {
      stopMemoPlayback();
      return;
    }

    playPhoneClickSound();
    setIsPlayingMemo(true);

    // Auto-stop after display duration
    playTimeoutRef.current = window.setTimeout(() => {
      stopMemoPlayback();
    }, 6000);
  };

  // Stop playback on tab switch or component unmount
  useEffect(() => {
    return () => {
      stopMemoPlayback();
    };
  }, [stopMemoPlayback]);

  useEffect(() => {
    if (activeTab !== 'audio' && isPlayingMemo) {
      stopMemoPlayback();
    }
  }, [activeTab, isPlayingMemo, stopMemoPlayback]);

  const switchTab = (tab: PhoneTab) => {
    if (tab !== activeTab) {
      playPhoneClickSound();
      setActiveTab(tab);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Digit1') {
        e.preventDefault();
        switchTab('messages');
      } else if (e.code === 'Digit2') {
        e.preventDefault();
        switchTab('notes');
      } else if (e.code === 'Digit3') {
        e.preventDefault();
        switchTab('audio');
      } else if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
        e.preventDefault();
        if (activeTab === 'notes') switchTab('messages');
        else if (activeTab === 'audio') switchTab('notes');
      } else if (e.code === 'KeyD' || e.code === 'ArrowRight') {
        e.preventDefault();
        if (activeTab === 'messages') switchTab('notes');
        else if (activeTab === 'notes') switchTab('audio');
      } else if (e.code === 'Escape' || e.code === 'KeyE' || e.code === 'KeyP') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, onClose]);

  return (
    <div
      className="absolute inset-0 bg-black/85 backdrop-blur-[3px] flex items-center justify-center p-2 sm:p-5 z-50 animate-fadeIn select-none font-mono"
      onClick={onClose}
    >
      {/* Phone Handset Chassis */}
      <div
        className="relative w-full max-w-[340px] max-h-[94vh] bg-[#1a1c1d] border-4 border-[#35393d] rounded-2xl shadow-2xl p-2.5 sm:p-4 text-[#e0e6e8] flex flex-col items-center overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Handset Speaker, Sensor & Dismiss Button */}
        <div className="w-full flex items-center justify-between px-1 mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-[#111315] border border-[#262a2d]" />
            <div className="w-12 h-1.5 rounded-full bg-[#111315] border border-[#262a2d]" />
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Phone"
            className="min-h-[36px] min-w-[36px] text-xs text-[#90a4ae] hover:text-[#eceff1] bg-[#141617] border border-[#2c3135] rounded px-2 py-0.5 flex items-center justify-center cursor-pointer active:scale-95"
          >
            ✕
          </button>
        </div>

        {/* LCD Screen Container */}
        <div className="relative w-full bg-[#0c1214] border-2 border-[#1f282c] rounded-md overflow-hidden min-h-[340px] sm:min-h-[390px] max-h-[72vh] flex flex-col justify-between shadow-inner">
          {/* Glass Spiderweb Crack Visual Overlay */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-30 opacity-40"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              d="M 95 0 L 80 25 L 88 42 L 72 65 L 82 85"
              stroke="#6b8e9b"
              strokeWidth="0.6"
              fill="none"
            />
            <path
              d="M 80 25 L 62 20 L 52 35"
              stroke="#6b8e9b"
              strokeWidth="0.4"
              fill="none"
            />
            <path
              d="M 72 65 L 58 72 L 48 88"
              stroke="#6b8e9b"
              strokeWidth="0.4"
              fill="none"
            />
          </svg>

          {/* Status Bar */}
          <div className="w-full bg-[#080d0e] border-b border-[#1b262b] px-3 py-1 flex items-center justify-between text-[11px] text-[#78909c] z-20 shrink-0">
            <span className="font-bold tracking-wider">03:17</span>
            <span className="text-[10px] text-[#a04040] animate-pulse font-semibold">
              NO SERVICE
            </span>
            <div className="flex items-center space-x-1">
              <span className="text-[#d9534f] text-[10px] font-bold">3%</span>
              <div className="w-4 h-2 border border-[#d9534f] p-[1px] rounded-xs flex items-center">
                <div className="w-1.5 h-full bg-[#d9534f] animate-pulse" />
              </div>
            </div>
          </div>

          {/* Navigation Tab Bar */}
          <div className="grid grid-cols-3 border-b border-[#1b262b] bg-[#10171a] text-xs z-20 shrink-0">
            <button
              type="button"
              onClick={() => switchTab('messages')}
              className={`min-h-[44px] py-2 text-center font-bold tracking-wide transition-colors cursor-pointer border-b-2 flex items-center justify-center ${
                activeTab === 'messages'
                  ? 'border-[#4db6ac] text-[#80cbc4] bg-[#152024]'
                  : 'border-transparent text-[#607d8b] hover:text-[#90a4ae]'
              }`}
            >
              MESSAGES
            </button>
            <button
              type="button"
              onClick={() => switchTab('notes')}
              className={`min-h-[44px] py-2 text-center font-bold tracking-wide transition-colors cursor-pointer border-b-2 flex items-center justify-center ${
                activeTab === 'notes'
                  ? 'border-[#4db6ac] text-[#80cbc4] bg-[#152024]'
                  : 'border-transparent text-[#607d8b] hover:text-[#90a4ae]'
              }`}
            >
              NOTES
            </button>
            <button
              type="button"
              onClick={() => switchTab('audio')}
              className={`min-h-[44px] py-2 text-center font-bold tracking-wide transition-colors cursor-pointer border-b-2 flex items-center justify-center ${
                activeTab === 'audio'
                  ? 'border-[#4db6ac] text-[#80cbc4] bg-[#152024]'
                  : 'border-transparent text-[#607d8b] hover:text-[#90a4ae]'
              }`}
            >
              AUDIO
            </button>
          </div>

          {/* Main Scrollable Tab Viewport */}
          <div className="p-3 overflow-y-auto flex-1 z-10 space-y-3">
            {/* MESSAGES TAB */}
            {activeTab === 'messages' && (
              <div className="space-y-2.5">
                <div className="text-[10px] text-[#546e7a] uppercase tracking-wider border-b border-[#182327] pb-1">
                  SMS THREAD &bull; NEO (YOU)
                </div>
                {PHONE_MESSAGES.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === 'me' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-md p-2 text-xs leading-relaxed ${
                        msg.sender === 'me'
                          ? 'bg-[#1e3a3a] text-[#e0f2f1] border border-[#2b5956]'
                          : 'bg-[#1b2529] text-[#cfd8dc] border border-[#26353a]'
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>
                    <span className="text-[9px] text-[#546e7a] mt-0.5 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* NOTES TAB */}
            {activeTab === 'notes' && (
              <div className="space-y-2.5">
                <div className="text-[10px] text-[#546e7a] uppercase tracking-wider border-b border-[#182327] pb-1">
                  SAVED DRAFTS &bull; UNFINISHED NOTES
                </div>
                {PHONE_NOTES.map((note) => (
                  <div key={note.id} className="bg-[#141d21] border border-[#223238] rounded-md p-3 space-y-2">
                    <div className="flex justify-between items-center text-[10px] text-[#80cbc4] font-semibold border-b border-[#1e2d33] pb-1">
                      <span>{note.title}</span>
                      <span className="text-[#546e7a]">{note.date}</span>
                    </div>
                    <div className="text-xs text-[#b0bec5] leading-relaxed whitespace-pre-line">
                      {note.content}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* AUDIO TAB */}
            {activeTab === 'audio' && (
              <div className="space-y-3">
                <div className="text-[10px] text-[#546e7a] uppercase tracking-wider border-b border-[#182327] pb-1">
                  VOICE MEMO ARCHIVE
                </div>
                <div className="bg-[#141d21] border border-[#223238] rounded-md p-3 space-y-3">
                  <div className="flex justify-between items-center text-[10px] text-[#80cbc4] font-semibold border-b border-[#1e2d33] pb-1">
                    <span className="truncate max-w-[160px]">
                      {PHONE_AUDIO_MEMO.title}
                    </span>
                    <span className="text-[#546e7a]">{PHONE_AUDIO_MEMO.duration}</span>
                  </div>

                  {/* Playback Progress Indicator */}
                  <div className="space-y-1">
                    <div className="w-full bg-[#1e2d33] h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-[#4db6ac] transition-all duration-300 ${
                          isPlayingMemo ? 'w-3/4 animate-pulse' : 'w-0'
                        }`}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] text-[#607d8b]">
                      <span>{isPlayingMemo ? '0:14' : '0:00'}</span>
                      <span>0:22</span>
                    </div>
                  </div>

                  {/* Playback Control Button */}
                  <div className="pt-1">
                    {isPlayingMemo ? (
                      <button
                        type="button"
                        onClick={handleToggleMemo}
                        className="w-full min-h-[44px] py-2 px-3 bg-[#3e1b1b] hover:bg-[#542424] active:bg-[#2b1212] border border-[#7f2626] text-[#ff8a80] font-bold rounded-xs flex items-center justify-center space-x-2 cursor-pointer transition-colors shadow-sm"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#ff5252] animate-ping" />
                        <span>■ STOP RECORDING</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleToggleMemo}
                        className="w-full min-h-[44px] py-2 px-3 bg-[#152a2e] hover:bg-[#1f3b41] active:bg-[#0e1d20] border border-[#3b7b84] text-[#80cbc4] font-bold rounded-xs flex items-center justify-center space-x-2 cursor-pointer transition-colors shadow-sm"
                      >
                        <span>▶</span>
                        <span>PLAY RECORDING</span>
                      </button>
                    )}
                  </div>

                  {/* Partial Audio Transcript */}
                  <div className="mt-2 pt-2 border-t border-[#1b262c] space-y-1">
                    <div className="text-[10px] text-[#80cbc4] font-bold">
                      RECOVERED AUDIO TRANSCRIPT:
                    </div>
                    <p className="text-xs leading-relaxed text-[#eceff1] bg-[#1a2529] p-2 rounded-xs border border-[#2a3c42] italic">
                      &ldquo;{PHONE_AUDIO_MEMO.transcriptSnippet}&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Screen Bottom App Bar / Dismissal Hint */}
          <div className="w-full bg-[#080d0e] border-t border-[#1b262b] px-3 py-2 flex items-center justify-between text-[11px] text-[#78909c] z-20 shrink-0">
            <span className="hidden sm:inline">[1/2/3] Tabs</span>
            <span className="text-[10px] sm:hidden">Swipe or Tap Tabs</span>
            <button
              type="button"
              onClick={onClose}
              className="min-h-[40px] px-3 py-1 bg-[#172226] hover:bg-[#25353c] active:bg-[#0f171a] border border-[#2b3c43] text-[#80cbc4] font-bold rounded-xs cursor-pointer text-xs flex items-center space-x-1"
            >
              <span>CLOSE</span>
              <kbd className="text-[10px] text-[#4db6ac]">[E]</kbd>
            </button>
          </div>
        </div>

        {/* Physical Home Indicator Bar */}
        <div className="w-16 h-1 bg-[#2e3236] rounded-full mt-2.5" />
      </div>
    </div>
  );
};
