import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Gamepad2 } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [passwd, setPasswd] = useState("");
  const { login, error, setError, isLoading } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError && setError(null);

    const response = await login(email, passwd);
    if (response.success) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-black relative overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        .font-display { font-family: 'Rajdhani', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        .font-tech { font-family: 'JetBrains Mono', monospace; }

        .clip-panel {
          clip-path: polygon(0 20px, 20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%);
        }
        .clip-btn {
          clip-path: polygon(0 10px, 10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%);
        }
        .corner {
          position: absolute;
          width: 16px;
          height: 16px;
          border-color: #00E5FF;
          pointer-events: none;
        }
        .corner-tl { top: -1px; left: -1px; border-top: 2px solid; border-left: 2px solid; }
        .corner-tr { top: -1px; right: -1px; border-top: 2px solid; border-right: 2px solid; }
        .corner-bl { bottom: -1px; left: -1px; border-bottom: 2px solid; border-left: 2px solid; }
        .corner-br { bottom: -1px; right: -1px; border-bottom: 2px solid; border-right: 2px solid; }

        .grid-bg {
          background-image:
            linear-gradient(rgba(0,229,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,229,255,0.06) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .hud-input {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.15);
          color: #e5e7eb;
          transition: border-color 0.2s ease, background 0.2s ease;
        }
        .hud-input:focus {
          outline: none;
          border-color: rgba(0,229,255,0.6);
          background: rgba(255,255,255,0.05);
        }
        .hud-input::placeholder { color: #6b7280; }
      `}</style>

      {/* LEFT — BRAND PANEL */}
      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 h-screen relative border-r border-cyan-500/10">
        <div className="absolute inset-0 grid-bg" />
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #00E5FF, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-32 -right-16 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #FF3D8A, transparent 70%)" }}
        />

        <div className="relative flex flex-col items-center text-center px-10">
          <Gamepad2 size={40} className="text-cyan-400 mb-6" strokeWidth={1.5} />

          <p className="font-tech text-xs tracking-[0.3em] text-gray-400 mb-3">
            WELCOME BACK, CHAMP
          </p>

          <h1 className="font-display font-700 text-6xl text-white tracking-wide">
            Game<span className="text-cyan-400">Zone</span>
          </h1>

          <div className="flex gap-6 mt-6 font-tech text-xs tracking-[0.25em]">
            <span className="text-pink-400">PLAY</span>
            <span className="text-gray-600">/</span>
            <span className="text-cyan-400">COMPETE</span>
            <span className="text-gray-600">/</span>
            <span className="text-white">CONQUER</span>
          </div>
        </div>
      </div>

      {/* RIGHT — LOGIN FORM */}
      <div className="flex flex-col items-center justify-center w-full lg:w-1/2 min-h-screen px-6 relative">
        <div className="lg:hidden absolute inset-0 grid-bg" />

        <div className="relative w-full max-w-sm clip-panel bg-[#0B0F17] border border-cyan-500/20 px-8 py-10">
          <span className="corner corner-tl" />
          <span className="corner corner-tr" />
          <span className="corner corner-bl" />
          <span className="corner corner-br" />

          <p className="font-tech text-[11px] tracking-[0.25em] text-cyan-400 mb-1 text-center">
            PLAYER ACCESS
          </p>
          <h3 className="font-display font-700 text-3xl text-white text-center tracking-wide mb-8">
            Login
          </h3>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 w-full font-body"
          >
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="hud-input w-full pl-10 pr-3 py-2.5 text-sm"
              />
            </div>

            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                value={passwd}
                onChange={(e) => setPasswd(e.target.value)}
                placeholder="Password"
                required
                className="hud-input w-full pl-10 pr-3 py-2.5 text-sm"
              />
            </div>

            {error && (
              <p className="text-xs font-tech text-pink-400 bg-pink-500/10 border border-pink-500/20 px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="
                clip-btn
                mt-2
                py-3
                font-display
                font-600
                tracking-wide
                text-black
                text-sm
                transition
                hover:brightness-110
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
              style={{ background: "linear-gradient(120deg, #00E5FF, #FF3D8A)" }}
            >
              {isLoading ? "Signing in…" : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;