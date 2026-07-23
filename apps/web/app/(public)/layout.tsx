import { PremiumHeader } from '@/components/layout/PremiumHeader';
import { Footer } from '@/components/layout/Footer';
import BottomNavBar from '@/components/layout/BottomNavBar';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PremiumHeader />
      <div className="flex-1 flex flex-col min-h-0 pt-16 md:pt-20">{children}</div>
      <Footer />
      <BottomNavBar />
    </>
  );
}
