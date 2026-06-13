export const dynamicParams = true;

import ArtistProfileClient from './ArtistProfileClient';

export async function generateStaticParams() {
  return [{ artist: 'aisha-m' }];
}

export default function ArtistPage({ params }: { params: Promise<{ artist: string }> }) {
  return <ArtistProfileClient slug={(await params).artist} />;
}
