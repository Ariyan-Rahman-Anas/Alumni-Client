import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage"
import { RiSparkling2Line } from "react-icons/ri"

const AboutPageHead = () => {

    const impactStats = [
        { value: "৳8L+", label: "Scholarship fund raised" },
        { value: "200+", label: "Blood donations facilitated" },
        { value: "12", label: "Reunions organized" },
        { value: "50+", label: "Mentorships active" },
    ];

    return (
        <div>
            <section className="relative pt-32 pb-24 overflow-hidden rounded-3xl"
                style={{ background: "linear-gradient(160deg, #0A3D2B 0%, #051F15 100%)" }}>
                {/* grid */}
                <div className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: "linear-gradient(rgba(46,139,87,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(46,139,87,0.07) 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }} />
                <div className="absolute top-20 left-1/3 w-96 h-96 rounded-full blur-3xl opacity-20"
                    style={{ background: "var(--color-primary-500)" }} />

                <div className="page-setup relative z-10 text-center max-w-4xl mx-auto">
                    <FadeUpWrapper
                        // initial={{ opacity: 0, scale: 0.9 }}
                        // animate</div>={{ opacity: 1, scale: 1 }}
                        // transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-8"
                        style={{ background: "rgba(46,139,87,0.12)", borderColor: "rgba(46,139,87,0.35)" }}
                    >
                        <RiSparkling2Line style={{ color: "var(--color-primary-300)" }} />
                        <span className=" text-xs tracking-widest uppercase"
                            style={{ color: "var(--color-primary-300)" }}>Our Story</span>
                    </FadeUpWrapper>

                    <FadeUpWrapper
                        // initial={{ opacity: 0, y: 28 }}
                        // animate={{ opacity: 1, y: 0 }}
                        // transition={{ duration: 0.75, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
                        className="font-display font-bold mb-6"
                        style={{
                            fontSize: "clamp(2.5rem, 6vw, 5rem)",
                            color: "var(--color-primary-50)",
                            letterSpacing: "-0.03em",
                            lineHeight: 1.05,
                        }}
                    >
                        More than a school —<br />
                        <span className="font-serif italic" style={{ color: "var(--color-primary-300)" }}>
                            a lifelong family
                        </span>
                    </FadeUpWrapper>

                    <FadeUpWrapper
                        // initial={{ opacity: 0, y: 16 }}
                        // animate={{ opacity: 1, y: 0 }}
                        // transition={{ duration: 0.65, delay: 0.28 }}
                        className=" text-lg leading-relaxed max-w-2xl mx-auto mb-10"
                        style={{ color: "rgba(195,232,206,0.75)" }}
                    >
                        BAMHS Alumni is not an organization — it is a feeling. The smell of chalk,
                        the echo of the morning assembly, the warmth of a teacher&apos;s words.
                        This portal is our way of keeping that feeling alive, forever.
                    </FadeUpWrapper>

                    {/* impact stats */}
                    <FadeUpWrapper
                        // initial={{ opacity: 0, y: 16 }}
                        // animate={{ opacity: 1, y: 0 }}
                        // transition={{ duration: 0.6, delay: 0.4 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
                    >
                        {impactStats.map(({ value, label }) => (
                            <div key={label} className="rounded-xl p-4 text-center border"
                                style={{
                                    background: "rgba(46,139,87,0.10)",
                                    borderColor: "rgba(46,139,87,0.22)",
                                }}>
                                <p className="font-display font-bold text-2xl mb-0.5"
                                    style={{ color: "var(--color-primary-100)" }}>{value}</p>
                                <p className=" text-xs" style={{ color: "rgba(195,232,206,0.60)" }}>{label}</p>
                            </div>
                        ))}
                    </FadeUpWrapper>
                </div>
            </section>
        </div>
    )
}
export default AboutPageHead