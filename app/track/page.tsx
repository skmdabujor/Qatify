import { redirect } from 'next/navigation';

export default async function TrackRedirect({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const code = params?.code || params?.order || params?.ref;
  if (code && typeof code === 'string') {
    redirect(`/track-order?code=${encodeURIComponent(code)}`);
  }
  redirect('/track-order');
}
