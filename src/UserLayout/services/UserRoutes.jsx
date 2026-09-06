import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function UserRoutes() {
  const { user, status } = useSelector((state) => state.auth);
  if (user?.role !== "customer") {
    return <Navigate to="/admin" replace />;
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="p-8 clip-panel bg-[#0B0F17] border border-cyan-500/30 text-center">
          <div className="w-8 h-8 mx-auto mb-3 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
          <p className="font-tech text-xs text-cyan-400 tracking-widest uppercase animate-pulse">
            Authenticating Operative Credentials…
          </p>
        </div>
      </div>
    );
  }
  return (
    <Outlet/>
  );
}

export default UserRoutes;
