import type { SaveState } from './types';

export default function useConnect() {
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

  return {
    getSaveText,
  };
}
