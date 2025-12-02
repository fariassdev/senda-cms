'use client';

import { useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
}

export function ScriptEditor({
  content,
  onChange,
  metrics: _metrics,
  targetDurationMinutes: _targetDurationMinutes,
  isDirty: _isDirty,
  saveState: _saveState,
  onSave: _onSave,
}: ScriptEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertTextAtCursor = (textToInsert: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const textBefore = content.substring(0, startPos);
    const textAfter = content.substring(endPos);

    const newValue = textBefore + textToInsert + textAfter;
    const newCursorPos = startPos + textToInsert.length;

    onChange(newValue);

    // Set cursor position after React update
    setTimeout(() => {
      textarea.selectionStart = newCursorPos;
      textarea.selectionEnd = newCursorPos;
      textarea.focus();
    }, 0);
  };

  const toolbarButtons = [
    { label: '[PAUSE 3s]', text: '[PAUSE 3s]' },
    { label: '[PAUSE 5s]', text: '[PAUSE 5s]' },
    { label: '[PAUSE 10s]', text: '[PAUSE 10s]' },
    { label: '[PAUSE 30s]', text: '[PAUSE 30s]' },
    { label: '[PAUSE 50s]', text: '[PAUSE 50s]' },
  ];

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-2">
            {toolbarButtons.map((button) => (
              <Button
                key={button.label}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => insertTextAtCursor(button.text)}
                className="min-h-[44px] text-xs sm:text-sm"
                aria-label={`Insert ${button.label}`}
              >
                {button.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Editor */}
      <Card>
        <CardContent>
          <Textarea
            ref={textareaRef}
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
