export const dynamicParams = true;

import ArtistProfileClient from './ArtistProfileClient';

export async function generateStaticParams() {
  return [{ artist: 'aisha-m' }];
}

export default async function ArtistPage({ params }: { params: Promise<{ artist: string }> }) {
  const { artist } = await params;
  return <ArtistProfileClient slug={artist} />;
}
