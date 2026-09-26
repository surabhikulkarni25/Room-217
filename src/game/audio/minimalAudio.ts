/**
 * Minimal Web Audio Sound Effects for Room 217
 * Synthesizes atmospheric creaking and scratching effects natively with 0 dependencies.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Low wood creak / groan sound.
 */
export function playCreakSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + 1.2);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 1.2);
    filter.Q.setValueAtTime(4, ctx.currentTime);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 1.25);
  } catch (err) {
    console.warn('Audio playback not supported:', err);
  }
}

/**
 * Faint, unsettling scratching sound against dry wood.
 */
export function playScratchSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const bufferSize = ctx.sampleRate * 0.9;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, ctx.currentTime);
    filter.Q.setValueAtTime(6, ctx.currentTime);

    // Amplitude modulation for rapid fingernail scratch cadence
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, ctx.currentTime);

    // 3 rapid scratching scrapes
    const t = ctx.currentTime;
    gain.gain.linearRampToValueAtTime(0.22, t + 0.05);
    gain.gain.linearRampToValueAtTime(0.02, t + 0.2);
    gain.gain.linearRampToValueAtTime(0.25, t + 0.35);
    gain.gain.linearRampToValueAtTime(0.03, t + 0.5);
    gain.gain.linearRampToValueAtTime(0.2, t + 0.65);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    whiteNoise.start(ctx.currentTime);
    whiteNoise.stop(ctx.currentTime + 0.95);
  } catch (err) {
    console.warn('Audio playback not supported:', err);
  }
}

/**
 * Subtle wooden furniture scrape / shift thud.
 */
export function playThudSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(90, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.4);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.45);
  } catch (err) {
    console.warn('Audio playback not supported:', err);
  }
}

/**
 * Double pulse phone vibration against wood.
 */
export function playPhoneVibrateSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;

    // First buzz pulse (0.0 to 0.22s)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(85, t);
    osc1.frequency.linearRampToValueAtTime(75, t + 0.22);

    gain1.gain.setValueAtTime(0.001, t);
    gain1.gain.linearRampToValueAtTime(0.25, t + 0.03);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(t);
    osc1.stop(t + 0.23);

    // Second buzz pulse (0.35s to 0.58s)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(85, t + 0.35);
    osc2.frequency.linearRampToValueAtTime(75, t + 0.58);

    gain2.gain.setValueAtTime(0.001, t + 0.35);
    gain2.gain.linearRampToValueAtTime(0.28, t + 0.38);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.58);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(t + 0.35);
    osc2.stop(t + 0.59);
  } catch (err) {
    console.warn('Audio playback not supported:', err);
  }
}

/**
 * Faint electronic phone ring / tonal chime.
 */
export function playPhoneRingChimeSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;

    const oscA = ctx.createOscillator();
    const oscB = ctx.createOscillator();
    const gain = ctx.createGain();

    oscA.type = 'sine';
    oscB.type = 'sine';
    oscA.frequency.setValueAtTime(850, t);
    oscB.frequency.setValueAtTime(1200, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.12, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

    oscA.connect(gain);
    oscB.connect(gain);
    gain.connect(ctx.destination);

    oscA.start(t);
    oscB.start(t);
    oscA.stop(t + 0.62);
    oscB.stop(t + 0.62);
  } catch (err) {
    console.warn('Audio playback not supported:', err);
  }
}

/**
 * Faint static noise burst evoking a whispering frequency.
 */
export function playStaticWhisperSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const bufferSize = ctx.sampleRate * 0.7;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(900, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.7);
    filter.Q.setValueAtTime(5, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.14, ctx.currentTime + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    whiteNoise.start(ctx.currentTime);
    whiteNoise.stop(ctx.currentTime + 0.72);
  } catch (err) {
    console.warn('Audio playback not supported:', err);
  }
}

/**
 * Soft electronic boot / power-on chime when phone awakens.
 */
export function playPhonePowerOnSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const notes = [380, 520, 780];

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + i * 0.12);

      gain.gain.setValueAtTime(0.001, t + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.12, t + i * 0.12 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.12 + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t + i * 0.12);
      osc.stop(t + i * 0.12 + 0.25);
    });
  } catch (err) {
    console.warn('Audio playback not supported:', err);
  }
}

/**
 * Subtle UI tap / click sound for phone navigation.
 */
export function playPhoneClickSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, t);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.04);

    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.045);
  } catch (err) {
    console.warn('Audio playback not supported:', err);
  }
}

/**
 * Short burst of filtered radio static for voice memo corruption gaps.
 */
export function playStaticBurst(durationSeconds = 0.28): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const bufferSize = Math.floor(ctx.sampleRate * durationSeconds);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1000, ctx.currentTime);
    filter.Q.setValueAtTime(4, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSeconds);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    whiteNoise.start(ctx.currentTime);
    whiteNoise.stop(ctx.currentTime + durationSeconds + 0.02);
  } catch (err) {
    console.warn('Audio playback not supported:', err);
  }
}

/**
 * Metallic brass key jingle and spring release click.
 */
export function playKeyJingleSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;

    // High metallic clinks
    [1800, 2400, 3100].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.08);

      gain.gain.setValueAtTime(0.001, t + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.14, t + idx * 0.08 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t + idx * 0.08);
      osc.stop(t + idx * 0.08 + 0.2);
    });
  } catch (err) {
    console.warn('Audio playback not supported:', err);
  }
}

/**
 * Faint, unsettling low-frequency atmospheric drone for the Shadow Figure appearance.
 * Non-jarring, gradual fade-in and fade-out.
 */
export function playShadowDroneSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(52, t);
    osc1.frequency.linearRampToValueAtTime(48, t + 4.0);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(78, t);
    osc2.frequency.linearRampToValueAtTime(72, t + 4.0);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.07, t + 1.2);
    gain.gain.setValueAtTime(0.07, t + 3.0);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 5.5);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 5.6);
    osc2.stop(t + 5.6);
  } catch (err) {
    console.warn('Audio playback not supported:', err);
  }
}

/**
 * Sudden, sharp concluding impact tone for the final "BUT WHO DID THIS?" beat.
 * Startling low impact with rapid decay into complete silence.
 */
export function playFinalImpactSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;

    // Sub-bass percussive punch
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(140, t);
    subOsc.frequency.exponentialRampToValueAtTime(32, t + 0.4);

    subGain.gain.setValueAtTime(0.38, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(t);
    subOsc.stop(t + 0.6);

    // Discordant iron impact ring
    const ringOsc = ctx.createOscillator();
    const ringGain = ctx.createGain();
    ringOsc.type = 'sawtooth';
    ringOsc.frequency.setValueAtTime(92, t);
    ringOsc.frequency.linearRampToValueAtTime(46, t + 0.35);

    ringGain.gain.setValueAtTime(0.22, t);
    ringGain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    ringOsc.connect(ringGain);
    ringGain.connect(ctx.destination);
    ringOsc.start(t);
    ringOsc.stop(t + 0.5);

    // Impact crackle burst
    const bufferSize = Math.floor(ctx.sampleRate * 0.18);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.04));
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(450, t);
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.3, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noiseSource.start(t);
    noiseSource.stop(t + 0.25);
  } catch (err) {
    console.warn('Audio playback not supported:', err);
  }
}

/**
 * Starts subtle rain-on-glass ambient sound with an unsettling undertone while looking through the window.
 * State 1 (intensified = false): Subtle rain with irregular drops and a faint 58Hz sub-drone.
 * State 2 (intensified = true): Intensified rain with colder dissonant drone (58Hz + 62.5Hz) beating slowly.
 * Returns a stop callback to cleanly fade out and terminate the audio graph.
 */
export function startWindowRainSound(intensified: boolean = false): () => void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return () => {};

    const t = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, t);
    masterGain.gain.linearRampToValueAtTime(1.0, t + 0.35);
    masterGain.connect(ctx.destination);

    // 1. Looping rain noise buffer with random droplet spikes
    const sampleRate = ctx.sampleRate;
    const duration = 2.5; // 2.5s loop
    const bufferSize = Math.floor(sampleRate * duration);
    const rainBuffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const data = rainBuffer.getChannelData(0);

    let lastVal = 0;
    for (let i = 0; i < bufferSize; i++) {
      // Pink-ish filtered noise baseline
      const white = Math.random() * 2 - 1;
      lastVal = (lastVal + 0.04 * white) / 1.04;
      data[i] = lastVal * 0.4;

      // Occasional sharp droplet impact click on glass
      if (Math.random() < 0.00045) {
        data[i] += Math.random() > 0.5 ? 0.35 : -0.35;
      }
    }

    const rainSource = ctx.createBufferSource();
    rainSource.buffer = rainBuffer;
    rainSource.loop = true;

    const rainFilter = ctx.createBiquadFilter();
    rainFilter.type = 'bandpass';
    rainFilter.frequency.setValueAtTime(intensified ? 850 : 1100, t);
    rainFilter.Q.setValueAtTime(1.2, t);

    const rainGain = ctx.createGain();
    rainGain.gain.setValueAtTime(intensified ? 0.12 : 0.09, t);

    rainSource.connect(rainFilter);
    rainFilter.connect(rainGain);
    rainGain.connect(masterGain);
    rainSource.start(t);

    // 2. Unsettling low underlying tone
    const droneOsc1 = ctx.createOscillator();
    const droneGain1 = ctx.createGain();
    droneOsc1.type = 'sine';
    droneOsc1.frequency.setValueAtTime(58, t);
    droneGain1.gain.setValueAtTime(intensified ? 0.075 : 0.038, t);

    droneOsc1.connect(droneGain1);
    droneGain1.connect(masterGain);
    droneOsc1.start(t);

    let droneOsc2: OscillatorNode | null = null;
    if (intensified) {
      // Dissonant beating companion tone for State 2
      droneOsc2 = ctx.createOscillator();
      const droneGain2 = ctx.createGain();
      droneOsc2.type = 'sine';
      droneOsc2.frequency.setValueAtTime(62.5, t);
      droneGain2.gain.setValueAtTime(0.05, t);

      droneOsc2.connect(droneGain2);
      droneGain2.connect(masterGain);
      droneOsc2.start(t);
    }

    let stopped = false;
    return () => {
      if (stopped) return;
      stopped = true;
      try {
        const stopTime = ctx.currentTime;
        masterGain.gain.setValueAtTime(masterGain.gain.value, stopTime);
        masterGain.gain.linearRampToValueAtTime(0.001, stopTime + 0.25);
        setTimeout(() => {
          try {
            rainSource.stop();
            droneOsc1.stop();
            if (droneOsc2) droneOsc2.stop();
            masterGain.disconnect();
          } catch (_) {}
        }, 300);
      } catch (_) {}
    };
  } catch (err) {
    console.warn('Audio playback not supported:', err);
    return () => {};
  }
}

/**
 * Synthesizes floorboard footstep sound.
 * Normal step: Muffled wooden thud (triangle wave sweep 108Hz -> 34Hz).
 * In Room 217 after first blackout (isSecondPair = true):
 * - Neo's step has a subtle 35ms desync.
 * - A distinct second footstep fires ~175ms later (syncopated off-beat right in between 340ms walk cadence).
 * - Second step volume is ~91% (gain 0.082 vs 0.09) with a hollow dry wood knock and subtle scuff,
 *   making two separate sets of footsteps unambiguously clear to the ear.
 */
export function playFootstepSound(isSecondPair: boolean = false): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    // Desync player's step slightly if in Room 217 post-blackout
    const playerStepTime = isSecondPair ? now + 0.035 : now;

    // 1. Primary player footstep (low muffled thud on wood floor)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    const baseFreq = 108 + (Math.random() * 12 - 6);
    osc.frequency.setValueAtTime(baseFreq, playerStepTime);
    osc.frequency.exponentialRampToValueAtTime(34, playerStepTime + 0.055);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(340, playerStepTime);

    gain.gain.setValueAtTime(0.09, playerStepTime);
    gain.gain.exponentialRampToValueAtTime(0.001, playerStepTime + 0.06);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(playerStepTime);
    osc.stop(playerStepTime + 0.07);

    // 2. The "Second Pair" trailing footstep (clearly audible, distinct second step)
    if (isSecondPair) {
      // 175ms offset lands right in the off-beat halfway through the 340ms walking interval
      const ghostTime = playerStepTime + 0.175 + (Math.random() * 0.02 - 0.01);
      const ghostOsc = ctx.createOscillator();
      const ghostGain = ctx.createGain();
      const ghostFilter = ctx.createBiquadFilter();

      // Hollow dry wooden floor tap
      ghostOsc.type = 'triangle';
      const ghostFreq = 158 + (Math.random() * 16 - 8);
      ghostOsc.frequency.setValueAtTime(ghostFreq, ghostTime);
      ghostOsc.frequency.exponentialRampToValueAtTime(46, ghostTime + 0.055);

      ghostFilter.type = 'bandpass';
      ghostFilter.frequency.setValueAtTime(460, ghostTime);
      ghostFilter.Q.setValueAtTime(1.2, ghostTime);

      // Distinct, prominent volume (0.082 - nearly equal to player's 0.09)
      ghostGain.gain.setValueAtTime(0.082, ghostTime);
      ghostGain.gain.exponentialRampToValueAtTime(0.001, ghostTime + 0.06);

      ghostOsc.connect(ghostFilter);
      ghostFilter.connect(ghostGain);
      ghostGain.connect(ctx.destination);

      ghostOsc.start(ghostTime);
      ghostOsc.stop(ghostTime + 0.07);

      // Subtle dry sole scuff on wood plank
      const scuffSize = Math.floor(ctx.sampleRate * 0.02);
      const scuffBuf = ctx.createBuffer(1, scuffSize, ctx.sampleRate);
      const sData = scuffBuf.getChannelData(0);
      for (let i = 0; i < scuffSize; i++) {
        sData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.005));
      }
      const scuffSrc = ctx.createBufferSource();
      scuffSrc.buffer = scuffBuf;
      const scuffFilter = ctx.createBiquadFilter();
      scuffFilter.type = 'bandpass';
      scuffFilter.frequency.setValueAtTime(680, ghostTime);
      const scuffGain = ctx.createGain();
      scuffGain.gain.setValueAtTime(0.04, ghostTime);
      scuffGain.gain.exponentialRampToValueAtTime(0.001, ghostTime + 0.025);

      scuffSrc.connect(scuffFilter);
      scuffFilter.connect(scuffGain);
      scuffGain.connect(ctx.destination);
      scuffSrc.start(ghostTime);
      scuffSrc.stop(ghostTime + 0.03);
    }
  } catch (err) {
    console.warn('Audio playback not supported:', err);
  }
}

/**
 * Sudden, harsh, startling phone ring tone that bursts when the hidden cavity exposes the phone.
 * Piercing dual-tone telephone bell (941Hz + 1336Hz square/sawtooth warble).
 * Tuned with high volume (gain 0.58) and sharp transients so it cuts through with unmistakably loud energy.
 */
export function playHarshPhoneRingSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    // Burst 1: Ring 1 (0.62s)
    // Silence: 0.28s
    // Burst 2: Ring 2 (0.44s) — cuts off abruptly mid-ring
    const bursts = [
      { start: now + 0.02, duration: 0.62 },
      { start: now + 0.92, duration: 0.44 },
    ];

    bursts.forEach(({ start, duration }) => {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const ringGain = ctx.createGain();

      osc1.type = 'square';
      osc1.frequency.setValueAtTime(941, start);

      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(1336, start);

      // Louder, punchy gain (0.58)
      ringGain.gain.setValueAtTime(0.58, start);
      ringGain.gain.setValueAtTime(0.58, start + duration - 0.015);
      ringGain.gain.linearRampToValueAtTime(0.001, start + duration); // Abrupt cut

      // Peaking filter centered at 1150Hz with wide Q so full dual-tone energy cuts through
      const filter = ctx.createBiquadFilter();
      filter.type = 'peaking';
      filter.frequency.setValueAtTime(1150, start);
      filter.Q.setValueAtTime(0.8, start);
      filter.gain.setValueAtTime(4.0, start);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(ringGain);
      ringGain.connect(ctx.destination);

      osc1.start(start);
      osc2.start(start);
      osc1.stop(start + duration + 0.02);
      osc2.stop(start + duration + 0.02);
    });
  } catch (err) {
    console.warn('Audio playback not supported:', err);
  }
}

/**
 * Haunting ambient sound cue when unwrapping the basement parcel:
 * Faint, indistinct whispering layered with slow creeping scratching on rough stone/timber.
 * Quiet and atmospheric (~3.6s duration), naturally fading out without an abrupt stop.
 * Fixed in Phase 15: ensures AudioContext resume, connects dedicated masterGain to destination,
 * eliminates conflicting filter cuts, and provides crisp, distinct audible presence.
 */
export function playBasementWhisperScratchSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const execute = () => {
      try {
        const t = ctx.currentTime;
        const duration = 3.6;

        // Dedicated master gain directly to destination
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.001, t);
        masterGain.gain.linearRampToValueAtTime(1.0, t + 0.25);
        masterGain.gain.setValueAtTime(1.0, t + 2.6);
        masterGain.gain.linearRampToValueAtTime(0.001, t + duration);
        masterGain.connect(ctx.destination);

        // 1. Indistinct whispering: modulated formant noise resembling vocal breath
        const bufferSize = Math.floor(ctx.sampleRate * duration);
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const whisperSource = ctx.createBufferSource();
        whisperSource.buffer = noiseBuffer;

        const whisperFilter = ctx.createBiquadFilter();
        whisperFilter.type = 'bandpass';
        whisperFilter.frequency.setValueAtTime(900, t);
        whisperFilter.frequency.exponentialRampToValueAtTime(1400, t + 1.2);
        whisperFilter.frequency.exponentialRampToValueAtTime(750, t + 2.2);
        whisperFilter.frequency.exponentialRampToValueAtTime(1100, t + duration);
        whisperFilter.Q.setValueAtTime(1.8, t); // Wider bandwidth so it stays crisp and audible

        const whisperGain = ctx.createGain();
        whisperGain.gain.setValueAtTime(0.001, t);
        whisperGain.gain.linearRampToValueAtTime(0.38, t + 0.4);
        whisperGain.gain.linearRampToValueAtTime(0.32, t + 1.8);
        whisperGain.gain.exponentialRampToValueAtTime(0.001, t + duration);

        whisperSource.connect(whisperFilter);
        whisperFilter.connect(whisperGain);
        whisperGain.connect(masterGain);
        whisperSource.start(t);
        whisperSource.stop(t + duration + 0.1);

        // 2. Slow scratching: dry fingernails scraping stone/wood in distinct abrasive scraping bursts
        const scratchBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const sData = scratchBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          const timeSec = i / ctx.sampleRate;
          // Burst 1 at 0.7s - 1.3s, Burst 2 at 1.8s - 2.5s
          const env1 = Math.max(0, 1 - Math.abs(timeSec - 1.0) / 0.32);
          const env2 = Math.max(0, 1 - Math.abs(timeSec - 2.15) / 0.35);
          const env = Math.max(env1, env2);
          // Gritty noise envelope without contradictory lowpass
          sData[i] = (Math.random() * 2 - 1) * env * (Math.random() > 0.3 ? 1 : 0.25);
        }

        const scratchSource = ctx.createBufferSource();
        scratchSource.buffer = scratchBuffer;

        const scratchFilter = ctx.createBiquadFilter();
        scratchFilter.type = 'bandpass';
        scratchFilter.frequency.setValueAtTime(2200, t);
        scratchFilter.Q.setValueAtTime(1.4, t);

        const scratchGain = ctx.createGain();
        scratchGain.gain.setValueAtTime(0.001, t);
        scratchGain.gain.linearRampToValueAtTime(0.42, t + 0.6);
        scratchGain.gain.linearRampToValueAtTime(0.38, t + 2.0);
        scratchGain.gain.exponentialRampToValueAtTime(0.001, t + duration);

        scratchSource.connect(scratchFilter);
        scratchFilter.connect(scratchGain);
        scratchGain.connect(masterGain);
        scratchSource.start(t);
        scratchSource.stop(t + duration + 0.1);
      } catch (e) {
        console.warn('Whisper scratch playback error:', e);
      }
    };

    if (ctx.state === 'suspended') {
      ctx.resume().then(execute).catch(() => {});
    } else {
      execute();
    }
  } catch (err) {
    console.warn('Audio playback not supported:', err);
  }
}

let proximityMasterGain: GainNode | null = null;
let proximityDroneOsc1: OscillatorNode | null = null;
let proximityDroneOsc2: OscillatorNode | null = null;
let proximityNoiseSrc: AudioBufferSourceNode | null = null;
let isProximityAudioRunning = false;

/**
 * Updates proximity-based escalating ambient sound in the Backyard as Neo nears the ancient well.
 * proximity: 0.0 (far away) to 1.0 (directly in front of the well structure).
 */
export function updateBackyardProximityAudio(proximity: number): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (!isProximityAudioRunning) {
      if (proximity <= 0.05) return;

      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      const t = ctx.currentTime;
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.001, t);
      master.connect(ctx.destination);
      proximityMasterGain = master;

      // Low 52Hz ominous drone
      const osc1 = ctx.createOscillator();
      const g1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(52, t);
      g1.gain.setValueAtTime(0.6, t);
      osc1.connect(g1);
      g1.connect(master);
      osc1.start(t);
      proximityDroneOsc1 = osc1;

      // Dissonant 56.5Hz beating tone
      const osc2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(56.5, t);
      g2.gain.setValueAtTime(0.4, t);
      osc2.connect(g2);
      g2.connect(master);
      osc2.start(t);
      proximityDroneOsc2 = osc2;

      // Subtle filtered breath noise
      const bufSize = Math.floor(ctx.sampleRate * 2.0);
      const noiseBuf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = noiseBuf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noiseSrc = ctx.createBufferSource();
      noiseSrc.buffer = noiseBuf;
      noiseSrc.loop = true;

      const f = ctx.createBiquadFilter();
      f.type = 'bandpass';
      f.frequency.setValueAtTime(1350, t);
      f.Q.setValueAtTime(2.2, t);

      const ng = ctx.createGain();
      ng.gain.setValueAtTime(0.3, t);

      noiseSrc.connect(f);
      f.connect(ng);
      ng.connect(master);
      noiseSrc.start(t);
      proximityNoiseSrc = noiseSrc;

      isProximityAudioRunning = true;
    }

    if (proximityMasterGain) {
      const t = ctx.currentTime;
      const targetGain = Math.max(0.001, Math.min(0.24, proximity * 0.24));
      proximityMasterGain.gain.setValueAtTime(proximityMasterGain.gain.value, t);
      proximityMasterGain.gain.linearRampToValueAtTime(targetGain, t + 0.15);
    }
  } catch (err) {
    console.warn('Proximity audio update error:', err);
  }
}

/**
 * Halts and resets the Backyard proximity audio graph.
 */
export function stopBackyardProximityAudio(): void {
  if (!isProximityAudioRunning) return;
  try {
    const ctx = getAudioContext();
    if (proximityMasterGain && ctx) {
      const t = ctx.currentTime;
      proximityMasterGain.gain.setValueAtTime(proximityMasterGain.gain.value, t);
      proximityMasterGain.gain.linearRampToValueAtTime(0.001, t + 0.2);
    }

    setTimeout(() => {
      try {
        if (proximityDroneOsc1) {
          proximityDroneOsc1.stop();
          proximityDroneOsc1.disconnect();
          proximityDroneOsc1 = null;
        }
        if (proximityDroneOsc2) {
          proximityDroneOsc2.stop();
          proximityDroneOsc2.disconnect();
          proximityDroneOsc2 = null;
        }
        if (proximityNoiseSrc) {
          proximityNoiseSrc.stop();
          proximityNoiseSrc.disconnect();
          proximityNoiseSrc = null;
        }
        if (proximityMasterGain) {
          proximityMasterGain.disconnect();
          proximityMasterGain = null;
        }
      } catch (_) {}
      isProximityAudioRunning = false;
    }, 250);
  } catch (_) {
    isProximityAudioRunning = false;
  }
}

let ambientDroneMasterGain: GainNode | null = null;
let isAmbientDroneRunning = false;

/**
 * Ensures the continuous low ambient background drone is initialized and playing.
 * Sits quietly in the background (felt more than heard) across all rooms.
 */
export function ensureAmbientDroneBed(): void {
  if (isAmbientDroneRunning) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, now);
    masterGain.gain.linearRampToValueAtTime(0.035, now + 2.0); // Gentle fade-in
    masterGain.connect(ctx.destination);
    ambientDroneMasterGain = masterGain;

    // Low fundamental drone (48Hz sine)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(48, now);
    gain1.gain.setValueAtTime(0.65, now);
    osc1.connect(gain1);
    gain1.connect(masterGain);
    osc1.start(now);

    // Gentle harmonic beating overtone (72.5Hz sine)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(72.5, now);
    gain2.gain.setValueAtTime(0.35, now);
    osc2.connect(gain2);
    gain2.connect(masterGain);
    osc2.start(now);

    // Filtered subtle dark air floor (lowpass noise)
    const bufferSize = Math.floor(ctx.sampleRate * 2.0);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    let lastVal = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      lastVal = (lastVal + 0.02 * white) / 1.02;
      data[i] = lastVal * 0.25;
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(140, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.2, now);

    noiseSource.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(masterGain);
    noiseSource.start(now);

    isAmbientDroneRunning = true;
  } catch (err) {
    console.warn('Ambient drone could not start:', err);
  }
}

/**
 * Ducks or restores the ambient drone bed.
 * Used during blackouts so the blackout sound effects stand out sharply.
 */
export function duckAmbientDroneBed(ducked: boolean): void {
  if (!ambientDroneMasterGain) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const targetVol = ducked ? 0.0001 : 0.035;
    const rampTime = ducked ? 0.2 : 0.8;
    ambientDroneMasterGain.gain.setValueAtTime(ambientDroneMasterGain.gain.value, now);
    ambientDroneMasterGain.gain.linearRampToValueAtTime(targetVol, now + rampTime);
  } catch (_) {}
}




