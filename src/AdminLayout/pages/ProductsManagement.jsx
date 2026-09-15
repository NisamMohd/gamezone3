import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IndianRupee, Package, EyeOff, Trash2, Plus } from "lucide-react";
import { fetchProducts } from "../redux/thunks/adminProductsThunk";
import { toggleDisable } from "../redux/thunks/toggleIsDisabledThunk";

const themeStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

  .font-display { font-family: 'Rajdhani', sans-serif; }
  .font-body { font-family: 'Inter', sans-serif; }
  .font-tech { font-family: 'JetBrains Mono', monospace; }

  .clip-panel {
    clip-path: polygon(0 16px, 16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%);
  }
  .clip-btn {
    clip-path: polygon(0 10px, 10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%);
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
`;

const Backdrop = () => (
  <>
    <style>{themeStyles}</style>
    <div className="fixed inset-0 grid-bg pointer-events-none" />
    <div
      className="fixed -top-40 -left-40 w-96 h-96 rounded-full opacity-[0.08] blur-3xl pointer-events-none"
      style={{
        background: "radial-gradient(circle, #00E5FF, transparent 70%)",
      }}
    />
    <div
      className="fixed -bottom-40 -right-40 w-96 h-96 rounded-full opacity-[0.08] blur-3xl pointer-events-none"
      style={{
        background: "radial-gradient(circle, #FF3D8A, transparent 70%)",
      }}
    />
  </>
);

export default function ProductsManagement() {
  const { items, status } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Loading
  if (status === "loading") {
    return (
      <div className="pt-24 min-h-screen bg-black flex items-center justify-center relative">
        <Backdrop />
        <p className="font-tech text-sm text-cyan-400 tracking-widest animate-pulse relative">
          LOADING PRODUCTS…
        </p>
      </div>
    );
  }

  // Failed
  if (status === "failed") {
    return (
      <div className="pt-24 min-h-screen bg-black flex items-center justify-center relative">
        <Backdrop />
        <div className="relative clip-panel bg-[#0B0F17] border border-pink-500/30 p-8 text-center">
          <span
            className="corner corner-tl"
            style={{ borderColor: "#FF3D8A" }}
          />
          <span
            className="corner corner-br"
            style={{ borderColor: "#FF3D8A" }}
          />

          <p className="font-tech text-sm text-pink-400 mb-5">
            Can't fetch product data. Please try again.
          </p>

          <button
            onClick={() => dispatch(fetchProducts())}
            className="clip-btn bg-cyan-400 text-black px-6 py-2.5 text-sm font-display font-600 tracking-wide hover:brightness-110 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty
  if (!items || items.length === 0) {
    return (
      <div className="pt-24 min-h-screen bg-black relative">
        <Backdrop />
        <div className="relative max-w-[1200px] mx-auto px-4 py-6">
          <div className="relative clip-panel bg-[#0B0F17] border border-white/10 min-h-[400px] flex flex-col items-center justify-center">
            <span className="corner corner-tl" />
            <span className="corner corner-tr" />
            <span className="corner corner-bl" />
            <span className="corner corner-br" />

            <Package
              size={64}
              strokeWidth={1.3}
              className="text-gray-600 mb-5"
            />

            <h2 className="font-display font-700 text-2xl text-white tracking-wide">
              No Products Found
            </h2>

            <p className="text-sm text-gray-500 mt-2 font-body">
              Products you add will show up here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=" min-h-screen bg-black relative ">
      <Backdrop />

      <div className="relative max-w-[1200px] mx-auto px-4 py-6">
        {/* PAGE TITLE */}
        <div className="flex justify-between sticky top-25 z-40 bg-black">
          <div className="mb-6 flex-wrap">
            <p className="font-tech text-[11px] tracking-[0.2em] text-cyan-400 mb-1">
              ADMIN CONSOLE
            </p>
            <h1 className="font-display font-700 text-2xl sm:text-3xl text-white tracking-wide uppercase">
              Manage Products
            </h1>
            <p className="text-sm text-gray-400 mt-1 font-body">
              {items.length} product{items.length !== 1 ? "s" : ""} in
              catalog
            </p>
          </div>
          <div className="items-center">
            <button
              className="text-cyan-400 clip-btn px-2 py-1 border border-cyan-400/50 hover:bg-cyan-400/10 transition-colors"
              style={{
                background: isHovered
                  ? "linear-gradient(120deg, #00bbff, #f70063)"
                  : "transparent",
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <span className="flex gap-1 items-center">
                Add
                <Plus size={16} />
              </span>
            </button>
          </div>
        </div>
        {/* PRODUCT LIST */}
        <div className="w-full max-h-[calc(100vh-240px)] overflow-y-auto pr-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="relative clip-panel bg-[#0B0F17] border border-white/10 mb-3 p-5 hover:border-cyan-400/30 transition"
            >
              <span className="corner corner-tl" />
              <span className="corner corner-br" />

              <div className="flex gap-5">
                {/* PRODUCT IMAGE */}
                <div className="w-36 h-36 shrink-0 flex items-center justify-center bg-white/[0.02] border border-white/5">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="max-w-full max-h-full object-contain p-3"
                  />
                </div>

                {/* PRODUCT INFO */}
                <div className="flex-1 min-w-0 font-body">
                  <h2 className="text-base font-medium text-gray-200">
                    {item.title}
                  </h2>

                  {/* PRICE + STOCK */}
                  <div className="flex items-center gap-6 mt-4">
                    <div className="flex items-center">
                      <IndianRupee
                        size={16}
                        className="text-white"
                        strokeWidth={2.5}
                      />
                      <span className="font-display font-700 text-lg text-white">
                        {item.price}
                      </span>
                    </div>

                    <span
                      className={`font-tech text-xs px-2.5 py-1 border tracking-wider uppercase ${
                        item.stock > 0
                          ? "text-emerald-400 border-emerald-400/30 bg-emerald-400/5"
                          : "text-pink-400 border-pink-400/30 bg-pink-400/5"
                      }`}
                    >
                      {item.stock > 0
                        ? `${item.stock} in stock`
                        : "Out of stock"}
                    </span>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex items-center gap-6 mt-5">
                    <button
                      type="button"
                      className={`flex items-center gap-1.5 text-sm font-medium transition ${
                        item.isDisabled
                          ? "text-cyan-400 hover:text-gray-400"
                          : "text-gray-400 hover:text-cyan-400"
                      }`}
                      onClick={() => {
                        dispatch(toggleDisable(item))
                      }}
                    >
                      <EyeOff size={16} />
                      Hide
                    </button>

                    <button 
                      className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-pink-400 transition"
                      type="button"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
