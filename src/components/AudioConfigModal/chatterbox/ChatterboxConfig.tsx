'use client';

import { Loader2, AlertCircle } from 'lucide-react';
import { useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { $api } from '@/lib/api';

interface ChatterboxConfigProps {
  selectedVoice: string;
  onVoiceChange: (voice: string) => void;
}

export function ChatterboxConfig({
  selectedVoice,
  onVoiceChange,
}: ChatterboxConfigProps) {
  // Fetch active voices from database
  const { data, isLoading, error } = $api.useQuery('get', '/api/voices', {
    params: {
      query: {
        active_only: true,
      },
    },
  });

  // Extract voices array
  const voices = data || [];

  // Automatically select the first available voice if none is selected
  useEffect(() => {
    if (voices.length > 0 && !selectedVoice) {
      // Find the first synced voice if possible, or just the first voice
      const defaultVoice =
        voices.find((v) => v.voice.isSyncedToModal) || voices[0];
      if (defaultVoice?.voice?.slug) {
        onVoiceChange(defaultVoice.voice.slug);
      }
    }
  }, [voices, selectedVoice, onVoiceChange]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground animate-pulse">
          Loading custom voices from database...
        </p>
      </div>
    );
  }

  if (error || voices.length === 0) {
    return (
      <div className="rounded-md bg-destructive/10 border border-destructive/20 p-4 text-destructive space-y-2">
        <div className="flex items-center gap-2 font-medium">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>No active voices found</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Go to the CMS custom voices catalog page to create and sync voices
          with Modal.com first.
        </p>
      </div>
    );
  }

  // Find the selected voice details
  const activeVoiceObj = voices.find(
    (v) => v.voice.slug === selectedVoice,
  )?.voice;

  return (
    <div className="space-y-5">
      {/* Voice Dropdown */}
      <div className="space-y-2">
        <Label htmlFor="chatterbox-voice-select">Voice</Label>
        <Select value={selectedVoice} onValueChange={onVoiceChange}>
          <SelectTrigger
            id="chatterbox-voice-select"
            className="w-full min-h-[42px] text-left [&>span]:w-full [&>span]:text-left"
          >
            <SelectValue placeholder="Select a custom voice" />
          </SelectTrigger>
          <SelectContent>
            {voices.map((v) => (
              <SelectItem key={v.voice.id} value={v.voice.slug}>
                <div className="flex items-center justify-between w-full pr-4 text-left">
                  <span className="font-medium">{v.voice.name}</span>
                  <Badge
                    variant="outline"
                    className="ml-2 text-[10px] capitalize"
                  >
                    {v.voice.gender}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Voice Parameters & Metadata Card */}
      {activeVoiceObj && (
        <Card className="border border-primary/10 shadow-sm bg-primary/[0.01]">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Voice Profile
              </span>
              <div className="flex gap-1.5">
                <Badge className="bg-primary/10 hover:bg-primary/20 text-primary capitalize border-none text-[10px]">
                  {activeVoiceObj.gender}
                </Badge>
                <Badge
                  variant="outline"
                  className="text-[10px] border-muted-foreground/30"
                >
                  {activeVoiceObj.language.toUpperCase()}
                </Badge>
              </div>
            </div>

            {activeVoiceObj.description && (
              <p className="text-xs text-muted-foreground italic line-clamp-2">
                &ldquo;{activeVoiceObj.description}&rdquo;
              </p>
            )}

            <div className="space-y-3.5 pt-1">
              {/* Exaggeration slider display */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-muted-foreground">
                    Exaggeration (Calmness)
                  </span>
                  <span className="text-primary font-semibold">
                    {activeVoiceObj.exaggeration.toFixed(2)}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (activeVoiceObj.exaggeration / 2) * 100)}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground opacity-60">
                  <span>0.0 (Flat)</span>
                  <span>2.0 (Dynamic)</span>
                </div>
              </div>

              {/* CFG Weight slider display */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-muted-foreground">
                    CFG Weight (Fidelity)
                  </span>
                  <span className="text-primary font-semibold">
                    {activeVoiceObj.cfgWeight.toFixed(2)}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${activeVoiceObj.cfgWeight * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground opacity-60">
                  <span>0.0 (Loose)</span>
                  <span>1.0 (High Precision)</span>
                </div>
              </div>

              {/* Temperature slider display */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-muted-foreground">
                    Temperature (Stability)
                  </span>
                  <span className="text-primary font-semibold">
                    {activeVoiceObj.temperature.toFixed(2)}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${activeVoiceObj.temperature * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground opacity-60">
                  <span>0.1 (Stable)</span>
                  <span>1.0 (Creative)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
