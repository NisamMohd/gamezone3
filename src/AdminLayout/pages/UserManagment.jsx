import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { customerList } from "../redux/thunks/customerThunk";
import { toggleBlockuser } from "../redux/thunks/blockuserThunk";
import { EyeOff, Eye, Plus } from "lucide-react";
import { deleteUser } from "../redux/thunks/deleteUserThunk";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import ViewOrdersModal from "../components/ViewOrdersModal";

function UserManagement() {
  const { items, loading } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    dispatch(customerList());
  }, [dispatch]);

  const handleView = (item) => {
    setSelectedUser(item);
    setIsModalOpen(true);
  };

  const handleBlock = (item) => {
    dispatch(
      toggleBlockuser({
        userId: item.id,
        isBlocked: !item.isBlocked,
      }),
    )
      .unwrap()
      .then(() =>
        toast.success(
          item.isBlocked
            ? "User unblocked successfully"
            : "User blocked successfully",
        ),
      )
      .catch((err) =>
        toast.error("Update failed", err || "could not block user"),
      );
  };

  if (loading) return <div className="text-white p-4">Loading...</div>;

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky top-16 sm:top-20 z-20 bg-black/95 backdrop-blur-sm py-3 border-b border-white/10 mb-4">
        <div>
          <p className="font-tech text-[11px] tracking-[0.2em] text-cyan-400 mb-0.5">
            ADMIN CONSOLE
          </p>
          <h1 className="font-display font-700 text-2xl sm:text-3xl text-white tracking-wide uppercase">
            Manage Users
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5 font-body">
            {items.length} User{items.length !== 1 ? "s" : ""} in catalog
          </p>
        </div>
        <div>
          <button
            className="text-cyan-400 clip-btn px-3 py-1.5 border border-cyan-400/50 hover:bg-cyan-400/10 transition-colors text-sm"
            style={{
              background: isHovered
                ? "linear-gradient(120deg, #00bbff, #f70063)"
                : "transparent",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => navigate("../adduser")}
          >
            <span className="flex gap-1.5 items-center font-display font-600">
              Add User
              <Plus size={16} />
            </span>
          </button>
        </div>
      </div>

      {/* TABLE CONTAINER WITH HORIZONTAL SCROLL FOR MOBILE */}
      <div className="text-white font-body">
        <div className="rounded-xl border border-cyan-500/20 bg-slate-900/60 overflow-hidden shadow-lg shadow-cyan-500/5">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left min-w-[680px]">
              <thead>
                <tr className="border-b border-cyan-500/20 bg-slate-800/50 text-xs sm:text-sm">
                  <th className="px-3 sm:px-4 py-3 font-semibold text-cyan-400 uppercase tracking-wide">
                    Id
                  </th>
                  <th className="px-3 sm:px-4 py-3 font-semibold text-cyan-400 uppercase tracking-wide">
                    Name
                  </th>
                  <th className="px-3 sm:px-4 py-3 font-semibold text-cyan-400 uppercase tracking-wide">
                    Email
                  </th>
                  <th className="px-3 sm:px-4 py-3 font-semibold text-cyan-400 uppercase tracking-wide">
                    Role
                  </th>
                  <th className="px-3 sm:px-4 py-3 font-semibold text-cyan-400 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-3 sm:px-4 py-3 font-semibold text-cyan-400 uppercase tracking-wide">
                    Orders
                  </th>
                  <th className="px-3 sm:px-4 py-3 font-semibold text-cyan-400 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="text-xs sm:text-sm">
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-700/50 hover:bg-cyan-500/5 transition-colors duration-150"
                  >
                    <td className="px-3 sm:px-4 py-3 text-slate-300">
                      <div className="flex gap-2 items-center">
                        <span
                          className={`h-2 w-2 rounded-full shrink-0 ${
                            item.isOnline === true ? "bg-green-500" : "bg-red-500"
                          } animate-pulse`}
                        />
                        <span className="font-mono text-xs">{item.id}</span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-slate-200 font-medium">
                      {item.name}
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-slate-300 font-mono text-xs">
                      {item.email}
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-slate-300 uppercase text-xs font-tech">
                      {item.role}
                    </td>
                    <td className="px-3 sm:px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 text-xs rounded uppercase font-tech ${
                          item.isBlocked
                            ? "text-pink-400 bg-pink-500/10 border border-pink-500/30"
                            : item.isOnline
                            ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/30"
                            : "text-gray-400 bg-gray-500/10 border border-gray-500/30"
                        }`}
                      >
                        {item.isBlocked
                          ? "Blocked"
                          : item.isOnline
                          ? "Online"
                          : "Offline"}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-3">
                      <button
                        className="text-cyan-400 hover:text-pink-400 clip-btn px-2.5 sm:px-3 py-1 border border-cyan-400/50 hover:border-pink-400/50 hover:bg-pink-400/10 transition-colors text-xs whitespace-nowrap"
                        onClick={() => handleView(item)}
                      >
                        View
                      </button>
                    </td>
                    <td className="px-3 sm:px-4 py-3">
                      <div className="flex items-center gap-1.5 sm:gap-2 whitespace-nowrap">
                        <button
                          onClick={() => handleBlock(item)}
                          className={`clip-btn px-2.5 sm:px-3 py-1 border text-xs transition-colors ${
                            item.isBlocked
                              ? "text-pink-400 hover:text-cyan-400 border-pink-400/50 hover:border-cyan-400/50 hover:bg-cyan-400/10"
                              : "text-cyan-400 hover:text-pink-400 border-cyan-400/50 hover:border-pink-400/50 hover:bg-pink-400/10"
                          }`}
                        >
                          <span className="flex items-center gap-1">
                            {item.isBlocked ? (
                              <Eye size={14} />
                            ) : (
                              <EyeOff size={14} />
                            )}
                            {item.isBlocked ? "Unblock" : "Block"}
                          </span>
                        </button>
                        <button
                          className="text-cyan-400 hover:text-pink-400 clip-btn px-2.5 sm:px-3 py-1 border border-cyan-400/50 hover:border-pink-400/50 hover:bg-pink-400/10 transition-colors text-xs"
                          onClick={() =>
                            dispatch(deleteUser(item.id))
                              .unwrap()
                              .then(() => toast.success("User Deleted"))
                              .catch((err) =>
                                toast.error(err || "Operation failed")
                              )
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
    </div>
  );
}

export default UserManagement;
