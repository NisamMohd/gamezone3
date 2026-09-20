import React from "react";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Logout } from "../../utils/Logout";
import { Menu, X } from "lucide-react";

function NavbarAdmin({ isSidebarOpen, toggleSidebar }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handlelogout = async (e) => {
    e.preventDefault();
    await Logout(dispatch, user?.id);
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-md border-b border-cyan-500/10 z-50 h-16 sm:h-20">
      <nav className="h-full px-3 sm:px-6 flex justify-between items-center">
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile / Tablet Sidebar Toggle Button */}
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={isSidebarOpen ? "Close navigation menu" : "Open navigation menu"}
            className="lg:hidden p-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded border border-cyan-500/30 transition-colors focus:outline-none"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <img
            src={logo}
            alt="Gamezone Admin"
            className="h-8 sm:h-10 md:h-11 w-auto object-contain drop-shadow-[0_0_12px_rgba(0,229,255,0.25)] cursor-pointer"
            onClick={() => navigate("/admin")}
          />
        </div>

        <button
          onClick={handlelogout}
          className="
            logout-btn
            flex
            items-center
            gap-1.5
            sm:gap-2.5
            clip-btn
            px-3
            sm:px-5
            py-1.5
            sm:py-2
            font-display
            font-700
            text-xs
            sm:text-sm
            tracking-wider
            transition-all
            duration-200
            cursor-pointer  
            whitespace-nowrap
            border
            hover:scale-105
            hover:shadow-[0_0_16px_rgba(255,61,138,0.4)]"
          style={{ background: "linear-gradient(120deg, #00E5FF, #FF3D8A)" }}
        >
          Logout
        </button>
      </nav>
    </header>
  );
}

export default NavbarAdmin;