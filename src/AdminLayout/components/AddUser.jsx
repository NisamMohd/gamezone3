import React, { useState } from "react";
import { User, Mail, Lock, ShieldCheck, Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react";
import { formValidate } from "../utils/userFormValidate";
import { useToast } from "../../context/ToastContext";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUser } from "../redux/thunks/addUserThunk";

function AddUser() {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    const isFormValid = formValidate(formData);
    if (isFormValid.message !== "success") {
      toast.error(isFormValid.message);
      return;
    }
    dispatch(addUser(formData))
      .unwrap()
      .then(() => {
        toast.success("User Added Successfully");
        navigate("/admin/usermanagment");
      })
      .catch((err) => toast.error("Can't Add User", `${err}`));
  };

  const initials = (formData.name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="w-full max-w-4xl mx-auto text-white py-4 space-y-5">
      {/* NAVIGATION BAR */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <button
          type="button"
          onClick={() => navigate("/admin/usermanagment")}
          className="flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-cyan-400 transition cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>BACK TO USER MANAGEMENT</span>
        </button>
        <span className="font-tech text-xs text-cyan-400 uppercase tracking-widest">
          ADMIN CONSOLE // CREATE USER
        </span>
      </div>

      {/* DUAL-COLUMN LAYOUT: FORM + LIVE PREVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: FORM */}
        <div className="lg:col-span-7 clip-panel bg-[#0B0F17] border border-cyan-500/30 p-6 sm:p-7 relative shadow-xl shadow-cyan-500/5">
          <div className="corner corner-tl" />
          <div className="corner corner-br" />

          <h2 className="text-xl font-display font-700 tracking-wider uppercase text-cyan-400 mb-6 flex items-center gap-2">
            <User size={20} />
            <span>Create User Account</span>
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-xs uppercase tracking-wider text-gray-400 font-tech">
                Full Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  id="name"
                  name="name"
                  placeholder="e.g. Marcus Vance"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-black/60 border border-white/15 focus:border-cyan-400 rounded pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none transition"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs uppercase tracking-wider text-gray-400 font-tech">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="user@gamezone.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-black/60 border border-white/15 focus:border-cyan-400 rounded pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none transition"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs uppercase tracking-wider text-gray-400 font-tech">
                Initial Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create secure password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-black/60 border border-white/15 focus:border-cyan-400 rounded pl-10 pr-10 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Role Toggle Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-wider text-gray-400 font-tech">
                Account Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "customer" })}
                  className={`py-2.5 px-3 rounded border text-xs font-mono tracking-wider flex items-center justify-center gap-2 cursor-pointer transition ${
                    formData.role === "customer"
                      ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(0,229,255,0.2)] font-bold"
                      : "bg-black/40 border-white/10 text-gray-400 hover:text-white"
                  }`}
                >
                  <User size={14} />
                  <span>Customer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "admin" })}
                  className={`py-2.5 px-3 rounded border text-xs font-mono tracking-wider flex items-center justify-center gap-2 cursor-pointer transition ${
                    formData.role === "admin"
                      ? "bg-purple-500/20 border-purple-400 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.2)] font-bold"
                      : "bg-black/40 border-white/10 text-gray-400 hover:text-white"
                  }`}
                >
                  <ShieldCheck size={14} />
                  <span>Administrator</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="mt-3 clip-btn bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-display font-700 py-3 px-6 text-sm tracking-widest uppercase transition shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle size={17} />
              <span>Confirm & Register User</span>
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: LIVE ID BADGE PREVIEW */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="clip-panel bg-[#0B0F17] border border-cyan-500/30 p-6 relative">
            <span className="corner corner-tr" />
            <span className="corner corner-bl" />

            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-[10px] font-tech text-cyan-400 uppercase tracking-widest">
                ID CARD // PREVIEW
              </span>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-tech text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ACTIVE NOW
              </span>
            </div>

            <div className="my-6 flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-cyan-500/10 border-2 border-cyan-400/40 text-cyan-300 font-tech font-bold text-xl flex items-center justify-center shadow-lg shadow-cyan-500/10">
                {initials || "UZ"}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-display font-700 text-lg text-white truncate">
                  {formData.name || "User Name"}
                </h3>
                <p className="font-mono text-xs text-gray-400 truncate">
                  {formData.email || "email@example.com"}
                </p>
                <span
                  className={`inline-block mt-2 font-tech text-[10px] uppercase px-2 py-0.5 rounded border ${
                    formData.role === "admin"
                      ? "border-purple-500/40 text-purple-300 bg-purple-500/10"
                      : "border-cyan-500/40 text-cyan-300 bg-cyan-500/10"
                  }`}
                >
                  {formData.role || "customer"}
                </span>
              </div>
            </div>

            <div className="p-3 bg-black/50 border border-white/5 rounded font-mono text-[11px] text-gray-400 space-y-1">
              <div className="flex justify-between">
                <span>Security Level:</span>
                <span className="text-white">{formData.role === "admin" ? "ROOT_ACCESS" : "STANDARD"}</span>
              </div>
              <div className="flex justify-between">
                <span>Password Hash:</span>
                <span className="text-white">{formData.password ? "••••••••" : "NOT SET"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddUser;