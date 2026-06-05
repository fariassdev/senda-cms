import { cn } from '@/lib/utils';

export const TRIGGER_CLASS_NAME = cn(
  'w-full min-h-[58px] h-auto px-3.5 py-2.5 rounded-xl bg-card hover:bg-secondary/20',
  'border-border shadow-sm text-left',
  'data-[placeholder]:text-muted-foreground',
  '[&>span]:w-full [&>span]:line-clamp-none',
);
