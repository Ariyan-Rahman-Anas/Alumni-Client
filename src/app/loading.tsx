"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

/* ── Messages — nostalgia-flavoured for BAMHSians ─────────── */
const messages = [
  "Reconnecting with your roots…",
  "Finding your batch-mates…",
  "Walking through the corridors again…",
  "Dusting off the old class photos…",
  "Ringing the school bell…",
  "Calling roll… please wait!",
  "Memories loading, one moment…",
  "The playground is almost ready…",
  "BAMHSians are gathering…",
  "Chalk dust in the air… almost there!",
  "Morning assembly in progress…",
  "Polishing the school emblem…",
  "Gathering alumni from 18+ countries…",
  "Since 1966, always worth the wait…",
  "Your second home is loading…",
]

/* ── Floating leaf particle ───────────────────────────────── */
const Leaf = ({
  style,
}: {
  style: React.CSSProperties & { delay?: number; dur?: number }
}) => (
  <motion.div
    className="absolute select-none pointer-events-none text-xl"
    style={{ ...style, opacity: 0 }}
    animate={{
      y: [0, -140],
      x: [0, (Math.random() - 0.5) * 60],
      rotate: [0, 360],
      opacity: [0, 0.18, 0.18, 0],
    }}
    transition={{
      duration: style.dur ?? 9,
      delay: style.delay ?? 0,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    🌿
  </motion.div>
)

/* ══════════════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════════════ */
const Loading = () => {
  const [msgIndex, setMsgIndex] = useState(
    () => Math.floor(Math.random() * messages.length)
  )
  const [progress, setProgress] = useState(0)

  /* cycle messages every 2.5 s */
  useEffect(() => {
    const t = setInterval(
      () => setMsgIndex((p) => (p + 1) % messages.length),
      2500
    )
    return () => clearInterval(t)
  }, [])

  /* fake progress — stalls near 92 % */
  useEffect(() => {
    const t = setInterval(() => {
      setProgress((p) => {
        if (p >= 92) return p
        return p + Math.random() * 7
      })
    }, 420)
    return () => clearInterval(t)
  }, [])

  const pct = Math.round(Math.min(progress, 92))

  /* leaf positions */
  const leaves = [
    { bottom: "8%", left: "6%", delay: 0, dur: 9 },
    { bottom: "5%", left: "22%", delay: 2.4, dur: 11 },
    { bottom: "10%", left: "40%", delay: 1.1, dur: 8 },
    { bottom: "6%", right: "20%", delay: 3.2, dur: 10 },
    { bottom: "9%", right: "7%", delay: 0.6, dur: 12 },
    { bottom: "12%", left: "58%", delay: 4, dur: 9 },
  ]

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #051F15 0%, #0A3D2B 55%, #0F3C24 100%)",
      }}
    >

      {/* ── Grid overlay ── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(46,139,87,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(46,139,87,0.07) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      {/* ── Radial glows ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/3 left-1/3 w-[380px] h-[380px] rounded-full blur-3xl"
          style={{ background: "rgba(46,139,87,0.18)" }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.18, 0.28, 0.18] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/3 w-[280px] h-[280px] rounded-full blur-3xl"
          style={{ background: "rgba(126,158,37,0.14)" }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.14, 0.22, 0.14] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />
      </div>

      {/* ── Floating leaves ── */}
      {leaves.map((l, i) => (
        <Leaf key={i} style={l as React.CSSProperties & { delay: number; dur: number }} />
      ))}

      {/* ════════════════════════════════════════════════════
          CARD
      ════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
        className="relative z-10 flex flex-col items-center gap-7 px-8 py-10 max-w-xs w-full mx-6 rounded-3xl border"
        style={{
          background: "rgba(253,250,242,0.07)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderColor: "rgba(46,139,87,0.22)",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.04) inset, 0 24px 64px rgba(5,31,21,0.60)",
        }}
      >
        {/* gloss top line */}
        <div
          className="absolute top-0 left-8 right-8 h-px rounded-full"
          style={{ background: "rgba(255,255,255,0.14)" }}
        />

        {/* ── Emblem ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
          className="flex flex-col items-center gap-2"
        >
          {/* glow ring */}
          <motion.div
            className="relative"
            animate={{ filter: ["drop-shadow(0 0 0px rgba(46,139,87,0))", "drop-shadow(0 0 14px rgba(46,139,87,0.55))", "drop-shadow(0 0 0px rgba(46,139,87,0))"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <div
              className="relative w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden shadow-2xl border"
              style={{
                background: "linear-gradient(135deg,#155A3E 0%,#0A3D2B 100%)",
                borderColor: "rgba(46,139,87,0.40)",
              }}
            >
              {/* leaf accent */}
              <div
                className="absolute -top-2 -right-2 w-8 h-8 rounded-full opacity-25"
                style={{ background: "var(--color-primary-300, #72C48C)" }}
              />
              <span
                className="relative z-10 font-display font-bold text-3xl"
                style={{ color: "rgba(195,232,206,0.95)" }}
              >
                B
              </span>
            </div>
          </motion.div>

          <div className="text-center leading-none mt-1">
            <p className="font-display font-bold text-lg tracking-tight"
              style={{ color: "var(--color-primary-50, #E8F5ED)" }}>
              BAMHSian
            </p>
            <p className="font-mono text-[10px] tracking-[0.18em] uppercase mt-0.5"
              style={{ color: "rgba(195,232,206,0.50)" }}>
              Est. 1966 · Alumni Portal
            </p>
          </div>
        </motion.div>

        {/* ── Spinner ring ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="relative w-14 h-14"
        >
          {/* track */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="24"
              fill="none" stroke="rgba(46,139,87,0.15)" strokeWidth="2.5" />
            {/* animated arc */}
            <motion.circle
              cx="28" cy="28" r="24"
              fill="none"
              stroke="url(#greenGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={150.8}
              animate={{ strokeDashoffset: [150.8, 0, 150.8] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* secondary faint arc going opposite */}
            <motion.circle
              cx="28" cy="28" r="24"
              fill="none"
              stroke="rgba(126,158,37,0.30)"
              strokeWidth="1"
              strokeLinecap="round"
              strokeDasharray="20 130"
              animate={{ rotate: [0, -360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "28px 28px" }}
            />
            <defs>
              <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2E8B57" />
                <stop offset="100%" stopColor="#7E9E25" />
              </linearGradient>
            </defs>
          </svg>

          {/* pulsing center leaf dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{ background: "var(--color-primary-400, #4DB472)" }}
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>

        {/* ── Progress bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="w-full space-y-2"
        >
          {/* track */}
          <div
            className="w-full h-[3px] rounded-full overflow-hidden"
            style={{ background: "rgba(46,139,87,0.15)" }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, #2E8B57 0%, #7E9E25 60%, #F59E0B 100%)",
              }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px]"
              style={{ color: "rgba(195,232,206,0.50)" }}>
              {pct}%
            </span>
            {/* dot pulse trio */}
            <div className="flex items-center gap-1">
              {[0, 0.2, 0.4].map((delay, i) => (
                <motion.span key={i}
                  className="block w-1 h-1 rounded-full"
                  style={{ background: "rgba(46,139,87,0.60)" }}
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.3, 0.8] }}
                  transition={{ duration: 1, repeat: Infinity, delay, ease: "easeInOut" }}
                />
              ))}
            </div>
            <span className="font-mono text-[10px] tracking-widest uppercase"
              style={{ color: "rgba(195,232,206,0.35)" }}>
              loading
            </span>
          </div>
        </motion.div>

        {/* ── Cycling message ── */}
        <div className="h-5 flex items-center justify-center overflow-hidden w-full">
          <AnimatePresence mode="wait">
            <motion.p
              key={msgIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="font-sans text-xs text-center italic"
              style={{ color: "rgba(195,232,206,0.55)" }}
            >
              {messages[msgIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* bottom gloss line */}
        <div
          className="absolute bottom-0 left-8 right-8 h-px rounded-full"
          style={{ background: "rgba(46,139,87,0.20)" }}
        />
      </motion.div>

      {/* ── Bottom label ── */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-8 font-mono text-[9px] tracking-[0.20em] uppercase"
        style={{ color: "rgba(195,232,206,0.18)" }}
      >
        Battali Abdul Matin High School · Since 1966
      </motion.p>

    </div>
  )
}

export default Loading