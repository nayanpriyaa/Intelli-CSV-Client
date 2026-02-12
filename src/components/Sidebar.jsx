import { LayoutDashboard, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

function Sidebar({ user, onLogout }) {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname.startsWith(path);

  return (
    <aside className="w-64 bg-[#0f0f14] border-r border-white/10 flex flex-col px-6 py-6">
      {/* Brand */}
      <h1 className="text-xl font-semibold mb-10">
        IntelliCSV
      </h1>

      {/* Nav */}
      <nav className="flex flex-col gap-2 text-sm">
        <Link
          to="/dashboards"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
            isActive("/dashboards")
              ? "bg-white/10 text-white"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          <LayoutDashboard size={18} />
          Dashboards
        </Link>
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-6 border-t border-white/10">
        <p className="text-xs text-white/40 mb-3 truncate">
          {user.email}
        </p>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
