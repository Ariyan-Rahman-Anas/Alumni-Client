"use client";

import { AiOutlineHome } from "react-icons/ai";
import { TiInfoLarge } from "react-icons/ti";
import { MdOutlineCampaign, MdOutlineBloodtype } from "react-icons/md";
import { RiBriefcaseLine, RiCalendarEventLine, RiGalleryLine, RiGroupLine } from "react-icons/ri";
import { HiOutlineHandRaised } from "react-icons/hi2";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "./ui/sheet";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useSelector } from "react-redux";
import PrimaryButton from "./shared/PrimaryButton";
import UserMenu from "./shared/UserMenu";
import { selectIsLoggedIn } from "@/redux/slice/authSlice";
import { cn } from "@/lib/utils";

//  NAV ITEMS
const navItems = [
  { title: "Home", link: "", icon: <AiOutlineHome /> },
  { title: "About", link: "about", icon: <TiInfoLarge /> },
  { title: "Gallery", link: "gallery", icon: <RiGalleryLine /> },
  { title: "Events", link: "events", icon: <RiCalendarEventLine /> },
  { title: "Announcements", link: "announcements", icon: <MdOutlineCampaign /> },
  { title: "Batches", link: "batches", icon: <RiGroupLine /> },
  { title: "Blood Bank", link: "bloodbank", icon: <MdOutlineBloodtype /> },
  { title: "Request To Admin", link: "request", icon: <HiOutlineHandRaised /> },
  { title: "Jobs", link: "jobs", icon: <RiBriefcaseLine /> },

];

const Navbar = () => {
  const pathname = usePathname();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const isActive = (link: string) =>
    link === "" ? pathname === "/" : pathname.startsWith(`/${link}`);

  const isLoggedIn = useSelector(selectIsLoggedIn);

  // Defer auth-dependent rendering until after hydration.
  // Server always has isLoggedIn=false (no Redux state); rendering
  // UserMenu vs Login button conditionally on server causes a hydration
  // mismatch. Mounting null first makes both server and client agree.
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const { resolvedTheme, setTheme } = useTheme();
  const toggleTheme = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-nav pointer-events-none">

        {/* ══════════════════════════════════════════════DESKTOP*/}
        <div className="hidden md:flex justify-between pt-4 pointer-events-auto px-6 max-w-12xl mx-auto">
          <motion.div
            initial={{ y: -72, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 24, delay: 0.08 }}
          >
            <Link href="/" className="flex items-center shrink-0 group">
              {/* Logo pill — matches nav island style */}
              <div
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-full 2xl shadow relative bg-white dark:bg-gunmetal-600 ">
                {/* Emblem */}
                <div
                  className="relative w-7 h-7 rounded-full lg overflow-hidden shrink-0 bg-primary2-700 dark:bg-gunmetal-700 ">
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full opacity-30 bg-primary2-500 dark:bg-gunmetal-300 " />
                  <span className="absolute inset-0 flex items-center justify-center font-display font-bold text-white dark:text-gunmetal-200">
                    B
                  </span>
                </div>

                {/* Divider */}
                <div className="w-px h-6 shrink-0 bg-primary2-500 dark:bg-gunmetal-200" />

                {/* Text */}
                <span className="font-serif italic font-semibold text-sm tracking-tight text-primary2-500 dark:text-gunmetal-200">
                  BAMHSian...
                </span>
              </div>
            </Link>
          </motion.div>

          {/* ── Nav island  */}
          <motion.div
            initial={{ y: -72, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 24, delay: 0.08 }}
            className="relative flex items-center gap-0.5 px-2 py-1.5 rounded-full shadow shadow-primary2-500 dark:shadow-gunmetal-400 bg-white dark:bg-gunmetal-600 dark:text-gunmetal-200 "
          >

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
                        className="absolute inset-0 rounded-xl bg-primary2-50 dark:bg-gunmetal-500"
                      />
                    )}
                  </AnimatePresence>
                  {active && (
                    <motion.span layoutId="deskActive"
                      className={cn("absolute inset-0 rounded-xl border border-primary2-500 dark:border-gunmetal-200", active && "bg-primary2-50 dark:bg-gunmetal-500")}
                      transition={{ type: "spring", stiffness: 320, damping: 32 }} />
                  )}
                  <span
                    className={cn("relative z-10 flex items-center gap-1.5 px-3 py-1.5 transition-colors duration-200 text-primary2-700 dark:text-gunmetal-300", active && "text-primary2-500 dark:text-gunmetal-200")}
                  >
                    <motion.span animate={{ scale: isHover || active ? 1.2 : 1 }}
                      transition={{ duration: 0.13 }} className="text-base leading-none ">
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
                      className={cn("absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full", active && "bg-primary2-500 dark:bg-gunmetal-200")}
                      transition={{ type: "spring", stiffness: 320, damping: 32 }} />
                  )}
                </Link>
              );
            })}
          </motion.div>


          {/* ── Theme toggle + Login / User Avatar  */}
          <motion.div
            initial={{ y: -72, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 24, delay: 0.08 }}
            className="flex items-center gap-2"
          >
            {mounted && (
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="flex items-center justify-center w-9 h-9 rounded-full shadow bg-white dark:bg-gunmetal-600 text-primary2-700 dark:text-gunmetal-200 hover:bg-primary2-50 dark:hover:bg-gunmetal-500 transition-colors"
              >
                {resolvedTheme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}
            {mounted && (isLoggedIn
              ? <UserMenu size="md" align="end" />
              : <PrimaryButton type="button" title="Sign In" href="/login" />)}
          </motion.div>
        </div>


        {/* MOBILE — Top Header Island */}
        <div className="md:hidden fixed top-3 left-0 right-0 px-4 pointer-events-auto">
          <motion.div
            initial={{ y: -56, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 26, delay: 0.05 }}
          >
            <div className="relative flex items-center justify-between px-3 py-1.5 rounded-lg shadow bg-primary2-50 dark:bg-gunmetal-500/80 backdrop-blur-sm border-primary2-200 dark:border-gunmetal-400 pointer-events-auto">

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
                      className="relative p-2 rounded-full shadow transition-all duration-200 active:scale-95">
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
                      data-[state=closed]:animate-none dark:bg-gunmetal-500"
                    style={{
                      width: "82%",
                      maxWidth: "320px",
                      top: "68px",
                      height: "calc(100dvh - 68px - 72px)",
                      borderRadius: "0 1.25rem 1.25rem 0",
                      // background: "var(--color-surface)",
                      // borderColor: "var(--color-border)",
                      // boxShadow: "8px 0 32px rgba(10,61,43,0.12)",
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
                          // style={{ borderColor: "var(--color-border)" }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-white text-base shadow-md"
                                style={{ background: "linear-gradient(135deg,#155A3E 0%,#0A3D2B 100%)" }}
                              >B</div>
                              <div>
                                <SheetTitle className="font-display text-base font-semibold leading-tight"
                                // style={{ color: "var(--color-primary-900)" }}
                                >BAMHSian...</SheetTitle>
                                <p className=" text-[10px] tracking-widest uppercase"
                                // style={{ color: "var(--color-primary-500)" }}
                                >Unity · Prosperity</p>
                              </div>
                            </div>
                          </SheetHeader>

                          {/* Nav links */}
                          <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-green">
                            <p className=" text-[10px] tracking-widest uppercase px-3 mb-3">Navigation</p>
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
                                        className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all border border-transparent dark:text-gunmetal-300 duration-300", active && "text-primary2-500 dark:text-gunmetal-200 border-primary2-500 dark:border-gunmetal-200")}>
                                      <span className="text-lg w-6 flex items-center justify-center">
                                        {icon}
                                      </span>
                                      <span className=" text-sm font-medium">{title}</span>
                                      {active && (
                                        <motion.span layoutId="sheetDot"
                                          className="ml-auto w-1.5 h-1.5 rounded-full shrink-0"
                                        // style={{ background: "var(--color-primary-500)" }}
                                        />
                                      )}
                                    </Link>
                                  </motion.div>
                                );
                              })}
                            </div>
                          </nav>

                          {/* Footer CTA */}
                          <div className="px-4 py-4 border-t shrink-0"
                          // style={{ borderColor: "var(--color-border)" }}
                          >
                            {mounted && (isLoggedIn ? (
                              <UserMenu size="md" align="start" />
                            ) : (
                              <PrimaryButton type="button" title="Sign In" href="/login" isFullWidth={true} />
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </SheetContent>
                </Sheet>

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                  <span className="font-serif italic text-sm font-semibold"
                  >BAMHSian</span>
                </Link>
              </div>

              {/* Right: Theme toggle + User avatar or Login */}
              <div className="flex items-center gap-2">
                {mounted && (
                  <button
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                    className="flex items-center justify-center w-8 h-8 rounded-full shadow bg-white dark:bg-gunmetal-600 text-primary2-700 dark:text-gunmetal-200 hover:bg-primary2-50 dark:hover:bg-gunmetal-500 transition-colors"
                  >
                    {resolvedTheme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                  </button>
                )}
                {mounted && (isLoggedIn
                  ? <UserMenu size="sm" align="end" />
                  : <PrimaryButton type="button" title="Sign In" href="/login" />)}
              </div>
            </div>
          </motion.div>
        </div>


        {/* MOBILE — Bottom Icon Dock */}
        <div className="md:hidden fixed bottom-2 left-0 right-0 px-2 pointer-events-auto">
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 26, delay: 0.18 }}
          >
            <div
              className="relative flex items-center justify-between gap-0.5 px-2 py-2.5 rounded-lg shadow shadow-primary2-500 dark:shadow-gunmetal-400 bg-white dark:bg-gunmetal-600 dark:text-gunmetal-200 "
            >
              <div className="absolute top-0 left-4 right-4 h-px rounded-full z-10"
              // style={{ background: "rgba(255,255,255,0.98)" }}
              />
              <div className="absolute bottom-0 left-6 right-6 h-px rounded-full"
              // style={{ background: "rgba(46,139,87,0.18)" }}
              />

              {navItems.map(({ icon, link }, idx) => {
                const active = isActive(link);
                return (
                  <Link key={idx} href={`/${link}`}
                    className="relative flex flex-col items-center px-2 py-1 rounded-xl transition-all duration-200"
                  // style={{ minWidth: "36px" }}
                  >
                    {active && (
                      <motion.span layoutId="dockBg"
                        className={cn("absolute inset-0 rounded-md border border-primary2-500 dark:border-gunmetal-200", active && "bg-primary2-50 dark:bg-gunmetal-500")}
                        transition={{ type: "spring", stiffness: 340, damping: 34 }} />
                    )}
                    <motion.span
                      animate={{ scale: active ? 1.2 : 1, y: active ? -1 : 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 28 }}
                      className={cn("relative z-10 text-xl leading-none", active ? "text-primary2-500 dark:text-gunmetal-200" : "text-primary2-700 dark:text-gunmetal-300")}
                    // style={{ color: active ? "var(--color-primary-600)" : "var(--color-text-muted)" }}
                    >
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
                        // style={{ fontSize: "9px", letterSpacing: "0.04em", color: "var(--color-primary-700)", marginTop: "2px" }}
                        >
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {active && (
                      <motion.span layoutId="dockDot"
                        className={cn("absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full", active && "bg-primary2-500 dark:bg-gunmetal-200")}
                        transition={{ type: "spring", stiffness: 340, damping: 34 }}
                      />
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