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
  { label: "Student Portal", href: "/login" },
  { label: "Alumni Directory", href: "/batches" },
];

const contactInfo = [
  {
    icon: <RiMapPin2Line className="text-base shrink-0 mt-0.5" />,
    text: "Battali Bajar, Nangalkot, Cumilla, Chattogram, Bangladesh",
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
  <h3 className="font-display font-semibold text-base mb-4 flex items-center gap-2"
    style={{ color: "var(--color-primary-100)" }}>
    {children}
    <span className="flex-1 h-px opacity-20"
      style={{ background: "var(--color-primary-300)" }} />
  </h3>
);

/* ── Component ─────────────────────────────────────────────── */
const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-16 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0A3D2B 0%, #051F15 100%)",
      }}
    >
      {/* ── Background texture ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* grid */}
        <div className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(46,139,87,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(46,139,87,0.06) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* radial glows */}
        <div className="absolute -top-32 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: "var(--color-primary-500)" }} />
        <div className="absolute -bottom-20 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-15"
          style={{ background: "var(--color-accent-500)" }} />
      </div>

      {/* ── Top decorative border ── */}
      <div className="relative h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(46,139,87,0.6) 30%, rgba(126,158,37,0.5) 60%, transparent 100%)",
        }}
      />

      {/* ══════════════════════════════════════════════════════
          SCHOOL NAME HERO BAND
      ══════════════════════════════════════════════════════ */}
      <div className="relative py-10 text-center border-b"
        style={{ borderColor: "rgba(46,139,87,0.15)" }}>

        {/* Emblem */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex justify-center mb-4"
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-2xl"
            style={{
              background: "linear-gradient(135deg, #257048 0%, #0A3D2B 100%)",
              border: "1px solid rgba(46,139,87,0.40)",
              boxShadow: "0 0 32px rgba(46,139,87,0.35)",
            }}
          >
            <div
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full opacity-25"
              style={{ background: "var(--color-primary-300)" }}
            />
            <span
              className="font-display font-bold text-3xl relative z-10"
              style={{ color: "var(--color-primary-100)" }}
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
          className="font-display font-bold text-2xl md:text-3xl mb-1"
          style={{ color: "var(--color-primary-50)" }}
        >
          Battali Abdul Matin High School
        </motion.h2>

        <motion.p
          initial={{ y: 8, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="font-mono text-xs tracking-[0.18em] uppercase mb-3"
          style={{ color: "var(--color-primary-400)" }}
        >
          Est. 1966 · Nangalkot, Cumilla, Bangladesh
        </motion.p>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.28 }}
          className="font-serif italic text-sm"
          style={{ color: "var(--color-primary-300)" }}
        >
          &quot;শিক্ষাই জাতির মেরুদণ্ড&quot; — Education is the backbone of a nation
        </motion.p>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35 }}
          className="flex justify-center gap-3 mt-5"
        >
          {socials.map(({ icon, href, label }) => (
            <Link
              key={label}
              href={href}
              aria-label={label}
              className="flex items-center justify-center w-9 h-9 rounded-xl border text-lg transition-all duration-200 hover:-translate-y-0.5"
              style={{
                borderColor: "rgba(46,139,87,0.30)",
                color: "var(--color-primary-300)",
                background: "rgba(46,139,87,0.08)",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(46,139,87,0.60)";
                (e.currentTarget as HTMLElement).style.color = "var(--color-primary-100)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 12px rgba(46,139,87,0.30)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(46,139,87,0.30)";
                (e.currentTarget as HTMLElement).style.color = "var(--color-primary-300)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
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
      <div className="relative page-setup py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* ── Col 1 — About ── */}
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
          >
            <FooterHeading>About BAMHS</FooterHeading>
            <p className="font-sans text-sm leading-relaxed"
              style={{ color: "rgba(195,232,206,0.70)" }}>
              A proud institution shaping generations since 1966. BAMHS stands
              as a beacon of quality education, community pride, and the
              enduring bond between students, alumni, and staff.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-1 mt-4 font-sans text-xs font-medium transition-colors duration-200 hover:gap-2"
              style={{ color: "var(--color-primary-300)" }}
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
            <ul className="flex flex-col gap-2.5">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="group font-sans text-sm flex items-center gap-2 transition-all duration-200"
                    style={{ color: "rgba(195,232,206,0.70)" }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.color = "var(--color-primary-100)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.color = "rgba(195,232,206,0.70)";
                    }}
                  >
                    <span
                      className="w-1 h-1 rounded-full transition-all duration-200 group-hover:w-2"
                      style={{ background: "var(--color-primary-500)" }}
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
            <ul className="flex flex-col gap-2.5">
              {communityLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="group font-sans text-sm flex items-center gap-2 transition-all duration-200"
                    style={{ color: "rgba(195,232,206,0.70)" }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.color = "var(--color-primary-100)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.color = "rgba(195,232,206,0.70)";
                    }}
                  >
                    <span
                      className="w-1 h-1 rounded-full transition-all duration-200 group-hover:w-2"
                      style={{ background: "var(--color-accent-500)" }}
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
                <li key={text} className="flex items-start gap-3">
                  <span style={{ color: "var(--color-primary-400)" }}>{icon}</span>
                  <span
                    className="font-sans text-sm leading-snug"
                    style={{ color: "rgba(195,232,206,0.70)" }}
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
        {/* Thin gold accent stripe above bottom bar */}
        <div
          className="absolute -top-px left-1/2 -translate-x-1/2 w-32 h-px rounded-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(245,158,11,0.6), transparent)",
          }}
        />

        <div className="page-setup py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p
            className="font-sans text-xs"
            style={{ color: "rgba(195,232,206,0.45)" }}
          >
            © {year} Battali Abdul Matin High School. All rights reserved.
          </p>

          <div className="flex items-center gap-1">
            <span
              className="font-mono text-[10px] tracking-widest uppercase"
              style={{ color: "rgba(195,232,206,0.30)" }}
            >
              Crafted with care for
            </span>
            <span
              className="font-display text-xs italic"
              style={{ color: "var(--color-primary-400)" }}
            >
              BAMHSians
            </span>
            <span style={{ color: "rgba(195,232,206,0.30)", fontSize: "10px" }}>
              {" "}everywhere
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="font-sans text-xs transition-colors duration-200 hover:text-primary-200"
              style={{ color: "rgba(195,232,206,0.40)" }}
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="font-sans text-xs transition-colors duration-200 hover:text-primary-200"
              style={{ color: "rgba(195,232,206,0.40)" }}
            >
              Terms
            </Link>
          </div>
        </div>
      </div>

      {/* mobile safe-area pad (above bottom dock) */}
      <div className="md:hidden h-20" />
    </footer>
  );
};

export default Footer;