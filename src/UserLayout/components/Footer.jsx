import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="relative w-full bg-[#05070C] border-t border-[#00E5FF]/20 overflow-hidden">

      {/* Top scanline */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent opacity-50" />

      {/* HUD grid overlay */}
      <div className="grid-bg absolute inset-0 pointer-events-none opacity-[0.15]" />

      <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-16 pt-16 pb-8">

        {/* Top section: brand + nav columns + newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-white/10">

          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/">
              <h2 className="font-rajdhani font-bold text-2xl uppercase tracking-wide text-white">
                GAME<span className="text-[#00E5FF]">ZONE</span>
              </h2>
            </Link>
            <p className="font-body text-sm text-gray-400 mt-3 max-w-xs">
              Consoles, controllers, and accessories built for players who don't settle.
            </p>

            {/* Social links — external, so these stay as <a>, not <Link> */}
            <div className="flex gap-3 mt-6">
              
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h3 className="font-mono text-xs tracking-[0.2em] text-[#00E5FF] uppercase mb-4">
              Shop
            </h3>
            <ul className="space-y-3 font-body text-sm text-gray-400">
              <li><Link to="/products?category=consoles" className="hover:text-white transition-colors">Consoles</Link></li>
              <li><Link to="/products?category=controllers" className="hover:text-white transition-colors">Controllers</Link></li>
              <li><Link to="/products?category=accessories" className="hover:text-white transition-colors">Accessories</Link></li>
              <li><Link to="/products?sort=new" className="hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link to="/products?deals=true" className="hover:text-white transition-colors">Deals</Link></li>
            </ul>
          </div>

          {/* Support links */}
          <div>
            <h3 className="font-mono text-xs tracking-[0.2em] text-[#00E5FF] uppercase mb-4">
              Support
            </h3>
            <ul className="space-y-3 font-body text-sm text-gray-400">
              <li><Link to="/track-order" className="hover:text-white transition-colors">Track Order</Link></li>
              <li><Link to="/returns" className="hover:text-white transition-colors">Returns</Link></li>
              <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping Info</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-mono text-xs tracking-[0.2em] text-[#FF3D8A] uppercase mb-4">
              Stay Updated
            </h3>
            <p className="font-body text-sm text-gray-400 mb-4">
              Drops, restocks, and deals — straight to your inbox.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter email"
                className="hud-input flex-1 bg-[#0B0F17] border border-white/10 focus:border-[#00E5FF]/50 text-white text-sm px-3 py-2 outline-none font-body placeholder:text-gray-600"
              />
              <button
                type="submit"
                className="clip-btn bg-[#FF3D8A] text-[#05070C] font-mono text-xs font-semibold px-4 py-2 uppercase tracking-wider hover:bg-white transition-colors whitespace-nowrap"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8">
          <p className="font-mono text-[11px] tracking-wider text-gray-600">
            © {new Date().getFullYear()} GAMEZONE. ALL RIGHTS RESERVED.
          </p>

          <div className="flex gap-6 font-mono text-[11px] tracking-wider text-gray-600">
            <Link to="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
            <Link to="/cookies" className="hover:text-gray-300 transition-colors">Cookies</Link>
          </div>

          <div className="flex items-center gap-2 font-mono text-[10px] tracking-wider text-[#00E5FF]">
            <span className="h-1.5 w-1.5 bg-[#00E5FF] rounded-full animate-pulse" />
            SERVERS ONLINE
          </div>
        </div>
      </div>

      <style>{`
        .grid-bg {
          background-image:
            linear-gradient(rgba(0,229,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,229,255,0.08) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .clip-btn {
          clip-path: polygon(0 8px, 8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%);
        }
        .hud-input {
          clip-path: polygon(0 6px, 6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%);
        }
      `}</style>
    </footer>
  )
}

export default Footer