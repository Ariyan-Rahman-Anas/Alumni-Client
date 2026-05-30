"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage"
import { useGetAllPublishedEventsQuery } from "@/redux/apis/eventApi"
import EventPageEventCard from "./EventPageEventCard"
import { RiSearch2Line, RiCloseLine, RiCalendarEventLine } from "react-icons/ri"
import { LuSlidersHorizontal } from "react-icons/lu"
import SectionLabel from "@/components/shared/SectionLabel"

// â”€â”€â”€ Constants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const STATUS_OPTIONS = [
    { value: "", label: "All" },
    { value: "UPCOMING", label: "Upcoming" },
    { value: "ONGOING", label: "Live" },
    { value: "COMPLETED", label: "Completed" },
    { value: "CANCELLED", label: "Cancelled" },
]

const CATEGORY_OPTIONS = [
    { value: "Reunion", emoji: "ðŸŽ“" },
    { value: "Career", emoji: "ðŸ’¼" },
    { value: "Community", emoji: "ðŸ¤" },
    { value: "Cultural", emoji: "ðŸŽ­" },
    { value: "Sports", emoji: "âš¡" },
    { value: "Other", emoji: "âœ¦" },
]

const LOCATION_OPTIONS = [
    { value: "PHYSICAL", label: "In-Person", icon: "ðŸ“" },
    { value: "ONLINE", label: "Online", icon: "ðŸ–¥" },
    { value: "HYBRID", label: "Hybrid", icon: "ðŸŒ" },
]

// â”€â”€â”€ Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const EventPageEvents = () => {
    const [filters, setFilters] = useState({
        status: "",
        category: "",
        locationType: "",
    })

    const [filtersOpen, setFiltersOpen] = useState(false)

    const { data, isLoading } = useGetAllPublishedEventsQuery({
        page: 1,
        limit: 9,
        ...filters,
    })

    const activeFilterCount = [filters.category, filters.locationType].filter(Boolean).length

    const clearFilters = () => setFilters({ status: "", category: "", locationType: "" })

    return (
        <FadeUpWrapper>
            <div className="space-y-6">

                {/* â”€â”€ Page Header â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
                <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary2-900 via-primary2-800 to-primary2-950 px-8 py-10 md:px-14 md:py-14">
                    {/* Mesh decorations */}
                    <div className="pointer-events-none absolute inset-0">
                        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary2-600/20 blur-3xl" />
                        <div className="absolute -bottom-16 left-1/3 h-64 w-64 rounded-full bg-gold-500/10 blur-3xl" />
                        <div className="absolute right-1/4 bottom-0 h-40 w-40 rounded-full bg-accent2-500/15 blur-2xl" />
                        {/* Subtle grid lines */}
                        <svg className="absolute inset-0 h-full w-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#grid)" />
                        </svg>
                    </div>

                    <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <div className="space-y-4">
                            <SectionLabel text="Events Hub" align="left" className="text-primary2-100" icon={<RiCalendarEventLine />} />
                            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white md:text-5xl">
                                Discover <span className="text-gold-400">Events</span>
                            </h1>
                            <p className="text-base sm:text-lg leading-relaxed max-w-4xl text-gunmetal-300 mb-12 mt-5">
                                Connect, grow, and celebrate. Find events crafted for every member of our community.
                            </p>
                        </div>

                        {/* Status pill tabs */}
                        <div className="flex flex-wrap gap-2">
                            {STATUS_OPTIONS.map(({ value, label }) => {
                                const isActive = filters.status === value
                                const isLive = value === "ONGOING"
                                return (
                                    <button
                                        key={value || "all"}
                                        onClick={() => setFilters(prev => ({ ...prev, status: value }))}
                                        className={`
                                            relative rounded-full px-4 py-1.5 text-xs font-bold transition-all duration-200
                                            ${isActive
                                                ? "bg-white text-primary2-900 shadow-lg shadow-black/20"
                                                : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10"
                                            }
                                        `}
                                    >
                                        {isLive && isActive && (
                                            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-primary2-400 ring-2 ring-primary2-900 animate-pulse" />
                                        )}
                                        {label}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* â”€â”€ Filter Bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
                <div className="rounded-2xl border border-surface-200 bg-white shadow-sm">
                    {/* Toggle row */}
                    <div className="flex items-center justify-between px-5 py-3.5">
                        <button
                            onClick={() => setFiltersOpen(o => !o)}
                            className="flex items-center gap-2.5 text-sm font-semibold text-neutral-600 hover:text-primary2-700 transition-colors"
                        >
                            <LuSlidersHorizontal className="text-base" />
                            <span>Refine</span>
                            {activeFilterCount > 0 && (
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary2-600 text-[10px] font-bold text-white">
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>

                        <div className="flex items-center gap-2">
                            {activeFilterCount > 0 && (
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-neutral-500 hover:bg-surface-100 hover:text-red-600 transition-all"
                                >
                                    <RiCloseLine className="text-sm" />
                                    Clear all
                                </button>
                            )}
                            <span className="text-xs text-neutral-400">
                                {data?.data?.length ?? "â€”"} results
                            </span>
                        </div>
                    </div>

                    {/* Expandable filter panel */}
                    <AnimatePresence>
                        {filtersOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.22, ease: "easeInOut" }}
                                className="overflow-hidden"
                            >
                                <div className="border-t border-surface-100 px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-6">
                                    {/* Categories */}
                                    <div className="flex-1">
                                        <p className="mb-2.5 text-[10px] font-black uppercase tracking-wider text-neutral-400">Category</p>
                                        <div className="flex flex-wrap gap-2">
                                            {CATEGORY_OPTIONS.map(({ value, emoji }) => {
                                                const isActive = filters.category === value
                                                return (
                                                    <button
                                                        key={value}
                                                        onClick={() => setFilters(prev => ({ ...prev, category: prev.category === value ? "" : value }))}
                                                        className={`
                                                            flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition-all duration-150
                                                            ${isActive
                                                                ? "border-primary2-300 bg-primary2-50 text-primary2-800"
                                                                : "border-surface-200 bg-surface-50 text-neutral-500 hover:border-neutral-300 hover:text-neutral-700"
                                                            }
                                                        `}
                                                    >
                                                        <span className="text-sm leading-none">{emoji}</span>
                                                        {value}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    <div className="hidden sm:block h-16 w-px bg-surface-200" />

                                    {/* Location */}
                                    <div>
                                        <p className="mb-2.5 text-[10px] font-black uppercase tracking-wider text-neutral-400">Format</p>
                                        <div className="flex gap-2">
                                            {LOCATION_OPTIONS.map(({ value, label, icon }) => {
                                                const isActive = filters.locationType === value
                                                return (
                                                    <button
                                                        key={value}
                                                        onClick={() => setFilters(prev => ({ ...prev, locationType: prev.locationType === value ? "" : value }))}
                                                        className={`
                                                            flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all duration-150
                                                            ${isActive
                                                                ? "bg-primary2-900 text-white"
                                                                : "bg-surface-100 text-neutral-600 hover:bg-surface-200"
                                                            }
                                                        `}
                                                    >
                                                        <span>{icon}</span>
                                                        {label}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* â”€â”€ Content Area â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-[460px] rounded-[1.75rem] overflow-hidden relative"
                                style={{ animationDelay: `${i * 80}ms` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-surface-100 via-surface-200 to-surface-100 animate-shimmer bg-[length:200%_100%]" />
                            </div>
                        ))}
                    </div>
                ) : !data?.data?.length ? (
                    <div className="flex flex-col items-center justify-center py-28 px-4 text-center">
                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-surface-100 border border-surface-200 shadow-inner">
                            <RiSearch2Line className="text-4xl text-neutral-300" />
                        </div>
                        <h3 className="text-xl font-bold text-neutral-800 mb-2">No events found</h3>
                        <p className="text-sm text-neutral-500 max-w-xs leading-relaxed">
                            No events match your current filters. Try adjusting your criteria or clear all filters.
                        </p>
                        <button
                            onClick={clearFilters}
                            className="mt-6 rounded-xl border border-surface-300 bg-white px-6 py-2.5 text-sm font-semibold text-neutral-700 shadow-sm hover:shadow hover:bg-surface-50 transition-all"
                        >
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {data.data.map((event, i) => (
                            <FadeUpWrapper key={event._id} delay={i * 0.06}>
                                <EventPageEventCard event={event} />
                            </FadeUpWrapper>
                        ))}
                    </div>
                )}
            </div>
        </FadeUpWrapper>
    )
}
export default EventPageEvents