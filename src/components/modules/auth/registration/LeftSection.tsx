// "use client";

// import { motion } from "framer-motion";
// import { RiCalendarCheckLine } from "react-icons/ri";

// const LeftSection = () => {
//     return (
//         <section>
//             <motion.div
//                 initial={{ opacity: 0, y: 26 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.65, ease: [0.19, 1, 0.22, 1] }}
//                 className="rounded-3xl border p-7 sm:p-10"
//                 style={{
//                     background: "linear-gradient(145deg, rgba(10,61,43,0.96) 0%, rgba(5,31,21,0.94) 100%)",
//                     borderColor: "rgba(157,216,174,0.25)",
//                     boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
//                 }}
//             >
//                 <div
//                     className="mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.18em]"
//                     style={{
//                         color: "rgba(195,232,206,0.86)",
//                         borderColor: "rgba(157,216,174,0.28)",
//                         background: "rgba(10,61,43,0.34)",
//                     }}
//                 >
//                     <RiCalendarCheckLine className="text-sm" />
//                     Alumni Registration
//                 </div>

//                 <h1
//                     className="mb-5 text-4xl font-semibold leading-tight sm:text-5xl"
//                     style={{
//                         color: "var(--color-primary-50)",
//                         letterSpacing: "-0.02em",
//                     }}
//                 >
//                     Create your
//                     <br />
//                     <span style={{ color: "var(--color-gold-300)" }}>BAMHS profile</span>
//                 </h1>

//                 <p className="max-w-md text-base leading-relaxed sm:text-lg" style={{ color: "rgba(220,252,231,0.76)" }}>
//                     Submit your alumni details once, verify your email, and join the network after admin approval.
//                 </p>

//                 <div className="mt-8 space-y-3">
//                     {[
//                         "Share the profile details required by the alumni office",
//                         "Get approved and verified before accessing member features",
//                         "Build a trusted record for directory and mentorship use",
//                     ].map((point) => (
//                         <div key={point} className="flex items-center gap-3">
//                             <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--color-primary-300)" }} />
//                             <p className="text-sm sm:text-base" style={{ color: "rgba(220,252,231,0.72)" }}>
//                                 {point}
//                             </p>
//                         </div>
//                     ))}
//                 </div>
//             </motion.div>
//         </section>
//     );
// };

// export default LeftSection;













"use client";

import { motion } from "framer-motion";
import { RiShieldCheckLine } from "react-icons/ri";

const STEPS = [
    {
        n: "1",
        title: "Fill your alumni profile",
        desc: "Your name, batch year, contact, and career details — takes just a few minutes.",
    },
    {
        n: "2",
        title: "Admin verifies your identity",
        desc: "We keep the network genuine — every member is reviewed before access is granted.",
    },
    {
        n: "3",
        title: "Reconnect with your batch",
        desc: "Browse the alumni directory, find classmates, and be part of reunions and events.",
    },
];

const LeftSection = () => {
    return (
        <section>
            <motion.div
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: [0.19, 1, 0.22, 1] }}
                className="relative overflow-hidden rounded-3xl border p-8 sm:p-10 flex flex-col"
                style={{
                    background: "linear-gradient(150deg, rgba(10,61,43,0.97) 0%, rgba(5,31,21,0.95) 100%)",
                    borderColor: "rgba(157,216,174,0.18)",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.28)",
                    minHeight: "100%",
                }}
            >
                {/* Decorative inner glow */}
                <div
                    className="pointer-events-none absolute -right-14 -top-14 h-56 w-56 rounded-full"
                    style={{ background: "radial-gradient(circle, rgba(114,196,140,0.10) 0%, transparent 65%)" }}
                />

                {/* Badge */}
                <div
                    className="mb-7 inline-flex w-fit items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium uppercase tracking-[0.12em]"
                    style={{ color: "#9DD8AE", borderColor: "rgba(114,196,140,0.28)", background: "rgba(46,139,87,0.14)" }}
                >
                    <span
                        className="h-1.5 w-1.5 rounded-full animate-pulse-dot"
                        style={{ background: "#72C48C" }}
                    />
                    BAMHS Alumni Network
                </div>

                {/* Headline */}
                <h1
                    className="mb-4 font-display font-bold leading-[1.15]"
                    style={{
                        fontSize: "clamp(1.75rem, 2.6vw, 2.5rem)",
                        color: "#FDFAF2",
                    }}
                >
                    Come back to<br />
                    <span
                        // className="font-serif italic"
                        style={{
                            background: "linear-gradient(120deg, #72C48C 0%, #F59E0B 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}
                    >
                        where it all began.
                    </span>
                </h1>

                {/* Sub paragraph */}
                <p
                    className="mb-7 max-w-md text-sm leading-relaxed sm:text-base"
                    style={{ color: "rgba(220,252,231,0.66)" }}
                >
                    Your school days shaped who you are. BAMHS Alumni connects you back
                    to your batch, your memories, and the thousands of graduates who
                    walked the same halls.
                </p>

                {/* Steps */}
                <div className="mb-8 flex flex-col gap-4">
                    {STEPS.map((step) => (
                        <div key={step.n} className="flex items-start gap-3.5">
                            <div
                                className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border text-xs font-medium"
                                style={{
                                    background: "rgba(46,139,87,0.18)",
                                    borderColor: "rgba(114,196,140,0.28)",
                                    color: "#72C48C",
                                }}
                            >
                                {step.n}
                            </div>
                            <div>
                                <p className="text-sm font-medium" style={{ color: "#E8F5ED" }}>{step.title}</p>
                                <p className="mt-0.5 text-xs leading-relaxed" style={{ color: "rgba(220,252,231,0.50)" }}>
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Alumni quote */}
                <div
                    className="mt-auto flex items-center gap-3 border-t pt-5"
                    style={{ borderColor: "rgba(114,196,140,0.12)" }}
                >
                    <div
                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-medium text-white"
                        style={{ background: "linear-gradient(135deg, #2E8B57, #72C48C)" }}
                    >
                        RK
                    </div>
                    <div>
                        <p className="text-xs italic leading-relaxed" style={{ color: "rgba(220,252,231,0.54)" }}>
                            &quot;Finding my &apos;99 batch here felt like going home after 25 years.&quot;
                        </p>
                        <p className="mt-1 text-[11px] font-medium" style={{ color: "#72C48C" }}>
                            Rafiqul Karim · Batch 1999
                        </p>
                    </div>
                    <RiShieldCheckLine className="ml-auto flex-shrink-0 text-lg" style={{ color: "rgba(114,196,140,0.30)" }} />
                </div>
            </motion.div>
        </section>
    );
};

export default LeftSection