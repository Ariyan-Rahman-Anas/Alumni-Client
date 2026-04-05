// "use client"

// import { useGetAllExperiencesQuery } from "@/redux/apis/experiencesApi"
// import { FaMinus } from "react-icons/fa6"
// import { HiOutlineBriefcase } from "react-icons/hi"
// import TimeFormatterDemo from '@/components/shared/TimeFormatter'
// import { useMemo } from "react"

// const Experiences = () => {
//     const { data } = useGetAllExperiencesQuery(undefined)
//     const experiences = data?.experiences || []

//     const serializeProjects = (projectsList: any[]) => {
//         if (!projectsList || projectsList.length === 0) return [];

//         return [...projectsList].sort((a: any, b: any) => {
//             const serialA = Number(a.serialNumber) || 0;
//             const serialB = Number(b.serialNumber) || 0;

//             return serialA - serialB;
//         });
//     };

//     const serializedProjects = useMemo(() => {
//         if (!experiences) return [];

//         return serializeProjects(experiences);
//     }, [experiences]);

//     return (
//         <div className='relative'>
//             {serializedProjects?.map((experience: any, index: number) => (
//                 <div key={index} className='relative'>
//                     {/* Background line for the entire stepper */}
//                     {index === 0 && serializedProjects?.length > 1 && (
//                         <div className='absolute left-5 top-10 w-[2px] bg-text-secondary/50 z-0'
//                             style={{ height: `${(serializedProjects?.length - 1) * 100}%` }} />
//                     )}

//                     <div className='flex items-start gap-4 last:pb-6 relative z-10'>
//                         {/* Circle with icon */}
//                         <div className='w-10 h-10 border-text-secondary border-2 rounded-full flex items-center justify-center purple-bg flex-shrink-0'>
//                             <HiOutlineBriefcase className='text-2xl text-text-secondary ' />
//                         </div>

//                         <div>
//                             <div className='flex flex-col md:flex-row items-start md:items-center md:gap-2 gap-1'>
//                                 <p className='font-semibold text-text-secondary'>{experience?.title}</p>
//                                 <FaMinus className="hidden md:block" />
//                                 <p className='text-text-secondary/80 text-sm md:text-base'>{experience?.company}</p>
//                             </div>
//                             <p className='text-text-secondary/80 text-sm mt-1'>{experience?.location}</p>
//                             <div className='flex items-center gap-2 fontsemibold text-sm mt-2 mb-1 text-text-secondary/80'>
//                                 <p className='shadow shadow-text-secondary/40 rounded-full px-4 pt-0.5'>{experience?.employmentType}</p>
//                                 <p className='shadow shadow-text-secondary/40 rounded-full px-4 pt-0.5' >{experience?.workType}</p>
//                             </div>
//                             <div className='flex items-center gap-1 mt-2 text-sm shadow shadow-text-secondary/40 rounded-full px-4 py-1 w-fit'>
//                                 <TimeFormatterDemo isoString={experience?.startDate} />
//                                 <FaMinus size={10} />
//                                 {experience?.endDate && experience?.current === false ? <TimeFormatterDemo isoString={experience?.endDate} /> : <span className="text-text-secondary/80">Present</span>}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             ))}
//         </div>
//     )
// }
// export default Experiences











"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { useGetAllExperiencesQuery } from "@/redux/apis/experiencesApi"
import { HiOutlineBriefcase } from "react-icons/hi"
import TimeFormatterDemo from "@/components/shared/TimeFormatter"

const ExperienceSkeleton = () => (
    <div className="space-y-6 animate-pulse">
        {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-4">
                <div className="shrink-0 flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full bg-white/10" />
                    {i < 1 && <div className="w-[2px] h-20 bg-white/10" />}
                </div>
                <div className="flex-1 pb-6 space-y-2">
                    <div className="h-4 w-36 bg-white/10 rounded" />
                    <div className="h-3 w-48 bg-white/10 rounded" />
                    <div className="h-3 w-24 bg-white/10 rounded" />
                    <div className="flex gap-2 mt-1">
                        <div className="h-6 w-20 bg-white/10 rounded-full" />
                        <div className="h-6 w-20 bg-white/10 rounded-full" />
                    </div>
                    <div className="h-6 w-36 bg-white/10 rounded-full" />
                </div>
            </div>
        ))}
    </div>
)

const Experiences = () => {
    const { data, isLoading } = useGetAllExperiencesQuery(undefined)
    const experiences = data?.experiences || []

    const sorted = useMemo(() => (
        [...experiences].sort((a: any, b: any) =>
            (Number(a.serialNumber) || 0) - (Number(b.serialNumber) || 0)
        )
    ), [experiences])

    if (isLoading) return <ExperienceSkeleton />

    return (
        <div className="relative space-y-0">
            {sorted.map((exp: any, i: number) => (
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
                        <div className="w-10 h-10 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center shrink-0 z-10">
                            <HiOutlineBriefcase className="text-accent text-lg" />
                        </div>
                        {i < sorted.length - 1 && (
                            <div className="w-[1.5px] flex-1 my-1 bg-gradient-to-b from-accent/30 to-transparent min-h-[2rem]" />
                        )}
                    </div>

                    {/* Card */}
                    <div className={`flex-1 ${i < sorted.length - 1 ? "pb-8" : "pb-2"}`}>
                        <motion.div
                            whileHover={{ borderColor: "rgba(6,182,212,0.3)" }}
                            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 transition-colors duration-300 group"
                        >
                            {/* Title + company */}
                            <div>
                                <p className="font-semibold text-white text-sm md:text-base leading-snug">
                                    {exp.title}
                                </p>
                                <p className="text-accent text-sm mt-0.5 font-medium">
                                    {exp.company}
                                </p>
                            </div>

                            {/* Location */}
                            {exp.location && (
                                <p className="text-text-secondary text-xs mt-1">
                                    📍 {exp.location}
                                </p>
                            )}

                            {/* Badges */}
                            <div className="flex flex-wrap gap-2 mt-3">
                                {exp.employmentType && (
                                    <span className="text-xs font-mono text-brand-light border border-brand/25 bg-brand/10 px-3 py-1 rounded-full">
                                        {exp.employmentType}
                                    </span>
                                )}
                                {exp.workType && (
                                    <span className="text-xs font-mono text-brand-light border border-brand/25 bg-brand/10 px-3 py-1 rounded-full">
                                        {exp.workType}
                                    </span>
                                )}
                            </div>

                            {/* Date range */}
                            <div className="mt-3 flex items-center gap-1.5 text-xs text-text-secondary border border-white/10 bg-white/5 rounded-full px-3 py-1.5 w-fit">
                                <TimeFormatterDemo isoString={exp.startDate} />
                                <span className="opacity-50">—</span>
                                {exp.endDate && exp.current === false
                                    ? <TimeFormatterDemo isoString={exp.endDate} />
                                    : <span className="text-green-400 font-medium">Present</span>
                                }
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}
export default Experiences