import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  PHONE_MESSAGES,
  PHONE_NOTES,
  PHONE_AUDIO_MEMO,
} from '../game/data/phoneData';
import { playPhoneClickSound, playStaticBurst } from '../game/audio/minimalAudio';

interface PhoneViewerProps {
  onClose: () => void;
}

type PhoneTab = 'messages' | 'notes' | 'audio';

export const PhoneViewer: React.FC<PhoneViewerProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<PhoneTab>('messages');
  const [isPlayingMemo, setIsPlayingMemo] = useState(false);
  const isPlayingMemoRef = useRef(false);
  isPlayingMemoRef.current = isPlayingMemo;

  // Persistent reference to prevent garbage collection of active utterance
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const playTimeoutRef = useRef<number | null>(null);

  // Pre-load voices on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      const handleVoicesChanged = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      };
    }
  }, []);

  const stopMemoPlayback = useCallback(() => {
    if (playTimeoutRef.current !== null) {
      clearTimeout(playTimeoutRef.current);
      playTimeoutRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      activeUtteranceRef.current = null;
      (window as any).__activeVoiceUtterance = null;
    }
    setIsPlayingMemo(false);
  }, []);

  const handleToggleMemo = () => {
    if (isPlayingMemo) {
      stopMemoPlayback();
      return;
    }

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('speechSynthesis not supported on this device.');
      return;
    }

    // Cancel any stale speech and resume if the engine was paused
    window.speechSynthesis.cancel();
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    setIsPlayingMemo(true);

    // Natural speech segments separated by pause points / ellipses
    const segments = [
      "The draft isn't just under the floor. It's pulling from the wardrobe in the corner.",
      "Behind the hanging coats, where the heavy wooden panel meets the back mirror... there's a recessed brass fixture tucked into the dark molding.",
      "If the door ever locks from outside, look where the glass doesn't reflect.",
    ];

    let currentIdx = 0;

    const playNextSegment = () => {
      if (!isPlayingMemoRef.current) return;

      if (currentIdx >= segments.length) {
        playStaticBurst(0.35);
        activeUtteranceRef.current = null;
        (window as any).__activeVoiceUtterance = null;
        setIsPlayingMemo(false);
        return;
      }

      // Pre-segment static noise burst simulating tape corruption
      playStaticBurst(0.24);

      playTimeoutRef.current = window.setTimeout(() => {
        if (!isPlayingMemoRef.current) return;

        // Fetch voices dynamically at playtime
        const availableVoices = window.speechSynthesis.getVoices();
        const preferredVoice =
          availableVoices.find(
            (v) =>
              v.lang.startsWith('en') &&
              (v.name.includes('Natural') ||
                v.name.includes('Google') ||
                v.name.includes('Samantha') ||
                v.name.includes('Daniel') ||
                v.name.includes('English'))
          ) ||
          availableVoices.find((v) => v.lang.startsWith('en')) ||
          availableVoices[0];

        const utterance = new SpeechSynthesisUtterance(segments[currentIdx]);
        utterance.volume = 1.0;
        utterance.rate = 0.88;
        utterance.pitch = 0.92;

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        // Store persistent reference on ref and window to prevent garbage collection
        activeUtteranceRef.current = utterance;
        (window as any).__activeVoiceUtterance = utterance;

        utterance.onstart = () => {
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }
        };

        utterance.onend = () => {
          currentIdx++;
          playTimeoutRef.current = window.setTimeout(() => {
            playNextSegment();
          }, 180);
        };

        utterance.onerror = (event) => {
          console.warn('SpeechSynthesis error:', event);
          activeUtteranceRef.current = null;
          (window as any).__activeVoiceUtterance = null;
          setIsPlayingMemo(false);
        };

        // Resume engine right before speaking in case Chrome iframe suspended it
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }

        window.speechSynthesis.speak(utterance);

        // Verification check: ensure synthesizer actually began or is queued
        setTimeout(() => {
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }
          if (
            !window.speechSynthesis.speaking &&
            !window.speechSynthesis.pending &&
            isPlayingMemoRef.current
          ) {
            console.warn(
              'SpeechSynthesis neither speaking nor pending after speak(). Attempting resume fallback.'
            );
            window.speechSynthesis.resume();
          }
        }, 120);
      }, 160);
    };

    playNextSegment();
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
      className="absolute inset-0 bg-black/85 backdrop-blur-[3px] flex items-center justify-center p-3 sm:p-6 z-50 animate-fadeIn select-none font-mono"
      onClick={onClose}
    >
      {/* Phone Handset Chassis */}
      <div
        className="relative w-full max-w-[340px] bg-[#1a1c1d] border-4 border-[#35393d] rounded-2xl shadow-2xl p-3 sm:p-4 text-[#e0e6e8] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Handset Speaker & Front Sensor */}
        <div className="w-full flex items-center justify-center space-x-3 mb-2">
          <div className="w-2 h-2 rounded-full bg-[#111315] border border-[#262a2d]" />
          <div className="w-12 h-1.5 rounded-full bg-[#111315] border border-[#262a2d]" />
        </div>

        {/* LCD Screen Container */}
        <div className="relative w-full bg-[#0c1214] border-2 border-[#1f282c] rounded-md overflow-hidden min-h-[380px] sm:min-h-[410px] flex flex-col justify-between shadow-inner">
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
          <div className="w-full bg-[#080d0e] border-b border-[#1b262b] px-3 py-1 flex items-center justify-between text-[11px] text-[#78909c] z-20">
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
          <div className="grid grid-cols-3 border-b border-[#1b262b] bg-[#10171a] text-xs z-20">
            <button
              onClick={() => switchTab('messages')}
              className={`py-2 text-center font-bold tracking-wide transition-colors cursor-pointer border-b-2 ${
                activeTab === 'messages'
                  ? 'border-[#4db6ac] text-[#80cbc4] bg-[#152024]'
                  : 'border-transparent text-[#607d8b] hover:text-[#90a4ae]'
              }`}
            >
              💬 MSG
            </button>
            <button
              onClick={() => switchTab('notes')}
              className={`py-2 text-center font-bold tracking-wide transition-colors cursor-pointer border-b-2 ${
                activeTab === 'notes'
                  ? 'border-[#4db6ac] text-[#80cbc4] bg-[#152024]'
                  : 'border-transparent text-[#607d8b] hover:text-[#90a4ae]'
              }`}
            >
              📝 NOTES
            </button>
            <button
              onClick={() => switchTab('audio')}
              className={`py-2 text-center font-bold tracking-wide transition-colors cursor-pointer border-b-2 ${
                activeTab === 'audio'
                  ? 'border-[#4db6ac] text-[#80cbc4] bg-[#152024]'
                  : 'border-transparent text-[#607d8b] hover:text-[#90a4ae]'
              }`}
            >
              🎙 MEMO
            </button>
          </div>

          {/* Tab Content Display */}
          <div className="p-3 overflow-y-auto flex-1 z-10 space-y-2.5 text-xs text-[#b0bec5]">
            {/* 1. Messages Section */}
            {activeTab === 'messages' && (
              <div className="space-y-3">
                <div className="text-center text-[10px] text-[#546e7a] border-b border-[#162125] pb-1">
                  CHAT WITH M. — SMS THREAD
                </div>
                {PHONE_MESSAGES.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.isFromFriend ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 mb-0.5 text-[10px] text-[#546e7a]">
                      <span className="font-semibold text-[#80cbc4]">
                        {msg.sender}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <div
                      className={`max-w-[88%] p-2 rounded-sm text-xs leading-relaxed border ${
                        msg.isFromFriend
                          ? 'bg-[#1b3035] border-[#2c525b] text-[#e0f2f1]'
                          : 'bg-[#172024] border-[#27343a] text-[#cfd8dc]'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 2. Notes Section */}
            {activeTab === 'notes' && (
              <div className="space-y-3">
                <div className="text-center text-[10px] text-[#546e7a] border-b border-[#162125] pb-1">
                  SAVED NOTES (2 ENTRIES)
                </div>
                {PHONE_NOTES.map((note) => (
                  <div
                    key={note.id}
                    className="p-2.5 bg-[#131c20] border border-[#233137] rounded-sm space-y-1.5"
                  >
                    <div className="flex items-center justify-between border-b border-[#1d2a2f] pb-1">
                      <span className="font-bold text-[#80cbc4] text-xs">
                        {note.title}
                      </span>
                      <span className="text-[10px] text-[#607d8b]">
                        {note.date}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-[#b0bec5] whitespace-pre-line">
                      {note.content}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* 3. Audio Memo Section */}
            {activeTab === 'audio' && (
              <div className="space-y-3">
                <div className="text-center text-[10px] text-[#546e7a] border-b border-[#162125] pb-1">
                  VOICE RECORDER — ARCHIVE
                </div>

                <div className="p-3 bg-[#131c20] border border-[#233137] rounded-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#80cbc4] text-xs">
                      {PHONE_AUDIO_MEMO.title}
                    </span>
                    <span className="text-[10px] text-[#e57373] bg-[#3e1b1b] px-1.5 py-0.5 rounded-xs border border-[#7f2626]">
                      CORRUPTED
                    </span>
                  </div>

                  {/* Audio Waveform visualization */}
                  <div className="h-6 bg-[#0a0f12] border border-[#1b262c] rounded-xs flex items-center justify-center space-x-1 px-2">
                    {[4, 12, 18, 8, 22, 14, 6, 20, 16, 10, 24, 8, 14, 4].map(
                      (h, i) => (
                        <div
                          key={i}
                          className={`w-1 transition-all duration-150 ${
                            isPlayingMemo
                              ? 'bg-[#80cbc4] animate-pulse'
                              : 'bg-[#4db6ac] opacity-75'
                          }`}
                          style={{
                            height: isPlayingMemo
                              ? `${Math.max(4, (h * ((i % 3) + 1)) % 24)}px`
                              : `${h}px`,
                          }}
                        />
                      )
                    )}
                  </div>

                  <div className="text-[11px] text-[#78909c] flex justify-between items-center">
                    <span>Duration: {PHONE_AUDIO_MEMO.duration}</span>
                    <span
                      className={
                        isPlayingMemo
                          ? 'text-[#80cbc4] font-semibold animate-pulse'
                          : 'text-[#607d8b]'
                      }
                    >
                      {isPlayingMemo ? '🔊 Transmitting...' : 'Ready to play'}
                    </span>
                  </div>

                  {/* Playback Control Button */}
                  <div className="pt-1">
                    {isPlayingMemo ? (
                      <button
                        onClick={handleToggleMemo}
                        className="w-full py-1.5 px-3 bg-[#3e1b1b] hover:bg-[#542424] border border-[#7f2626] text-[#ff8a80] font-bold rounded-xs flex items-center justify-center space-x-2 cursor-pointer transition-colors shadow-sm"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#ff5252] animate-ping" />
                        <span>■ STOP RECORDING</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleToggleMemo}
                        className="w-full py-1.5 px-3 bg-[#152a2e] hover:bg-[#1f3b41] border border-[#3b7b84] text-[#80cbc4] font-bold rounded-xs flex items-center justify-center space-x-2 cursor-pointer transition-colors shadow-sm active:scale-[0.98]"
                      >
                        <span>▶</span>
                        <span>PLAY CORRUPTED RECORDING</span>
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
          <div className="w-full bg-[#080d0e] border-t border-[#1b262b] px-3 py-1.5 flex items-center justify-between text-[11px] text-[#78909c] z-20">
            <span>[1/2/3] Tabs</span>
            <button
              onClick={onClose}
              className="px-2.5 py-0.5 bg-[#172226] hover:bg-[#25353c] border border-[#2b3c43] text-[#80cbc4] font-bold rounded-xs cursor-pointer text-xs"
            >
              CLOSE [E]
            </button>
          </div>
        </div>

        {/* Physical Home Indicator Bar */}
        <div className="w-16 h-1 bg-[#2e3236] rounded-full mt-2.5" />
      </div>
    </div>
  );
};
