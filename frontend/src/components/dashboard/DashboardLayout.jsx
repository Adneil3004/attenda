import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileBottomNav from './MobileBottomNav';
import '../../styles/dashboard-theme.css';

const DashboardLayout = () => {
  return (
    <div className="dashboard-root flex h-screen bg-[var(--color-surface-container-low)]">
      {/* Sidebar with distinct background to visually separate without border lines */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-auto bg-[var(--color-surface)] relative pb-24 lg:pb-0">
        <main className="p-4 sm:p-6 md:p-12 w-full max-w-screen-2xl 3xl:max-w-[1800px] mx-auto h-full">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation (Hidden on Large Screens) */}
      <MobileBottomNav />
    </div>
  );
};

export default DashboardLayout;
