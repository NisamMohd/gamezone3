import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import NavbarAdmin from "../components/NavbarAdmin";
import {
  UserCog,
  LayoutDashboard,
  PackageSearch,
  ClipboardList,
  Shield,
} from "lucide-react";

function Admin() {
  const location = useLocation();

  const navItems = [
    { to: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "usermanagment", label: "User Management", icon: UserCog },
    {
      to: "productmanagement",
      label: "Product Management",
      icon: PackageSearch,
    },
    { to: "orderdetails", label: "Order Details", icon: ClipboardList },
  ];

  return (
    <div className="min-h-screen bg-black">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        .font-display { font-family: 'Rajdhani', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        .font-tech { font-family: 'JetBrains Mono', monospace; }

        .clip-panel {
          clip-path: polygon(0 16px, 16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%);
        }
        .clip-btn {
          clip-path: polygon(0 8px, 8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%);
        }
        .corner {
          position: absolute;
          width: 14px;
          height: 14px;
          border-color: #00E5FF;
          pointer-events: none;
        }
        .corner-tl { top: -1px; left: -1px; border-top: 2px solid; border-left: 2px solid; }
        .corner-bl { bottom: -1px; left: -1px; border-bottom: 2px solid; border-left: 2px solid; }

        .grid-bg {
          background-image:
            linear-gradient(rgba(0,229,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,229,255,0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>

      {/* ambient backdrop */}
      <div className="fixed inset-0 grid-bg pointer-events-none z-0" />
      <div
        className="fixed -top-40 -left-40 w-96 h-96 rounded-full opacity-[0.08] blur-3xl pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, #00E5FF, transparent 70%)",
        }}
      />
      <div
        className="fixed -bottom-40 -right-40 w-96 h-96 rounded-full opacity-[0.08] blur-3xl pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, #FF3D8A, transparent 70%)",
        }}
      />

      {/* navbar */}
      <div className="relative z-20">
        <NavbarAdmin />
      </div>

      {/* SIDEBAR — restyled to match Products filter panel */}
      <aside className="fixed top-24 left-4 bottom-4 w-64 clip-panel bg-[#0B0F17] border border-cyan-500/20 overflow-y-auto z-10">
        <span className="corner corner-tl" />
        <span className="corner corner-bl" />

        {/* panel header, matches "Filters" header style */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center gap-2">
          <Shield size={16} className="text-cyan-400" />
          <h2 className="font-display font-700 text-lg tracking-wide text-white">
            Admin Panel
          </h2>
        </div>

        <nav className="p-4 flex flex-col gap-1.5">
          {navItems.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname.includes(to);
            return (
              <Link
                key={to}
                to={to}
                className={`group relative flex items-center gap-2.5 px-3 py-2.5 clip-btn border font-body text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-300"
                    : "bg-white/[0.02] border-white/10 text-gray-300 hover:bg-cyan-500/5 hover:border-cyan-400/40 hover:text-white hover:translate-x-1 hover:shadow-[0_0_12px_rgba(0,229,255,0.15)]"
                }`}
              >
                <Icon
                  size={18}
                  className={`transition-colors ${
                    isActive
                      ? "text-cyan-400"
                      : "text-gray-400 group-hover:text-cyan-400"
                  }`}
                />
                <span
                  className={`transition-colors ${
                    isActive
                      ? "text-cyan-400"
                      : "text-gray-400 group-hover:text-cyan-400"
                  }`}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* main content */}
      <main className="relative z-10 ml-72 pt-24 min-h-screen p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default Admin;
