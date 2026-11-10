
import {
  ShieldAlert,
  AlertTriangle,
  ShieldCheck,
  Activity,
  TrendingUp,
} from 'lucide-react';

import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useEffect, useState } from 'react';

import { getAlerts, Alert } from '../services/alert.service';
import { getIncidents, Incident } from '../services/incident.service';
import {
  getSecurityEvents,
  SecurityEvent,
} from '../services/securityEvent.service';

import {
  getSystemHealth,
  getDatabaseHealth,
  SystemHealth,
  DatabaseHealth,
} from '../services/health.service';

const Overview = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [databaseHealth, setDatabaseHealth] = useState<DatabaseHealth | null>(null);

useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [alertsData, incidentsData, eventsData] = await Promise.all([
        getAlerts(),
        getIncidents(),
        getSecurityEvents(),
      ]);

      setAlerts(alertsData);
      setIncidents(incidentsData);
      setSecurityEvents(eventsData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to fetch dashboard data'
      );
    } finally {
      setLoading(false);
    }

    // Fetch system health independently from dashboard data.
    const [systemResult, databaseResult] = await Promise.allSettled([
      getSystemHealth(),
      getDatabaseHealth(),
    ]);

    if (systemResult.status === 'fulfilled') {
      setSystemHealth(systemResult.value);
    }

    if (databaseResult.status === 'fulfilled') {
      setDatabaseHealth(databaseResult.value);
    } else {
      setDatabaseHealth({
        database: 'disconnected',
        timestamp: new Date().toISOString(),
      });
    }
  };

  void fetchDashboardData();
}, []); 
// Temporary simulated dashboard data
  const stats = [
  {
    title: 'Total Alerts',
    value: alerts.length.toLocaleString(),
    change: '+12.5%',
    description: 'Compared to last week',
    icon: ShieldAlert,
    color: 'blue',
  },
  {
    title: 'Open Incidents',
    value: incidents.filter((incident) => incident.status === 'open').length.toString(),
    change: '-8.2%',
    description: 'Compared to last week',
    icon: AlertTriangle,
    color: 'amber',
  },
  {
    title: 'Critical Alerts',
    value: alerts.filter((alert) => alert.severity === 'critical').length.toString(),
    change: '+3.1%',
    description: 'Compared to last week',
    icon: ShieldCheck,
    color: 'red',
  },
  {
    title: 'Security Events',
    value: securityEvents.length.toLocaleString(),
    change: '+18.4%',
    description: 'Compared to last week',
    icon: Activity,
    color: 'emerald',
  },
];
  // Temporary simulated security activity data
const activityData = Array.from({ length: 7 }, (_, index) => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - (6 - index));

  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + 1);

  const events = securityEvents.filter((event) => {
    const eventDate = new Date(event.timestamp);
    return eventDate >= date && eventDate < nextDate;
  }).length;

  return {
    day: date.toLocaleDateString('en-US', { weekday: 'short' }),
    events,
  };
});
// Temporary simulated severity distribution
const totalAlerts = alerts.length;

const severityData = [
  {
    name: 'Critical',
    value: totalAlerts
      ? Math.round((alerts.filter((alert) => alert.severity === 'critical').length / totalAlerts) * 100)
      : 0,
    color: '#EF4444',
  },
  {
    name: 'High',
    value: totalAlerts
      ? Math.round((alerts.filter((alert) => alert.severity === 'high').length / totalAlerts) * 100)
      : 0,
    color: '#F97316',
  },
  {
    name: 'Medium',
    value: totalAlerts
      ? Math.round((alerts.filter((alert) => alert.severity === 'medium').length / totalAlerts) * 100)
      : 0,
    color: '#EAB308',
  },
  {
    name: 'Low',
    value: totalAlerts
      ? Math.round((alerts.filter((alert) => alert.severity === 'low').length / totalAlerts) * 100)
      : 0,
    color: '#22C55E',
  },
];

const recentAlerts = [...alerts]
  .sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  )
  .slice(0, 4)
  .map((alert) => ({
    id: alert.id,
    title: alert.title,
    description: alert.description,
    severity:
      alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1),
    source: alert.source,
    time: new Date(alert.createdAt).toLocaleString(),
    status:
      alert.status.charAt(0).toUpperCase() + alert.status.slice(1),
  }));

  // Temporary simulated system status data
  const systemComponents = [
  {
    name: 'Backend API',
    description: systemHealth?.service ?? 'Express server availability',
    status:
      systemHealth?.status === 'healthy'
        ? 'Operational'
        : systemHealth?.status === 'degraded'
          ? 'Degraded'
          : systemHealth?.status === 'down'
            ? 'Down'
            : 'Checking...',
  },
  {
    name: 'PostgreSQL Database',
    description: 'Database connectivity',
    status:
      databaseHealth?.database === 'connected'
        ? 'Operational'
        : databaseHealth?.database === 'disconnected'
          ? 'Down'
          : 'Checking...',
  },
  {
    name: 'Event Ingestion',
    description: 'No dedicated health endpoint configured',
    status: 'Not monitored',
  },
  {
    name: 'Alert Monitoring',
    description: 'No dedicated health endpoint configured',
    status: 'Not monitored',
  },
];


  const colorStyles: Record<string, string> = {
    blue: 'bg-blue-500/10 text-blue-400',
    amber: 'bg-amber-500/10 text-amber-400',
    red: 'bg-red-500/10 text-red-400',
    emerald: 'bg-emerald-500/10 text-emerald-400',
  };

  return (
    <div className="space-y-8">
      {/* Dashboard heading */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Security Overview
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Monitor your organization's security posture.
        </p>
      </div>
	{loading && (
 	 <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-4 	text-sm text-blue-400">
    	Loading dashboard data...
  	</div>
	)}

{error && (
  <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
    Failed to load dashboard data: {error}
  </div>
)}

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-slate-800 bg-[#0B1220] p-5 transition hover:border-slate-700"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-400">
                  {stat.title}
                </p>

                <div className={`rounded-lg p-2 ${colorStyles[stat.color]}`}>
                  <Icon size={20} />
                </div>
              </div>

              <div className="mt-4">
                <h2 className="text-3xl font-bold tracking-tight text-white">
                  {stat.value}
                </h2>

                <div className="mt-2 flex items-center gap-2">
                  <span className="flex items-center gap-1 text-xs font-medium text-emerald-400">
                    <TrendingUp size={13} />
                    {stat.change}
                  </span>

                  <span className="text-xs text-slate-500">
                    {stat.description}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Security Activity Chart */}
      <div className="rounded-xl border border-slate-800 bg-[#0B1220] p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Security Activity
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Security events recorded over the last 7 days
            </p>
          </div>

          <span className="rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-1.5 text-xs text-slate-300">
            Last 7 days
          </span>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={activityData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1E293B"
                vertical={false}
              />

              <XAxis
                dataKey="day"
                stroke="#64748B"
                tick={{ fill: '#94A3B8', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                stroke="#64748B"
                tick={{ fill: '#94A3B8', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#F1F5F9',
                }}
              />

              <Area
                type="monotone"
                dataKey="events"
                stroke="#3B82F6"
                strokeWidth={2.5}
                fill="url(#activityGradient)"
                activeDot={{ r: 5, fill: '#3B82F6' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Severity Distribution */}
      <div className="rounded-xl border border-slate-800 bg-[#0B1220] p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white">
            Severity Distribution
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Breakdown of security alerts by severity level
          </p>
        </div>

        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2">
          {/* Donut Chart */}
          <div className="relative h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>

<defs>
  {/* Critical gradient */}
  <linearGradient id="criticalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stopColor="#FF647C" />
    <stop offset="100%" stopColor="#991B3B" />
  </linearGradient>

  {/* High gradient */}
  <linearGradient id="highGradient" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stopColor="#FFB15C" />
    <stop offset="100%" stopColor="#C2410C" />
  </linearGradient>

  {/* Medium gradient */}
  <linearGradient id="mediumGradient" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stopColor="#FFE680" />
    <stop offset="100%" stopColor="#B7791F" />
  </linearGradient>

  {/* Low gradient */}
  <linearGradient id="lowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stopColor="#5FFFB0" />
    <stop offset="100%" stopColor="#047857" />
  </linearGradient>

  {/* Subtle neon glow */}
  <filter id="donutGlow" x="-30%" y="-30%" width="160%" height="160%">
    <feGaussianBlur stdDeviation="3" result="blur" />
    <feMerge>
      <feMergeNode in="blur" />
      <feMergeNode in="SourceGraphic" />
    </feMerge>
  </filter>
</defs>

                <Pie
  data={severityData}
  dataKey="value"
  nameKey="name"
  cx="50%"
  cy="50%"
  innerRadius={70}
  outerRadius={105}
  paddingAngle={0}
  stroke="none"
>
                  
{severityData.map((entry) => {
  const gradientMap: Record<string, string> = {
    Critical: 'url(#criticalGradient)',
    High: 'url(#highGradient)',
    Medium: 'url(#mediumGradient)',
    Low: 'url(#lowGradient)',
  };

  return (
    <Cell
      key={entry.name}
      fill={gradientMap[entry.name]}
      style={{ filter: 'url(#donutGlow)' }}
    />
  );
})}

                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#F1F5F9',
                  }}
                  formatter={(value) => [`${value}%`, 'Alerts']}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Donut center label */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-white">100%</span>
              <span className="text-xs text-slate-400">Total Alerts</span>
            </div>
          </div>

          {/* Severity Legend */}
          <div className="space-y-5">
            {severityData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  
<span
  className="h-3 w-3 rounded-full"
  style={{
    background: {
      Critical: 'linear-gradient(135deg, #FF647C, #991B3B)',
      High: 'linear-gradient(135deg, #FFB15C, #C2410C)',
      Medium: 'linear-gradient(135deg, #FFE680, #B7791F)',
      Low: 'linear-gradient(135deg, #5FFFB0, #047857)',
    }[item.name],
    boxShadow: {
      Critical: '0 0 8px rgba(255, 100, 124, 0.45)',
      High: '0 0 8px rgba(255, 177, 92, 0.45)',
      Medium: '0 0 8px rgba(255, 230, 128, 0.45)',
      Low: '0 0 8px rgba(95, 255, 176, 0.45)',
    }[item.name],
  }}
/>

                  <span className="text-sm text-slate-300">
                    {item.name}
                  </span>
                </div>

                <span className="text-sm font-semibold text-white">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Security Alerts */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0B1220]">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Recent Security Alerts
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Latest security alerts detected across your environment
            </p>
          </div>

          <span className="rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-1.5 text-xs text-slate-300">
            Latest 4 alerts
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/40">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Alert
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Severity
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Source IP
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Detected
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/70">
              {recentAlerts.map((alert) => (
                <tr
                  key={alert.id}
                  className="transition-colors hover:bg-slate-800/30"
                >
                  <td className="px-6 py-4">
                    <div className="min-w-[220px]">
                      <p className="text-sm font-medium text-slate-200">
                        {alert.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {alert.description}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-medium ${
                        {
                          Critical: 'border-red-500/20 bg-red-500/10 text-red-400',
                          High: 'border-orange-500/20 bg-orange-500/10 text-orange-400',
                          Medium: 'border-amber-500/20 bg-amber-500/10 text-amber-400',
                          Low: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400',
                        }[alert.severity]
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="font-mono text-xs text-slate-400">
                      {alert.source}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="whitespace-nowrap text-xs text-slate-400">
                      {alert.time}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-2 text-xs font-medium ${
                        {
                          Open: 'text-red-400',
                          Investigating: 'text-amber-400',
                          Resolved: 'text-emerald-400',
                        }[alert.status]
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {alert.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Status */}
      <div className="rounded-xl border border-slate-800 bg-[#0B1220] p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white">
            System Status
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Health overview of core platform components
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {systemComponents.map((component) => (
            <div
              key={component.name}
              className="rounded-lg border border-slate-800 bg-slate-900/40 p-4 transition hover:border-emerald-500/30"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-slate-200">
                  {component.name}
                </span>

                <span className="relative flex h-2 w-2">
  <span
    className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
      component.status === 'Operational'
        ? 'bg-emerald-400 animate-ping'
        : component.status === 'Down'
          ? 'bg-red-400'
          : 'bg-amber-400'
    }`}
  />
  <span
    className={`relative inline-flex h-2 w-2 rounded-full ${
      component.status === 'Operational'
        ? 'bg-emerald-400'
        : component.status === 'Down'
          ? 'bg-red-400'
          : 'bg-amber-400'
    }`}
  />
</span>
              </div>

              <p className="mt-2 text-xs text-slate-500">
                {component.description}
              </p>

              <div className="mt-4 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="text-xs font-medium text-emerald-400">
                  {component.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Overview;
