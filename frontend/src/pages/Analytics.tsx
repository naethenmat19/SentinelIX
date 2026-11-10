
import { useEffect, useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import {
  Activity,
  ShieldAlert,
  AlertTriangle,
  FileWarning,
  RefreshCw,
} from 'lucide-react';

import {
  getSecurityEvents,
  type SecurityEvent,
} from '../services/securityEvent.service';
import { getAlerts, type Alert } from '../services/alert.service';
import {
  getIncidents,
  type Incident,
} from '../services/incident.service';

const COLORS = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e',
};

const Analytics = () => {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async (refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else setLoading(true);

      setError(null);

      const [eventData, alertData, incidentData] = await Promise.all([
        getSecurityEvents(),
        getAlerts(),
        getIncidents(),
      ]);

      setEvents(eventData);
      setAlerts(alertData);
      setIncidents(incidentData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load analytics data.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void fetchAnalytics();
  }, []);

  const severityData = useMemo(() => {
    const counts = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };

    events.forEach((event) => {
      counts[event.severity]++;
    });

    return Object.entries(counts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: COLORS[name as keyof typeof COLORS],
    }));
  }, [events]);

  const activityData = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (6 - index));

      return {
        date,
        label: date.toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
        }),
        events: 0,
      };
    });

    events.forEach((event) => {
      const eventDate = new Date(event.timestamp);
      const matchingDay = days.find(
        (day) => day.date.toDateString() === eventDate.toDateString()
      );

      if (matchingDay) matchingDay.events++;
    });

    return days.map(({ label, events: count }) => ({
      date: label,
      events: count,
    }));
  }, [events]);

  const eventTypeData = useMemo(() => {
    const counts: Record<string, number> = {};

    events.forEach((event) => {
      counts[event.eventType] = (counts[event.eventType] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [events]);

  const criticalCount = events.filter(
    (event) => event.severity === 'critical'
  ).length;

  const highCount = events.filter(
    (event) => event.severity === 'high'
  ).length;

  const openAlerts = alerts.filter(
    (alert) => alert.status !== 'resolved'
  ).length;

  const activeIncidents = incidents.filter(
    (incident) =>
      incident.status !== 'resolved' && incident.status !== 'closed'
  ).length;

  if (loading) {
    return (
      <div className="p-10 text-center text-slate-400">
        Loading threat analytics...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-slate-900 p-8 text-center">
        <p className="text-red-400">{error}</p>
        <button
          onClick={() => void fetchAnalytics()}
          className="mt-4 rounded-lg bg-slate-800 px-4 py-2 text-sm text-white hover:bg-slate-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Threat Analytics
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Analyze security events, threat severity and incident activity.
          </p>
        </div>

        <button
          onClick={() => void fetchAnalytics(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={refreshing ? 'animate-spin' : ''}
          />
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total Security Events"
          value={events.length}
          subtitle="Recorded events"
          icon={<Activity size={20} className="text-blue-400" />}
        />

        <MetricCard
          title="Critical Events"
          value={criticalCount}
          subtitle="Require immediate attention"
          icon={<ShieldAlert size={20} className="text-red-400" />}
        />

        <MetricCard
          title="High Severity Events"
          value={highCount}
          subtitle="High-priority activity"
          icon={<AlertTriangle size={20} className="text-orange-400" />}
        />

        <MetricCard
          title="Active Incidents"
          value={activeIncidents}
          subtitle={`${openAlerts} unresolved alerts`}
          icon={<FileWarning size={20} className="text-amber-400" />}
        />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Activity Trend */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-lg font-semibold text-white">
            Security Activity Trend
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Events recorded over the last 7 days
          </p>

          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient
                    id="eventGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#3b82f6"
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="95%"
                      stopColor="#3b82f6"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#334155"
                />

                <XAxis
                  dataKey="date"
                  stroke="#94a3b8"
                  fontSize={12}
                />

                <YAxis
                  allowDecimals={false}
                  stroke="#94a3b8"
                  fontSize={12}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="events"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#eventGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Distribution - Neon Donut */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-lg font-semibold text-white">
            Severity Distribution
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Breakdown of security events by severity
          </p>

          <div className="relative mt-6 h-72">
            {events.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">
                No event data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    <linearGradient
                      id="analyticsCriticalGradient"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#FF647C" />
                      <stop offset="100%" stopColor="#991B3B" />
                    </linearGradient>

                    <linearGradient
                      id="analyticsHighGradient"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#FFB15C" />
                      <stop offset="100%" stopColor="#C2410C" />
                    </linearGradient>

                    <linearGradient
                      id="analyticsMediumGradient"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#FFE680" />
                      <stop offset="100%" stopColor="#B7791F" />
                    </linearGradient>

                    <linearGradient
                      id="analyticsLowGradient"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#5FFFB0" />
                      <stop offset="100%" stopColor="#047857" />
                    </linearGradient>

                    <filter
                      id="analyticsDonutGlow"
                      x="-50%"
                      y="-50%"
                      width="200%"
                      height="200%"
                    >
                      <feGaussianBlur
                        stdDeviation="3"
                        result="coloredBlur"
                      />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  <Pie
                    data={severityData.filter((item) => item.value > 0)}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={105}
                    paddingAngle={0}
                    stroke="none"
                  >
                    {severityData
                      .filter((item) => item.value > 0)
                      .map((entry) => {
                        const gradientMap: Record<string, string> = {
                          Critical: 'url(#analyticsCriticalGradient)',
                          High: 'url(#analyticsHighGradient)',
                          Medium: 'url(#analyticsMediumGradient)',
                          Low: 'url(#analyticsLowGradient)',
                        };

                        return (
                          <Cell
                            key={entry.name}
                            fill={gradientMap[entry.name]}
                            style={{
                              filter: 'url(#analyticsDonutGlow)',
                            }}
                          />
                        );
                      })}
                  </Pie>

                  <Tooltip
                    formatter={(value) => [value, 'Events']}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}

            {events.length > 0 && (
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {events.length}
                </span>
                <span className="mt-1 text-xs text-slate-400">
                  Total Events
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Event Types */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
        <h2 className="text-lg font-semibold text-white">
          Top Threat Event Types
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Most frequently recorded security event categories
        </p>

        <div className="mt-6 h-72">
          {eventTypeData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">
              No event types available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={eventTypeData}
                layout="vertical"
                margin={{ left: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#334155"
                />

                <XAxis
                  type="number"
                  allowDecimals={false}
                  stroke="#94a3b8"
                />

                <YAxis
                  type="category"
                  dataKey="name"
                  width={150}
                  stroke="#94a3b8"
                  fontSize={12}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />

                <Bar
                  dataKey="count"
                  name="Events"
                  fill="#3b82f6"
                  radius={[0, 5, 5, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ReactNode;
}

const MetricCard = ({
  title,
  value,
  subtitle,
  icon,
}: MetricCardProps) => (
  <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
    <div className="flex items-center justify-between">
      <p className="text-sm text-slate-400">{title}</p>
      {icon}
    </div>

    <p className="mt-3 text-3xl font-bold text-white">{value}</p>

    <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
  </div>
);

export default Analytics;
