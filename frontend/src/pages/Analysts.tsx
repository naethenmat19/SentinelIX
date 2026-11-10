
import { useEffect, useState, type FormEvent } from 'react';
import { getUsers, createUser, type Analyst } from '../services/user.service';

const Analysts = () => {
  const [analysts, setAnalysts] = useState<Analyst[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'analyst',
  });

  const fetchAnalysts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUsers();
      setAnalysts(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch analysts'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchAnalysts();
  }, []);

  const handleCreateAnalyst = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError(null);

      const newAnalyst = await createUser(formData);
      setAnalysts((previous) => [newAnalyst, ...previous]);

      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'analyst',
      });

      setShowForm(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create analyst'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const analystCount = analysts.length;
  const seniorCount = analysts.filter(
    (analyst) => analyst.role === 'senior_analyst'
  ).length;
  const adminCount = analysts.filter(
    (analyst) => analyst.role === 'admin'
  ).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Analyst Management
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage SOC analysts and their platform roles.
          </p>
        </div>

        <button
          onClick={() => {
            setError(null);
            setShowForm(!showForm);
          }}
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500"
        >
          {showForm ? 'Cancel' : '+ Add Analyst'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Analyst Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-[#0B1220] p-5">
          <p className="text-sm text-slate-400">Total Analysts</p>
          <p className="mt-2 text-3xl font-bold text-white">
            {analystCount}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0B1220] p-5">
          <p className="text-sm text-slate-400">Senior Analysts</p>
          <p className="mt-2 text-3xl font-bold text-blue-400">
            {seniorCount}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0B1220] p-5">
          <p className="text-sm text-slate-400">Administrators</p>
          <p className="mt-2 text-3xl font-bold text-purple-400">
            {adminCount}
          </p>
        </div>
      </div>

      {/* Create Analyst Form */}
      {showForm && (
        <div className="rounded-xl border border-slate-800 bg-[#0B1220] p-6">
          <h2 className="mb-5 text-lg font-semibold text-white">
            Add New Analyst
          </h2>

          <form onSubmit={handleCreateAnalyst} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(event) =>
                    setFormData({ ...formData, name: event.target.value })
                  }
                  placeholder="Enter analyst name"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(event) =>
                    setFormData({ ...formData, email: event.target.value })
                  }
                  placeholder="analyst@sentinelx.local"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={(event) =>
                    setFormData({ ...formData, password: event.target.value })
                  }
                  placeholder="Minimum 8 characters"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Platform Role
                </label>
                <select
                  value={formData.role}
                  onChange={(event) =>
                    setFormData({ ...formData, role: event.target.value })
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                >
                  <option value="analyst">Analyst</option>
                  <option value="senior_analyst">Senior Analyst</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                disabled={submitting}
                className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500 disabled:opacity-50"
              >
                {submitting ? 'Adding...' : 'Add Analyst'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <p className="text-slate-400">Loading analysts...</p>
      )}

      {/* Empty State */}
      {!loading && !error && analysts.length === 0 && (
        <div className="rounded-xl border border-slate-800 bg-[#0B1220] p-8 text-center">
          <p className="text-slate-300">No analysts found.</p>
          <p className="mt-2 text-sm text-slate-500">
            Add an analyst to start managing your SOC team.
          </p>
        </div>
      )}

      {/* Analyst Cards */}
      {!loading && analysts.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {analysts.map((analyst) => (
            <div
              key={analyst.id}
              className="rounded-xl border border-slate-800 bg-[#0B1220] p-5 transition hover:border-slate-700"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-lg font-bold text-blue-400">
                  {analyst.name.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-white">
                    {analyst.name}
                  </h3>
                  <p className="truncate text-sm text-slate-400">
                    {analyst.email}
                  </p>
                </div>
              </div>

              <div className="mt-5 border-t border-slate-800 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Platform Role</span>
                  <span className="rounded-md bg-blue-500/10 px-2.5 py-1 text-xs font-medium capitalize text-blue-400">
                    {analyst.role.replace('_', ' ')}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm text-slate-400">Joined</span>
                  <span className="text-xs text-slate-300">
                    {new Date(analyst.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Analysts;
