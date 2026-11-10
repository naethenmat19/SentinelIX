
import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  RefreshCw,
  ShieldAlert,
  AlertTriangle,
  Info,
  Activity,
} from 'lucide-react';
import {
  getSecurityEvents,
  type SecurityEvent,
} from '../services/securityEvent.service';

type SeverityFilter = 'all' | SecurityEvent['severity'];

const severityStyles: Record<SecurityEvent['severity'], string> = {
  critical: 'bg-red-500/10 text-red-400 border-red-500/20',
  high: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};

const SecurityEvents = () => {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] =
    useState<SeverityFilter>('all');

  const fetchEvents = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);
      const data = await getSecurityEvents();
      setEvents(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load security events.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    const searchTerm = search.toLowerCase().trim();

    return events.filter((event) => {
      const matchesSearch =
        !searchTerm ||
        event.eventType.toLowerCase().includes(searchTerm) ||
        event.description.toLowerCase().includes(searchTerm) ||
        event.sourceIp.toLowerCase().includes(searchTerm) ||
        (event.destinationIp ?? '').toLowerCase().includes(searchTerm);

      const matchesSeverity =
        severityFilter === 'all' ||
        event.severity === severityFilter;

      return matchesSearch && matchesSeverity;
    });
  }, [events, search, severityFilter]);

  const criticalCount = events.filter(
    (event) => event.severity === 'critical'
  ).length;

  const highCount = events.filter(
    (event) => event.severity === 'high'
  ).length;

  const mediumCount = events.filter(
    (event) => event.severity === 'medium'
  ).length;

  const lowCount = events.filter(
    (event) => event.severity === 'low'
  ).length;

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
      return 'Invalid date';
    }

    return date.toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Security Events
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Monitor and investigate security activity across your environment.
          </p>
        </div>

        <button
          onClick={() => void fetchEvents(true)}
          disabled={loading || refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={refreshing ? 'animate-spin' : ''}
          />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Total Events</p>
            <Activity className="text-blue-400" size={20} />
          </div>
          <p className="mt-3 text-3xl font-bold text-white">
            {events.length}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Recorded security events
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Critical</p>
            <ShieldAlert className="text-red-400" size={20} />
          </div>
          <p className="mt-3 text-3xl font-bold text-red-400">
            {criticalCount}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Critical severity events
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">High Severity</p>
            <AlertTriangle className="text-orange-400" size={20} />
          </div>
          <p className="mt-3 text-3xl font-bold text-orange-400">
            {highCount}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            High severity events
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Other Events</p>
            <Info className="text-amber-400" size={20} />
          </div>
          <p className="mt-3 text-3xl font-bold text-white">
            {mediumCount + lowCount}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Medium and low severity
          </p>
        </div>
      </div>

      {/* Events table */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
        <div className="flex flex-col gap-4 border-b border-slate-800 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Event Log
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              {filteredEvents.length} of {events.length} events displayed
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events or IPs..."
                className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500 sm:w-64"
              />
            </div>

            <select
              value={severityFilter}
              onChange={(e) =>
                setSeverityFilter(e.target.value as SeverityFilter)
              }
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 outline-none focus:border-blue-500"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-slate-400">
            Loading security events...
          </div>
        ) : error ? (
          <div className="p-10 text-center">
            <p className="text-sm text-red-400">{error}</p>
            <button
              onClick={() => void fetchEvents()}
              className="mt-4 rounded-lg bg-slate-800 px-4 py-2 text-sm text-slate-200 hover:bg-slate-700"
            >
              Try Again
            </button>
          </div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center">
            <Activity className="mx-auto mb-3 text-slate-600" size={32} />
            <p className="text-sm font-medium text-slate-300">
              No security events found
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Events will appear here when they are recorded.
            </p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="p-12 text-center">
            <Search className="mx-auto mb-3 text-slate-600" size={30} />
            <p className="text-sm font-medium text-slate-300">
              No matching events
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Try changing your search or severity filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-800/50">
                <tr className="text-xs uppercase tracking-wider text-slate-400">
                  <th className="px-5 py-4 font-medium">Event</th>
                  <th className="px-5 py-4 font-medium">Source IP</th>
                  <th className="px-5 py-4 font-medium">Destination IP</th>
                  <th className="px-5 py-4 font-medium">Severity</th>
                  <th className="px-5 py-4 font-medium">Timestamp</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {filteredEvents.map((event) => (
                  <tr
                    key={event.id}
                    className="transition hover:bg-slate-800/40"
                  >
                    <td className="max-w-xs px-5 py-4">
                      <p className="text-sm font-medium text-slate-200">
                        {event.eventType}
                      </p>
                      <p className="mt-1 truncate text-xs text-slate-500">
                        {event.description}
                      </p>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 font-mono text-sm text-slate-300">
                      {event.sourceIp}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 font-mono text-sm text-slate-300">
                      {event.destinationIp || '—'}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${severityStyles[event.severity]}`}
                      >
                        {event.severity}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-400">
                      {formatTimestamp(event.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityEvents;
