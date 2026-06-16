import SideNavBar from './SideNavBar';
import TopNavBar from './TopNavBar';
import BottomNavBar from './BottomNavBar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-surface text-on-surface font-body-md antialiased min-h-screen flex">
      <SideNavBar />
      
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64 w-full relative">
        <TopNavBar />
        
        {/* pb-24 for mobile BottomNavBar clearance, lg:pb-12 for desktop */}
        {/* We let the page control its own padding, but generally pages will have a main wrapper */}
        {children}
      </div>
      
      <BottomNavBar />
    </div>
  );
}
