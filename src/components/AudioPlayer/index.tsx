'use client';

import {
  AlertCircle,
  Download,
  Loader2,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RefreshCw,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import useConnect from './connect';
import { SPEED_OPTIONS } from './constants';

/**
 * Global floating audio player component
 * Persists across navigation and provides full playback controls
 * The audio element is always rendered in the same place to prevent playback interruption
 */
export function AudioPlayer() {
  const {
    isPlaying,
    currentLesson,
    volume,
    isMuted,
    speed,
    isMinimized,
    playbackError,
    isLoading,
    progressPercent,
    formattedCurrentTime,
    formattedDuration,
    containerHeight,
    ariaLabel,
    isDownloading,
    togglePlay,
    toggleMute,
    toggleMinimized,
    closePlayer,
    retryPlayback,
    handleProgressChange,
    handleVolumeChange,
    handleSpeedChange,
    handleDownload,
  } = useConnect();

  // Don't render if no lesson is loaded
  if (!currentLesson) {
    return null;
  }

  // Render the UI based on state
  const renderPlayerUI = () => {
    // Error state UI
    if (playbackError) {
      return (
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <AlertCircle
              className="h-6 w-6 text-destructive"
              aria-hidden="true"
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground">
                {currentLesson.title}
              </span>
              <span className="text-xs text-destructive">{playbackError}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={retryPlayback}
              aria-label="Retry playback"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={closePlayer}
              className="h-8 w-8"
              aria-label="Close player"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      );
    }

    // Minimized state UI
    if (isMinimized) {
      return (
        <div className="relative h-full">
          {/* Thin progress bar at top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-muted">
            <div
              className="h-full bg-primary transition-all duration-200"
              style={{ width: `${progressPercent}%` }}
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Audio progress"
            />
          </div>

          <div className="flex items-center justify-between h-full px-4 pt-1">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlay}
                disabled={isLoading}
                className="h-10 w-10"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>

              <span className="text-sm font-medium text-foreground truncate max-w-[200px] sm:max-w-[300px]">
                {currentLesson.title}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground hidden sm:inline">
                {formattedCurrentTime} / {formattedDuration}
              </span>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMinimized}
                className="h-8 w-8"
                aria-label="Expand player"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={closePlayer}
                className="h-8 w-8"
                aria-label="Close player"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      );
    }

    // Expanded state UI (full controls)
    return (
      <div className="flex flex-col h-full px-4 py-3">
        {/* Progress Bar */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs text-muted-foreground w-12 text-right tabular-nums">
            {formattedCurrentTime}
          </span>
          <Slider
            value={[progressPercent]}
            max={100}
            step={0.1}
            onValueChange={handleProgressChange}
            className="flex-1"
            aria-label="Playback progress"
            disabled={isLoading}
          />
          <span className="text-xs text-muted-foreground w-12 tabular-nums">
            {formattedDuration}
          </span>
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between">
          {/* Left: Title + Keyboard Shortcuts Hint Icon */}
          <div className="flex items-center gap-2 flex-1 min-w-0 mr-4">
            <h3 className="text-sm font-medium text-foreground truncate">
              {currentLesson.title}
            </h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="h-4 w-4 rounded-full border border-muted-foreground/30 flex items-center justify-center text-[10px] text-muted-foreground hover:bg-muted transition-colors"
                  aria-label="Keyboard shortcuts"
                >
                  ?
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <div className="text-xs space-y-1">
                  <div className="font-medium mb-1">Keyboard Shortcuts</div>
                  <div>Space: Play/Pause</div>
                  <div>← →: Seek 10s backward/forward</div>
                  <div>M: Toggle mute</div>
                  <div>↑ ↓: Volume up/down</div>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Center: Main Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlay}
              disabled={isLoading}
              className="h-12 w-12 rounded-full"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </Button>
          </div>

          {/* Right: Secondary Controls */}
          <div className="flex-1 flex items-center justify-end gap-2">
            {/* Volume Control */}
            <div className="hidden sm:flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="h-8 w-8"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume * 100]}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                className="w-20"
                aria-label="Volume"
              />
            </div>

            {/* Speed Selector */}
            <Select value={speed.toString()} onValueChange={handleSpeedChange}>
              <SelectTrigger
                className="w-[70px] h-8 text-xs"
                aria-label="Playback speed"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SPEED_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value.toString()}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Download Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDownload}
              disabled={isDownloading}
              className="h-8 w-8"
              aria-label="Download audio"
            >
              {isDownloading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
            </Button>

            {/* Minimize Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMinimized}
              className="h-8 w-8"
              aria-label="Minimize player"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>

            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={closePlayer}
              className="h-8 w-8"
              aria-label="Close player"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 
                 bg-background/95 backdrop-blur-md border-t border-border
                 shadow-lg transition-all duration-300"
      style={{ height: containerHeight }}
      role="region"
      aria-label={ariaLabel}
    >
      {/* Audio element is now rendered in AudioPlayerProvider for persistence across navigation */}
      {renderPlayerUI()}
    </div>
  );
}

export default AudioPlayer;
