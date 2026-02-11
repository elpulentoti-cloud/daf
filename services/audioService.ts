
import { SoundType } from '../types.ts';

class AudioService {
  private ctx: AudioContext | null = null;

  private async init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  async playAlert(type: SoundType, volume: number = 0.5) {
    await this.init();
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
    const osc = ctx.createOscillator();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(45, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(25, ctx.currentTime + 2.5);

    lfo.frequency.setValueAtTime(8, ctx.currentTime);
    lfoGain.gain.setValueAtTime(15, ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    osc.connect(gain);

    osc.start();
    lfo.start();
    
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5);
    osc.stop(ctx.currentTime + 2.5);
    lfo.stop(ctx.currentTime + 2.5);
  }

  private playSubmarino(ctx: AudioContext, gain: GainNode) {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(900, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.4);

    osc.connect(gain);
    osc.start();

    gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8);
    osc.stop(ctx.currentTime + 1.8);
  }
}

export const audioService = new AudioService();
