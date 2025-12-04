'use client';

import { Loader2, Sparkles } from 'lucide-react';
import { useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { ScriptConfigModal } from '@/containers/Main/LessonScriptGeneration/ScriptConfigModal';
import { cn } from '@/lib/utils';

import useConnect from './connect';
import type { GenerateScriptButtonProps, LessonStatus } from './types';

export function GenerateScriptButton({
  lesson,
  courseSlug,
  onGenerate,
  onUpdateAndGenerate,
  isGenerating = false,
  isUpdating = false,
  className,
}: GenerateScriptButtonProps) {
  const { isModalOpen, setIsModalOpen, getButtonState } = useConnect();

  const status = lesson.status as LessonStatus;
  const buttonState = getButtonState(status, isGenerating);
  const isPrimary = buttonState.variant === 'default';

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      // Shift+Click bypasses modal and generates directly
      if (e.shiftKey) {
        onGenerate();
        return;
      }

      // Normal click opens configuration modal
      setIsModalOpen(true);
    },
    [onGenerate, setIsModalOpen],
  );

  return (
    <>
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
        onClick={handleClick}
        disabled={buttonState.disabled}
        aria-label={`${buttonState.label} for ${lesson.title}`}
        aria-busy={isGenerating || status === 'SCRIPT_GENERATING'}
        title="Hold Shift and click for quick generation with defaults"
      >
        {buttonState.icon === 'spinner' ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Sparkles className="h-4 w-4" aria-hidden="true" />
        )}
        {/* Hide text on mobile, show on sm+ */}
        <span className="hidden sm:inline">{buttonState.label}</span>
      </Button>

      <ScriptConfigModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        lesson={lesson}
        courseSlug={courseSlug}
        onGenerate={onGenerate}
        onUpdateAndGenerate={onUpdateAndGenerate}
        isGenerating={isGenerating}
        isUpdating={isUpdating}
      />
    </>
  );
}
