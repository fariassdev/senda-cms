import { cn } from '@/lib/utils';
import type { ScriptPart } from '@/types/models';

interface ScriptContentProps {
  script: ScriptPart[];
  className?: string;
}

/**
 * Renders script content with speak parts as paragraphs and pause parts as visual cues.
 * Follows accessibility guidelines with proper semantic HTML and ARIA attributes.
 */
export function ScriptContent({ script, className }: ScriptContentProps) {
  if (!script || script.length === 0) {
    return null;
  }

  return (
    <article className={cn('space-y-4', className)} aria-label="Script content">
      {script.map((part, index) => {
        if (part.type === 'speak') {
          return (
            <p
              key={index}
              className="text-foreground leading-relaxed text-base"
            >
              {part.content}
            </p>
          );
        }

        // Pause part
        return (
          <div
            key={index}
            role="separator"
            aria-label={`Pause for ${part.duration} seconds`}
            className="flex justify-center my-6"
          >
            <span
              className="px-4 py-2 bg-muted/50 rounded-full text-muted-foreground text-sm font-medium border border-muted"
              aria-hidden="true"
            >
              [PAUSE {part.duration}s]
            </span>
          </div>
        );
      })}
    </article>
  );
}
