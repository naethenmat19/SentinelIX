
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Bell,
  ChevronRight,
  UserCircle,
  AlertTriangle,
  Clock,
  X,
} from 'lucide-react';
import { getAlerts, type Alert } from '../../services/alert.service';

const pageTitles: Record<string, string> = {
  '/': 'Overview',
  '/alerts': 'Security Alerts',
  '/incidents': 'Incident Management',
  '/security-events': 'Security Events',
  '/analytics': 'Threat Analytics',
  '/analysts': 'Analyst Management',
};

const severityStyles: Record<string, string> = {
  critical: 'bg-red-500/10 text-red-400 border-red-500/20',
  high: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};

const Topbar = () => {
  const location = useLocation();

  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationError, setNotificationError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  // Fetch notifications immediately and refresh every 30 seconds.
  useEffect(() => {
    let active = true;

    const fetchNotifications = async () => {
      try {
        const data = await getAlerts();

        if (active) {
          setAlerts(data);
          setNotificationError(false);
          setLastUpdated(new Date());
        }
      } catch {
        if (active) {
          setNotificationError(true);
        }
      }
    };

    void fetchNotifications();

    const interval = window.setInterval(() => {
      void fetchNotifications();
    }, 30000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  const currentPage =
    pageTitles[location.pathname] || 'SentinelX';

  const formattedDate = currentTime.toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const formattedTime = currentTime.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  // Count alerts that have not been resolved.
  const unresolvedCount = alerts.filter(
    (alert) => alert.status !== 'resolved'
  ).length;

  // Display the five most recently created alerts.
  const latestAlerts = [...alerts]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  return (
    <header className="sticky top-0 z-30 flex min-h-20 items-center justify-between gap-4 border-b border-slate-800 bg-[#0B1220]/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">

      {/* Page Title and Breadcrumb */}
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Workspace</span>
          <ChevronRight size={13} />
          <span className="truncate text-blue-400">{currentPage}</span>
        </div>

        <h2 className="mt-1 truncate text-lg font-semibold tracking-tight text-white sm:text-xl">
          {currentPage}
        </h2>
      </div>

      {/* Right Side Actions */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-4 lg:gap-5">

        {/* Live Local Date and Time */}
        <div className="hidden text-right lg:block">
          <p className="text-xs font-medium text-slate-300">
            {formattedDate}
          </p>
          <p className="mt-1 font-mono text-sm font-semibold tracking-wide text-blue-400">
            {formattedTime}
          </p>
          <p className="text-[10px] text-slate-500">
            Local Time
          </p>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationOpen((previous) => !previous)}
            aria-label={`Notifications: ${unresolvedCount} unresolved alerts`}
            aria-expanded={notificationOpen}
            className={`relative rounded-lg p-2 transition ${
              notificationOpen
                ? 'bg-blue-500/10 text-blue-400'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Bell size={20} />

            {unresolvedCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-[#0B1220] bg-red-500 px-1 text-[10px] font-bold text-white">
                {unresolvedCount > 99 ? '99+' : unresolvedCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {notificationOpen && (
            <div className="absolute right-0 top-12 z-50 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-xl border border-slate-700 bg-[#0B1220] shadow-2xl shadow-black/40">

              {/* Dropdown Header */}
              <div className="flex items-center justify-between border-b border-slate-800 px-4 py-4">
                <div>
                  <h3 className="font-semibold text-white">
                    Notifications
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {unresolvedCount} unresolved alerts
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setNotificationOpen(false)}
                  aria-label="Close notifications"
                  className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                >
                  <X size={17} />
                </button>
              </div>

              {/* Notification Content */}
              <div className="max-h-96 overflow-y-auto">

                {notificationError && (
                  <div className="border-b border-slate-800 px-4 py-3 text-xs text-red-400">
                    Unable to refresh notifications. Showing previously loaded data.
                  </div>
                )}

                {!notificationError && alerts.length === 0 && (
                  <div className="px-5 py-10 text-center">
                    <Bell size={25} className="mx-auto text-slate-600" />
                    <p className="mt-3 text-sm text-slate-300">
                      No notifications
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      New security alerts will appear here.
                    </p>
                  </div>
                )}

                {latestAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="border-b border-slate-800/80 px-4 py-4 transition hover:bg-slate-800/40"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-lg bg-slate-800 p-2 text-blue-400">
                        <AlertTriangle size={16} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase ${
                              severityStyles[alert.severity] ||
                              'bg-slate-800 text-slate-400 border-slate-700'
                            }`}
                          >
                            {alert.severity}
                          </span>

                          <span className="text-[10px] capitalize text-slate-500">
                            {alert.status.replace('_', ' ')}
                          </span>
                        </div>

                        <p className="mt-2 break-words text-sm font-medium text-slate-200">
                          {alert.title}
                        </p>

                        <p className="mt-1 line-clamp-2 text-xs text-slate-400">
                          {alert.description}
                        </p>

                        <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-500">
                          <Clock size={12} />
                          {new Date(alert.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

              </div>

              {/* Dropdown Footer */}
              <div className="flex items-center justify-between border-t border-slate-800 px-4 py-3">
                <span className="text-[10px] text-slate-500">
                  {lastUpdated
                    ? `Updated ${lastUpdated.toLocaleTimeString()}`
                    : 'Waiting for alerts...'}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setNotificationOpen(false);
                    window.location.href = '/alerts';
                  }}
                  className="text-xs font-medium text-blue-400 transition hover:text-blue-300"
                >
                  View all alerts
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="hidden h-8 w-px bg-slate-800 sm:block" />

        {/* Demo Analyst Profile */}
        <div className="flex items-center gap-2 rounded-lg p-1.5 sm:gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400">
            <UserCircle size={23} />
          </div>

          <div className="hidden text-left sm:block">
            <p className="text-xs font-medium text-slate-200">
              SOC Analyst
            </p>
            <p className="text-[10px] text-slate-500">
              Demo Account
            </p>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Topbar;
