import React, { useState, useEffect } from "react";
import { X, Package, Calendar, CreditCard, Tag } from "lucide-react";
import api from "../../services/api";

export default function ViewOrdersModal({ isOpen, onClose, userId, userName }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen || !userId) return;

    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/orders?userId=${userId}`);
        setOrders(res.data || []);
      } catch (err) {
        setError("Failed to load user orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isOpen, userId]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        className="clip-panel relative w-full max-w-2xl bg-[#0B0F17] border border-cyan-400/40 p-4 sm:p-6 max-h-[92vh] sm:max-h-[88vh] overflow-y-auto shadow-2xl shadow-cyan-500/10"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="corner corner-tl" />
        <span className="corner corner-br" />

        {/* HEADER */}
        <div className="flex items-start justify-between pb-3 sm:pb-4 border-b border-white/10 mb-4 gap-2">
          <div className="min-w-0 flex-1">
            <p className="font-tech text-[10px] sm:text-[11px] tracking-[0.2em] text-cyan-400 uppercase">
              Order History
            </p>
            <h2 className="font-display font-700 text-lg sm:text-2xl text-white tracking-wide truncate">
              {userName ? `${userName}'s Orders` : "User Orders"}
            </h2>
            <p className="text-xs text-gray-400 font-mono mt-0.5">
              Customer ID: <span className="text-cyan-400">{userId}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-pink-500 transition-colors p-1.5 shrink-0 rounded"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* CONTENT */}
        {loading && (
          <div className="py-12 text-center">
            <div className="w-8 h-8 mx-auto mb-3 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
            <p className="font-tech text-xs text-cyan-400 tracking-widest uppercase animate-pulse">
              Retrieving Order Records…
            </p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-pink-500/10 border border-pink-500/30 text-pink-400 text-sm rounded">
            {error}
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="py-12 text-center text-gray-400">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-30 text-cyan-400" />
            <p className="text-base font-medium text-gray-300">No orders found for this user.</p>
            <p className="text-xs text-gray-500 mt-1">This user has not made any purchases yet.</p>
          </div>
        )}

        {!loading && orders.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
              <span>
                Total Orders: <strong className="text-cyan-400">{orders.length}</strong>
              </span>
            </div>

            {orders.map((order) => {
              const formattedDate = order.createdAt
                ? new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "N/A";

              return (
                <div
                  key={order.id}
                  className="border border-white/15 bg-slate-900/70 p-4 sm:p-5 rounded-lg shadow-md transition hover:border-cyan-400/50"
                >
                  {/* ORDER TOP BAR */}
                  <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-cyan-400">
                        Order #{order.id}
                      </span>
                      <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded bg-cyan-400/10 text-cyan-300 border border-cyan-400/30 uppercase tracking-wide">
                        {order.status || "Confirmed"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-mono">
                      <Calendar size={13} className="text-cyan-400" />
                      <span>{formattedDate}</span>
                    </div>
                  </div>

                  {/* ORDER ITEMS LIST */}
                  <div className="py-3 space-y-3">
                    {order.items?.map((item, idx) => {
                      const itemPrice = Number(item.price || 0);
                      const itemQuantity = Number(item.quantity || 1);
                      const itemTotal = itemPrice * itemQuantity;
                      const productId = item.productId || item.id || "N/A";

                      return (
                        <div
                          key={idx}
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-black/40 border border-white/5 rounded hover:border-cyan-400/30 transition"
                        >
                          {/* PRODUCT IMAGE & INFO */}
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded bg-black/60 border border-white/10 shrink-0"
                              />
                            ) : (
                              <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded bg-slate-800 border border-white/10 text-gray-500 shrink-0">
                                <Package size={22} />
                              </div>
                            )}

                            <div className="min-w-0 flex-1">
                              {/* PRODUCT TITLE */}
                              <h4 className="text-sm font-semibold text-white truncate" title={item.title}>
                                {item.title}
                              </h4>

                              {/* PRODUCT ID & ORDER DATE */}
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-gray-400 font-mono">
                                <span className="flex items-center gap-1 text-cyan-400/90">
                                  <Tag size={11} />
                                  Product ID: #{productId}
                                </span>
                                <span className="flex items-center gap-1 text-slate-400">
                                  <Calendar size={11} />
                                  Date: {formattedDate}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* PRICING & QUANTITY DETAILS */}
                          <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto text-xs font-mono shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5 gap-1">
                            <div className="text-gray-400">
                              Price: <span className="text-slate-200">₹{itemPrice.toLocaleString()}</span> × <span className="text-cyan-400 font-bold">{itemQuantity}</span>
                            </div>
                            <div className="text-sm font-bold text-white">
                              Total: <span className="text-cyan-300">₹{itemTotal.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* ORDER FOOTER / SUMMARY */}
                  <div className="pt-3 border-t border-white/10 flex flex-wrap justify-between items-center text-xs text-gray-400 gap-3">
                    <div className="flex items-center gap-2">
                      <CreditCard size={14} className="text-gray-400" />
                      <span>Method: <strong className="text-slate-300">{order.paymentMethod || "Cash on Delivery"}</strong></span>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-sm">
                      <span className="text-gray-300 font-medium">Order Total:</span>
                      <span className="text-base font-bold text-cyan-400">
                        ₹{Number(order.totalAmount || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* FOOTER CLOSE BUTTON */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="clip-btn px-6 py-2 border border-cyan-400/50 text-cyan-300 text-sm font-semibold hover:bg-cyan-400/10 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}