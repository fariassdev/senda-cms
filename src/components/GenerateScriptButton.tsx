import { Loader2, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type LessonStatus =
  | 'PENDING'
  | 'SCRIPT_GENERATING'
  | 'SCRIPT_COMPLETED'
  | 'AUDIO_GENERATING'
  | 'AUDIO_COMPLETED'
  | 'SCRIPT_FAILED'
  | 'AUDIO_FAILED';

interface GenerateScriptButtonProps {
  lessonId: number;
  lessonTitle: string;
  status: LessonStatus;
  onGenerate: () => void;
  isGenerating?: boolean;
  className?: string;
}

/**
 * Determines button state based on lesson status
 */
function getButtonState(status: LessonStatus, isGenerating: boolean) {
  // If mutation is in progress or status is generating
  if (isGenerating || status === 'SCRIPT_GENERATING') {
    return {
      variant: 'outline' as const,
      label: 'Generating...',
      icon: 'spinner' as const,
      disabled: true,
    };
  }

  // Audio generating - show regenerate but disabled
  if (status === 'AUDIO_GENERATING') {
    return {
      variant: 'outline' as const,
      label: 'Regenerate Script',
      icon: 'sparkles' as const,
      disabled: true,
    };
  }

  // PENDING or FAILED states - show primary generate button
  if (status === 'PENDING' || status.includes('FAILED')) {
    return {
      variant: 'default' as const,
      label: 'Generate Script',
      icon: 'sparkles' as const,
      disabled: false,
    };
  }

  // SCRIPT_COMPLETED, AUDIO_COMPLETED - show secondary regenerate button
  return {
    variant: 'outline' as const,
    label: 'Regenerate Script',
    icon: 'sparkles' as const,
    disabled: false,
  };
}

export function GenerateScriptButton({
  lessonTitle,
  status,
  onGenerate,
  isGenerating = false,
  className,
}: GenerateScriptButtonProps) {
  const buttonState = getButtonState(status, isGenerating);

  const isPrimary = buttonState.variant === 'default';

  return (
    <Button
      type="button"
      variant={buttonState.variant}
      size="sm"
      className={cn(
        // Base styles - ensure minimum touch target
        'min-h-[36px] min-w-[36px]',
        // Primary variant (Generate Script): solid cyan background
        isPrimary && 'bg-[#7dcfff] text-slate-900 hover:bg-[#7dcfff]/90',
        // Secondary variant (Regenerate): cyan border and text
        !isPrimary &&
          !buttonState.disabled &&
          'border-[#7dcfff] text-[#7dcfff] hover:bg-[#7dcfff]/10',
        // Focus state: visible cyan outline
        'focus-visible:ring-[#7dcfff] focus-visible:ring-2',
        // Responsive: hide text on small screens, show only icon
        'px-2 sm:px-3',
        className,
      )}
      onClick={onGenerate}
      disabled={buttonState.disabled}
      aria-label={`${buttonState.label} for ${lessonTitle}`}
      aria-busy={isGenerating || status === 'SCRIPT_GENERATING'}
    >
      {buttonState.icon === 'spinner' ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <Sparkles className="h-4 w-4" aria-hidden="true" />
      )}
      {/* Hide text on mobile, show on sm+ */}
      <span className="hidden sm:inline">{buttonState.label}</span>
    </Button>
  );
}
