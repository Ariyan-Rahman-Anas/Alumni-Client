"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

const messages = [
  "Almost there… get ready!",
  "Hang tight, greatness incoming!",
  "The wait is worth it!",
  "Something awesome is brewing!",
  "Just a sec… big things ahead!",
  "Loading brilliance… one moment!",
  "Patience, it's almost showtime!",
  "Hold tight, the fun's loading!",
  "On its way… stay with us!",
  "It's coming… stay excited!",
  "Preparing something epic…",
  "Just a moment… something amazing!",
  "Good things in the works!",
  "Almost done… the magic's near!",
]

const Loading = () => {
  const [msgIndex, setMsgIndex] = useState(
    () => Math.floor(Math.random() * messages.length)
  )
  const [progress, setProgress] = useState(0)

  // Cycle messages every 2.5s
  useEffect(() => {
    const t = setInterval(() => {
      setMsgIndex((p) => (p + 1) % messages.length)
    }, 2500)
    return () => clearInterval(t)
  }, [])

  // Fake progress bar
  useEffect(() => {
    const t = setInterval(() => {
      setProgress((p) => {
        if (p >= 92) return p   // stall near end — never hits 100 on its own
        return p + Math.random() * 8
      })
    }, 400)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#060d1f]">

      {/* Ambient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-brand/10 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] rounded-full bg-accent/10 blur-[100px]" />
      </div>

      {/* Grid bg */}
      <div className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8 px-6 max-w-sm w-full">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-2"
        >
          {/* Icon mark */}
          <div className="relative">
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-brand/60 to-accent/40 blur-sm" />
            <div className="relative w-14 h-14 rounded-2xl bg-[#060d1f] border border-white/10 flex items-center justify-center">
              <span className="text-2xl font-black bg-gradient-to-br from-brand to-accent bg-clip-text text-transparent">
                A
              </span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-white font-bold text-lg tracking-tight leading-none">
              Anas<span className="text-brand-light font-mono text-sm">.dev</span>
            </p>
          </div>
        </motion.div>

        {/* Spinner ring */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative w-16 h-16"
        >
          {/* Track */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 64 64">
            <circle
              cx="32" cy="32" r="28"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="3"
            />
            <motion.circle
              cx="32" cy="32" r="28"
              fill="none"
              stroke="url(#spinGrad)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={175.9}
              animate={{ strokeDashoffset: [175.9, 0, 175.9] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <defs>
              <linearGradient id="spinGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-2 h-2 rounded-full bg-brand"
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full space-y-2"
        >
          <div className="w-full h-[3px] rounded-full bg-white/8 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-brand to-accent"
              animate={{ width: `${Math.min(progress, 92)}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-text-secondary">
              {Math.round(Math.min(progress, 92))}%
            </span>
            <span className="text-xs font-mono text-text-secondary tracking-widest uppercase">
              loading
            </span>
          </div>
        </motion.div>

        {/* Cycling message */}
        <div className="h-5 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={msgIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="text-xs text-text-secondary text-center font-mono"
            >
              {messages[msgIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

      </div>
    </div>
  )
}

export default Loading