import { useEffect, useState } from 'react';
import { getAlerts, type Alert } from '../services/alert.service';

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchAlerts = async () => {
    try {
      setLoading(true);

      const data = await getAlerts();

      setAlerts(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch alerts'
      );
    } finally {
      setLoading(false);
    }
  };

  void fetchAlerts();
}, []);
  
return (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-white">Security Alerts</h1>
      <p className="mt-1 text-sm text-slate-400">
        Monitor and investigate detected security threats.
      </p>
    </div>

    {loading && (
      <p className="text-slate-400">Loading alerts...</p>
    )}

    {error && (
      <p className="text-red-400">{error}</p>
    )}

    {!loading && !error && alerts.length === 0 && (
      <p className="text-slate-400">No alerts found.</p>
    )}

    {!loading && !error && alerts.length > 0 && (
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#0B1220]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
            <tr>
              <th className="px-5 py-4">Alert</th>
              <th className="px-5 py-4">Severity</th>
              <th className="px-5 py-4">Source IP</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Detected</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800">
            {alerts.map((alert) => (
              <tr key={alert.id} className="transition hover:bg-slate-800/40">
                <td className="px-5 py-4">
                  <p className="font-medium text-slate-200">
                    {alert.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {alert.description}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <span className="rounded-md bg-slate-800 px-2.5 py-1 text-xs font-medium capitalize text-slate-300">
                    {alert.severity}
                  </span>
                </td>

                <td className="px-5 py-4 font-mono text-slate-300">
                  {alert.source}
                </td>

                <td className="px-5 py-4">
                  <span className="rounded-md bg-blue-500/10 px-2.5 py-1 text-xs font-medium capitalize text-blue-400">
                    {alert.status}
                  </span>
                </td>

                <td className="px-5 py-4 text-slate-400">
                  {new Date(alert.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);};

export default Alerts;