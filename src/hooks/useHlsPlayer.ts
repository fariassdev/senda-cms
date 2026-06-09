import { useEffect, useRef } from 'react';

import {
  createHlsPlayer,
  ErrorTypes,
  Events,
  isHlsSupported,
  type ErrorData,
} from '@/lib/hls';

function canPlayNativeHls(audio: HTMLAudioElement): boolean {
  return audio.canPlayType('application/vnd.apple.mpegurl') !== '';
}

export interface UseHlsPlayerOptions {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  playlistUrl: string | undefined;
  enabled: boolean;
  /** Growing HLS event playlist while audio is still being generated */
  isGenerating?: boolean;
  waitForSegments?: boolean;
  onReady?: () => void;
  onFatalError?: (message: string) => void;
  onBufferingChange?: (isBuffering: boolean) => void;
}

/**
 * Attaches HLS playback to an audio element via hls.js or Safari native HLS.
 */
export function useHlsPlayer({
  audioRef,
  playlistUrl,
  enabled,
  isGenerating = false,
  waitForSegments = false,
  onReady,
  onFatalError,
  onBufferingChange,
}: UseHlsPlayerOptions) {
  const hlsRef = useRef<ReturnType<typeof createHlsPlayer> | null>(null);
  const onReadyRef = useRef(onReady);
  const onFatalErrorRef = useRef(onFatalError);
  const onBufferingChangeRef = useRef(onBufferingChange);

  onReadyRef.current = onReady;
  onFatalErrorRef.current = onFatalError;
  onBufferingChangeRef.current = onBufferingChange;

  useEffect(() => {
    const audio = audioRef.current;

    if (!enabled || !audio || !playlistUrl || waitForSegments) {
      return;
    }

    const destroyHls = () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };

    const handleWaiting = () => onBufferingChangeRef.current?.(true);
    const handlePlaying = () => onBufferingChangeRef.current?.(false);
    const handleCanPlay = () => onBufferingChangeRef.current?.(false);

    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('canplay', handleCanPlay);

    if (isHlsSupported()) {
      const hls = createHlsPlayer(
        isGenerating
          ? {
              enableWorker: true,
              lowLatencyMode: false,
              liveDurationInfinity: false,
              startPosition: 0,
              backBufferLength: Infinity,
            }
          : {
              enableWorker: true,
            },
      );

      hlsRef.current = hls;
      hls.attachMedia(audio);
      hls.loadSource(playlistUrl);

      hls.on(Events.MANIFEST_PARSED, () => {
        if (isGenerating) {
          hls.startLoad(0);
        }
        onReadyRef.current?.();
      });

      hls.on(Events.ERROR, (_event: string, data: ErrorData) => {
        if (!data.fatal) {
          return;
        }

        switch (data.type) {
          case ErrorTypes.NETWORK_ERROR:
            hls.startLoad(isGenerating ? 0 : -1);
            break;
          case ErrorTypes.MEDIA_ERROR:
            hls.recoverMediaError();
            break;
          default:
            onFatalErrorRef.current?.(
              'Unable to play audio stream. Please try again.',
            );
            destroyHls();
            break;
        }
      });
    } else if (canPlayNativeHls(audio)) {
      audio.src = playlistUrl;
      const handleNativeReady = () => {
        onReadyRef.current?.();
      };
      audio.addEventListener('loadedmetadata', handleNativeReady);
      return () => {
        audio.removeEventListener('loadedmetadata', handleNativeReady);
        audio.removeEventListener('waiting', handleWaiting);
        audio.removeEventListener('playing', handlePlaying);
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeAttribute('src');
        audio.load();
      };
    } else {
      onFatalErrorRef.current?.(
        'HLS playback is not supported in this browser.',
      );
    }

    return () => {
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('canplay', handleCanPlay);
      destroyHls();
      audio.removeAttribute('src');
      audio.load();
    };
  }, [audioRef, enabled, playlistUrl, waitForSegments, isGenerating]);
}
