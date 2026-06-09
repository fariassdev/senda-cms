/**
 * Returns the end time (seconds) of the last buffered range, or 0 if none.
 */
export function getBufferedEnd(audio: HTMLAudioElement): number {
  const { buffered } = audio;
  if (buffered.length === 0) {
    return 0;
  }
  return buffered.end(buffered.length - 1);
}

/**
 * Returns a finite media duration when available.
 */
export function getFiniteDuration(audio: HTMLAudioElement): number {
  const { duration } = audio;
  return Number.isFinite(duration) && duration > 0 ? duration : 0;
}

/**
 * Maximum seek target: buffered range while generating, full duration when VOD.
 */
export function getMaxSeekTime(
  audio: HTMLAudioElement,
  isLiveGenerating: boolean,
): number {
  if (isLiveGenerating) {
    return getBufferedEnd(audio);
  }
  return getFiniteDuration(audio);
}
