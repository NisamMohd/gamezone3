import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useSpring, useMotionValueEvent } from 'framer-motion'
import Footer from '../components/Footer'

function Index() {
  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const durationRef = useRef(0)

  const handleVideoError = (e) => {
    console.error('Video failed to load:', e.target.error)
    console.log('Attempted src:', e.target.currentSrc || e.target.src)
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      durationRef.current = videoRef.current.duration
      console.log('Video duration:', durationRef.current)
    }
  }

  // Tracks scroll progress (0 to 1) across the tall container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Springs smooth out raw scroll jitter before it hits the video —
  // this is what actually removes the choppiness
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 40,
    mass: 0.5,
  })

  // Whenever the smoothed progress updates, scrub the video to match
  useMotionValueEvent(smoothProgress, 'change', (latest) => {
    const video = videoRef.current
    if (video && durationRef.current) {
      const targetTime = latest * durationRef.current
      if (Math.abs(video.currentTime - targetTime) > 0.03) {
        video.currentTime = targetTime
      }
    }
  })

  // Stagger settings for the text content fading/sliding in on load
  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  }

  return (
    <>
      {/* Tall wrapper — this is the "scroll distance" the video scrubs across.
          300vh = 2 extra screen-heights of scrolling to play through the video. */}
      <div ref={containerRef} className="relative h-[300vh] w-full">

        {/* Pinned section — stays fixed in view while the wrapper scrolls past it */}
        <section className="sticky top-0 h-screen w-full overflow-hidden bg-[#05070C]">

          {/* Background video — scrubbed by scroll, not autoplaying */}
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover z-0"
            muted
            playsInline
            preload="auto"
            onError={handleVideoError}
            onLoadedMetadata={handleLoadedMetadata}
          >
            <source src="/video/controller-horizondal.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Darkening + gradient overlay so text stays readable */}
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#05070C]/70 via-[#05070C]/30 to-[#05070C]/10" />
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-[#05070C]/20 to-[#05070C]/80" />

          {/* HUD grid overlay */}
          <div className="grid-bg absolute inset-0 z-10 pointer-events-none opacity-30" />

          {/* Scanline accent bars */}
          <div className="absolute top-0 left-0 w-full h-[2px] z-10 bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent opacity-60" />
          <div className="absolute bottom-0 left-0 w-full h-[2px] z-10 bg-gradient-to-r from-transparent via-[#FF3D8A] to-transparent opacity-60" />

          {/* Content - positioned on the right side */}
          <motion.div
            className="relative z-20 flex h-full w-full flex-col items-end justify-center px-8 md:px-16 lg:px-24 text-left"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <div className="flex flex-col items-start max-w-2xl">
              {/* Technical label */}
              <motion.div
                variants={item}
                className="font-mono text-xs tracking-[0.3em] text-[#00E5FF] mb-4 flex items-center gap-2"
              >
                <span className="h-2 w-2 bg-[#00E5FF] rounded-full animate-pulse" />
                SYSTEM ONLINE — INVENTORY LOADED
              </motion.div>

              {/* Headline panel */}
              <motion.div variants={item} className="relative w-full">
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
              </motion.div>

              {/* Spec ticker */}
              <motion.div
                variants={item}
                className="font-mono text-[10px] tracking-[0.2em] text-gray-400 mt-8 flex flex-wrap gap-6"
              >
                <span>4K // 120HZ</span>
                <span>ULTRA-LOW LATENCY</span>
                <span>FREE SHIPPING $75+</span>
              </motion.div>
            </div>
          </motion.div>

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