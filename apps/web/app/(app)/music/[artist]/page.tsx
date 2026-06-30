import ArtistProfileClient from './ArtistProfileClient';

export async function generateStaticParams() {
  // With output: 'export', dynamicParams is ignored.
  // All artist pages must be pre-built at export time.
  // Return an empty array - artist pages are expected to be built
  // via their static paths when known.
  return [];
}

export default async function ArtistPage({ params }: { params: Promise<{ artist: string }> }) {
  const { artist } = await params;
  return <ArtistProfileClient slug={artist} />;
}
