
import { SoundType } from '../types';

class AudioService {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  playAlert(type: SoundType, volume: number = 0.5) {
    this.init();
    if (!this.ctx) return;

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);
    gainNode.connect(this.ctx.destination);

    if (type === SoundType.SISMO) {
      this.playSismo(this.ctx, gainNode);
    } else {
      this.playSubmarino(this.ctx, gainNode);
    }
  }

  private playSismo(ctx: AudioContext, gain: GainNode) {
    // A low-frequency rumble
    const osc = ctx.createOscillator();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(40, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 3);

    lfo.frequency.setValueAtTime(5, ctx.currentTime);
    lfoGain.gain.setValueAtTime(10, ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    osc.connect(gain);

    osc.start();
    lfo.start();
    
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3);
    osc.stop(ctx.currentTime + 3);
  }

  private playSubmarino(ctx: AudioContext, gain: GainNode) {
    // A classic sonar ping
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.5);

    osc.connect(gain);
    osc.start();

    gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2);
    osc.stop(ctx.currentTime + 2);
  }
}

export const audioService = new AudioService();
