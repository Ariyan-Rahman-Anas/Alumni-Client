"use client"

import { motion } from "framer-motion"
import { RiLock2Line } from "react-icons/ri"

const LeftSection = () => {
    return (
        <section>
            <motion.div
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: [0.19, 1, 0.22, 1] }}
                className="rounded-3xl border p-7 sm:p-10"
                style={{
                    background: "linear-gradient(145deg, rgba(46,139,87,0.18) 0%, rgba(10,61,43,0.52) 100%)",
                    borderColor: "rgba(157,216,174,0.25)",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
                }}
            >
                <div className="mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.18em]"
                    style={{
                        color: "rgba(195,232,206,0.86)",
                        borderColor: "rgba(157,216,174,0.28)",
                        background: "rgba(10,61,43,0.34)",
                    }}
                >
                    <RiLock2Line className="text-sm" />
                    Member Login
                </div>

                <h1
                    className="mb-5 text-4xl font-semibold leading-tight sm:text-5xl"
                    style={{
                        color: "var(--color-primary-50)",
                        letterSpacing: "-0.02em",
                    }}
                >
                    Welcome back,
                    <br />
                    <span style={{ color: "var(--color-gold-300)" }}>BAMHSian</span>
                </h1>

                <p className="max-w-md text-base leading-relaxed sm:text-lg" style={{ color: "rgba(220,252,231,0.76)" }}>
                    Continue where you left off. Access your batch feed, event updates, and alumni network in one place.
                </p>

                <div className="mt-8 space-y-3">
                    {["Find your batch and classmates", "Get reunion and notice updates", "Support ongoing alumni initiatives"].map((point) => (
                        <div key={point} className="flex items-center gap-3">
                            <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--color-primary-300)" }} />
                            <p className="text-sm sm:text-base" style={{ color: "rgba(220,252,231,0.72)" }}>{point}</p>
                        </div>
                    ))}
                </div>
            </motion.div>
        </section>
    )
}
export default LeftSection