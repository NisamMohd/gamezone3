import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  UserCog,
  PackageSearch,
  ClipboardList,
  IndianRupee,
  Activity,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { customerList } from "../redux/thunks/customerThunk";
import { fetchProducts } from "../redux/thunks/adminProductsThunk";
import { fetchOrderList } from "../redux/thunks/fetchordersThunk";
import OrderChart from "../components/OrderChart";

function Dashboard() {
  const dispatch = useDispatch();
  const { items: users } = useSelector((state) => state.users || { items: [] });
  const { items: products } = useSelector(
    (state) => state.adminProducts || { items: [] }
  );
  const { items: orders } = useSelector(
    (state) => state.orderList || { items: [] }
  );

  useEffect(() => {
    dispatch(customerList());
    dispatch(fetchProducts());
    dispatch(fetchOrderList());
  }, [dispatch]);

  // Calculate quick metrics
  const totalUsers = users?.length || 0;
  const totalProducts = products?.length || 0;
  const totalOrders = orders?.length || 0;

  const totalRevenue = orders?.reduce((acc, order) => {
    return acc + Number(order.totalAmount || 0);
  }, 0) || 0;

  const stats = [
    {
      label: "Total Users",
      value: totalUsers,
      icon: UserCog,
      color: "text-cyan-400",
      hcolor: "group-hover:text-cyan-400",
      borderColor: "border-cyan-500/30",
      bgGlow: "rgba(0,229,255,0.06)",
      to: "/admin/usermanagment",
    },
    {
      label: "Catalog Products",
      value: totalProducts,
      icon: PackageSearch,
      color: "text-pink-400",
      hcolor: "group-hover:text-pink-400",
      borderColor: "border-pink-500/30",
      bgGlow: "rgba(255,61,138,0.06)",
      to: "/admin/productmanagement",
    },
    {
      label: "Total Orders",
      value: totalOrders,
      icon: ClipboardList,
      color: "text-emerald-400",
      hcolor: "group-hover:text-emerald-400",
      borderColor: "border-emerald-500/30",
      bgGlow: "rgba(52,211,153,0.06)",
      to: "/admin/orderdetails",
    },
    {
      label: "Gross Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: IndianRupee,
      color: "text-amber-400",
      hcolor: "group-hover:text-amber-400",
      borderColor: "border-amber-500/30",
      bgGlow: "rgba(251,191,36,0.06)",
      to: "/admin/orderdetails",
    },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Header section with responsive flex wrap */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <p className="font-tech text-[11px] tracking-[0.2em] text-cyan-400 uppercase">
            Admin Console
          </p>
          <h1 className="font-display font-700 text-2xl sm:text-3xl text-white tracking-wide uppercase">
            System Overview
          </h1>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded clip-btn border border-cyan-500/30 bg-cyan-500/10 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-tech text-xs text-cyan-300 uppercase tracking-widest">
            System Online
          </span>
        </div>
      </div>

      {/* Metrics Grid: 1 col on mobile, 2 on tablet, 4 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Link
              key={idx}
              to={stat.to}
              className={`relative clip-panel bg-[#0B0F17] border ${stat.borderColor} p-4 sm:p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg group`}
              style={{ background: `linear-gradient(135deg, #0B0F17 60%, ${stat.bgGlow})` }}
            >
              <div className="flex items-center justify-between">
                <span className="font-tech text-xs uppercase tracking-wider text-gray-400">
                  {stat.label}
                </span>
                <div className={`p-2 rounded border border-white/10 ${stat.color} bg-white/[0.02]`}>
                  <Icon size={20} />
                </div>
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <span className="font-display font-700 text-2xl sm:text-3xl text-white">
                  {stat.value}
                </span>
                <span className={`text-xs text-gray-500 ${stat.hcolor} flex items-center gap-1 transition-colors`}>
                  View <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ORDER SALES & COUNT GRAPH */}
      <div className="mt-6">
        <OrderChart />
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="mt-8">
        <h2 className="font-display font-700 text-lg text-white mb-4 tracking-wide uppercase flex items-center gap-2">
          <Activity size={18} className="text-cyan-400" />
          Quick Management Portals
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link
            to="/admin/usermanagment"
            className="clip-panel bg-[#0B0F17] border border-cyan-500/20 p-5 hover:border-cyan-400/50 hover:bg-cyan-500/5 transition group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <UserCog className="text-cyan-400" size={22} />
                <h3 className="font-display font-600 text-lg text-white group-hover:text-cyan-300 transition">
                  User Control
                </h3>
              </div>
              <p className="text-xs text-gray-400 font-body">
                View registered customers, toggle access block status, inspect orders and manage users.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-cyan-400">
              <span>Manage {totalUsers} Users</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
            </div>
          </Link>

          <Link
            to="/admin/productmanagement"
            className="clip-panel bg-[#0B0F17] border border-cyan-500/20 p-5 hover:border-pink-400/50 hover:bg-pink-500/5 transition group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <PackageSearch className="text-pink-400" size={22} />
                <h3 className="font-display font-600 text-lg text-white group-hover:text-pink-300 transition">
                  Product Inventory
                </h3>
              </div>
              <p className="text-xs text-gray-400 font-body">
                Manage gaming catalog, stock levels, visibility toggles, and add new inventory.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-pink-400">
              <span>Manage {totalProducts} Products</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
            </div>
          </Link>

          <Link
            to="/admin/orderdetails"
            className="clip-panel bg-[#0B0F17] border border-cyan-500/20 p-5 hover:border-emerald-400/50 hover:bg-emerald-500/5 transition group flex flex-col justify-between sm:col-span-2 md:col-span-1"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <ClipboardList className="text-emerald-400" size={22} />
                <h3 className="font-display font-600 text-lg text-white group-hover:text-emerald-300 transition">
                  Order Stream
                </h3>
              </div>
              <p className="text-xs text-gray-400 font-body">
                Track customer orders, delivery addresses, product quantities, and real-time status.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-emerald-400">
              <span>Inspect {totalOrders} Orders</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;