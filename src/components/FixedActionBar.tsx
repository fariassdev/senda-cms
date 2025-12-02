'use client';

import { Edit, RefreshCw, Volume2 } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type SaveState = 'idle' | 'saving' | 'success' | 'error';

export const FixedActionBar = ({
  isEditing,
  onEdit,
  onGenerateAudio,
  onRegenerate,
  canGenerateAudio,
  isDirty,
  saveState,
  onSave,
  onExitEdit,
  onSaveAndExit: _onSaveAndExit,
  onDiscard: _onDiscard,
}: {
  isEditing: boolean;
  onEdit?: () => void;
  onGenerateAudio?: () => void;
  onRegenerate?: () => void;
  canGenerateAudio?: boolean;
  isDirty?: boolean;
  saveState?: SaveState;
  onSave?: () => void;
  onExitEdit?: () => void;
  onSaveAndExit?: () => void;
  onDiscard?: () => void;
}) => {
  const saveText =
    saveState === 'idle'
      ? 'Save Changes'
      : saveState === 'saving'
        ? 'Saving...'
        : saveState === 'success'
          ? 'Saved ✓'
          : 'Failed - Retry';

  return (
    <div className="sticky bottom-0 pointer-events-auto">
      <div className="bg-background/95 backdrop-blur-md rounded-lg shadow-md p-5 flex items-center justify-end gap-3">
        {!isEditing && (
          <>
            <Button variant="outline" size="sm" onClick={onRegenerate}>
              <RefreshCw className="h-4 w-4" />
              Regenerate
            </Button>

            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={onGenerateAudio}
                    disabled={!canGenerateAudio}
                  >
                    <Volume2 className="h-4 w-4" />
                    Generate Audio
                  </Button>
                </span>
              </TooltipTrigger>
              {!canGenerateAudio && (
                <TooltipContent>
                  <p>Audio can only be generated when script is completed</p>
                </TooltipContent>
              )}
            </Tooltip>

            <Button variant="default" onClick={onEdit}>
              <Edit className="h-4 w-4" />
              Edit Script
            </Button>
          </>
        )}

        {isEditing && (
          <>
            <Button variant="outline" onClick={onExitEdit}>
              Cancel
            </Button>
            <Button
              onClick={onSave}
              disabled={!isDirty || saveState === 'saving'}
              className={
                saveState === 'error'
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
  );
};
