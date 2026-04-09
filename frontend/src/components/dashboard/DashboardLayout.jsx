import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-[var(--color-surface-container-low)]">
      {/* Sidebar with distinct background to visually separate without border lines */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-auto bg-[var(--color-surface)] relative">
        <main className="p-8 md:p-12 w-full max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
