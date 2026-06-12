export const dynamicParams = true;

import StorefrontClient from './StorefrontClient';

export async function generateStaticParams() {
  return [{ id: 'lagos-threads' }, { id: 'tech-haven' }, { id: 'style-lab' }];
}

export default function StorefrontPage() {
  return <StorefrontClient />;
}
