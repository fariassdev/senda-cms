import CourseDetail from '@/containers/Main/CourseDetail';

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CourseDetail courseSlug={slug} />;
}
