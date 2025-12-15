import { useCallback, useState } from 'react';

import type { AudioConfig } from '@/components/AudioConfigModal';

import type { SaveState } from './types';

interface UseConnectProps {
  onGenerateAudio?: (config?: AudioConfig) => void;
  canGenerateAudio?: boolean;
  isGeneratingAudio?: boolean;
  isAudioRegeneration?: boolean;
}

export default function useConnect({
  onGenerateAudio,
  canGenerateAudio = false,
  isGeneratingAudio = false,
  isAudioRegeneration = false,
}: UseConnectProps = {}) {
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);

  function getSaveText(saveStatus: SaveState = 'idle'): string {
    switch (saveStatus) {
      case 'idle':
        return 'Save Changes';
      case 'saving':
        return 'Saving...';
      case 'success':
        return 'Saved ✓';
      case 'error':
        return 'Failed - Retry';
      default:
        return 'Save Changes';
    }
  }

  // Dynamic button label based on state
  function getAudioButtonLabel(): string {
    if (isGeneratingAudio) {
      return 'Generating...';
    }
    return isAudioRegeneration ? 'Regenerate Audio' : 'Generate Audio';
  }

  // Handle audio button click - Shift+Click for quick generation
  const handleAudioClick = useCallback(
    (e: React.MouseEvent) => {
      if (!canGenerateAudio || isGeneratingAudio) return;

      if (e.shiftKey) {
        // Quick generation with defaults
        onGenerateAudio?.();
      } else {
        // Open modal for configuration
        setIsAudioModalOpen(true);
      }
    },
    [canGenerateAudio, isGeneratingAudio, onGenerateAudio],
  );

  // Handle generation from modal
  const handleGenerateFromModal = useCallback(
    (config: AudioConfig) => {
      onGenerateAudio?.({ voice: config.voice, speed: config.speed });
    },
    [onGenerateAudio],
  );

  return {
    getSaveText,
    getAudioButtonLabel,
    isAudioModalOpen,
    setIsAudioModalOpen,
    handleAudioClick,
    handleGenerateFromModal,
  };
}
