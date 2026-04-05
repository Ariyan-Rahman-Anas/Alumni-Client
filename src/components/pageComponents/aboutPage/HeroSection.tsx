// "use client"

// import PrimaryButton from "@/components/shared/PrimaryButton"
// import SecondaryButton from "@/components/shared/SecondaryButton"
// import { motion } from "framer-motion"

// const HeroSection = () => {
//   return (
//     <section className="relative mt-16 flex items-center justify-center overflow-hidden">
//       <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
//         <motion.div
//           initial={{ opacity: 0, transform: "translateY(30px)" }}
//           whileInView={{ opacity: 1, transform: "translateY(0px)" }}
//           transition={{ duration: 0.8 }}
//           viewport={{ once: false }}
//         >
//           <h1 className="section-heading purple-gradient-text">About Me</h1>
//           <p className="section-subheaidng">
//             Passionate full-stack developer crafting digital experiences with modern technologies and creative solutions
//           </p>

//           <div className="flex flex-col md:flex-row items-center justify-center gap-x-6 gap-y-3 w-fit mx-auto mt-5">
//             <PrimaryButton title="Explore My Projects" isLinked={true} link="/projects" />
//             <SecondaryButton title="My Services" isLinked={true} link="/services" />
//           </div>
//         </motion.div>
//       </div>
//     </section>
//   )
// }
// export default HeroSection









"use client"

import PrimaryButton from "@/components/shared/PrimaryButton"
import SecondaryButton from "@/components/shared/SecondaryButton"
import SectionLabel from "@/components/shared/SectionLabel"
import { motion } from "framer-motion"

const HeroSection = () => {
  return (
    <section className="relative text-center">

      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center"
      >
        <SectionLabel text="about me" variant="island" />
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight"
      >
        Crafting{" "}
        <span className="bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent">
          Digital
        </span>{" "}
        Experiences
      </motion.h1>

      {/* Subheading */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-4 text-text-secondary text-base md:text-lg leading-relaxed max-w-2xl mx-auto"
      >
        Passionate full-stack developer crafting digital experiences with
        modern technologies and creative solutions.
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-col md:flex-row items-center justify-center gap-3 mt-8"
      >
        <PrimaryButton title="Explore My Projects" isLinked={true} link="/projects" />
        <SecondaryButton title="My Services" isLinked={true} link="/services" />
      </motion.div>

      {/* Bottom divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mt-12 h-px w-32 mx-auto bg-gradient-to-r from-transparent via-brand/50 to-transparent"
      />
    </section>
  )
}
export default HeroSection