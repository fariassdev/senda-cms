import { useCallback, useEffect, useRef, useState } from 'react';

function clearAudioElement(audio: HTMLAudioElement) {
  audio.onended = null;
  audio.onpause = null;
  audio.pause();
}

/**
 * Single-sample voice preview player for AudioConfigModal.
 * Ensures only one preview plays at a time.
 */
export function useVoiceSamplePreview(active: boolean) {
  const [playingVoiceSlug, setPlayingVoiceSlug] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stop = useCallback(() => {
    if (audioRef.current) {
      clearAudioElement(audioRef.current);
      audioRef.current = null;
    }
    setPlayingVoiceSlug(null);
  }, []);

  useEffect(() => {
    if (!active) {
      stop();
    }
    return stop;
  }, [active, stop]);

  const togglePlay = useCallback(
    (
      e: React.MouseEvent,
      voiceSlug: string,
      sampleAudioUrl: string | null | undefined,
    ) => {
      e.stopPropagation();
      e.preventDefault();

      if (!sampleAudioUrl) return;

      if (playingVoiceSlug === voiceSlug) {
        stop();
        return;
      }

      if (audioRef.current) {
        clearAudioElement(audioRef.current);
      }

      const audio = new Audio(sampleAudioUrl);
      audioRef.current = audio;
      setPlayingVoiceSlug(voiceSlug);

      audio.play().catch((err) => {
        console.error('Failed to play preview audio:', err);
        stop();
      });

      audio.onended = () => setPlayingVoiceSlug(null);
      audio.onpause = () => setPlayingVoiceSlug(null);
    },
    [playingVoiceSlug, stop],
  );

  return { playingVoiceSlug, togglePlay, stop };
}
