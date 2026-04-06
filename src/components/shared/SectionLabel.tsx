"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

type SectionLabelProps = {
    text: string
    icon?: ReactNode
    color?: "brand" | "accent" | "green" | "yellow" | "pink"
    variant?: "pill" | "mono" | "island"
    align?: "left" | "center" | "right"
    animated?: boolean
    className?: string
}

const colorMap = {
    brand: { text: "text-brand-light", border: "border-brand/25", bg: "bg-brand/10", glow: "rgba(59,130,246,0.15)" },
    accent: { text: "text-accent", border: "border-accent/25", bg: "bg-accent/10", glow: "rgba(6,182,212,0.15)" },
    green: { text: "text-green-400", border: "border-green-400/25", bg: "bg-green-400/10", glow: "rgba(74,222,128,0.15)" },
    yellow: { text: "text-yellow-400", border: "border-yellow-400/25", bg: "bg-yellow-400/10", glow: "rgba(250,204,21,0.15)" },
    pink: { text: "text-pink-400", border: "border-pink-400/25", bg: "bg-pink-400/10", glow: "rgba(244,114,182,0.15)" },
}

const alignMap = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
}

// ── Variant 1 — Mono (minimal, just text) ─────────────────────
const MonoLabel = ({
    text,
    color,
}: {
    text: string
    color: keyof typeof colorMap
}) => (
    <span className={`text-xs  tracking-[0.3em] uppercase ${colorMap[color].text}`}>
        {"//"} {text}
    </span>
)

// ── Variant 2 — Pill (bordered badge) ─────────────────────────
const PillLabel = ({
    text,
    icon,
    color,
}: {
    text: string
    icon?: ReactNode
    color: keyof typeof colorMap
}) => {
    const c = colorMap[color]
    return (
        <span
            className={`inline-flex items-center gap-2 border ${c.border} ${c.bg} ${c.text} px-4 py-1.5 rounded-full text-xs  tracking-widest uppercase`}
        >
            {icon && <span className="text-sm leading-none">{icon}</span>}
            {text}
        </span>
    )
}

// ── Variant 3 — Dynamic Island (Apple-style) ──────────────────
const IslandLabel = ({
    text,
    icon,
    color,
    animated,
}: {
    text: string
    icon?: ReactNode
    color: keyof typeof colorMap
    animated: boolean
}) => {
    const c = colorMap[color]

    return (
        <motion.div
            initial={animated ? { width: "2.5rem", opacity: 0.6 } : false}
            animate={{ width: "auto", opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative inline-flex items-center"
        >
            {/* Glow behind */}
            <div
                className="absolute inset-0 rounded-full blur-md"
                style={{ background: c.glow }}
            />

            {/* Outer gradient ring */}
            <div className={`absolute -inset-[1px] rounded-full bg-gradient-to-r ${color === "brand" ? "from-brand/40 via-accent/20 to-brand/40" :
                color === "accent" ? "from-accent/40 via-brand/20 to-accent/40" :
                    color === "green" ? "from-green-400/40 via-teal-400/20 to-green-400/40" :
                        color === "yellow" ? "from-yellow-400/40 via-orange-400/20 to-yellow-400/40" :
                            "from-pink-400/40 via-rose-400/20 to-pink-400/40"
                } blur-[2px]`} />

            {/* Body */}
            <div
                className={`relative flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#060d1f]/90 backdrop-blur-xl border ${c.border} overflow-hidden`}
            >
                {/* Shimmer sweep */}
                <motion.div
                    className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"
                    animate={{ translateX: ["−100%", "200%"] }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
                />

                {/* Dot pulse */}
                <div className="relative flex items-center justify-center shrink-0">
                    <span className={`w-1.5 h-1.5 rounded-full ${color === "brand" ? "bg-brand-light" :
                        color === "accent" ? "bg-accent" :
                            color === "green" ? "bg-green-400" :
                                color === "yellow" ? "bg-yellow-400" :
                                    "bg-pink-400"
                        }`} />
                    <span className={`absolute w-1.5 h-1.5 rounded-full animate-ping opacity-60 ${color === "brand" ? "bg-brand-light" :
                        color === "accent" ? "bg-accent" :
                            color === "green" ? "bg-green-400" :
                                color === "yellow" ? "bg-yellow-400" :
                                    "bg-pink-400"
                        }`} />
                </div>

                {/* Icon */}
                {icon && (
                    <motion.span
                        className={`text-sm leading-none ${c.text} shrink-0`}
                        animate={{ rotate: [0, 8, -4, 0], scale: [1, 1.15, 1] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                        {icon}
                    </motion.span>
                )}

                {/* Text */}
                <motion.span
                    initial={animated ? { opacity: 0, x: -6 } : false}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.35 }}
                    className={`text-xs  tracking-[0.25em] uppercase whitespace-nowrap ${c.text}`}
                >
                    {text}
                </motion.span>
            </div>
        </motion.div>
    )
}

// ── Main export ───────────────────────────────────────────────
const SectionLabel = ({
    text,
    icon,
    color = "brand",
    variant = "island",
    align = "center",
    animated = true,
    className = "mb-4",
}: SectionLabelProps) => {
    return (
        <div className={`flex ${alignMap[align]} ${className}`}>
            {variant === "mono" && <MonoLabel text={text} color={color} />}
            {variant === "pill" && <PillLabel text={text} icon={icon} color={color} />}
            {variant === "island" && <IslandLabel text={text} icon={icon} color={color} animated={animated} />}
        </div>
    )
}

export default SectionLabel