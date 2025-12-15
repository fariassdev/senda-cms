import { useState } from 'react';

import { SPEECH_RATE_CONFIG, VOICE_OPTIONS } from './constants';
import type { AudioConfig } from './types';

/**
 * Hook for AudioConfigModal local state management
 * Manages voice selection and speech rate slider state
 */
export default function useConnect() {
  const [voice, setVoice] = useState<string>(VOICE_OPTIONS[0].value);
  const [speed, setSpeed] = useState<number>(SPEECH_RATE_CONFIG.default);

  const getConfig = (): AudioConfig => ({
    voice,
    speed,
  });

  const resetToDefaults = () => {
    setVoice(VOICE_OPTIONS[0].value);
    setSpeed(SPEECH_RATE_CONFIG.default);
  };

  return {
    voice,
    setVoice,
    speed,
    setSpeed,
    getConfig,
    resetToDefaults,
  };
}
