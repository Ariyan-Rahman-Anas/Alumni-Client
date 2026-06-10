"use client";

import { motion } from "framer-motion";
import {
    RiUserHeartLine,
    RiScalesLine,
    RiHeartPulseLine,
    RiTimeLine,
    RiCheckboxCircleLine,
    RiCloseCircleLine,
    RiInformationLine,
    RiDropLine,
} from "react-icons/ri";
import { MdOutlineBloodtype } from "react-icons/md";
import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage";
import SectionLabel from "@/components/shared/SectionLabel";

/* ”€”€ Data ”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€ */

const eligibilityCards = [
    {
        icon: <RiUserHeartLine className="text-2xl" />,
        title: "Age",
        color: "rose",
        rows: [
            { label: "Minimum age", value: "18 years", ok: true },
            { label: "Maximum age", value: "65 years", ok: true },
            { label: "Under 18", value: "Not eligible", ok: false },
            { label: "Over 65 (new donor)", value: "Not eligible", ok: false },
        ],
    },
    {
        icon: <RiScalesLine className="text-2xl" />,
        title: "Weight & Vitals",
        color: "amber",
        rows: [
            { label: "Minimum weight", value: "‰¥ 50 kg", ok: true },
            { label: "Blood pressure", value: "90/60 “ 160/100 mmHg", ok: true },
            { label: "Pulse", value: "60 “ 100 bpm (regular)", ok: true },
            { label: "Temperature", value: "‰¤ 37.5 °C", ok: true },
        ],
    },
    {
        icon: <MdOutlineBloodtype className="text-2xl" />,
        title: "Haemoglobin",
        color: "red",
        rows: [
            { label: "Male", value: "‰¥ 13.5 g/dL", ok: true },
            { label: "Female", value: "‰¥ 12.5 g/dL", ok: true },
            { label: "Below threshold", value: "Deferred", ok: false },
        ],
    },
    {
        icon: <RiTimeLine className="text-2xl" />,
        title: "Donation Frequency",
        color: "emerald",
        rows: [
            { label: "Male interval", value: "Every 90 days (3 months)", ok: true },
            { label: "Male max / year", value: "4 times", ok: true },
            { label: "Female interval", value: "Every 120 days (4 months)", ok: true },
            { label: "Female max / year", value: "3 times", ok: true },
        ],
    },
];

const disqualifiers = [
    "HIV, Hepatitis B or C (any time)",
    "Cancer or blood disorders",
    "Currently pregnant or breastfeeding",
    "Received a blood transfusion in the last 12 months",
    "Major surgery within the past 6 months",
    "Malaria in the last 3 years",
    "Fever, flu or cold in the past 7 days",
    "Tattoo or piercing in the last 6 months",
    "Alcohol consumption in the past 24 hours",
    "Certain medications (consult hospital)",
];

const processSteps = [
    {
        step: "01",
        title: "Registration",
        desc: "Fill in your profile and mark yourself as an interested blood donor.",
    },
    {
        step: "02",
        title: "Health Screening",
        desc: "Quick check of haemoglobin, blood pressure, weight, and donation history on the day of donation.",
    },
    {
        step: "03",
        title: "Donation",
        desc: "The whole-blood collection takes 8“10 minutes. Total visit is about 45“60 minutes.",
    },
    {
        step: "04",
        title: "Recovery & Re-entry",
        desc: "Rest for 15 minutes, have refreshments, then wait the required interval before your next donation.",
    },
];

/* ”€”€ Colour maps ”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€ */
const COLOR_MAP: Record<string, { bg: string; border: string; icon: string; badge: string }> = {
    rose: {
        bg: "bg-rose-50 dark:bg-rose-950/30",
        border: "border-rose-200 dark:border-rose-800",
        icon: "text-rose-600",
        badge: "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300",
    },
    amber: {
        bg: "bg-amber-50 dark:bg-amber-950/30",
        border: "border-amber-200 dark:border-amber-800",
        icon: "text-amber-600",
        badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
    },
    red: {
        bg: "bg-red-50 dark:bg-red-950/30",
        border: "border-red-200 dark:border-red-800",
        icon: "text-red-600",
        badge: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
    },
    emerald: {
        bg: "bg-primary2-50 dark:bg-primary2-950/30",
        border: "border-primary2-200 dark:border-primary2-800",
        icon: "text-primary2-600",
        badge: "bg-primary2-100 text-primary2-700 dark:bg-primary2-900/50 dark:text-primary2-300",
    },
};

/* ”€”€ Component ”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€ */
const BloodDonationCriteria = () => {
    return (
        <section className="three-xl-section-setup space-y-16">
            {/* ”€”€ Section heading ”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€ */}
            <FadeUpWrapper className="text-center">
                <SectionLabel
                    text="Who can donate?"
                    align="center"
                    icon={<RiDropLine />}
                    className="text-danger-dark border-danger-dark/30"
                />
                <h2 className="section-heading-text-center mt-5 mb-2 text-primary2-900 dark:text-gunmetal-200">
                    Blood Donation{" "}
                    <span className="text-danger-dark">Eligibility Criteria</span>
                </h2>
                <p className="text-gunmetal-400 dark:text-gunmetal-300 max-w-xl mx-auto">
                    Based on WHO & Bangladesh National Blood Transfusion guidelines. Meeting these criteria ensures the safety of both donor and recipient.
                </p>
            </FadeUpWrapper>

            {/* ”€”€ Eligibility cards ”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {eligibilityCards.map(({ icon, title, color, rows }, i) => {
                    const c = COLOR_MAP[color];
                    return (
                        <motion.div
                            key={title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08, duration: 0.45 }}
                            className={`rounded-2xl border p-5 ${c.bg} ${c.border}`}
                        >
                            {/* Card header */}
                            <div className="flex items-center gap-3 mb-4">
                                <span className={`p-2 rounded-xl ${c.badge}`}>
                                    <span className={c.icon}>{icon}</span>
                                </span>
                                <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
                            </div>

                            {/* Rows */}
                            <ul className="space-y-2.5">
                                {rows.map(({ label, value, ok }) => (
                                    <li key={label} className="flex items-start gap-2">
                                        {ok ? (
                                            <RiCheckboxCircleLine className="text-primary2-500 text-base shrink-0 mt-0.5" />
                                        ) : (
                                            <RiCloseCircleLine className="text-red-400 text-base shrink-0 mt-0.5" />
                                        )}
                                        <div className="min-w-0">
                                            <p className="text-xs text-muted-foreground">{label}</p>
                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{value}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    );
                })}
            </div>

            {/* ”€”€ Disqualifiers ”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€ */}
            <FadeUpWrapper>
                <div className="rounded-2xl border border-red-200 bg-red-50/60 dark:bg-red-950/20 dark:border-red-900 p-6 md:p-8">
                    <div className="flex items-center gap-2.5 mb-5">
                        <RiCloseCircleLine className="text-red-500 text-xl shrink-0" />
                        <h3 className="font-semibold text-red-900 dark:text-red-300">
                            Temporary or Permanent Disqualifiers
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-2">
                        {disqualifiers.map((item) => (
                            <div key={item} className="flex items-start gap-2">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                                <p className="text-sm text-red-800 dark:text-red-300">{item}</p>
                            </div>
                        ))}
                    </div>
                    <p className="mt-4 text-xs text-muted-foreground flex items-center gap-1.5">
                        <RiInformationLine className="text-base shrink-0" />
                        Some conditions are temporary deferral (e.g. illness, travel, medication). Always consult the blood bank officer on the day of donation.
                    </p>
                </div>
            </FadeUpWrapper>

            {/* ”€”€ Process steps ”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€ */}
            <FadeUpWrapper>
                <div className="flex items-center gap-2.5 mb-6">
                    <RiHeartPulseLine className="text-rose-600 text-xl shrink-0" />
                    <h3 className="font-semibold text-gray-900 dark:text-gunmetal-200">Donation Process</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {processSteps.map(({ step, title, desc }, i) => (
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.07 }}
                            className="rounded-xl border border-rose-200 bg-rose-50/60 dark:bg-rose-950/20 dark:border-rose-900 p-5"
                        >
                            <p className="text-3xl font-black text-rose-200 dark:text-rose-900 select-none">{step}</p>
                            <p className="text-sm font-semibold text-rose-900 dark:text-rose-300 mt-2 mb-1">{title}</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                        </motion.div>
                    ))}
                </div>
            </FadeUpWrapper>
        </section>
    );
};

export default BloodDonationCriteria;
