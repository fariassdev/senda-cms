import { useEffect, useState } from 'react';

import useVoices from '@/hooks/useVoices';
import { SPEECH_RATE_CONFIG } from './constants';
import type { AudioConfig } from './types';
import { getDefaultVoiceSlug } from './utils';
import { supportsSpeechRate } from './voiceDisplay';

/**
 * Hook for AudioConfigModal local state management
 * Manages unified voice selection and speech rate slider state
 */
export default function useConnect() {
  const {
    voices,
    loading: isLoading,
    isError,
    error,
    refetch,
  } = useVoices({
    activeOnly: true,
  });

  const [selectedVoiceSlug, setSelectedVoiceSlug] = useState<string>('');
  const [speed, setSpeed] = useState<number>(SPEECH_RATE_CONFIG.default);

  useEffect(() => {
    if (voices.length > 0 && !selectedVoiceSlug) {
      const slug = getDefaultVoiceSlug(voices);
      if (slug) {
        setSelectedVoiceSlug(slug);
      }
    }
  }, [voices, selectedVoiceSlug]);

  const selectedVoiceObj = voices.find(
    (v) => v.voice.slug === selectedVoiceSlug,
  )?.voice;

  const supportsSpeechRateControl = selectedVoiceObj
    ? supportsSpeechRate(selectedVoiceObj.ttsProvider)
    : false;

  const getConfig = (): AudioConfig => {
    if (!selectedVoiceObj?.id) {
      throw new Error('No voice selected for audio generation');
    }
    const config: AudioConfig = { voice_id: selectedVoiceObj.id };
    if (supportsSpeechRateControl && speed !== SPEECH_RATE_CONFIG.default) {
      config.speed = speed;
    }
    return config;
  };

  const resetToDefaults = () => {
    setSpeed(SPEECH_RATE_CONFIG.default);
    setSelectedVoiceSlug(getDefaultVoiceSlug(voices));
  };

  return {
    voices,
    isLoading,
    isError,
    error,
    refetchVoices: refetch,
    selectedVoiceSlug,
    setSelectedVoiceSlug,
    selectedVoiceObj,
    speed,
    setSpeed,
    supportsSpeechRateControl,
    getConfig,
    resetToDefaults,
  };
}
