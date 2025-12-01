import ScriptPreview from '@/containers/Main/ScriptPreview';

export default async function ScriptPreviewPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  return <ScriptPreview courseSlug={slug} lessonId={id} />;
}
