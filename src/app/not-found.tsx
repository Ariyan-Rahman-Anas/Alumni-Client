"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { RiArrowLeftLine, RiHome4Line, RiGroupLine, RiSearchLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";

/* ── Floating leaf particle ──────────────────────────────── */
const Leaf = ({ style }: { style: React.CSSProperties }) => (
    <motion.div
        className="absolute pointer-events-none select-none text-2xl opacity-20"
        style={style}
        animate={{
            y: [0, -120, 0],
            x: [0, 30, 0],
            rotate: [0, 180, 360],
            opacity: [0, 0.20, 0],
        }}
        transition={{
            duration: style.animationDuration as number ?? 8,
            repeat: Infinity,
            delay: style.animationDelay as number ?? 0,
            ease: "easeInOut",
        }}
    >
        🌿
    </motion.div>
);

/* ── Quick links ─────────────────────────────────────────── */
const links = [
    { label: "Go Home", href: "/", icon: <RiHome4Line /> },
    { label: "Find Your Batch", href: "/batches", icon: <RiGroupLine /> },
    { label: "Browse Gallery", href: "/gallery", icon: <RiSearchLine /> },
];

/* ══════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════ */
export default function NotFoundPage() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const leaves = [
        { top: "10%", left: "5%", animationDuration: 9, animationDelay: 0 },
        { top: "70%", left: "8%", animationDuration: 11, animationDelay: 1.5 },
        { top: "20%", left: "88%", animationDuration: 8, animationDelay: 0.5 },
        { top: "75%", left: "85%", animationDuration: 12, animationDelay: 3 },
        { top: "45%", left: "3%", animationDuration: 10, animationDelay: 2 },
        { top: "35%", left: "92%", animationDuration: 7, animationDelay: 1 },
    ];

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6"
            style={{ background: "linear-gradient(160deg, #0A3D2B 0%, #051F15 100%)" }}>

            {/* ── Background grid ── */}
            <div className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: "linear-gradient(rgba(46,139,87,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(46,139,87,0.07) 1px, transparent 1px)",
                    backgroundSize: "56px 56px",
                }} />

            {/* ── Radial glow ── */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-3xl opacity-15 pointer-events-none"
                style={{ background: "var(--color-primary-500)" }} />

            {/* ── Floating leaves ── */}
            {mounted && leaves.map((l, i) => (
                <Leaf key={i} style={l as React.CSSProperties} />
            ))}

            {/* ── Content ── */}
            <div className="relative z-10 text-center max-w-2xl mx-auto">

                {/* 404 big number */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
                    className="mb-4 relative"
                >
                    <span
                        className="font-display font-bold select-none"
                        style={{
                            fontSize: "clamp(7rem, 22vw, 16rem)",
                            lineHeight: 1,
                            letterSpacing: "-0.05em",
                            background: "linear-gradient(135deg, rgba(46,139,87,0.20) 0%, rgba(46,139,87,0.08) 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}
                    >
                        404
                    </span>
                    {/* Glowing outline version on top */}
                    <span
                        className="font-display font-bold absolute inset-0 flex items-center justify-center select-none"
                        style={{
                            fontSize: "clamp(7rem, 22vw, 16rem)",
                            lineHeight: 1,
                            letterSpacing: "-0.05em",
                            WebkitTextStroke: "1px rgba(46,139,87,0.35)",
                            color: "transparent",
                        }}
                    >
                        404
                    </span>
                </motion.div>

                {/* Lost badge */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6"
                    style={{
                        background: "rgba(46,139,87,0.12)",
                        borderColor: "rgba(46,139,87,0.30)",
                    }}
                >
                    <span className="font-mono text-xs tracking-widest uppercase"
                        style={{ color: "var(--color-primary-300)" }}>
                        Page Not Found
                    </span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.65, ease: [0.19, 1, 0.22, 1] }}
                    className="font-display font-bold mb-4"
                    style={{
                        fontSize: "clamp(1.8rem, 4vw, 3rem)",
                        color: "var(--color-primary-50)",
                        letterSpacing: "-0.025em",
                        lineHeight: 1.15,
                    }}
                >
                    Looks like you got lost on<br />
                    <span className="font-serif italic" style={{ color: "var(--color-primary-300)" }}>
                        the way back to Battali
                    </span>
                </motion.h1>

                {/* Sub */}
                <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.55 }}
                    className="font-sans text-base leading-relaxed mb-10 max-w-md mx-auto"
                    style={{ color: "rgba(195,232,206,0.65)" }}
                >
                    This page doesn't exist or may have been moved. Don't worry —
                    every BAMHSian finds their way home.
                </motion.p>

                {/* Quick links */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55, duration: 0.55 }}
                    className="flex flex-col sm:flex-row gap-3 justify-center mb-8"
                >
                    {links.map(({ label, href, icon }, i) => (
                        <Button
                            key={label}
                            asChild
                            variant={i === 0 ? "default" : "outline"}
                            className="rounded-xl font-medium px-6 py-5 gap-2"
                            style={
                                i === 0
                                    ? {
                                        background: "linear-gradient(135deg, #2E8B57 0%, #155A3E 100%)",
                                        color: "#FDFAF2",
                                        boxShadow: "0 0 24px rgba(46,139,87,0.35)",
                                    }
                                    : {
                                        borderColor: "rgba(46,139,87,0.35)",
                                        color: "var(--color-primary-200)",
                                        background: "rgba(46,139,87,0.06)",
                                    }
                            }
                        >
                            <Link href={href} className="flex items-center gap-2">
                                {icon}
                                {label}
                            </Link>
                        </Button>
                    ))}
                </motion.div>

                {/* Back link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.75 }}
                >
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center gap-1.5 font-sans text-sm transition-colors duration-200 hover:gap-2.5"
                        style={{ color: "rgba(195,232,206,0.40)" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "var(--color-primary-300)")}
                        onMouseLeave={e => (e.currentTarget.style.color = "rgba(195,232,206,0.40)")}
                    >
                        <RiArrowLeftLine />
                        Go back to previous page
                    </button>
                </motion.div>
            </div>

            {/* ── Bottom label ── */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-8 font-mono text-[10px] tracking-[0.18em] uppercase"
                style={{ color: "rgba(195,232,206,0.20)" }}
            >
                BAMHS Alumni Portal · Since 1966
            </motion.p>
        </div>
    );
}