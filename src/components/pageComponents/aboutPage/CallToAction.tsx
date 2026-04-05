// "use client"

// import PrimaryButton from "@/components/shared/PrimaryButton"
// import SecondaryButton from "@/components/shared/SecondaryButton"
// import { motion } from "framer-motion"
// const CallToAction = () => {
//     return (
//       <motion.section
//         // initial={{ opacity: 0, y: 30 }}
//         // whileInView={{ opacity: 1, y: 0 }}
//         // transition={{ duration: 0.8 }}
//         // viewport={{ once: false }}


//         initial={{ opacity: 0, transform: "translateY(30px)" }}
//         whileInView={{ opacity: 1, transform: "translateY(0px)" }}
//         transition={{ duration: 0.6 }}
//         viewport={{ once: false }}

//         className="text-center"
//       >
//         <div className="">
//           <h2 className="section-heading purple-gradient-text">
//             Ready to Work Together?
//           </h2>
//           <p className="section-subheaidng">
//             {`Let's discuss your next project and bring your ideas to life with modern web solutions`}
//           </p>
//           <div className="flex flex-col md:flex-row items-center justify-center gap-x-6 gap-y-3 w-fit mx-auto mt-5">
//             <PrimaryButton title="Start a Project" isLinked={true} link="/projects" />
//             <SecondaryButton title="Get in Touch" isLinked={true} link="/contact" />
//           </div>
//         </div>
//       </motion.section>
//     )
//   }
//   export default CallToAction













"use client"

import PrimaryButton from "@/components/shared/PrimaryButton"
import SecondaryButton from "@/components/shared/SecondaryButton"
import SectionLabel from "@/components/shared/SectionLabel"
import { motion } from "framer-motion"

const CallToAction = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: false }}
      className="relative text-center"
    >
      {/* Glow orb */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[400px] h-[200px] bg-brand/10 blur-[80px] rounded-full" />
      </div>

      {/* Border card */}
      <div className="relative border border-white/10 bg-white/5 backdrop-blur-sm rounded-3xl px-8 py-14">
        <SectionLabel text="next step" variant="island" />

        <h2 className="mt-3 text-3xl md:text-5xl font-bold text-white tracking-tight">
          Ready to Work{" "}
          <span className="bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent">
            Together?
          </span>
        </h2>

        <p className="mt-4 text-text-secondary text-base max-w-xl mx-auto leading-relaxed">
          Let&apos;s discuss your next project and bring your ideas to life
          with modern web solutions.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-3 mt-8">
          <PrimaryButton title="Start a Project" isLinked={true} link="/projects" />
          <SecondaryButton title="Get in Touch" isLinked={true} link="/contact" />
        </div>
      </div>
    </motion.section>
  )
}
export default CallToAction