import { useState, useCallback } from 'react';

export default function useConnect() {
  const [isDirty, setIsDirty] = useState(false);

  const handleSetIsDirty = useCallback((dirty: boolean) => {
    setIsDirty(dirty);
  }, []);

  return {
    isDirty,
    setIsDirty: handleSetIsDirty,
  };
}
