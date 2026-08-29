import React, { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import Footer from '../components/Footer'
import { ChevronDown, Sparkles, Cpu, Zap, Shield, ArrowRight } from 'lucide-react'

function Index() {
  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const durationRef = useRef(0)
  const targetProgress = useRef(0)
  const currentProgress = useRef(0)
  const rafId = useRef(null)
  const [isVideoReady, setIsVideoReady] = useState(false)
  const [scrollPercent, setScrollPercent] = useState(0)

  // Track scroll progress across the 350vh tall container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Phase 1 (0% - 35%): Hero introduction
  const phase1Opacity = useTransform(scrollYProgress, [0, 0.28, 0.36], [1, 1, 0])
  const phase1Y = useTransform(scrollYProgress, [0, 0.32], [0, -30])
  const phase1Pointer = useTransform(scrollYProgress, (v) => (v < 0.35 ? 'auto' : 'none'))

  // Phase 2 (35% - 70%): Hardware & Ergonomics specs
  const phase2Opacity = useTransform(scrollYProgress, [0.34, 0.42, 0.62, 0.7], [0, 1, 1, 0])
  const phase2Y = useTransform(scrollYProgress, [0.34, 0.42, 0.62, 0.7], [40, 0, 0, -40])
  const phase2Pointer = useTransform(scrollYProgress, (v) => (v >= 0.35 && v < 0.68 ? 'auto' : 'none'))

  // Phase 3 (70% - 100%): Final CTA
  const phase3Opacity = useTransform(scrollYProgress, [0.68, 0.76, 1], [0, 1, 1])
  const phase3Y = useTransform(scrollYProgress, [0.68, 0.76], [40, 0])
  const phase3Pointer = useTransform(scrollYProgress, (v) => (v >= 0.68 ? 'auto' : 'none'))

  // Scroll prompt opacity (fades out immediately upon scrolling)
  const promptOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0])

  // Update target progress on scroll
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    targetProgress.current = latest
    setScrollPercent(Math.round(latest * 100))
  })

  // Ultra-smooth lerp animation loop for video scrubbing
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Ensure video is paused so it only scrubs via scroll
    video.pause()

    const updateVideoFrame = () => {
      // Smooth linear interpolation (lerp)
      const diff = targetProgress.current - currentProgress.current
      currentProgress.current += diff * 0.085 // smooth damping factor

      if (durationRef.current > 0 && !video.seeking) {
        const targetTime = currentProgress.current * durationRef.current
        if (Math.abs(video.currentTime - targetTime) > 0.015) {
          if (video.fastSeek) {
            video.fastSeek(targetTime)
          } else {
            video.currentTime = targetTime
          }
        }
      }

      rafId.current = requestAnimationFrame(updateVideoFrame)
    }

    rafId.current = requestAnimationFrame(updateVideoFrame)

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [])

  const handleLoadedMetadata = () => {
    const video = videoRef.current
    if (video) {
      durationRef.current = video.duration || 0
      video.currentTime = 0
      setIsVideoReady(true)
    }
  }

  const handleVideoError = (e) => {
    console.error('Video failed to load:', e.target.error)
  }

  return (
    <>
      {/* Tall wrapper for smooth cinematic scroll scrubbing */}
      <div ref={containerRef} className="relative h-[350vh] w-full bg-[#05070C]">
        {/* Pinned section — stays fixed in view while the container scrolls past */}
        <section className="sticky top-0 h-screen w-full overflow-hidden bg-[#05070C]">
          {/* Background video — hardware-accelerated scroll scrubbing */}
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover z-0 pointer-events-none"
            style={{
              willChange: 'transform',
              transform: 'translateZ(0)',
            }}
            muted
            playsInline
            preload="auto"
            onError={handleVideoError}
            onLoadedMetadata={handleLoadedMetadata}
            onCanPlayThrough={() => setIsVideoReady(true)}
          >
            <source src="/video/controller-horizondal.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Ambient Lighting & Contrast Overlays */}
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#05070C]/80 via-[#05070C]/30 to-[#05070C]/10 pointer-events-none" />
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-[#05070C]/30 to-[#05070C]/85 pointer-events-none" />

          {/* Cyber HUD Grid & Scanlines */}
          <div className="grid-bg absolute inset-0 z-10 pointer-events-none opacity-25" />
          <div className="absolute top-0 left-0 w-full h-[2px] z-10 bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent opacity-70" />
          <div className="absolute bottom-0 left-0 w-full h-[2px] z-10 bg-gradient-to-r from-transparent via-[#FF3D8A] to-transparent opacity-70" />

          {/* HUD SIDEBAR SCRUB METER (BOTTOM-LEFT) */}
          <div className="absolute bottom-8 left-8 z-30 hidden sm:flex flex-col gap-2 pointer-events-none">
            <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-cyan-400">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>ROTATION // {String(scrollPercent).padStart(2, '0')}%</span>
            </div>
            <div className="w-32 h-[3px] bg-white/10 rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-[#00E5FF] to-[#FF3D8A] transition-all duration-75"
                style={{ width: `${scrollPercent}%` }}
              />
            </div>
          </div>

          {/* BOTTOM CENTER SCROLL PROMPT */}
          <motion.div
            style={{ opacity: promptOpacity }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none"
          >
            <span className="font-mono text-[10px] tracking-[0.3em] text-gray-400 uppercase">
              Scroll to Rotate
            </span>
            <div className="w-5 h-8 rounded-full border border-cyan-400/50 flex items-start justify-center p-1 bg-black/40">
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-1 h-2 rounded-full bg-cyan-400"
              />
            </div>
          </motion.div>

          {/* DYNAMIC RIGHT CONTENT CONTAINER */}
          <div className="relative z-20 flex h-full w-full flex-col items-end justify-center px-8 md:px-16 lg:px-24">
            {/* ============================================================ */}
            {/* PHASE 1: HERO INTRODUCTION (0% - 35%) */}
            {/* ============================================================ */}
            <motion.div
              style={{
                opacity: phase1Opacity,
                y: phase1Y,
                pointerEvents: phase1Pointer,
              }}
              className="absolute right-8 md:right-16 lg:right-24 flex flex-col items-start max-w-2xl text-left"
            >
              {/* Technical label */}
              <div className="font-mono text-xs tracking-[0.3em] text-[#00E5FF] mb-4 flex items-center gap-2">
                <span className="h-2 w-2 bg-[#00E5FF] rounded-full animate-pulse" />
                SYSTEM ONLINE — INVENTORY LOADED
              </div>

              {/* Headline */}
              <h1 className="font-rajdhani font-bold text-5xl md:text-7xl leading-[0.95] text-white uppercase tracking-tight">
                Gear up for
                <span className="block text-[#00E5FF]">every match</span>
              </h1>

              <p className="font-body text-gray-300 mt-4 max-w-md text-base md:text-lg">
                Consoles, controllers, and accessories built for players who don't settle for lag, latency, or last season's gear.
              </p>

              <div className="flex flex-wrap gap-4 mt-8">
                <Link
                  to="/products"
                  className="clip-btn inline-block bg-[#00E5FF] text-[#05070C] font-mono font-semibold text-sm tracking-wider px-8 py-3 uppercase hover:bg-white transition-colors cursor-pointer"
                >
                  Shop Now
                </Link>
                <Link
                  to="/products"
                  className="clip-btn inline-block bg-transparent border border-[#FF3D8A] text-[#FF3D8A] font-mono font-semibold text-sm tracking-wider px-8 py-3 uppercase hover:bg-[#FF3D8A]/10 transition-colors cursor-pointer"
                >
                  Explore Gear
                </Link>
              </div>

              {/* Spec ticker */}
              <div className="font-mono text-[10px] tracking-[0.2em] text-gray-400 mt-8 flex flex-wrap gap-6">
                <span>4K // 120HZ</span>
                <span>ULTRA-LOW LATENCY</span>
                <span>FREE SHIPPING $75+</span>
              </div>
            </motion.div>

            {/* ============================================================ */}
            {/* PHASE 2: 360° PRECISION HARDWARE (35% - 70%) */}
            {/* ============================================================ */}
            <motion.div
              style={{
                opacity: phase2Opacity,
                y: phase2Y,
                pointerEvents: phase2Pointer,
              }}
              className="absolute right-8 md:right-16 lg:right-24 flex flex-col items-start max-w-2xl text-left"
            >
              {/* Technical label */}
              <div className="font-mono text-xs tracking-[0.3em] text-[#FF3D8A] mb-4 flex items-center gap-2">
                <Cpu size={14} className="text-[#FF3D8A]" />
                HARDWARE OVERVIEW // 360° PRECISION
              </div>

              {/* Headline */}
              <h2 className="font-rajdhani font-bold text-4xl md:text-6xl leading-[0.95] text-white uppercase tracking-tight">
                Crafted for
                <span className="block text-[#FF3D8A]">Peak Performance</span>
              </h2>

              <p className="font-body text-gray-300 mt-4 max-w-md text-base md:text-lg">
                Engineered with zero-drift hall-effect joysticks, micro-switch bumpers, and instant trigger locks for surgical accuracy.
              </p>

              {/* Hardware feature pills */}
              <div className="grid grid-cols-2 gap-3 mt-6 w-full max-w-md">
                <div className="p-3 bg-white/5 border border-cyan-500/20 clip-btn">
                  <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs mb-1">
                    <Zap size={14} /> 0.1ms RESPONSE
                  </div>
                  <p className="text-[11px] text-gray-400 font-body">Sub-millisecond wireless polling rate</p>
                </div>

                <div className="p-3 bg-white/5 border border-pink-500/20 clip-btn">
                  <div className="flex items-center gap-2 text-pink-400 font-mono text-xs mb-1">
                    <Shield size={14} /> ZERO DRIFT
                  </div>
                  <p className="text-[11px] text-gray-400 font-body">Magnetic Hall-Effect sensor modules</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-8">
                <Link
                  to="/products?category=console"
                  className="clip-btn inline-flex items-center gap-2 bg-[#FF3D8A] text-white font-mono font-semibold text-sm tracking-wider px-7 py-3 uppercase hover:bg-white hover:text-black transition-colors cursor-pointer"
                >
                  View Controllers <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>

            {/* ============================================================ */}
            {/* PHASE 3: FINAL CALL TO ACTION (70% - 100%) */}
            {/* ============================================================ */}
            <motion.div
              style={{
                opacity: phase3Opacity,
                y: phase3Y,
                pointerEvents: phase3Pointer,
              }}
              className="absolute right-8 md:right-16 lg:right-24 flex flex-col items-start max-w-2xl text-left"
            >
              {/* Technical label */}
              <div className="font-mono text-xs tracking-[0.3em] text-[#00E5FF] mb-4 flex items-center gap-2">
                <Sparkles size={14} className="text-[#00E5FF]" />
                ARMORY READY // SECURE CHECKOUT
              </div>

              {/* Headline */}
              <h2 className="font-rajdhani font-bold text-4xl md:text-6xl leading-[0.95] text-white uppercase tracking-tight">
                Dominate the
                <span className="block text-[#00E5FF]">Leaderboards</span>
              </h2>

              <p className="font-body text-gray-300 mt-4 max-w-md text-base md:text-lg">
                Join thousands of competitive gamers upgraded with pro-grade gear. Same-day dispatch and 1-year warranty on all consoles & controllers.
              </p>

              <div className="flex flex-wrap gap-4 mt-8">
                <Link
                  to="/products"
                  className="clip-btn inline-flex items-center gap-2 bg-[#00E5FF] text-[#05070C] font-mono font-semibold text-sm tracking-wider px-8 py-3 uppercase hover:bg-white transition-colors cursor-pointer"
                >
                  Explore All Gear <ArrowRight size={15} />
                </Link>
                <Link
                  to="/wishlists"
                  className="clip-btn inline-block bg-transparent border border-white/20 text-white font-mono font-semibold text-sm tracking-wider px-8 py-3 uppercase hover:bg-white/10 transition-colors cursor-pointer"
                >
                  My Wishlist
                </Link>
              </div>

              <div className="font-mono text-[10px] tracking-[0.2em] text-gray-400 mt-8 flex flex-wrap gap-6">
                <span>AUTHENTIC PRODUCTS</span>
                <span>SECURE PAYMENTS</span>
                <span>24/7 SUPPORT</span>
              </div>
            </motion.div>
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
          `}</style>
        </section>
      </div>
      <Footer />
    </>
  )
}

export default Index