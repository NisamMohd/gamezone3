import React, { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion'
import Footer from '../components/Footer'
import { ChevronDown, Sparkles, Cpu, Zap, Shield, ArrowRight, Layers, Eye } from 'lucide-react'

function Index() {
  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const durationRef = useRef(0)
  const targetProgress = useRef(0)
  const currentProgress = useRef(0)
  const rafId = useRef(null)
  const [isVideoReady, setIsVideoReady] = useState(false)
  const [scrollPercent, setScrollPercent] = useState(0)

  // Track scroll progress across the 450vh tall container for luxurious pacing
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // ============================================================
  // DYNAMIC VIDEO MOTION TRANSFORMS (VIDEO MOVES ALONG WITH SCROLL)
  // ============================================================
  // Phase 1 (0-30%): Assembled Tour (slightly left to balance hero text)
  // Phase 2 (30-75%): EXPLODED VIEW (centered & zoomed to showcase internal parts)
  // Phase 3 (75-100%): Re-assembled final call to action
  const videoXRaw = useTransform(
    scrollYProgress,
    [0, 0.3, 0.52, 0.75, 1],
    ['0%', '-6%', '-2%', '-4%', '0%']
  )
  const videoYRaw = useTransform(
    scrollYProgress,
    [0, 0.35, 0.55, 0.8, 1],
    ['0%', '-2%', '0%', '2%', '0%']
  )
  const videoScaleRaw = useTransform(
    scrollYProgress,
    [0, 0.32, 0.55, 0.78, 1],
    [1, 1.06, 1.12, 1.06, 1.02]
  )
  const videoRotateRaw = useTransform(
    scrollYProgress,
    [0, 0.35, 0.6, 1],
    [0, -1.2, 0.8, 0]
  )

  // Physics springs for organic video movement and camera momentum
  const videoX = useSpring(videoXRaw, { stiffness: 100, damping: 22, mass: 0.5 })
  const videoY = useSpring(videoYRaw, { stiffness: 100, damping: 22, mass: 0.5 })
  const videoScale = useSpring(videoScaleRaw, { stiffness: 100, damping: 22, mass: 0.5 })
  const videoRotate = useSpring(videoRotateRaw, { stiffness: 100, damping: 22, mass: 0.5 })

  // Ambient glow parallax transforms
  const glowX1 = useTransform(scrollYProgress, [0, 1], ['-30px', '70px'])
  const glowY1 = useTransform(scrollYProgress, [0, 1], ['-30px', '120px'])
  const glowX2 = useTransform(scrollYProgress, [0, 1], ['30px', '-70px'])
  const glowY2 = useTransform(scrollYProgress, [0, 1], ['30px', '-120px'])

  // ============================================================
  // TEXT STORYTELLING TRANSFORMS ACROSS SCROLL
  // ============================================================
  // Phase 1 (0% - 30%): Hero introduction
  const phase1Opacity = useTransform(scrollYProgress, [0, 0.24, 0.32], [1, 1, 0])
  const phase1Y = useTransform(scrollYProgress, [0, 0.28], [0, -30])
  const phase1Pointer = useTransform(scrollYProgress, (v) => (v < 0.3 ? 'auto' : 'none'))

  // Phase 2 (30% - 75%): EXPLODED VIEW & Internal Schematics
  const phase2Opacity = useTransform(
    scrollYProgress,
    [0.3, 0.38, 0.68, 0.76],
    [0, 1, 1, 0]
  )
  const phase2Y = useTransform(
    scrollYProgress,
    [0.3, 0.38, 0.68, 0.76],
    [40, 0, 0, -40]
  )
  const phase2Pointer = useTransform(
    scrollYProgress,
    (v) => (v >= 0.3 && v < 0.75 ? 'auto' : 'none')
  )

  // Phase 3 (75% - 100%): Final CTA
  const phase3Opacity = useTransform(scrollYProgress, [0.74, 0.82, 1], [0, 1, 1])
  const phase3Y = useTransform(scrollYProgress, [0.74, 0.82], [40, 0])
  const phase3Pointer = useTransform(scrollYProgress, (v) => (v >= 0.75 ? 'auto' : 'none'))

  // Scroll prompt opacity (fades out immediately upon scrolling)
  const promptOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0])

  // Update target progress on scroll
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    targetProgress.current = latest
    setScrollPercent(Math.round(latest * 100))
  })

  // Ultra-smooth lerp animation loop for video scrubbing
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.pause()

    const updateVideoFrame = () => {
      const diff = targetProgress.current - currentProgress.current
      currentProgress.current += diff * 0.085 // smooth damping factor

      if (durationRef.current > 0 && !video.seeking) {
        const targetTime = currentProgress.current * durationRef.current
        if (Math.abs(video.currentTime - targetTime) > 0.012) {
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

  // Dynamic HUD status label based on current transition phase
  let hudStatusLabel = 'ASSEMBLED 360° VIEW'
  let hudBadgeColor = 'text-cyan-400 border-cyan-400/40 bg-cyan-500/10'
  if (scrollPercent >= 30 && scrollPercent < 75) {
    hudStatusLabel = 'EXPLODED VIEW // 12-PART DECONSTRUCTION'
    hudBadgeColor = 'text-pink-400 border-pink-500/40 bg-pink-500/10'
  } else if (scrollPercent >= 75) {
    hudStatusLabel = 'ARMORY DEPLOYED // READY FOR ACTION'
    hudBadgeColor = 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
  }

  return (
    <>
      {/* Tall wrapper for smooth cinematic scroll scrubbing and explode inspection */}
      <div ref={containerRef} className="relative h-[450vh] w-full bg-[#05070C]">
        {/* Pinned section — stays fixed in view while the container scrolls past */}
        <section className="sticky top-0 h-screen w-full overflow-hidden bg-[#05070C]">

          {/* DYNAMIC SCROLLING & PANNING VIDEO WRAPPER */}
          <motion.div
            style={{
              x: videoX,
              y: videoY,
              scale: videoScale,
              rotate: videoRotate,
              willChange: 'transform',
            }}
            className="absolute inset-0 h-full w-full pointer-events-none flex items-center justify-center z-0"
          >
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
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
          </motion.div>

          {/* Ambient Lighting & Contrast Overlays with Parallax Float */}
          <motion.div
            style={{
              x: glowX1,
              y: glowY1,
              background: 'radial-gradient(circle, #00E5FF, transparent 70%)',
            }}
            className="absolute -top-40 -left-40 w-[32rem] h-[32rem] rounded-full opacity-20 blur-3xl pointer-events-none"
          />
          <motion.div
            style={{
              x: glowX2,
              y: glowY2,
              background: 'radial-gradient(circle, #FF3D8A, transparent 70%)',
            }}
            className="absolute -bottom-40 -right-40 w-[32rem] h-[32rem] rounded-full opacity-20 blur-3xl pointer-events-none"
          />

          {/* Balanced contrast overlays so exploded parts remain crystal clear */}
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#05070C]/80 via-transparent to-[#05070C]/30 pointer-events-none" />
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-[#05070C]/20 to-[#05070C]/80 pointer-events-none" />

          {/* Cyber HUD Grid & Scanlines */}
          <div className="grid-bg absolute inset-0 z-10 pointer-events-none opacity-25" />
          <div className="absolute top-0 left-0 w-full h-[2px] z-10 bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent opacity-70" />
          <div className="absolute bottom-0 left-0 w-full h-[2px] z-10 bg-gradient-to-r from-transparent via-[#FF3D8A] to-transparent opacity-70" />

          {/* HUD SIDEBAR SCRUB METER WITH LIVE DECONSTRUCTION BADGE (BOTTOM-LEFT) */}
          <div className="absolute bottom-8 left-8 z-30 hidden sm:flex flex-col gap-2 pointer-events-none">
            <div className={`flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] px-2.5 py-1 border rounded ${hudBadgeColor} backdrop-blur-md`}>
              <span className="h-1.5 w-1.5 rounded-full bg-current animate-ping" />
              <span>{hudStatusLabel}</span>
            </div>

            <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-gray-400 pl-1">
              <span>ROTATION // {String(scrollPercent).padStart(2, '0')}%</span>
            </div>

            <div className="w-36 h-[3px] bg-white/10 rounded-full overflow-hidden border border-white/5">
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
              Scroll to Explore Exploded View
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
            {/* PHASE 1: HERO INTRODUCTION (0% - 30%) */}
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
                SYSTEM ONLINE — 360° HARDWARE TOUR
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
            {/* PHASE 2: EXPLODED VIEW & DECONSTRUCTED PRECISION (30% - 75%) */}
            {/* ============================================================ */}
            <motion.div
              style={{
                opacity: phase2Opacity,
                y: phase2Y,
                pointerEvents: phase2Pointer,
              }}
              className="absolute right-8 md:right-16 lg:right-24 flex flex-col items-start max-w-2xl text-left bg-black/40 backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-white/10"
            >
              {/* Technical label */}
              <div className="font-mono text-xs tracking-[0.3em] text-[#FF3D8A] mb-3 flex items-center gap-2">
                <Layers size={14} className="text-[#FF3D8A] animate-pulse" />
                EXPLODED VIEW // INTERNAL SCHEMATICS
              </div>

              {/* Headline */}
              <h2 className="font-rajdhani font-bold text-4xl md:text-5xl leading-[0.95] text-white uppercase tracking-tight">
                Deconstructed
                <span className="block text-[#FF3D8A]">Precision Anatomy</span>
              </h2>

              <p className="font-body text-gray-300 mt-3 max-w-md text-sm md:text-base">
                Scroll to inspect the inner engineering: zero-drift magnetic hall sensors, dual haptic vibration engines, and hairpin trigger mechanisms.
              </p>

              {/* Exploded Component Feature Cards */}
              <div className="grid grid-cols-2 gap-3 mt-5 w-full max-w-lg">
                <div className="p-3 bg-white/5 border border-pink-500/30 clip-btn">
                  <div className="flex items-center gap-2 text-pink-400 font-mono text-xs mb-1">
                    <Shield size={13} /> ZERO-DRIFT SENSORS
                  </div>
                  <p className="text-[11px] text-gray-400 font-body">Magnetic Hall-Effect analog modules</p>
                </div>

                <div className="p-3 bg-white/5 border border-cyan-500/30 clip-btn">
                  <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs mb-1">
                    <Zap size={13} /> 0.1MS RESPONSE
                  </div>
                  <p className="text-[11px] text-gray-400 font-body">Micro-switch tactical bumpers</p>
                </div>

                <div className="p-3 bg-white/5 border border-cyan-500/20 clip-btn">
                  <div className="flex items-center gap-2 text-cyan-300 font-mono text-xs mb-1">
                    <Cpu size={13} /> DUAL HAPTIC FORCE
                  </div>
                  <p className="text-[11px] text-gray-400 font-body">Sub-millisecond feedback motors</p>
                </div>

                <div className="p-3 bg-white/5 border border-pink-500/20 clip-btn">
                  <div className="flex items-center gap-2 text-pink-300 font-mono text-xs mb-1">
                    <Sparkles size={13} /> 40H POWER CORE
                  </div>
                  <p className="text-[11px] text-gray-400 font-body">1500mAh low-latency battery</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-6">
                <Link
                  to="/products?category=console"
                  className="clip-btn inline-flex items-center gap-2 bg-[#FF3D8A] text-white font-mono font-semibold text-sm tracking-wider px-7 py-3 uppercase hover:bg-white hover:text-black transition-colors cursor-pointer"
                >
                  View Controllers <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>

            {/* ============================================================ */}
            {/* PHASE 3: RE-ASSEMBLY & FINAL CALL TO ACTION (75% - 100%) */}
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