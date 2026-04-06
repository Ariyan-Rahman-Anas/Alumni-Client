import { FadeUpWrapper } from "@/components/Pages/Home/HomePage"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { HiArrowUpRight } from "react-icons/hi2"
import { RiHeartLine } from "react-icons/ri"

const AboutSection = () => {
    return (
        <section className="section-warm">
            <div className="three-xl-section-setup grid lg:grid-cols-2 gap-16 items-center">
                {/* Left — text */}
                <div>
                    <FadeUpWrapper>
                        <span className="text-label mb-4 block">Our Story</span>
                        <h2 className="font-display font-bold leading-tight mb-6"
                            style={{
                                fontSize: "clamp(2rem, 4vw, 3rem)",
                                color: "var(--color-primary-900)",
                                letterSpacing: "-0.02em",
                            }}
                        >
                            Rooted in{" "}
                            <span className="font-serif italic" style={{ color: "var(--color-primary-500)" }}>
                                Battali
                            </span>
                            , branching across the world
                        </h2>
                        <p className=" text-base leading-relaxed mb-4"
                            style={{ color: "var(--color-text-secondary)" }}>
                            Since 1966, Battali Abdul Matin High School has been the place where
                            thousands of dreams took root. From the dusty playgrounds to the chalk-dusted
                            classrooms — BAMHS isn&apos;t just a school. It&apos;s our first home away from home.
                        </p>
                        <p className=" text-base leading-relaxed mb-8"
                            style={{ color: "var(--color-text-secondary)" }}>
                            This portal is built by BAMHSians, for BAMHSians — to reconnect, remember,
                            and give back to the community that made us.
                        </p>
                        <Button asChild variant="outline" className="rounded-xl border-2 font-medium"
                            style={{ borderColor: "var(--color-primary-500)", color: "var(--color-primary-600)" }}>
                            <Link href="/about">
                                Read Our Full Story <HiArrowUpRight className="ml-1" />
                            </Link>
                        </Button>
                    </FadeUpWrapper>
                </div>

                {/* Right — decorative card stack */}
                <FadeUpWrapper delay={0.15}>
                    <div className="relative h-80 lg:h-96">
                        {/* Back card */}
                        <div className="absolute top-0 right-8 w-64 h-44 rounded-2xl rotate-6 shadow-xl"
                            style={{
                                background: "linear-gradient(135deg, #257048 0%, #0A3D2B 100%)",
                                border: "1px solid rgba(46,139,87,0.30)",
                            }}
                        >
                            <div className="p-5">
                                <p className=" text-[10px] uppercase tracking-widest mb-3"
                                    style={{ color: "rgba(195,232,206,0.50)" }}>Est.</p>
                                <p className="font-display font-bold text-5xl"
                                    style={{ color: "var(--color-primary-100)" }}>1966</p>
                            </div>
                        </div>
                        {/* Front card */}
                        <div className="absolute bottom-0 left-8 w-72 h-52 rounded-2xl shadow-2xl"
                            style={{
                                background: "var(--color-surface)",
                                border: "1px solid var(--color-border)",
                                boxShadow: "var(--shadow-xl)",
                            }}
                        >
                            <div className="p-6">
                                <div className="w-10 h-10 rounded-xl mb-4 flex items-center justify-center"
                                    style={{ background: "var(--color-primary-50)" }}>
                                    <RiHeartLine style={{ color: "var(--color-primary-500)", fontSize: "20px" }} />
                                </div>
                                <p className="font-display font-semibold text-lg mb-1"
                                    style={{ color: "var(--color-primary-900)" }}>
                                    Alumni Community
                                </p>
                                <p className=" text-sm" style={{ color: "var(--color-text-secondary)" }}>
                                    3,200+ members across 18+ countries, all sharing one address: BAMHS.
                                </p>
                            </div>
                        </div>
                    </div>
                </FadeUpWrapper>
            </div>
        </section>
    )
}
export default AboutSection