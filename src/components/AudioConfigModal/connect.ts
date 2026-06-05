import { useCallback, useEffect, useState } from 'react';

import useVoices from '@/hooks/useVoices';

import {
  MODAL_CONFIG,
  SPEECH_RATE_CONFIG,
  supportsSpeechRate,
} from './constants';
import {
  getDefaultVoiceSlug,
  type AudioConfig,
  type AudioConfigModalProps,
} from './types';
import { useVoiceSamplePreview } from './useVoiceSamplePreview';

export default function useConnect({
  open,
  onOpenChange,
  onGenerate,
  isGenerating,
  isRegeneration = false,
}: AudioConfigModalProps) {
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

  const { playingVoiceSlug, togglePlay } = useVoiceSamplePreview(open);

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

  const config = isRegeneration
    ? MODAL_CONFIG.regenerate
    : MODAL_CONFIG.generate;

  const getConfig = useCallback((): AudioConfig => {
    if (!selectedVoiceObj?.id) {
      throw new Error('No voice selected for audio generation');
    }
    const audioConfig: AudioConfig = { voice_id: selectedVoiceObj.id };
    if (supportsSpeechRateControl && speed !== SPEECH_RATE_CONFIG.default) {
      audioConfig.speed = speed;
    }
    return audioConfig;
  }, [selectedVoiceObj, supportsSpeechRateControl, speed]);

  const resetToDefaults = useCallback(() => {
    setSpeed(SPEECH_RATE_CONFIG.default);
    setSelectedVoiceSlug(getDefaultVoiceSlug(voices));
  }, [voices]);

  const handleSubmit = useCallback(() => {
    onGenerate(getConfig());
    onOpenChange(false);
  }, [getConfig, onGenerate, onOpenChange]);

  const handleCancel = useCallback(() => {
    resetToDefaults();
    onOpenChange(false);
  }, [resetToDefaults, onOpenChange]);

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (!newOpen) {
        resetToDefaults();
      }
      onOpenChange(newOpen);
    },
    [resetToDefaults, onOpenChange],
  );

  const getSubmitButtonLabel = useCallback(() => {
    if (isGenerating) {
      return isRegeneration ? 'Regenerating...' : 'Generating...';
    }
    return config.submitLabel;
  }, [isGenerating, isRegeneration, config.submitLabel]);

  const isSubmitDisabled = isGenerating || !selectedVoiceObj?.id;

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
    playingVoiceSlug,
    togglePlay,
    config,
    handleSubmit,
    handleCancel,
    handleOpenChange,
    getSubmitButtonLabel,
    isSubmitDisabled,
  };
}
