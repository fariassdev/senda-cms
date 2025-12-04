'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import useConnect from './connect';
import type { StatusBadgeProps } from './types';

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { getStatusConfig } = useConnect();
  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        config.bgClass,
        config.colorClass,
        config.animatePulse && 'animate-pulse',
        className,
      )}
    >
      <Icon
        className={cn(
          'h-3 w-3',
          config.colorClass,
          config.animateSpin && 'animate-spin',
        )}
        aria-hidden="true"
      />
      <span>{config.label}</span>
    </Badge>
  );
}
