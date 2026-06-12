export const dynamicParams = true;

import StoreFrontClient from './StoreFrontClient';

export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }];
}

export default function StoreFrontPage() {
  return <StoreFrontClient />;
}
