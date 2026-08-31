import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Package,
  Calendar,
  MapPin,
  CreditCard,
  CheckCircle2,
  Clock,
  ArrowRight,
  IndianRupee,
  ShoppingBag,
  Truck,
  RotateCcw,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { fetchOrders } from "../redux/features/thunks/orderThunk";

function Orders() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    dispatch(fetchOrders(user.id));
  }, [user, dispatch, navigate]);

  return (
    <div className="pt-28 min-h-screen bg-black grid-bg px-4 pb-20 font-body text-gray-200">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        .font-display { font-family: 'Rajdhani', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        .font-tech { font-family: 'JetBrains Mono', monospace; }

        .clip-panel {
          background: #0B0F17;
          border: 1px solid rgba(0, 229, 255, 0.18);
          clip-path: polygon(
            16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px
          );
        }
        .clip-btn {
          clip-path: polygon(0 10px, 10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%);
        }
        .corner {
          position: absolute;
          width: 14px;
          height: 14px;
          pointer-events: none;
        }
        .corner-tl {
          top: -1px;
          left: -1px;
          border-top: 2px solid #00E5FF;
          border-left: 2px solid #00E5FF;
        }
        .corner-tr {
          top: -1px;
          right: -1px;
          border-top: 2px solid #00E5FF;
          border-right: 2px solid #00E5FF;
        }
        .corner-bl {
          bottom: -1px;
          left: -1px;
          border-bottom: 2px solid #FF3D8A;
          border-left: 2px solid #FF3D8A;
        }
        .corner-br {
          bottom: -1px;
          right: -1px;
          border-bottom: 2px solid #FF3D8A;
          border-right: 2px solid #FF3D8A;
        }
        .grid-bg {
          background-image:
            linear-gradient(rgba(0,229,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,229,255,0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>

      {/* AMBIENT GLOW */}
      <div
        className="fixed -top-40 -left-40 w-96 h-96 rounded-full opacity-[0.08] blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #00E5FF, transparent 70%)" }}
      />
      <div
        className="fixed -bottom-40 -right-40 w-96 h-96 rounded-full opacity-[0.08] blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #FF3D8A, transparent 70%)" }}
      />

      <div className="relative max-w-5xl mx-auto">
        {/* PAGE HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <p className="font-tech text-xs tracking-[0.25em] text-cyan-400 uppercase">
                OPERATIVE MISSION LOGS
              </p>
            </div>
            <h1 className="font-display font-700 text-3xl sm:text-4xl text-white uppercase tracking-wide">
              My Orders & Acquisitions
            </h1>
          </div>

          <Link
            to="/products"
            className="clip-btn self-start sm:self-auto inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-tech text-xs uppercase hover:bg-cyan-500/20 transition"
          >
            <span>Browse Arsenal</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="clip-panel p-16 text-center">
            <p className="font-tech text-sm text-cyan-400 tracking-widest animate-pulse">
              RETRIEVING ORDER ARCHIVES FROM SERVER…
            </p>
          </div>
        )}

        {/* ERROR STATE */}
        {error && (
          <div className="clip-panel p-10 text-center border-pink-500/30">
            <p className="font-tech text-sm text-pink-400">ERROR: {error}</p>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && (!orders || orders.length === 0) && (
          <div className="clip-panel p-14 text-center max-w-lg mx-auto relative">
            <span className="corner corner-tl" />
            <span className="corner corner-tr" />
            <span className="corner corner-bl" />
            <span className="corner corner-br" />

            <div className="w-16 h-16 mx-auto rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
              <Package size={28} />
            </div>

            <h2 className="font-display font-700 text-2xl text-white tracking-wide uppercase mb-2">
              No Orders Found
            </h2>
            <p className="font-body text-gray-400 text-sm mb-6">
              You haven't placed any mission orders yet. Equip your battle station from our latest arsenal.
            </p>
            <button
              onClick={() => navigate("/products")}
              className="clip-btn px-8 py-3 bg-[#00E5FF] text-black font-display font-bold text-sm tracking-wide uppercase hover:bg-white transition"
            >
              Explore Products
            </button>
          </div>
        )}

        {/* ORDERS LIST */}
        {!loading && !error && orders && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => {
              const formattedDate = order.createdAt
                ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "Recent";

              return (
                <div key={order.id} className="clip-panel relative p-6">
                  <span className="corner corner-tl" />
                  <span className="corner corner-tr" />
                  <span className="corner corner-bl" />
                  <span className="corner corner-br" />

                  {/* ORDER HEADER */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                        <ShoppingBag size={18} />
                      </div>
                      <div>
                        <span className="font-tech text-[10px] text-gray-500 uppercase block">
                          ORDER IDENTIFIER
                        </span>
                        <span className="font-tech text-sm text-cyan-300 font-bold">
                          #{order.id}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-tech">
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Calendar size={13} className="text-cyan-400" />
                        <span>{formattedDate}</span>
                      </div>

                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-tech text-xs">
                        <CheckCircle2 size={12} />
                        {order.status || "Order Confirmed"}
                      </span>
                    </div>
                  </div>

                  {/* ORDER ITEMS LIST */}
                  <div className="py-4 divide-y divide-white/5">
                    {order.items?.map((item, idx) => (
                      <div
                        key={idx}
                        className="py-3 flex items-center gap-4 hover:bg-white/[0.01] transition rounded px-2"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-14 h-14 object-contain bg-black/50 border border-white/10 rounded p-1.5 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/products/${item.productId}`}
                            className="text-sm font-medium text-white hover:text-cyan-300 transition truncate block"
                          >
                            {item.title}
                          </Link>
                          <p className="text-xs text-gray-500 font-tech mt-0.5">
                            QTY: <span className="text-cyan-400 font-bold">{item.quantity || 1}</span> × ₹
                            {Number(item.price).toLocaleString("en-IN")}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-display font-bold text-base text-white">
                            ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* ORDER FOOTER / SHIPPING DETAILS */}
                  <div className="pt-4 border-t border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs">
                    <div className="flex flex-col gap-1 text-gray-400">
                      <div className="flex items-center gap-1.5 text-gray-300">
                        <MapPin size={13} className="text-cyan-400" />
                        <span className="font-medium text-white">{order.shippingAddress?.name}</span>
                        <span>•</span>
                        <span>{order.shippingAddress?.city}, {order.shippingAddress?.state}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 pl-5">
                        {order.shippingAddress?.address} ({order.shippingAddress?.zip})
                      </p>
                    </div>

                    <div className="flex items-center gap-6 justify-between md:justify-end">
                      <div className="text-right">
                        <span className="font-tech text-[10px] text-gray-500 uppercase block">
                          TOTAL AMOUNT
                        </span>
                        <span className="font-display font-bold text-xl text-cyan-400">
                          ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
                        </span>
                      </div>

                      <Link
                        to={`/products/${order.items?.[0]?.productId || ""}`}
                        className="clip-btn px-4 py-2 bg-white/5 border border-white/15 hover:border-cyan-400 text-gray-200 hover:text-white font-tech text-xs uppercase transition"
                      >
                        View Gear
                      </Link>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
