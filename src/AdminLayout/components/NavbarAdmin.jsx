import React from 'react'
import logo from "../../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/authSlice";
import { useNavigate } from "react-router-dom";


function NavbarAdmin() {
  const { state } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handlelogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    navigate("/");
  };
  return (
    <div className="fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-md border-b border-cyan-500/10 z-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        .font-display { font-family: 'Rajdhani', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        .font-tech { font-family: 'JetBrains Mono', monospace; }

        .clip-btn {
          clip-path: polygon(0 10px, 10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%);
        }
        .clip-panel {
          clip-path: polygon(0 14px, 14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%);
        }
        .corner {
          position: absolute;
          width: 10px;
          height: 10px;
          border-color: #00E5FF;
          pointer-events: none;
        }
        .corner-tl { top: -1px; left: -1px; border-top: 1.5px solid; border-left: 1.5px solid; }
        .corner-br { bottom: -1px; right: -1px; border-bottom: 1.5px solid; border-right: 1.5px solid; }

        .nav-link {
          position: relative;
          padding-bottom: 4px;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          height: 2px;
          width: 100%;
          background: linear-gradient(90deg, #00E5FF, #FF3D8A);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.2s ease;
        }
        .nav-link:hover::after,
        .nav-link.active::after {
          transform: scaleX(1);
        }
      `}</style>
      <nav>
        <div className="flex justify-between">
          <img
            src={logo}
            alt=""
            className="h-11 sm:h-12 w-auto object-contain drop-shadow-[0_0_12px_rgba(0,229,255,0.25)] ml-5"
          />
          <button
            onClick={handlelogout}
            className="
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
                  transition
                  cursor-pointer
                  whitespace-nowrap
                  border
                  mr-5
                  my-2"
                  style={{background : "linear-gradient(120deg, #00E5FF, #FF3D8A)"}}
          >
            Logout
          </button>
        </div>
      </nav>

    </div>
  )
}

export default NavbarAdmin