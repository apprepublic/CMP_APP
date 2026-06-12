export const dynamicParams = true;

import ArtistProfileClient from './ArtistProfileClient';

export async function generateStaticParams() {
  return [{ artist: 'luna-echo' }, { artist: 'dj-horizon' }, { artist: 'beat-master' }];
}

export default function ArtistProfilePage() {
  return <ArtistProfileClient />;
}
