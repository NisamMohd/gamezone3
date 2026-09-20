import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  Package,
  Calendar,
  CreditCard,
  Tag,
  MapPin,
  ShoppingBag,
  Clock,
  User,
  CheckCircle2,
} from "lucide-react";
import api from "../../services/api";

export default function ViewOrdersModal({ isOpen, onClose, userId, userName }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Lock background scrolling and listen for Escape key to close
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Fetch orders when modal opens
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

  // Total spend calculation
  const totalSpend = useMemo(() => {
    return orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
  }, [orders]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 pt-20 sm:pt-24 pb-4 sm:pb-6 overflow-hidden animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-orders-title"
    >
      <div
        className="clip-panel relative w-full max-w-3xl bg-[#0B0F17] border border-cyan-400/50 shadow-2xl shadow-cyan-500/15 flex flex-col max-h-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="corner corner-tl" />
        <span className="corner corner-br" />

        {/* 1. FIXED MODAL HEADER (NEVER SCROLLS AWAY / NEVER CUT OFF) */}
        <div className="shrink-0 px-5 sm:px-6 py-3.5 sm:py-4 border-b border-white/10 bg-[#0B0F17] flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-tech text-[10px] sm:text-[11px] tracking-[0.2em] text-cyan-400 uppercase bg-cyan-500/10 border border-cyan-400/30 px-2 py-0.5 rounded">
                Order History Archive
              </span>
              {!loading && !error && (
                <span className="text-[11px] font-mono text-gray-400">
                  {orders.length} {orders.length === 1 ? "Order" : "Orders"} Found
                </span>
              )}
            </div>

            <h2
              id="modal-orders-title"
              className="font-display font-700 text-lg sm:text-xl text-white tracking-wide truncate flex items-center gap-2"
            >
              <User size={18} className="text-cyan-400 shrink-0" />
              <span>{userName ? `${userName}'s Orders` : "User Orders"}</span>
            </h2>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-400 font-mono">
              <span>
                Customer ID: <strong className="text-cyan-400">#{userId}</strong>
              </span>
              {!loading && orders.length > 0 && (
                <>
                  <span className="text-gray-600 hidden sm:inline">•</span>
                  <span>
                    Total Spend:{" "}
                    <strong className="text-emerald-400">
                      ₹{totalSpend.toLocaleString()}
                    </strong>
                  </span>
                </>
              )}
            </div>
          </div>

          {/* CLOSE BUTTON */}
          <button
            onClick={onClose}
            className="p-2 rounded border border-white/10 hover:border-pink-500/50 text-gray-400 hover:text-pink-400 hover:bg-pink-500/10 transition-all cursor-pointer shrink-0"
            aria-label="Close modal"
            title="Close (Esc)"
          >
            <X size={18} />
          </button>
        </div>

        {/* 2. SCROLLABLE CONTENT BODY */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
          {loading && (
            <div className="py-14 text-center">
              <div className="w-9 h-9 mx-auto mb-3 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
              <p className="font-tech text-xs text-cyan-400 tracking-widest uppercase animate-pulse">
                Retrieving Order Records…
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-pink-500/10 border border-pink-500/30 text-pink-400 text-sm rounded flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={() => {
                  setError(null);
                  setLoading(true);
                  api
                    .get(`/orders?userId=${userId}`)
                    .then((res) => setOrders(res.data || []))
                    .catch(() => setError("Failed to load user orders."))
                    .finally(() => setLoading(false));
                }}
                className="text-xs underline text-pink-300 hover:text-pink-100 cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && orders.length === 0 && (
            <div className="py-14 text-center text-gray-400">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-30 text-cyan-400" />
              <p className="text-base font-semibold text-gray-300">
                No orders found for this user
              </p>
              <p className="text-xs text-gray-500 mt-1">
                This customer has not placed any orders yet.
              </p>
            </div>
          )}

          {!loading && !error && orders.length > 0 && (
            <div className="space-y-4">
              {orders.map((order, orderIdx) => {
                const formattedDate = order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "N/A";

                const itemsCount =
                  order.items?.reduce(
                    (sum, i) => sum + (Number(i.quantity) || 1),
                    0
                  ) || 0;

                return (
                  <div
                    key={order.id || orderIdx}
                    className="border border-white/10 bg-black/40 hover:border-cyan-400/40 transition-all rounded-lg p-3.5 sm:p-4 shadow-sm"
                  >
                    {/* ORDER HEADER */}
                    <div className="flex flex-wrap justify-between items-center gap-2 pb-2.5 border-b border-white/10">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold text-cyan-400">
                          Order #{order.id}
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-cyan-400/10 text-cyan-300 border border-cyan-400/30 uppercase tracking-wide">
                          {order.status || "Order Confirmed"}
                        </span>
                        <span className="text-[11px] font-mono text-gray-500">
                          ({itemsCount} {itemsCount === 1 ? "item" : "items"})
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-mono">
                        <Clock size={12} className="text-cyan-400" />
                        <span>{formattedDate}</span>
                      </div>
                    </div>

                    {/* SHIPPING INFO (IF PRESENT) */}
                    {order.shippingAddress && (
                      <div className="py-2 px-2.5 my-2 bg-white/[0.02] border border-white/5 rounded text-[11px] font-mono text-gray-400 flex items-center gap-2 flex-wrap">
                        <MapPin size={12} className="text-pink-400 shrink-0" />
                        <span className="text-gray-300">
                          {order.shippingAddress.name}
                        </span>
                        {order.shippingAddress.city && (
                          <>
                            <span className="text-gray-600">•</span>
                            <span>{order.shippingAddress.city}</span>
                          </>
                        )}
                        {order.shippingAddress.phone && (
                          <>
                            <span className="text-gray-600">•</span>
                            <span>Ph: {order.shippingAddress.phone}</span>
                          </>
                        )}
                      </div>
                    )}

                    {/* ORDER ITEMS */}
                    <div className="py-2.5 space-y-2">
                      {order.items?.map((item, idx) => {
                        const itemPrice = Number(item.price || 0);
                        const itemQuantity = Number(item.quantity || 1);
                        const itemTotal = itemPrice * itemQuantity;
                        const productId = item.productId || item.id || "N/A";

                        return (
                          <div
                            key={idx}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-2.5 bg-[#0B0F17] border border-white/5 rounded hover:border-cyan-400/20 transition"
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded bg-black/60 border border-white/10 shrink-0"
                                />
                              ) : (
                                <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded bg-slate-800 border border-white/10 text-gray-500 shrink-0">
                                  <Package size={20} />
                                </div>
                              )}

                              <div className="min-w-0 flex-1">
                                <h4
                                  className="text-xs sm:text-sm font-semibold text-white truncate"
                                  title={item.title}
                                >
                                  {item.title}
                                </h4>

                                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-1 text-[11px] text-gray-400 font-mono">
                                  <span className="text-cyan-400/90">
                                    ID: #{productId}
                                  </span>
                                  {item.category && (
                                    <>
                                      <span className="text-gray-600">•</span>
                                      <span className="text-pink-400 capitalize">
                                        {item.category}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* PRICE & QTY */}
                            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center text-xs font-mono shrink-0 pl-14 sm:pl-0">
                              <div className="text-gray-400 text-[11px]">
                                ₹{itemPrice.toLocaleString()} ×{" "}
                                <strong className="text-cyan-300">
                                  {itemQuantity}
                                </strong>
                              </div>
                              <div className="font-bold text-white text-xs sm:text-sm">
                                ₹{itemTotal.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* ORDER FOOTER */}
                    <div className="pt-2.5 border-t border-white/10 flex flex-wrap justify-between items-center text-xs font-mono text-gray-400 gap-2">
                      <div className="flex items-center gap-1.5">
                        <CreditCard size={13} className="text-cyan-400" />
                        <span>
                          Method:{" "}
                          <strong className="text-slate-200 font-medium">
                            {order.paymentMethod || "Cash on Delivery"}
                          </strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">Order Total:</span>
                        <span className="text-sm sm:text-base font-bold text-emerald-400">
                          ₹{Number(order.totalAmount || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. FIXED MODAL FOOTER */}
        <div className="shrink-0 px-5 sm:px-6 py-3 border-t border-white/10 bg-black/50 flex items-center justify-between gap-3">
          <div className="text-xs font-mono text-gray-400 truncate">
            {!loading && orders.length > 0 && (
              <span>
                Total Recorded:{" "}
                <strong className="text-cyan-400">{orders.length} orders</strong>{" "}
                (<strong className="text-emerald-400">₹{totalSpend.toLocaleString()}</strong>)
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="clip-btn px-5 py-1.5 border border-cyan-400/50 text-cyan-300 text-xs font-semibold hover:bg-cyan-400/10 hover:border-cyan-300 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}