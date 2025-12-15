'use client';

import { Edit, Loader2, RefreshCw, Volume2 } from 'lucide-react';
import React from 'react';

import { AudioConfigModal } from '@/components/AudioConfigModal';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import useConnect from './connect';
import type { FixedActionBarProps } from './types';

export const FixedActionBar = ({
  isEditing,
  onEdit,
  onGenerateAudio,
  onRegenerate,
  canGenerateAudio,
  isAudioRegeneration = false,
  isGeneratingAudio = false,
  lessonTitle = '',
  hasUnsavedChanges,
  saveStatus,
  onSave,
  onCancelEdit,
}: FixedActionBarProps) => {
  const {
    getSaveText,
    getAudioButtonLabel,
    isAudioModalOpen,
    setIsAudioModalOpen,
    handleAudioClick,
    handleGenerateFromModal,
  } = useConnect({
    onGenerateAudio,
    canGenerateAudio,
    isGeneratingAudio,
    isAudioRegeneration,
  });

  const saveText = getSaveText(saveStatus);
  const audioButtonLabel = getAudioButtonLabel();

  return (
    <>
      <div className="sticky bottom-0 pointer-events-auto">
        <div className="bg-background/95 backdrop-blur-md rounded-lg shadow-md p-5 flex items-center justify-end gap-3">
          {!isEditing && (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={onRegenerate}>
                    <RefreshCw className="h-4 w-4" />
                    Regenerate
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Hold Shift for quick regeneration without configuration</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAudioClick}
                      disabled={!canGenerateAudio || isGeneratingAudio}
                      aria-busy={isGeneratingAudio}
                    >
                      {isGeneratingAudio ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                      {audioButtonLabel}
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  {!canGenerateAudio ? (
                    <p>Audio can only be generated when script is completed</p>
                  ) : (
                    <p>Hold Shift for quick generation with defaults</p>
                  )}
                </TooltipContent>
              </Tooltip>

              <Button variant="default" onClick={onEdit}>
                <Edit className="h-4 w-4" />
                Edit Script
              </Button>
            </>
          )}

          {isEditing && (
            <>
              <Button variant="outline" onClick={onCancelEdit}>
                Cancel
              </Button>
              <Button
                onClick={onSave}
                disabled={!hasUnsavedChanges || saveStatus === 'saving'}
                className={
                  saveStatus === 'error'
                    ? 'border-destructive text-destructive'
                    : ''
                }
              >
                {saveText}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Audio Configuration Modal */}
      <AudioConfigModal
        open={isAudioModalOpen}
        onOpenChange={setIsAudioModalOpen}
        lessonTitle={lessonTitle}
        onGenerate={handleGenerateFromModal}
        isGenerating={isGeneratingAudio}
        isRegeneration={isAudioRegeneration}
      />
    </>
  );
};
