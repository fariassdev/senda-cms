'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

import useConnect from './connect';
import { EDITOR_MIN_HEIGHT } from './constants';
import type { ScriptEditorProps } from './types';

export function ScriptEditor({ content, onChange, ref }: ScriptEditorProps) {
  useConnect();

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
            className={`w-full min-h-[${EDITOR_MIN_HEIGHT}] font-mono text-sm leading-relaxed resize-y`}
            placeholder="Start typing or use the toolbar buttons to insert meditation cues..."
          />
        </CardContent>
      </Card>
    </div>
  );
}
