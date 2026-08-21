import React, { useEffect } from "react";
import { fetchProducts } from "../redux/features/thunks/productThunks";
import { useDispatch, useSelector } from "react-redux";
import Card from "../components/Card";
import { fetchCarts } from "../redux/features/thunks/cartThunk";
import { useAuth } from "../context/AuthContext";

function Products() {
  const { user } = useAuth();
  const dispatch = useDispatch();

  const { products, loading, error } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(fetchCarts(user.id));
    }
  }, [user, dispatch]);

  return (
    <div className="fixed top-20 left-0 right-0 bottom-0 bg-black overflow-y-auto">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        .font-display { font-family: 'Rajdhani', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        .font-tech { font-family: 'JetBrains Mono', monospace; }

        .clip-panel {
          clip-path: polygon(0 16px, 16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%);
        }
        .corner {
          position: absolute;
          width: 14px;
          height: 14px;
          border-color: #00E5FF;
          pointer-events: none;
        }
        .corner-tl { top: -1px; left: -1px; border-top: 2px solid; border-left: 2px solid; }
        .corner-tr { top: -1px; right: -1px; border-top: 2px solid; border-right: 2px solid; }
        .corner-bl { bottom: -1px; left: -1px; border-bottom: 2px solid; border-left: 2px solid; }
        .corner-br { bottom: -1px; right: -1px; border-bottom: 2px solid; border-right: 2px solid; }

        .grid-bg {
          background-image:
            linear-gradient(rgba(0,229,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,229,255,0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .hud-checkbox {
          appearance: none;
          width: 16px;
          height: 16px;
          border: 1px solid rgba(255,255,255,0.25);
          background: rgba(255,255,255,0.02);
          display: inline-block;
          position: relative;
          cursor: pointer;
        }
        .hud-checkbox:checked {
          background: #00E5FF;
          border-color: #00E5FF;
        }
        .hud-checkbox:checked::after {
          content: '';
          position: absolute;
          left: 4px;
          top: 1px;
          width: 4px;
          height: 8px;
          border: solid #05070C;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }
      `}</style>

      {/* ambient backdrop */}
      <div className="fixed inset-0 grid-bg pointer-events-none" />
      <div
        className="fixed -top-40 -left-40 w-96 h-96 rounded-full opacity-[0.08] blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #00E5FF, transparent 70%)" }}
      />
      <div
        className="fixed -bottom-40 -right-40 w-96 h-96 rounded-full opacity-[0.08] blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #FF3D8A, transparent 70%)" }}
      />

      <div className="relative max-w-[1500px] mx-auto p-4">
        <div className="flex gap-4 items-start">

          {/* LEFT FILTER PANEL */}
          <aside className="fixed hidden md:block w-60 shrink-0 clip-panel bg-[#0B0F17] border border-cyan-500/20">
            <span className="corner corner-tl" />
            <span className="corner corner-bl" />

            <div className="px-5 py-4 border-b border-white/10">
              <h2 className="font-display font-700 text-lg tracking-wide text-white">
                Filters
              </h2>
            </div>

            {/* Category */}
            <div className="px-5 py-5 border-b border-white/10">
              <h3 className="font-tech text-[11px] tracking-[0.2em] text-cyan-400 mb-4">
                CATEGORIES
              </h3>

              <div className="space-y-3 text-sm text-gray-400 font-body">
                <label className="flex gap-2.5 items-center cursor-pointer hover:text-gray-200 transition">
                  <input type="checkbox" className="hud-checkbox" />
                  PlayStations
                </label>

                <label className="flex gap-2.5 items-center cursor-pointer hover:text-gray-200 transition">
                  <input type="checkbox" className="hud-checkbox" />
                  Controllers
                </label>

                <label className="flex gap-2.5 items-center cursor-pointer hover:text-gray-200 transition">
                  <input type="checkbox" className="hud-checkbox" />
                  Accessories
                </label>
              </div>
            </div>

            {/* Price */}
            <div className="px-5 py-5 border-b border-white/10">
              <h3 className="font-tech text-[11px] tracking-[0.2em] text-cyan-400 mb-4">
                PRICE
              </h3>

              <input
                type="range"
                min="0"
                max="100000"
                className="w-full"
                style={{ accentColor: "#00E5FF" }}
              />

              <div className="flex gap-2 mt-3">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-1/2 bg-white/5 border border-white/15 px-2 py-1.5 text-sm text-gray-200 placeholder-gray-600 font-body outline-none focus:border-cyan-400/60"
                />

                <input
                  type="number"
                  placeholder="Max"
                  className="w-1/2 bg-white/5 border border-white/15 px-2 py-1.5 text-sm text-gray-200 placeholder-gray-600 font-body outline-none focus:border-cyan-400/60"
                />
              </div>
            </div>

            {/* Rating */}
            <div className="px-5 py-5 border-b border-white/10">
              <h3 className="font-tech text-[11px] tracking-[0.2em] text-cyan-400 mb-4">
                CUSTOMER RATING
              </h3>

              <div className="space-y-3 text-sm text-gray-400 font-body">
                <label className="flex gap-2.5 items-center cursor-pointer hover:text-gray-200 transition">
                  <input type="checkbox" className="hud-checkbox" />
                  4★ & above
                </label>

                <label className="flex gap-2.5 items-center cursor-pointer hover:text-gray-200 transition">
                  <input type="checkbox" className="hud-checkbox" />
                  3★ & above
                </label>

                <label className="flex gap-2.5 items-center cursor-pointer hover:text-gray-200 transition">
                  <input type="checkbox" className="hud-checkbox" />
                  2★ & above
                </label>
              </div>
            </div>

            {/* Availability */}
            <div className="px-5 py-5">
              <h3 className="font-tech text-[11px] tracking-[0.2em] text-cyan-400 mb-4">
                AVAILABILITY
              </h3>

              <div className="flex flex-col gap-3 text-sm text-gray-400 font-body">
                <label className="flex gap-2.5 items-center cursor-pointer hover:text-gray-200 transition">
                  <input type="checkbox" className="hud-checkbox" />
                  In Stock
                </label>
                <label className="flex gap-2.5 items-center cursor-pointer hover:text-gray-200 transition">
                  <input type="checkbox" className="hud-checkbox" />
                  Out Of Stock
                </label>
              </div>
            </div>
          </aside>

          {/* RIGHT PRODUCT SECTION */}
          <main className="ml-64 flex-1 min-w-0">

            {/* Product heading + sorting */}
            <div className="relative clip-panel bg-[#0B0F17] border border-cyan-500/20 px-5 py-4 mb-4">
              <span className="corner corner-tr" />
              <span className="corner corner-br" />

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="font-tech text-[11px] tracking-[0.2em] text-cyan-400 mb-1">
                    GAMEZONE ARSENAL
                  </p>
                  <h1 className="font-display font-700 text-2xl text-white tracking-wide">
                    Products
                  </h1>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-tech text-xs text-gray-500">
                    SORT BY
                  </span>

                  <select
                    className="bg-white/5 border border-white/15 px-3 py-2 text-sm text-gray-200 font-body outline-none focus:border-cyan-400/60"
                  >
                    <option className="bg-[#0B0F17]">Relevance</option>
                    <option className="bg-[#0B0F17]">Price -- Low to High</option>
                    <option className="bg-[#0B0F17]">Price -- High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="clip-panel bg-[#0B0F17] border border-cyan-500/20 p-10 text-center">
                <p className="font-tech text-sm text-cyan-400 tracking-widest animate-pulse">
                  LOADING PRODUCTS…
                </p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="clip-panel bg-[#0B0F17] border border-pink-500/30 p-10 text-center">
                <p className="font-tech text-sm text-pink-400">{error}</p>
              </div>
            )}

            {/* Products */}
            {!loading && !error && (
              <div className="
                grid
                grid-cols-2
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
                gap-3
              ">
                {products?.map((item) => (
                  <Card
                    key={item.id}
                    value={item}
                  />
                ))}
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}

export default Products;