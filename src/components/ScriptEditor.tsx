'use client';

import { Clock, FileText, Pause, Percent, Target, Type } from 'lucide-react';
import { useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface ScriptEditorProps {
  content: string;
  onChange: (content: string) => void;
  metrics: {
    wordCount: number;
    charCount: number;
    estimatedDurationMinutes: number;
    totalPauseSeconds: number;
    pausePercentage: number;
    targetDurationDiff?: number;
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
  metrics,
  targetDurationMinutes,
  isDirty,
  saveState,
  onSave,
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
    { label: '[BREATHE IN]', text: '[BREATHE IN]' },
    { label: '[BREATHE OUT]', text: '[BREATHE OUT]' },
    { label: '[SILENCE 10s]', text: '[SILENCE 10s]' },
  ];

  const saveButtonText = {
    idle: 'Save Changes',
    saving: 'Saving...',
    success: 'Saved ✓',
    error: 'Failed to save - Retry',
  };

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
        <CardHeader>
          <h2 className="text-lg font-semibold">Edit Script</h2>
        </CardHeader>
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

      {/* Metrics */}
      {metrics && (
        <Card>
          <CardContent className="py-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <MetricItem
                icon={Type}
                label="Words"
                value={metrics.wordCount.toLocaleString()}
              />
              <MetricItem
                icon={FileText}
                label="Characters"
                value={metrics.charCount.toLocaleString()}
              />
              {targetDurationMinutes !== undefined && (
                <MetricItem
                  icon={Target}
                  label="Target Duration"
                  value={`${targetDurationMinutes.toFixed(1)} min`}
                />
              )}
              <MetricItem
                icon={Clock}
                label="Est. Duration"
                value={`${metrics.estimatedDurationMinutes.toFixed(1)} min`}
                highlight={metrics.isDurationOffTarget}
              />
              <MetricItem
                icon={Pause}
                label="Total Pauses"
                value={`${metrics.totalPauseSeconds}s`}
              />
              <MetricItem
                icon={Percent}
                label="Pause %"
                value={`${metrics.pausePercentage}%`}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save State Indicator */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {isDirty && saveState === 'idle' && (
                <span className="text-sm text-muted-foreground">
                  Unsaved changes
                </span>
              )}
              {saveState === 'success' && (
                <span className="text-sm text-green-600">Saved ✓</span>
              )}
            </div>
            <Button
              onClick={onSave}
              disabled={!isDirty || saveState === 'saving'}
              variant={saveState === 'success' ? 'default' : 'default'}
              className={`w-full sm:w-auto min-h-[44px] sticky bottom-4 sm:static ${
                saveState === 'error'
                  ? 'border-destructive text-destructive hover:bg-destructive/10'
                  : ''
              }`}
            >
              {saveState === 'saving' && (
                <span className="animate-spin mr-2">⏳</span>
              )}
              {saveButtonText[saveState]}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Metric display item component
 */
function MetricItem({
  icon: Icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <span
        className={`text-base font-semibold ${
          highlight ? 'text-orange-400' : 'text-foreground'
        }`}
      >
        {value}
      </span>
    </div>
  );
}
