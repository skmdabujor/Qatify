import { redirect } from 'next/navigation';

export default function TrackRedirect({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  redirect('/track-order');
}

