'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface ScriptEditorProps {
  content: string;
  onChange: (content: string) => void;
  metrics: {
    wordCount: number;
    charCount: number;
    totalDurationSeconds: number;
    totalPauseSeconds: number;
    pausePercentage: number;
    isDurationOffTarget?: boolean;
  } | null;
  targetDurationMinutes?: number;
  isDirty: boolean;
  saveState: 'idle' | 'saving' | 'success' | 'error';
  onSave: () => void;
  ref: React.RefObject<HTMLTextAreaElement | null>;
}

export function ScriptEditor({
  content,
  onChange,
  metrics: _metrics,
  targetDurationMinutes: _targetDurationMinutes,
  isDirty: _isDirty,
  saveState: _saveState,
  onSave: _onSave,
  ref,
}: ScriptEditorProps) {
  return (
    <div className="space-y-6">
      {/* Editor */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Script Content</h2>
        </CardHeader>
        <CardContent>
          <Textarea
            ref={ref}
            aria-label="Script editor"
            value={content}
            onChange={(e) => onChange(e.target.value)}
            className="w-full min-h-[400px] font-mono text-sm leading-relaxed resize-y"
            placeholder="Start typing or use the toolbar buttons to insert meditation cues..."
          />
        </CardContent>
      </Card>
    </div>
  );
}
