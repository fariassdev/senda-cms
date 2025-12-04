import type { RefObject } from 'react';

export interface ScriptEditorProps {
  content: string;
  onChange: (content: string) => void;
  ref?: RefObject<HTMLTextAreaElement | null>;
}
