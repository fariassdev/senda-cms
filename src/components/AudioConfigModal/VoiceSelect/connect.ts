import { useEffect, useMemo, useState } from 'react';

import type { VoiceSelectProps } from './types';

function getCatalogErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'detail' in error) {
    const detail = (error as { detail?: Array<{ msg: string }> }).detail;
    if (detail?.[0]?.msg) {
      return detail[0].msg;
    }
  }
  return 'Could not load the voice catalog. Please try again.';
}

export default function useConnect({
  containerOpen = true,
  error,
}: VoiceSelectProps) {
  const [selectOpen, setSelectOpen] = useState(false);

  useEffect(() => {
    if (!containerOpen) {
      setSelectOpen(false);
    }
  }, [containerOpen]);

  const catalogErrorMessage = useMemo(
    () => (error !== undefined ? getCatalogErrorMessage(error) : ''),
    [error],
  );

  return {
    selectOpen,
    setSelectOpen,
    catalogErrorMessage,
  };
}
