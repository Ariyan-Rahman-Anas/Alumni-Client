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
                className="rounded-3xl border border-primary2-700/25 p-7 sm:p-10"
                style={{
                    background: "linear-gradient(145deg, rgba(46,139,87,0.18) 0%, rgba(10,61,43,0.52) 100%)",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
                }}
            >
                <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary2-300/30 bg-primary2-950/35 px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-primary2-100/85">
                    <RiLock2Line className="text-sm" />
                    Alumni Portal
                </div>

                <h1 className="mb-5 text-4xl font-semibold leading-tight text-primary2-50 sm:text-5xl" style={{ letterSpacing: "-0.02em" }}>
                    Welcome back,
                    <br />
                    <span className="text-gold-300">BAMHSian</span>
                </h1>

                <p className="max-w-md text-base leading-relaxed text-emerald-100/75 sm:text-lg">
                    Sign in to your alumni account to connect with your batch, stay updated on association events, and engage with the BAMHS alumni community.
                </p>

                <div className="mt-8 space-y-3">
                    {[
                        "Access your batch directory and classmate profiles",
                        "Stay informed about reunion events and association notices",
                        "Participate in alumni welfare and mentorship programmes",
                    ].map((point) => (
                        <div key={point} className="flex items-center gap-3">
                            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-primary2-300" />
                            <p className="text-sm text-emerald-100/70 sm:text-base">{point}</p>
                        </div>
                    ))}
                </div>
            </motion.div>
        </section>
    )
}
export default LeftSection
