import { fmt, fmtTime, getCategoryColor, getCountdown, getStatusConfig } from "@/components/pages/user/Events/EventDetailsPage"
import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage"
import { Badge } from "@/components/ui/badge"
import { IEvent } from "@/types/common/events.types"
import Image from "next/image"
import Link from "next/link"
import { useRef } from "react"
import { HiOutlineLocationMarker } from "react-icons/hi"
import { RiArrowLeftLine, RiCalendarEventLine, RiFireLine, RiGroupLine, RiTimeLine } from "react-icons/ri"

const EventDetailsHero = ({ event }: { event: IEvent }) => {
    const heroRef = useRef(null);
    const status = getStatusConfig(event);
    const catColor = getCategoryColor(event.category);

    return (
        <div> <div ref={heroRef} className="relative h-[55vh] min-h-[400px] max-h-[620px] overflow-hidden rounded-2xl">
            {/* Parallax image */}
            <FadeUpWrapper className="absolute inset-0 scale-110">
                <Image
                    src={event.coverImage ?? "/event-placeholder.jpg"}
                    alt={event.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="100vw"
                />
            </FadeUpWrapper>

            {/* Multi-layer overlay */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "linear-gradient(to top, rgba(10,61,43,0.96) 0%, rgba(10,61,43,0.65) 35%, rgba(10,61,43,0.20) 65%, rgba(10,61,43,0.08) 100%)",
                }}
            />

            {/* Top row — back + badges */}
            <div className="absolute left-0 right-0 top-0 flex items-start justify-between p-6 md:p-10">
                <Link
                    href="/events"
                    className="flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold backdrop-blur-md transition-all hover:bg-white/20"
                    style={{ background: "rgba(255,255,255,0.10)", borderColor: "rgba(255,255,255,0.20)", color: "#FDFAF2" }}
                >
                    <RiArrowLeftLine /> Back to Events
                </Link>

                <div className="flex items-center gap-2 flex-wrap justify-end">
                    <Badge
                        className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border"
                        style={{ background: `${catColor.bg}CC`, color: catColor.text, borderColor: catColor.border }}
                    >
                        {event.category}
                    </Badge>
                    {event.isFeatured && (
                        <Badge
                            className="flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
                            style={{ background: "var(--color-gold-500)", color: "#0F3C24" }}
                        >
                            <RiFireLine /> Featured
                        </Badge>
                    )}
                    {/* Status */}
                    <div
                        className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md"
                        style={{ background: `${status.bg}22`, color: status.bg, borderColor: `${status.color}40` }}
                    >
                        {status.pulse && (
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background: status.color }} />
                                <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: status.color }} />
                            </span>
                        )}
                        {status.label}
                    </div>
                </div>
            </div>

            {/* Bottom — title + meta */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                <FadeUpWrapper>
                    <p
                        className="mb-1.5 flex items-center gap-1.5 text-xs font-medium"
                        style={{ color: "var(--color-gold-300)" }}
                    >
                        <RiTimeLine />
                        {event.organizer && `${event.organizer} · `}
                        {getCountdown(event.startDateTime) ?? `Held on ${fmt(event.startDateTime)}`}
                    </p>
                    <h1
                        className="font-display text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl"
                        style={{ color: "#FDFAF2" }}
                    >
                        {event.title}
                    </h1>
                    <div
                        className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm"
                        style={{ color: "rgba(253,250,242,0.75)" }}
                    >
                        <span className="flex items-center gap-1.5">
                            <RiCalendarEventLine /> {fmt(event.startDateTime, "EEEE, d MMMM yyyy")}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <RiTimeLine /> {fmtTime(event.startDateTime)}
                            {event.endDateTime ? ` – ${fmtTime(event.endDateTime)}` : ""}
                        </span>
                        {event.venue && (
                            <span className="flex items-center gap-1.5">
                                <HiOutlineLocationMarker /> {event.venue}
                            </span>
                        )}
                        {event.maxAttendees && (
                            <span className="flex items-center gap-1.5">
                                <RiGroupLine /> {event.maxAttendees.toLocaleString()} seats
                            </span>
                        )}
                    </div>
                </FadeUpWrapper>
            </div>
        </div></div>
    )
}
export default EventDetailsHero