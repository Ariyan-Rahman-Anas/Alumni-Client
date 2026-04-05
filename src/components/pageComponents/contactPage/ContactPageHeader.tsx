"use client"

import SectionLabel from "@/components/shared/SectionLabel"
import { motion } from "framer-motion"

const ContactPageHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="text-center"
    >
      {/* Label */}
      <SectionLabel text="get in touch" />

      {/* Heading */}
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
        Let&apos;s Create{" "}
        <span className="bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent">
          Something Amazing
        </span>
      </h1>

      <p className="mt-4 text-text-secondary text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
        Ready to turn your ideas into reality? Let&apos;s discuss your next
        project and make it extraordinary.
      </p>

      {/* Bottom line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-8 h-px w-24 mx-auto bg-gradient-to-r from-transparent via-brand/50 to-transparent"
      />
    </motion.div>
  )
}
export default ContactPageHeader