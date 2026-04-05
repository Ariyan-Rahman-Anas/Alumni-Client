import { FadeUpWrapper } from "@/components/Pages/Home/HomePage"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { RiArrowRightLine } from "react-icons/ri"

const BatchesSection = () => {
    const batches = [
        { year: "1990s", count: "340+", color: "#155A3E" },
        { year: "2000s", count: "620+", color: "#2E8B57" },
        { year: "2010s", count: "890+", color: "#4DB472" },
        { year: "2020s", count: "180+", color: "#72C48C" },
    ];

    return (
        <section
            style={{ background: "linear-gradient(160deg, #0A3D2B 0%, #051F15 100%)" }}
        >
            <div className="three-xl-section-setup">
                <FadeUpWrapper className="text-center mb-14">
                    <span className="text-label block mb-3" style={{ color: "var(--color-primary-400)" }}>
                        Generations of BAMHSians
                    </span>
                    <h2 className="section-heading" style={{ color: "var(--color-primary-50)" }}>
                        Find Your Batch
                    </h2>
                    <p className="section-subheading" style={{ color: "rgba(195,232,206,0.65)" }}>
                        Decades of graduates, one shared identity. Search your batch and reconnect.
                    </p>
                </FadeUpWrapper>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                    {batches.map(({ year, count, color }, i) => (
                        <FadeUpWrapper key={year} delay={i * 0.08}>
                            <Link href="/batches">
                                <div className="group relative overflow-hidden rounded-2xl border p-6 text-center cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                                    style={{
                                        background: `linear-gradient(135deg, ${color}22 0%, ${color}11 100%)`,
                                        borderColor: `${color}40`,
                                    }}
                                >
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        style={{ background: `radial-gradient(circle at 50% 50%, ${color}20, transparent 70%)` }} />
                                    <p className="font-display font-bold text-3xl mb-1 relative z-10"
                                        style={{ color: "var(--color-primary-100)" }}>{year}</p>
                                    <p className="font-mono text-xs tracking-widest relative z-10"
                                        style={{ color: "var(--color-primary-400)" }}>{count} alumni</p>
                                </div>
                            </Link>
                        </FadeUpWrapper>
                    ))}
                </div>

                <FadeUpWrapper className="text-center">
                    <Button asChild variant="outline" className="rounded-xl font-medium"
                        style={{ borderColor: "rgba(46,139,87,0.40)", color: "var(--color-primary-200)" }}>
                        <Link href="/batches">View All Batches <RiArrowRightLine className="ml-1" /></Link>
                    </Button>
                </FadeUpWrapper>
            </div>
        </section>
    )
}
export default BatchesSection