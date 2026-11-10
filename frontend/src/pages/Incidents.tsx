
import { useEffect, useState, type FormEvent } from 'react';
import {
  getIncidents,
  createIncident,
  updateIncident,
  type Incident,
} from '../services/incident.service';

const Incidents = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [updatingIncidentId, setUpdatingIncidentId] = useState<string | null>(null);

  const [assignmentDrafts, setAssignmentDrafts] = useState<
    Record<string, string>
  >({});

  const [savedAssignmentId, setSavedAssignmentId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'medium' as Incident['severity'],
    assignedTo: '',
  });

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getIncidents();
        setIncidents(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to fetch incidents'
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchIncidents();
  }, []);

  // Update incident status
  const handleStatusChange = async (
    incidentId: string,
    newStatus: Incident['status']
  ) => {
    try {
      setUpdatingIncidentId(incidentId);
      setError(null);

      const updatedIncident = await updateIncident(incidentId, {
        status: newStatus,
      });

      setIncidents((previous) =>
        previous.map((incident) =>
          incident.id === incidentId ? updatedIncident : incident
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to update incident status'
      );
    } finally {
      setUpdatingIncidentId(null);
    }
  };

  // Update incident assignment
  const handleAssignmentSave = async (incidentId: string) => {
    try {
      setUpdatingIncidentId(incidentId);
      setError(null);
      setSavedAssignmentId(null);

      const assignedTo = assignmentDrafts[incidentId]?.trim() ?? '';

      const updatedIncident = await updateIncident(incidentId, {
        assignedTo: assignedTo || null,
      });

      setIncidents((previous) =>
        previous.map((incident) =>
          incident.id === incidentId ? updatedIncident : incident
        )
      );

      setAssignmentDrafts((previous) => ({
        ...previous,
        [incidentId]: updatedIncident.assignedTo ?? '',
      }));

      setSavedAssignmentId(incidentId);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to update incident assignment'
      );
    } finally {
      setUpdatingIncidentId(null);
    }
  };

  // Create a new incident
  const handleCreateIncident = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError(null);

      const newIncident = await createIncident({
        title: formData.title,
        description: formData.description,
        severity: formData.severity,
        ...(formData.assignedTo.trim() && {
          assignedTo: formData.assignedTo.trim(),
        }),
      });

      setIncidents((previous) => [newIncident, ...previous]);

      setFormData({
        title: '',
        description: '',
        severity: 'medium',
        assignedTo: '',
      });

      setShowForm(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to create incident'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Incident Management
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Track, investigate, and manage security incidents.
          </p>
        </div>

        <button
          onClick={() => {
            setError(null);
            setShowForm(!showForm);
          }}
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500"
        >
          {showForm ? 'Cancel' : '+ Create Incident'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Create Incident Form */}
      {showForm && (
        <div className="rounded-xl border border-slate-800 bg-[#0B1220] p-6">
          <h2 className="mb-5 text-lg font-semibold text-white">
            Create New Incident
          </h2>

          <form onSubmit={handleCreateIncident} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Incident Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    title: event.target.value,
                  })
                }
                placeholder="e.g. Suspicious Network Activity"
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Description
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    description: event.target.value,
                  })
                }
                placeholder="Describe the incident and its potential impact..."
                className="w-full resize-y rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Severity
                </label>
                <select
                  value={formData.severity}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      severity: event.target.value as Incident['severity'],
                    })
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                >
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Assigned To (Optional)
                </label>
                <input
                  type="text"
                  value={formData.assignedTo}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      assignedTo: event.target.value,
                    })
                  }
                  placeholder="Enter analyst name"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                disabled={submitting}
                className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? 'Creating...' : 'Create Incident'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <p className="text-slate-400">Loading incidents...</p>
      )}

      {/* Empty State */}
      {!loading && !error && incidents.length === 0 && (
        <div className="rounded-xl border border-slate-800 bg-[#0B1220] p-8 text-center">
          <p className="text-slate-300">No incidents found.</p>
          <p className="mt-2 text-sm text-slate-500">
            Create an incident to start managing security investigations.
          </p>
        </div>
      )}

      {/* Incidents Table */}
      {!loading && incidents.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#0B1220]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
              <tr>
                <th className="px-5 py-4">Incident</th>
                <th className="px-5 py-4">Severity</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Assigned To</th>
                <th className="px-5 py-4">Created</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800">
              {incidents.map((incident) => (
                <tr
                  key={incident.id}
                  className="transition hover:bg-slate-800/40"
                >
                  {/* Incident Details */}
                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-200">
                      {incident.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {incident.description}
                    </p>
                  </td>

                  {/* Severity */}
                  <td className="px-5 py-4">
                    <span className="rounded-md bg-slate-800 px-2.5 py-1 text-xs font-medium capitalize text-slate-300">
                      {incident.severity}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <select
                      value={incident.status}
                      onChange={(event) =>
                        handleStatusChange(
                          incident.id,
                          event.target.value as Incident['status']
                        )
                      }
                      disabled={updatingIncidentId === incident.id}
                      className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-medium capitalize text-blue-400 outline-none transition focus:border-blue-500 disabled:cursor-wait disabled:opacity-50"
                    >
                      <option value="open">Open</option>
                      <option value="investigating">Investigating</option>
                      <option value="contained">Contained</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>

                    {updatingIncidentId === incident.id && (
                      <span className="ml-2 text-xs text-slate-500">
                        Updating...
                      </span>
                    )}
                  </td>

                  {/* Analyst Assignment */}
                  <td className="px-5 py-4">
                    <div className="flex min-w-[220px] items-center gap-2">
                      <input
                        type="text"
                        value={
                          assignmentDrafts[incident.id] ??
                          incident.assignedTo ??
                          ''
                        }
                        onChange={(event) => {
                          setAssignmentDrafts((previous) => ({
                            ...previous,
                            [incident.id]: event.target.value,
                          }));
                          setSavedAssignmentId(null);
                        }}
                        placeholder="Enter analyst name"
                        disabled={updatingIncidentId === incident.id}
                        className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 disabled:opacity-50"
                      />

                      <button
                        onClick={() => handleAssignmentSave(incident.id)}
                        disabled={updatingIncidentId === incident.id}
                        className={`rounded-md px-3 py-2 text-xs font-medium text-white transition disabled:cursor-wait disabled:opacity-50 ${
                          savedAssignmentId === incident.id
                            ? 'bg-emerald-600'
                            : 'bg-blue-600 hover:bg-blue-500'
                        }`}
                      >
                        {updatingIncidentId === incident.id
                          ? 'Saving...'
                          : savedAssignmentId === incident.id
                            ? 'Saved ✓'
                            : 'Save'}
                      </button>
                    </div>

                    {savedAssignmentId === incident.id && (
                      <p className="mt-2 text-xs text-emerald-400">
                        Assignment saved successfully.
                      </p>
                    )}
                  </td>

                  {/* Created Date */}
                  <td className="px-5 py-4 text-slate-400">
                    {new Date(incident.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Incidents;
