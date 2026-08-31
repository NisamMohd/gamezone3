import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  AlertCircle,
  ShoppingCart,
  Heart,
  Trash2,
  UserCheck,
  X,
  Info,
} from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({
      type = "info",
      title,
      message,
      duration = 3500,
      icon,
    }) => {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newToast = { id, type, title, message, duration, icon };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
      return id;
    },
    [removeToast]
  );

  // Convenience helper methods
  const toast = {
    show: showToast,
    success: (title, message, duration) =>
      showToast({ type: "success", title, message, duration }),
    error: (title, message, duration) =>
      showToast({ type: "error", title, message, duration }),
    info: (title, message, duration) =>
      showToast({ type: "info", title, message, duration }),
    cartAdd: (title = "Added to Cart", message = "Item added to your loadout") =>
      showToast({ type: "cart", title, message }),
    cartRemove: (title = "Removed from Cart", message = "Item removed from loadout") =>
      showToast({ type: "remove", title, message }),
    wishlistAdd: (title = "Added to Wishlist", message = "Saved to your armory") =>
      showToast({ type: "wishlist-add", title, message }),
    wishlistRemove: (title = "Removed from Wishlist", message = "Item removed from armory") =>
      showToast({ type: "wishlist-remove", title, message }),
    loginSuccess: (name = "Player") =>
      showToast({
        type: "auth",
        title: "Access Granted",
        message: `Welcome back, ${name}!`,
      }),
    registerSuccess: (name = "Player") =>
      showToast({
        type: "auth",
        title: "Registration Complete",
        message: `Welcome to GameZone, ${name}!`,
      }),
  };

  const getToastConfig = (type) => {
    switch (type) {
      case "success":
        return {
          borderColor: "border-emerald-500/50",
          shadowColor: "shadow-[0_0_25px_rgba(16,185,129,0.2)]",
          accentBg: "bg-emerald-500/10",
          textColor: "text-emerald-400",
          progressBar: "bg-gradient-to-r from-emerald-500 to-cyan-400",
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
        };
      case "error":
        return {
          borderColor: "border-pink-500/50",
          shadowColor: "shadow-[0_0_25px_rgba(255,61,138,0.25)]",
          accentBg: "bg-pink-500/10",
          textColor: "text-pink-400",
          progressBar: "bg-gradient-to-r from-pink-500 to-rose-600",
          icon: <AlertCircle className="w-5 h-5 text-pink-400 shrink-0" />,
        };
      case "cart":
        return {
          borderColor: "border-cyan-400/50",
          shadowColor: "shadow-[0_0_25px_rgba(0,229,255,0.25)]",
          accentBg: "bg-cyan-500/10",
          textColor: "text-cyan-400",
          progressBar: "bg-gradient-to-r from-cyan-400 to-blue-500",
          icon: <ShoppingCart className="w-5 h-5 text-cyan-400 shrink-0" />,
        };
      case "remove":
        return {
          borderColor: "border-amber-500/50",
          shadowColor: "shadow-[0_0_25px_rgba(245,158,11,0.2)]",
          accentBg: "bg-amber-500/10",
          textColor: "text-amber-400",
          progressBar: "bg-gradient-to-r from-amber-500 to-orange-500",
          icon: <Trash2 className="w-5 h-5 text-amber-400 shrink-0" />,
        };
      case "wishlist-add":
        return {
          borderColor: "border-pink-500/60",
          shadowColor: "shadow-[0_0_25px_rgba(255,61,138,0.3)]",
          accentBg: "bg-pink-500/15",
          textColor: "text-pink-400",
          progressBar: "bg-gradient-to-r from-pink-500 to-purple-500",
          icon: <Heart className="w-5 h-5 text-pink-400 fill-pink-500 shrink-0" />,
        };
      case "wishlist-remove":
        return {
          borderColor: "border-gray-600/50",
          shadowColor: "shadow-[0_0_20px_rgba(255,255,255,0.05)]",
          accentBg: "bg-white/5",
          textColor: "text-gray-300",
          progressBar: "bg-gradient-to-r from-gray-500 to-pink-500",
          icon: <Heart className="w-5 h-5 text-gray-400 shrink-0" />,
        };
      case "auth":
        return {
          borderColor: "border-cyan-400/60",
          shadowColor: "shadow-[0_0_30px_rgba(0,229,255,0.25)]",
          accentBg: "bg-cyan-500/15",
          textColor: "text-cyan-300",
          progressBar: "bg-gradient-to-r from-cyan-400 via-pink-500 to-cyan-400",
          icon: <UserCheck className="w-5 h-5 text-cyan-300 shrink-0" />,
        };
      default:
        return {
          borderColor: "border-cyan-500/40",
          shadowColor: "shadow-[0_0_20px_rgba(0,229,255,0.15)]",
          accentBg: "bg-cyan-500/10",
          textColor: "text-cyan-400",
          progressBar: "bg-cyan-400",
          icon: <Info className="w-5 h-5 text-cyan-400 shrink-0" />,
        };
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, removeToast, toast }}>
      {children}

      {/* TOAST CONTAINER */}
      <div className="fixed top-20 right-4 z-[99999] flex flex-col gap-3 max-w-sm w-full pointer-events-none sm:right-6">
        <AnimatePresence>
          {toasts.map((t) => {
            const config = getToastConfig(t.type);
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: -20, scale: 0.92, x: 20 }}
                animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 30, transition: { duration: 0.2 } }}
                transition={{ type: "spring", stiffness: 450, damping: 30 }}
                className={`pointer-events-auto relative overflow-hidden bg-[#070A10]/95 backdrop-blur-xl border ${config.borderColor} ${config.shadowColor} p-4 rounded-sm flex items-start gap-3.5`}
                style={{
                  clipPath:
                    "polygon(0 8px, 8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)",
                }}
              >
                {/* CYBER CORNERS */}
                <span
                  className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 pointer-events-none"
                  style={{ borderColor: "currentColor" }}
                />
                <span
                  className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 pointer-events-none"
                  style={{ borderColor: "currentColor" }}
                />

                {/* ICON BADGE */}
                <div
                  className={`p-2 rounded ${config.accentBg} flex items-center justify-center shrink-0 border border-white/5`}
                >
                  {t.icon || config.icon}
                </div>

                {/* TEXT CONTENT */}
                <div className="flex-1 min-w-0 pr-2">
                  {t.title && (
                    <h4
                      className={`font-rajdhani font-bold text-sm tracking-wide uppercase leading-tight ${config.textColor}`}
                    >
                      {t.title}
                    </h4>
                  )}
                  {t.message && (
                    <p className="font-body text-xs text-gray-300 mt-0.5 leading-relaxed break-words">
                      {t.message}
                    </p>
                  )}
                </div>

                {/* CLOSE BUTTON */}
                <button
                  type="button"
                  onClick={() => removeToast(t.id)}
                  className="text-gray-500 hover:text-white p-1 rounded transition-colors shrink-0"
                  aria-label="Dismiss notification"
                >
                  <X size={14} />
                </button>

                {/* PROGRESS BAR */}
                {t.duration > 0 && (
                  <motion.div
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: t.duration / 1000, ease: "linear" }}
                    className={`absolute bottom-0 left-0 h-[2px] ${config.progressBar}`}
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
export default ToastContext;
