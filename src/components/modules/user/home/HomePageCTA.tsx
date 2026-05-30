import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage";
import PrimaryButton from "@/components/shared/PrimaryButton";
import SectionLabel from "@/components/shared/SectionLabel";
import { BsArrowRight } from "react-icons/bs";
import {
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
                    background: "linear-gradient(160deg, var(--color-primary-950) 0%, var(--color-primary-900) 35%, var(--color-primary-900) 100%)",
                }}>

                {/* ── Decorative grid  */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage:
                            "linear-gradient(color-mix(in srgb, var(--color-primary-500) 6%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--color-primary-500) 6%, transparent) 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }}
                />

                {/* ── Content ─────────────────────────────────────────── */}
                <div className="z-10px-sm:px-12md:px-16lg:px24 relative z-10 p-8 sm:p-12 md:p-16 lg:p-20">

                    {/* Badge */}
                    <FadeUpWrapper className="flex justify-center mb-5">
                        <SectionLabel text="BAMHS Alumni Community"
                            icon={<RiSparkling2Line />}
                            className="border-primary2-600 text-primary2-200 bg-transparent dark:border-gunmetal-400 dark:text-gunmetal-200" />
                    </FadeUpWrapper>

                    {/* Headline */}
                    <FadeUpWrapper delay={0.08} className="text-center mb-6">
                        <h2
                            className="font-display font-bold leading-[1.1] text-balance text-white dark:text-gunmetal-200"
                            style={{
                                fontSize: "clamp(2.4rem, 6vw, 4.2rem)",
                                letterSpacing: "-0.03em",
                            }}
                        >
                            You&apos;re always{" "}
                            <span
                                style={{
                                    background: "linear-gradient(135deg, var(--color-primary-300) 0%, var(--color-primary-400) 50%, var(--color-primary-200) 100%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                }}
                            >
                                Home
                            </span>{" "}
                            here
                        </h2>
                    </FadeUpWrapper>

                    {/* Subtext */}
                    <FadeUpWrapper delay={0.14} className="text-center mb-12">
                        <p className="text-base sm:text-lg leading-relaxed max-w-2xl mx-auto text-gunmetal-300">
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
                                        background: "color-mix(in srgb, var(--color-primary-500) 8%, transparent)",
                                        border: "1px solid color-mix(in srgb, var(--color-primary-500) 18%, transparent)",
                                    }}
                                >
                                    <span
                                        className="w-9 h-9 shrink-0 rounded-xl flex items-center justify-center text-base text-primary2-500 "
                                        style={{
                                            background: "color-mix(in srgb, var(--color-primary-500) 20%, transparent)",
                                            border: "1px solid color-mix(in srgb, var(--color-primary-500) 28%, transparent)",
                                        }}
                                    >
                                        {icon}
                                    </span>
                                    <div>
                                        <p className="font-semibold text-sm text-primary2-100 dark:text-gunmetal-200">
                                            {title}
                                        </p>
                                        <p className="text-xs mt-0.5 leading-snug text-primary2-300 dark:text-gunmetal-300">
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
                            className="hover:scale-[1.05] transition-transform duration-300 text-primary2-100 font-semibold"
                            style={{
                                background: "linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-800) 100%)",
                                boxShadow: "0 0 32px color-mix(in srgb, var(--color-primary-500) 45%, transparent), 0 4px 16px rgba(0,0,0,0.30)",
                            }} icon2={<BsArrowRight />} iconSide2="right"
                            title="Join BAMHS Alumni" href="/login" />
                        <PrimaryButton
                            className="hover:scale-[1.05] transition-transform duration-300 bg-transparent text-primary2-200 font-semibold border-primary2-700 "
                            title="Request Access" href="/request" />
                    </FadeUpWrapper>

                    {/* Bottom trust note */}
                    <FadeUpWrapper delay={0.32} className="text-center mt-8">
                        <p className="text-xs text-gunmetal-300 ">
                            Free forever for all BAMHS alumni · No spam · Verified community
                        </p>
                    </FadeUpWrapper>
                </div>
            </ div>
        </FadeUpWrapper>
    </section>
);
export default HomePageCTA;
