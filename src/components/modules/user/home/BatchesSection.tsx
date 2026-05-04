"use client";

import { useGetHomeStatsQuery } from "@/redux/apis/statsApi";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { motion } from "framer-motion";
import Link from "next/link";
import { RiArrowRightLine, RiGroupLine, RiFlaskLine, RiBarChartLine, RiMicroscopeLine, RiStore2Line, RiPaletteLine } from "react-icons/ri";
import { HiArrowUpRight } from "react-icons/hi2";
import SectionLabel from "@/components/shared/SectionLabel";
import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage";

/* ── Batch Card  */
const BatchCard = ({
    year,
    approved,
    scienceCount,
    commerceCount,
    artsCount,
    delay,
}: {
    year: number;
    approved: number;
    scienceCount: number;
    commerceCount: number;
    artsCount: number;
    delay: number;
}) => {
    const total = scienceCount + commerceCount + artsCount || 1;
    const sciPct = Math.round((scienceCount / total) * 100);
    const comPct = Math.round((commerceCount / total) * 100);
    const artPct = 100 - sciPct - comPct;

    const hasData = approved > 0;

    const depts = [
        { label: "Science", count: scienceCount, pct: sciPct, color: "#4DB472", icon: <RiMicroscopeLine /> },
        { label: "Commerce", count: commerceCount, pct: comPct, color: "#F59E0B", icon: <RiStore2Line /> },
        { label: "Arts", count: artsCount, pct: artPct, color: "#9DD8AE", icon: <RiPaletteLine /> },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay, ease: [0.19, 1, 0.22, 1] }}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
        >
            <Link href="/batches" className="block group h-full">
                <div
                    className="relative overflow-hidden rounded-2xl h-full flex flex-col"
                    style={{
                        background: "rgba(15,60,36,0.55)",
                        border: "1px solid rgba(46,139,87,0.20)",
                        backdropFilter: "blur(8px)",
                    }}
                >
                    {/* Top hover glow */}
                    <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                        style={{
                            background: "radial-gradient(ellipse at 50% 0%, rgba(46,139,87,0.18) 0%, transparent 65%)",
                        }}
                    />

                    {/* Stacked proportion bar at top */}
                    <div className="flex h-1 w-full overflow-hidden">
                        {hasData ? depts.map(({ label, pct, color }) => (
                            <motion.div
                                key={label}
                                initial={{ width: 0 }}
                                whileInView={{ width: `${pct}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, delay: delay + 0.15, ease: "easeOut" }}
                                style={{ background: color, height: "100%" }}
                            />
                        )) : (
                            <div className="w-full h-full" style={{ background: "rgba(46,139,87,0.20)" }} />
                        )}
                    </div>

                    <div className="relative z-10 p-5 flex flex-col flex-1">
                        {/* Year + total */}
                        <div className="flex items-start justify-between mb-5">
                            <div>
                                <p
                                    className="font-display font-bold leading-none text-primary2-100 dark:text-primary "
                                    style={{
                                        fontSize: "clamp(2rem, 4vw, 2.4rem)",
                                        letterSpacing: "-0.03em",
                                    }}>
                                    {year}
                                </p>
                                <div className="flex items-center gap-1 mt-1 text-primary2-300 dark:text-gunmetal-300">
                                    <RiGroupLine className="text-xs"
                                    />
                                    <span className="text-xs font-medium"
                                    >
                                        {hasData ? `${approved} alumni` : "Be the first"}
                                    </span>
                                </div>
                            </div>
                            <HiArrowUpRight
                                className="text-base mt-1 opacity-0 group-hover:opacity-100 transition-all duration-200"
                                style={{ color: "var(--color-primary-400)" }}
                            />
                        </div>

                        {/* Department counts */}
                        {hasData ? (
                            <div className="space-y-2.5 flex-1">
                                {depts.map(({ label, count, color, icon }) => (
                                    <div key={label} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="text-xs"
                                                style={{ color }}
                                            >
                                                {icon}
                                            </span>
                                            <span
                                                className="text-xs text-primary2-400 dark:text-gunmetal-300 font-medium"
                                            >
                                                {label}
                                            </span>
                                        </div>
                                        <span
                                            className="font-display font-bold text-sm tabular-nums"
                                            style={{ color }}
                                        >
                                            {count}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs italic flex-1 text-primary2-400 dark:text-gunmetal-300 ">
                                No alumni registered yet
                            </p>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

/* ── BatchesSection ───────────────────────────────────────── */
const BatchesSection = () => {
    const { data: statsData } = useGetHomeStatsQuery();
    const batches = statsData?.data.batchesSection ?? [];

    return (
        <section
            className="overflow-hidden"
            style={{ background: "linear-gradient(160deg, #0A3D2B 0%, #051F15 100%)" }}
        >
            {/* Subtle grid overlay */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(46,139,87,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(46,139,87,0.05) 1px, transparent 1px)",
                    backgroundSize: "52px 52px",
                }}
            />

            <div className="three-xl-section-setup relative z-10">
                {/* ── Header ── */}
                <FadeUpWrapper className="mb-14">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 ">
                        <div>
                            <SectionLabel
                                text="Generations of BAMHSians"
                                className="text-primary2-100 border-primary2-700 dark:border-gunmetal-400 dark:text-gunmetal-200 "
                                icon={<RiFlaskLine />} align="left"/>
                            <h2
                                className="section-heading-text-left text-primary2-50 dark:text-gunmetal-200 mt-5">
                                Every year tells{" "}
                                <span className="text-primary2-300 dark:text-primary"
                                >
                                    a Story
                                </span>
                            </h2>
                            <p
                                className="mt-3 text-base max-w-lg leading-relaxed text-primary2-300 dark:text-gunmetal-300">
                                Swipe through graduating classes — explore who studied what, and where
                                your generation stands in the BAMHS lineage.
                            </p>
                        </div>

                        {/* Legend */}
                        <div className="flex items-center gap-4 shrink-0">
                            {[
                                { color: "#4DB472", label: "Science", icon: <RiMicroscopeLine /> },
                                { color: "#F59E0B", label: "Commerce", icon: <RiStore2Line /> },
                                { color: "#9DD8AE", label: "Arts", icon: <RiPaletteLine /> },
                            ].map(({ color, label, icon }) => (
                                <div key={label} className="flex items-center gap-1.5">
                                    <span className="text-sm" style={{ color }}>{icon}</span>
                                    <span className="text-xs font-medium"
                                        style={{ color: color }}
                                    >
                                        {label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </FadeUpWrapper>

                {/* ── Carousel ── */}
                <FadeUpWrapper delay={0.12}>
                    {batches.length > 0 ? (
                        <Carousel
                            opts={{ align: "start", loop: true, dragFree: true }}
                            className="w-full"
                        >
                            <CarouselContent className="-ml-4">
                                {batches.map((batch, i) => (
                                    <CarouselItem
                                        key={batch.year}
                                        className="pl-4 basis-[78%] sm:basis-[46%] md:basis-[32%] lg:basis-[23%]"
                                    >
                                        <BatchCard
                                            year={batch.year}
                                            approved={batch.approved}
                                            scienceCount={batch.scienceCount}
                                            commerceCount={batch.commerceCount}
                                            artsCount={batch.artsCount}
                                            delay={i * 0.04}
                                        />
                                    </CarouselItem>
                                ))}
                            </CarouselContent>

                            {/* Custom dark-themed nav */}
                            <div className="flex items-center justify-between mt-8">
                                <Link
                                    href="/batches"
                                    className="inline-flex items-center gap-2 text-sm font-medium transition-colors duration-200 hover:opacity-80 text-primary2-300 dark:text-gunmetal-300">
                                    Browse all batches <RiArrowRightLine />
                                </Link>

                                <div className="flex gap-2">
                                    <CarouselPrevious
                                        className="static translate-y-0 h-10 w-10 rounded-full transition-colors duration-200 text-primary2-100 dark:text-gunmetal-200 bg-primary2-500 dark:bg-gunmetal-500 hover:bg-primary2-600 dark:hover:bg-gunmetal-600 hover:text-surface"
                                    />
                                    <CarouselNext
                                        className="static translate-y-0 h-10 w-10 rounded-full transition-colors duration-200 text-primary2-100 dark:text-gunmetal-200 bg-primary2-500 dark:bg-gunmetal-500 hover:bg-primary2-600 dark:hover:bg-gunmetal-600 hover:text-surface"
                                    />
                                </div>
                            </div>
                        </Carousel>
                    ) : (
                        /* Skeleton shimmer while loading */
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-44 rounded-2xl animate-pulse"
                                    style={{ background: "rgba(46,139,87,0.08)" }}
                                />
                            ))}
                        </div>
                    )}
                </FadeUpWrapper>

                {/* ── Bottom insight strip ── */}
                <FadeUpWrapper delay={0.22}>
                    <div
                        className="mt-10 flex flex-wrap items-center gap-6 px-6 py-4 rounded-2xl"
                        style={{
                            background: "rgba(46,139,87,0.07)",
                            border: "1px solid rgba(46,139,87,0.14)",
                        }}
                    >
                        <RiBarChartLine className="text-lg shrink-0 text-primary2-200 dark:text-gunmetal-200 " />
                        <p className="text-sm leading-relaxed flex-1 text-primary2-200 dark:text-gunmetal-200 ">
                            Each batch card shows the <span className="text-primary2-300 dark:text-gunmetal-300 " >department split</span> of alumni
                            registered on this portal — Science, Commerce &amp; Arts — giving every
                            generation a distinct identity beyond just a graduation year.
                        </p>
                    </div>
                </FadeUpWrapper>
            </div>
        </section>
    );
};
export default BatchesSection;