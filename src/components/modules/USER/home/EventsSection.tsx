import { FadeUpWrapper } from "@/components/Pages/USER/Home/HomePage";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { HiArrowUpRight } from "react-icons/hi2"
import { RiArrowRightLine } from "react-icons/ri"

const EventsSection = () => {

    const events = [
        {
            title: "Annual Alumni Reunion 2025",
            date: "15 March 2025",
            type: "Reunion",
            desc: "Come back home. Meet your batch-mates, revisit classrooms, and relive the golden memories.",
            color: "var(--color-primary-500)",
        },
        {
            title: "Blood Donation Camp",
            date: "22 February 2025",
            type: "Community",
            desc: "BAMHSians united to save lives. Donate blood and be someone's hero today.",
            color: "var(--color-danger)",
        },
        {
            title: "Scholarship Fund Drive",
            date: "Ongoing",
            type: "Initiative",
            desc: "Help current students by contributing to our alumni scholarship fund.",
            color: "var(--color-gold-500)",
        },
    ];

    return (
        <section className="three-xl-section-setup">
            <FadeUpWrapper className="text-center mb-14">
                <span className="text-label block mb-3">What&apos;s Happening</span>
                <h2 className="section-heading" style={{ color: "var(--color-primary-900)" }}>
                    Events & Initiatives
                </h2>
                <p className="section-subheading">
                    Stay in the loop — reunions, blood drives, scholarship campaigns and more.
                </p>
            </FadeUpWrapper>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
                {events.map(({ title, date, type, desc, color }, i) => (
                    <FadeUpWrapper key={title} delay={i * 0.1}>
                        <Card className="h-full border-0 shadow-md hover:-translate-y-1 transition-all duration-200 overflow-hidden"
                            style={{ background: "var(--color-surface)" }}>
                            {/* color accent top */}
                            <div className="h-1 w-full" style={{ background: color }} />
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <Badge className=" text-[10px] tracking-wider uppercase rounded-md px-2 py-0.5"
                                        style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
                                        {type}
                                    </Badge>
                                    <span className=" text-xs" style={{ color: "var(--color-text-muted)" }}>
                                        {date}
                                    </span>
                                </div>
                                <h3 className="font-display font-semibold text-lg mb-2"
                                    style={{ color: "var(--color-primary-800)" }}>{title}</h3>
                                <p className=" text-sm leading-relaxed"
                                    style={{ color: "var(--color-text-secondary)" }}>{desc}</p>
                                <Separator className="my-4" style={{ background: "var(--color-border)" }} />
                                <Link href="/events"
                                    className="inline-flex items-center gap-1  text-xs font-medium transition-colors hover:gap-2 duration-200"
                                    style={{ color: color }}>
                                    Learn more <HiArrowUpRight />
                                </Link>
                            </CardContent>
                        </Card>
                    </FadeUpWrapper>
                ))}
            </div>

            <FadeUpWrapper className="text-center">
                <Button asChild className="rounded-xl font-medium"
                    style={{ background: "var(--color-primary-500)", color: "#FDFAF2" }}>
                    <Link href="/events">All Events <RiArrowRightLine className="ml-1" /></Link>
                </Button>
            </FadeUpWrapper>
        </section>
    )
}

export default EventsSection