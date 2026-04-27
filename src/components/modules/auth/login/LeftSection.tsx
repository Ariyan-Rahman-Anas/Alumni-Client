"use client"

import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage"
import { RiLock2Line } from "react-icons/ri"

const LeftSection = () => {
    return (
        <FadeUpWrapper delay={0.1} className="p-6 sm:p-8 w-full">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-primary2-950/35 px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-primary2-100/85">
                <RiLock2Line className="text-sm" />
                Alumni Portal
            </div>

            <h1 className="mb-5 text-4xl font-semibold leading-tight text-primary2-50 sm:text-5xl" style={{ letterSpacing: "-0.02em" }}>
                Welcome back,
                <br />
                <span className="text-gold-300">BAMHSian</span>
            </h1>

            <p className="max-w-md text-base leading-relaxed text-emerald-100/75">
                Sign in to your alumni account to connect with your batch, stay updated on association events, and engage with the BAMHS alumni community.
            </p>

            <div className="mt-8 space-y-3">
                {[
                    "Access your batch directory and classmate profiles",
                    "Stay informed about reunion events and association notices",
                    "Participate in alumni welfare and mentorship programmes",
                ].map((point) => (
                    <div key={point} className="flex items-center gap-3">
                        <span className="h-2 w-2 shrink-0 rounded-full bg-primary2-300" />
                        <p className="text-sm text-emerald-100/70">{point}</p>
                    </div>
                ))}
            </div>
        </FadeUpWrapper>
    )
}
export default LeftSection
