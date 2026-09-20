import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import NavbarAdmin from "../components/NavbarAdmin";
import {
  UserCog,
  LayoutDashboard,
  PackageSearch,
  ClipboardList,
  Shield,
  X,
} from "lucide-react";

function Admin() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { to: "/admin", key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    {
      to: "/admin/usermanagment",
      key: "usermanagment",
      label: "User Management",
      icon: UserCog,
    },
    {
      to: "/admin/productmanagement",
      key: "productmanagement",
      label: "Product Management",
      icon: PackageSearch,
    },
    {
      to: "/admin/orderdetails",
      key: "orderdetails",
      label: "Order Details",
      icon: ClipboardList,
    },
  ];

  // Helper to determine if a nav item is currently active (Dashboard selected by default)
  const checkIsActive = (item) => {
    if (item.key === "dashboard") {
      return (
        location.pathname === "/admin" ||
        location.pathname === "/admin/" ||
        location.pathname.endsWith("/dashboard")
      );
    }
    if (item.key === "usermanagment") {
      return (
        location.pathname.includes("usermanagment") ||
        location.pathname.includes("adduser")
      );
    }
    if (item.key === "productmanagement") {
      return (
        location.pathname.includes("productmanagement") ||
        location.pathname.includes("addproducts")
      );
    }
    return location.pathname.includes(item.key);
  };

  // Automatically close mobile sidebar whenever route changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

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
        className="fixed -top-40 -left-40 w-72 sm:w-96 h-72 sm:h-96 rounded-full opacity-[0.08] blur-3xl pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, #00E5FF, transparent 70%)",
        }}
      />
      <div
        className="fixed -bottom-40 -right-40 w-72 sm:w-96 h-72 sm:h-96 rounded-full opacity-[0.08] blur-3xl pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, #FF3D8A, transparent 70%)",
        }}
      />

      {/* navbar */}
      <div className="relative z-50">
        <NavbarAdmin
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />
      </div>

      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

          {/* SIDEBAR — Pure Neon Cyan (Scrollbar Hidden) */}
      <aside
        className={`fixed top-16 sm:top-20 lg:top-24 left-0 lg:left-4 bottom-0 lg:bottom-4 w-64 lg:w-64 clip-panel bg-[#0B0F17]/95 backdrop-blur-md border border-cyan-500/30 shadow-[0_0_30px_rgba(0,229,255,0.12)] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden z-40 transition-transform duration-300 ease-in-out flex flex-col justify-between ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Pure Cyan Neon Corner Crosshairs */}
        <span className="corner corner-tl hidden lg:block" style={{ borderColor: "#00E5FF" }} />
        <span className="corner corner-bl hidden lg:block" style={{ borderColor: "#00E5FF" }} />

        {/* TOP SECTION: HEADER & NAVIGATION */}
        <div>
          {/* Header with pure cyan ambient glow */}
          <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-cyan-500/15 via-cyan-500/5 to-transparent">
            <div className="flex items-center gap-2.5">
              {/* Cyan Glowing Shield Container */}
              <div className="w-8 h-8 rounded clip-btn bg-black/60 border border-cyan-400/60 flex items-center justify-center shadow-[0_0_14px_rgba(0,229,255,0.4)]">
                <Shield size={16} className="text-cyan-300" />
              </div>

              <div>
                <h2 className="font-display font-700 text-base tracking-wider uppercase bg-gradient-to-r from-cyan-200 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Control Deck
                </h2>
                <span className="font-tech text-[10px] text-cyan-400/80 uppercase tracking-widest block">
                  GameZone // Core
                </span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-cyan-400 transition-colors p-1"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links (Pure Cyan Lighting) */}
          <nav className="p-3.5 flex flex-col gap-2">
            {navItems.map((item) => {
              const { to, label, icon: Icon } = item;
              const isActive = checkIsActive(item);

              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`group relative flex items-center gap-3 px-3.5 py-2.5 clip-btn text-xs font-display font-700 tracking-wider uppercase transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-500/25 via-cyan-500/10 to-transparent border-l-2 border-cyan-400 text-white shadow-[0_0_18px_rgba(0,229,255,0.25)] font-semibold"
                      : "bg-white/[0.02] border-l-2 border-transparent text-gray-400 hover:bg-cyan-500/10 hover:border-cyan-400/50 hover:text-cyan-300 hover:translate-x-1 hover:shadow-[0_0_14px_rgba(0,229,255,0.15)]"
                  }`}
                >
                  {/* Icon Box */}
                  <div
                    className={`p-1.5 rounded clip-btn transition-colors ${
                      isActive
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_8px_rgba(0,229,255,0.4)]"
                        : "bg-black/40 border border-white/10 text-gray-400 group-hover:text-cyan-400 group-hover:border-cyan-400/40 group-hover:bg-cyan-500/10"
                    }`}
                  >
                    <Icon
                      size={15}
                      className={`transition-colors ${
                        isActive ? "text-cyan-300" : "text-gray-400 group-hover:text-cyan-400"
                      }`}
                    />
                  </div>

                  <span className="truncate">{label}</span>

                  {/* Active Neon Cyan Pulse Dot */}
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00E5FF] animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* BOTTOM SECTION: TELEMETRY / STATUS BADGE (Pure Cyan) */}
        <div className="p-3.5 m-3 clip-panel bg-black/60 border border-cyan-500/25 text-xs font-tech space-y-2 shadow-[0_0_15px_rgba(0,229,255,0.05)]">
          {/* Status Row */}
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-gray-400 uppercase tracking-widest">SYSTEM</span>
            <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              ONLINE
            </span>
          </div>

          {/* Cyan Neon Energy Bar */}
          <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-400 h-full w-full shadow-[0_0_8px_rgba(0,229,255,0.5)]" />
          </div>

          {/* Operator Identifier */}
          <div className="flex items-center justify-between text-[10px] text-gray-400 pt-0.5 font-mono">
            <span>OPERATOR: ROOT</span>
            <span className="text-cyan-400 font-bold">NODE #01</span>
          </div>
        </div>
      </aside>

      {/* main content — full width on mobile/tablet, indented for sidebar on desktop */}
      <main className="relative z-10 ml-0 lg:ml-72 pt-20 sm:pt-24 min-h-screen p-3 sm:p-6 transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
}

export default Admin;
