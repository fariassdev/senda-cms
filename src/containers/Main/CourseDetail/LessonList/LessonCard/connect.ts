import type { LessonFormData } from '@/components/LessonForm';
import useAudioGeneration from '@/hooks/useAudioGeneration';
import useLessonActions from '@/hooks/useLessonActions';
import useScriptGeneration from '@/hooks/useScriptGeneration';
import { formatTimestamp } from '@/lib/utils';
import type { LessonStatus } from '@/types/models';
import type { LessonCardProps } from './types';

export default function useConnect({ lesson, courseSlug }: LessonCardProps) {
  // Lesson update actions
  const { updateLesson, isUpdating } = useLessonActions({
    courseSlug,
    lessonId: lesson.id,
  });

  // Script generation
  const { generateScript, isGenerating } = useScriptGeneration({
    courseSlug,
    lessonId: lesson.id,
  });

  // Audio generation
  const { generateAudio, isGenerating: isGeneratingAudio } = useAudioGeneration(
    {
      courseSlug,
      lessonId: lesson.id,
    },
  );

  // Compose: update lesson then generate script
  const updateAndGenerateScript = async (data: LessonFormData) => {
    await updateLesson(data);
    generateScript();
  };

  // Check if script is available for viewing
  const SCRIPT_VIEWABLE_STATUSES: LessonStatus[] = [
    'SCRIPT_COMPLETED',
    'AUDIO_GENERATING',
    'AUDIO_COMPLETED',
  ];
  const hasViewableScript = SCRIPT_VIEWABLE_STATUSES.includes(
    lesson.status as LessonStatus,
  );

  return {
    generateScript,
    updateAndGenerateScript,
    isGenerating,
    isUpdating,
    hasViewableScript,
    formatTimestamp,
    generateAudio,
    isGeneratingAudio,
  };
}
