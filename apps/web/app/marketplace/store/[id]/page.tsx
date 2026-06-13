export const dynamicParams = true;

import StoreFrontClient from './StoreFrontClient';

export async function generateStaticParams() {
  return [{ id: 'example-store' }];
}

export default function StoreFrontPage({ params }: { params: Promise<{ id: string }> }) {
  return <StoreFrontClient slug={(await params).id} />;
}
