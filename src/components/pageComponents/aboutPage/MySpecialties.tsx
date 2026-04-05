"use client"

import { motion } from "framer-motion"
import { useGetSpecalitiesQuery } from "@/redux/apis/specalitiesApi"
import { BiPlus } from "react-icons/bi"
import SectionLabel from "@/components/shared/SectionLabel"

const statColors = [
  { from: "from-brand", to: "to-accent", glow: "rgba(59,130,246,0.15)" },
  { from: "from-green-400", to: "to-emerald-600", glow: "rgba(16,185,129,0.15)" },
  { from: "from-accent", to: "to-cyan-400", glow: "rgba(6,182,212,0.15)" },
  { from: "from-violet-400", to: "to-brand", glow: "rgba(139,92,246,0.15)" },
]

// ── Skeleton ──────────────────────────────────────────────────
const SpecialtiesSkeleton = () => (
  <div className="flex flex-col-reverse lg:flex-row items-center justify-center gap-12 mt-10 animate-pulse">
    <div className="flex-1 grid grid-cols-2 gap-4 max-w-2xl w-full">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-3">
          <div className="h-12 w-20 mx-auto bg-white/10 rounded-lg" />
          <div className="h-4 w-28 mx-auto bg-white/10 rounded" />
        </div>
      ))}
    </div>
    <div className="w-[315px] h-[424px] bg-white/5 rounded-2xl border border-white/10" />
  </div>
)

const MySpecialties = () => {
  const { data, isLoading } = useGetSpecalitiesQuery("")
  const { yearsOfExperience, completedProjects, workedCountries, clients } =
    data?.specalities[0] || {}

  const specialties = [
    { value: yearsOfExperience ?? 0, label: "Years of Experience", ...statColors[0] },
    { value: completedProjects ?? 0, label: "Completed Projects", ...statColors[1] },
    { value: workedCountries ?? 0, label: "Countries Worked", ...statColors[2] },
    { value: clients ?? 0, label: "Happy Clients", ...statColors[3] },
  ]

  return (
    <section>
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: false }}
        className="text-center"
      >
        <SectionLabel text="get introduced" variant="island"/>
        <h2 className="mt-0 text-3xl md:text-5xl font-bold text-white tracking-tight">
          Let&apos;s Get{" "}
          <span className="bg-gradient-to-r from-accent to-brand bg-clip-text text-transparent">
            Introduced
          </span>
        </h2>
        <p className="mt-3 text-text-secondary text-base max-w-xl mx-auto leading-relaxed">
          Discover my journey and expertise through numbers that speak
          louder than words.
        </p>
      </motion.div>

      {isLoading ? <SpecialtiesSkeleton /> : (
        <div className="flex flex-col-reverse lg:flex-row items-center justify-center gap-12 mt-10">

          {/* Stats grid */}
          <div className="flex-1 grid grid-cols-2 gap-4 max-w-2xl">
            {specialties.map(({ value, label, from, to, glow }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: false }}
                whileHover={{ scale: 1.04 }}
                className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden"
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                  style={{ background: `radial-gradient(circle at 50% 50%, ${glow}, transparent 70%)` }}
                />

                <div className="relative text-center space-y-2">
                  <div className="relative w-fit mx-auto">
                    <h3 className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${from} ${to} bg-clip-text text-transparent`}>
                      {value}
                    </h3>
                    <BiPlus className="absolute -top-1 -right-5 text-2xl text-text-secondary" />
                  </div>
                  <p className="text-text-secondary text-sm font-medium">{label}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Video */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: false }}
            className="relative"
          >
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-brand/40 to-accent/30 blur-sm" />
            <div className="relative rounded-2xl overflow-hidden border border-white/10">
              <iframe
                width="315"
                height="424"
                src="https://www.youtube.com/embed/NweyDOndviQ"
                title="Ariyan Rahman Anas"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                className="rounded-xl block"
              />
            </div>
          </motion.div>
        </div>
      )}
    </section>
  )
}
export default MySpecialties