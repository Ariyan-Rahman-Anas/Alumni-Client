import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage";
import PrimaryButton from "@/components/shared/PrimaryButton";
import SectionLabel from "@/components/shared/SectionLabel";
import { BiDonateBlood } from "react-icons/bi";
import { RiHeartPulseLine, RiUserAddLine, RiSearchLine, RiDropLine, RiShieldCheckLine, RiTimeLine } from "react-icons/ri";

const stats = [
    { icon: <RiDropLine />, value: "O+", label: "Most Needed" },
    { icon: <RiShieldCheckLine />, value: "100%", label: "Safe & Verified" },
    { icon: <RiTimeLine />, value: "24/7", label: "Emergency Ready" },
];

const BloodSection = () => (
    <section className="three-xl-section-setup">
        <FadeUpWrapper>
            <div
                className="relative rounded-3xl overflow-hidden"
                style={{
                    background: "linear-gradient(145deg, #5C0A18 0%, #7B0D1E 40%, #9E1525 100%)",
                }}
            >
                {/* ── Decorative grid ───────────────────────────── */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
                        backgroundSize: "48px 48px",
                    }}
                />

                {/* ── Large background icon ──────────────────────── */}
                <BiDonateBlood
                    className="absolute bottom-0 right-4 pointer-events-none select-none"
                    style={{
                        fontSize: "clamp(10rem, 22vw, 18rem)",
                        color: "rgba(255, 255, 255, 0.06)",
                        lineHeight: 1,
                    }}
                />

                {/* ── Main content ──────────────────────────────── */}
                <div className="relative z-10 p-8 sm:p-12 md:p-16 lg:p-20">

                    {/* Top section — badge + heading + text + CTAs */}
                    <div className="flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-16">

                        {/* Left: copy */}
                        <FadeUpWrapper delay={0.14} className="flex-1 min-w-0" >
                            {/* Badge */}
                            <SectionLabel text="Blood Donation" className="text-danger-light border-danger-light/30" icon={<RiHeartPulseLine />} align="left" />

                            <FadeUpWrapper delay={0.18}>
                                <h2
                                    className="font-display font-bold text-white my-4"
                                    style={{
                                        fontSize: "clamp(1.9rem, 4vw, 3rem)",
                                        letterSpacing: "-0.025em",
                                        lineHeight: 1.15,
                                    }}
                                >
                                    BAMHSians Helping to {" "}
                                    <span
                                        className="font-serifitalic"
                                        style={{
                                            background: "linear-gradient(135deg, #FCA5A5 0%, #F87171 100%)",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                            backgroundClip: "text",
                                        }}
                                    >
                                        Save Lives
                                    </span>
                                </h2>
                            </FadeUpWrapper>

                            <FadeUpWrapper delay={0.22}>
                                <p
                                    className="text-base leading-relaxed mb-8 max-w-lg"
                                    style={{ color: "rgba(254,202,202,0.78)" }}
                                >
                                    Our alumni blood bank connects verified donors with those in need —
                                    across Bangladesh, around the clock. One registration. Countless lives touched.
                                </p>
                            </FadeUpWrapper>

                            {/* CTA buttons */}
                            <FadeUpWrapper delay={0.26} className="flex flex-col items-center sm:flex-row gap-4">
                                {/* <div className="flex flex-col items-center sm:flex-row gap-4"> */}
                                <PrimaryButton type="button" title="Register as Donor" href={"/bloobank"} className="bg-danger-light py-[18px] text-danger-dark font-semibold hover:scale-[1.05] transition-transform duration-300" icon={<RiUserAddLine />} />

                                <PrimaryButton type="button" title="Find a Donor" href={"/bloobank"} className=" py-[18px] bg-transparent text-danger-light border border-danger-light/50 hover:scale-[1.05] transition-transform duration-300" icon={<RiSearchLine />} />
                                {/* </div> */}
                            </FadeUpWrapper>
                        </FadeUpWrapper>


                        {/* Right: stat pills */}
                        <FadeUpWrapper delay={0.16} className="flex flex-row lg:flex-col gap-3 flex-wrap lg:flex-nowrap lg:shrink-0">
                            {stats.map(({ icon, value, label }) => (
                                <div
                                    key={label}
                                    className="flex items-center gap-3 px-4 py-3 rounded-2xl flex-1 lg:flex-none lg:w-48"
                                    style={{
                                        background: "rgba(255,255,255,0.07)",
                                        border: "1px solid rgba(255,255,255,0.12)",
                                        backdropFilter: "blur(8px)",
                                    }}
                                >
                                    <span
                                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-base"
                                        style={{
                                            background: "rgba(220,38,38,0.25)",
                                            color: "#FCA5A5",
                                            border: "1px solid rgba(220,38,38,0.30)",
                                        }}
                                    >
                                        {icon}
                                    </span>
                                    <div>
                                        <p className="text-white font-bold text-sm leading-none">{value}</p>
                                        <p className="text-[11px] mt-0.5" style={{ color: "rgba(254,202,202,0.60)" }}>{label}</p>
                                    </div>
                                </div>
                            ))}
                        </FadeUpWrapper>
                    </div>

                    {/* note */}
                    <FadeUpWrapper delay={0.3}
                        className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
                    >
                        <p className="text-xs text-center sm:text-left" style={{ color: "rgba(254,202,202,0.45)" }}>
                            All donors are verified BAMHS alumni. Your information stays private and secure.
                        </p>
                        <span
                            className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase px-3 bg-danger-light/10 text-danger-light py-1 rounded-full shrink-0 border border-danger-light/50"
                        >
                            <RiShieldCheckLine />
                            Trusted & Verified
                        </span>
                    </FadeUpWrapper>
                </div>
            </div>
        </FadeUpWrapper>
    </section>
);
export default BloodSection;