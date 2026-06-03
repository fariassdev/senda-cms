'use client';

import { Check, ChevronDown, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { Voice } from '@/types/models';

import { VoiceOptionContent } from './VoiceOptionContent';
import { VoiceSamplePlayButton } from './VoiceSamplePlayButton';
import type { VoiceResponse } from './utils';

export interface VoiceUnifiedSelectProps {
  voices: VoiceResponse[];
  isLoading: boolean;
  error: unknown;
  selectedVoiceSlug: string;
  onSelectVoiceSlug: (slug: string) => void;
  selectedVoiceObj?: Voice;
  playingVoiceSlug: string | null;
  onTogglePlay: (
    e: React.MouseEvent,
    voiceSlug: string,
    sampleAudioUrl: string | null | undefined,
  ) => void;
  /** When false (e.g. parent dialog closed), collapses the dropdown. */
  containerOpen?: boolean;
}

export function VoiceUnifiedSelect({
  voices,
  isLoading,
  error,
  selectedVoiceSlug,
  onSelectVoiceSlug,
  selectedVoiceObj,
  playingVoiceSlug,
  onTogglePlay,
  containerOpen = true,
}: VoiceUnifiedSelectProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerOpen) {
      setDropdownOpen(false);
    }
  }, [containerOpen]);

  useEffect(() => {
    if (!dropdownOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className="space-y-2 relative" ref={dropdownRef}>
      <Label
        htmlFor="voice-unified-select"
        className="text-sm font-medium text-foreground"
      >
        Voice Profile
      </Label>

      {isLoading ? (
        <div className="flex items-center gap-2.5 px-3 py-3 border border-border bg-secondary/30 rounded-xl text-muted-foreground text-sm">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span>Loading active voices catalog...</span>
        </div>
      ) : error || voices.length === 0 ? (
        <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3.5 text-destructive text-xs space-y-1">
          <p className="font-semibold">No active voices found</p>
          <p className="text-muted-foreground">
            Verify the system&apos;s voice database catalog is configured.
          </p>
        </div>
      ) : (
        <>
          <div
            id="voice-unified-select"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={cn(
              'w-full flex items-center justify-between min-h-[58px] px-3.5 py-2.5 bg-card hover:bg-secondary/20 border rounded-xl text-left cursor-pointer transition-all duration-200 select-none shadow-sm',
              dropdownOpen
                ? 'border-primary ring-2 ring-primary/30'
                : 'border-border',
            )}
            role="combobox"
            aria-expanded={dropdownOpen}
            aria-haspopup="listbox"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setDropdownOpen(!dropdownOpen);
              }
              if (e.key === 'Escape') {
                e.preventDefault();
                setDropdownOpen(false);
              }
            }}
          >
            {selectedVoiceObj ? (
              <div className="flex-1 min-w-0 pr-2">
                <VoiceOptionContent
                  voice={selectedVoiceObj}
                  variant="trigger"
                />
              </div>
            ) : (
              <span className="text-muted-foreground text-sm font-medium">
                Select a voice...
              </span>
            )}

            <div className="flex items-center gap-2.5 flex-shrink-0">
              {selectedVoiceObj && (
                <VoiceSamplePlayButton
                  voiceSlug={selectedVoiceObj.slug}
                  sampleAudioUrl={selectedVoiceObj.sampleAudioUrl}
                  isPlaying={playingVoiceSlug === selectedVoiceObj.slug}
                  onToggle={onTogglePlay}
                  size="md"
                />
              )}
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-muted-foreground/80 transition-transform duration-200',
                  dropdownOpen && 'transform rotate-180',
                )}
              />
            </div>
          </div>

          {dropdownOpen && (
            <div
              className="absolute z-[100] left-0 right-0 mt-1.5 bg-popover border border-border shadow-xl rounded-xl p-1.5 max-h-[250px] overflow-y-auto space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-200"
              role="listbox"
            >
              {voices.map((v) => {
                const isSelected = selectedVoiceSlug === v.voice.slug;
                return (
                  <div
                    key={v.voice.id}
                    onClick={() => {
                      onSelectVoiceSlug(v.voice.slug);
                      setDropdownOpen(false);
                    }}
                    className={cn(
                      'flex items-center justify-between w-full p-2.5 rounded-lg cursor-pointer transition-all duration-150 select-none text-left gap-2',
                      isSelected
                        ? 'bg-secondary/40 border border-primary/20'
                        : 'hover:bg-secondary/20 border border-transparent',
                    )}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 text-primary">
                      {isSelected && <Check className="h-4 w-4 stroke-[3px]" />}
                    </div>

                    <VoiceOptionContent voice={v.voice} variant="list" />

                    <div
                      className="flex-shrink-0 ml-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <VoiceSamplePlayButton
                        voiceSlug={v.voice.slug}
                        sampleAudioUrl={v.voice.sampleAudioUrl}
                        isPlaying={playingVoiceSlug === v.voice.slug}
                        onToggle={onTogglePlay}
                        size="sm"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
