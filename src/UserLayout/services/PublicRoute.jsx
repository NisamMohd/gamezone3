import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * PublicRoute Guard (Guest-Only)
 * For authentication pages like /login and /register.
 * Redirects already logged-in users away to home or their previous intended destination.
 */
function PublicRoute({ children }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="p-8 clip-panel bg-[#0B0F17] border border-cyan-500/30 text-center">
          <div className="w-8 h-8 mx-auto mb-3 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
          <p className="font-tech text-xs text-cyan-400 tracking-widest uppercase animate-pulse">
            Verifying Operative Status…
          </p>
        </div>
      </div>
    );
  }

  if (user) {
    const destination = location.state?.from?.pathname || "/";
    return <Navigate to={destination} replace />;
  }

  return children ? children : <Outlet />;
}

export default PublicRoute;
