"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  RiMapPin2Line,
  RiPhoneLine,
  RiMailLine,
} from "react-icons/ri";
import { HiArrowUpRight } from "react-icons/hi2";
import FooterHead from "./modules/user/footer/FooterHead";
import { useGetWebsiteManagementQuery } from "@/redux/apis/websiteManagementApi";

/* Data */
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

/*  Helper */
const FooterHeading = ({ children }: { children: React.ReactNode }) => (
  <h3
    className="text-white dark:text-gunmetal-200 font-semibold text-base mb-5 flex items-center gap-3">
    <span
      className="w-5 h-[2px] rounded-full"
      style={{ background: "linear-gradient(90deg, #4ade80, #f59e0b)" }}
    />
    {children}
  </h3>
);

const Footer = () => {
  const year = new Date().getFullYear();
  const { data: websiteManagement } = useGetWebsiteManagementQuery();
  const { schoolName, area, thana, district, division, postalCode, country, contactNumber, email } = websiteManagement?.data || {};

  const schoolAddress = `${postalCode ?? "3582"} - ${area ?? "Battali"}, ${thana ?? "Nangalkot"}, ${district ?? "Cumilla"}, ${division ?? "Chattogram"}, ${country ?? "Bangladesh"}`;
  const schoolContactNumber = contactNumber || "01700000000";
  const schoolEmail = email || "info@bamhsian.org.bd";
  const schoolShortName = schoolName?.split(" ")?.map((word: string) => word[0]).join("") || "BAMHS";

  const contactInfo = [
    {
      icon: <RiMapPin2Line className="text-base shrink-0 mt-0.5" />,
      text: schoolAddress,
    },
    {
      icon: <RiPhoneLine className="text-base shrink-0" />,
      text: schoolContactNumber,
    },
    {
      icon: <RiMailLine className="text-base shrink-0" />,
      text: schoolEmail,
    },
  ];

  return (
    <footer
      className="relative overflow-hidden rounded-t-pillmd:rounded-t-circle"
      style={{
        background: "linear-gradient(180deg, #0A3D2B 0%, #051F15 100%)",
      }}
    >
      {/*  Decorative grid overlay  */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(74,222,128,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(74,222,128,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* SCHOOL NAME HERO BAND */}
      <FooterHead />

      {/* MAIN GRID */}
      <div className="relative pb-8 pt-0 three-xl-section-setup">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Col 1 — About */}
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
          >
            <FooterHeading>{`About ${schoolShortName} Alumni`}</FooterHeading>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "rgba(167,243,208,0.65)" }}
            >
              Connected by shared memories, united by {schoolShortName}. Our alumni
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

          {/* Col 2 — Quick Links  */}
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

          {/* Col 3 — Community  */}
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

          {/*  Col 4 — Contact  */}
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.20 }}
          >
            <FooterHeading>Contact</FooterHeading>
            <ul className="flex flex-col gap-4">
              {contactInfo.map(({ icon, text }) => (
                <li key={text} className="flex items-center gap-3 group">
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

          {/* BOTTOM BAR */}
      <div
        className="relative border-t"
        style={{ borderColor: "rgba(46,139,87,0.15)" }}>
        <div className="three-xl-section-setup py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gunmetal-200 ">
          {/* Copyright */}
          <p>© {year} {schoolShortName} Alumni Association. All rights reserved</p>

          {/* Developer credit — inline, professional */}
          <Link
            href="https://ariyanrahmananas.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 transition-colors duration-300">
            <span>Designed &amp; developed by</span>
            <span
              className="font-semibold group-hover:text-primary2-500 duration-300">
              Ariyan Rahman Anas
            </span>
            <HiArrowUpRight className="group-hover:text-primary2-500 duration-300" />
          </Link>

          {/* Legal links */}
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="duration-300 hover:text-primary2-500">
              Privacy
            </Link>
            <Link
              href="/terms"
              className="duration-300 hover:text-primary2-500">
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