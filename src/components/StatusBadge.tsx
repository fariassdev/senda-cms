import { Check, Circle, Loader2, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Lesson status values from API
export type LessonStatus =
  | 'PENDING'
  | 'SCRIPT_GENERATING'
  | 'SCRIPT_COMPLETED'
  | 'AUDIO_GENERATING'
  | 'AUDIO_COMPLETED'
  | 'SCRIPT_FAILED'
  | 'AUDIO_FAILED';

interface StatusConfig {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
  bgClass: string;
  animate?: boolean;
}

const statusConfigMap: Record<LessonStatus, StatusConfig> = {
  PENDING: {
    label: 'Pending',
    icon: Circle,
    colorClass: 'text-gray-500',
    bgClass: 'bg-gray-500/10 border-gray-500/20',
  },
  SCRIPT_GENERATING: {
    label: 'Generating Script',
    icon: Loader2,
    colorClass: 'text-blue-400',
    bgClass: 'bg-blue-500/10 border-blue-500/20',
    animate: true,
  },
  AUDIO_GENERATING: {
    label: 'Generating Audio',
    icon: Loader2,
    colorClass: 'text-blue-400',
    bgClass: 'bg-blue-500/10 border-blue-500/20',
    animate: true,
  },
  SCRIPT_COMPLETED: {
    label: 'Script Ready',
    icon: Circle,
    colorClass: 'text-orange-400',
    bgClass: 'bg-orange-500/10 border-orange-500/20',
  },
  AUDIO_COMPLETED: {
    label: 'Completed',
    icon: Check,
    colorClass: 'text-green-400',
    bgClass: 'bg-green-500/10 border-green-500/20',
  },
  SCRIPT_FAILED: {
    label: 'Script Failed',
    icon: X,
    colorClass: 'text-red-400',
    bgClass: 'bg-red-500/10 border-red-500/20',
  },
  AUDIO_FAILED: {
    label: 'Audio Failed',
    icon: X,
    colorClass: 'text-red-400',
    bgClass: 'bg-red-500/10 border-red-500/20',
  },
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfigMap[status as LessonStatus] ?? {
    label: status,
    icon: Circle,
    colorClass: 'text-gray-500',
    bgClass: 'bg-gray-500/10 border-gray-500/20',
  };

  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(config.bgClass, config.colorClass, className)}
    >
      <Icon
        className={cn(
          'h-3 w-3',
          config.colorClass,
          config.animate && 'animate-spin',
        )}
        aria-hidden="true"
      />
      <span>{config.label}</span>
    </Badge>
  );
}
