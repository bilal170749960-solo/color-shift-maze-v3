/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameColor } from './types';

class AudioEngine {
  private ctx: AudioContext | null = null;
  private musicInterval: any = null;
  private isMusicPlaying = false;
  private sfxVolume = 0.5;
  private musicVolume = 0.3;
  private isVibrationEnabled = true;
  private isMuted = false;
  private isMusicEnabled = true;

  // Nodes for ambient synth
  private musicGainNode: GainNode | null = null;

  constructor() {
    // Lazy loaded on first user interaction
  }

  private initContext() {
    if (this.ctx) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
    } catch (e) {
      console.warn('Web Audio API not supported in this browser.', e);
    }
  }

  public pause() {
    if (this.ctx && this.ctx.state === 'running') {
      this.ctx.suspend().catch(err => console.warn('Error suspending AudioContext:', err));
    }
  }

  public resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(err => console.warn('Error resuming AudioContext:', err));
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    this.updateMusicVolume();
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMusicEnabled(enabled: boolean) {
    this.isMusicEnabled = enabled;
    this.updateMusicVolume();
    if (enabled) {
      this.startMusic();
    } else {
      this.stopMusic();
    }
  }

  public getMusicEnabled(): boolean {
    return this.isMusicEnabled;
  }

  private updateMusicVolume() {
    if (this.musicGainNode && this.ctx) {
      const vol = (this.isMuted || !this.isMusicEnabled) ? 0 : this.musicVolume;
      this.musicGainNode.gain.setValueAtTime(vol * 0.15, this.ctx.currentTime);
    }
  }

  public setSfxVolume(vol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
  }

  public setMusicVolume(vol: number) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    this.updateMusicVolume();
  }

  public setVibration(enabled: boolean) {
    this.isVibrationEnabled = enabled;
  }

  public vibrate(duration: number | number[]) {
    if (this.isVibrationEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(duration);
      } catch (e) {
        // Safe check for browser security rules blocking vibration
      }
    }
  }

  private createGain(duration: number, startVal = 1, endVal = 0.01): GainNode | null {
    if (!this.ctx) return null;
    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(startVal, this.ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(endVal, this.ctx.currentTime + duration);
    return gainNode;
  }

  public playClick() {
    this.initContext();
    if (!this.ctx || this.sfxVolume === 0 || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.createGain(0.12, this.sfxVolume * 0.5);
    if (!gain) return;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  public playColorShift(color: GameColor) {
    this.initContext();
    if (!this.ctx || this.sfxVolume === 0 || this.isMuted) return;

    // Different pitches depending on the color
    const baseFreqs: Record<GameColor, number> = {
      red: 220,
      orange: 261.63, // C4
      yellow: 293.66, // D4
      green: 329.63, // E4
      blue: 392.00, // G4
      purple: 440, // A4
    };

    const freq = baseFreqs[color] || 300;
    const duration = 0.35;

    // Synthesize a sparkling sweep
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.createGain(duration, this.sfxVolume * 0.6);
    if (!gain) return;

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, this.ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(freq * 2, this.ctx.currentTime + duration);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 1.5, this.ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(freq * 3, this.ctx.currentTime + duration);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(this.ctx.currentTime + duration);
    osc2.stop(this.ctx.currentTime + duration);

    // Minor vibration feedback
    this.vibrate(30);
  }

  public playUnlock() {
    this.initContext();
    if (!this.ctx || this.sfxVolume === 0 || this.isMuted) return;

    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5 (C Major)
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0, now + idx * 0.06);
      gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.4, now + idx * 0.06 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.06 + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.25);
    });

    this.vibrate(40);
  }

  public playBlocked() {
    this.initContext();
    if (!this.ctx || this.sfxVolume === 0 || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.createGain(0.18, this.sfxVolume * 0.8, 0.02);
    if (!gain) return;

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(70, this.ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.18);

    // Strong vibration feedback for collision blockage
    this.vibrate([20, 40, 20]);
  }

  public playStar() {
    this.initContext();
    if (!this.ctx || this.sfxVolume === 0 || this.isMuted) return;

    const now = this.ctx.currentTime;
    // Sparkling chime
    const notes = [587.33, 880, 1174.66]; // D5, A5, D6
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);

      gain.gain.setValueAtTime(0, now + idx * 0.04);
      gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.5, now + idx * 0.04 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.005, now + idx * 0.04 + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.35);
    });

    this.vibrate(25);
  }

  public playKey() {
    this.initContext();
    if (!this.ctx || this.sfxVolume === 0 || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.createGain(0.2, this.sfxVolume * 0.4, 0.01);
    if (!gain) return;

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(987.77, now); // B5
    osc1.frequency.setValueAtTime(1318.51, now + 0.05); // E6

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1975.53, now); // B6
    osc2.frequency.setValueAtTime(2637.02, now + 0.05); // E7

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(now + 0.2);
    osc2.stop(now + 0.2);

    this.vibrate(30);
  }

  public playTeleport() {
    this.initContext();
    if (!this.ctx || this.sfxVolume === 0 || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.createGain(0.4, this.sfxVolume * 0.5, 0.005);
    if (!gain) return;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(100, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.4);

    this.vibrate([30, 50, 30]);
  }

  public playVictory() {
    this.initContext();
    if (!this.ctx || this.sfxVolume === 0 || this.isMuted) return;

    const now = this.ctx.currentTime;
    // Majestic chord (C major 7 / C9: C4 - G4 - C5 - E5 - G5 - B5 - D6)
    const freqs = [130.81, 196.00, 261.63, 329.63, 392.00, 493.88, 587.33];
    
    freqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = idx < 2 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      gain.gain.setValueAtTime(0, now + idx * 0.05);
      gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.3, now + idx * 0.05 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 1.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 1.8);
    });

    this.vibrate([100, 50, 100, 50, 150]);
  }

  public playFailure() {
    this.initContext();
    if (!this.ctx || this.sfxVolume === 0 || this.isMuted) return;

    const now = this.ctx.currentTime;
    const freqs = [180, 150, 120, 90];
    
    freqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0, now + idx * 0.12);
      gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.4, now + idx * 0.12 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.12 + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.4);
    });

    this.vibrate([200, 100, 200]);
  }

  // --- PROCEDURAL MUSIC SYNTHESIS ---
  public startMusic() {
    this.initContext();
    if (!this.ctx || this.isMusicPlaying || !this.isMusicEnabled) return;

    this.isMusicPlaying = true;
    this.musicGainNode = this.ctx.createGain();
    const initialVol = (this.isMuted || !this.isMusicEnabled) ? 0 : this.musicVolume;
    this.musicGainNode.gain.setValueAtTime(initialVol * 0.15, this.ctx.currentTime);
    this.musicGainNode.connect(this.ctx.destination);

    // Monument Valley Ambient Note Scheduler (C-major / A-minor pentatonic: A, C, D, E, G)
    const scale = [110, 130.81, 146.83, 164.81, 196.00, 220.00, 261.63, 293.66, 329.63, 392.00, 440.00];
    let noteIndex = 0;

    const playAmbientVoice = () => {
      if (!this.ctx || !this.isMusicPlaying || !this.musicGainNode || this.musicVolume === 0 || this.isMuted || !this.isMusicEnabled) return;

      const now = this.ctx.currentTime;
      // 1. Bass Pad Drone (Deep soothing note)
      const bassFreq = scale[noteIndex % 5] / 2; // Deep bass
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();

      bassOsc.type = 'triangle';
      bassOsc.frequency.setValueAtTime(bassFreq, now);
      // Low pass filter to make it soft and warm
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, now);

      bassGain.gain.setValueAtTime(0, now);
      bassGain.gain.linearRampToValueAtTime(0.6, now + 1.5); // long attack
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 5.5); // long decay

      bassOsc.connect(filter);
      filter.connect(bassGain);
      bassGain.connect(this.musicGainNode);
      bassOsc.start(now);
      bassOsc.stop(now + 6.0);

      // 2. High Sparkling Pentatonic Chimes
      // Schedule 2 or 3 sparkling random chimes during the cycle
      const chimesCount = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < chimesCount; i++) {
        const chimeDelay = Math.random() * 4.0;
        const chimeFreq = scale[5 + Math.floor(Math.random() * (scale.length - 5))] * (Math.random() > 0.6 ? 2 : 1);
        
        const chimeOsc = this.ctx.createOscillator();
        const chimeGain = this.ctx.createGain();

        chimeOsc.type = 'sine';
        chimeOsc.frequency.setValueAtTime(chimeFreq, now + chimeDelay);

        chimeGain.gain.setValueAtTime(0, now + chimeDelay);
        chimeGain.gain.linearRampToValueAtTime(0.25, now + chimeDelay + 0.1);
        chimeGain.gain.exponentialRampToValueAtTime(0.001, now + chimeDelay + 2.5); // Echo decay

        chimeOsc.connect(chimeGain);
        chimeGain.connect(this.musicGainNode);
        chimeOsc.start(now + chimeDelay);
        chimeOsc.stop(now + chimeDelay + 3.0);
      }

      noteIndex = (noteIndex + 1 + Math.floor(Math.random() * 3)) % scale.length;
    };

    // Trigger instantly, then loop every 5.5 seconds
    playAmbientVoice();
    this.musicInterval = setInterval(playAmbientVoice, 5500);
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    if (this.musicGainNode) {
      try {
        this.musicGainNode.disconnect();
      } catch (e) {}
      this.musicGainNode = null;
    }
  }

  // --- ADVERTISEMENT AUDIO INTEGRATION ---
  private wasMutedBeforeAd = false;
  private wasMusicPlayingBeforeAd = false;

  public pauseForAd() {
    this.initContext();
    this.wasMutedBeforeAd = this.isMuted;
    this.wasMusicPlayingBeforeAd = this.isMusicPlaying;

    // Mute all game audio sources
    this.isMuted = true;
    this.updateMusicVolume();

    // Suspend AudioContext to halt all sound processing completely
    if (this.ctx && this.ctx.state === 'running') {
      this.ctx.suspend().catch(err => console.warn('Error suspending AudioContext for ad:', err));
    }

    // Also stop procedural music interval so no scheduled oscillators pile up
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  public resumeAfterAd() {
    this.isMuted = this.wasMutedBeforeAd;
    this.updateMusicVolume();

    // Resume AudioContext
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(err => console.warn('Error resuming AudioContext after ad:', err));
    }

    // Re-start procedural music if it was active before the ad
    if (this.wasMusicPlayingBeforeAd && this.isMusicEnabled && !this.musicInterval) {
      this.startMusic();
    }
  }
}

export const audio = new AudioEngine();
