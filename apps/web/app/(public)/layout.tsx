import BottomNavBar from '@/components/layout/BottomNavBar';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BottomNavBar />
    </>
  );
}
