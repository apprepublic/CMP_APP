export const dynamicParams = true;

import ArtistProfileClient from './ArtistProfileClient';

export async function generateStaticParams() {
  return [{ id: 'aisha-m' }];
}

export default async function ArtistProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ArtistProfileClient slug={id} />;
}
