import { Injectable, signal } from '@angular/core';

export interface HapticOptions {
  pattern?: number | number[];
  duration?: number;
}

export interface SoundOptions {
  volume?: number;
  pitch?: number;
}

@Injectable({
  providedIn: 'root'
})
export class MicroInteractionService {
  private readonly isVibrationEnabled = signal(true);
  private readonly isSoundEnabled = signal(false); // Deshabilitado por defecto para no molestar
  
  // Audio context para efectos de sonido
  private audioContext: AudioContext | null = null;
  
  constructor() {
    this.initAudioContext();
  }
  
  /**
   * Reproducir vibración háptica si está disponible
   */
  public vibrate(options: HapticOptions = {}): void {
    if (!this.isVibrationEnabled() || typeof navigator === 'undefined' || !navigator.vibrate) {
      return;
    }
    
    try {
      const pattern = options.pattern || options.duration || 50;
      navigator.vibrate(pattern);
    } catch (error) {
      console.warn('Vibration failed:', error);
    }
  }
  
  /**
   * Efectos de vibración predefinidos
   */
  public vibrateSuccess(): void {
    this.vibrate({ pattern: [100, 50, 100] });
  }
  
  public vibrateError(): void {
    this.vibrate({ pattern: [200, 100, 200, 100, 200] });
  }
  
  public vibrateClick(): void {
    this.vibrate({ duration: 25 });
  }
  
  public vibrateHover(): void {
    this.vibrate({ duration: 15 });
  }
  
  /**
   * Reproducir sonido sutil
   */
  public playSound(frequency: number = 800, options: SoundOptions = {}): void {
    if (!this.isSoundEnabled() || !this.audioContext) {
      return;
    }
    
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      oscillator.type = 'sine';
      
      const volume = options.volume || 0.1;
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.1);
    } catch (error) {
      console.warn('Sound playback failed:', error);
    }
  }
  
  /**
   * Sonidos predefinidos
   */
  public playSoundClick(): void {
    this.playSound(1000, { volume: 0.05 });
  }
  
  public playSoundHover(): void {
    this.playSound(600, { volume: 0.03 });
  }
  
  public playSoundSuccess(): void {
    this.playSound(800, { volume: 0.08 });
    setTimeout(() => this.playSound(1200, { volume: 0.06 }), 100);
  }
  
  public playSoundError(): void {
    this.playSound(400, { volume: 0.1 });
  }
  
  /**
   * Combinación de vibración + sonido para interacciones
   */
  public feedbackClick(): void {
    this.vibrateClick();
    this.playSoundClick();
  }
  
  public feedbackHover(): void {
    this.vibrateHover();
    this.playSoundHover();
  }
  
  public feedbackSuccess(): void {
    this.vibrateSuccess();
    this.playSoundSuccess();
  }
  
  public feedbackError(): void {
    this.vibrateError();
    this.playSoundError();
  }
  
  /**
   * Configuración de micro-interacciones
   */
  public enableVibration(): void {
    this.isVibrationEnabled.set(true);
  }
  
  public disableVibration(): void {
    this.isVibrationEnabled.set(false);
  }
  
  public enableSound(): void {
    this.isSoundEnabled.set(true);
  }
  
  public disableSound(): void {
    this.isSoundEnabled.set(false);
  }
  
  public isVibrationSupported(): boolean {
    return typeof navigator !== 'undefined' && 'vibrate' in navigator;
  }
  
  public isSoundSupported(): boolean {
    return typeof AudioContext !== 'undefined' || typeof (window as any).webkitAudioContext !== 'undefined';
  }
  
  /**
   * Inicializar contexto de audio
   */
  private initAudioContext(): void {
    try {
      if (typeof AudioContext !== 'undefined') {
        this.audioContext = new AudioContext();
      } else if (typeof (window as any).webkitAudioContext !== 'undefined') {
        this.audioContext = new (window as any).webkitAudioContext();
      }
    } catch (error) {
      console.warn('AudioContext initialization failed:', error);
    }
  }
}
