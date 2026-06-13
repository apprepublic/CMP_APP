export const dynamicParams = true;

import ArtistProfileClient from './ArtistProfileClient';

export async function generateStaticParams() {
  return [{ artist: '1' }, { artist: '2' }, { artist: '3' }];
}

export default function ArtistPage() {
  return <ArtistProfileClient />;
}
