"use client";

import { AiOutlineHome } from "react-icons/ai";
import { TiInfoLarge } from "react-icons/ti";
import { MdDashboard, MdOutlineCampaign, MdOutlineBloodtype } from "react-icons/md";
import { IoBriefcaseOutline } from "react-icons/io5";
import { RiCalendarEventLine, RiGroupLine } from "react-icons/ri";
import { HiOutlineHandRaised } from "react-icons/hi2";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "./ui/sheet";
import { Menu, X } from "lucide-react";
import { useSelector } from "react-redux";
import PrimaryButton from "./shared/PrimaryButton";
import UserMenu from "./shared/UserMenu";
import { selectIsLoggedIn } from "@/redux/authSlice";

/* ─────────────────────────────────────────────────────────
   NAV ITEMS
───────────────────────────────────────────────────────── */
const baseNavItems = [
  { title: "Home", link: "", icon: <AiOutlineHome /> },
  { title: "About", link: "about", icon: <TiInfoLarge /> },
  { title: "Gallery", link: "gallery", icon: <IoBriefcaseOutline /> },
  { title: "Events", link: "events", icon: <RiCalendarEventLine /> },
  { title: "Announcements", link: "announcements", icon: <MdOutlineCampaign /> },
  { title: "Batches", link: "batches", icon: <RiGroupLine /> },
  { title: "Blood Bank", link: "bloodbank", icon: <MdOutlineBloodtype /> },
  { title: "Alumni Request", link: "request", icon: <HiOutlineHandRaised /> },
];
const devNavItems = [
  { title: "Dash", link: "arapdash/dashboard", icon: <MdDashboard /> },
];

/* ─────────────────────────────────────────────────────────
   SHIMMER + GLOW  CSS (injected once)
───────────────────────────────────────────────────────── */
const SHIMMER_CSS = `
  @keyframes _shimBeam {
    0%   { transform: translateX(-110%) skewX(-14deg); opacity: 0; }
    15%  { opacity: 1; }
    85%  { opacity: 1; }
    100% { transform: translateX(210%)  skewX(-14deg); opacity: 0; }
  }
  @keyframes _islandGlow {
    0%,100% { box-shadow: 0 4px 24px rgba(10,61,43,0.10), 0 0  0px 0px rgba(46,139,87,0.00), 0 1px 0 rgba(255,255,255,0.85) inset; }
    50%     { box-shadow: 0 4px 28px rgba(10,61,43,0.15), 0 0 14px 3px rgba(46,139,87,0.16), 0 1px 0 rgba(255,255,255,0.85) inset; }
  }
  .shim { position: relative; overflow: hidden; }
  .shim::after {
    content: "";
    position: absolute; inset: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255,255,255,0.20) 40%,
      rgba(255,255,255,0.50) 50%,
      rgba(255,255,255,0.20) 60%,
      transparent 100%
    );
    width: 45%;
    animation: _shimBeam 3.8s ease-in-out infinite;
    pointer-events: none; z-index: 30; border-radius: inherit;
  }
  .glow { animation: _islandGlow 4s ease-in-out infinite; }
`;

/* ─────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────── */
const Navbar = () => {
  const pathname = usePathname();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  /* ── scroll detection ───────────────────────────────── */
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = process.env.NODE_ENV === "development"
    ? [...baseNavItems, ...devNavItems]
    : baseNavItems;

  const isActive = (link: string) =>
    link === "" ? pathname === "/" : pathname.startsWith(`/${link}`);

  const isLoggedIn = useSelector(selectIsLoggedIn);

  /* ── shared island surface ──────────────────────────── */
  const islandBase: React.CSSProperties = {
    background: "rgba(253,250,242,0.88)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderColor: "rgba(46,139,87,0.20)",
  };

  return (
    <>
      <style>{SHIMMER_CSS}</style>

      <div className="fixed top-0 left-0 right-0 z-nav pointer-events-none">

        {/* ══════════════════════════════════════════════DESKTOP*/}
        <div className="hidden md:flex justify-between pt-4 pointer-events-auto px-6 max-w-12xl mx-auto">
          <motion.div
            initial={{ y: -72, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 24, delay: 0.08 }}
          >
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              {/* Emblem — always visible */}
              <div
                className="relative w-9 h-9 rounded-xl overflow-hidden shadow-lg shrink-0"
                style={{ background: "linear-gradient(135deg,#155A3E 0%,#0A3D2B 100%)" }}
              >
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full opacity-30"
                  style={{ background: "var(--color-primary-300)" }} />
                <span className="absolute inset-0 flex items-center justify-center font-display font-bold text-white text-sm">
                  B
                </span>
              </div>

              {/* Text — switches colour based on scroll */}
              <motion.div
                className="flex flex-col leading-none px-2.5 py-1.5 rounded-xl transition-all duration-300"
                animate={{
                  background: scrolled
                    ? "rgba(253,250,242,0.88)"
                    : "transparent",
                  backdropFilter: scrolled ? "blur(16px)" : "blur(0px)",
                  boxShadow: scrolled
                    ? "0 2px 12px rgba(10,61,43,0.10), 0 1px 0 rgba(255,255,255,0.80) inset"
                    : "none",
                  borderColor: scrolled
                    ? "rgba(46,139,87,0.18)"
                    : "transparent",
                }}
                style={{
                  border: "1px solid transparent",
                  WebkitBackdropFilter: scrolled ? "blur(16px)" : "blur(0px)",
                }}
              >
                <motion.span
                  className="font-serif italic font-semibold text-sm tracking-tight"
                  animate={{ color: scrolled ? "var(--color-primary-900)" : "#ffffff" }}
                  transition={{ duration: 0.25 }}
                >
                  BAMHSian
                </motion.span>
                <motion.span
                  className=" text-[10px] tracking-widest uppercase"
                  animate={{
                    color: scrolled
                      ? "var(--color-primary-500)"
                      : "rgba(195,232,206,0.65)",
                  }}
                  transition={{ duration: 0.25 }}
                >
                  Unity · Prosperity
                </motion.span>
              </motion.div>
            </Link>
          </motion.div>

          {/* ── Logo — scroll-aware ─────────────────── */}
          {/*
              PROBLEM:  Logo text was hard-coded `text-white`.
                        On dark hero it reads fine; after scrolling onto
                        the light cream background it vanishes.

              SOLUTION: Wrap the logo in its own mini glass island that
                        appears only when scrolled. When at the top the
                        text stays white (sitting over the dark hero).
                        Once scrolled, the island fades in and text
                        switches to dark green so it stays readable on
                        any background.
            */}
          {/* ── Nav island ──────────────────────────── */}
          <motion.div
            initial={{ y: -72, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 24, delay: 0.08 }}
            className="shim glow relative flex items-center gap-0.5 px-2 py-1.5 rounded-2xl border"
            style={islandBase}
          >
            <div className="absolute top-0 left-4 right-4 h-px rounded-full z-10"
              style={{ background: "rgba(255,255,255,0.98)" }} />
            <div className="absolute bottom-0 left-6 right-6 h-px rounded-full"
              style={{ background: "rgba(46,139,87,0.16)" }} />

            {navItems.map(({ title, icon, link }, idx) => {
              const active = isActive(link);
              const isHover = hoveredIdx === idx;
              return (
                <Link key={idx} href={`/${link}`}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className="relative z-10"
                >
                  <AnimatePresence>
                    {isHover && !active && (
                      <motion.span layoutId="deskHover"
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.13 }}
                        className="absolute inset-0 rounded-xl"
                        style={{ background: "rgba(46,139,87,0.08)" }} />
                    )}
                  </AnimatePresence>
                  {active && (
                    <motion.span layoutId="deskActive"
                      className="absolute inset-0 rounded-xl border"
                      style={{
                        background: "linear-gradient(135deg,rgba(46,139,87,0.13) 0%,rgba(126,158,37,0.08) 100%)",
                        borderColor: "rgba(46,139,87,0.26)",
                      }}
                      transition={{ type: "spring", stiffness: 320, damping: 32 }} />
                  )}
                  <span
                    className="relative z-10 flex items-center gap-1.5 px-3 py-1.5 transition-colors duration-200"
                    style={{
                      color: active ? "var(--color-primary-700)"
                        : isHover ? "var(--color-primary-600)"
                          : "var(--color-text-secondary)",
                    }}
                  >
                    <motion.span animate={{ scale: isHover || active ? 1.2 : 1 }}
                      transition={{ duration: 0.13 }} className="text-base leading-none">
                      {icon}
                    </motion.span>
                    <AnimatePresence mode="wait">
                      {(isHover || active) && (
                        <motion.span key={title}
                          initial={{ opacity: 0, width: 0, x: -4 }}
                          animate={{ opacity: 1, width: "auto", x: 0 }}
                          exit={{ opacity: 0, width: 0, x: -4 }}
                          transition={{ duration: 0.18, ease: "easeOut" }}
                          className=" text-xs font-medium tracking-wide overflow-hidden whitespace-nowrap">
                          {title}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                  {active && (
                    <motion.span layoutId="deskDot"
                      className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ background: "var(--color-primary-500)", boxShadow: "0 0 6px 2px rgba(46,139,87,0.45)" }}
                      transition={{ type: "spring", stiffness: 320, damping: 32 }} />
                  )}
                </Link>
              );
            })}
          </motion.div>


          {/* ── Portal Login / User Avatar ─────────────────────────── */}
          <motion.div
            initial={{ y: -72, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 24, delay: 0.08 }}
          >
            {isLoggedIn
              ? <UserMenu size="md" align="end" />
              : <PrimaryButton type="button" title="Sign In" href="/login" />}
          </motion.div>
        </div>


        {/* ══════════════════════════════════════════════
            MOBILE — Top Header Island
        ══════════════════════════════════════════════ */}
        <div className="md:hidden fixed top-3 left-0 right-0 px-4 pointer-events-auto">
          <motion.div
            initial={{ y: -56, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 26, delay: 0.05 }}
          >
            <div className="shim glow relative flex items-center justify-between px-3 py-2.5 rounded-2xl border"
              style={islandBase}>
              <div className="absolute top-0 left-4 right-4 h-px rounded-full z-10"
                style={{ background: "rgba(255,255,255,0.98)" }} />

              {/* Left: hamburger + logo */}
              <div className="flex items-center gap-2.5 relative z-10">
                {/*
                  SHEET TRANSITION FIX:
                  Shadcn Sheet uses its own CSS `data-[state=open]` transitions
                  which fire immediately without the Framer Motion spring feel.

                  Fix: We add `data-[state=open]:animate-none` to disable
                  Shadcn's default animation, then wrap SheetContent children
                  in a Framer Motion `motion.div` that slides in from the left
                  with a spring. We use `forceMount` so Framer Motion controls
                  mount/unmount instead of Shadcn.
                */}
                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                  <SheetTrigger asChild>
                    <button
                      className="relative p-2 rounded-xl border transition-all duration-200 active:scale-95"
                      style={{
                        background: "rgba(46,139,87,0.07)",
                        borderColor: "rgba(46,139,87,0.18)",
                        color: "var(--color-primary-700)",
                      }}
                    >
                      <AnimatePresence mode="wait">
                        {sheetOpen
                          ? <motion.span key="x"
                            initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                            animate={{ rotate: 0, opacity: 1, scale: 1 }}
                            exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                            transition={{ type: "spring", stiffness: 300, damping: 22 }}>
                            <X className="w-4 h-4" />
                          </motion.span>
                          : <motion.span key="m"
                            initial={{ rotate: 90, opacity: 0, scale: 0.6 }}
                            animate={{ rotate: 0, opacity: 1, scale: 1 }}
                            exit={{ rotate: -90, opacity: 0, scale: 0.6 }}
                            transition={{ type: "spring", stiffness: 300, damping: 22 }}>
                            <Menu className="w-4 h-4" />
                          </motion.span>
                        }
                      </AnimatePresence>
                    </button>
                  </SheetTrigger>

                  {/* forceMount = Framer Motion owns enter/exit, not Shadcn CSS */}
                  <SheetContent
                    forceMount
                    side="left"
                    /* disable Shadcn's built-in slide animation */
                    className="flex flex-col p-0 border-r
                      data-[state=open]:animate-none
                      data-[state=closed]:animate-none"
                    style={{
                      width: "82%",
                      maxWidth: "320px",
                      top: "68px",
                      height: "calc(100dvh - 68px - 72px)",
                      borderRadius: "0 1.25rem 1.25rem 0",
                      background: "var(--color-surface)",
                      borderColor: "var(--color-border)",
                      boxShadow: "8px 0 32px rgba(10,61,43,0.12)",
                      /* hide it when closed — Framer Motion handles visibility */
                      display: sheetOpen ? undefined : "none",
                    }}
                  >
                    {/* ── Framer Motion spring slide-in ── */}
                    <AnimatePresence>
                      {sheetOpen && (
                        <motion.div
                          key="sheet-inner"
                          initial={{ x: "-100%", opacity: 0 }}
                          animate={{ x: "0%", opacity: 1 }}
                          exit={{ x: "-100%", opacity: 0 }}
                          transition={{ type: "spring", stiffness: 280, damping: 28, mass: 0.8 }}
                          className="flex flex-col h-full"
                        >
                          {/* Header */}
                          <SheetHeader className="px-5 pt-5 pb-4 border-b shrink-0"
                            style={{ borderColor: "var(--color-border)" }}>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-white text-base shadow-md"
                                style={{ background: "linear-gradient(135deg,#155A3E 0%,#0A3D2B 100%)" }}>B</div>
                              <div>
                                <SheetTitle className="font-display text-base font-semibold leading-tight"
                                  style={{ color: "var(--color-primary-900)" }}>BAMHSian</SheetTitle>
                                <p className=" text-[10px] tracking-widest uppercase"
                                  style={{ color: "var(--color-primary-500)" }}>Unity · Prosperity</p>
                              </div>
                            </div>
                          </SheetHeader>

                          {/* Nav links */}
                          <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-green">
                            <p className=" text-[10px] tracking-widest uppercase px-3 mb-3"
                              style={{ color: "var(--color-text-muted)" }}>Navigation</p>
                            <div className="flex flex-col gap-1">
                              {navItems.map(({ title, link, icon }, idx) => {
                                const active = isActive(link);
                                return (
                                  <motion.div key={idx}
                                    initial={{ x: -16, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.04 + idx * 0.035, type: "spring", stiffness: 300, damping: 28 }}
                                  >
                                    <Link href={`/${link}`}
                                      onClick={() => setSheetOpen(false)}
                                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200"
                                      style={{
                                        background: active ? "linear-gradient(135deg,rgba(46,139,87,0.11) 0%,rgba(126,158,37,0.07) 100%)" : "transparent",
                                        border: active ? "1px solid rgba(46,139,87,0.22)" : "1px solid transparent",
                                        color: active ? "var(--color-primary-700)" : "var(--color-text-secondary)",
                                      }}>
                                      <span className="text-lg w-6 flex items-center justify-center"
                                        style={{ color: active ? "var(--color-primary-600)" : "var(--color-text-muted)" }}>
                                        {icon}
                                      </span>
                                      <span className=" text-sm font-medium">{title}</span>
                                      {active && (
                                        <motion.span layoutId="sheetDot"
                                          className="ml-auto w-1.5 h-1.5 rounded-full shrink-0"
                                          style={{ background: "var(--color-primary-500)" }} />
                                      )}
                                    </Link>
                                  </motion.div>
                                );
                              })}
                            </div>
                          </nav>

                          {/* Footer CTA */}
                          <div className="px-4 py-4 border-t shrink-0"
                            style={{ borderColor: "var(--color-border)" }}>
                            {isLoggedIn ? (
                              <UserMenu size="md" align="start" />
                            ) : (
                              <PrimaryButton type="button" title="Sign In" href="/login" isFullWidth={true} />
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </SheetContent>
                </Sheet>

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow"
                    style={{ background: "linear-gradient(135deg,#155A3E 0%,#0A3D2B 100%)" }}>B</div>
                  <span className="font-serif italic text-sm font-semibold"
                    style={{ color: "var(--color-primary-900)" }}>BAMHSian</span>
                </Link>
              </div>

              {/* Right: User avatar or Login */}
              {isLoggedIn
                ? <UserMenu size="sm" align="end" />
                : <PrimaryButton type="button" title="Sign In" href="/login" />}
            </div>
          </motion.div>
        </div>


        {/* ══════════════════════════════════════════════
            MOBILE — Bottom Icon Dock
        ══════════════════════════════════════════════ */}
        <div className="md:hidden fixed bottom-2 left-0 right-0 px-2 pointer-events-auto">
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 26, delay: 0.18 }}
          >
            <div className="shim glow relative flex items-center justify-around px-2 py-2 rounded-lg border"
              style={{
                ...islandBase,
                boxShadow: "0 -4px 20px rgba(10,61,43,0.10), 0 8px 24px rgba(10,61,43,0.08), 0 1px 0 rgba(255,255,255,0.95) inset",
              }}>
              <div className="absolute top-0 left-4 right-4 h-px rounded-full z-10"
                style={{ background: "rgba(255,255,255,0.98)" }} />
              <div className="absolute bottom-0 left-6 right-6 h-px rounded-full"
                style={{ background: "rgba(46,139,87,0.18)" }} />

              {navItems.map(({ icon, link }, idx) => {
                const active = isActive(link);
                return (
                  <Link key={idx} href={`/${link}`}
                    className="relative flex flex-col items-center px-2 py-1 rounded-xl transition-all duration-200"
                    style={{ minWidth: "36px" }}
                  >
                    {active && (
                      <motion.span layoutId="dockBg"
                        className="absolute inset-0 rounded-md border"
                        style={{
                          background: "linear-gradient(135deg,rgba(46,139,87,0.13) 0%,rgba(126,158,37,0.08) 100%)",
                          borderColor: "rgba(46,139,87,0.26)",
                        }}
                        transition={{ type: "spring", stiffness: 340, damping: 34 }} />
                    )}
                    <motion.span
                      animate={{ scale: active ? 1.2 : 1, y: active ? -1 : 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 28 }}
                      className="relative z-10 text-xl leading-none"
                      style={{ color: active ? "var(--color-primary-600)" : "var(--color-text-muted)" }}>
                      {icon}
                    </motion.span>
                    <AnimatePresence>
                      {active && (
                        <motion.span key="lbl"
                          initial={{ opacity: 0, height: 0, y: 4 }}
                          animate={{ opacity: 1, height: "auto", y: 0 }}
                          exit={{ opacity: 0, height: 0, y: 4 }}
                          transition={{ duration: 0.22, ease: "easeOut" }}
                          className="relative z-10  font-semibold overflow-hidden whitespace-nowrap"
                          style={{ fontSize: "9px", letterSpacing: "0.04em", color: "var(--color-primary-700)", marginTop: "2px" }}>
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {active && (
                      <motion.span layoutId="dockDot"
                        className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                        style={{ background: "var(--color-primary-500)", boxShadow: "0 0 6px 2px rgba(46,139,87,0.50)" }}
                        transition={{ type: "spring", stiffness: 340, damping: 34 }} />
                    )}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </div>

      </div>
    </>
  );
};

export default Navbar;