"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import {
    RiDropFill,
    RiPhoneLine,
    RiTimeLine,
    RiHeartPulseLine,
    RiMedalLine,
    RiAlertLine,
} from "react-icons/ri";
import { BiDonateBlood } from "react-icons/bi";
import { useGetEligibleDonorsByBloodGroupQuery } from "@/redux/apis/userApi";
import type {
    IEligibleDonor,
    IEligibleDonorGroup,
} from "@/components/modules/user/profile/user-profile.types";
import SectionLabel from "@/components/shared/SectionLabel";
import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage";

/* ─── constants ──────────────────────────────────────── */

const BLOOD_GROUP_COLORS: Record<
    string,
    {
        bg: string;
        badge: string;
        badgeRing: string;
        badgeText: string;
        text: string;
        soft: string;
        ring: string;
        glow: string;
    }
> = {
    "A+": {
        bg: "bg-red-100 dark:bg-red-950/40",
        badge: "bg-red-500/15 dark:bg-red-500/20",
        badgeRing: "ring-red-300 dark:ring-red-500/30",
        badgeText: "text-red-700 dark:text-red-300",
        text: "text-red-600 dark:text-red-400",
        soft: "bg-red-200/40 dark:bg-red-900/20",
        ring: "ring-red-300/60 dark:ring-red-500/30",
        glow: "hover:shadow-red-500/20",
    },

    "A-": {
        bg: "bg-pink-100 dark:bg-pink-950/40",
        badge: "bg-pink-500/15 dark:bg-pink-500/20",
        badgeRing: "ring-pink-300 dark:ring-pink-500/30",
        badgeText: "text-pink-700 dark:text-pink-300",
        text: "text-pink-600 dark:text-pink-400",
        soft: "bg-pink-200/40 dark:bg-pink-900/20",
        ring: "ring-pink-300/60 dark:ring-pink-500/30",
        glow: "hover:shadow-pink-500/20",
    },

    "B+": {
        bg: "bg-orange-100 dark:bg-orange-950/40",
        badge: "bg-orange-500/15 dark:bg-orange-500/20",
        badgeRing: "ring-orange-300 dark:ring-orange-500/30",
        badgeText: "text-orange-700 dark:text-orange-300",
        text: "text-orange-600 dark:text-orange-400",
        soft: "bg-orange-200/40 dark:bg-orange-900/20",
        ring: "ring-orange-300/60 dark:ring-orange-500/30",
        glow: "hover:shadow-orange-500/20",
    },

    "B-": {
        bg: "bg-amber-100 dark:bg-amber-950/40",
        badge: "bg-amber-500/15 dark:bg-amber-500/20",
        badgeRing: "ring-amber-300 dark:ring-amber-500/30",
        badgeText: "text-amber-700 dark:text-amber-300",
        text: "text-amber-700 dark:text-amber-400",
        soft: "bg-amber-200/40 dark:bg-amber-900/20",
        ring: "ring-amber-300/60 dark:ring-amber-500/30",
        glow: "hover:shadow-amber-500/20",
    },

    "AB+": {
        bg: "bg-purple-100 dark:bg-purple-950/40",
        badge: "bg-purple-500/15 dark:bg-purple-500/20",
        badgeRing: "ring-purple-300 dark:ring-purple-500/30",
        badgeText: "text-purple-700 dark:text-purple-300",
        text: "text-purple-600 dark:text-purple-400",
        soft: "bg-purple-200/40 dark:bg-purple-900/20",
        ring: "ring-purple-300/60 dark:ring-purple-500/30",
        glow: "hover:shadow-purple-500/20",
    },

    "AB-": {
        bg: "bg-indigo-100 dark:bg-indigo-950/40",
        badge: "bg-indigo-500/15 dark:bg-indigo-500/20",
        badgeRing: "ring-indigo-300 dark:ring-indigo-500/30",
        badgeText: "text-indigo-700 dark:text-indigo-300",
        text: "text-indigo-600 dark:text-indigo-400",
        soft: "bg-indigo-200/40 dark:bg-indigo-900/20",
        ring: "ring-indigo-300/60 dark:ring-indigo-500/30",
        glow: "hover:shadow-indigo-500/20",
    },

    "O+": {
        bg: "bg-emerald-100 dark:bg-emerald-950/40",
        badge: "bg-emerald-500/15 dark:bg-emerald-500/20",
        badgeRing: "ring-emerald-300 dark:ring-emerald-500/30",
        badgeText: "text-emerald-700 dark:text-emerald-300",
        text: "text-emerald-600 dark:text-emerald-400",
        soft: "bg-emerald-200/40 dark:bg-emerald-900/20",
        ring: "ring-emerald-300/60 dark:ring-emerald-500/30",
        glow: "hover:shadow-emerald-500/20",
    },

    "O-": {
        bg: "bg-cyan-100 dark:bg-cyan-950/40",
        badge: "bg-cyan-500/15 dark:bg-cyan-500/20",
        badgeRing: "ring-cyan-300 dark:ring-cyan-500/30",
        badgeText: "text-cyan-700 dark:text-cyan-300",
        text: "text-cyan-600 dark:text-cyan-400",
        soft: "bg-cyan-200/40 dark:bg-cyan-900/20",
        ring: "ring-cyan-300/60 dark:ring-cyan-500/30",
        glow: "hover:shadow-cyan-500/20",
    },
};

/* ─── FadeUp helper ───────────────────────────────────── */

const FadeUp = ({
    children,
    delay = 0,
    className = "",
}: {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}) => {
    const ref = useRef(null);

    const inView = useInView(ref, {
        once: true,
        margin: "-60px",
    });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
                duration: 0.55,
                delay,
                ease: [0.19, 1, 0.22, 1],
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

/* ─── Donor card ──────────────────────────────────────── */

const DonorCard = ({
    donor,
    rank,
    colors,
    delay,
}: {
    donor: IEligibleDonor;
    rank: number;
    colors: (typeof BLOOD_GROUP_COLORS)[string];
    delay: number;
}) => {
    const isTop = rank === 0;

    const rankBadgeStyles = [
        {
            bg: colors.soft,
            ring: colors.ring,
            icon: colors.text,
            scale: "scale-110",
        },

        {
            bg: colors.soft,
            ring: colors.ring,
            icon: colors.text,
            scale: "scale-100 opacity-90",
        },

        {
            bg: colors.soft,
            ring: colors.ring,
            icon: colors.text,
            scale: "scale-95 opacity-80",
        },
    ];

    const rankStyle =
        rankBadgeStyles[rank] ?? rankBadgeStyles[2];

    return (
        <FadeUp delay={delay}>
            <div
                className={`
                    relative rounded-2xl border
                    ${colors.bg}
                    border-white/20 dark:border-white/10
                    p-4 flex flex-col gap-3
                    transition-all duration-300
                    hover:scale-[1.02]
                    hover:shadow-2xl
                    ${colors.glow}
                    backdrop-blur-sm
                    ${isTop
                        ? "shadow-lg shadow-black/10 dark:shadow-black/20"
                        : ""}
                `}
            >
                {/* Rank badge */}
                <div
                    className={`
                        absolute -top-2.5 -right-2.5
                        flex items-center justify-center
                        h-8 w-8 rounded-full
                        ring-2
                        shadow-lg
                        backdrop-blur-sm
                        transition-all duration-300
                        ${rankStyle.bg}
                        ${rankStyle.ring}
                        ${rankStyle.scale}
                    `}
                >
                    <RiMedalLine
                        className={`
                            text-base
                            ${rankStyle.icon}
                        `}
                    />
                </div>

                {/* Top row — avatar + name */}
                <div className="flex items-center gap-3">
                    <div
                        className={`
                            relative h-12 w-12 flex-shrink-0 rounded-full overflow-hidden
                            ring-2 ${colors.ring}`}
                    >
                        {donor.imageUrl ? (
                            <Image
                                src={donor.imageUrl}
                                alt={donor.name}
                                width={800}
                                height={800}
                                className="object-cover "
                            />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center text-gunmetal-300 dark:text-gunmetal-400 font-bold text-sm">
                                {donor.name.slice(0, 2).toUpperCase()}
                            </div>
                        )}
                    </div>

                    <div className="min-w-0">
                        <p className="font-semibold text-sm truncate leading-tight">
                            {donor.name}
                        </p>

                        <p className={`text-xs mt-0.5 font-medium ${colors.text}`}>
                            {donor.bloodDonateCount} donation
                            {donor.bloodDonateCount !== 1 ? "s" : ""}
                        </p>
                    </div>
                </div>

                {/* Days since donation */}
                <div
                    className={`
                        flex items-center gap-1.5 rounded-xl px-3 py-2
                        ${colors.soft}
                        border border-white/20 dark:border-white/10
                    `}
                >
                    <RiTimeLine
                        className={`text-base flex-shrink-0 ${colors.text}`}
                    />

                    <div>
                        <p className="text-surface-900 dark:text-white text-sm font-bold leading-tight">
                            {donor.daysSinceLastDonation} days
                        </p>

                        <p className="text-surface-500 text-xs text-gunmetal-500 dark:text-gunmetal-200 leading-tight">
                            since last donation
                        </p>
                    </div>
                </div>

                {/* Contact */}
                <a
                    href={`tel:${donor.phone}`}
                    className={`
                        flex items-center gap-2 rounded-xl px-3 py-2
                        ${colors.soft}
                        border border-white/20 dark:border-white/10
                        hover:bg-white/40 dark:hover:bg-white/10
                        transition-colors group
                    `}
                >
                    <RiPhoneLine
                        className={`text-base flex-shrink-0 ${colors.text}`}
                    />

                    <span className="text-surface-700 dark:text-white/80 text-xs font-mono group-hover:text-surface-900 dark:group-hover:text-white transition-colors truncate">
                        {donor.phone}
                    </span>
                </a>
            </div>
        </FadeUp>
    );
};

/* ─── Blood group card ────────────────────────────────── */

const BloodGroupCard = ({
    group,
    index,
}: {
    group: IEligibleDonorGroup;
    index: number;
}) => {
    const colors =
        BLOOD_GROUP_COLORS[group.bloodGroup] ??
        BLOOD_GROUP_COLORS["O+"];

    return (
        <FadeUp delay={index * 0.07} className="flex flex-col gap-3">
            {/* Header */}
            <div className="flex items-center gap-3 text-gunmetal-400 dark:text-gunmetal-300">
                <div
                    className={`
                        flex items-center justify-center
                        h-11 w-11 rounded-full
                        ring-2
                        shadow-sm
                        backdrop-blur-sm
                        ${colors.badge}
                        ${colors.badgeRing}
                    `}
                >
                    <span
                        className={`
                            text-sm font-black tracking-tight
                            ${colors.badgeText}
                        `}
                    >
                        {group.bloodGroup}
                    </span>
                </div>

                <div>
                    <p className="text-sm font-semibold">
                        Blood Group{" "}
                        <span className={colors.text}>
                            {group.bloodGroup}
                        </span>
                    </p>

                    <p className="text-xs">
                        {group.topDonors.length} eligible donor
                        {group.topDonors.length !== 1 ? "s" : ""}
                    </p>
                </div>
            </div>

            {/* Donor cards */}
            <div className="flex flex-col gap-3">
                {group.topDonors.map((donor, rank) => (
                    <DonorCard
                        key={donor._id}
                        donor={donor}
                        rank={rank}
                        colors={colors}
                        delay={index * 0.07 + rank * 0.05}
                    />
                ))}
            </div>
        </FadeUp>
    );
};

/* ─── Skeleton ────────────────────────────────────────── */

const SkeletonCard = () => (
    <div className="flex flex-col gap-3 animate-pulse">
        <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-surface-200 dark:bg-surface-700" />

            <div className="flex flex-col gap-1.5">
                <div className="h-3.5 w-24 rounded bg-surface-200 dark:bg-surface-700" />
                <div className="h-3 w-16 rounded bg-surface-200 dark:bg-surface-700" />
            </div>
        </div>

        {[0, 1, 2].map((i) => (
            <div
                key={i}
                className="rounded-2xl border border-surface-200/60 dark:border-surface-700/60 p-4 flex flex-col gap-3 bg-surface-100 dark:bg-surface-800"
            >
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-surface-200 dark:bg-surface-700" />

                    <div className="flex flex-col gap-1.5 flex-1">
                        <div className="h-3.5 w-3/4 rounded bg-surface-200 dark:bg-surface-700" />
                        <div className="h-3 w-1/2 rounded bg-surface-200 dark:bg-surface-700" />
                    </div>
                </div>

                <div className="h-10 rounded-xl bg-surface-200 dark:bg-surface-700" />
                <div className="h-10 rounded-xl bg-surface-200 dark:bg-surface-700" />
            </div>
        ))}
    </div>
);

/* ─── Main component ──────────────────────────────────── */

const EligibleDonorsByBloodGroup = () => {
    const { data, isLoading, isError } =
        useGetEligibleDonorsByBloodGroupQuery();

    const groups = data?.data ?? [];

    return (
        <section className="w-full space-y-8 three-xl-section-setup">
            {/* Section header */}
            <FadeUpWrapper delay={0.02}>
                <SectionLabel text="Emergency blood donors" align="left" className="dark:border-gunmetal-400 dark:text-gunmetal-200 " icon={<RiHeartPulseLine />} />

                <h2
                    className="section-heading-text-left mb-6 mt-5 text-primary2-900 dark:text-gunmetal-200 ">
                    Donors,  who are <span className="text-primary">
                        Highly Eligible {" "}
                    </span>
                    <br className="hidden sm:block" />
                    to donate now
                </h2>

                <p className="text-gunmetal-400 dark:text-gunmetal-300 ">
                    Donors eligible after 3-month recovery —
                    sorted by longest wait
                </p>
            </FadeUpWrapper>

            {/* Info strip */}
            <FadeUpWrapper delay={0.05} className="flex flex-col md:flex-row items-end md:items-center justify-between px-5 py-1.5 rounded-2xl shadow gap-4">
                <div className="flex flex-wrap gap-4 text-sm dark:text-gunmetal-300">
                    <div className="flex items-center gap-2">
                        <BiDonateBlood className="text-danger" />
                        <span>Top 3 per blood group</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <RiTimeLine className="text-info" />
                        <span>3+ months since last donation</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <RiDropFill className="text-danger" />
                        <span>Ranked by days since donation</span>
                    </div>
                </div>

                <div className="sm:ml-auto flex items-center gap-1.5 min-w-fit ">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary2-500 dark:bg-primary opacity-75" />

                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary2-500 dark:bg-primary" />
                    </span>
                    <span className="text-xs font-medium text-primary2-500 dark:text-primary">
                        Live Eligibility
                    </span>
                </div>
            </FadeUpWrapper>

            {/* Content */}
            {isError && (
                <FadeUp>
                    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                        <RiAlertLine className="text-4xl text-rose-400" />

                        <p className="text-surface-600 dark:text-surface-400 font-medium">
                            Failed to load eligible donors
                        </p>
                    </div>
                </FadeUp>
            )}

            {!isError && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {isLoading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))
                    ) : groups.length === 0 ? (
                        <FadeUp className="col-span-full">
                            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                                <BiDonateBlood className="text-5xl text-surface-300 dark:text-surface-600" />

                                <p className="text-surface-500 dark:text-surface-400 font-medium">
                                    No eligible donors at this time
                                </p>

                                <p className="text-sm text-surface-400 dark:text-surface-500">
                                    Check back later — donors become eligible
                                    after 3 months
                                </p>
                            </div>
                        </FadeUp>
                    ) : (
                        groups.map((group, i) => (
                            <BloodGroupCard
                                key={group.bloodGroup}
                                group={group}
                                index={i}
                            />
                        ))
                    )}
                </div>
            )}
        </section>
    );
};

export default EligibleDonorsByBloodGroup;