import CourseDetail from '@/containers/Main/CourseDetail';

export default function CourseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <CourseDetail courseId={params.id} />;
}
