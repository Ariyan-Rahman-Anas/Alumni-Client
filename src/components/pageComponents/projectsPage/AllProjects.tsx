"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useGetAllCategoriesQuery, useGetAllProjectsQuery } from "@/redux/apis/projectsApi"
import ProjectCard from "./ProjectCard"
import SectionLabel from "@/components/shared/SectionLabel"

// ── Skeleton ──────────────────────────────────────────────────
const ProjectsSkeleton = () => (
    <div className="animate-pulse space-y-8">
        {/* Tab skeleton */}
        <div className="flex gap-2 w-[50%] mx-auto">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="flex-1 h-10 rounded-full bg-white/10" />
            ))}
        </div>
        {/* Cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                    <div className="h-48 bg-white/10" />
                    <div className="p-5 space-y-3">
                        <div className="h-5 w-3/4 bg-white/10 rounded" />
                        <div className="h-3 w-full bg-white/10 rounded" />
                        <div className="h-3 w-2/3 bg-white/10 rounded" />
                        <div className="flex gap-2 mt-4">
                            <div className="h-8 flex-1 bg-white/10 rounded-lg" />
                            <div className="h-8 flex-1 bg-white/10 rounded-lg" />
                            <div className="h-8 flex-1 bg-white/10 rounded-lg" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
)

const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}
const cardVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as any } },
}

const AllProjects = () => {
    const [activeTab, setActiveTab] = useState("Full-Stack")

    const { data: categoriesData, isLoading: isCatLoading } = useGetAllCategoriesQuery("")
    const { data: projectsData, isLoading: isProjLoading } = useGetAllProjectsQuery("")

    const categories = categoriesData?.categories ?? []

    const filtered = useMemo(() => {
        const projects = projectsData?.projects ?? []  

        return [...projects]
            .filter((p: any) => p.category === activeTab)
            .sort((a: any, b: any) => (Number(a.serialNumber) || 0) - (Number(b.serialNumber) || 0))
    }, [projectsData?.projects, activeTab])

    const isLoading = isCatLoading || isProjLoading

    return (
        <section className="space-y-12">

            {/* ── Heading ── */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center"
            >
                <SectionLabel text="my work"/>
                <h1 className="mt-3 text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
                    Featured{" "}
                    <span className="bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent">
                        Projects
                    </span>
                </h1>
                <p className="mt-4 text-text-secondary text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                    Always excited to explore new technologies. Each project represents a
                    unique challenge and a chance to push boundaries.
                </p>
            </motion.div>

            {isLoading ? <ProjectsSkeleton /> : (
                <div className="space-y-8">

                    {/* ── Tabs ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex items-center bg-white/5 backdrop-blur-sm rounded-full p-1 border border-white/10 w-full md:w-[60%] lg:w-[50%] xl:w-[40%] mx-auto"
                    >
                        {categories.map((cat: string, i: number) => (
                            <button
                                key={i}
                                onClick={() => setActiveTab(cat)}
                                className="relative flex-1 py-2 text-sm font-medium rounded-full transition-all duration-300 text-gray-400 hover:text-white"
                            >
                                {activeTab === cat && (
                                    <motion.span
                                        layoutId="activeProjectTab"
                                        className="absolute inset-0 rounded-full bg-gradient-to-r from-brand to-accent"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10 text-white">{cat}</span>
                            </button>
                        ))}
                    </motion.div>

                    {/* ── Count ── */}
                    <motion.p
                        key={activeTab}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-xs font-mono text-text-secondary tracking-widest"
                    >
                        {filtered.length} project{filtered.length !== 1 ? "s" : ""} in{" "}
                        <span className="text-brand-light">{activeTab}</span>
                    </motion.p>

                    {/* ── Grid ── */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            variants={container}
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0, transition: { duration: 0.15 } }}
                            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
                        >
                            {filtered.map((project: any) => (
                                <motion.div key={project._id} variants={cardVariant}>
                                    <ProjectCard project={project} />
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>

                    {/* ── Empty state ── */}
                    {filtered.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20 space-y-3"
                        >
                            <p className="text-4xl">🗂️</p>
                            <p className="text-white font-medium">No projects in{" "}
                                <span className="text-brand-light">{activeTab}</span>
                            </p>
                            <p className="text-text-secondary text-sm">Check back soon.</p>
                        </motion.div>
                    )}
                </div>
            )}
        </section>
    )
}
export default AllProjects
