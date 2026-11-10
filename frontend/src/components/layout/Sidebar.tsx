
import { NavLink } from 'react-router-dom';
import {
  ShieldCheck,
  LayoutDashboard,
  Bell,
  AlertTriangle,
  Activity,
  ChartNoAxesCombined,
  Users,
  Shield,
} from 'lucide-react';

const navigationItems = [
  { name: 'Overview', path: '/', icon: LayoutDashboard },
  { name: 'Security Alerts', path: '/alerts', icon: Bell },
  { name: 'Incidents', path: '/incidents', icon: AlertTriangle },
  { name: 'Security Events', path: '/security-events', icon: Activity },
  { name: 'Analytics', path: '/analytics', icon: ChartNoAxesCombined },
  { name: 'Analysts', path: '/analysts', icon: Users },
];

const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-800 bg-[#0B1220]">

      {/* Branding */}
      <div className="flex h-20 items-center border-b border-slate-800 px-6">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400">
            <ShieldCheck size={26} />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-wide text-white">
              SentinelX
            </h1>
            <p className="text-[10px] font-medium uppercase tracking-[2px] text-slate-500">
              SOC Platform
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-4 py-6">
        <p className="mb-4 px-3 text-[10px] font-semibold uppercase tracking-[2px] text-slate-500">
          Workspace
        </p>

        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-lg border px-3 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'border-blue-500/20 bg-blue-500/10 text-blue-400 shadow-sm shadow-blue-500/5'
                    : 'border-transparent text-slate-400 hover:bg-slate-800/70 hover:text-white'
                }`
              }
            >
              <Icon size={19} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Workspace Information */}
      <div className="border-t border-slate-800 p-4">
        <div className="mb-4 flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-800/30 p-3">
          <div className="rounded-md bg-blue-500/10 p-2 text-blue-400">
            <Shield size={18} />
          </div>

          <div>
            <p className="text-xs font-medium text-slate-200">
              Environment
            </p>
            <p className="mt-1 text-[10px] text-slate-400">
              Development
            </p>
          </div>
        </div>

        <p className="text-center text-[10px] text-slate-600">
          SentinelX SOC Platform v0.1.0
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
