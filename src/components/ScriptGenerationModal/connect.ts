'use client';

import { useState } from 'react';

/**
 * Hook for ScriptGenerationModal component logic
 * Manages isDirty state for form changes
 */
export default function useConnect() {
  const [isDirty, setIsDirty] = useState(false);

  return {
    isDirty,
    setIsDirty,
  };
}
