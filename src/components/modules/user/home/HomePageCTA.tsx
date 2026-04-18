import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage";
import PrimaryButton from "@/components/shared/PrimaryButton";
import SectionLabel from "@/components/shared/SectionLabel";
import { BsArrowRight } from "react-icons/bs";
import {
    RiHandHeartLine,
    RiGroupLine,
    RiMapPin2Line,
    RiShieldCheckLine,
    RiSparkling2Line,
} from "react-icons/ri";

const features = [
    {
        icon: <RiGroupLine />,
        title: "Alumni Network",
        desc: "Connect with batchmates across every generation",
    },
    {
        icon: <RiMapPin2Line />,
        title: "Global Reach",
        desc: "BAMHSians active in dozens of countries",
    },
    {
        icon: <RiShieldCheckLine />,
        title: "Verified Members",
        desc: "Every profile reviewed and approved",
    },
];

const HomePageCTA = () => (
    <section className="three-xl-section-setup">
        <FadeUpWrapper>
            <div
                className="relative rounded-3xl overflow-hidden"
                style={{
                    // background: "linear-gradient(160deg, #041810 0%, #071F14 35%, #0A3D2B 100%)",
                    background: "linear-gradient(160deg, #093121 0%, #0c412a 35%, #0A3D2B 100%)",
                }}
            >

                {/* ── Decorative grid ─────────────────────────────────── */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(46,139,87,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(46,139,87,0.06) 1px, transparent 1px)",
                        backgroundSize: "56px 56px",
                    }}
                />

                {/* ── Ghost watermark icon ────────────────────────────── */}
                <RiHandHeartLine
                    className="absolute -bottom-6 right-8 pointer-events-none select-none"
                    style={{
                        fontSize: "clamp(9rem, 20vw, 17rem)",
                        color: "rgba(46,139,87,0.07)",
                        lineHeight: 1,
                    }}
                />

                {/* ── Content ─────────────────────────────────────────── */}
                <div className="z-10px-sm:px-12md:px-16lg:px24 relative z-10 p-8 sm:p-12 md:p-16 lg:p-20">

                    {/* Badge */}
                    <FadeUpWrapper className="flex justify-center mb-6">
                        <SectionLabel text="BAMHS Alumni Community" icon={<RiSparkling2Line />} className="border-primary2-600 text-primary2-200 bg-transparent" />
                    </FadeUpWrapper>

                    {/* Headline */}
                    <FadeUpWrapper delay={0.08} className="text-center mb-6">
                        <h2
                            className="font-display font-bold leading-[1.1] text-balance"
                            style={{
                                fontSize: "clamp(2.4rem, 6vw, 4.2rem)",
                                color: "var(--color-primary-50)",
                                letterSpacing: "-0.03em",
                            }}
                        >
                            You&apos;re always{" "}
                            <span
                                style={{
                                    background: "linear-gradient(135deg, #72C48C 0%, #4DB472 50%, #9DD8AE 100%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                }}
                            >
                                home
                            </span>{" "}
                            here
                        </h2>
                    </FadeUpWrapper>

                    {/* Subtext */}
                    <FadeUpWrapper delay={0.14} className="text-center mb-12">
                        <p
                            className="text-base sm:text-lg leading-relaxed max-w-2xl mx-auto"
                            style={{ color: "rgba(195,232,206,0.68)" }}
                        >
                            Whether you graduated last year or three decades ago — BAMHSian remembers you.
                            Join thousands of alumni and stay connected with your roots.
                        </p>
                    </FadeUpWrapper>

                    {/* Feature trio */}
                    <FadeUpWrapper delay={0.2}>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-12 max-w-3xl mx-auto">
                            {features.map(({ icon, title, desc }) => (
                                <div
                                    key={title}
                                    className="flex flex-row sm:flex-col items-start sm:items-center sm:text-center gap-3 sm:gap-2 px-5 py-4 rounded-2xl"
                                    style={{
                                        background: "rgba(46,139,87,0.08)",
                                        border: "1px solid rgba(46,139,87,0.18)",
                                    }}
                                >
                                    <span
                                        className="w-9 h-9 shrink-0 rounded-xl flex items-center justify-center text-base"
                                        style={{
                                            background: "rgba(46,139,87,0.20)",
                                            color: "var(--color-primary-300)",
                                            border: "1px solid rgba(46,139,87,0.28)",
                                        }}
                                    >
                                        {icon}
                                    </span>
                                    <div>
                                        <p className="font-semibold text-sm" style={{ color: "var(--color-primary-100)" }}>
                                            {title}
                                        </p>
                                        <p className="text-xs mt-0.5 leading-snug" style={{ color: "rgba(195,232,206,0.55)" }}>
                                            {desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </FadeUpWrapper>

                    {/* CTA Buttons */}
                    <FadeUpWrapper delay={0.26} className="flex flex-col sm:flex-row gap-4 justify-center">
                        <PrimaryButton
                            className="hover:scale-[1.05] transition-transform duration-300 text-primary2-100 font-semibold py-[19px] "
                            style={{
                                background: "linear-gradient(135deg, #2E8B57 0%, #155A3E 100%)",
                                boxShadow: "0 0 32px rgba(46,139,87,0.45), 0 4px 16px rgba(0,0,0,0.30)",
                            }} icon2={<BsArrowRight />} iconSide2="right"
                            title="Join BAMHS Alumni" href="/login" />
                        <PrimaryButton
                            className="hover:scale-[1.05] transition-transform duration-300 bg-transparent py-[19px] text-primary2-200 font-semibold border-primary2-700 "
                            title="Request Access" href="/request" />
                    </FadeUpWrapper>

                    {/* Bottom trust note */}
                    <FadeUpWrapper delay={0.32} className="text-center mt-8">
                        <p className="text-xs text-primary2-300 ">
                            Free forever for all BAMHS alumni · No spam · Verified community
                        </p>
                    </FadeUpWrapper>
                </div>
            </ div>
        </FadeUpWrapper>
    </section>

);

export default HomePageCTA;
