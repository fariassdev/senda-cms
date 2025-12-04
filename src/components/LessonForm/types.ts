import type { LessonFormData } from './constants';

export interface LessonFormProps {
  defaultValues?: Partial<LessonFormData>;
  onSubmit: (data: LessonFormData) => void | Promise<void>;
  onDirtyChange?: (isDirty: boolean) => void;
  id?: string;
  autoFocusTitle?: boolean;
  showDescriptions?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export type UseConnectProps = Pick<
  LessonFormProps,
  'defaultValues' | 'onSubmit' | 'onDirtyChange'
>;
