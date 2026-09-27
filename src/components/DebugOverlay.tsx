import React from 'react';
import { GameState, InteractableObject } from '../types/game';

interface DebugOverlayProps {
  gameState: GameState;
  activeInteractable: InteractableObject | null;
  fps: number;
  isOpen: boolean;
  onToggle: () => void;
}

export const DebugOverlay: React.FC<DebugOverlayProps> = ({
  gameState,
  activeInteractable,
  fps,
  isOpen,
  onToggle,
}) => {
  return (
    <div className="absolute top-2 left-2 z-30 font-mono text-[11px] select-none">
      <button
        type="button"
        onClick={onToggle}
        className="min-h-[36px] px-2.5 py-1 bg-black/80 hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100 border border-zinc-700 rounded text-[11px] cursor-pointer shadow-md flex items-center space-x-1 active:scale-95"
        title="Toggle Debug View (~)"
      >
        <span>🛠️</span>
        <span>{isOpen ? 'Hide Debug [~]' : 'Debug [~]'}</span>
      </button>

      {isOpen && (
        <div className="mt-1.5 p-2.5 bg-black/95 border border-zinc-700 text-zinc-300 rounded shadow-2xl max-w-xs max-h-[60vh] overflow-y-auto space-y-1">
          <div className="text-amber-400 font-semibold border-b border-zinc-800 pb-1 flex justify-between">
            <span>ENGINE DEBUG</span>
            <span className="text-zinc-400">{fps} FPS</span>
          </div>
          <div>
            <span className="text-zinc-500">Room:</span> {gameState.currentRoom}
          </div>
          <div>
            <span className="text-zinc-500">Pos:</span>{' '}
            {gameState.player.position.x.toFixed(1)}, {gameState.player.position.y.toFixed(1)}
          </div>
          <div>
            <span className="text-zinc-500">Direction:</span> {gameState.player.direction}
          </div>
          <div>
            <span className="text-zinc-500">Moving:</span> {gameState.player.isMoving ? 'true' : 'false'}
          </div>
          <div>
            <span className="text-zinc-500">Target:</span>{' '}
            {activeInteractable ? (
              <span className="text-amber-300">{activeInteractable.name} ({activeInteractable.id})</span>
            ) : (
              <span className="text-zinc-600">None</span>
            )}
          </div>
          <div>
            <span className="text-zinc-500">Act:</span> {gameState.currentAct} | Clues: {gameState.discoveredClues.length}
          </div>
        </div>
      )}
    </div>
  );
};
