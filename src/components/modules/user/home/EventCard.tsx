import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage"
import Image from "next/image"
import Link from "next/link"
import { RiArrowRightLine, RiCalendarEventLine, RiMapPinLine, RiTimeLine } from "react-icons/ri"
import { formatEventDate, formatEventTime, getCountdown, getStatusMeta } from "./EventsSection"
import { IEvent } from "@/types/common/events.types"

const EventCard = ({ event, index }: { event: IEvent; index: number }) => {
    const status = getStatusMeta(event);
    const countdown = getCountdown(event.startDateTime);
    const accentColors = [
        "var(--color-primary2-500)",
        "var(--color-danger-DEFAULT)",
        "var(--color-gold-500)",
        "var(--color-info-DEFAULT)",
    ];
    const accent = accentColors[index % accentColors.length];

    return (
        <FadeUpWrapper delay={index * 0.08}>
            <Link href={`/events/${event.slug}`} className="block group h-full">
                <div
                    className="h-full rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 group-hover:-translate-y-0.5 border"
                    style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
                >
                    <div className="h-1 w-full" style={{ background: accent }} />

                    {event.coverImage && (
                        <div className="relative h-36 overflow-hidden">
                            <Image
                                fill
                                src={event.coverImage}
                                alt={event.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,61,43,0.6) 0%, transparent 60%)" }} />
                        </div>
                    )}

                    <div className="p-5">
                        <div className="flex items-center justify-between mb-3">
                            <p className="badge-alumni">
                                {event.category}
                            </p>
                            <p className="badge-success">
                                {status.label}
                            </p>
                        </div>

                        <h3
                            className="font-semibold text-primary2-800 dark:text-gunmetal-200 text-base leading-snug mb-2 line-clamp-2">
                            {event.title}
                        </h3>

                        <div className="flex flex-col gap-1 mb-3 text-xs text-gunmetal-300 ">
                            <span className="flex items-center gap-1.5">
                                <RiCalendarEventLine style={{ color: accent }} />
                                {formatEventDate(event.startDateTime)} · {formatEventTime(event.startDateTime)}
                            </span>
                            {event.venue && (
                                <span className="flex items-center gap-1.5">
                                    <RiMapPinLine />
                                    {event.venue}
                                </span>
                            )}
                        </div>

                        <p className="text-xs leading-relaxed line-clamp-2 mb-4 text-gunmetal-300 ">
                            {event.description}
                        </p>

                        {countdown && (
                            <div
                                className="inline-flex items-center gap-1 text-[10px] font-medium rounded-full px-2.5 py-1 mb-4"
                                style={{ background: `${accent}15`, color: accent }}
                            >
                                <RiTimeLine /> {countdown}
                            </div>
                        )}

                        <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid var(--color-border)" }}>
                            <span className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>
                                {event.isFree
                                    ? "Free Entry"
                                    : event.priceTiers?.length
                                        ? `From ৳${Math.min(...event.priceTiers.map((t) => t.fee))}`
                                        : "Paid"}
                            </span>
                            <span
                                className="inline-flex items-center gap-1 font-semibold transition-all duration-200 text-gunmetal-300 group-hover:gap-1.5">
                                Details <RiArrowRightLine />
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </FadeUpWrapper>
    )
}
export default EventCard
