import React, { useEffect, useState } from 'react';
import { playKeyJingleSound } from '../game/audio/minimalAudio';

interface Room214KeypadModalProps {
  onSuccess: () => void;
  onClose: () => void;
}

export const Room214KeypadModal: React.FC<Room214KeypadModalProps> = ({
  onSuccess,
  onClose,
}) => {
  const [digits, setDigits] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);

  const CORRECT_CODE = '8412';

  const handleDigit = (digit: string) => {
    if (error || isUnlocked) return;
    if (digits.length < 4) {
      const next = digits + digit;
      setDigits(next);
      if (next.length === 4) {
        verifyCode(next);
      }
    }
  };

  const handleDelete = () => {
    if (error || isUnlocked) return;
    setDigits((prev) => prev.slice(0, -1));
  };

  const verifyCode = (code: string) => {
    if (code === CORRECT_CODE) {
      setIsUnlocked(true);
      playKeyJingleSound();
      setTimeout(() => {
        onSuccess();
      }, 700);
    } else {
      setError(true);
      setTimeout(() => {
        setDigits('');
        setError(false);
      }, 850);
    }
  };

  // Keyboard support for typing digits
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.code === 'Backspace') {
        e.preventDefault();
        handleDelete();
        return;
      }

      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        handleDigit(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [digits, error, isUnlocked]);

  return (
    <div
      className="absolute inset-0 bg-black/85 backdrop-blur-[2px] flex items-center justify-center p-2 sm:p-5 z-50 animate-fadeIn select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xs max-h-[95vh] bg-[#191512] border-4 border-[#3a2f24] shadow-2xl p-3 sm:p-5 text-[#d8c8b0] font-mono rounded-xs flex flex-col items-center overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="w-full flex items-center justify-between border-b border-[#443527] pb-2 mb-2">
          <div className="flex items-center space-x-1.5 text-xs text-[#d4aa50]">
            <span>🔒</span>
            <span className="font-bold tracking-wider">DOOR 214 PADLOCK</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Keypad"
            className="min-h-[36px] min-w-[36px] text-xs px-2 py-1 border border-[#4a3a2b] text-[#9c8973] hover:text-[#d8c8b0] hover:bg-[#2a2016] transition-colors cursor-pointer flex items-center justify-center active:scale-95"
          >
            ✕
          </button>
        </div>

        {/* Padlock Shackle Visual */}
        <div className="w-14 sm:w-16 h-7 sm:h-9 border-4 border-[#524436] rounded-t-full mb-1 border-b-0" />

        {/* Padlock Body / Digits Display */}
        <div
          className={`w-full bg-[#292019] border-2 ${
            error
              ? 'border-[#a83232] bg-[#331717]'
              : isUnlocked
              ? 'border-[#43a047] bg-[#1a2d1a]'
              : 'border-[#5e4b38]'
          } p-2.5 rounded-xs flex flex-col items-center shadow-inner transition-colors duration-200`}
        >
          <div className="flex space-x-2 my-1">
            {[0, 1, 2, 3].map((index) => {
              const char = digits[index];
              return (
                <div
                  key={index}
                  className="w-10 h-12 bg-[#120e0b] border border-[#524131] flex items-center justify-center text-xl font-bold text-[#e6d5be] shadow-inner"
                >
                  {char || '-'}
                </div>
              );
            })}
          </div>

          <p className="text-[10px] text-[#8a7663] mt-1 tracking-wide font-semibold">
            {error
              ? 'INCORRECT COMBINATION'
              : isUnlocked
              ? 'PADLOCK UNLOCKED'
              : 'ENTER 4-DIGIT CODE'}
          </p>
        </div>

        {/* Numeric Keypad Buttons (min 48px height touch targets) */}
        <div className="grid grid-cols-3 gap-2 mt-3 w-full">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleDigit(num)}
              disabled={error || isUnlocked}
              className="min-h-[48px] bg-[#251e18] hover:bg-[#3d3126] active:bg-[#1a140f] border border-[#4f3d2f] text-base font-bold text-[#e0cfba] rounded-xs shadow transition-all cursor-pointer disabled:opacity-50 active:scale-95 flex items-center justify-center"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={handleDelete}
            disabled={error || isUnlocked || digits.length === 0}
            className="min-h-[48px] bg-[#201813] hover:bg-[#33241b] active:bg-[#140e0a] border border-[#443224] text-xs font-bold text-[#a68c72] rounded-xs shadow transition-all cursor-pointer disabled:opacity-40 active:scale-95 flex items-center justify-center"
          >
            DEL
          </button>
          <button
            type="button"
            onClick={() => handleDigit('0')}
            disabled={error || isUnlocked}
            className="min-h-[48px] bg-[#251e18] hover:bg-[#3d3126] active:bg-[#1a140f] border border-[#4f3d2f] text-base font-bold text-[#e0cfba] rounded-xs shadow transition-all cursor-pointer disabled:opacity-50 active:scale-95 flex items-center justify-center"
          >
            0
          </button>
          <button
            type="button"
            onClick={() => {
              if (digits.length === 4) verifyCode(digits);
            }}
            disabled={error || isUnlocked || digits.length < 4}
            className="min-h-[48px] bg-[#3a2d1d] hover:bg-[#52402b] active:bg-[#251c11] border border-[#7a5e3a] text-xs font-bold text-[#d4aa50] rounded-xs shadow transition-all cursor-pointer disabled:opacity-40 active:scale-95 flex items-center justify-center"
          >
            ENTER
          </button>
        </div>

        <p className="text-[10px] text-[#635343] mt-2.5 text-center">
          Tap keypad numbers or type on keyboard
        </p>
      </div>
    </div>
  );
};
