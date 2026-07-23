import { PublicTopNav } from '@/components/layout/PublicTopNav';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PublicTopNav />
      <div className="flex-1 flex flex-col min-h-0">{children}</div>
    </>
  );
}
