import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getDashboards, createDashboard, deleteDashboard } from '../services/dashboard';

function DashboardList({ user, onLogout }) {
  const navigate = useNavigate();
  const [dashboards, setDashboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDashboardName, setNewDashboardName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboards();
  }, []);

  const loadDashboards = async () => {
    try {
      setLoading(true);
      const data = await getDashboards();
      setDashboards(data);
    } catch (err) {
      setError('Failed to load dashboards');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDashboard = async (e) => {
    e.preventDefault();
    if (!newDashboardName.trim()) {
      setError('Dashboard name is required');
      return;
    }

    try {
      const dashboard = await createDashboard({ name: newDashboardName });
      setShowCreateModal(false);
      setNewDashboardName('');
      navigate(`/dashboards/${dashboard.id}`);
    } catch (err) {
      setError('Failed to create dashboard');
      console.error(err);
    }
  };

  const handleDeleteDashboard = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      await deleteDashboard(id);
      setDashboards(dashboards.filter(d => d.id !== id));
    } catch (err) {
      setError('Failed to delete dashboard');
      console.error(err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Intelli-CSV</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user.email}</span>
              <button
                onClick={onLogout}
                className="btn btn-secondary text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">My Dashboards</h2>
            <p className="mt-1 text-sm text-gray-600">
              Create and manage your data visualization dashboards
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            + New Dashboard
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboards...</p>
          </div>
        ) : dashboards.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No dashboards</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new dashboard.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary"
              >
                + Create Dashboard
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboards.map((dashboard) => (
              <div
                key={dashboard.id}
                className="card-hover animate-fade-in"
              >
                <Link to={`/dashboards/${dashboard.id}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {dashboard.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {dashboard.Charts?.length || 0} chart{dashboard.Charts?.length !== 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Updated {formatDate(dashboard.updatedAt)}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeleteDashboard(dashboard.id, dashboard.name);
                        }}
                        className="text-red-600 hover:text-red-700"
                        title="Delete dashboard"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Dashboard Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-slide-up">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Create New Dashboard
            </h3>
            <form onSubmit={handleCreateDashboard}>
              <div className="mb-4">
                <label htmlFor="dashboardName" className="block text-sm font-medium text-gray-700 mb-2">
                  Dashboard Name
                </label>
                <input
                  id="dashboardName"
                  type="text"
                  value={newDashboardName}
                  onChange={(e) => setNewDashboardName(e.target.value)}
                  className="input"
                  placeholder="e.g., Sales Analytics Q4"
                  autoFocus
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewDashboardName('');
                    setError('');
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardList;