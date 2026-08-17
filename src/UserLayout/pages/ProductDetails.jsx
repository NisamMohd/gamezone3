import {
  IndianRupee,
  X,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

function ProductDetails() {
  const { products, loading, error } = useSelector((state) => state.products);
  const { id } = useParams();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);

  const item = products.find((product) => product.id.toString() === id);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-cyan-400 font-mono tracking-widest animate-pulse">
          LOADING…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-pink-500 font-mono">ERROR: {error}</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-gray-400 font-mono">PRODUCT NOT FOUND</p>
      </div>
    );
  }

  const mrp = item.mrp || Math.round(item.price * 1.18);
  const discount = Math.round(100 - (item.price / mrp) * 100);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center px-4 py-24">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        .font-display { font-family: 'Rajdhani', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        .font-tech { font-family: 'JetBrains Mono', monospace; }

        .clip-panel {
          clip-path: polygon(0 20px, 20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%);
        }
        .clip-btn {
          clip-path: polygon(0 10px, 10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%);
        }
        .corner {
          position: absolute;
          width: 18px;
          height: 18px;
          border-color: #00E5FF;
        }
        .corner-tl { top: -1px; left: -1px; border-top: 2px solid; border-left: 2px solid; }
        .corner-tr { top: -1px; right: -1px; border-top: 2px solid; border-right: 2px solid; }
        .corner-bl { bottom: -1px; left: -1px; border-bottom: 2px solid; border-left: 2px solid; }
        .corner-br { bottom: -1px; right: -1px; border-bottom: 2px solid; border-right: 2px solid; }

        @keyframes pulseDot {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.6); }
          50% { opacity: 0.7; box-shadow: 0 0 0 6px rgba(52, 211, 153, 0); }
        }
        .stock-dot { animation: pulseDot 2s ease-in-out infinite; }

        .grid-bg {
          background-image:
            linear-gradient(rgba(0,229,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,229,255,0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>

      {/* ambient backdrop */}
      <div className="absolute inset-0 grid-bg" />
      <div
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #00E5FF, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #FF3D8A, transparent 70%)" }}
      />

      {/* MAIN PANEL */}
      <div className="relative w-full max-w-5xl">
        <div className="clip-panel bg-[#0B0F17] border border-cyan-500/20 shadow-[0_0_60px_rgba(0,229,255,0.08)] p-6 sm:p-10 grid md:grid-cols-2 gap-10 items-center">
          <span className="corner corner-tl" />
          <span className="corner corner-tr" />
          <span className="corner corner-bl" />
          <span className="corner corner-br" />

          {/* CLOSE */}
          <button
            onClick={() => navigate(-1)}
            aria-label="Close"
            className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full border border-white/10 text-gray-400 hover:text-white hover:border-cyan-400/50 transition"
          >
            <X size={18} />
          </button>

          {/* IMAGE */}
          <div className="relative flex justify-center items-center">
            <div
              className="absolute w-64 h-64 rounded-full blur-3xl opacity-30"
              style={{ background: "radial-gradient(circle, #00E5FF, #FF3D8A 70%, transparent 80%)" }}
            />
            <img
              src={item.image}
              alt={item.title}
              className="relative w-full max-w-sm object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
            />
          </div>

          {/* DETAILS */}
          <div className="font-body">
            <p className="font-tech text-xs tracking-[0.25em] text-cyan-400 mb-2">
              GAMING CONSOLE
            </p>

            <h1 className="font-display font-700 text-4xl sm:text-5xl text-white leading-tight tracking-wide">
              {item.title}
            </h1>

            <div className="flex items-center gap-2 mt-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 stock-dot" />
              <span className="text-emerald-400 text-sm font-medium">In Stock</span>
              <span className="text-gray-600">•</span>
              <span className="font-tech text-xs text-gray-500">
                SKU-{item.id.toString().padStart(4, "0")}
              </span>
            </div>

            <p className="mt-5 text-gray-400 leading-relaxed text-sm sm:text-base">
              {item.description}
            </p>

            {/* PRICE */}
            <div className="flex items-end gap-3 mt-6">
              <span className="flex items-center font-display font-700 text-4xl text-white">
                <IndianRupee size={26} strokeWidth={2.5} />
                {item.price.toLocaleString("en-IN")}
              </span>
              {discount > 0 && (
                <>
                  <span className="text-gray-500 line-through text-lg mb-1">
                    ₹{mrp.toLocaleString("en-IN")}
                  </span>
                  <span className="mb-1 text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1 font-tech">
              Inclusive of all taxes
            </p>

            {/* QTY + ACTIONS */}
            <div className="flex flex-wrap items-center gap-3 mt-8">
              <div className="flex items-center border border-white/15 clip-btn overflow-hidden">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="p-3 text-gray-300 hover:bg-white/5 transition"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center font-tech text-white">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="p-3 text-gray-300 hover:bg-white/5 transition"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={() => setWishlisted((w) => !w)}
                className={`p-3 clip-btn border transition ${
                  wishlisted
                    ? "border-pink-500 text-pink-500 bg-pink-500/10"
                    : "border-white/15 text-gray-400 hover:text-pink-400 hover:border-pink-400/50"
                }`}
                aria-label="Toggle wishlist"
              >
                <Heart size={18} fill={wishlisted ? "currentColor" : "none"} />
              </button>
            </div>

            <div className="flex gap-3 mt-4">
              <button className="clip-btn flex-1 flex items-center justify-center gap-2 px-6 py-3.5 border border-cyan-400/60 text-cyan-300 font-display font-600 text-lg tracking-wide hover:bg-cyan-400/10 transition">
                <ShoppingCart size={18} />
                Add to Cart
              </button>

              <button
                className="clip-btn flex-1 flex items-center justify-center gap-2 px-6 py-3.5 font-display font-600 text-lg tracking-wide text-black transition hover:brightness-110"
                style={{ background: "linear-gradient(120deg, #00E5FF, #FF3D8A)" }}
              >
                <Zap size={18} />
                Buy Now
              </button>
            </div>

            {/* TRUST STRIP */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10">
              <div className="flex flex-col items-center text-center gap-1.5">
                <Truck size={18} className="text-cyan-400" />
                <span className="text-[11px] text-gray-500 leading-tight">
                  Free delivery
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5">
                <ShieldCheck size={18} className="text-cyan-400" />
                <span className="text-[11px] text-gray-500 leading-tight">
                  1 year warranty
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5">
                <RotateCcw size={18} className="text-cyan-400" />
                <span className="text-[11px] text-gray-500 leading-tight">
                  7-day replacement
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;