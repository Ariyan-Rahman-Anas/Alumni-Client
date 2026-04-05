"use client"

import { motion } from "framer-motion"
import { BsMailbox } from "react-icons/bs"
import { BiPhone } from "react-icons/bi"
import { LuCalendar } from "react-icons/lu"
import SectionLabel from "@/components/shared/SectionLabel"

const ContactPageCTA = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: false }}
      className="relative text-center"
    >
      {/* Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[400px] h-[160px] bg-brand/10 blur-[80px] rounded-full" />
      </div>

      <div className="relative border border-white/10 bg-white/5 backdrop-blur-sm rounded-3xl px-8 py-12">
        <SectionLabel text="prefer another way? " />

        <h3 className="mt-3 text-2xl md:text-3xl font-bold text-white tracking-tight">
          Other Ways to{" "}
          <span className="bg-gradient-to-r from-accent to-brand bg-clip-text text-transparent">
            Connect
          </span>
        </h3>

        <p className="mt-3 text-text-secondary text-sm max-w-md mx-auto">
          Always open to discussing new opportunities and interesting projects.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-7">
          {[
            { href: "mailto:anas.hllw@gmail.com", icon: <BsMailbox size={15} />, label: "Quick Email", color: "hover:border-brand/40 hover:text-brand-light" },
            { href: "tel:+8801610195968", icon: <BiPhone size={15} />, label: "Call Me", color: "hover:border-accent/40 hover:text-accent" },
            { href: "/contact", icon: <LuCalendar size={15} />, label: "Schedule a Call", color: "hover:border-green-400/40 hover:text-green-400" },
          ].map(({ href, icon, label, color }) => (

            <a
              key={label}
              href={href}
              className={`flex items-center gap-2 bg-white/5 border border-white/10 ${color} text-text-secondary text-sm font-medium px-5 py-2.5 rounded-xl transition-all duration-300`}
            >
              {icon}
              {label}
            </a>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
export default ContactPageCTA