import React, { useState } from "react";
import { User } from "lucide-react";
import { formValidate } from "../utils/userFormValidate";
import { useToast } from "../../context/ToastContext";
import { useDispatch } from "react-redux";
import { register } from "../../features/thunks/authThunk";

function AddUser() {
  const { toast } = useToast();
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

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
    dispatch(register(formData))
      .unwrap()
      .then(()=>toast.success("User Added Successfully"))
      .catch((err) => toast.error("Can't Add User", `${err}`))
  };

  return (
    <div className="w-full h-full text-white">
      <div
        className="relative w-full h-full bg-zinc-900/80 border border-cyan-500/30 p-8"
        style={{
          clipPath:
            "polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)",
        }}
      >
        {/* corner accents */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-pink-500" />

        <h2 className="text-xl font-semibold tracking-widest uppercase text-cyan-400 mb-6 font-[Rajdhani]">
          <span className="flex gap-1 items-center ">
            <User size={17} />
            Add User
          </span>
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="name"
              className="text-xs uppercase tracking-wider text-zinc-400"
            >
              NAME
            </label>
            <input
              id="name"
              name="name"
              placeholder="name"
              value={formData.name}
              onChange={handleChange}
              className="bg-black/40 border border-cyan-500/40 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-xs uppercase tracking-wider text-zinc-400"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              placeholder="example@mail.com"
              value={formData.email}
              onChange={handleChange}
              className="bg-black/40 border border-cyan-500/40 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-xs uppercase tracking-wider text-zinc-400"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              placeholder="password"
              value={formData.password}
              onChange={handleChange}
              className="bg-black/40 border border-cyan-500/40 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="role"
              className="text-xs uppercase tracking-wider text-zinc-400"
            >
              ROLE
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="bg-black/40 border border-cyan-500/40 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-colors"
            >
              <option value="" disabled>
                Select role
              </option>
              <option value="customer">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="mt-4 bg-cyan-500/10 border border-cyan-400 text-cyan-300 uppercase text-sm clip-btn py-2.5 hover:bg-cyan-400 hover:text-black transition-colors"
            style={{
              clipPath: "polygon(12px 0, 100% 0, 100% 100%, 0 100%, 0 12px)",
            }}
          >
            <span className="flex gap-1 mx-2 py-1">
              <User size={16} />
              ADD USER
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddUser;
