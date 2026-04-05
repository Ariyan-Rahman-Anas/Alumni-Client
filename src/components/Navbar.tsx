// "use client"

// import { AiOutlineHome } from "react-icons/ai";
// import { TiInfoLarge } from "react-icons/ti";
// import { MdDashboard, MdOutlinePhoneInTalk } from "react-icons/md";
// import { IoBriefcaseOutline } from "react-icons/io5";
// import { RiServiceLine } from "react-icons/ri";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { motion, AnimatePresence } from "framer-motion";
// import { useState } from "react";

// const Navbar = () => {
//   const pathname = usePathname();
//   const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

//   const baseNavItems = [
//     { title: "Home", link: "", icon: <AiOutlineHome /> },
//     { title: "About", link: "about", icon: <TiInfoLarge /> },
//     { title: "Gallery", link: "gallery", icon: <IoBriefcaseOutline /> },
//     { title: "Events", link: "events", icon: <RiServiceLine /> },
//     { title: "Announcements", link: "announcements", icon: <MdOutlinePhoneInTalk /> },
//     { title: "Batches", link: "batches", icon: <MdOutlinePhoneInTalk /> },
//     { title: "Blood Bank", link: "bloodbank", icon: <MdOutlinePhoneInTalk /> },
//     { title: "Request to Alumni", link: "request", icon: <MdOutlinePhoneInTalk /> },
//   ];

//   const devNavItems = [
//     { title: "Dash", link: "arapdash/dashboard", icon: <MdDashboard /> },
//   ];

//   const navItems = process.env.NODE_ENV === "development"
//     ? [...baseNavItems, ...devNavItems]
//     : baseNavItems;

//   const isActive = (link: string) => {
//     if (link === "") return pathname === "/";
//     return pathname.startsWith(`/${link}`);
//   };

//   return (
//     <div className="fixed top-0 left-0 right-0 z-[1000] pointer-events-none">

//       {/* ═══════════════ DESKTOP — Floating Island ═══════════════ */}
//       <div className="hidden md:flex justify-center pt-5 pointer-events-auto">
//         <motion.div
//           initial={{ y: -80, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ type: "spring", stiffness: 200, damping: 22, delay: 0.1 }}
//           className="relative flex items-center justify-between w-full"
//         >
//           {/* Outer glow ring */}
//           <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-brand/40 via-transparent to-accent/40 blur-sm" />

//           {/* Logo mark */}
//           <Link href="/" className="group flex items-center gap-2 px-3 py-1.5 mr-2">
//             <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand to-accent flex items-center justify-center text-white text-xs font-bold shadow-brand-sm">
//               B
//             </div>
//             <span className="text-white font-semibold text-sm tracking-tight">
//               BAMHS<span className="text-brand-light font-mono text-xs">.org</span>
//             </span>
//           </Link>

//           {/* Island body */}
//           <div className="relative flex items-center gap-1 px-2 py-2 rounded-2xl bg-[#060d1f]/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">



//             {/* Divider */}
//             <div className="w-px h-6 bg-white/10 mr-2" />

//             {/* Nav items */}
//             {navItems.map(({ title, icon, link }, index) => {
//               const active = isActive(link);
//               const hovered = hoveredIndex === index;

//               return (
//                 <Link
//                   key={index}
//                   href={`/${link}`}
//                   onMouseEnter={() => setHoveredIndex(index)}
//                   onMouseLeave={() => setHoveredIndex(null)}
//                   className="relative"
//                 >
//                   {/* Hover bg */}
//                   <AnimatePresence>
//                     {hovered && !active && (
//                       <motion.span
//                         layoutId="hoverBg"
//                         initial={{ opacity: 0, scale: 0.9 }}
//                         animate={{ opacity: 1, scale: 1 }}
//                         exit={{ opacity: 0, scale: 0.9 }}
//                         transition={{ duration: 0.15 }}
//                         className="absolute inset-0 rounded-xl bg-white/6"
//                       />
//                     )}
//                   </AnimatePresence>

//                   {/* Active bg */}
//                   {active && (
//                     <motion.span
//                       layoutId="activeBg"
//                       className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand/20 to-accent/20 border border-brand/20"
//                       transition={{ type: "spring", stiffness: 300, damping: 30 }}
//                     />
//                   )}

//                   <span className={`relative z-10 flex items-center gap-2 px-3 py-1.5 transition-colors duration-200 ${active ? "text-white" : "text-gray-400 hover:text-gray-200"}`}>
//                     {/* Icon */}
//                     <motion.span
//                       animate={{
//                         scale: hovered || active ? 1.2 : 1,
//                         color: active ? "#60a5fa" : hovered ? "#e2e8f0" : "#9ca3af",
//                       }}
//                       transition={{ duration: 0.15 }}
//                       className="text-base leading-none"
//                     >
//                       {icon}
//                     </motion.span>

//                     {/* Text — slides in on hover or always shown when active */}
//                     <AnimatePresence mode="wait">
//                       {(hovered || active) && (
//                         <motion.span
//                           key={title}
//                           initial={{ opacity: 0, width: 0, x: -4 }}
//                           animate={{ opacity: 1, width: "auto", x: 0 }}
//                           exit={{ opacity: 0, width: 0, x: -4 }}
//                           transition={{ duration: 0.2, ease: "easeOut" }}
//                           className="text-xs font-medium tracking-wide overflow-hidden whitespace-nowrap"
//                         >
//                           {title}
//                         </motion.span>
//                       )}
//                     </AnimatePresence>
//                   </span>

//                   {/* Active bottom dot */}
//                   {active && (
//                     <motion.span
//                       layoutId="activeDot"
//                       className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand"
//                       transition={{ type: "spring", stiffness: 300, damping: 30 }}
//                     />
//                   )}
//                 </Link>
//               );
//             })}
//           </div>

//           <p className="text-red-500">123</p>
//         </motion.div>
//       </div>

//       {/* ═══════════════ MOBILE — Bottom dock ═══════════════ */}
//       <div className="md:hidden pointer-events-auto">
//         <motion.ul
//           initial={{ y: 100, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ type: "spring", stiffness: 200, damping: 22, delay: 0.2 }}
//           className="fixed bottom-1 left-0 right-0 z-10 w-[95%] mx-auto flex items-center justify-around px-2 py-1 rounded-2xl bg[#060d1f] backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
//         >
//           {/* Outer glow ring — same as desktop */}
//           <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-brand/40 via-transparent to-accent/40 blur-sm -z-10" />

//           {navItems.map(({ icon, link, title }, index) => {
//             const active = isActive(link);
//             return (
//               <li key={index}>
//                 <Link
//                   href={`/${link}`}
//                   className={`relative flex flex-col items-center px-2 py-1 rounded-sm transition-all duration-300 ${active ? "text-brand-light" : "text-gray-400"
//                     }`}
//                 >
//                   {active && (
//                     <motion.span
//                       layoutId="mobileActiveBg"
//                       className="absolute inset-0 rounded-lg bg-brand/10 border border-brand/20"
//                       transition={{ type: "spring", stiffness: 300, damping: 30 }}
//                     />
//                   )}
//                   <span className={`relative text-xl transition-all duration-300 ${active ? "scale-110" : ""}`}>
//                     {icon}
//                   </span>
//                   <span className={`relative text-[10px] mt-0.5 font-medium transition-all duration-300 ${active ? "opacity-100 text-white" : "opacity-0"}`}>
//                     {title}
//                   </span>
//                 </Link>
//               </li>
//             );
//           })}
//         </motion.ul>
//       </div>

//     </div>
//   );
// };

// export default Navbar;




















"use client";

import { AiOutlineHome } from "react-icons/ai";
import { TiInfoLarge } from "react-icons/ti";
import {
  MdDashboard,
  MdOutlineCampaign,
  MdOutlineBloodtype,
} from "react-icons/md";
import { IoBriefcaseOutline } from "react-icons/io5";
import { RiCalendarEventLine, RiGroupLine } from "react-icons/ri";
import { HiOutlineHandRaised } from "react-icons/hi2";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

/* ── Nav Items ─────────────────────────────────────────────── */
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

/* ── Component ─────────────────────────────────────────────── */
const Navbar = () => {
  const pathname = usePathname();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const navItems =
    process.env.NODE_ENV === "development"
      ? [...baseNavItems, ...devNavItems]
      : baseNavItems;

  const isActive = (link: string) => {
    if (link === "") return pathname === "/";
    return pathname.startsWith(`/${link}`);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-nav pointer-events-none">

      {/* ════════════════ DESKTOP — Floating Island ════════════════ */}
      <div className="hidden md:flex justify-center pt-4 pointer-events-auto px-6">
        <motion.div
          initial={{ y: -72, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 24, delay: 0.08 }}
          className="w-full max-w-6xl flex items-center justify-between"
        >

          {/* ── Logo ── */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 shrink-0"
          >
            {/* Emblem */}
            <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-lg"
              style={{ background: "linear-gradient(135deg, #155A3E 0%, #0A3D2B 100%)" }}
            >
              {/* leaf accent */}
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full opacity-30"
                style={{ background: "var(--color-primary-300)" }} />
              <span className="absolute inset-0 flex items-center justify-center font-display font-bold text-white text-sm">
                B
              </span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-semibold text-sm tracking-tight"
                style={{ color: "var(--color-primary-900)" }}>
                BAMHS
              </span>
              <span className="font-mono text-[10px] tracking-widest uppercase"
                style={{ color: "var(--color-primary-500)" }}>
                Est. 1966
              </span>
            </div>
          </Link>

          {/* ── Island Body ── */}
          <div
            className="relative flex items-center gap-0.5 px-2 py-1.5 rounded-2xl border"
            style={{
              background: "rgba(253, 250, 242, 0.82)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              borderColor: "rgba(46, 139, 87, 0.18)",
              boxShadow:
                "0 4px 24px rgba(10,61,43,0.10), 0 1px 0 rgba(255,255,255,0.8) inset",
            }}
          >
            {/* top gloss line */}
            <div
              className="absolute top-0 left-4 right-4 h-px rounded-full"
              style={{ background: "rgba(255,255,255,0.9)" }}
            />

            {navItems.map(({ title, icon, link }, index) => {
              const active = isActive(link);
              const hovered = hoveredIndex === index;

              return (
                <Link
                  key={index}
                  href={`/${link}`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="relative"
                >
                  {/* Hover bg */}
                  <AnimatePresence>
                    {hovered && !active && (
                      <motion.span
                        layoutId="hoverBg"
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.92 }}
                        transition={{ duration: 0.14 }}
                        className="absolute inset-0 rounded-xl"
                        style={{ background: "rgba(46,139,87,0.07)" }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Active bg */}
                  {active && (
                    <motion.span
                      layoutId="activeBg"
                      className="absolute inset-0 rounded-xl border"
                      style={{
                        background: "linear-gradient(135deg, rgba(46,139,87,0.12) 0%, rgba(126,158,37,0.08) 100%)",
                        borderColor: "rgba(46,139,87,0.25)",
                      }}
                      transition={{ type: "spring", stiffness: 320, damping: 32 }}
                    />
                  )}

                  <span
                    className="relative z-10 flex items-center gap-1.5 px-3 py-1.5 transition-colors duration-200"
                    style={{
                      color: active
                        ? "var(--color-primary-700)"
                        : hovered
                          ? "var(--color-primary-600)"
                          : "var(--color-text-secondary)",
                    }}
                  >
                    {/* Icon */}
                    <motion.span
                      animate={{ scale: hovered || active ? 1.18 : 1 }}
                      transition={{ duration: 0.14 }}
                      className="text-base leading-none"
                    >
                      {icon}
                    </motion.span>

                    {/* Label — slides in on hover / always shown when active */}
                    <AnimatePresence mode="wait">
                      {(hovered || active) && (
                        <motion.span
                          key={title}
                          initial={{ opacity: 0, width: 0, x: -4 }}
                          animate={{ opacity: 1, width: "auto", x: 0 }}
                          exit={{ opacity: 0, width: 0, x: -4 }}
                          transition={{ duration: 0.18, ease: "easeOut" }}
                          className="font-sans text-xs font-medium tracking-wide overflow-hidden whitespace-nowrap"
                        >
                          {title}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>

                  {/* Active indicator dot */}
                  {active && (
                    <motion.span
                      layoutId="activeDot"
                      className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ background: "var(--color-primary-500)" }}
                      transition={{ type: "spring", stiffness: 320, damping: 32 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* ── Login CTA ── */}
          <Link
            href="/login"
            className="btn btn-primary btn-sm shrink-0 shadow-md"
          >
            Portal Login
          </Link>
        </motion.div>
      </div>

      {/* ════════════════ MOBILE — Bottom Dock ════════════════ */}
      <div className="md:hidden pointer-events-auto">
        <motion.nav
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 24, delay: 0.15 }}
          className="fixed bottom-2 left-0 right-0 z-nav w-[94%] mx-auto"
        >
          <div
            className="relative flex items-center justify-around px-1 py-1 rounded-2xl border"
            style={{
              background: "rgba(253, 250, 242, 0.88)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderColor: "rgba(46,139,87,0.18)",
              boxShadow:
                "0 8px 32px rgba(10,61,43,0.14), 0 1px 0 rgba(255,255,255,0.9) inset",
            }}
          >
            {/* gloss */}
            <div
              className="absolute top-0 left-6 right-6 h-px rounded-full"
              style={{ background: "rgba(255,255,255,0.95)" }}
            />

            {navItems.map(({ icon, link, title }, index) => {
              const active = isActive(link);
              return (
                <Link
                  key={index}
                  href={`/${link}`}
                  className="relative flex flex-col items-center px-2 py-1.5 rounded-xl transition-all duration-200"
                >
                  {active && (
                    <motion.span
                      layoutId="mobileActiveBg"
                      className="absolute inset-0 rounded-xl border"
                      style={{
                        background: "rgba(46,139,87,0.10)",
                        borderColor: "rgba(46,139,87,0.22)",
                      }}
                      transition={{ type: "spring", stiffness: 320, damping: 32 }}
                    />
                  )}
                  <span
                    className="relative text-xl transition-all duration-200"
                    style={{
                      color: active
                        ? "var(--color-primary-600)"
                        : "var(--color-text-muted)",
                      transform: active ? "scale(1.12)" : "scale(1)",
                    }}
                  >
                    {icon}
                  </span>
                  <motion.span
                    animate={{
                      opacity: active ? 1 : 0,
                      height: active ? "14px" : "0px",
                    }}
                    transition={{ duration: 0.18 }}
                    className="relative font-sans text-[10px] font-medium overflow-hidden whitespace-nowrap"
                    style={{ color: "var(--color-primary-700)" }}
                  >
                    {title}
                  </motion.span>
                </Link>
              );
            })}
          </div>
        </motion.nav>
      </div>
    </div>
  );
};

export default Navbar;