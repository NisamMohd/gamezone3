import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { customerList } from "../redux/thunks/customerThunk";

function UserManagement() {
  const { items, loading } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(customerList());
  }, [dispatch]);

  if (loading) return <div className="text-white p-4">Loading...</div>;

  return (
    <div className="text-white font-body p-4">
      <div className="rounded-xl border border-cyan-500/20 bg-slate-900/60 overflow-hidden shadow-lg shadow-cyan-500/5">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-cyan-500/20 bg-slate-800/50">
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
                Orders
              </th><th className="px-4 py-3 text-sm font-semibold text-cyan-400 uppercase tracking-wide">
                status
              </th><th className="px-4 py-3 text-sm font-semibold text-cyan-400 uppercase tracking-wide">
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
                <td className="px-4 py-3">{item.name}</td>
                <td className="px-4 py-3 text-slate-300">{item.email}</td>
                <td className="px-4 py-3">{item.role}</td>
                <td className="px-4 py-3">View</td>
                <td className="px-4 py-3"><button>Block</button></td>
                <td className="px-4 py-3"><button>Block</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserManagement;