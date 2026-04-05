// "use client"

// import { useGetAllEducationsQuery } from "@/redux/apis/educationsApi"
// import { SlGraduation } from "react-icons/sl"

// const Educations = () => {
//   const { data } = useGetAllEducationsQuery(undefined)
//   const educations = data?.educations || []

//   return (
//     <div className='relative'>
//       {educations.map((education: any, index: number) => (
//         <div key={index} className='relative'>
//           {/* Background line for the entire stepper */}
//           {index === 0 && educations?.length > 1 && (
//             <div className='absolute left-5 top-10 w-[2px] bg-text-secondary/50 z-0'
//               style={{ height: `${(educations?.length - 1) * 92}%` }} />
//           )}

//           <div className='flex items-start gap-4 last:pb-6 relative z-10'>
//             {/* Circle with icon */}
//             <div className='w-10 h-10 border-text-secondary border-2 rounded-full flex items-center justify-center purple-bg flex-shrink-0'>
//               <SlGraduation className='text-2xl text-text-secondary '/>
//             </div>

//             {/* Content */}
//             <div>
//               <p className='font-semibold text-text-secondary'>{education.degree}</p>
//               <p className='text-text-secondary/80 mt-1 text-sm md:text-base'>{education.institute}</p>
//               <p className='mt-2 mb-3 text-sm shadow shadow-text-secondary/40 text-text-secondary/80 w-fit rounded-full px-4 pt-1.5 pb-0.5'>{Number(education.outOf) === 5 ? "GPA" : "CGPA"}  {education.point} out of {education.outOf}</p>
//               <p className='mt-2 leading-7 text-text-secondary/80 text-sm '>{education.description}</p>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   )
// }
// export default Educations











"use client"

import { motion } from "framer-motion"
import { useGetAllEducationsQuery } from "@/redux/apis/educationsApi"
import { SlGraduation } from "react-icons/sl"

const EducationSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    {[...Array(2)].map((_, i) => (
      <div key={i} className="flex gap-4">
        <div className="shrink-0 flex flex-col items-center gap-1">
          <div className="w-10 h-10 rounded-full bg-white/10" />
          {i < 1 && <div className="w-[2px] h-16 bg-white/10" />}
        </div>
        <div className="flex-1 pb-6 space-y-2">
          <div className="h-4 w-40 bg-white/10 rounded" />
          <div className="h-3 w-56 bg-white/10 rounded" />
          <div className="h-6 w-32 bg-white/10 rounded-full" />
          <div className="h-3 w-full bg-white/10 rounded" />
          <div className="h-3 w-3/4 bg-white/10 rounded" />
        </div>
      </div>
    ))}
  </div>
)

const Educations = () => {
  const { data, isLoading } = useGetAllEducationsQuery(undefined)
  const educations = data?.educations || []

  if (isLoading) return <EducationSkeleton />

  return (
    <div className="relative space-y-0">
      {educations.map((edu: any, i: number) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          viewport={{ once: false }}
          className="flex gap-4"
        >
          {/* Timeline column */}
          <div className="flex flex-col items-center shrink-0">
            {/* Icon circle */}
            <div className="w-10 h-10 rounded-full bg-brand/15 border border-brand/30 flex items-center justify-center shrink-0 z-10">
              <SlGraduation className="text-brand-light text-lg" />
            </div>
            {/* Connector line */}
            {i < educations.length - 1 && (
              <div className="w-[1.5px] flex-1 my-1 bg-gradient-to-b from-brand/30 to-transparent min-h-[2rem]" />
            )}
          </div>

          {/* Card */}
          <div className={`flex-1 ${i < educations.length - 1 ? "pb-8" : "pb-2"}`}>
            <motion.div
              whileHover={{ borderColor: "rgba(59,130,246,0.3)" }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 transition-colors duration-300 group"
            >
              {/* Degree */}
              <p className="font-semibold text-white text-sm md:text-base leading-snug">
                {edu.degree}
              </p>

              {/* Institute */}
              <p className="text-brand-light text-sm mt-1 font-medium">
                {edu.institute}
              </p>

              {/* GPA badge */}
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs font-mono text-accent border border-accent/25 bg-accent/10 px-3 py-1 rounded-full">
                  {Number(edu.outOf) === 5 ? "GPA" : "CGPA"} {edu.point}/{edu.outOf}
                </span>
              </div>

              {/* Description */}
              {edu.description && (
                <p className="mt-3 text-text-secondary text-sm leading-relaxed">
                  {edu.description}
                </p>
              )}
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
export default Educations