import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage";
import { Badge } from "@/components/ui/badge";
import { RiCalendarEventLine } from "react-icons/ri";

const EventPageHead = () => {
    return (
        <FadeUpWrapper delay={0.1}>
            <section className="relative overflow-hidden rounded-3xl"
                style={{ background: "linear-gradient(145deg, #0c0f24 0%, #1a1244 55%, #07091a 100%)" }}>
                <div className="absolute inset-0 pointer-events-none opacity-25"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                        backgroundSize: "48px 48px",
                    }}
                />
                <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full blur-3xl opacity-30"
                    style={{ background: "#6d28d9" }} />
                <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full blur-3xl opacity-20"
                    style={{ background: "#a78bfa" }} />

                <div className="relative z-10 px-7 py-12 sm:px-12 sm:py-16">
                    <FadeUpWrapper delay={0.25}>
                        <Badge className="mb-5 bg-white/10 text-violet-200 border-violet-400/30 hover:bg-white/10">
                            <RiCalendarEventLine className="mr-1.5" /> Events Hub
                        </Badge>
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-3xl">
                            Experiences,{" "}
                            <span className="text-violet-300">not just events</span>
                        </h1>
                        <p className="mt-5 max-w-2xl text-sm sm:text-lg text-violet-100/75 leading-relaxed">
                            Discover high-impact alumni gatherings with clear tracks, timeline intelligence, and participation flow — built for scale.
                        </p>
                    </FadeUpWrapper>
                </div>
            </section>
        </FadeUpWrapper>
    )
}
export default EventPageHead