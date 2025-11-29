import { FilePlus2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface LessonListEmptyProps {
  onAddLesson?: () => void;
}

export function LessonListEmpty({ onAddLesson }: LessonListEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center">
      <FilePlus2 className="mb-4 h-16 w-16 text-muted-foreground/50" />
      <h3 className="mb-2 text-lg font-semibold">No lessons yet</h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">
        Create your first lesson to start building this course
      </p>
      <Button
        onClick={onAddLesson}
        disabled={!onAddLesson}
        className="bg-cyan-600 hover:bg-cyan-700"
      >
        <FilePlus2 className="mr-2 h-4 w-4" />
        Add First Lesson
      </Button>
    </div>
  );
}
