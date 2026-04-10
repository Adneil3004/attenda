import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-[var(--color-surface-container-low)]">
      {/* Sidebar with distinct background to visually separate without border lines */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-auto bg-[var(--color-surface)] relative">
        <main className="p-8 md:p-12 w-full max-w-screen-2xl 3xl:max-w-[1800px] mx-auto h-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
