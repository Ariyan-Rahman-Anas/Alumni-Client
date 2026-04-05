// "use client"

// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion"
// import { useGetAllSkillsQuery } from "@/redux/apis/skillsApi";

// const MySkills = () => {
//   const [activeTab, setActiveTab] = useState("Frontend");

//   const { data: skillsData } = useGetAllSkillsQuery("")
//   const skills = skillsData?.skills
//   const skillsCategory = [
//     ...new Set(skills?.map((skill: any) => skill?.category)),
//   ];

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1
//       }
//     }
//   }

//   const itemVariants = {
//     hidden: { opacity: 0, scale: 0.82, },
//     visible: {
//       opacity: 1,
//       scale: 1,
//       transition: {
//         type: "spring" as const,
//         stiffness: 100,
//         duration: 0.9
//       }
//     }
//   }

//   return (
//     <section>
//       <motion.div
//         initial={{ opacity: 0, transform: "translateY(20px)" }}
//         whileInView={{ opacity: 1, transform: "translateY(0px)" }}
//         transition={{ duration: 0.6 }}
//         viewport={{ once: false }}
//         className="mb-5"
//       >
//         <h2 className="section-heading purple-gradient-text">
//           My Skills
//         </h2>
//         <p className="section-subheaidng">
//           Constantly evolving and mastering new technologies to deliver cutting-edge solutions
//         </p>
//       </motion.div>

//       {skillsCategory && skills && (
//         <div className="space-y-6">
//           {/* Enhanced Tab Navigation */}
//           <div className="bg-white/5 backdrop-blur-sm rounded-full p-1 border border-white/20 flex items-center justify-between w-full md:w-[60%] lg:w-[50%] xl:w-[40%] mx-auto">
//             {skillsCategory?.map((category: any, idx: number) => (
//               <button
//                 key={idx}
//                 onClick={() => setActiveTab(category)}
//                 className={`py-2 w-full font-medium transition-all duration-300
//                     ${idx === 0 && "rounded-l-full"}
//                     ${idx === skillsCategory?.length - 1 && "rounded-r-full"}
//                     ${activeTab === category
//                     ? "bg-gradient-to-r from-brand to-accent hover:from-brand-dark hover:to-accent-dark text-white shadow-lg"
//                     : "text-gray-400 hover:text-white hover:bg-white/10"
//                   }`}
//               >
//                 {category}
//               </button>
//             ))}
//           </div>

//           {/* Enhanced Skills Display */}
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={activeTab}
//               variants={containerVariants}
//               initial="hidden"
//               animate="visible"
//               exit="hidden"
//               className="flex flex-wrap justify-center gap-2.5 max-w-7xl mx-auto"
//             >
//               {skills
//                 ?.filter((skill: any) => skill?.category === activeTab)
//                 .map(({ name }: { name: string }, idx: number) => (
//                   <motion.div
//                     key={idx}
//                     variants={itemVariants}
//                     initial="hidden"
//                     animate="visible"
//                     exit="hidden"
//                     className="px-6 py-2 rounded-md border border-white/20 text-white font-medium hover:scale-105 transition-transform duration-300"
//                   >
//                     {name}
//                   </motion.div>
//                 ))}
//             </motion.div>
//           </AnimatePresence>
//         </div>
//       )}
//     </section>
//   )
// }
// export default MySkills












"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useGetAllSkillsQuery } from "@/redux/apis/skillsApi"
import SectionLabel from "@/components/shared/SectionLabel"

// ── Skeleton ──────────────────────────────────────────────────
const SkillsSkeleton = () => (
  <div className="animate-pulse space-y-6">
    {/* Tab bar skeleton */}
    <div className="flex items-center justify-center gap-2 w-full md:w-[60%] mx-auto">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-10 flex-1 bg-white/10 rounded-full" />
      ))}
    </div>
    {/* Skills skeleton */}
    <div className="flex flex-wrap justify-center gap-2.5">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="h-9 bg-white/10 rounded-md"
          style={{ width: `${80 + Math.random() * 60}px` }}
        />
      ))}
    </div>
  </div>
)

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}
const item = {
  hidden: { opacity: 0, scale: 0.85, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring" as const, stiffness: 120 } },
}

const MySkills = () => {
  const [activeTab, setActiveTab] = useState("Frontend")
  const { data: skillsData, isLoading } = useGetAllSkillsQuery("")
  const skills = skillsData?.skills
  // const categories: string[] = [...new Set(skills?.map((s: any) => s.category) ?? [])]
  const categories = [...new Set(skills?.map((s: any) => s.category) ?? [])] as string[]

  return (
    <section>
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: false }}
        className="text-center mb-8"
      >
        {/* <span className="text-xs font-mono text-brand-light tracking-[0.3em] uppercase">
          {"// tech stack "}
        </span> */}
        <SectionLabel text="tech stack" variant="island" />
        <h2 className="mt-2 text-3xl md:text-5xl font-bold tracking-tight">
          <span className="text-white">My </span>
          <span className="bg-gradient-to-r from-brand-light to-accent bg-clip-text text-transparent">
            Skills
          </span>
        </h2>
        <p className="mt-3 text-text-secondary text-base max-w-xl mx-auto leading-relaxed">
          Constantly evolving and mastering new technologies to deliver
          cutting-edge solutions.
        </p>
      </motion.div>

      {isLoading ? <SkillsSkeleton /> : skills && categories.length > 0 && (
        <div className="space-y-6">

          {/* Tab bar */}
          <div className="flex items-center bg-white/5 backdrop-blur-sm rounded-full p-1 border border-white/10 w-full md:w-[60%] lg:w-[50%] xl:w-[40%] mx-auto">
            {categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(cat)}
                className={`relative flex-1 py-2 text-sm font-medium rounded-full transition-all duration-300
                  ${activeTab === cat
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                  }`}
              >
                {activeTab === cat && (
                  <motion.span
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-brand to-accent"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            ))}
          </div>

          {/* Skills */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={container}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              className="flex flex-wrap justify-center gap-2.5 max-w-4xl mx-auto"
            >
              {skills
                .filter((s: any) => s.category === activeTab)
                .map(({ name }: { name: string }, i: number) => (
                  <motion.div
                    key={i}
                    variants={item}
                    whileHover={{ scale: 1.06, borderColor: "rgba(59,130,246,0.4)" }}
                    className="px-5 py-2 rounded-lg border border-white/15 bg-white/5 hover:bg-brand/10 text-white text-sm font-medium backdrop-blur-sm transition-colors duration-200 cursor-default"
                  >
                    {name}
                  </motion.div>
                ))}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </section>
  )
}
export default MySkills