/**
 * AEGIS Tactical Audio Synthesizer (Web Audio API)
 * Generates futuristic telemetry bleeps, radar sonar pings, and emergency siren alerts
 * without any external audio file dependencies.
 */

class AegisAudioSystem {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.volume = 0.35;
    this.sirenOsc = null;
    this.sirenGain = null;
    this.isSirenPlaying = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted && this.isSirenPlaying) {
      this.stopSiren();
    }
    return this.muted;
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
  }

  playClick() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

      gain.gain.setValueAtTime(this.volume * 0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.045);
    } catch (e) {
      // Audio context might be restricted before gesture
    }
  }

  playRadarPing() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1850, now);
      osc.frequency.exponentialRampToValueAtTime(920, now + 0.25);

      gain.gain.setValueAtTime(this.volume * 0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {}
  }

  playAlertChime() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      [880, 1100, 1320].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = now + idx * 0.08;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(this.volume * 0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.22);
      });
    } catch (e) {}
  }

  playEmergencySiren(durationSec = 4) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    this.stopSiren();

    try {
      const now = this.ctx.currentTime;
      // Dual tone EAS frequencies: 853 Hz and 960 Hz
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const masterGain = this.ctx.createGain();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(853, now);
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(960, now);

      // Low pass filter for retro emergency tone
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1600, now);

      masterGain.gain.setValueAtTime(0.001, now);
      masterGain.gain.linearRampToValueAtTime(this.volume * 0.45, now + 0.2);
      masterGain.gain.setValueAtTime(this.volume * 0.45, now + durationSec - 0.3);
      masterGain.gain.linearRampToValueAtTime(0.001, now + durationSec);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);

      osc1.stop(now + durationSec);
      osc2.stop(now + durationSec);

      this.isSirenPlaying = true;
      setTimeout(() => {
        this.isSirenPlaying = false;
      }, durationSec * 1000);
    } catch (e) {}
  }

  stopSiren() {
    this.isSirenPlaying = false;
  }
}

window.aegisAudio = new AegisAudioSystem();
