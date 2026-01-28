import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  getDashboard,
  updateDashboard,
  addChart,
  updateChart,
  deleteChart,
} from '../services/dashboard';
import CsvUploader from '../components/CsvUploader';
import AddChartControls from '../components/AddChartControls';
import ChartRenderer from '../components/ChartRenderer';

function DashboardEditor({ user, onLogout }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [csvData, setCsvData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [editingChart, setEditingChart] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, [id]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await getDashboard(id);
      setDashboard(data);
      setNewName(data.name);
    } catch (err) {
      setError('Failed to load dashboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateName = async () => {
    if (!newName.trim()) return;

    try {
      await updateDashboard(id, { name: newName });
      setDashboard({ ...dashboard, name: newName });
      setEditingName(false);
    } catch (err) {
      setError('Failed to update dashboard name');
      console.error(err);
    }
  };

  const handleCsvUpload = (data, file) => {
    setCsvData({ data, file });
  };

  const handleAddChart = async (chartSpec) => {
    try {
      const newChart = await addChart(id, chartSpec);
      setDashboard({
        ...dashboard,
        Charts: [...(dashboard.Charts || []), newChart],
      });
    } catch (err) {
      setError('Failed to add chart');
      console.error(err);
    }
  };

  const handleUpdateChart = async (chartId, chartSpec) => {
    try {
      await updateChart(id, chartId, chartSpec);
      setDashboard({
        ...dashboard,
        Charts: dashboard.Charts.map((c) =>
          c.id === chartId ? { ...c, spec: chartSpec } : c
        ),
      });
      setEditingChart(null);
    } catch (err) {
      setError('Failed to update chart');
      console.error(err);
    }
  };

  const handleDeleteChart = async (chartId) => {
    if (!window.confirm('Are you sure you want to delete this chart?')) {
      return;
    }

    try {
      await deleteChart(id, chartId);
      setDashboard({
        ...dashboard,
        Charts: dashboard.Charts.filter((c) => c.id !== chartId),
      });
    } catch (err) {
      setError('Failed to delete chart');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600">Dashboard not found</p>
          <Link to="/dashboards" className="btn btn-primary mt-4">
            Back to Dashboards
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link to="/dashboards" className="text-gray-600 hover:text-gray-900">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </Link>
              {editingName ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="input"
                    onKeyPress={(e) => e.key === 'Enter' && handleUpdateName()}
                  />
                  <button onClick={handleUpdateName} className="btn btn-primary text-sm">
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingName(false);
                      setNewName(dashboard.name);
                    }}
                    className="btn btn-secondary text-sm"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold text-gray-900">{dashboard.name}</h1>
                  <button
                    onClick={() => setEditingName(true)}
                    className="text-gray-400 hover:text-gray-600"
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
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user.email}</span>
              <button onClick={onLogout} className="btn btn-secondary text-sm">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* CSV Uploader */}
        <div className="mb-8">
          <CsvUploader onUpload={handleCsvUpload} />
        </div>

        {/* Add Chart Controls */}
        {csvData && (
          <div className="mb-8">
            <AddChartControls
              csvData={csvData.data}
              onAddChart={handleAddChart}
              editingChart={editingChart}
              onUpdateChart={handleUpdateChart}
              onCancelEdit={() => setEditingChart(null)}
            />
          </div>
        )}

        {/* Charts Grid */}
        {dashboard.Charts && dashboard.Charts.length > 0 ? (
          <div className="space-y-8">
            <h2 className="text-xl font-semibold text-gray-900">Charts</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {dashboard.Charts.map((chart) => (
                <ChartRenderer
                  key={chart.id}
                  chart={chart}
                  csvData={csvData?.data}
                  onEdit={() => setEditingChart(chart)}
                  onDelete={() => handleDeleteChart(chart.id)}
                />
              ))}
            </div>
          </div>
        ) : (
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">No charts yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Upload a CSV file and add your first chart to get started.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default DashboardEditor;