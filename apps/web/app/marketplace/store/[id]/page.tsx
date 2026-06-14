export const dynamicParams = true;

import StoreFrontClient from './StoreFrontClient';

export async function generateStaticParams() {
  return [{ id: 'example-store' }];
}

export default async function StoreFrontPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <StoreFrontClient slug={id} />;
}
