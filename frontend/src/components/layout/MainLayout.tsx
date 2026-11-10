
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#080D18] text-slate-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="ml-64 flex min-h-screen min-w-0 flex-col">

        {/* Top Navigation */}
        <Topbar />

        {/* Page Content */}
        <main className="w-full flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-[1600px]">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/70 px-6 py-3 text-center">
          <p className="text-[10px] text-slate-600">
            SentinelX Security Operations Center · Development Environment
          </p>
        </footer>

      </div>
    </div>
  );
};

export default MainLayout;
