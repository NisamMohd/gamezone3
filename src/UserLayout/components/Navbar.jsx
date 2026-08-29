import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  ShoppingCart,
  User,
  X,
  ArrowRight,
  Package,
  IndianRupee,
  Settings,
  LogOut,
  ChevronDown,
  Heart,
  ShieldCheck,
  Sliders,
} from "lucide-react";
import logo from "../../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { clearCart } from "../redux/features/cartSlice";
import { clearWishlist } from "../redux/features/wishlistSlice";
import { clearOrders } from "../redux/features/orderSlice";
import api from "../services/api";

function Navbar() {
  const links = ["home", "products", "wishlists"];
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const searchContainerRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const userDropdownRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const cartItems = useSelector((state) => state.cart.items || []);
  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(e.target)
      ) {
        setIsDropdownOpen(false);
      }

      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target)
      ) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setIsDropdownOpen(false);
    setMobileSearchOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  // Debounced search query to server
  useEffect(() => {
    const trimmed = searchTerm.trim();
    if (!trimmed) {
      setSearchResults([]);
      setIsSearching(false);
      setIsDropdownOpen(false);
      return;
    }

    setIsSearching(true);
    setIsDropdownOpen(true);

    const timer = setTimeout(async () => {
      try {
        const { data } = await api.get("/products");
        const query = trimmed.toLowerCase();
        const matches = data.filter((item) => {
          const title = (item.title || "").toLowerCase();
          const desc = (item.description || "").toLowerCase();
          const cat = (item.category || "").toLowerCase();
          return title.includes(query) || desc.includes(query) || cat.includes(query);
        });
        setSearchResults(matches);
      } catch (error) {
        console.error("Live search failed:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchTerm.trim();
    setIsDropdownOpen(false);
    setMobileSearchOpen(false);
    if (query) {
      navigate(`/products?search=${encodeURIComponent(query)}`);
    } else {
      navigate("/products");
    }
  };

  const handleSelectProduct = (productId) => {
    setIsDropdownOpen(false);
    setMobileSearchOpen(false);
    navigate(`/products/${productId}`);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    setUserDropdownOpen(false);
    if (logout) logout();
    dispatch(clearCart());
    dispatch(clearWishlist());
    dispatch(clearOrders());
    toast.info("Logged Out", "You have been safely disconnected from your session.");
    navigate("/login");
  };

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
        .clip-panel {
          clip-path: polygon(0 14px, 14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%);
        }
        .corner {
          position: absolute;
          width: 10px;
          height: 10px;
          border-color: #00E5FF;
          pointer-events: none;
        }
        .corner-tl { top: -1px; left: -1px; border-top: 1.5px solid; border-left: 1.5px solid; }
        .corner-br { bottom: -1px; right: -1px; border-bottom: 1.5px solid; border-right: 1.5px solid; }

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

      {/* FULL WIDTH NAVBAR WITH PADDING PUSHING USER/CART TO RIGHT EDGE */}
      <nav className="w-full max-w-[1700px] mx-auto h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 sm:gap-6">

        {/* LOGO */}
        <Link to="/" className="shrink-0">
          <img
            src={logo}
            alt="GameZone Logo"
            className="h-11 sm:h-12 w-auto object-contain drop-shadow-[0_0_12px_rgba(0,229,255,0.25)]"
          />
        </Link>

        {/* DESKTOP SEARCH BAR WITH LIVE HUD DROPDOWN */}
        <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-xl lg:max-w-2xl relative">
          <form onSubmit={handleSearchSubmit} className="w-full relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => {
                if (searchTerm.trim()) setIsDropdownOpen(true);
              }}
              placeholder="Search gear, consoles, controllers, accessories..."
              className="
                w-full
                h-10
                clip-btn
                bg-[#0B0F17]
                border
                border-white/15
                px-4
                pr-20
                text-sm
                text-gray-200
                placeholder-gray-600
                font-body
                outline-none
                focus:border-cyan-400/50
                focus:shadow-[0_0_15px_rgba(0,229,255,0.15)]
                transition
              "
            />

            {/* CLEAR BUTTON */}
            {searchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-10 top-0 h-10 w-8 flex items-center justify-center text-gray-500 hover:text-pink-400 transition"
                title="Clear search"
              >
                <X size={16} />
              </button>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="
                absolute
                right-0
                top-0
                h-10
                w-10
                flex
                items-center
                justify-center
                text-cyan-400
                hover:text-cyan-300
                transition
              "
              aria-label="Search"
            >
              <Search size={18} />
            </button>
          </form>

          {/* LIVE SEARCH RESULTS DROPDOWN */}
          {isDropdownOpen && searchTerm.trim() && (
            <div className="absolute top-12 left-0 right-0 clip-panel bg-[#0B0F17]/95 backdrop-blur-xl border border-cyan-500/30 shadow-[0_15px_40px_rgba(0,0,0,0.9)] overflow-hidden z-50 max-h-[420px] flex flex-col">
              {/* DROPDOWN HEADER */}
              <div className="px-4 py-2.5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="font-tech text-[10px] tracking-[0.2em] text-cyan-400 uppercase">
                    SERVER SCAN // {searchResults.length} ITEMS FOUND
                  </span>
                </div>
                {isSearching && (
                  <span className="font-tech text-[10px] text-cyan-400 animate-pulse">
                    SEARCHING…
                  </span>
                )}
              </div>

              {/* SEARCH RESULTS LIST */}
              <div className="overflow-y-auto p-2 space-y-1 divide-y divide-white/5">
                {isSearching && searchResults.length === 0 ? (
                  <div className="py-8 text-center text-cyan-400/70 font-tech text-xs animate-pulse">
                    SCANNING INVENTORY DATABASE…
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.slice(0, 6).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelectProduct(item.id)}
                      className="pt-1.5 pb-1.5 px-3 flex items-center gap-3 hover:bg-cyan-500/10 cursor-pointer rounded transition group"
                    >
                      <div className="w-11 h-11 bg-white/5 border border-white/10 rounded flex items-center justify-center p-1 shrink-0 overflow-hidden group-hover:border-cyan-400/40">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-body text-gray-200 truncate group-hover:text-cyan-300 transition">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-tech text-[10px] text-gray-500 uppercase">
                            {item.category}
                          </span>
                          <span className="text-gray-600 text-[10px]">•</span>
                          {item.stock > 0 ? (
                            <span className="font-tech text-[10px] text-emerald-400">
                              In Stock
                            </span>
                          ) : (
                            <span className="font-tech text-[10px] text-pink-400">
                              Out of Stock
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-display font-bold text-sm text-white flex items-center justify-end">
                          <IndianRupee size={12} className="text-white" />
                          <span>{Number(item.price).toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center">
                    <Package className="w-8 h-8 mx-auto text-gray-600 mb-2" />
                    <p className="font-tech text-xs text-gray-400">
                      NO MATCHING GEAR IN INVENTORY
                    </p>
                    <p className="font-body text-[11px] text-gray-600 mt-1">
                      Try searching by console name, brand, or model
                    </p>
                  </div>
                )}
              </div>

              {/* DROPDOWN FOOTER CTA */}
              {searchResults.length > 0 && (
                <div className="p-2 border-t border-white/10 bg-white/[0.02]">
                  <button
                    type="button"
                    onClick={handleSearchSubmit}
                    className="w-full clip-btn py-2 px-4 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-tech text-xs flex items-center justify-center gap-2 transition"
                  >
                    <span>VIEW ALL RESULTS ({searchResults.length})</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* NAVIGATION LINKS */}
        <div className="hidden lg:flex items-center gap-8">
          {links.map((link) => {
            const isActive =
              (link === "home" && location.pathname === "/") ||
              (link !== "home" && location.pathname.startsWith(`/${link}`));

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

        {/* RIGHT SIDE: CART + USERNAME BUTTON & DROPDOWN (ALIGNED TO RIGHT EDGE) */}
        <div className="flex items-center gap-4 sm:gap-6 ml-auto">

          {/* MOBILE SEARCH TOGGLE */}
          <button
            type="button"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="md:hidden text-gray-300 hover:text-cyan-400 p-1.5 transition"
            aria-label="Toggle search"
          >
            <Search size={20} />
          </button>

          {/* CART ICON WITH BADGE */}
          <Link
            to="/cart"
            className="
              relative
              flex
              items-center
              gap-2
              text-gray-300
              font-display
              font-600
              text-sm
              hover:text-cyan-400
              transition
              py-2
            "
          >
            <div className="relative">
              <ShoppingCart size={21} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2.5 bg-pink-500 text-white font-tech text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(255,61,138,0.7)] animate-pulse">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">Cart</span>
          </Link>

          {/* USER PROFILE OR LOGIN BUTTON */}
          {user ? (
            <div ref={userDropdownRef} className="relative">
              {/* USERNAME BUTTON */}
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className={`
                  flex
                  items-center
                  gap-2.5
                  clip-btn
                  px-4
                  sm:px-5
                  py-2.5
                  font-display
                  font-700
                  text-sm
                  tracking-wider
                  transition
                  cursor-pointer
                  whitespace-nowrap
                  border
                  ${
                    userDropdownOpen
                      ? "border-cyan-400 bg-cyan-400/20 text-cyan-300 shadow-[0_0_20px_rgba(0,229,255,0.25)]"
                      : "border-cyan-500/40 text-black hover:brightness-110"
                  }
                `}
                style={
                  !userDropdownOpen
                    ? { background: "linear-gradient(120deg, #00E5FF, #FF3D8A)" }
                    : {}
                }
              >
                <div className="w-5 h-5 rounded-full bg-black/30 flex items-center justify-center text-xs">
                  <User size={13} className={userDropdownOpen ? "text-cyan-300" : "text-black"} />
                </div>
                <span className="max-w-[120px] truncate">{user.name}</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    userDropdownOpen ? "rotate-180 text-cyan-300" : "text-black"
                  }`}
                />
              </button>

              {/* USER DROPDOWN MENU */}
              {userDropdownOpen && (
                <div className="absolute right-0 top-12 w-64 clip-panel bg-[#0B0F17]/95 backdrop-blur-xl border border-cyan-500/30 shadow-[0_15px_40px_rgba(0,0,0,0.9)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <span className="corner corner-tl" />
                  <span className="corner corner-br" />

                  {/* USER INFO HEADER */}
                  <div className="px-4 py-3.5 border-b border-white/10 bg-white/[0.02]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shrink-0">
                        <User size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-bold text-sm text-white truncate">
                          {user.name}
                        </p>
                        <p className="font-body text-[11px] text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between font-tech text-[10px]">
                      <span className="text-cyan-400 tracking-wider">
                        STATUS: OPERATIVE
                      </span>
                      <span className="text-emerald-400 flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        ONLINE
                      </span>
                    </div>
                  </div>

                  {/* DROPDOWN MENU ITEMS */}
                  <div className="p-1.5 space-y-1">
                    {/* ORDERS */}
                    <Link
                      to="/orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded text-xs font-body text-gray-200 hover:text-cyan-300 hover:bg-cyan-500/10 transition group"
                    >
                      <Package
                        size={16}
                        className="text-gray-400 group-hover:text-cyan-400 transition"
                      />
                      <div className="flex-1">
                        <span className="font-semibold block">My Orders</span>
                        <span className="text-[10px] text-gray-500 block">
                          View purchased equipment logs
                        </span>
                      </div>
                      <ArrowRight
                        size={12}
                        className="text-gray-600 group-hover:text-cyan-400 transition"
                      />
                    </Link>

                    {/* WISHLIST */}
                    <Link
                      to="/wishlists"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded text-xs font-body text-gray-200 hover:text-pink-300 hover:bg-pink-500/10 transition group"
                    >
                      <Heart
                        size={16}
                        className="text-gray-400 group-hover:text-pink-400 transition"
                      />
                      <div className="flex-1">
                        <span className="font-semibold block">Saved Wishlist</span>
                        <span className="text-[10px] text-gray-500 block">
                          Your armory favorites
                        </span>
                      </div>
                      <ArrowRight
                        size={12}
                        className="text-gray-600 group-hover:text-pink-400 transition"
                      />
                    </Link>

                    {/* SETTINGS */}
                    <Link
                      to="/settings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded text-xs font-body text-gray-200 hover:text-cyan-300 hover:bg-cyan-500/10 transition group"
                    >
                      <Settings
                        size={16}
                        className="text-gray-400 group-hover:text-cyan-400 transition"
                      />
                      <div className="flex-1">
                        <span className="font-semibold block">Settings</span>
                        <span className="text-[10px] text-gray-500 block">
                          Edit profile & delivery address
                        </span>
                      </div>
                      <ArrowRight
                        size={12}
                        className="text-gray-600 group-hover:text-cyan-400 transition"
                      />
                    </Link>
                  </div>

                  {/* LOGOUT BUTTON */}
                  <div className="p-1.5 border-t border-white/10 bg-white/[0.01]">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-tech text-pink-400 hover:bg-pink-500/10 hover:text-pink-300 rounded transition"
                    >
                      <LogOut size={15} />
                      <span className="tracking-wider uppercase">Disconnect / Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="
                flex
                items-center
                gap-2
                clip-btn
                text-black
                px-5
                sm:px-6
                py-2.5
                font-display
                font-700
                text-sm
                tracking-wider
                transition
                hover:brightness-110
                whitespace-nowrap
                cursor-pointer
              "
              style={{ background: "linear-gradient(120deg, #00E5FF, #FF3D8A)" }}
            >
              <User size={16} />
              Login
            </button>
          )}

        </div>

      </nav>

      {/* MOBILE SEARCH ACCORDION */}
      {mobileSearchOpen && (
        <div ref={mobileSearchRef} className="md:hidden px-4 pb-4 border-t border-white/10 pt-3 bg-black/95">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search gear..."
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
              "
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-0 top-0 h-10 w-12 flex items-center justify-center text-cyan-400"
            >
              <Search size={18} />
            </button>
          </form>

          {/* MOBILE LIVE RESULTS */}
          {searchTerm.trim() && (
            <div className="mt-2 bg-[#0B0F17] border border-cyan-500/20 rounded p-2 max-h-60 overflow-y-auto">
              {searchResults.length > 0 ? (
                searchResults.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectProduct(item.id)}
                    className="py-2 px-2 flex items-center gap-2 border-b border-white/5 last:border-0"
                  >
                    <img src={item.image} alt={item.title} className="w-8 h-8 object-contain" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white truncate">{item.title}</p>
                      <p className="text-[10px] text-cyan-400 font-tech">₹{item.price}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-xs text-gray-500 py-3">No matching items found</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Navbar;