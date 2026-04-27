"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  RiMapPin2Line,
  RiPhoneLine,
  RiMailLine,
  RiFacebookBoxLine,
  RiYoutubeLine,
  RiWhatsappLine,
} from "react-icons/ri";
import { HiArrowUpRight } from "react-icons/hi2";

/* ── Data ──────────────────────────────────────────────────── */
const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Events", href: "/events" },
  { label: "Announcements", href: "/announcements" },
  { label: "Batches", href: "/batches" },
];

const communityLinks = [
  { label: "Blood Bank", href: "/bloodbank" },
  { label: "Alumni Request", href: "/request" },
  { label: "Alumni Portal", href: "/login" },
  { label: "Alumni Directory", href: "/batches" },
];

const contactInfo = [
  {
    icon: <RiMapPin2Line className="text-base shrink-0 mt-0.5" />,
    text: "Battali Bazar, Nangalkot, Cumilla, Chattogram, Bangladesh",
  },
  {
    icon: <RiPhoneLine className="text-base shrink-0" />,
    text: "+880 XXX XXXXXXX",
  },
  {
    icon: <RiMailLine className="text-base shrink-0" />,
    text: "info@bamhs.edu.bd",
  },
];

const socials = [
  { icon: <RiFacebookBoxLine />, href: "#", label: "Facebook" },
  { icon: <RiYoutubeLine />, href: "#", label: "YouTube" },
  { icon: <RiWhatsappLine />, href: "#", label: "WhatsApp" },
];

/* ── Helper ────────────────────────────────────────────────── */
const FooterHeading = ({ children }: { children: React.ReactNode }) => (
  <h3
    className="font-display font-semibold text-base mb-5 flex items-center gap-3"
    style={{ color: "var(--color-primary-100)" }}
  >
    <span
      className="w-5 h-[2px] rounded-full"
      style={{ background: "linear-gradient(90deg, #4ade80, #f59e0b)" }}
    />
    {children}
  </h3>
);

/* ── Component ─────────────────────────────────────────────── */
const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative overflow-hidden rounded-t-pill md:rounded-t-circle"
      style={{
        background: "linear-gradient(180deg, #0A3D2B 0%, #051F15 100%)",
      }}
    >
      {/* ── Decorative grid overlay ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(74,222,128,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(74,222,128,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* ══════════════════════════════════════════════════════
          SCHOOL NAME HERO BAND
      ══════════════════════════════════════════════════════ */}
      <div className="relative py-12 px-3 text-center">
        {/* Emblem */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex justify-center mb-5"
        >
          <div
            className="w-18 h-18 rounded-2xl flex items-center justify-center relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #257048 0%, #0A3D2B 100%)",
              border: "1px solid rgba(74,222,128,0.30)",
              boxShadow:
                "0 0 40px rgba(46,139,87,0.40), 0 0 80px rgba(46,139,87,0.15), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
          >
            <div
              className="absolute -top-2 -right-2 w-10 h-10 rounded-full opacity-20"
              style={{ background: "var(--color-primary-300)" }}
            />
            <span
              className="font-display font-bold text-3xl relative z-10"
              style={{
                color: "var(--color-primary-100)",
                textShadow: "0 0 20px rgba(74,222,128,0.5)",
              }}
            >
              B
            </span>
          </div>
        </motion.div>

        <motion.h2
          initial={{ y: 10, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display font-bold text-2xl md:text-4xl mb-2 tracking-tight"
          style={{
            background: "linear-gradient(160deg, #f0fdf4 20%, #86efac 60%, #d1fae5 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 2px 16px rgba(46,139,87,0.4))",
          }}
        >
          <span className="text-xl" >Alumni Association of</span> <br />
          Battali Abdul Matin High School
        </motion.h2>

        <motion.p
          initial={{ y: 8, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className=" text-xs tracking-[0.22em] mb-4 text-primary2-400 "
        // style={{ color: "rgba(134,239,172,0.55)" }}
        >
          3582 - Battali, Nangalkot, Cumilla, Bangladesh
        </motion.p>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.28 }}
          className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mx-auto"
          style={{
            background: "rgba(46,139,87,0.10)",
            border: "1px solid rgba(46,139,87,0.20)",
          }}
        >
          <span
            className="w-1 h-1 rounded-full"
            style={{ background: "#f59e0b" }}
          />
          <p
            className="font-serif italic text-sm"
            style={{ color: "rgba(167,243,208,0.80)" }}
          >
            &quot;Where roots run deep, and bonds last forever&quot;
          </p>
          <span
            className="w-1 h-1 rounded-full"
            style={{ background: "#f59e0b" }}
          />
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35 }}
          className="flex justify-center gap-3 mt-6"
        >
          {socials.map(({ icon, href, label }) => (
            <Link
              key={label}
              href={href}
              aria-label={label}
              className="flex items-center justify-center w-10 h-10 rounded-xl border text-lg transition-all duration-300 hover:-translate-y-1"
              style={{
                borderColor: "rgba(46,139,87,0.25)",
                color: "rgba(134,239,172,0.65)",
                background: "rgba(46,139,87,0.08)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(74,222,128,0.55)";
                (e.currentTarget as HTMLElement).style.color = "#f0fdf4";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 16px rgba(46,139,87,0.40), inset 0 1px 0 rgba(255,255,255,0.08)";
                (e.currentTarget as HTMLElement).style.background = "rgba(46,139,87,0.18)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(46,139,87,0.25)";
                (e.currentTarget as HTMLElement).style.color = "rgba(134,239,172,0.65)";
                (e.currentTarget as HTMLElement).style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.05)";
                (e.currentTarget as HTMLElement).style.background = "rgba(46,139,87,0.08)";
              }}
            >
              {icon}
            </Link>
          ))}
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════════
          MAIN GRID
      ══════════════════════════════════════════════════════ */}
      <div className="relative pb-8 pt-0 three-xl-section-setup">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* ── Col 1 — About ── */}
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
          >
            <FooterHeading>About BAMHS Alumni</FooterHeading>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "rgba(167,243,208,0.65)" }}
            >
              Connected by shared memories, united by BAMHS. Our alumni
              association keeps the bonds strong across all batches — celebrating
              our roots, supporting each other, and giving back to the
              institution that shaped us.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 mt-5 text-xs font-semibold tracking-wide uppercase transition-all duration-200 hover:gap-2.5"
              style={{ color: "rgba(74,222,128,0.80)" }}
            >
              Learn our story <HiArrowUpRight className="text-sm" />
            </Link>
          </motion.div>

          {/* ── Col 2 — Quick Links ── */}
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.10 }}
          >
            <FooterHeading>Quick Links</FooterHeading>
            <ul className="flex flex-col gap-2">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="group text-sm flex items-center gap-2.5 py-0.5 transition-all duration-200"
                    style={{ color: "rgba(167,243,208,0.60)" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "#f0fdf4";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "rgba(167,243,208,0.60)";
                    }}
                  >
                    <span
                      className="w-1 h-1 rounded-full flex-shrink-0 transition-all duration-300 group-hover:w-3"
                      style={{ background: "linear-gradient(90deg, #4ade80, #16a34a)" }}
                    />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ── Col 3 — Community ── */}
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            <FooterHeading>Community</FooterHeading>
            <ul className="flex flex-col gap-2">
              {communityLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="group text-sm flex items-center gap-2.5 py-0.5 transition-all duration-200"
                    style={{ color: "rgba(167,243,208,0.60)" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "#fef3c7";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "rgba(167,243,208,0.60)";
                    }}
                  >
                    <span
                      className="w-1 h-1 rounded-full flex-shrink-0 transition-all duration-300 group-hover:w-3"
                      style={{ background: "linear-gradient(90deg, #f59e0b, #d97706)" }}
                    />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ── Col 4 — Contact ── */}
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.20 }}
          >
            <FooterHeading>Contact</FooterHeading>
            <ul className="flex flex-col gap-4">
              {contactInfo.map(({ icon, text }) => (
                <li key={text} className="flex items-start gap-3 group">
                  <span
                    className="mt-0.5 p-1.5 rounded-lg flex-shrink-0"
                    style={{
                      color: "rgba(74,222,128,0.70)",
                      background: "rgba(46,139,87,0.12)",
                      border: "1px solid rgba(46,139,87,0.20)",
                    }}
                  >
                    {icon}
                  </span>
                  <span
                    className="text-sm leading-snug"
                    style={{ color: "rgba(167,243,208,0.65)" }}
                  >
                    {text}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          BOTTOM BAR
      ══════════════════════════════════════════════════════ */}
      <div
        className="relative border-t"
        style={{ borderColor: "rgba(46,139,87,0.15)" }}
      >
        {/* Gold accent stripe */}
        <div
          className="absolute -top-px left-1/2 -translate-x-1/2 w-40 h-[2px] rounded-full"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.70), transparent)",
          }}
        />

        <div className="page-setup py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" style={{ color: "rgba(134,239,172,0.50)" }}>
          {/* Copyright */}
          <p>
            © {year} BAMHS Alumni Association. All rights reserved.
          </p>

          {/* Developer credit — inline, professional */}
          <Link
            href="https://ariyanrahmananas.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 transition-colors duration-200"
            style={{ color: "rgba(134,239,172,0.50)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(134,239,172,0.90)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(134,239,172,0.50)"; }}
          >
            <span>Designed &amp; developed by</span>
            <span
              className="font-semibold"
              style={{ color: "rgba(134,239,172,0.75)" }}
            >
              Ariyan Rahman Anas
            </span>
            <HiArrowUpRight className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </Link>

          {/* Legal links */}
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="transition-colors duration-200 hover:text-emerald-300"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="transition-colors duration-200 hover:text-emerald-300"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>

      {/* mobile safe-area pad */}
      <div className="md:hidden h-20" />
    </footer>
  );
};
export default Footer;