'use client';

import { useState } from 'react';

/**
 * Hook for RegenerateScriptModal component logic
 * Manages isDirty state for form changes (Task 2.2)
 */
export default function useConnect() {
  const [isDirty, setIsDirty] = useState(false);

  return {
    isDirty,
    setIsDirty,
  };
}
