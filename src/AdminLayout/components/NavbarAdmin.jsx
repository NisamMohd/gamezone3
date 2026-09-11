import React from "react";
import logo from "../../assets/logo.png";
import { logout } from "../../features/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateStatus } from "../../utils/logout";

function NavbarAdmin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handlelogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    updateStatus()
    navigate("/");
  };
  return (
    <div className="fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-md border-b border-cyan-500/10 z-50 ">
      <nav>
        <div className="flex justify-between items-center">
          <img
            src={logo}
            alt=""
            className="h-11 sm:h-12 w-auto object-contain drop-shadow-[0_0_12px_rgba(0,229,255,0.25)] ml-5"
          />

          <button
            onClick={handlelogout}
            className="
              logout-btn
              flex
              items-center
              gap-2.5
              clip-btn
              px-4
              sm:px-5
              py-2.5
              font-display
              font-700
              text-sm
              tracking-wider
              transition-all
              duration-200
              cursor-pointer  
              whitespace-nowrap
              border
              mr-5
              my-2
              hover:scale-105
              hover:shadow-[0_0_16px_rgba(255,61,138,0.4)]"
            style={{ background: "linear-gradient(120deg, #00E5FF, #FF3D8A)" }}
          >
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
}

export default NavbarAdmin;
