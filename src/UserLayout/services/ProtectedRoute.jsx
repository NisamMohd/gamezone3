import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * ProtectedRoute Guard
 * Restricts access to authenticated users only.
 * Redirects unauthenticated users to /login preserving the intended destination.
 */
function ProtectedRoute({ children }) {
  const { user, status } = useSelector((state) => state.auth);
  const isLoading = status === "loading";
  const location = useLocation();

  if (isLoading) {
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

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
}

export default ProtectedRoute;
