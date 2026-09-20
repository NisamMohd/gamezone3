import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderList } from "../redux/thunks/fetchordersThunk";
import {
  Package,
  IndianRupee,
  Search,
  Calendar,
  MapPin,
  Phone,
  CreditCard,
  CheckCircle2,
  TrendingUp,
  ShoppingBag,
  User,
  Clock,
  Layers,
  ArrowUpDown,
} from "lucide-react";

function OrderDetails() {
  const { items = [], status, error } = useSelector((state) => state.orderList);
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest"); // 'newest' | 'oldest'

  useEffect(() => {
    dispatch(fetchOrderList());
  }, [dispatch]);

  // Metric summaries
  const metrics = useMemo(() => {
    const totalOrders = items.length;
    const totalRevenue = items.reduce(
      (sum, order) => sum + (Number(order.totalAmount) || 0),
      0
    );
    const totalUnits = items.reduce((sum, order) => {
      if (!Array.isArray(order.items)) return sum;
      return sum + order.items.reduce((iSum, i) => iSum + (Number(i.quantity) || 1), 0);
    }, 0);
    const confirmedCount = items.filter(
      (o) => o.status === "Order Confirmed" || !o.status
    ).length;

    return { totalOrders, totalRevenue, totalUnits, confirmedCount };
  }, [items]);

  // Payment methods list
  const paymentMethods = useMemo(() => {
    const set = new Set();
    items.forEach((o) => {
      if (o.paymentMethod) set.add(o.paymentMethod);
    });
    return Array.from(set);
  }, [items]);

  // Filter & Search
  const filteredOrders = useMemo(() => {
    return items
      .filter((order) => {
        const query = searchTerm.toLowerCase();
        const matchesId = String(order.id || "").toLowerCase().includes(query);
        const matchesUser = String(order.userId || "").toLowerCase().includes(query);
        const matchesCustomer = String(order.shippingAddress?.name || "").toLowerCase().includes(query);
        const matchesCity = String(order.shippingAddress?.city || "").toLowerCase().includes(query);
        const matchesPhone = String(order.shippingAddress?.phone || "").toLowerCase().includes(query);
        const matchesItem = Array.isArray(order.items) && order.items.some(
          (i) =>
            i.title?.toLowerCase().includes(query) ||
            i.category?.toLowerCase().includes(query)
        );

        const matchSearch =
          matchesId || matchesUser || matchesCustomer || matchesCity || matchesPhone || matchesItem;

        const matchPayment =
          paymentFilter === "all" || order.paymentMethod === paymentFilter;

        return matchSearch && matchPayment;
      })
      .sort((a, b) => {
        const timeA = new Date(a.createdAt || 0).getTime();
        const timeB = new Date(b.createdAt || 0).getTime();
        return sortOrder === "newest" ? timeB - timeA : timeA - timeB;
      });
  }, [items, searchTerm, paymentFilter, sortOrder]);

  if (status === "loading") {
    return (
      <div className="py-24 flex flex-col items-center justify-center w-full">
        <div className="w-12 h-12 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mb-4" />
        <span className="text-cyan-400 font-tech tracking-[0.3em] uppercase text-sm animate-pulse">
          RETRIEVING ORDER REGISTRY...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 flex items-center justify-center w-full">
        <div className="clip-panel border border-pink-500/50 bg-pink-500/10 px-8 py-6 max-w-md text-center">
          <p className="text-pink-400 font-tech text-sm mb-4">{error}</p>
          <button
            onClick={() => dispatch(fetchOrderList())}
            className="clip-btn bg-cyan-400 text-black px-5 py-2 font-display font-700 text-xs uppercase"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1300px] mx-auto text-white space-y-5 pb-12">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky top-16 sm:top-20 z-20 bg-black/95 backdrop-blur-md py-3 border-b border-white/10">
        <div>
          <p className="font-tech text-[11px] tracking-[0.2em] text-cyan-400 uppercase">
            ADMIN CONSOLE // DISPATCH & SALES
          </p>
          <h1 className="font-display font-700 text-2xl sm:text-3xl text-white tracking-wide uppercase">
            Order Details
          </h1>
        </div>
        <span className="font-tech text-xs text-gray-400 border border-white/10 px-3 py-1.5 rounded self-start sm:self-auto bg-[#0B0F17]">
          REGISTRY STATUS: <span className="text-emerald-400 font-bold">ONLINE</span>
        </span>
      </div>

      {/* 2. STATS METRICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Orders */}
        <div className="clip-panel bg-[#0B0F17] border border-cyan-500/30 p-4 relative">
          <div className="flex items-center justify-between">
            <span className="font-tech text-xs text-gray-400 uppercase tracking-wider">Total Orders</span>
            <ShoppingBag size={18} className="text-cyan-400" />
          </div>
          <div className="font-display font-700 text-2xl sm:text-3xl text-white mt-1">
            {metrics.totalOrders}
          </div>
        </div>

        {/* Total Revenue */}
        <div className="clip-panel bg-[#0B0F17] border border-emerald-500/30 p-4 relative">
          <div className="flex items-center justify-between">
            <span className="font-tech text-xs text-gray-400 uppercase tracking-wider">Total Revenue</span>
            <IndianRupee size={18} className="text-emerald-400" />
          </div>
          <div className="font-display font-700 text-2xl sm:text-3xl text-emerald-400 mt-1 flex items-baseline">
            <span className="text-xl mr-0.5">₹</span>
            {metrics.totalRevenue.toLocaleString()}
          </div>
        </div>

        {/* Units Sold */}
        <div className="clip-panel bg-[#0B0F17] border border-pink-500/30 p-4 relative">
          <div className="flex items-center justify-between">
            <span className="font-tech text-xs text-gray-400 uppercase tracking-wider">Units Sold</span>
            <Package size={18} className="text-pink-400" />
          </div>
          <div className="font-display font-700 text-2xl sm:text-3xl text-pink-400 mt-1">
            {metrics.totalUnits}
          </div>
        </div>

        {/* Confirmed Rate */}
        <div className="clip-panel bg-[#0B0F17] border border-purple-500/30 p-4 relative">
          <div className="flex items-center justify-between">
            <span className="font-tech text-xs text-gray-400 uppercase tracking-wider">Confirmed Orders</span>
            <CheckCircle2 size={18} className="text-purple-400" />
          </div>
          <div className="font-display font-700 text-2xl sm:text-3xl text-purple-400 mt-1">
            {metrics.confirmedCount}
          </div>
        </div>
      </div>

      {/* 3. SEARCH & FILTERS BAR */}
      <div className="clip-panel bg-[#0B0F17] border border-white/10 p-3.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Order ID, customer, city, gear..."
              className="w-full bg-black/60 border border-white/15 focus:border-cyan-400 text-xs font-mono rounded pl-9 pr-3 py-2 text-white placeholder-gray-500 focus:outline-none transition"
            />
          </div>

          {/* Payment Method Filter */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="bg-black/60 border border-white/15 text-cyan-300 text-xs font-mono rounded px-3 py-2 focus:border-cyan-400 focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-slate-900 text-white">All Payments</option>
            {paymentMethods.map((pm) => (
              <option key={pm} value={pm} className="bg-slate-900 text-white">
                {pm}
              </option>
            ))}
          </select>

          {/* Sort Order */}
          <button
            type="button"
            onClick={() => setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"))}
            className="flex items-center gap-1.5 px-3 py-2 rounded text-xs font-mono border border-white/15 text-gray-300 hover:text-white bg-black/40 transition cursor-pointer"
            title="Toggle sort order"
          >
            <ArrowUpDown size={14} />
            <span className="uppercase">{sortOrder === "newest" ? "Newest First" : "Oldest First"}</span>
          </button>
        </div>

        <span className="font-mono text-xs text-gray-400 self-end md:self-auto">
          Showing {filteredOrders.length} of {items.length} orders
        </span>
      </div>

      {/* 4. ORDERS CARDS LIST */}
      {filteredOrders.length === 0 ? (
        <div className="clip-panel bg-[#0B0F17] border border-white/10 py-16 text-center">
          <ShoppingBag size={48} className="text-gray-600 mx-auto mb-3" />
          <h3 className="font-display font-700 text-xl text-white">No Orders Found</h3>
          <p className="text-sm text-gray-400 mt-1">Try refining your search keyword or payment filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order, idx) => {
            const dateStr = order.createdAt
              ? new Date(order.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Date Unknown";

            const totalItemCount = Array.isArray(order.items)
              ? order.items.reduce((s, i) => s + (Number(i.quantity) || 1), 0)
              : 0;

            return (
              <div
                key={order.id || idx}
                className="clip-panel relative bg-[#0B0F17] border border-cyan-500/20 hover:border-cyan-400/50 transition-all p-4 sm:p-6 shadow-xl shadow-cyan-500/5 group"
              >
                <span className="corner corner-tl" />
                <span className="corner corner-br" />

                {/* CARD HEADER: ID + STATUS + TIMESTAMP */}
                <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-white/10 gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Order ID */}
                    <div className="flex items-center gap-2">
                      <span className="font-tech text-xs text-gray-400 uppercase">Order ID:</span>
                      <span className="font-mono text-sm font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-400/30 px-2.5 py-0.5 rounded">
                        #{order.id || `ORD-${idx + 1}`}
                      </span>
                    </div>

                    {/* Status Pill */}
                    <span className="inline-flex items-center gap-1.5 font-tech text-xs px-2.5 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {order.status || "Order Confirmed"}
                    </span>

                    {/* Payment Method */}
                    <span className="inline-flex items-center gap-1.5 font-tech text-[11px] px-2 py-0.5 rounded border border-white/10 bg-white/5 text-gray-300">
                      <CreditCard size={12} />
                      {order.paymentMethod || "COD"}
                    </span>
                  </div>

                  {/* Timestamp & User Link */}
                  <div className="flex items-center gap-3 text-xs font-mono text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} className="text-cyan-400" />
                      {dateStr}
                    </span>
                    <span className="text-white/20">|</span>
                    <span className="text-gray-500">User #{order.userId}</span>
                  </div>
                </div>

                {/* CUSTOMER DOSSIER BANNER */}
                <div className="my-4 p-3 bg-slate-950/60 border border-white/5 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 flex items-center justify-center font-bold">
                      <User size={14} />
                    </div>
                    <div>
                      <span className="text-white font-medium block">
                        {order.shippingAddress?.name || "Customer"}
                      </span>
                      {order.shippingAddress?.phone && (
                        <span className="text-gray-400 flex items-center gap-1 text-[11px]">
                          <Phone size={11} /> {order.shippingAddress.phone}
                        </span>
                      )}
                    </div>
                  </div>

                  {order.shippingAddress && (
                    <div className="flex items-center gap-1.5 text-gray-300">
                      <MapPin size={13} className="text-pink-400 shrink-0" />
                      <span className="truncate max-w-[320px]">
                        {[
                          order.shippingAddress.address,
                          order.shippingAddress.city,
                          order.shippingAddress.state,
                          order.shippingAddress.zip,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    </div>
                  )}
                </div>

                {/* PURCHASED ITEMS TABLE / LIST */}
                <div className="space-y-2">
                  <div className="text-[11px] font-tech text-gray-400 uppercase tracking-wider flex justify-between px-1">
                    <span>Purchased Items ({totalItemCount} units)</span>
                    <span>Item Total</span>
                  </div>

                  <div className="divide-y divide-white/5 border border-white/5 rounded-lg overflow-hidden bg-black/40">
                    {order.items?.map((product, pIdx) => {
                      const itemSubtotal =
                        (Number(product.price) || 0) * (Number(product.quantity) || 1);

                      return (
                        <div
                          key={product.productId || pIdx}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-3 gap-3 hover:bg-white/[0.02] transition"
                        >
                          {/* Item Image & Details */}
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="w-12 h-12 rounded bg-slate-950 border border-white/10 p-1 flex items-center justify-center shrink-0">
                              <img
                                src={product.image}
                                alt={product.title}
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-tech text-[10px] text-gray-500">
                                  ID: #{product.productId}
                                </span>
                                {product.category && (
                                  <span className="font-tech text-[9px] uppercase px-1.5 py-0.2 rounded bg-cyan-500/10 border border-cyan-400/30 text-cyan-300">
                                    {product.category}
                                  </span>
                                )}
                              </div>
                              <h4
                                className="font-body text-sm text-gray-200 truncate font-medium mt-0.5"
                                title={product.title}
                              >
                                {product.title}
                              </h4>
                            </div>
                          </div>

                          {/* Price x Quantity & Subtotal */}
                          <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5 shrink-0 font-mono">
                            <div className="text-right text-xs text-gray-400">
                              <span>₹{Number(product.price).toLocaleString()}</span>
                              <span className="text-pink-400 ml-1.5 font-bold">
                                × {product.quantity || 1}
                              </span>
                            </div>

                            <div className="text-right min-w-[90px]">
                              <span className="font-display font-700 text-sm text-cyan-300">
                                ₹{itemSubtotal.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ORDER CARD FOOTER: GRAND TOTAL */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="font-tech text-xs text-gray-400 uppercase tracking-wider">
                    Total Order Value
                  </span>
                  <div className="flex items-center text-white">
                    <IndianRupee size={20} className="text-cyan-400" strokeWidth={2.5} />
                    <span className="font-display font-700 text-2xl text-cyan-400">
                      {Number(order.totalAmount || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default OrderDetails;