import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { Platform } from 'react-native';
import { useGame } from '@/context/GameContext';

// Define types for sounds and music
type SoundType = 'cardPlay' | 'victory' | 'defeat' | 'buttonClick' | 'damage' | 'heal';
type MusicType = 'menu' | 'battle' | 'victory';

interface SoundManagerContextType {
  playSound: (soundType: SoundType) => void;
  playMusic: (musicType: MusicType) => void;
  stopMusic: () => void;
}

const SoundManagerContext = createContext<SoundManagerContextType | undefined>(undefined);

// Web Audio API implementation
class WebAudioManager {
  private audioContext: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private currentMusic: AudioBufferSourceNode | null = null;

  constructor() {
    // Constructor now safe to call on server as it doesn't access `window`
  }

  // Initialize the audio context; must be called on the client
  public initialize() {
    if (Platform.OS !== 'web' || this.audioContext) {
      return;
    }

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      this.musicGain = this.audioContext.createGain();
      this.sfxGain = this.audioContext.createGain();
      
      this.musicGain.connect(this.audioContext.destination);
      this.sfxGain.connect(this.audioContext.destination);
      
      this.musicGain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      this.sfxGain.gain.setValueAtTime(0.5, this.audioContext.currentTime);
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  playSound(soundType: SoundType) {
    if (!this.audioContext || !this.sfxGain) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.sfxGain);

      const soundConfig = this.getSoundConfig(soundType);
      oscillator.frequency.setValueAtTime(soundConfig.frequency, this.audioContext.currentTime);
      oscillator.type = soundConfig.type;
      
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(soundConfig.volume, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + soundConfig.duration);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + soundConfig.duration);
    } catch (error) {
      console.warn('Error playing sound:', error);
    }
  }

  private getSoundConfig(soundType: SoundType) {
    const configs = {
      cardPlay: { frequency: 440, type: 'sine' as OscillatorType, volume: 0.3, duration: 0.2 },
      victory: { frequency: 523, type: 'triangle' as OscillatorType, volume: 0.5, duration: 0.8 },
      defeat: { frequency: 220, type: 'sawtooth' as OscillatorType, volume: 0.4, duration: 1.0 },
      buttonClick: { frequency: 800, type: 'square' as OscillatorType, volume: 0.2, duration: 0.1 },
      damage: { frequency: 150, type: 'sawtooth' as OscillatorType, volume: 0.4, duration: 0.3 },
      heal: { frequency: 660, type: 'sine' as OscillatorType, volume: 0.3, duration: 0.4 },
    };
    return configs[soundType];
  }

  playMusic(musicType: MusicType) {
    if (!this.audioContext || !this.musicGain) return;
    this.stopMusic();

    try {
      this.currentMusic = this.createMusicLoop(musicType);
      this.currentMusic.connect(this.musicGain);
      this.currentMusic.start(this.audioContext.currentTime);
    } catch (error) {
      console.warn('Error playing music:', error);
    }
  }

  private createMusicLoop(musicType: MusicType): AudioBufferSourceNode {
    if (!this.audioContext) throw new Error('Audio context not initialized');

    const duration = 8;
    const sampleRate = this.audioContext.sampleRate;
    const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);
    const melodyConfig = this.getMelodyConfig(musicType);
    
    for (let i = 0; i < data.length; i++) {
      const time = i / sampleRate;
      const noteIndex = Math.floor(time * 2) % melodyConfig.notes.length;
      const frequency = melodyConfig.notes[noteIndex];
      data[i] = Math.sin(2 * Math.PI * frequency * time) * Math.exp(-time % 4) * 0.1;
    }

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    return source;
  }

  private getMelodyConfig(musicType: MusicType) {
    const configs = {
      menu: { notes: [261.63, 329.63, 392.00, 523.25] },
      battle: { notes: [220.00, 246.94, 293.66, 349.23] },
      victory: { notes: [523.25, 659.25, 783.99, 1046.50] },
    };
    return configs[musicType];
  }

  stopMusic() {
    if (this.currentMusic) {
      try {
        this.currentMusic.stop();
        this.currentMusic.disconnect();
      } catch (error) {
        // Ignore errors
      }
      this.currentMusic = null;
    }
  }

  setMusicVolume(volume: number) {
    if (this.musicGain && this.audioContext) {
      this.musicGain.gain.setValueAtTime(volume, this.audioContext.currentTime);
    }
  }

  setSfxVolume(volume: number) {
    if (this.sfxGain && this.audioContext) {
      this.sfxGain.gain.setValueAtTime(volume, this.audioContext.currentTime);
    }
  }
}

// SoundManager Provider Component
export function SoundManagerProvider({ children }: { children: React.ReactNode }) {
  const { gameState } = useGame();
  const [audioManager, setAudioManager] = useState<WebAudioManager | null>(null);

  // Lazy initialize the audio manager on the client
  useEffect(() => {
    if (Platform.OS === 'web') {
      const manager = new WebAudioManager();
      manager.initialize();
      setAudioManager(manager);
    }
  }, []);

  // Effect to handle volume changes
  useEffect(() => {
    if (!audioManager) return;

    audioManager.setMusicVolume(gameState.settings.musicEnabled ? 0.3 : 0);
    audioManager.setSfxVolume(gameState.settings.soundEnabled ? 0.5 : 0);
  }, [gameState.settings.musicEnabled, gameState.settings.soundEnabled, audioManager]);

  const playSound = (soundType: SoundType) => {
    if (audioManager && gameState.settings.soundEnabled) {
      audioManager.playSound(soundType);
    }
  };

  const playMusic = (musicType: MusicType) => {
    if (audioManager && gameState.settings.musicEnabled) {
      audioManager.playMusic(musicType);
    }
  };

  const stopMusic = () => {
    audioManager?.stopMusic();
  };

  return (
    <SoundManagerContext.Provider value={{ playSound, playMusic, stopMusic }}>
      {children}
    </SoundManagerContext.Provider>
  );
}

// Custom hook to use the sound manager
export function useSound() {
  const context = useContext(SoundManagerContext);
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundManagerProvider');
  }
  return context;
}