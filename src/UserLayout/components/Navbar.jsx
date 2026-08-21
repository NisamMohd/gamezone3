import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, ShoppingCart, User } from "lucide-react";
import logo from "../../assets/logo.png";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const links = ["home", "products", "wishlists"];

  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAuth()

  return (
    <div className="fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-md border-b border-cyan-500/10 z-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        .font-display { font-family: 'Rajdhani', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        .font-tech { font-family: 'JetBrains Mono', monospace; }

        .clip-btn {
          clip-path: polygon(0 10px, 10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%);
        }
        .nav-link {
          position: relative;
          padding-bottom: 4px;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          height: 2px;
          width: 100%;
          background: linear-gradient(90deg, #00E5FF, #FF3D8A);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.2s ease;
        }
        .nav-link:hover::after,
        .nav-link.active::after {
          transform: scaleX(1);
        }
      `}</style>

      <nav className="max-w-[1500px] mx-auto h-20 px-4 flex items-center gap-6">

        {/* LOGO */}
        <Link to="/" className="shrink-0">
          <img
            src={logo}
            alt="Logo"
            className="h-12 w-auto object-contain drop-shadow-[0_0_12px_rgba(0,229,255,0.25)]"
          />
        </Link>

        {/* SEARCH BAR */}
        <div className="hidden md:flex flex-1 max-w-2xl relative">

          <input
            type="text"
            placeholder="Search for products, brands and more"
            className="
              w-full
              h-10
              clip-btn
              bg-[#0B0F17]
              border
              border-white/15
              px-4
              pr-12
              text-sm
              text-gray-200
              placeholder-gray-600
              font-body
              outline-none
              focus:border-cyan-400/50
              transition
            "
          />

          <button
            className="
              absolute
              right-0
              top-0
              h-10
              w-12
              flex
              items-center
              justify-center
              text-cyan-400
              hover:text-cyan-300
              transition
            "
          >
            <Search size={20} />
          </button>

        </div>

        {/* NAVIGATION */}
        <div className="hidden lg:flex items-center gap-8">

          {links.map((link) => {

            const isActive =
              (link === "home" && location.pathname === "/") ||
              (link !== "home" &&
                location.pathname.startsWith(`/${link}`));

            return (
              <Link
                key={link}
                to={link === "home" ? "/" : `/${link}`}
                className={`
                  nav-link
                  capitalize
                  text-sm
                  font-display
                  font-600
                  tracking-wide
                  transition
                  whitespace-nowrap
                  ${isActive ? "active text-cyan-400" : "text-gray-300 hover:text-white"}
                `}
              >
                {link}
              </Link>
            );
          })}

        </div>

        {/* CART + LOGIN */}
        <div className="flex items-center gap-6 ml-auto">

          <Link
            to="/cart"
            className="
              flex
              items-center
              gap-2
              text-gray-300
              font-display
              font-600
              text-sm
              hover:text-cyan-400
              transition
            "
          >
            <ShoppingCart size={20} />
            <span className="hidden sm:block">Cart</span>
          </Link>

          {user 
          ? <button
            className="
              hidden
              sm:flex
              items-center
              gap-2
              clip-btn
              text-black
              px-6
              py-2.5
              font-display
              font-600
              text-sm
              tracking-wide
              transition
              hover:brightness-110
              whitespace-nowrap
            "
            style={{ background: "linear-gradient(120deg, #00E5FF, #FF3D8A)" }}
          >
            {user.name}
          </button>
          :<button
            onClick={() => navigate("/login")}
            className="
              hidden
              sm:flex
              items-center
              gap-2
              clip-btn
              text-black
              px-6
              py-2.5
              font-display
              font-600
              text-sm
              tracking-wide
              transition
              hover:brightness-110
              whitespace-nowrap
            "
            style={{ background: "linear-gradient(120deg, #00E5FF, #FF3D8A)" }}
          >
            <User size={18} />
            Login
          </button> }

        </div>

      </nav>
    </div>
  );
}

export default Navbar;