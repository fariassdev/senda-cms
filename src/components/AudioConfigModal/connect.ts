import { useState } from 'react';

import { SPEECH_RATE_CONFIG, VOICE_OPTIONS } from './constants';
import type { AudioConfig, AudioProvider } from './types';

/**
 * Hook for AudioConfigModal local state management
 * Manages provider selection, voice selection, and speech rate slider state
 */
export default function useConnect() {
  const [provider, setProvider] = useState<AudioProvider>('chatterbox');
  const [kokoroVoice, setKokoroVoice] = useState<string>(
    VOICE_OPTIONS[0].value,
  );
  const [kokoroSpeed, setKokoroSpeed] = useState<number>(
    SPEECH_RATE_CONFIG.default,
  );
  const [chatterboxVoice, setChatterboxVoice] = useState<string>('');

  const getConfig = (): AudioConfig => {
    if (provider === 'kokoro') {
      return {
        voice: kokoroVoice,
        speed: kokoroSpeed,
      };
    } else {
      return {
        voice: chatterboxVoice,
        speed: 1.0, // Speed rate is fixed at 1.0 default for Chatterbox as per requirements
      };
    }
  };

  const resetToDefaults = () => {
    setProvider('chatterbox');
    setKokoroVoice(VOICE_OPTIONS[0].value);
    setKokoroSpeed(SPEECH_RATE_CONFIG.default);
    setChatterboxVoice('');
  };

  return {
    provider,
    setProvider,
    kokoroVoice,
    setKokoroVoice,
    kokoroSpeed,
    setKokoroSpeed,
    chatterboxVoice,
    setChatterboxVoice,
    getConfig,
    resetToDefaults,
  };
}
