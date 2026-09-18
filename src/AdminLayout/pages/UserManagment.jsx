import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { customerList } from "../redux/thunks/customerThunk";
import { toggleBlockuser } from "../redux/thunks/blockuserThunk";
import { EyeOff, Eye, Plus } from "lucide-react";
import { deleteUser } from "../redux/thunks/deleteUserThunk";
import { div } from "framer-motion/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../UserLayout/context/ToastContext";

function UserManagement() {
  const { items, loading } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    dispatch(customerList());
  }, [dispatch]);

  const handleView = (e) => {
    e.preventDefault();
  };

  const handleBlock = (item) => {
    dispatch(
      toggleBlockuser({
        userId: item.id,
        isBlocked: !item.isBlocked,
      }),
    )
      .unwrap()
      .then(() => toast.success(
        item.isBlocked
        ? "User unblocked successfully"
        : "User blocked successfully"
      ))
      .catch((err) => toast.error('Update failed',err || "could not block user"))
  };

  if (loading) return <div className="text-white p-4">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between sticky top-25 z-40 bg-black">
        <div className="mb-6 flex-wrap">
          <p className="font-tech text-[11px] tracking-[0.2em] text-cyan-400 mb-1">
            ADMIN CONSOLE
          </p>
          <h1 className="font-display font-700 text-2xl sm:text-3xl text-white tracking-wide uppercase">
            Manage Users
          </h1>
          <p className="text-sm text-gray-400 mt-1 font-body">
            {items.length} User{items.length !== 1 ? "s" : ""} in catalog
          </p>
        </div>
        <div className="items-center">
          <button
            className="text-cyan-400 clip-btn px-2 py-1 border border-cyan-400/50 hover:bg-cyan-400/10 transition-colors"
            style={{
              background: isHovered
                ? "linear-gradient(120deg, #00bbff, #f70063)"
                : "transparent",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => navigate("../adduser")}
          >
            <span className="flex gap-1 items-center">
              Add
              <Plus size={16} />
            </span>
          </button>
        </div>
      </div>
      // TABLE
      <div className="text-white font-body p-4">
        <div className="rounded-xl border border-cyan-500/20 bg-slate-900/60 overflow-hidden shadow-lg shadow-cyan-500/5">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-cyan-500/20 bg-slate-800/50">
                <th className="px-4 py-3 text-sm font-semibold text-cyan-400 uppercase tracking-wide">
                  Id
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-cyan-400 uppercase tracking-wide">
                  Name
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-cyan-400 uppercase tracking-wide">
                  Email
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-cyan-400 uppercase tracking-wide">
                  Role
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-cyan-400 uppercase tracking-wide">
                  status
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-cyan-400 uppercase tracking-wide">
                  Orders
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-cyan-400 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-700/50 hover:bg-cyan-500/5 transition-colors duration-150"
                >
                  <td className="px-4 py-3 flex gap-2 items-center text-slate-300">
                    <span
                      className={`h-2 w-2  rounded-full ${item.isOnline === true ? "bg-green-600" : "bg-red-600"} animate-pulse `}
                    />
                    {item.id}
                  </td>
                  <td className="px-4 py-3 text-slate-300">{item.name}</td>
                  <td className="px-4 py-3 text-slate-300">{item.email}</td>
                  <td className="px-4 py-3 text-slate-300">{item.role}</td>
                  <td className="px-4 py-3 text-slate-300">
                    {item.isBlocked
                      ? "blocked"
                      : item.isOnline
                        ? "Online"
                        : "offline"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      className="text-cyan-400 hover:text-pink-400 clip-btn px-3 py-1 border border-cyan-400/50 hover:border-pink-400/50 hover:bg-pink-400/10 transition-colors"
                      onClick={handleView}
                    >
                      View
                    </button>
                  </td>
                  <td className="px-3 py-2 flex gap-2">
                    <button
                      onClick={() => handleBlock(item)}
                      className={`clip-btn px-3 py-1 border ${
                        item.isBlocked
                          ? "text-pink-400 hover:text-cyan-400  border-pink-400/50 hover:border-cyan-400/50 hover:bg-cyan-400/10 transition-colors"
                          : "text-cyan-400 hover:text-pink-400  border-cyan-400/50 hover:border-pink-400/50 hover:bg-pink-400/10 transition-colors"
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        {item.isBlocked ? (
                          <Eye size={16} />
                        ) : (
                          <EyeOff size={16} />
                        )}{" "}
                        Block
                      </span>
                    </button>
                    <button
                      className="text-cyan-400 hover:text-pink-400 clip-btn px-3 py-1 border border-cyan-400/50 hover:border-pink-400/50 hover:bg-pink-400/10 transition-colors"
                      onClick={() => 
                        dispatch(deleteUser(item.id))
                          .unwrap()
                          .then(() => toast.success("User Deleted"))
                          .catch((err) => toast.error(err || 'Operation failed'))
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UserManagement;
