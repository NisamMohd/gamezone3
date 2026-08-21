import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IndianRupee, ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { decrementQty, fetchCarts, incrementQty, remove } from "../redux/features/thunks/cartThunk";

function Cart() {
  const { user } = useAuth();

  const { items, status, total } = useSelector((state) => state.cart);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      dispatch(fetchCarts(user.id));
    }
  }, [user, dispatch]);

  
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

  // Loading
  if (status === "loading") {
    return (
      <div className="pt-24 min-h-screen bg-black flex items-center justify-center relative">
        <Backdrop />
        <p className="font-tech text-sm text-cyan-400 tracking-widest animate-pulse relative">
          LOADING YOUR CART…
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
            Can't fetch cart data. Please try again.
          </p>

          <button
            onClick={() => user && dispatch(fetchCarts(user.id))}
            className="clip-btn bg-cyan-400 text-black px-6 py-2.5 text-sm font-display font-600 tracking-wide hover:brightness-110 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty cart
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

            <ShoppingCart
              size={64}
              strokeWidth={1.3}
              className="text-gray-600 mb-5"
            />

            <h2 className="font-display font-700 text-2xl text-white tracking-wide">
              Your Cart Is Empty
            </h2>

            <p className="text-sm text-gray-500 mt-2 font-body">
              Add items to your cart to see them here.
            </p>

            <button
              onClick={() => navigate("/products")}
              className="
                clip-btn
                mt-6
                px-8
                py-3
                font-display
                font-600
                tracking-wide
                text-black
                transition
                hover:brightness-110
              "
              style={{
                background: "linear-gradient(120deg, #00E5FF, #FF3D8A)",
              }}
            >
              Shop Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-black relative">
      <Backdrop />

      <div className="relative max-w-[1200px] mx-auto px-4 py-6">
        {/* PAGE TITLE */}
        <div className="mb-4">
          <p className="font-tech text-[11px] tracking-[0.2em] text-cyan-400 mb-1">
            YOUR LOADOUT
          </p>
          <h1 className="font-display font-700 text-2xl text-white tracking-wide">
            My Cart
          </h1>

          <p className="text-sm text-gray-500 mt-1 font-body">
            {items.length} item{items.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* MAIN CART LAYOUT */}
        <div className="flex flex-col lg:flex-row gap-4 items-start">
          {/* LEFT SIDE */}
          <div className="w-full lg:flex-1">
            {items.map((item) => (
              <div
                key={item.id}
                className="
                  relative
                  clip-panel
                  bg-[#0B0F17]
                  border
                  border-white/10
                  mb-3
                  p-5
                  hover:border-cyan-400/30
                  transition
                "
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

                  {/* PRODUCT INFORMATION */}
                  <div className="flex-1 min-w-0 font-body">
                    <h2 className="text-base font-medium text-gray-200">
                      {item.title}
                    </h2>

                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                      {item.description}
                    </p>

                    {/* PRICE */}
                    <div className="flex items-center mt-4">
                      <IndianRupee
                        size={16}
                        className="text-white"
                        strokeWidth={2.5}
                      />

                      <span className="font-display font-700 text-lg text-white">
                        {item.price}
                      </span>
                    </div>

                    {/* QUANTITY + REMOVE */}
                    <div className="flex items-center gap-6 mt-5">
                      {/* QUANTITY */}
                      <div className="flex items-center border border-white/15">
                        <button
                          onClick={() => dispatch(decrementQty(item))}
                          className="w-9 h-9 flex items-center justify-center text-gray-300 hover:bg-white/5 transition"
                        >
                          <Minus size={15} />
                        </button>

                        <span
                          className="
                            w-10
                            h-9
                            flex
                            items-center
                            justify-center
                            border-l
                            border-r
                            border-white/15
                            text-sm
                            font-tech
                            text-white
                          "
                        >
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => dispatch(incrementQty(item))}
                          className="w-9 h-9 flex items-center justify-center text-gray-300 hover:bg-white/5 transition"
                        >
                          <Plus size={15} />
                        </button>
                      </div>

                      {/* REMOVE */}
                      <button
                        onClick={() => dispatch(remove(item.id))}
                        className="
                          flex
                          items-center
                          gap-1.5
                          text-sm
                          font-medium
                          text-gray-400
                          hover:text-pink-400
                          transition
                        "
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT PRICE SUMMARY */}
          <div className="w-full lg:w-[350px] lg:sticky lg:top-24">
            <div className="relative clip-panel bg-[#0B0F17] border border-cyan-500/20">
              <span className="corner corner-tl" />
              <span className="corner corner-tr" />
              <span className="corner corner-bl" />
              <span className="corner corner-br" />

              {/* HEADER */}
              <div className="px-5 py-4 border-b border-white/10">
                <h2 className="font-tech text-[11px] tracking-[0.2em] text-cyan-400">
                  PRICE DETAILS
                </h2>
              </div>

              {/* DETAILS */}
              <div className="px-5 py-5 space-y-5 font-body">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">
                    Price ({items.length} items)
                  </span>

                  <span className="text-gray-200 font-tech">₹{total}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Delivery Charges</span>

                  <span className="text-emerald-400 font-tech">FREE</span>
                </div>

                <div className="border-t border-dashed border-white/15 pt-4">
                  <div className="flex justify-between">
                    <span className="font-display font-600 text-white">
                      Total Amount
                    </span>

                    <span className="font-display font-700 text-lg text-white">
                      ₹{total}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-emerald-400">
                  You will save on delivery charges
                </p>
              </div>

              {/* BUY BUTTON */}
              <div className="px-5 pb-5">
                <button
                  onClick={() => navigate("/checkout")}
                  className="
                    clip-btn
                    w-full
                    py-3
                    font-display
                    font-600
                    tracking-wide
                    text-black
                    text-sm
                    transition
                    hover:brightness-110
                  "
                  style={{
                    background: "linear-gradient(120deg, #00E5FF, #FF3D8A)",
                  }}
                >
                  PLACE ORDER
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
