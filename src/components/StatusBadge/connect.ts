import { CheckCircle, Circle, Loader2, XCircle } from 'lucide-react';
import type { LessonStatus } from '@/types/models';

interface StatusConfig {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
  bgClass: string;
  animateSpin?: boolean;
  animatePulse?: boolean;
}

const statusConfigMap: Record<LessonStatus, StatusConfig> = {
  PENDING: {
    label: 'Pending',
    icon: Circle,
    colorClass: 'text-muted-foreground',
    bgClass: 'bg-muted border-border',
  },
  SCRIPT_GENERATING: {
    label: 'Generating Script',
    icon: Loader2,
    colorClass: 'text-info',
    bgClass: 'bg-info/10 border-info/20',
    animateSpin: true,
    animatePulse: true,
  },
  AUDIO_GENERATING: {
    label: 'Generating Audio',
    icon: Loader2,
    colorClass: 'text-info',
    bgClass: 'bg-info/10 border-info/20',
    animateSpin: true,
    animatePulse: true,
  },
  SCRIPT_COMPLETED: {
    label: 'Script Ready',
    icon: CheckCircle,
    colorClass: 'text-warning',
    bgClass: 'bg-warning/10 border-warning/20',
  },
  AUDIO_COMPLETED: {
    label: 'Completed',
    icon: CheckCircle,
    colorClass: 'text-success',
    bgClass: 'bg-success/10 border-success/20',
  },
  SCRIPT_FAILED: {
    label: 'Script Failed',
    icon: XCircle,
    colorClass: 'text-destructive',
    bgClass: 'bg-destructive/10 border-destructive/20',
  },
  AUDIO_FAILED: {
    label: 'Audio Failed',
    icon: XCircle,
    colorClass: 'text-destructive',
    bgClass: 'bg-destructive/10 border-destructive/20',
  },
};

export default function useConnect() {
  function getStatusConfig(status: string) {
    return (
      statusConfigMap[status as LessonStatus] ?? {
        label: status,
        icon: Circle,
        colorClass: 'text-muted-foreground',
        bgClass: 'bg-muted border-border',
      }
    );
  }

  return {
    getStatusConfig,
  };
}
