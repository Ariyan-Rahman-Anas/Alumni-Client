"use client";

import SectionLabel from "@/components/shared/SectionLabel";
import { motion } from "framer-motion";
import { RiShieldCheckLine } from "react-icons/ri";

const STEPS = [
    {
        n: "1",
        title: "Fill your alumni profile",
        desc: "Your name, batch year, contact, and career details takes just a few minutes.",
    },
    {
        n: "2",
        title: "Verify your email with OTP",
        desc: "A 6-digit code is sent to your inbox, confirming your identity before admin review.",
    },
    {
        n: "3",
        title: "Admin approves your account",
        desc: "We keep the alumni network genuine — every member is reviewed before access is granted.",
    },
    {
        n: "4",
        title: "Reconnect with your batch",
        desc: "Browse the alumni directory, find classmates, and join reunions and association events.",
    },
];

const LeftSection = () => {
    return (
        <section>
            <motion.div
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: [0.19, 1, 0.22, 1] }}
                className="relative overflow-hidden rounded-3xl rounded-b-none md:rounded-bl-3xl md:rounded-r-none border-2 border-white dark:border-gunmetal-600 border-b-0 md:border-b-2 md:border-r-0 p-6 sm:p-8 flex flex-col"
            >
                {/* Badge */}
                <SectionLabel text="BAMHS Alumni Registration" align="left" icon={<RiShieldCheckLine />}
                    className="text-primary2-200 dark:text-gunmetal-300 border-primary2-600 dark:border-gunmetal-500 capitalize"
                />

                {/* Headline */}
                <h1 className="mb-4 mt-3 font-bold leading-[1.15] text-white dark:text-gunmetal-100 text-3xl sm:text-4xl lg:text-[2.5rem]" style={{ letterSpacing: "-0.02em" }}>
                    Come back to<br />
                    <span className="text-gold-200 dark:text-gold-500">
                        where it All Began.
                    </span>
                </h1>

                <p className="mb-7 max-w-2xl leading-relaxed text-primary2-300 dark:text-gunmetal-300 text-base">
                    Your school days shaped who you are. BAMHS Alumni connects you back
                    to your batch, your memories, and the thousands of graduates who
                    walked the same halls.
                </p>

                {/* Steps */}
                <div className="flex flex-col gap-4">
                    {STEPS.map((step) => (
                        <div key={step.n} className="flex items-start gap-3.5">
                            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary2-500 dark:border-gunmetal-400 text-xs text-primary2-300 font-semibold dark:text-gunmetal-300">
                                {step.n}
                            </div>
                            <div>
                                <p className="text-base font-medium text-primary2-100 dark:text-gunmetal-200">{step.title}</p>
                                <p className="mt-0.5 text-sm leading-relaxed text-primary2-300 dark:text-gunmetal-300">
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
};
export default LeftSection;
