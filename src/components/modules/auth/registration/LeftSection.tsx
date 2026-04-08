"use client";

import { motion } from "framer-motion";
import { RiShieldCheckLine } from "react-icons/ri";

const STEPS = [
    {
        n: "1",
        title: "Fill your alumni profile",
        desc: "Your name, batch year, contact, and career details � takes just a few minutes.",
    },
    {
        n: "2",
        title: "Verify your email with OTP",
        desc: "A 6-digit code is sent to your inbox, confirming your identity before admin review.",
    },
    {
        n: "3",
        title: "Admin approves your account",
        desc: "We keep the alumni network genuine � every member is reviewed before access is granted.",
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
                className="relative overflow-hidden rounded-3xl border border-primary2-700/20 p-8 sm:p-10 flex flex-col"
                style={{
                    background: "linear-gradient(150deg, rgba(10,61,43,0.97) 0%, rgba(5,31,21,0.95) 100%)",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.28)",
                    minHeight: "100%",
                }}
            >
                {/* Decorative glow */}
                <div className="pointer-events-none absolute -right-14 -top-14 h-56 w-56 rounded-full bg-primary2-400/10" />

                {/* Badge */}
                <div className="mb-7 inline-flex w-fit items-center gap-2 rounded-full border border-primary2-300/30 bg-primary2-500/15 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.12em] text-primary2-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary2-300 animate-pulse" />
                    BAMHS Alumni Registration
                </div>

                {/* Headline */}
                <h1 className="mb-4 font-bold leading-[1.15] text-surface text-3xl sm:text-4xl lg:text-[2.5rem]" style={{ letterSpacing: "-0.02em" }}>
                    Come back to<br />
                    <span style={{
                        background: "linear-gradient(120deg, #72C48C 0%, #F59E0B 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                    }}>
                        where it all began.
                    </span>
                </h1>

                <p className="mb-7 max-w-md text-sm leading-relaxed text-emerald-100/65 sm:text-base">
                    Your school days shaped who you are. BAMHS Alumni connects you back
                    to your batch, your memories, and the thousands of graduates who
                    walked the same halls.
                </p>

                {/* Steps */}
                <div className="mb-8 flex flex-col gap-4">
                    {STEPS.map((step) => (
                        <div key={step.n} className="flex items-start gap-3.5">
                            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary2-300/30 bg-primary2-500/18 text-xs font-medium text-primary2-300">
                                {step.n}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-primary2-50">{step.title}</p>
                                <p className="mt-0.5 text-xs leading-relaxed text-emerald-100/50">
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Alumni quote */}
                <div className="mt-auto flex items-center gap-3 border-t border-primary2-400/12 pt-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary2-500 to-primary2-300 text-sm font-semibold text-white">
                        RK
                    </div>
                    <div>
                        <p className="text-xs italic leading-relaxed text-emerald-100/55">
                            &quot;Finding my &apos;99 batch here felt like going home after 25 years.&quot;
                        </p>
                        <p className="mt-1 text-[11px] font-medium text-primary2-300">
                            Rafiqul Karim - Batch 1999
                        </p>
                    </div>
                    <RiShieldCheckLine className="ml-auto shrink-0 text-lg text-primary2-300/30" />
                </div>
            </motion.div>
        </section>
    );
};

export default LeftSection;
