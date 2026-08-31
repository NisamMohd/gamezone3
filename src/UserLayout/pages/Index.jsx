import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Body from '../components/Body'
import Footer from '../components/Footer'
import {
  ChevronDown,
  Sparkles,
  ArrowRight,
  Gamepad2,
  Tv,
  Zap,
  Radio,
  Layers,
} from 'lucide-react'

function Index() {
  const heroRef = useRef(null)

  const scrollToBody = () => {
    const bodyEl = document.getElementById('body-section')
    if (bodyEl) {
      bodyEl.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="bg-black text-gray-200 overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap');

        .font-display { font-family: 'Rajdhani', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        .font-tech { font-family: 'JetBrains Mono', monospace; }

        .clip-panel {
          clip-path: polygon(0 16px, 16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%);
        }
        .clip-btn {
          clip-path: polygon(0 10px, 10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%);
        }
        .corner {
          position: absolute;
          width: 14px;
          height: 14px;
          pointer-events: none;
        }
        .corner-tl { top: -1px; left: -1px; border-top: 2px solid #00E5FF; border-left: 2px solid #00E5FF; }
        .corner-tr { top: -1px; right: -1px; border-top: 2px solid #00E5FF; border-right: 2px solid #00E5FF; }
        .corner-bl { bottom: -1px; left: -1px; border-bottom: 2px solid #FF3D8A; border-left: 2px solid #FF3D8A; }
        .corner-br { bottom: -1px; right: -1px; border-bottom: 2px solid #FF3D8A; border-right: 2px solid #FF3D8A; }

        .grid-bg {
          background-image:
            linear-gradient(rgba(0,229,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,229,255,0.06) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>

      {/* ============================================================ */}
      {/* 1. CINEMATIC CONSOLE HERO PAGE (USING console.MP4) */}
      {/* ============================================================ */}
      <section
        ref={heroRef}
        className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-black pt-28 pb-12 px-4 sm:px-6 lg:px-12"
      >
        {/* BACKGROUND CONSOLE VIDEO */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center scale-[1.03] opacity-80"
          >
            <source src="/video/console.MP4" type="video/mp4" />
            <source src="/video/console.mp4" type="video/mp4" />
          </video>

          {/* AMBIENT LIGHTING OVERLAYS */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-black/85" />
          <div className="grid-bg absolute inset-0 opacity-20" />

          {/* GLOW ORBS */}
          <div
            className="absolute top-1/4 left-10 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(circle, #00E5FF, transparent 70%)' }}
          />
          <div
            className="absolute bottom-10 right-10 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(circle, #FF3D8A, transparent 70%)' }}
          />
        </div>

        {/* HERO TOP TECH TAG */}
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/40 text-cyan-300 font-tech text-xs tracking-widest uppercase mb-6 shadow-[0_0_20px_rgba(0,229,255,0.15)]"
          >
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span>FLAGSHIP HARDWARE // NEXT-GEN CONSOLE ECOSYSTEM</span>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* HERO MAIN COPY */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-8 max-w-3xl"
            >
              <h1 className="font-display font-800 text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.92] text-white uppercase tracking-tight">
                UNLEASH <br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(120deg, #00E5FF, #FF3D8A)',
                  }}
                >
                  NEXT-GEN POWER
                </span>
              </h1>

              <p className="font-body text-gray-300 text-base sm:text-lg md:text-xl mt-6 max-w-2xl leading-relaxed">
                Experience ultra-high speed SSD loading, hyper-realistic ray tracing, and Tempest 3D spatial audio engineered for players who demand absolute perfection.
              </p>

              {/* ACTION BUTTONS */}
              <div className="flex flex-wrap items-center gap-4 mt-8">
                {/* EXPLORE CONSOLES (LEADS TO PLAYSTATIONS CATEGORY) */}
                <Link
                  to="/products?category=playstation"
                  className="
                    clip-btn
                    px-8
                    py-4
                    font-display
                    font-bold
                    text-base
                    tracking-wider
                    uppercase
                    text-black
                    flex
                    items-center
                    gap-2.5
                    transition
                    hover:brightness-110
                    shadow-[0_0_30px_rgba(0,229,255,0.3)]
                  "
                  style={{
                    background: 'linear-gradient(120deg, #00E5FF, #FF3D8A)',
                  }}
                >
                  <Gamepad2 size={20} />
                  <span>Explore Consoles</span>
                  <ArrowRight size={16} />
                </Link>

                <Link
                  to="/products"
                  className="
                    clip-btn
                    px-8
                    py-4
                    bg-white/5
                    border
                    border-white/20
                    text-white
                    hover:bg-white/10
                    hover:border-cyan-400
                    font-tech
                    text-sm
                    tracking-wider
                    uppercase
                    transition
                  "
                >
                  Browse Full Arsenal
                </Link>

                <button
                  type="button"
                  onClick={scrollToBody}
                  className="
                    clip-btn
                    px-6
                    py-4
                    bg-cyan-500/10
                    border
                    border-cyan-500/30
                    text-cyan-300
                    hover:bg-cyan-500/20
                    font-tech
                    text-xs
                    tracking-wider
                    uppercase
                    flex
                    items-center
                    gap-2
                    transition
                    cursor-pointer
                  "
                >
                  <Layers size={15} />
                  <span>Inspect 3D Deconstruction</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* HERO BOTTOM SPECS STRIP & SCROLL PROMPT */}
        <div className="relative z-10 max-w-7xl mx-auto w-full mt-12 pt-8 border-t border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 clip-panel bg-[#0B0F17]/80 backdrop-blur-md border border-cyan-500/20">
              <div className="flex items-center gap-2 text-cyan-400 font-tech text-xs mb-1">
                <Tv size={15} /> 4K @ 120 FPS
              </div>
              <p className="font-body text-xs text-gray-400">Ultra-smooth high-refresh display</p>
            </div>

            <div className="p-4 clip-panel bg-[#0B0F17]/80 backdrop-blur-md border border-pink-500/20">
              <div className="flex items-center gap-2 text-pink-400 font-tech text-xs mb-1">
                <Sparkles size={15} /> RAY TRACING
              </div>
              <p className="font-body text-xs text-gray-400">Hardware-accelerated illumination</p>
            </div>

            <div className="p-4 clip-panel bg-[#0B0F17]/80 backdrop-blur-md border border-cyan-500/20">
              <div className="flex items-center gap-2 text-cyan-300 font-tech text-xs mb-1">
                <Zap size={15} /> CUSTOM GEN4 SSD
              </div>
              <p className="font-body text-xs text-gray-400">Near-instantaneous asset streaming</p>
            </div>

            <div className="p-4 clip-panel bg-[#0B0F17]/80 backdrop-blur-md border border-pink-500/20">
              <div className="flex items-center gap-2 text-pink-300 font-tech text-xs mb-1">
                <Radio size={15} /> 3D SPATIAL AUDIO
              </div>
              <p className="font-body text-xs text-gray-400">Pinpoint situational awareness</p>
            </div>
          </div>

          {/* SCROLL DOWN ARROW */}
          <div className="mt-8 flex flex-col items-center justify-center text-center">
            <button
              onClick={scrollToBody}
              className="flex flex-col items-center gap-1.5 text-gray-400 hover:text-cyan-400 transition cursor-pointer"
            >
              <span className="font-tech text-[10px] tracking-[0.25em] uppercase">
                Scroll to Explore 3D Controller Anatomy & Exploded View
              </span>
              <ChevronDown size={18} className="animate-bounce text-cyan-400" />
            </button>
          </div>
        </div>
      </section>

      

      {/* ============================================================ */}
      {/* 3. FOOTER */}
      {/* ============================================================ */}
      <Footer />
    </div>
  )
}

export default Index