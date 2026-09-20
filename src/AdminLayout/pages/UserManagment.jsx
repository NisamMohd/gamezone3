import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { customerList } from "../redux/thunks/customerThunk";
import { toggleBlockuser } from "../redux/thunks/blockuserThunk";
import { deleteUser } from "../redux/thunks/deleteUserThunk";
import {
  EyeOff,
  Eye,
  Plus,
  Search,
  Users,
  ShieldCheck,
  UserX,
  Radio,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import ViewOrdersModal from "../components/ViewOrdersModal";

function UserManagement() {
  const { items = [], loading } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'online' | 'offline' | 'blocked'
  const [roleFilter, setRoleFilter] = useState("all"); // 'all' | 'customer' | 'admin'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    dispatch(customerList());
  }, [dispatch]);

  // Metrics summary
  const metrics = useMemo(() => {
    const total = items.length;
    const online = items.filter((u) => u.isOnline && !u.isBlocked).length;
    const blocked = items.filter((u) => u.isBlocked).length;
    const admins = items.filter((u) => u.role === "admin").length;
    return { total, online, blocked, admins };
  }, [items]);

  // Search & Filter
  const filteredUsers = useMemo(() => {
    return items.filter((user) => {
      const matchSearch =
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(user.id).toLowerCase().includes(searchTerm.toLowerCase());

      let matchStatus = true;
      if (statusFilter === "online") matchStatus = user.isOnline && !user.isBlocked;
      if (statusFilter === "offline") matchStatus = !user.isOnline && !user.isBlocked;
      if (statusFilter === "blocked") matchStatus = Boolean(user.isBlocked);

      let matchRole = true;
      if (roleFilter !== "all") matchRole = user.role === roleFilter;

      return matchSearch && matchStatus && matchRole;
    });
  }, [items, searchTerm, statusFilter, roleFilter]);

  const handleView = (item) => {
    setSelectedUser(item);
    setIsModalOpen(true);
  };

  const handleBlock = (item) => {
    dispatch(
      toggleBlockuser({
        userId: item.id,
        isBlocked: !item.isBlocked,
      })
    )
      .unwrap()
      .then(() =>
        toast.success(
          item.isBlocked ? "User Unblocked" : "User Blocked",
          `${item.name} access has been updated.`
        )
      )
      .catch((err) => toast.error("Update Failed", err || "Could not block user"));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Permanently delete this user account?")) return;
    dispatch(deleteUser(id))
      .unwrap()
      .then(() => toast.success("User Deleted"))
      .catch((err) => toast.error("Delete Failed", err || "Operation failed"));
  };

  return (
    <div className="w-full max-w-[1300px] mx-auto space-y-5 pb-10">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-16 sm:top-20 z-20 bg-black/95 backdrop-blur-md py-3 border-b border-white/10">
        <div>
          <p className="font-tech text-[11px] tracking-[0.2em] text-cyan-400 uppercase">
            ADMIN CONSOLE // USERS
          </p>
          <h1 className="font-display font-700 text-2xl sm:text-3xl text-white tracking-wide uppercase">
            Manage Users
          </h1>
        </div>

        <button
          onClick={() => navigate("../adduser")}
          className="clip-btn self-start sm:self-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-display font-700 px-4 py-2 text-sm tracking-wider uppercase transition shadow-lg shadow-cyan-500/20 flex items-center gap-2 cursor-pointer"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>Add User</span>
        </button>
      </div>

      {/* 2. STATS METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="clip-panel bg-[#0B0F17] border border-cyan-500/30 p-3.5 sm:p-4">
          <div className="flex items-center justify-between">
            <span className="font-tech text-xs text-gray-400 uppercase tracking-wider">Total Users</span>
            <Users size={18} className="text-cyan-400" />
          </div>
          <div className="font-display font-700 text-2xl sm:text-3xl text-white mt-1">
            {metrics.total}
          </div>
        </div>

        <div className="clip-panel bg-[#0B0F17] border border-emerald-500/30 p-3.5 sm:p-4">
          <div className="flex items-center justify-between">
            <span className="font-tech text-xs text-gray-400 uppercase tracking-wider">Active Online</span>
            <Radio size={18} className="text-emerald-400 animate-pulse" />
          </div>
          <div className="font-display font-700 text-2xl sm:text-3xl text-emerald-400 mt-1">
            {metrics.online}
          </div>
        </div>

        <div className="clip-panel bg-[#0B0F17] border border-pink-500/30 p-3.5 sm:p-4">
          <div className="flex items-center justify-between">
            <span className="font-tech text-xs text-gray-400 uppercase tracking-wider">Blocked</span>
            <UserX size={18} className="text-pink-400" />
          </div>
          <div className="font-display font-700 text-2xl sm:text-3xl text-pink-400 mt-1">
            {metrics.blocked}
          </div>
        </div>

        <div className="clip-panel bg-[#0B0F17] border border-purple-500/30 p-3.5 sm:p-4">
          <div className="flex items-center justify-between">
            <span className="font-tech text-xs text-gray-400 uppercase tracking-wider">Administrators</span>
            <ShieldCheck size={18} className="text-purple-400" />
          </div>
          <div className="font-display font-700 text-2xl sm:text-3xl text-purple-400 mt-1">
            {metrics.admins}
          </div>
        </div>
      </div>

      {/* 3. SEARCH & FILTERS BAR */}
      <div className="clip-panel bg-[#0B0F17] border border-white/10 p-3.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or ID..."
              className="w-full bg-black/50 border border-white/15 focus:border-cyan-400 text-xs font-mono rounded pl-9 pr-3 py-2 text-white placeholder-gray-500 focus:outline-none transition"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-black/50 border border-white/15 text-cyan-300 text-xs font-mono rounded px-3 py-2 focus:border-cyan-400 focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-slate-900 text-white">All Status</option>
            <option value="online" className="bg-slate-900 text-white">Online Only</option>
            <option value="offline" className="bg-slate-900 text-white">Offline Only</option>
            <option value="blocked" className="bg-slate-900 text-white">Blocked Only</option>
          </select>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-black/50 border border-white/15 text-cyan-300 text-xs font-mono rounded px-3 py-2 focus:border-cyan-400 focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-slate-900 text-white">All Roles</option>
            <option value="customer" className="bg-slate-900 text-white">Customers</option>
            <option value="seller" className="bg-slate-900 text-white">Seller</option>
          </select>
        </div>

        <span className="font-mono text-xs text-gray-400 self-end md:self-auto">
          Showing {filteredUsers.length} of {items.length} users
        </span>
      </div>

      {/* 4. USERS TABLE */}
      <div className="clip-panel bg-[#0B0F17] border border-cyan-500/20 overflow-hidden shadow-xl shadow-cyan-500/5">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left min-w-[760px]">
            <thead>
              <tr className="border-b border-cyan-500/20 bg-slate-900/80 text-xs font-tech text-cyan-400 uppercase">
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Email Address</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Activity Status</th>
                <th className="px-4 py-3">Orders</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs sm:text-sm font-body">
              {filteredUsers.map((item) => {
                const initials = (item.name || "U")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <tr key={item.id} className="hover:bg-cyan-500/5 transition-colors">
                    {/* User & ID */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-tech font-bold text-xs flex items-center justify-center shrink-0">
                          {initials}
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="font-medium text-gray-200">{item.name}</div>
                          <div className="font-mono text-[10px] text-gray-500">ID: #{item.id}</div>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3 font-mono text-xs text-gray-300">
                      {item.email}
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3">
                      <span
                        className={`font-tech text-[10px] uppercase px-2 py-0.5 rounded border ${
                          item.role === "admin"
                            ? "border-purple-500/30 text-purple-300 bg-purple-500/10"
                            : "border-cyan-500/30 text-cyan-300 bg-cyan-500/10"
                        }`}
                      >
                        {item.role || "customer"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 font-tech text-xs px-2.5 py-1 rounded border uppercase ${
                          item.isBlocked
                            ? "text-pink-400 border-pink-500/30 bg-pink-500/10"
                            : item.isOnline
                            ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                            : "text-gray-400 border-gray-600/30 bg-gray-600/10"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.isBlocked
                              ? "bg-pink-400"
                              : item.isOnline
                              ? "bg-emerald-400 animate-pulse"
                              : "bg-gray-500"
                          }`}
                        />
                        {item.isBlocked ? "Blocked" : item.isOnline ? "Online" : "Offline"}
                      </span>
                    </td>

                    {/* Orders Modal Trigger */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleView(item)}
                        className="px-2.5 py-1 rounded text-xs font-tech border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <ShoppingBag size={13} />
                        <span>View Orders</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleBlock(item)}
                          className={`px-2.5 py-1 rounded text-xs font-tech border transition cursor-pointer flex items-center gap-1 ${
                            item.isBlocked
                              ? "border-pink-500/40 text-pink-300 hover:bg-pink-500/20"
                              : "border-white/10 text-gray-300 hover:text-white hover:border-white/25"
                          }`}
                        >
                          {item.isBlocked ? <Eye size={13} /> : <EyeOff size={13} />}
                          <span>{item.isBlocked ? "Unblock" : "Block"}</span>
                        </button>

                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded text-pink-400 border border-pink-500/30 hover:bg-pink-500/20 transition cursor-pointer"
                          title="Delete User"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ViewOrdersModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
        userId={selectedUser?.id}
        userName={selectedUser?.name}
      />
    </div>
  );
}

export default UserManagement;