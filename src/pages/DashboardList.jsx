import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  getDashboards,
  createDashboard,
  deleteDashboard,
} from "../services/dashboard";
import Sidebar from "../components/Sidebar";
import DataChatbot from "../components/DataChatbot";




function DashboardList({ user, onLogout }) {
  const navigate = useNavigate();
  const [dashboards, setDashboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboards();
  }, []);

  const loadDashboards = async () => {
    try {
      setLoading(true);
      const data = await getDashboards();
      setDashboards(data);
    } catch {
      setError("Failed to load dashboards");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!name.trim()) return;

    const dash = await createDashboard({ name });
    navigate(`/dashboards/${dash.id}`);
  };

  const handleDelete = async (id, e) => {
    e.preventDefault();
    if (!window.confirm("Delete this dashboard?")) return;

    await deleteDashboard(id);
    setDashboards(dashboards.filter((d) => d.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0b0b0e] text-white flex">
      <Sidebar user={user} onLogout={onLogout} />

      {/* Main */}
      <main className="flex-1 p-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-semibold">
                Dashboards
              </h2>
              <p className="text-white/50 mt-1">
                Create, manage, and explore your analytics
              </p>
            </div>

            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 bg-cyan-500 text-black px-4 py-2 rounded-lg hover:bg-cyan-400 transition"
            >
              <Plus size={18} />
              New Dashboard
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Content */}
          {loading ? (
            <div className="text-white/50">
              Loading dashboards…
            </div>
          ) : dashboards.length === 0 ? (
            /* EMPTY STATE */
            <div className="border border-white/10 rounded-2xl p-16 text-center">
              <motion.img
  src="/illustrations/empty-dashboard.svg"
  alt="Empty dashboards"
  className="w-56 mx-auto mb-6 opacity-80"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: [0, -10, 0] }}
  transition={{
    opacity: { duration: 0.4 },
    y: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  }}
/>

              <p className="text-white/60">
                No dashboards yet. Create one to get started.
              </p>
            </div>
          ) : (
            /* GRID */
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: {
                  transition: { staggerChildren: 0.08 },
                },
              }}
            >
              {dashboards.map((d) => (
                <motion.div
                  key={d.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 },
                  }}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.25 }}
                >
                  <Link
                    to={`/dashboards/${d.id}`}
                    className="block bg-[#0f0f14] border border-white/10 rounded-2xl p-6 h-full hover:border-cyan-400/50 transition"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium mb-1">
                          {d.name}
                        </h3>
                        <p className="text-xs text-white/50">
                          {d.Charts?.length || 0} charts
                        </p>
                      </div>

                      <button
                        onClick={(e) =>
                          handleDelete(d.id, e)
                        }
                        className="text-white/30 hover:text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
        
      </main>

      {/* CREATE MODAL */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <motion.div
            className="bg-[#0f0f14] border border-white/10 rounded-2xl p-6 w-full max-w-sm"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3 className="text-lg font-medium mb-4">
              Create dashboard
            </h3>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Dashboard name"
              className="w-full bg-[#111116] border border-white/15 rounded-lg px-3 py-2 text-sm text-white outline-none mb-4"
              autoFocus
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCreate(false)}
                className="text-sm text-white/50 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="bg-cyan-500 text-black px-4 py-2 rounded-lg text-sm"
              >
                Create
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default DashboardList;
