import React, { useEffect, useRef, useState, useCallback } from 'react';
import { VIRTUAL_HEIGHT, VIRTUAL_WIDTH } from '../game/constants';
import { findNearestInteractable, resolveMovement } from '../game/collision';
import { renderGame } from '../game/engine/renderer';
import { getRoom } from '../game/rooms';
import { createInitialGameState } from '../game/state/gameState';
import { Direction, GameState, InteractableObject } from '../types/game';
import {
  playCreakSound,
  playScratchSound,
  playThudSound,
  playPhoneVibrateSound,
  playPhoneRingChimeSound,
  playStaticWhisperSound,
  playPhonePowerOnSound,
  playKeyJingleSound,
  playShadowDroneSound,
  playFootstepSound,
  playHarshPhoneRingSound,
  playBasementWhisperScratchSound,
  ensureAmbientDroneBed,
  duckAmbientDroneBed,
  updateBackyardProximityAudio,
  stopBackyardProximityAudio,
  startWindowRainSound,
  resumeAudioContext,
  startApproachingHeartbeatSound,
  stopApproachingHeartbeatSound,
  ApproachingHeartbeatController,
} from '../game/audio/minimalAudio';
import { DebugOverlay } from './DebugOverlay';
import { DiaryViewer } from './DiaryViewer';
import { PhoneViewer } from './PhoneViewer';
import { RegisterViewer } from './RegisterViewer';
import { Room214KeypadModal } from './Room214KeypadModal';
import { OpeningSequence } from './OpeningSequence';
import { EndingSequence } from './EndingSequence';
import { TouchControls } from './TouchControls';
import { VisualInspectionView } from './VisualInspectionView';

export const GameCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Centralized Game State
  const [gameState, setGameState] = useState<GameState>(createInitialGameState);
  const gameStateRef = useRef<GameState>(gameState);
  gameStateRef.current = gameState;

  // Active interactable in reach
  const [activeInteractable, setActiveInteractable] = useState<InteractableObject | null>(null);
  const activeInteractableRef = useRef<InteractableObject | null>(null);
  activeInteractableRef.current = activeInteractable;

  // Currently inspected object modal
  const [inspectedObject, setInspectedObject] = useState<InteractableObject | null>(null);
  const inspectedObjectRef = useRef<InteractableObject | null>(null);
  inspectedObjectRef.current = inspectedObject;

  // Dedicated Diary Viewer open state
  const [isDiaryOpen, setIsDiaryOpen] = useState(false);
  const isDiaryOpenRef = useRef(isDiaryOpen);
  isDiaryOpenRef.current = isDiaryOpen;

  // Dedicated Phone Viewer open state
  const [isPhoneOpen, setIsPhoneOpen] = useState(false);
  const isPhoneOpenRef = useRef(isPhoneOpen);
  isPhoneOpenRef.current = isPhoneOpen;

  // Dedicated Register Viewer open state
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const isRegisterOpenRef = useRef(isRegisterOpen);
  isRegisterOpenRef.current = isRegisterOpen;

  // Dedicated Room 214 Keypad Modal state
  const [isKeypadOpen, setIsKeypadOpen] = useState(false);
  const isKeypadOpenRef = useRef(isKeypadOpen);
  isKeypadOpenRef.current = isKeypadOpen;

  // Ephemeral Shadow Figure reference in the basement or backyard
  const shadowFigureRef = useRef<{
    active: boolean;
    alpha: number;
    x: number;
    y: number;
    timer: number;
    revealFace?: boolean;
  } | null>(null);

  // Dedicated heartbeat sound controller reference for the final ending approach
  const heartbeatRef = useRef<ApproachingHeartbeatController | null>(null);

  // Ending sequence Shadow Figure approach animation tracking
  const endingApproachRef = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    targetX: number;
    targetY: number;
    startTime: number;
    duration: number;
  } | null>(null);

  // Backyard rain sound stop callback reference
  const backyardRainStopRef = useRef<(() => void) | null>(null);

  // Debug overlay visibility & FPS
  const [showDebug, setShowDebug] = useState(false);
  const [fps, setFps] = useState(60);

  // Touch virtual direction input
  const touchDirectionRef = useRef<Direction | null>(null);

  // Detect whether device supports touch (mobile phones, tablets, touchscreens)
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      Boolean(window.matchMedia && window.matchMedia('(pointer: coarse)').matches)
    );
  });

  useEffect(() => {
    const handleTouchDetected = () => {
      setIsTouchDevice(true);
    };
    window.addEventListener('touchstart', handleTouchDetected, { passive: true, once: true });
    return () => window.removeEventListener('touchstart', handleTouchDetected);
  }, []);

  // Compute concise action label for mobile/touch action button
  const getActionLabel = (item: InteractableObject | null, isInspecting: boolean): string => {
    if (isInspecting) return 'CLOSE';
    if (!item) return 'INTERACT';
    const p = item.prompt.trim().toUpperCase();
    if (p.includes('ENTER')) return 'ENTER';
    if (p.includes('OPEN')) return 'OPEN';
    if (p.includes('READ')) return 'READ';
    if (p.includes('INSPECT')) return 'INSPECT';
    if (p.includes('EXAMINE')) return 'EXAMINE';
    if (p.includes('LOOK')) return 'LOOK';
    if (p.includes('VIEW')) return 'VIEW';
    if (p.includes('CHECK')) return 'CHECK';
    if (p.includes('PUSH')) return 'EXIT';
    if (p.includes('TAKE')) return 'TAKE';
    if (p.includes('POWER')) return 'ON';
    return 'INTERACT';
  };

  // Input keys tracking
  const keysRef = useRef<{
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
    interact: boolean;
  }>({
    up: false,
    down: false,
    left: false,
    right: false,
    interact: false,
  });

  // Handle interact action
  const triggerInteraction = useCallback(() => {
    // If dialog is open, pressing interact closes it
    if (inspectedObjectRef.current) {
      handleCloseInspection();
      return;
    }

    const target = activeInteractableRef.current;
    if (target) {
      // Special handler for Friend's Diary: add to inventory & open DiaryViewer
      if (target.id === 'diary') {
        const curInv = gameStateRef.current.inventory;
        const newInv = curInv.includes('diary') ? curInv : [...curInv, 'diary'];
        const nextState: GameState = {
          ...gameStateRef.current,
          inventory: newInv,
          storyFlags: {
            ...gameStateRef.current.storyFlags,
            diaryDiscovered: true,
          },
        };
        gameStateRef.current = nextState;
        setGameState(nextState);
        setIsDiaryOpen(true);
        return;
      }

      // Special handler for Hidden Baseboard Seam discovery
      if (target.id === 'hidden_seam') {
        const nextFlags = {
          ...gameStateRef.current.storyFlags,
          hiddenLocationFound: true,
        };
        const nextState: GameState = {
          ...gameStateRef.current,
          storyFlags: nextFlags,
        };
        gameStateRef.current = nextState;
        setGameState(nextState);

        setInspectedObject({
          id: 'hidden_seam_discovery',
          name: 'Floorboard Seam',
          rect: target.rect,
          prompt: 'Examine',
          inspectTitle: 'Wall & Floorboard Seam',
          visualType: 'seam',
          inspectText:
            'You press your fingers against the low baseboard seam beside the writing desk.\n\nThe loose timber creaks—and shifts outward with a sharp wooden snap.',
        });
        return;
      }

      // Special handler for Friend's Phone discovery
      if (target.id === 'hidden_phone') {
        const curInv = gameStateRef.current.inventory;
        const newInv = curInv.includes('phone') ? curInv : [...curInv, 'phone'];
        const nextFlags = {
          ...gameStateRef.current.storyFlags,
          phoneFound: true,
        };
        const nextState: GameState = {
          ...gameStateRef.current,
          inventory: newInv,
          storyFlags: nextFlags,
        };
        gameStateRef.current = nextState;
        setGameState(nextState);

        setInspectedObject({
          id: 'phone_pickup',
          name: "Friend's Phone",
          rect: target.rect,
          prompt: 'Power On',
          inspectTitle: "Friend's Phone",
          visualType: 'phone',
          inspectText:
            "Tucked inside the dark cavity between the wall studs lies your friend's phone.\n\nThe glass screen is spiderwebbed with cracks, completely dark and cold to the touch.\n\nA faint red LED flickers once with a 3% battery warning.",
        });
        return;
      }

      // Special handler for Wardrobe Mirror & Final Brass Key discovery
      if (
        target.id === 'wardrobe' &&
        gameStateRef.current.storyFlags.phoneUnlocked &&
        !gameStateRef.current.storyFlags.finalKeyFound
      ) {
        playKeyJingleSound();
        const curInv = gameStateRef.current.inventory;
        const newInv = curInv.includes('brass_key') ? curInv : [...curInv, 'brass_key'];
        const nextFlags = {
          ...gameStateRef.current.storyFlags,
          finalKeyFound: true,
        };
        const nextState: GameState = {
          ...gameStateRef.current,
          inventory: newInv,
          storyFlags: nextFlags,
        };
        gameStateRef.current = nextState;
        setGameState(nextState);

        setInspectedObject({
          id: 'wardrobe_mirror_key',
          name: 'Recessed Brass Fixture',
          rect: target.rect,
          prompt: 'Take Key',
          inspectTitle: 'Recessed Brass Fixture',
          visualType: 'key',
          inspectText:
            "You peer past the hanging coats into the tall interior mirror. Something is wrong with the glass—it does not reflect the room properly. Your reflection lags by half a second, staring into an impossible dark void.\n\nAlong the dark side molding where the glass meets the paneling, you feel a concealed spring catch. A small recessed brass fixture clicks forward, revealing an old brass key tucked inside.\n\nYou take the Brass Key.",
        });
        return;
      }

      // Special handler for the Iron-Banded Box in the Basement
      if (target.id === 'locked_box') {
        const hasKey =
          gameStateRef.current.storyFlags.finalKeyFound ||
          gameStateRef.current.inventory.includes('brass_key');

        if (hasKey && !gameStateRef.current.storyFlags.boxUnlocked) {
          playKeyJingleSound();
          const nextFlags = {
            ...gameStateRef.current.storyFlags,
            boxUnlocked: true,
          };
          const nextState: GameState = {
            ...gameStateRef.current,
            storyFlags: nextFlags,
          };
          gameStateRef.current = nextState;
          setGameState(nextState);

          setInspectedObject({
            id: 'box_opened',
            name: 'Iron-Banded Box',
            rect: target.rect,
            prompt: 'Examine Inside',
            inspectTitle: 'Iron-Banded Box (Open)',
            visualType: 'box',
            inspectText:
              'You insert the small brass key into the lock on the iron-banded box. With a heavy, satisfying clunk, the latch springs open.\n\nThe lid lifts back on creaking hinges. Inside, resting in the shadows, lies something wrapped carefully in aged oilcloth...',
          });
          return;
        } else if (gameStateRef.current.storyFlags.boxUnlocked) {
          if (!gameStateRef.current.storyFlags.boxContentsRevealed) {
            const nextFlags = {
              ...gameStateRef.current.storyFlags,
              boxContentsRevealed: true,
            };
            const nextState: GameState = {
              ...gameStateRef.current,
              storyFlags: nextFlags,
            };
            gameStateRef.current = nextState;
            setGameState(nextState);

            setInspectedObject({
              id: 'parcel_inspection',
              name: 'Unwrapped Oilcloth Parcel',
              rect: target.rect,
              prompt: 'Take In Evidence',
              inspectTitle: 'Archive Evidence',
              visualType: 'parcel_contents',
              inspectText:
                "You untie the weathered twine and fold back the heavy waxed oilcloth.\n\nInside rests a 1983 photograph of Room 217, a torn ledger page marked 'FL.2 / UNRECORDED', and an old hostel luggage tag inscribed in familiar handwriting: 'HOLD FOR: NEO'.",
            });
            return;
          } else {
            setInspectedObject({
              id: 'parcel_reinspect',
              name: 'Archived Evidence',
              rect: target.rect,
              prompt: 'Review Evidence',
              inspectTitle: 'Archived Evidence',
              visualType: 'parcel_contents',
              inspectText:
                "Archival photograph from October 1983, a torn page from the hostel register stamped 'FL.2 / UNRECORDED', and an emergency tag inscribed in familiar handwriting: 'HOLD FOR: NEO'.",
            });
            return;
          }
        }
      }

      // Special handler for Notice Board & Floor Logbook
      if (target.id === 'notice_board') {
        const nextFlags = {
          ...gameStateRef.current.storyFlags,
          registerCodeFound: true,
        };
        const nextState: GameState = {
          ...gameStateRef.current,
          storyFlags: nextFlags,
        };
        gameStateRef.current = nextState;
        setGameState(nextState);
        setIsRegisterOpen(true);
        return;
      }

      // Special handler for Door 214 combination lock
      if (target.id === 'door_214' && !gameStateRef.current.storyFlags.room214Unlocked) {
        setIsKeypadOpen(true);
        return;
      }

      // Structure interaction in the Backyard:
      // Player clicks "VIEW WELL" -> First Blackout -> Shadow Figure approaches from corridor with accelerating heartbeat -> Second Blackout -> Green Snake Eyes -> Ending / Poem
      if (target.id === 'backyard_well') {
        if (
          gameStateRef.current.storyFlags.shadowFigureSeen ||
          gameStateRef.current.storyFlags.endingTriggered ||
          gameStateRef.current.storyFlags.blackoutActive ||
          endingApproachRef.current?.active
        ) {
          return;
        }

        // Stop proximity audio and rain audio immediately
        stopBackyardProximityAudio();
        if (backyardRainStopRef.current) {
          backyardRainStopRef.current();
          backyardRainStopRef.current = null;
        }
        duckAmbientDroneBed(true);
        setActiveInteractable(null);

        // Turn player to face left towards the corridor path
        const p = gameStateRef.current.player;
        p.direction = 'left';

        // 1. First Blackout immediately on clicking "VIEW WELL"
        playShadowDroneSound();
        const nextFlags = {
          ...gameStateRef.current.storyFlags,
          blackoutActive: true,
        };
        const nextState: GameState = {
          ...gameStateRef.current,
          player: { ...p, direction: 'left', isMoving: false },
          storyFlags: nextFlags,
        };
        gameStateRef.current = nextState;
        setGameState(nextState);

        // 2. Blackout lasts ~2.0s to hide transition into Shadow Figure approach
        setTimeout(() => {
          // When first blackout lifts:
          // The screen returns to the dark courtyard.
          // Shadow Figure appears in the distance near the corridor door on the left wall (x: 34, y: 124)
          const startX = 34;
          const startY = 124;
          const curPlayerPos = gameStateRef.current.player.position;
          const targetX = Math.max(startX + 30, curPlayerPos.x - 30);
          const targetY = curPlayerPos.y;

          shadowFigureRef.current = {
            active: true,
            alpha: 1.0,
            x: startX,
            y: startY,
            timer: 0,
            revealFace: false, // Starts completely faceless
          };

          // Lift first blackout
          setGameState((curr) => ({
            ...curr,
            storyFlags: {
              ...curr.storyFlags,
              blackoutActive: false,
            },
          }));
          gameStateRef.current.storyFlags.blackoutActive = false;

          // Start Heartbeat audio quietly in the background
          const hbController = startApproachingHeartbeatSound();
          heartbeatRef.current = hbController;

          // Configure slightly faster approach toward player over 4.4s (moderately faster, still deliberate & suspenseful)
          endingApproachRef.current = {
            active: true,
            startX,
            startY,
            targetX,
            targetY,
            startTime: performance.now(),
            duration: 4400,
          };
        }, 2000);

        return;
      }

      // Execute any custom interaction hook and update game state
      if (target.onInteract) {
        const updates = target.onInteract(gameStateRef.current);
        if (updates) {
          const nextState: GameState = { ...gameStateRef.current, ...updates };
          gameStateRef.current = nextState;
          setGameState(nextState);

          // If Room transition occurred (e.g. exit Room 217 back into corridor)
          if (updates.currentRoom) {
            playCreakSound();
            setActiveInteractable(null);
            if (!updates.storyFlags?.pendingRoom217Intro) {
              return;
            }
          }

          // If Room 217 entry occurred, show the introductory lock message immediately
          if (updates.storyFlags?.pendingRoom217Intro) {
            setActiveInteractable(null);
            setInspectedObject({
              id: 'room217_intro_message',
              name: 'Room 217',
              rect: { x: 0, y: 0, width: 0, height: 0 },
              prompt: 'Continue',
              inspectTitle: 'ROOM 217',
              visualType: 'door',
              inspectText:
                'The heavy door clicks shut behind you. The bolt snaps into place—locked from the outside.\n\nYour friend has been missing for several days, but their belongings are still here.\n\nFind out what happened.',
            });
            return;
          }
        }
      }

      setInspectedObject(target);
    }
  }, []);

  const handleCloseInspection = () => {
    resumeAudioContext();
    touchDirectionRef.current = null;
    const closedObject = inspectedObjectRef.current;
    setInspectedObject(null);

    const prevFlags = gameStateRef.current.storyFlags;
    const nextFlags = { ...prevFlags };

    if (prevFlags.pendingRoom217Intro) {
      nextFlags.pendingRoom217Intro = false;
    }

    // Track inspected Room 217 objects for the First Blackout trigger
    const room217Items = ['bed', 'nightstand', 'desk', 'wardrobe', 'window'];
    if (
      gameStateRef.current.currentRoom === 'room217' &&
      closedObject &&
      room217Items.includes(closedObject.id)
    ) {
      const existing = new Set<string>(prevFlags.inspectedRoom217Objects || []);
      existing.add(closedObject.id);
      const updatedInspected = Array.from(existing);
      nextFlags.inspectedRoom217Objects = updatedInspected;

      // Trigger First Blackout Event if at least 3 distinct objects inspected and not yet triggered
      if (updatedInspected.length >= 3 && !prevFlags.firstBlackoutTriggered) {
        nextFlags.firstBlackoutTriggered = true;
        nextFlags.blackoutActive = true;

        // Ambient sound cues in darkness
        setTimeout(() => {
          playCreakSound();
        }, 600);

        setTimeout(() => {
          playScratchSound();
        }, 1800);

        setTimeout(() => {
          playThudSound();
        }, 2700);

        // After 3.2s, lights return with the chair persistently moved
        setTimeout(() => {
          setGameState((current) => {
            const resolvedState: GameState = {
              ...current,
              storyFlags: {
                ...current.storyFlags,
                blackoutActive: false,
                chairMoved: true,
                firstBlackoutCompleted: true,
              },
            };
            gameStateRef.current = resolvedState;
            return resolvedState;
          });
        }, 3200);
      }
    }

    // Trigger Second Blackout Event upon examining the hidden baseboard seam
    if (
      (closedObject?.id === 'hidden_seam_discovery' || closedObject?.id === 'hidden_seam') &&
      !prevFlags.secondBlackoutTriggered
    ) {
      nextFlags.secondBlackoutTriggered = true;
      nextFlags.blackoutActive = true;

      // Phone-evocative sound cues during darkness:
      // 1. Initial double phone vibration buzz against wood (500ms)
      setTimeout(() => {
        playPhoneVibrateSound();
      }, 500);

      // 2. Faint electronic ring chime & whispering static (1400ms)
      setTimeout(() => {
        playPhoneRingChimeSound();
        playStaticWhisperSound();
      }, 1400);

      // 3. Second double phone vibration buzz (2300ms)
      setTimeout(() => {
        playPhoneVibrateSound();
      }, 2300);

      // After 3.2s, lights return with the hollow cavity exposed
      setTimeout(() => {
        let shouldRing = false;
        setGameState((current) => {
          if (!current.storyFlags.phoneRung) {
            shouldRing = true;
          }
          const resolvedState: GameState = {
            ...current,
            storyFlags: {
              ...current.storyFlags,
              blackoutActive: false,
              hiddenCavityOpen: true,
              secondBlackoutCompleted: true,
              phoneRung: true,
            },
          };
          gameStateRef.current = resolvedState;
          return resolvedState;
        });

        // The sudden, loud phone ring bursts the moment the phone is revealed in the cavity
        if (shouldRing) {
          // Keep ambient drone ducked through the entire ring so it rings out in pure silence
          duckAmbientDroneBed(true);
          setTimeout(() => {
            playHarshPhoneRingSound();
          }, 140);
          setTimeout(() => {
            duckAmbientDroneBed(false);
          }, 1850);
        }
      }, 3200);
    }

    // Trigger Phone Unlock Beat upon closing the phone pickup inspection
    if (closedObject?.id === 'phone_pickup') {
      playPhonePowerOnSound();
      nextFlags.phoneUnlocked = true;
      setIsPhoneOpen(true);
    }

    // Trigger Whispering & Scratching upon closing the unwrapped parcel inspection (sound-only, no visual entity)
    if (
      (closedObject?.id === 'parcel_inspection' ||
       closedObject?.visualType === 'parcel_contents' ||
       closedObject?.id === 'parcel_reinspect') &&
      !prevFlags.parcelWhisperPlayed
    ) {
      console.log('[Audio] Triggering playBasementWhisperScratchSound; parcelWhisperPlayed =', prevFlags.parcelWhisperPlayed);
      resumeAudioContext();
      playBasementWhisperScratchSound();
      nextFlags.parcelWhisperPlayed = true;
    }

    // When collecting the Key to Room 217 in Room 214
    if (closedObject?.id === 'key_to_217') {
      playKeyJingleSound();
      nextFlags.room217KeyFound = true;
      const currentInv = [...gameStateRef.current.inventory];
      if (!currentInv.includes('key_room_217')) {
        currentInv.push('key_room_217');
      }
      const nextState: GameState = {
        ...gameStateRef.current,
        storyFlags: nextFlags,
        inventory: currentInv,
      };
      gameStateRef.current = nextState;
      setGameState(nextState);
      return;
    }

    const nextState: GameState = {
      ...gameStateRef.current,
      storyFlags: nextFlags,
    };
    gameStateRef.current = nextState;
    setGameState(nextState);
  };

  const handleKeypadSuccess = () => {
    setIsKeypadOpen(false);
    const nextFlags = {
      ...gameStateRef.current.storyFlags,
      room214Unlocked: true,
    };
    const nextState: GameState = {
      ...gameStateRef.current,
      storyFlags: nextFlags,
    };
    gameStateRef.current = nextState;
    setGameState(nextState);

    // Show unlocked confirmation modal
    setInspectedObject({
      id: 'door214_unlocked_dialog',
      name: 'Door 214',
      rect: { x: 44, y: 64, width: 28, height: 26 },
      prompt: 'Enter Room 214',
      inspectTitle: 'Padlock Released',
      visualType: 'door',
      inspectText:
        'The brass combination padlock clicks and springs open. The door latch is released, swinging slightly ajar into the cold, abandoned room.',
    });
  };

  const handleOpeningComplete = () => {
    ensureAmbientDroneBed();
    const nextState: GameState = {
      ...gameStateRef.current,
      storyFlags: {
        ...gameStateRef.current.storyFlags,
        openingActive: false,
      },
    };
    gameStateRef.current = nextState;
    setGameState(nextState);
  };

  const handleRestart = () => {
    stopBackyardProximityAudio();
    stopApproachingHeartbeatSound();
    if (heartbeatRef.current) {
      heartbeatRef.current.stop();
      heartbeatRef.current = null;
    }
    endingApproachRef.current = null;
    if (backyardRainStopRef.current) {
      backyardRainStopRef.current();
      backyardRainStopRef.current = null;
    }
    const initialState = createInitialGameState();
    gameStateRef.current = initialState;
    setGameState(initialState);
    setInspectedObject(null);
    setIsDiaryOpen(false);
    setIsPhoneOpen(false);
    setIsRegisterOpen(false);
    setIsKeypadOpen(false);
    shadowFigureRef.current = null;
    duckAmbientDroneBed(false);
  };

  // Start continuous ambient drone bed on first user interaction
  useEffect(() => {
    const handleFirstUserGesture = () => {
      ensureAmbientDroneBed();
    };

    window.addEventListener('keydown', handleFirstUserGesture, { once: true });
    window.addEventListener('pointerdown', handleFirstUserGesture, { once: true });

    return () => {
      window.removeEventListener('keydown', handleFirstUserGesture);
      window.removeEventListener('pointerdown', handleFirstUserGesture);
    };
  }, []);

  // Backyard Ambient Rain Sound
  useEffect(() => {
    const isBackyard = gameState.currentRoom === 'backyard';
    const isMuted =
      gameState.storyFlags.blackoutActive ||
      gameState.storyFlags.endingTriggered;

    if (isBackyard && !isMuted) {
      if (!backyardRainStopRef.current) {
        backyardRainStopRef.current = startWindowRainSound(false);
      }
    } else {
      if (backyardRainStopRef.current) {
        backyardRainStopRef.current();
        backyardRainStopRef.current = null;
      }
      stopBackyardProximityAudio();
    }

    return () => {
      if (backyardRainStopRef.current) {
        backyardRainStopRef.current();
        backyardRainStopRef.current = null;
      }
      stopBackyardProximityAudio();
    };
  }, [
    gameState.currentRoom,
    gameState.storyFlags.blackoutActive,
    gameState.storyFlags.endingTriggered,
  ]);

  // Duck ambient drone bed during full blackout events or ending sequence
  useEffect(() => {
    const isDucked =
      gameState.storyFlags.blackoutActive ||
      gameState.storyFlags.endingTriggered;
    duckAmbientDroneBed(isDucked);
  }, [
    gameState.storyFlags.blackoutActive,
    gameState.storyFlags.endingTriggered,
  ]);

  // Keyboard event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle debug mode with backquote (~) or F1
      if (e.code === 'Backquote' || e.code === 'F1') {
        e.preventDefault();
        setShowDebug((prev) => !prev);
        return;
      }

      // If opening sequence, ending sequence, inspecting, diary open, phone open, register open, keypad open, shadow face close up, or blackout is active, lock input
      if (
        gameStateRef.current.storyFlags.openingActive ||
        gameStateRef.current.storyFlags.blackoutActive ||
        gameStateRef.current.storyFlags.endingTriggered ||
        isDiaryOpenRef.current ||
        isPhoneOpenRef.current ||
        isRegisterOpenRef.current ||
        isKeypadOpenRef.current ||
        inspectedObjectRef.current !== null
      ) {
        return;
      }

      // Toggle Friend's Diary with 'J' if discovered
      if (e.code === 'KeyJ') {
        if (gameStateRef.current.storyFlags.diaryDiscovered) {
          e.preventDefault();
          setIsDiaryOpen((prev) => !prev);
          return;
        }
      }

      // Toggle Friend's Phone with 'P' if unlocked
      if (e.code === 'KeyP') {
        if (gameStateRef.current.storyFlags.phoneUnlocked) {
          e.preventDefault();
          setIsPhoneOpen((prev) => !prev);
          return;
        }
      }

      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keysRef.current.up = true;
          e.preventDefault();
          break;
        case 'KeyS':
        case 'ArrowDown':
          keysRef.current.down = true;
          e.preventDefault();
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keysRef.current.left = true;
          e.preventDefault();
          break;
        case 'KeyD':
        case 'ArrowRight':
          keysRef.current.right = true;
          e.preventDefault();
          break;
        case 'KeyE':
        case 'Space':
        case 'Enter':
          e.preventDefault();
          triggerInteraction();
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keysRef.current.up = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keysRef.current.down = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keysRef.current.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keysRef.current.right = false;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [triggerInteraction]);

  // Main 60FPS Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();
    let frameCount = 0;
    let lastFpsUpdate = performance.now();
    let walkStepTimer = 0;
    let walkFrame = 0;
    let footstepTimer = 0.28; // primed for prompt first step on move

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1); // cap dt at 100ms
      lastTime = currentTime;

      // Track FPS
      frameCount++;
      if (currentTime - lastFpsUpdate >= 500) {
        setFps(Math.round((frameCount * 1000) / (currentTime - lastFpsUpdate)));
        frameCount = 0;
        lastFpsUpdate = currentTime;
      }

      const currentState = gameStateRef.current;
      const currentRoom = getRoom(currentState.currentRoom, currentState.storyFlags);
      const isInputPaused =
        currentState.storyFlags.openingActive ||
        currentState.storyFlags.blackoutActive ||
        currentState.storyFlags.endingTriggered ||
        Boolean(endingApproachRef.current?.active) ||
        isDiaryOpenRef.current ||
        isPhoneOpenRef.current ||
        isRegisterOpenRef.current ||
        isKeypadOpenRef.current ||
        inspectedObjectRef.current !== null;

      // Calculate directional vector
      let moveX = 0;
      let moveY = 0;

      if (!isInputPaused) {
        if (keysRef.current.left || touchDirectionRef.current === 'left') moveX -= 1;
        if (keysRef.current.right || touchDirectionRef.current === 'right') moveX += 1;
        if (keysRef.current.up || touchDirectionRef.current === 'up') moveY -= 1;
        if (keysRef.current.down || touchDirectionRef.current === 'down') moveY += 1;
      }

      const isMoving = moveX !== 0 || moveY !== 0;

      // Determine facing direction
      let newDirection = currentState.player.direction;
      if (moveY < 0) newDirection = 'up';
      else if (moveY > 0) newDirection = 'down';
      else if (moveX < 0) newDirection = 'left';
      else if (moveX > 0) newDirection = 'right';

      let newPosition = { ...currentState.player.position };

      if (isMoving) {
        // Normalize diagonal speed
        let speedX = moveX;
        let speedY = moveY;
        if (moveX !== 0 && moveY !== 0) {
          const invSqrt2 = 0.70710678;
          speedX *= invSqrt2;
          speedY *= invSqrt2;
        }

        const deltaDistance = currentState.player.speed * dt;
        const deltaX = speedX * deltaDistance;
        const deltaY = speedY * deltaDistance;

        // Resolve collision against room obstacles & walls
        newPosition = resolveMovement(
          currentState.player.position,
          deltaX,
          deltaY,
          currentRoom
        );

        // Footstep audio cadence
        footstepTimer += dt;
        if (footstepTimer >= 0.34) {
          footstepTimer = 0;
          const isSecondPair =
            currentState.currentRoom === 'room217' &&
            Boolean(currentState.storyFlags.chairMoved);
          playFootstepSound(isSecondPair);
        }

        // Step animation cadence
        walkStepTimer += dt;
        if (walkStepTimer >= 0.16) {
          walkStepTimer = 0;
          walkFrame = (walkFrame + 1) % 4;
        }
      } else {
        walkStepTimer = 0;
        walkFrame = 0;
        footstepTimer = 0.28;
      }

      // Check for nearest interactable in room
      const nearest = isInputPaused
        ? null
        : findNearestInteractable(newPosition, newDirection, currentRoom);

      if (nearest?.id !== activeInteractableRef.current?.id) {
        setActiveInteractable(nearest);
      }

      // Mutate player state ref
      currentState.player.position = newPosition;
      currentState.player.direction = newDirection;
      currentState.player.isMoving = isMoving;

      // 1. Backyard ending approach animation & heartbeat update
      if (endingApproachRef.current?.active && shadowFigureRef.current?.active) {
        const approach = endingApproachRef.current;
        const elapsed = (performance.now() - approach.startTime) / 1000;
        const durationSec = approach.duration / 1000;
        const linearProgress = Math.min(1.0, Math.max(0, elapsed / durationSec));

        // Movement: slow at first, then moderately faster as urgency builds
        const progress = Math.min(1.0, Math.pow(linearProgress, 1.18));

        // Smooth movement toward player
        shadowFigureRef.current.x =
          approach.startX + (approach.targetX - approach.startX) * progress;
        shadowFigureRef.current.y =
          approach.startY + (approach.targetY - approach.startY) * progress;
        shadowFigureRef.current.alpha = 1.0;

        // Midpoint Face Reveal (0% to 49% faceless, 50%+ face revealed looking into camera)
        shadowFigureRef.current.revealFace = linearProgress >= 0.5;

        // Accelerate and intensify heartbeat audio as progress increases
        if (heartbeatRef.current) {
          heartbeatRef.current.setIntensity(progress);
        }

        // When figure reaches close proximity / duration completes:
        if (progress >= 1.0) {
          approach.active = false;
          endingApproachRef.current = null;

          // Stop heartbeat sound immediately on second blackout
          if (heartbeatRef.current) {
            heartbeatRef.current.stop();
            heartbeatRef.current = null;
          }

          // Deactivate shadow figure
          if (shadowFigureRef.current) {
            shadowFigureRef.current.active = false;
          }

          // PART 7: SECOND BLACKOUT
          // The screen cuts to pitch black
          const resolvedState: GameState = {
            ...gameStateRef.current,
            storyFlags: {
              ...gameStateRef.current.storyFlags,
              blackoutActive: true,
            },
          };
          gameStateRef.current = resolvedState;
          setGameState(resolvedState);

          // Darkness creates the suspense (~1.6s), then transition directly to the final hook line
          setTimeout(() => {
            const nextState: GameState = {
              ...gameStateRef.current,
              storyFlags: {
                ...gameStateRef.current.storyFlags,
                blackoutActive: false,
                shadowFigureSeen: true,
                endingTriggered: true,
              },
            };
            gameStateRef.current = nextState;
            setGameState(nextState);
          }, 1600);
        }
      } else if (currentState.currentRoom === 'basement' && shadowFigureRef.current?.active) {
        // Basement Shadow Figure logic:
        shadowFigureRef.current.timer += dt;
        const playerDist = Math.hypot(
          newPosition.x - shadowFigureRef.current.x,
          newPosition.y - shadowFigureRef.current.y
        );

        // Fades out after 5.5s or if player approaches within 40px
        if (shadowFigureRef.current.timer >= 5.0 || playerDist < 40) {
          shadowFigureRef.current.alpha = Math.max(
            0,
            shadowFigureRef.current.alpha - dt * 0.8
          );
          if (shadowFigureRef.current.alpha <= 0) {
            shadowFigureRef.current.active = false;
            currentState.storyFlags.shadowFigureSeen = true;
          }
        }
      }

      // Backyard proximity-based escalating ambient sound towards the ancient stone well
      if (
        currentState.currentRoom === 'backyard' &&
        !currentState.storyFlags.blackoutActive &&
        !currentState.storyFlags.endingTriggered
      ) {
        // Ancient Well is at x: 182, y: 98, width: 58, height: 44. Center approx (211, 120)
        const wellDist = Math.hypot(newPosition.x - 211, newPosition.y - 120);
        // Distance from spawn point (52, 132) is ~160px; right in front of well is ~35px
        const proximity = Math.max(0, Math.min(1, (160 - wellDist) / 125));
        updateBackyardProximityAudio(proximity);
      }

      // Render frame
      renderGame(
        ctx,
        currentRoom,
        currentState.player,
        activeInteractableRef.current,
        walkFrame,
        showDebug,
        currentState.storyFlags,
        shadowFigureRef.current
      );

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [showDebug]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#070709] p-2 sm:p-4 select-none overflow-hidden">
      {/* Game Screen Frame */}
      <div className="relative w-full max-w-4xl aspect-[4/3] max-h-[85vh] bg-black border-2 sm:border-4 border-[#2c221a] shadow-2xl rounded-sm overflow-hidden flex items-center justify-center">
        {/* Crisp pixel-art canvas */}
        <canvas
          ref={canvasRef}
          width={VIRTUAL_WIDTH}
          height={VIRTUAL_HEIGHT}
          className="w-full h-full object-contain [image-rendering:pixelated] [image-rendering:crisp-edges]"
        />

        {/* Opening Title Sequence Overlay */}
        {gameState.storyFlags.openingActive && (
          <OpeningSequence onComplete={handleOpeningComplete} />
        )}

        {/* Final Ending Sequence Overlay */}
        {gameState.storyFlags.endingTriggered && (
          <EndingSequence onRestart={handleRestart} />
        )}

        {/* Full Blackout Horror Event Overlay */}
        {gameState.storyFlags.blackoutActive && (
          <div className="absolute inset-0 bg-black z-30 pointer-events-none" />
        )}

        {/* Interaction prompt bar (bottom of canvas) - Tappable on touch devices */}
        {activeInteractable &&
          !inspectedObject &&
          !gameState.storyFlags.openingActive &&
          !gameState.storyFlags.blackoutActive &&
          !gameState.storyFlags.endingTriggered && (
            <button
              type="button"
              onClick={triggerInteraction}
              className="absolute bottom-20 sm:bottom-3 left-1/2 -translate-x-1/2 px-3 sm:px-4 py-1.5 bg-black/90 hover:bg-[#1a140e] active:scale-95 border border-[#d4aa50] text-[#e8dfd3] font-mono text-xs sm:text-sm tracking-wide rounded-sm shadow-xl flex items-center space-x-2 pointer-events-auto cursor-pointer z-20 touch-manipulation transition-transform"
              aria-label={activeInteractable.prompt}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4aa50] animate-pulse" />
              <span>
                <span className="sm:hidden text-amber-300 font-bold">TAP:</span>
                <span className="hidden sm:inline">Press <kbd className="bg-[#2a2219] px-1 py-0.5 border border-[#524434] text-amber-300 font-bold">E</kbd> to</span>
                {' '}{activeInteractable.prompt}
              </span>
            </button>
          )}

        {/* Visual Inspection Modal Dialog */}
        {inspectedObject &&
          !gameState.storyFlags.openingActive &&
          !gameState.storyFlags.blackoutActive &&
          !gameState.storyFlags.endingTriggered &&
          !isDiaryOpen &&
          !isPhoneOpen &&
          !isRegisterOpen &&
          !isKeypadOpen && (
            <VisualInspectionView
              interactable={inspectedObject}
              onClose={handleCloseInspection}
            />
          )}

        {/* Dedicated Friend's Diary Viewer Modal */}
        {isDiaryOpen && !gameState.storyFlags.endingTriggered && (
          <DiaryViewer
            onClose={() => {
              touchDirectionRef.current = null;
              setIsDiaryOpen(false);
            }}
          />
        )}

        {/* Dedicated Friend's Phone Viewer Modal */}
        {isPhoneOpen && !gameState.storyFlags.endingTriggered && (
          <PhoneViewer
            onClose={() => {
              touchDirectionRef.current = null;
              setIsPhoneOpen(false);
            }}
          />
        )}

        {/* Dedicated Register / Maintenance Log Modal */}
        {isRegisterOpen && !gameState.storyFlags.endingTriggered && (
          <RegisterViewer
            onClose={() => {
              touchDirectionRef.current = null;
              setIsRegisterOpen(false);
            }}
          />
        )}

        {/* Dedicated Door 214 Combination Padlock Keypad Modal */}
        {isKeypadOpen && !gameState.storyFlags.endingTriggered && (
          <Room214KeypadModal
            onSuccess={handleKeypadSuccess}
            onClose={() => {
              touchDirectionRef.current = null;
              setIsKeypadOpen(false);
            }}
          />
        )}

        {/* Quick-Access Bar (Diary & Phone) */}
        {!gameState.storyFlags.endingTriggered && (
          <div className="absolute top-2 right-2 flex items-center space-x-2 z-30">
            {gameState.storyFlags.diaryDiscovered &&
              !gameState.storyFlags.openingActive &&
              !gameState.storyFlags.blackoutActive &&
              !isDiaryOpen &&
              !isPhoneOpen && (
                <button
                  type="button"
                  onClick={() => setIsDiaryOpen(true)}
                  className="px-2.5 py-1.5 sm:py-1 bg-[#1c140d]/90 hover:bg-[#302216] border border-[#d4aa50] text-[#d4aa50] font-mono text-xs rounded-xs shadow-lg flex items-center space-x-1.5 cursor-pointer touch-manipulation transition-all active:scale-95 min-h-[36px]"
                  title="Open Friend's Diary (J)"
                >
                  <span>📖</span>
                  <span className="font-bold">Diary</span>
                  <span className="hidden sm:inline font-bold">[J]</span>
                </button>
              )}

            {gameState.storyFlags.phoneUnlocked &&
              !gameState.storyFlags.openingActive &&
              !gameState.storyFlags.blackoutActive &&
              !isDiaryOpen &&
              !isPhoneOpen && (
                <button
                  type="button"
                  onClick={() => setIsPhoneOpen(true)}
                  className="px-2.5 py-1.5 sm:py-1 bg-[#121c1f]/90 hover:bg-[#1d2d32] border border-[#4db6ac] text-[#80cbc4] font-mono text-xs rounded-xs shadow-lg flex items-center space-x-1.5 cursor-pointer touch-manipulation transition-all active:scale-95 min-h-[36px]"
                  title="Open Friend's Phone (P)"
                >
                  <span>📱</span>
                  <span className="font-bold">Phone</span>
                  <span className="hidden sm:inline font-bold">[P]</span>
                </button>
              )}
          </div>
        )}

        {/* Debug Overlay */}
        <DebugOverlay
          gameState={gameStateRef.current}
          activeInteractable={activeInteractable}
          fps={fps}
          isOpen={showDebug}
          onToggle={() => setShowDebug((prev) => !prev)}
        />

        {/* On-screen touch controls for touch viewports */}
        {!gameState.storyFlags.openingActive &&
          !gameState.storyFlags.blackoutActive &&
          !gameState.storyFlags.endingTriggered && (
            <TouchControls
              onDirectionPress={(dir) => {
                touchDirectionRef.current = dir;
              }}
              onInteract={triggerInteraction}
              canInteract={activeInteractable !== null || inspectedObject !== null}
              interactLabel={getActionLabel(activeInteractable, inspectedObject !== null)}
              visible={isTouchDevice}
            />
          )}
      </div>

      {/* Footer Instructions / Atmospheric Header */}
      {!gameState.storyFlags.endingTriggered && (
        <div className="mt-3 text-center font-mono text-xs text-[#7d7162] flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <span>
            {gameState.currentRoom === 'corridor'
              ? 'ROOM 217 — HOSTEL CORRIDOR'
              : gameState.currentRoom === 'room214'
              ? 'ROOM 214 — ABANDONED ROOM'
              : gameState.currentRoom === 'basement'
              ? 'ROOM 217 — HOSTEL BASEMENT'
              : gameState.currentRoom === 'backyard'
              ? 'ROOM 217 — HOSTEL BACKYARD'
              : 'ROOM 217 — ACT 1: INVESTIGATION'}
          </span>
          <span className="text-[#453c33] hidden sm:inline">&bull;</span>
          <span className="text-[#a49685] hidden sm:inline">Move: [W, A, S, D] / [Arrows]</span>
          <span className="text-[#453c33] hidden sm:inline">&bull;</span>
          <span className="text-[#a49685] hidden sm:inline">Inspect: [E] / [Space]</span>
          {gameState.storyFlags.diaryDiscovered && (
            <>
              <span className="text-[#453c33] hidden sm:inline">&bull;</span>
              <span className="text-[#d4aa50] hidden sm:inline">Diary: [J]</span>
            </>
          )}
          {gameState.storyFlags.phoneUnlocked && (
            <>
              <span className="text-[#453c33] hidden sm:inline">&bull;</span>
              <span className="text-[#80cbc4] hidden sm:inline">Phone: [P]</span>
            </>
          )}
          <span className="text-[#453c33] hidden sm:inline">&bull;</span>
          <button
            type="button"
            onClick={() => setIsTouchDevice((prev) => !prev)}
            className="text-[11px] text-[#9c8973] hover:text-[#e0cfba] border border-[#3e3226] px-2 py-0.5 rounded-xs transition-colors cursor-pointer touch-manipulation"
          >
            {isTouchDevice ? '📱 Touch Controls: ON' : '📱 Touch Controls: OFF'}
          </button>
          <span className="text-[#453c33] hidden sm:inline">&bull;</span>
          <span className="text-[#7d7162]">Toggle Debug: [~]</span>
        </div>
      )}
    </div>
  );
};
