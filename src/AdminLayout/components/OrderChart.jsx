import React, { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { BarChart3, Filter, User, Package, RotateCcw } from "lucide-react";
import { customerList } from "../redux/thunks/customerThunk";
import { fetchProducts } from "../redux/thunks/adminProductsThunk";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MONTH_ABBR = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Custom Cyberpunk Tooltip for Recharts
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#0B0F17]/95 border border-cyan-400/50 p-3 rounded-lg shadow-xl shadow-cyan-500/10 backdrop-blur-md font-body text-xs">
        <p className="font-tech text-cyan-400 uppercase tracking-widest text-[11px] mb-0.5">
          {data.name || label}
        </p>
        {data.weekday && (
          <p className="text-gray-400 text-[11px] mb-1 font-mono">
            {data.weekday} {data.dateRange}
          </p>
        )}
        {!data.weekday && data.dateRange && (
          <p className="text-gray-400 text-[11px] mb-1">{data.dateRange}</p>
        )}
        <div className="flex items-center gap-2 pt-1 border-t border-white/10">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="text-gray-300">Orders:</span>
          <span className="font-display font-700 text-sm text-white">
            {payload[0].value}
          </span>
        </div>
      </div>
    );
  }
  return null;
}

export default function OrderChart() {
  const dispatch = useDispatch();
  const { items: orders = [] } = useSelector(
    (state) => state.orderList || { items: [] }
  );
  const { items: reduxUsers = [] } = useSelector(
    (state) => state.users || { items: [] }
  );
  const { items: reduxProducts = [] } = useSelector(
    (state) => state.adminProducts || { items: [] }
  );

  useEffect(() => {
    if (!reduxUsers || reduxUsers.length === 0) {
      dispatch(customerList());
    }
    if (!reduxProducts || reduxProducts.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, reduxUsers?.length, reduxProducts?.length]);

  const now = new Date();
  const [viewMode, setViewMode] = useState("weekly"); // 'weekly' or 'monthly'
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedWeeklyMonth, setSelectedWeeklyMonth] = useState(now.getMonth()); // 0-11
  const [selectedMonthlyMonth, setSelectedMonthlyMonth] = useState("all"); // 'all' or 0-11
  const [weeklySubFilter, setWeeklySubFilter] = useState("all_weeks"); // 'all_weeks', 'w1', 'w2', 'w3', 'w4', 'w5'
  const [monthlyViewType, setMonthlyViewType] = useState("months"); // 'months' or 'all_days'
  const [selectedUser, setSelectedUser] = useState("all"); // 'all' or userId
  const [selectedProduct, setSelectedProduct] = useState("all"); // 'all' or productId/title

  // Deduplicate orders by ID or content to ensure no duplicate orders are counted
  const uniqueOrders = useMemo(() => {
    if (!Array.isArray(orders)) return [];
    const seen = new Set();
    return orders.filter((order) => {
      if (!order) return false;
      const key = order.id || JSON.stringify(order);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [orders]);

  // Unique list of users for dropdown (from Redux users + orders)
  const availableUsers = useMemo(() => {
    const userMap = new Map();

    if (Array.isArray(reduxUsers)) {
      reduxUsers.forEach((u) => {
        if (u) {
          const id = String(u.id || u._id || u.name);
          const name = u.username || u.name || u.email || `User ${id}`;
          userMap.set(id, { id, name, username: u.username || u.name });
        }
      });
    }

    if (Array.isArray(uniqueOrders)) {
      uniqueOrders.forEach((o) => {
        if (o.userId) {
          const id = String(o.userId);
          if (!userMap.has(id)) {
            const name = o.shippingAddress?.name || `User ${id}`;
            userMap.set(id, { id, name, username: name });
          }
        }
      });
    }

    return Array.from(userMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [reduxUsers, uniqueOrders]);

  // Unique list of products for dropdown (from Redux products + orders)
  const availableProducts = useMemo(() => {
    const productMap = new Map();

    if (Array.isArray(reduxProducts)) {
      reduxProducts.forEach((p) => {
        if (p) {
          const id = String(p.id || p._id || p.title);
          const title = p.title || `Product ${id}`;
          productMap.set(id, { id, title });
        }
      });
    }

    if (Array.isArray(uniqueOrders)) {
      uniqueOrders.forEach((o) => {
        if (Array.isArray(o.items)) {
          o.items.forEach((item) => {
            if (item) {
              const id = String(item.productId || item.id || item.title);
              const title = item.title || `Product ${id}`;
              if (!productMap.has(id)) {
                productMap.set(id, { id, title });
              }
            }
          });
        }
      });
    }

    return Array.from(productMap.values()).sort((a, b) =>
      a.title.localeCompare(b.title)
    );
  }, [reduxProducts, uniqueOrders]);

  // Filter orders according to selected user and product
  const filteredOrders = useMemo(() => {
    return uniqueOrders.filter((order) => {
      // Filter by user (matches userId or user name)
      if (selectedUser !== "all") {
        const targetUserObj = availableUsers.find((u) => u.id === selectedUser);
        const targetUserName = targetUserObj?.name?.toLowerCase();

        const matchesUserId = String(order.userId) === String(selectedUser);
        const matchesShippingName =
          targetUserName &&
          order.shippingAddress?.name?.toLowerCase() === targetUserName;

        if (!matchesUserId && !matchesShippingName) return false;
      }

      // Filter by product (order items must include matching productId or title)
      if (selectedProduct !== "all") {
        const targetProdObj = availableProducts.find(
          (p) => p.id === selectedProduct
        );
        const targetTitle = targetProdObj?.title?.toLowerCase();

        const hasMatchingProduct =
          Array.isArray(order.items) &&
          order.items.some((item) => {
            const matchId =
              item.productId &&
              String(item.productId) === String(selectedProduct);
            const matchTitle =
              targetTitle &&
              item.title &&
              item.title.toLowerCase() === targetTitle;
            return matchId || matchTitle;
          });

        if (!hasMatchingProduct) return false;
      }

      return true;
    });
  }, [uniqueOrders, selectedUser, selectedProduct, availableUsers, availableProducts]);

  // Available selectable years range (2023 to 2028 + any years from orders)
  const availableYears = useMemo(() => {
    const currentYear = now.getFullYear();
    const yearsSet = new Set([
      currentYear - 3,
      currentYear - 2,
      currentYear - 1,
      currentYear,
      currentYear + 1,
      currentYear + 2,
    ]);

    uniqueOrders.forEach((order) => {
      if (order.createdAt) {
        const y = new Date(order.createdAt).getFullYear();
        if (!isNaN(y)) yearsSet.add(y);
      }
    });

    return Array.from(yearsSet).sort((a, b) => b - a);
  }, [uniqueOrders, now]);

  // Current weekly month total days count
  const currentWeeklyMonthDays = useMemo(() => {
    const month = Number(selectedWeeklyMonth);
    return new Date(selectedYear, month + 1, 0).getDate();
  }, [selectedYear, selectedWeeklyMonth]);

  // Active month index for Monthly "All Days" view
  const activeMonthlyMonthIndex = useMemo(() => {
    if (selectedMonthlyMonth === "all") return selectedWeeklyMonth;
    return Number(selectedMonthlyMonth);
  }, [selectedMonthlyMonth, selectedWeeklyMonth]);

  const currentMonthlyMonthDays = useMemo(() => {
    return new Date(selectedYear, activeMonthlyMonthIndex + 1, 0).getDate();
  }, [selectedYear, activeMonthlyMonthIndex]);

  // Aggregate orders for Weekly view (Summary of 4-5 weeks)
  const weeklySummaryData = useMemo(() => {
    const month = Number(selectedWeeklyMonth);
    const daysInMonth = new Date(selectedYear, month + 1, 0).getDate();
    const shortMonth = MONTH_ABBR[month];

    const weeks = [
      {
        label: "W1 (1-7)",
        name: `Week 1 (${shortMonth} 1 - 7)`,
        orders: 0,
        dateRange: `${shortMonth} 1 - 7`,
      },
      {
        label: "W2 (8-14)",
        name: `Week 2 (${shortMonth} 8 - 14)`,
        orders: 0,
        dateRange: `${shortMonth} 8 - 14`,
      },
      {
        label: "W3 (15-21)",
        name: `Week 3 (${shortMonth} 15 - 21)`,
        orders: 0,
        dateRange: `${shortMonth} 15 - 21`,
      },
      {
        label: "W4 (22-28)",
        name: `Week 4 (${shortMonth} 22 - 28)`,
        orders: 0,
        dateRange: `${shortMonth} 22 - 28`,
      },
    ];

    if (daysInMonth > 28) {
      weeks.push({
        label: `W5 (29-${daysInMonth})`,
        name: `Week 5 (${shortMonth} 29 - ${daysInMonth})`,
        orders: 0,
        dateRange: `${shortMonth} 29 - ${daysInMonth}`,
      });
    }

    filteredOrders.forEach((order) => {
      if (!order.createdAt) return;
      const d = new Date(order.createdAt);
      if (isNaN(d.getTime())) return;

      if (
        d.getFullYear() === Number(selectedYear) &&
        d.getMonth() === month
      ) {
        const day = d.getDate();
        if (day <= 7) weeks[0].orders += 1;
        else if (day <= 14) weeks[1].orders += 1;
        else if (day <= 21) weeks[2].orders += 1;
        else if (day <= 28) weeks[3].orders += 1;
        else if (weeks[4]) weeks[4].orders += 1;
      }
    });

    return weeks;
  }, [filteredOrders, selectedYear, selectedWeeklyMonth]);

  // Aggregate daily data when selecting Week 1, Week 2, Week 3, Week 4, or Week 5 in Weekly Mode
  const weeklyDaysData = useMemo(() => {
    if (weeklySubFilter === "all_weeks") return [];
    const month = Number(selectedWeeklyMonth);
    const totalDays = new Date(selectedYear, month + 1, 0).getDate();
    const shortMonth = MONTH_ABBR[month];

    let startDay = 1;
    let endDay = totalDays;

    if (weeklySubFilter === "w1") {
      startDay = 1;
      endDay = 7;
    } else if (weeklySubFilter === "w2") {
      startDay = 8;
      endDay = 14;
    } else if (weeklySubFilter === "w3") {
      startDay = 15;
      endDay = 21;
    } else if (weeklySubFilter === "w4") {
      startDay = 22;
      endDay = 28;
    } else if (weeklySubFilter === "w5") {
      startDay = 29;
      endDay = totalDays;
    }

    const days = [];
    for (let day = startDay; day <= endDay; day++) {
      const dateObj = new Date(selectedYear, month, day);
      const weekdayName = dateObj.toLocaleDateString("en-US", {
        weekday: "short",
      });

      days.push({
        dayNumber: day,
        label: `${shortMonth} ${day}`,
        name: `${MONTH_NAMES[month]} ${day}, ${selectedYear}`,
        weekday: weekdayName,
        dateRange: `${shortMonth} ${day}`,
        orders: 0,
      });
    }

    filteredOrders.forEach((order) => {
      if (!order.createdAt) return;
      const d = new Date(order.createdAt);
      if (isNaN(d.getTime())) return;

      if (
        d.getFullYear() === Number(selectedYear) &&
        d.getMonth() === month
      ) {
        const day = d.getDate();
        if (day >= startDay && day <= endDay) {
          const targetIndex = day - startDay;
          if (days[targetIndex]) {
            days[targetIndex].orders += 1;
          }
        }
      }
    });

    return days;
  }, [filteredOrders, selectedYear, selectedWeeklyMonth, weeklySubFilter]);

  // Aggregate orders for Monthly view across all 12 months
  const annualMonthlyData = useMemo(() => {
    const months = MONTH_ABBR.map((abbr, idx) => ({
      label: abbr,
      monthIndex: idx,
      name: `${MONTH_NAMES[idx]} ${selectedYear}`,
      orders: 0,
      dateRange: `${MONTH_NAMES[idx]} ${selectedYear}`,
    }));

    filteredOrders.forEach((order) => {
      if (!order.createdAt) return;
      const d = new Date(order.createdAt);
      if (isNaN(d.getTime())) return;

      if (d.getFullYear() === Number(selectedYear)) {
        const m = d.getMonth();
        if (months[m]) {
          months[m].orders += 1;
        }
      }
    });

    return months;
  }, [filteredOrders, selectedYear]);

  // Aggregate orders for "All Days" in Monthly view
  const monthlyAllDaysData = useMemo(() => {
    if (monthlyViewType !== "all_days") return [];
    const month = activeMonthlyMonthIndex;
    const totalDays = new Date(selectedYear, month + 1, 0).getDate();
    const shortMonth = MONTH_ABBR[month];

    const days = [];
    for (let day = 1; day <= totalDays; day++) {
      const dateObj = new Date(selectedYear, month, day);
      const weekdayName = dateObj.toLocaleDateString("en-US", {
        weekday: "short",
      });

      days.push({
        dayNumber: day,
        label: `${shortMonth} ${day}`,
        name: `${MONTH_NAMES[month]} ${day}, ${selectedYear}`,
        weekday: weekdayName,
        dateRange: `${shortMonth} ${day}`,
        orders: 0,
      });
    }

    filteredOrders.forEach((order) => {
      if (!order.createdAt) return;
      const d = new Date(order.createdAt);
      if (isNaN(d.getTime())) return;

      if (
        d.getFullYear() === Number(selectedYear) &&
        d.getMonth() === month
      ) {
        const day = d.getDate();
        if (days[day - 1]) {
          days[day - 1].orders += 1;
        }
      }
    });

    return days;
  }, [filteredOrders, selectedYear, activeMonthlyMonthIndex, monthlyViewType]);

  // Decide active data based on view mode and sub-filters
  const activeData = useMemo(() => {
    if (viewMode === "weekly") {
      if (weeklySubFilter !== "all_weeks") {
        return weeklyDaysData;
      }
      return weeklySummaryData;
    }
    // Monthly view
    if (monthlyViewType === "all_days") {
      return monthlyAllDaysData;
    }
    return annualMonthlyData;
  }, [
    viewMode,
    weeklySubFilter,
    weeklyDaysData,
    weeklySummaryData,
    monthlyViewType,
    monthlyAllDaysData,
    annualMonthlyData,
  ]);

  // Total orders displayed in active period
  const totalPeriodOrders = useMemo(() => {
    return activeData.reduce((acc, item) => acc + item.orders, 0);
  }, [activeData]);

  // Total month orders in weekly mode
  const currentMonthTotalOrders = useMemo(() => {
    return weeklySummaryData.reduce((acc, item) => acc + item.orders, 0);
  }, [weeklySummaryData]);

  // Selected specific month order count in monthly mode
  const selectedMonthOrderCount = useMemo(() => {
    if (selectedMonthlyMonth === "all") return null;
    const m = Number(selectedMonthlyMonth);
    return annualMonthlyData[m]?.orders || 0;
  }, [selectedMonthlyMonth, annualMonthlyData]);

  const annualTotalOrders = useMemo(() => {
    return annualMonthlyData.reduce((acc, item) => acc + item.orders, 0);
  }, [annualMonthlyData]);

  // Dynamic Y-axis scale
  const maxOrders = useMemo(() => {
    const max = Math.max(...activeData.map((d) => d.orders), 0);
    return Math.max(max + 1, 4);
  }, [activeData]);

  return (
    <div className="w-full relative clip-panel bg-[#0B0F17] border border-cyan-500/20 p-4 sm:p-6 shadow-xl shadow-cyan-500/5">
      <span className="corner corner-tl" />
      <span className="corner corner-bl" />

      {/* TOP CONTROLS BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        {/* SELECTORS (Month & Year) */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-cyan-400 font-tech text-xs uppercase tracking-wider mr-1">
            <Filter size={14} />
            <span>Filter:</span>
          </div>

          {/* Month Selector in Weekly Mode */}
          {viewMode === "weekly" && (
            <div className="relative">
              <select
                value={selectedWeeklyMonth}
                onChange={(e) => {
                  setSelectedWeeklyMonth(Number(e.target.value));
                  setWeeklySubFilter("all_weeks");
                }}
                className="bg-black/60 border border-cyan-500/40 text-cyan-300 text-xs rounded px-3 py-1.5 focus:outline-none focus:border-cyan-400 font-mono cursor-pointer transition-colors"
                aria-label="Select Month for Weekly view"
              >
                {MONTH_NAMES.map((name, idx) => (
                  <option key={idx} value={idx} className="bg-slate-900 text-white">
                    {name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Month Selector in Monthly Mode */}
          {viewMode === "monthly" && (
            <div className="relative">
              <select
                value={selectedMonthlyMonth}
                onChange={(e) => setSelectedMonthlyMonth(e.target.value)}
                className="bg-black/60 border border-cyan-500/40 text-cyan-300 text-xs rounded px-3 py-1.5 focus:outline-none focus:border-cyan-400 font-mono cursor-pointer transition-colors"
                aria-label="Select Month for Monthly view"
              >
                <option value="all" className="bg-slate-900 text-white">
                  All Months (Jan - Dec)
                </option>
                {MONTH_NAMES.map((name, idx) => (
                  <option key={idx} value={idx} className="bg-slate-900 text-white">
                    {name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Year Selector */}
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-black/60 border border-cyan-500/40 text-cyan-300 text-xs rounded px-3 py-1.5 focus:outline-none focus:border-cyan-400 font-mono cursor-pointer transition-colors"
              aria-label="Select Year"
            >
              {availableYears.map((yr) => (
                <option key={yr} value={yr} className="bg-slate-900 text-white">
                  {yr}
                </option>
              ))}
            </select>
          </div>

          {/* User Selector (Username / Name) */}
          <div className="relative">
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className={`bg-black/60 border text-xs rounded px-3 py-1.5 focus:outline-none font-mono cursor-pointer transition-colors max-w-[140px] sm:max-w-[170px] truncate ${
                selectedUser !== "all"
                  ? "border-pink-500 text-pink-300 shadow-[0_0_8px_rgba(255,61,138,0.25)]"
                  : "border-cyan-500/40 text-cyan-300 focus:border-cyan-400"
              }`}
              aria-label="Filter orders by user"
            >
              <option value="all" className="bg-slate-900 text-white">
                All Users
              </option>
              {availableUsers.map((u) => (
                <option key={u.id} value={u.id} className="bg-slate-900 text-white">
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          {/* Product Selector (Title) */}
          <div className="relative">
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className={`bg-black/60 border text-xs rounded px-3 py-1.5 focus:outline-none font-mono cursor-pointer transition-colors max-w-[150px] sm:max-w-[190px] truncate ${
                selectedProduct !== "all"
                  ? "border-pink-500 text-pink-300 shadow-[0_0_8px_rgba(255,61,138,0.25)]"
                  : "border-cyan-500/40 text-cyan-300 focus:border-cyan-400"
              }`}
              aria-label="Filter orders by product"
            >
              <option value="all" className="bg-slate-900 text-white">
                All Products
              </option>
              {availableProducts.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-white" title={p.title}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters button if any user/product filter is active */}
          {(selectedUser !== "all" || selectedProduct !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSelectedUser("all");
                setSelectedProduct("all");
              }}
              className="text-[11px] font-mono text-pink-400 hover:text-pink-300 bg-pink-500/10 border border-pink-500/30 px-2 py-1 rounded transition-all hover:bg-pink-500/20 cursor-pointer flex items-center gap-1"
              title="Reset user and product filters"
            >
              <RotateCcw size={11} />
              <span>Reset</span>
            </button>
          )}

          {/* Current Period Info */}
          <div className="text-xs text-gray-400 font-mono hidden sm:inline-block ml-1">
            {viewMode === "weekly"
              ? `${MONTH_NAMES[selectedWeeklyMonth]} ${selectedYear}`
              : selectedMonthlyMonth === "all"
              ? `Year ${selectedYear} (All Months)`
              : `${MONTH_NAMES[selectedMonthlyMonth]} ${selectedYear}`}
          </div>
        </div>

        {/* TOP RIGHT TOGGLES: Weekly vs Monthly */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex rounded clip-btn border border-cyan-500/30 bg-black/40 p-0.5">
            <button
              type="button"
              onClick={() => {
                setViewMode("weekly");
              }}
              className={`px-3 py-1 text-xs font-display font-600 tracking-wider transition-all duration-200 cursor-pointer ${
                viewMode === "weekly"
                  ? "bg-cyan-500/20 text-cyan-300 shadow-[0_0_10px_rgba(0,229,255,0.2)]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Weekly
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode("monthly");
              }}
              className={`px-3 py-1 text-xs font-display font-600 tracking-wider transition-all duration-200 cursor-pointer ${
                viewMode === "monthly"
                  ? "bg-cyan-500/20 text-cyan-300 shadow-[0_0_10px_rgba(0,229,255,0.2)]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
          </div>
        </div>
      </div>

      {/* SUBHEADER: TITLE + FILTERS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mt-4 mb-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <BarChart3 size={17} className="text-cyan-400 shrink-0" />
            <h3 className="font-display font-700 text-sm sm:text-base text-white tracking-wide uppercase whitespace-nowrap">
              {viewMode === "weekly"
                ? weeklySubFilter === "all_weeks"
                  ? `Weekly Order Trend — ${MONTH_NAMES[selectedWeeklyMonth]} ${selectedYear}`
                  : weeklySubFilter === "w1"
                  ? `${MONTH_NAMES[selectedWeeklyMonth]} ${selectedYear} — Week 1 (Days 1–7)`
                  : weeklySubFilter === "w2"
                  ? `${MONTH_NAMES[selectedWeeklyMonth]} ${selectedYear} — Week 2 (Days 8–14)`
                  : weeklySubFilter === "w3"
                  ? `${MONTH_NAMES[selectedWeeklyMonth]} ${selectedYear} — Week 3 (Days 15–21)`
                  : weeklySubFilter === "w4"
                  ? `${MONTH_NAMES[selectedWeeklyMonth]} ${selectedYear} — Week 4 (Days 22–28)`
                  : `${MONTH_NAMES[selectedWeeklyMonth]} ${selectedYear} — Week 5 (Days 29–${currentWeeklyMonthDays})`
                : monthlyViewType === "all_days"
                ? `${MONTH_NAMES[activeMonthlyMonthIndex]} ${selectedYear} — All Days (1–${currentMonthlyMonthDays})`
                : selectedMonthlyMonth === "all"
                ? `Monthly Order Trend — Year ${selectedYear}`
                : `Monthly Trend — ${MONTH_NAMES[selectedMonthlyMonth]} ${selectedYear} Focus`}
            </h3>
          </div>

          {/* WEEKLY SIDE FILTER PILLS (W1 to W5) */}
          {viewMode === "weekly" && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 max-w-full">
              <button
                type="button"
                onClick={() => setWeeklySubFilter("all_weeks")}
                className={`px-2.5 py-1 text-xs font-mono rounded clip-btn border transition-all whitespace-nowrap cursor-pointer ${
                  weeklySubFilter === "all_weeks"
                    ? "bg-cyan-500/25 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(0,229,255,0.25)] font-bold"
                    : "border-white/10 text-gray-400 hover:text-white hover:border-white/20 bg-black/40"
                }`}
              >
                All Weeks
              </button>

              <button
                type="button"
                onClick={() => setWeeklySubFilter("w1")}
                className={`px-2.5 py-1 text-xs font-mono rounded clip-btn border transition-all whitespace-nowrap cursor-pointer ${
                  weeklySubFilter === "w1"
                    ? "bg-cyan-500/25 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(0,229,255,0.25)] font-bold"
                    : "border-white/10 text-gray-400 hover:text-white hover:border-white/20 bg-black/40"
                }`}
              >
                Week 1 (1-7)
              </button>

              <button
                type="button"
                onClick={() => setWeeklySubFilter("w2")}
                className={`px-2.5 py-1 text-xs font-mono rounded clip-btn border transition-all whitespace-nowrap cursor-pointer ${
                  weeklySubFilter === "w2"
                    ? "bg-cyan-500/25 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(0,229,255,0.25)] font-bold"
                    : "border-white/10 text-gray-400 hover:text-white hover:border-white/20 bg-black/40"
                }`}
              >
                Week 2 (8-14)
              </button>

              <button
                type="button"
                onClick={() => setWeeklySubFilter("w3")}
                className={`px-2.5 py-1 text-xs font-mono rounded clip-btn border transition-all whitespace-nowrap cursor-pointer ${
                  weeklySubFilter === "w3"
                    ? "bg-cyan-500/25 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(0,229,255,0.25)] font-bold"
                    : "border-white/10 text-gray-400 hover:text-white hover:border-white/20 bg-black/40"
                }`}
              >
                Week 3 (15-21)
              </button>

              <button
                type="button"
                onClick={() => setWeeklySubFilter("w4")}
                className={`px-2.5 py-1 text-xs font-mono rounded clip-btn border transition-all whitespace-nowrap cursor-pointer ${
                  weeklySubFilter === "w4"
                    ? "bg-cyan-500/25 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(0,229,255,0.25)] font-bold"
                    : "border-white/10 text-gray-400 hover:text-white hover:border-white/20 bg-black/40"
                }`}
              >
                Week 4 (22-28)
              </button>

              {currentWeeklyMonthDays > 28 && (
                <button
                  type="button"
                  onClick={() => setWeeklySubFilter("w5")}
                  className={`px-2.5 py-1 text-xs font-mono rounded clip-btn border transition-all whitespace-nowrap cursor-pointer ${
                    weeklySubFilter === "w5"
                      ? "bg-cyan-500/25 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(0,229,255,0.25)] font-bold"
                      : "border-white/10 text-gray-400 hover:text-white hover:border-white/20 bg-black/40"
                  }`}
                >
                  Week 5 (29-{currentWeeklyMonthDays})
                </button>
              )}
            </div>
          )}

          {/* MONTHLY SIDE: ALL DAYS & 12 MONTHS FILTERS */}
          {viewMode === "monthly" && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 max-w-full">
              <button
                type="button"
                onClick={() => setMonthlyViewType("months")}
                className={`px-2.5 py-1 text-xs font-mono rounded clip-btn border transition-all whitespace-nowrap cursor-pointer ${
                  monthlyViewType === "months"
                    ? "bg-cyan-500/25 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(0,229,255,0.25)] font-bold"
                    : "border-white/10 text-gray-400 hover:text-white hover:border-white/20 bg-black/40"
                }`}
              >
                12 Months
              </button>

              <button
                type="button"
                onClick={() => {
                  setMonthlyViewType("all_days");
                  // If "all" months was active, set it to the specific focused month so days are clear
                  if (selectedMonthlyMonth === "all") {
                    setSelectedMonthlyMonth(String(selectedWeeklyMonth));
                  }
                }}
                className={`px-2.5 py-1 text-xs font-mono rounded clip-btn border transition-all whitespace-nowrap cursor-pointer ${
                  monthlyViewType === "all_days"
                    ? "bg-cyan-500/25 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(0,229,255,0.25)] font-bold"
                    : "border-white/10 text-gray-400 hover:text-white hover:border-white/20 bg-black/40"
                }`}
              >
                All Days (1-{currentMonthlyMonthDays})
              </button>
            </div>
          )}
        </div>

        {/* ORDER COUNT BADGE */}
        <div className="flex items-center gap-2 font-mono text-xs text-gray-300 bg-white/[0.02] px-3 py-1 rounded border border-white/5 self-start lg:self-auto shrink-0 flex-wrap">
          <span>Orders Recorded:</span>
          <span className="font-bold text-cyan-400 text-sm">
            {viewMode === "weekly" && weeklySubFilter !== "all_weeks"
              ? `${totalPeriodOrders} in this week (Month Total: ${currentMonthTotalOrders})`
              : viewMode === "monthly" && monthlyViewType === "all_days"
              ? `${totalPeriodOrders} in ${MONTH_ABBR[activeMonthlyMonthIndex]} ${selectedYear}`
              : viewMode === "monthly" && selectedMonthlyMonth !== "all"
              ? `${selectedMonthOrderCount} in ${MONTH_ABBR[selectedMonthlyMonth]} (Annual: ${annualTotalOrders})`
              : totalPeriodOrders}
          </span>
          {selectedUser !== "all" && (
            <span className="text-[10px] text-pink-400 bg-pink-500/10 border border-pink-500/20 px-1.5 py-0.5 rounded font-mono">
              User: {availableUsers.find((u) => u.id === selectedUser)?.name || selectedUser}
            </span>
          )}
          {selectedProduct !== "all" && (
            <span
              className="text-[10px] text-pink-400 bg-pink-500/10 border border-pink-500/20 px-1.5 py-0.5 rounded font-mono max-w-[150px] sm:max-w-[220px] truncate"
              title={availableProducts.find((p) => p.id === selectedProduct)?.title}
            >
              Product: {availableProducts.find((p) => p.id === selectedProduct)?.title || selectedProduct}
            </span>
          )}
        </div>
      </div>

      {/* RECHARTS CONTAINER */}
      <div className="w-full h-72 sm:h-80 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={activeData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            {/* Cyberpunk Neon Gradient Definition */}
            <defs>
              <linearGradient id="cyberpunkOrderBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00E5FF" stopOpacity={0.9} />
                <stop offset="60%" stopColor="#00A2FF" stopOpacity={0.7} />
                <stop offset="100%" stopColor="#FF3D8A" stopOpacity={0.6} />
              </linearGradient>
              <linearGradient id="highlightBarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF3D8A" stopOpacity={1} />
                <stop offset="100%" stopColor="#f70063" stopOpacity={0.8} />
              </linearGradient>
            </defs>

            {/* Subtle Grid Lines */}
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(0, 229, 255, 0.08)"
              vertical={false}
            />

            <XAxis
              dataKey="label"
              tick={{ fill: "#94a3b8", fontSize: 11, fontFamily: "JetBrains Mono" }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              tickLine={{ stroke: "rgba(255,255,255,0.1)" }}
            />

            <YAxis
              allowDecimals={false}
              domain={[0, maxOrders]}
              tick={{ fill: "#94a3b8", fontSize: 11, fontFamily: "JetBrains Mono" }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              tickLine={{ stroke: "rgba(255,255,255,0.1)" }}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(0, 229, 255, 0.05)" }}
            />

            <Bar
              dataKey="orders"
              fill="url(#cyberpunkOrderBar)"
              radius={[4, 4, 0, 0]}
              maxBarSize={activeData.length > 15 ? 24 : 48}
              animationDuration={450}
            >
              {/* Highlight chosen month in annual monthly view */}
              {viewMode === "monthly" &&
                monthlyViewType === "months" &&
                selectedMonthlyMonth !== "all" &&
                activeData.map((entry, index) => {
                  const isChosen = index === Number(selectedMonthlyMonth);
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={isChosen ? "url(#highlightBarGrad)" : "url(#cyberpunkOrderBar)"}
                      stroke={isChosen ? "#00E5FF" : "none"}
                      strokeWidth={isChosen ? 2 : 0}
                      opacity={isChosen ? 1 : 0.45}
                    />
                  );
                })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
