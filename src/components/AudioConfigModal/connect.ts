import { useEffect, useState } from 'react';

import useVoices from '@/hooks/useVoices';
import { SPEECH_RATE_CONFIG } from './constants';
import type { AudioConfig } from './types';

/**
 * Hook for AudioConfigModal local state management
 * Manages unified voice selection and speech rate slider state
 */
export default function useConnect() {
  // Query all active voices from database
  const { voices, loading: isLoading, error } = useVoices({ activeOnly: true });

  const [selectedVoiceSlug, setSelectedVoiceSlug] = useState<string>('');
  const [speed, setSpeed] = useState<number>(SPEECH_RATE_CONFIG.default);

  // Automatically select default voice once loaded
  useEffect(() => {
    if (voices.length > 0 && !selectedVoiceSlug) {
      // Find the first synced voice if possible, or just the first voice
      const defaultVoice =
        voices.find((v) => v.voice.isSyncedToModal) || voices[0];
      if (defaultVoice?.voice?.slug) {
        setSelectedVoiceSlug(defaultVoice.voice.slug);
      }
    }
  }, [voices, selectedVoiceSlug]);

  const selectedVoiceObj = voices.find(
    (v) => v.voice.slug === selectedVoiceSlug,
  )?.voice;

  const isKokoro = selectedVoiceObj?.ttsProvider === 'kokoro';

  const getConfig = (): AudioConfig => {
    return {
      voice: selectedVoiceSlug,
      speed: isKokoro ? speed : 1.0,
    };
  };

  const resetToDefaults = () => {
    setSpeed(SPEECH_RATE_CONFIG.default);
    if (voices.length > 0) {
      const defaultVoice =
        voices.find((v) => v.voice.isSyncedToModal) || voices[0];
      if (defaultVoice?.voice?.slug) {
        setSelectedVoiceSlug(defaultVoice.voice.slug);
      }
    } else {
      setSelectedVoiceSlug('');
    }
  };

  return {
    voices,
    isLoading,
    error,
    selectedVoiceSlug,
    setSelectedVoiceSlug,
    selectedVoiceObj,
    speed,
    setSpeed,
    isKokoro,
    getConfig,
    resetToDefaults,
  };
}
