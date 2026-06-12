export const dynamicParams = true;

import ArtistProfileClient from './ArtistProfileClient';

export async function generateStaticParams() {
  return [{ id: 'aisha-m' }, { id: 'tomiwa' }, { id: 'zainab' }];
}

export default function ArtistProfilePage() {
  return <ArtistProfileClient />;
}
