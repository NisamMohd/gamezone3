import React, { useState, useEffect } from "react";
import logo from "../../assets/logo.png";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Logout } from "../../utils/Logout";
import {
  Menu,
  X,
  LogOut,
  ExternalLink,
  Shield,
  Activity,
  Clock,
  User,
} from "lucide-react";

function NavbarAdmin({ isSidebarOpen, toggleSidebar }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  // Live digital clock
  const [timeStr, setTimeStr] = useState("");
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    await Logout(dispatch, user?.id);
    navigate("/");
  };

  const adminName = user?.name || "Administrator";
  const initials = adminName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="fixed top-0 left-0 right-0 bg-[#0B0F17]/95 backdrop-blur-md border-b border-cyan-500/20 z-50 h-16 sm:h-20 shadow-lg shadow-cyan-500/5">
      <nav className="h-full px-3 sm:px-6 flex justify-between items-center max-w-[1600px] mx-auto">
        {/* LEFT: TOGGLE + LOGO + STOREFRONT LINK */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Mobile Sidebar Toggle Button */}
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
            className="lg:hidden p-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded border border-cyan-500/30 transition-colors cursor-pointer"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Gamezone Admin"
              className="h-8 sm:h-10 w-auto object-contain drop-shadow-[0_0_12px_rgba(0,229,255,0.35)] cursor-pointer hover:scale-105 transition-transform"
              onClick={() => navigate("/admin")}
            />
            <span className="hidden sm:inline-block font-tech text-[10px] text-cyan-400/70 uppercase tracking-[0.25em] border-l border-white/10 pl-3">
              CONSOLE_V3.0
            </span>
          </div>

          {/* Quick Storefront View Shortcut */}
          <Link
            to="/"
            className="hidden md:flex items-center gap-1.5 text-xs font-mono text-gray-400 hover:text-cyan-300 bg-white/[0.03] hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/30 px-3 py-1.5 rounded transition"
            title="Open customer storefront"
          >
            <ExternalLink size={13} />
            <span>Storefront</span>
          </Link>
        </div>

        {/* CENTER: LIVE HUD TELEMETRY & CLOCK (visible on tablet/desktop) */}
        <div className="hidden lg:flex items-center gap-4 text-xs font-mono text-gray-400">
          <div className="flex items-center gap-2 bg-black/40 border border-white/10 px-3 py-1 rounded">
            <Activity size={13} className="text-emerald-400 animate-pulse" />
            <span>SYS:</span>
            <span className="text-emerald-400 font-bold">ONLINE</span>
          </div>

          <div className="flex items-center gap-2 bg-black/40 border border-white/10 px-3 py-1 rounded">
            <Clock size={13} className="text-cyan-400" />
            <span className="text-white font-bold tracking-wider">{timeStr}</span>
          </div>
        </div>

        {/* RIGHT: ADMIN USER DOSSIER + LOGOUT */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Admin User Chip */}
          <div className="flex items-center gap-2.5 bg-black/50 border border-cyan-500/30 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-cyan-500/10 border border-cyan-400/40 text-cyan-300 font-tech font-bold text-xs flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(0,229,255,0.2)]">
              {initials}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="font-body text-xs text-white font-medium truncate max-w-[110px]">
                {adminName}
              </span>
              <span className="font-tech text-[9px] text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                <Shield size={10} /> ROOT_ADMIN
              </span>
            </div>
          </div>

          {/* Cyberpunk Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="clip-btn flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/40 text-pink-300 hover:text-pink-200 font-display font-700 text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 hover:shadow-[0_0_15px_rgba(255,61,138,0.35)] cursor-pointer"
          >
            <LogOut size={14} />
            <span className="hidden xs:inline">Logout</span>
          </button>
        </div>
      </nav>
    </header>
  );
}

export default NavbarAdmin;