"use client"

import { motion } from "framer-motion"
import Educations from "./Educations"
import Experiences from "./Experiences"
import SectionLabel from "@/components/shared/SectionLabel"
import Image from "next/image"

const PersonalInfo = () => {
  return (
    <section>
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: false }}
        className="text-center mb-10"
      >
        <SectionLabel text="my path" variant="island" />
        <h2 className="mt-2 text-3xl md:text-5xl font-bold text-white tracking-tight">
          My{" "}
          <span className="bg-gradient-to-r from-accent via-brand to-brand-light bg-clip-text text-transparent">
            Journey
          </span>
        </h2>
        <p className="mt-3 text-text-secondary text-base max-w-xl mx-auto leading-relaxed">
          Education and experience that shaped my professional path.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-brand-light p-1 border border-brand/30 flex items-center justify-center">
                <Image width="80" height="80" src="https://img.icons8.com/dotty/80/graduation-cap.png" alt="Edu" />
            </div>
            <h3 className="text-xl font-bold text-white">Education</h3>
          </div>
          <Educations />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          viewport={{ once: false }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-accent-light/70 p-1 border border-accent/30 flex items-center justify-center">
                <Image width="80" height="80" src="https://img.icons8.com/ios/50/briefcase-settings.png" alt="Exp" />
            </div>
            <h3 className="text-xl font-bold text-white">Experience</h3>
          </div>
          <Experiences />
        </motion.div>
      </div>
    </section>
  )
}
export default PersonalInfo