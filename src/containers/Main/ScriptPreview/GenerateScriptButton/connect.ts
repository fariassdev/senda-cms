import { useState } from 'react';

import type { LessonStatus } from './types';

export default function useConnect() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * Determines button state based on lesson status
   */
  function getButtonState(status: LessonStatus, isGenerating: boolean) {
    // If mutation is in progress or status is generating
    if (isGenerating || status === 'SCRIPT_GENERATING') {
      return {
        variant: 'outline' as const,
        label: 'Generating...',
        icon: 'spinner' as const,
        disabled: true,
      };
    }

    // Audio generating - show regenerate but disabled
    if (status === 'AUDIO_GENERATING') {
      return {
        variant: 'outline' as const,
        label: 'Regenerate Script',
        icon: 'sparkles' as const,
        disabled: true,
      };
    }

    // PENDING or FAILED states - show primary generate button
    if (status === 'PENDING' || status.includes('FAILED')) {
      return {
        variant: 'default' as const,
        label: 'Generate Script',
        icon: 'sparkles' as const,
        disabled: false,
      };
    }

    // SCRIPT_COMPLETED, AUDIO_COMPLETED - show secondary regenerate button
    return {
      variant: 'outline' as const,
      label: 'Regenerate Script',
      icon: 'sparkles' as const,
      disabled: false,
    };
  }

  return {
    isModalOpen,
    setIsModalOpen,
    getButtonState,
  };
}
