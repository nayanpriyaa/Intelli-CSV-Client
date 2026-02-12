import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  getDashboard,
  updateDashboard,
  addChart,
  updateChart,
  deleteChart,
} from "../services/dashboard";

import Sidebar from "../components/Sidebar";
import CsvUploader from "../components/CsvUploader";
import AddChartControls from "../components/AddChartControls";
import ChartRenderer from "../components/ChartRenderer";
import DataChatbot from "../components/DataChatbot";


function DashboardEditor({ user, onLogout }) {
  const { id } = useParams();

  const [dashboard, setDashboard] = useState(null);
  const [csvData, setCsvData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
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
    } catch {
      setError("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- HANDLERS ---------- */

  const handleCsvUpload = (data, file) => {
    setCsvData({ data, file });
  };

  const handleAddChart = async (spec) => {
    const chart = await addChart(id, spec);
    setDashboard({
      ...dashboard,
      Charts: [...(dashboard.Charts || []), chart],
    });
  };

  const handleUpdateChart = async (chartId, spec) => {
    await updateChart(id, chartId, spec);
    setDashboard({
      ...dashboard,
      Charts: dashboard.Charts.map((c) =>
        c.id === chartId ? { ...c, spec } : c
      ),
    });
    setEditingChart(null);
  };

  const handleDeleteChart = async (chartId) => {
    if (!window.confirm("Delete this chart?")) return;
    await deleteChart(id, chartId);
    setDashboard({
      ...dashboard,
      Charts: dashboard.Charts.filter((c) => c.id !== chartId),
    });
  };

  const handleRename = async () => {
    if (!newName.trim()) return;
    await updateDashboard(id, { name: newName });
    setDashboard({ ...dashboard, name: newName });
    setEditingName(false);
  };

  /* ---------- LOADING ---------- */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0b0e] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-white/60 text-sm">
            Loading dashboard…
          </p>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="min-h-screen bg-[#0b0b0e] flex items-center justify-center">
        <p className="text-red-400">Dashboard not found</p>
      </div>
    );
  }

  /* ---------- MAIN ---------- */

  return (
    <div className="min-h-screen bg-[#0b0b0e] text-white flex">
      {/* Sidebar */}
      <Sidebar user={user} onLogout={onLogout} />

      {/* Content */}
      <main className="flex-1 p-10 space-y-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex justify-between items-center"
        >
          <div className="flex items-center gap-4">
            <Link
              to="/dashboards"
              className="text-white/40 hover:text-white"
            >
              ←
            </Link>

            {editingName ? (
              <div className="flex items-center gap-2">
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleRename()
                  }
                  className="bg-[#111116] border border-white/15 rounded-lg px-3 py-1 text-sm"
                />
                <button
                  onClick={handleRename}
                  className="text-xs px-3 py-1 rounded bg-cyan-500 text-black"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingName(false);
                    setNewName(dashboard.name);
                  }}
                  className="text-xs text-white/50"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold">
                  {dashboard.name}
                </h1>
                <button
                  onClick={() => setEditingName(true)}
                  className="text-white/40 hover:text-white"
                >
                  ✎
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* CSV Upload */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <CsvUploader onUpload={handleCsvUpload} />
        </motion.section>
{csvData && <DataChatbot csvData={csvData.data} />}

        {/* Add Chart */}
        {csvData && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <AddChartControls
              csvData={csvData.data}
              onAddChart={handleAddChart}
              editingChart={editingChart}
              onUpdateChart={handleUpdateChart}
              onCancelEdit={() => setEditingChart(null)}
            />
          </motion.section>
        )}

        {/* Charts */}
        <section className="space-y-4">
          <h2 className="text-lg font-medium">
            Charts
          </h2>

          {dashboard.Charts?.length ? (
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: {
                  transition: {
                    staggerChildren: 0.08,
                  },
                },
              }}
            >
              {dashboard.Charts.map((chart) => (
                <motion.div
                  key={chart.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 },
                  }}
                  whileHover={{ scale: 1.015 }}
                  transition={{ duration: 0.25 }}
                >
                  <ChartRenderer
                    chart={chart}
                    csvData={csvData?.data}
                    onEdit={() => setEditingChart(chart)}
                    onDelete={() =>
                      handleDeleteChart(chart.id)
                    }
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="border border-white/10 rounded-xl p-12 text-center text-white/50">
              No charts yet. Upload a CSV and add your first
              chart.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default DashboardEditor;
