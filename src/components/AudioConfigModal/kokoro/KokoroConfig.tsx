'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { VOICE_OPTIONS, SPEECH_RATE_CONFIG } from '../constants';

interface KokoroConfigProps {
  voice: string;
  onVoiceChange: (voice: string) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
}

export function KokoroConfig({
  voice,
  onVoiceChange,
  speed,
  onSpeedChange,
}: KokoroConfigProps) {
  return (
    <div className="space-y-6">
      {/* Voice Selection */}
      <div className="space-y-2">
        <Label htmlFor="kokoro-voice-select">Voice</Label>
        <Select value={voice} onValueChange={onVoiceChange}>
          <SelectTrigger
            id="kokoro-voice-select"
            className="w-full min-h-[42px] text-left [&>span]:w-full [&>span]:text-left"
          >
            <SelectValue placeholder="Select a voice" />
          </SelectTrigger>
          <SelectContent>
            {VOICE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex flex-col items-start text-left">
                  <span className="font-medium">{option.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {option.description}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Speech Rate Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="kokoro-speech-rate">Speech Rate</Label>
          <span className="text-sm font-medium text-primary" aria-live="polite">
            {speed.toFixed(1)}x
          </span>
        </div>
        <Slider
          id="kokoro-speech-rate"
          min={SPEECH_RATE_CONFIG.min}
          max={SPEECH_RATE_CONFIG.max}
          step={SPEECH_RATE_CONFIG.step}
          value={[speed]}
          onValueChange={(values) =>
            onSpeedChange(values[0] ?? SPEECH_RATE_CONFIG.default)
          }
          className="w-full [&_[data-slot=slider-range]]:bg-primary [&_[data-slot=slider-thumb]]:border-primary"
          aria-label={`Speech rate: ${speed.toFixed(1)}x`}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0.7x (Slower)</span>
          <span>1.3x (Faster)</span>
        </div>
      </div>
    </div>
  );
}
