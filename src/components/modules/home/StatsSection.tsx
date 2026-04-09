"use client";

import { useEffect, useRef, useState } from "react";
import { FadeUpWrapper } from "@/components/Pages/Home/HomePage";
import { useGetStatsQuery } from "@/redux/apis/adminApi";
import { motion, useInView } from "framer-motion";
import { RiCalendarEventLine, RiGroupLine, RiMapPin2Line, RiSparkling2Line } from "react-icons/ri";

/* ── Animated Counter */
const AnimatedCount = ({ target = 0 }: { target: number }) => {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: "-40px" });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!inView) return;
        const duration = 1800;
        const startTime = performance.now();
        let rafId: number;
        const tick = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) rafId = requestAnimationFrame(tick);
        };
        rafId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafId);
    }, [inView, target]);

    return <span ref={ref}>{count.toLocaleString()}</span>;
};

/* ── Stat Card  */
const StatCard = ({
    value,
    label,
    icon,
    delay,
}: {
    value?: number;
    label: string;
    icon: React.ReactNode;
    delay: number;
}) => (
    <FadeUpWrapper delay={delay}>
        <motion.div
            whileHover={{ y: -8, transition: { duration: 0.28, ease: "easeOut" } }}
            className="group relative flex flex-col items-center text-center p-7 rounded-3xl border overflow-hidden"
            style={{
                background: "linear-gradient(155deg, var(--color-surface) 0%, var(--color-surface-100) 100%)",
                borderColor: "var(--color-border)",
                boxShadow: "var(--shadow-md)",
            }}
        >
            {/* Hover glow */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                    background: "radial-gradient(circle at 50% 0%, rgba(46,139,87,0.10) 0%, transparent 65%)",
                    boxShadow: "0 0 0 1px rgba(46,139,87,0.12) inset",
                }}
            />

            {/* Subtle corner accent */}
            <div
                className="absolute top-0 right-0 w-20 h-20 pointer-events-none opacity-40"
                style={{
                    background: "radial-gradient(circle at top right, rgba(46,139,87,0.12) 0%, transparent 60%)",
                }}
            />

            {/* Icon badge */}
            <div
                className="relative z-10 flex items-center justify-center w-14 h-14 rounded-xl mb-5 text-[1.4rem] transition-transform duration-300 group-hover:scale-110"
                style={{
                    background: "linear-gradient(135deg, var(--color-primary-50) 0%, var(--color-primary-100) 100%)",
                    color: "var(--color-primary-600)",
                    boxShadow: "0 4px 14px rgba(46,139,87,0.20), 0 0 0 1px rgba(46,139,87,0.10)",
                }}
            >
                {icon}
            </div>

            {/* Number + suffix */}
            <div
                className="relative z-10 font-display font-bold leading-none mb-1 tabular-nums"
                style={{ color: "var(--color-primary-800)", fontSize: "clamp(2.2rem, 4vw, 2.8rem)" }}
            >
                <AnimatedCount target={value ?? 0} />
                <span className="text-xl ml-0.5 font-semibold" style={{ color: "var(--color-primary-400)" }}>+</span>
            </div>

            {/* Gradient accent line */}
            <div
                className="relative z-10 w-10 h-[2px] rounded-full my-3 transition-all duration-300 group-hover:w-16"
                style={{ background: "linear-gradient(90deg, var(--color-primary-400), var(--color-gold-500))" }}
            />

            {/* Label */}
            <span
                className="relative z-10 text-sm font-semibold tracking-wider text-primary2-500"
            >
                {label}
            </span>
        </motion.div>
    </FadeUpWrapper>
);

/* ── StatsSection  */
const StatsSection = () => {
    const { data: statsData } = useGetStatsQuery(undefined);
    const { totalUsers, yearsOfExcellence, totalBatches, totalCountries } =
        statsData?.data.homeStats || {};

    const stats = [
        { value: totalUsers, label: "Alumni Worldwide", icon: <RiGroupLine /> },
        { value: yearsOfExcellence, label: "Years of Excellence", icon: <RiSparkling2Line /> },
        { value: totalBatches, label: "Batches & Generations", icon: <RiCalendarEventLine /> },
        { value: totalCountries, label: "Countries Represented", icon: <RiMapPin2Line /> },
    ];

    return (
        <section className="three-xl-section-setup grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {/* Cards */}
            {stats.map(({ value, label, icon }, i) => (
                <StatCard
                    key={label}
                    value={value}
                    label={label}
                    icon={icon}
                    delay={i * 0.1}
                />
            ))}
        </section>
    );
};
export default StatsSection;