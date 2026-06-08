import HlsPlayer, {
  Events,
  ErrorTypes,
  // @ts-expect-error hls.js runtime exports isSupported; package types only declare default
  isSupported,
  type ErrorData,
} from 'hls.js';

export type { ErrorData };
export { Events, ErrorTypes };

export function isHlsSupported(): boolean {
  return isSupported();
}

export function createHlsPlayer(
  config: ConstructorParameters<typeof HlsPlayer>[0],
): InstanceType<typeof HlsPlayer> {
  return new HlsPlayer(config);
}
