"use client";

import PrimaryButton from "@/components/shared/PrimaryButton";
import SectionLabel from "@/components/shared/SectionLabel";
import { useGetHomeStatsQuery } from "@/redux/apis/statsApi";
import { motion } from "framer-motion";
import { HiArrowUpRight } from "react-icons/hi2";
import { BiDonateBlood } from "react-icons/bi";
import {
    RiGroupLine,
    RiHeartLine,
    RiHandHeartLine,
    RiShieldLine,
    RiSparkling2Line,
    RiArrowRightLine,
} from "react-icons/ri";
import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage";

/* ── Feature list */
const features = [
    {
        icon: <RiGroupLine />,
        title: "Reconnect with Batchmates",
        desc: "Find classmates from any year and reignite friendships that started in those classrooms.",
    },
    {
        icon: <RiHeartLine />,
        title: "Relive Shared Memories",
        desc: "Browse photos, events, and stories shared by alumni across every generation.",
    },
    {
        icon: <RiHandHeartLine />,
        title: "Uplift the Next Generation",
        desc: "Mentor students and fund scholarships — a promise kept to the school that made us.",
    },
    {
        icon: <RiShieldLine />,
        title: "Be a Lifesaver",
        desc: "Register as a blood donor and answer the call when a fellow BAMHSian needs you.",
    },
];

/* ── AboutSection  */
const AboutSection = () => {
    const { data: statsData } = useGetHomeStatsQuery();
    const { yearsOfExcellence, totalCountries } =
        statsData?.data || {};

    return (
        <section className="three-xl-section-setup grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* ── Left: Text  */}
            <div>
                <FadeUpWrapper>
                    {/* Badge */}
                    <SectionLabel text="Our Community" variant="pill" icon={<RiSparkling2Line />} align="left" className="dark:border-gunmetal-400 dark:text-gunmetal-200 " />

                    {/* Headline */}
                    <h2
                        className="section-heading-text-left mb-6 mt-5 text-primary2-900 dark:text-gunmetal-200 ">
                        Scattered Across the World,{" "}
                        <br className="hidden sm:block" />
                        United by{" "}
                        <span
                            className="text-primary"
                        >
                            One Address
                        </span>
                    </h2>

                    {/* Description */}
                    <div className="space-y-4 mb-8 text-gunmetal-400 dark:text-gunmetal-300 ">
                        <p>
                            We are not an institution — we are a family. A family born in the
                            classrooms of Battali Abdul Matin High School and now spread across{" "}
                            {totalCountries ? `${totalCountries}+ countries` : "the globe"}.
                            This portal is our shared home online.
                        </p>
                        <p>
                            Built by BAMHSians, for BAMHSians — a place to reconnect with old
                            friends, celebrate shared milestones, and give back to the community
                            that shaped who we are.
                        </p>
                    </div>

                    {/* Feature list */}
                    <div className="space-y-4 mb-10">
                        {features.map(({ icon, title, desc }, i) => (
                            <motion.div
                                key={title}
                                initial={{ opacity: 0, x: -16 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ duration: 0.5, delay: i * 0.09, ease: [0.19, 1, 0.22, 1] }}
                                className="flex items-start gap-4 group"
                            >
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 text-lg transition-transform duration-300 group-hover:scale-110 bg-primary2-50 dark:bg-gunmetal-900 text-primary2-600 dark:text-gunmetal-300 border border-primary2-200 dark:border-gunmetal-500 ">
                                    {icon}
                                </div>
                                <div>
                                    <p className="font-semibold text-sm mb-0.5 text-primary2-700 dark:text-gunmetal-200 ">
                                        {title}
                                    </p>
                                    <p className="text-sm text-gunmetal-400 dark:text-gunmetal-300 leading-relaxed">
                                        {desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-wrap gap-3">
                        <PrimaryButton
                            type="button"
                            title="Join the Community"
                            icon2={<RiArrowRightLine />}
                            href="/login"
                            variant="default"
                            iconSide2="right"
                            className="dark:bg-gunmetal-200  dark:text-gunmetal-900"
                        />
                        <PrimaryButton
                            type="button"
                            title="Our Full Story"
                            icon2={<HiArrowUpRight />}
                            href="/about"
                            variant="outline"
                            iconSide2="right"
                            className="dark:bg-gunmetal-900 dark:text-gunmetal-200 dark:border-gunmetal-400"
                        />
                    </div>
                </FadeUpWrapper>
            </div>

            {/* ── Right: Visual ────────────────────────────────── */}
            <FadeUpWrapper delay={0.18}>
                <div className="relative flex flex-col gap-5">

                    {/* ── Main "Alumni Hub" dark card ── */}
                    <motion.div
                        initial={{ scale: 0.97, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
                        className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#0F3C24] dark:from-gunmetal-500 to-[#051F15] dark:to-gunmetal-800" >
                        {/* Decorative grid overlay */}
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                backgroundImage:
                                    "linear-gradient(rgba(46,139,87,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(46,139,87,0.05) 1px, transparent 1px)",
                                backgroundSize: "40px 40px",
                            }}
                        />
                        {/* Ambient glows */}
                        <div
                            className="absolute -top-20 -right-20 w-72 h-72 rounded-full pointer-events-none"
                            style={{ background: "radial-gradient(circle, rgba(46,139,87,0.22) 0%, transparent 65%)" }}
                        />
                        <div
                            className="absolute -bottom-10 -left-10 w-52 h-52 rounded-full pointer-events-none"
                            style={{ background: "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 65%)" }}
                        />

                        <div className="relative z-10 p-8">
                            {/* Card header */}
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <p className="text-xs tracking-[0.15em] text-primary2-300 dark:text-gunmetal-300 mb-1"
                                    >
                                        Alumni Community Portal
                                    </p>
                                    <p className="font-display font-bold text-xl text-primary2-100 dark:text-gunmetal-200 "
                                    >
                                        BAMHS Alumni
                                    </p>
                                </div>
                                <div
                                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl text-primary2-300 dark:text-gunmetal-300 ">
                                    <RiSparkling2Line />
                                </div>
                            </div>

                            {/* Community pillars — timeline style, no nested cards */}
                            <div className="relative pl-6 space-y-6 mb-8">
                                {/* Vertical accent line */}
                                <div
                                    className="absolute left-0 top-1 bottom-1 w-[2px] rounded-full bg-gradient-to-b from-primary2-500 to-primary2-500/10 dark:from-gunmetal-200 dark:to-gunmetal-200/10 " />
                                {[
                                    {
                                        icon: <RiGroupLine />,
                                        title: "Reconnect",
                                        desc: "Find batchmates from any year, from any corner of the world.",
                                    },
                                    {
                                        icon: <RiHeartLine />,
                                        title: "Remember",
                                        desc: "Relive shared memories through photos, events, and stories.",
                                    },
                                    {
                                        icon: <RiHandHeartLine />,
                                        title: "Give Back",
                                        desc: "Scholarships, mentorship, and blood donation — for the next generation.",
                                    },
                                ].map(({ icon, title, desc }) => (
                                    <div key={title} className="flex items-start gap-3">
                                        {/* Dot on the line */}
                                        <div
                                            className="absolute -left-[5px] w-3 h-3 rounded-full border-2 mt-0.5 bg-primary2-800 dark:bg-gunmetal-800 border-primary2-400 dark:border-gunmetal-200 " />
                                        <span
                                            className="text-base shrink-0 mt-0.5 text-primary2-400 dark:text-gunmetal-300">
                                            {icon}
                                        </span>
                                        <div>
                                            <p className="font-semibold text-sm mb-0.5 text-primary2-100 dark:text-gunmetal-200">
                                                {title}
                                            </p>
                                            <p className="text-[12px] leading-relaxed text-primary2-300 dark:text-gunmetal-300 ">
                                                {desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Divider */}
                            <div className="h-px mb-6"
                                style={{ background: "rgba(46,139,87,0.16)" }} />

                            {/* Community quote */}
                            <div className="flex items-start gap-3 text-primary2-400 dark:text-gunmetal-300">
                                <RiHeartLine className="text-lg shrink-0 mt-0.5 " />
                                <p className="text-sm leading-relaxed italic ">
                                    &ldquo;More than graduates — we are a lifelong family,
                                    united by one school and one shared memory.&rdquo;
                                </p>
                            </div>

                            {/* Card footer */}
                            <div className="flex items-center justify-between mt-6 pt-5 text-xs font-semibold text-primary2-400 dark:text-gunmetal-300">
                                <p className="tracking-widest uppercase"
                                >
                                    Est. 1966 · Battali.
                                </p>
                                <span>
                                    {yearsOfExcellence ?? 0}+ yrs
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* ── Feature strip — single connected bar, not 4 separate cards ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.55, delay: 0.28, ease: [0.19, 1, 0.22, 1] }}
                        className="flex items-stretch rounded-2xl border overflow-hidden"
                        style={{
                            background: "var(--color-surface)",
                            borderColor: "var(--color-border)",
                            boxShadow: "var(--shadow-sm)",
                        }}
                    >
                        {[
                            { icon: <RiGroupLine />, label: "Batchmates" },
                            { icon: <RiHeartLine />, label: "Gallery" },
                            { icon: <RiHandHeartLine />, label: "Scholarships" },
                            { icon: <BiDonateBlood />, label: "Blood Donation" },
                        ].map(({ icon, label }, i, arr) => (
                            <div
                                key={label}
                                className="flex-1 flex flex-col items-center justify-center gap-1.5 py-3.5 group cursor-default transition-colors duration-200 hover:bg-[var(--color-primary-50)]"
                                style={{
                                    borderRight: i < arr.length - 1 ? "1px solid var(--color-border)" : "none",
                                }}
                            >
                                <span
                                    className="text-base transition-transform duration-200 group-hover:scale-110 text-primary2-400 dark:text-gunmetal-200">
                                    {icon}
                                </span>
                                <span className="text-[10px] font-semibold tracking-wide text-center leading-tight text-primary2-500 dark:text-gunmetal-300">
                                    {label}
                                </span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </FadeUpWrapper>
        </section>
    );
};
export default AboutSection;