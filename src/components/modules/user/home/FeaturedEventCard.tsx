import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage"
import { Badge } from "@/components/ui/badge"
import { IEvent } from "@/types/common/events.types"
import Image from "next/image"
import Link from "next/link"
import { HiArrowUpRight } from "react-icons/hi2"
import { RiCalendarEventLine, RiFireLine, RiGroupLine, RiMapPinLine, RiTicketLine, RiTimeLine, RiUserLine } from "react-icons/ri"
import { formatEventDate, formatEventTime, getCategoryColor, getCountdown, getStatusMeta } from "./EventsSection"

const FeaturedEventCard = ({ event }: { event: IEvent }) => {
    const status = getStatusMeta(event);
    const catColor = getCategoryColor(event.category);
    const countdown = getCountdown(event.startDateTime);

    return (
        <FadeUpWrapper delay={0.4}>
            <Link href={`/events/${event.slug}`} className="block group overflow-hidden shadow hover:shadow-lg transition-all duration-500 rounded-3xl">
                <div className="relative rounded-3xl overflow-hidden">
                    {/* Cover Image */}
                    <div className="relative h-72 md:h-96 overflow-hidden">
                        <Image
                            src={event.coverImage ?? "/event-placeholder.jpg"}
                            alt={event.title}
                            layout="fill"
                            objectFit="cover"
                            className="transition-transform duration-700 group-hover:scale-105"
                        />
                        <div
                            className="absolute inset-0"
                            style={{
                                background:
                                    "linear-gradient(to top, rgba(10,61,43,0.92) 0%, rgba(10,61,43,0.55) 45%, rgba(10,61,43,0.10) 100%)",
                            }}
                        />

                        {/* Top Badges */}
                        <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                            <div className="flex items-center gap-2 flex-wrap">
                                <Badge
                                    className="text-[10px] font-semibold uppercase tracking-widest rounded-full px-3 py-1 backdrop-blur-sm border"
                                    style={{ background: `${catColor.bg}CC`, color: catColor.text, borderColor: catColor.border }}
                                >
                                    {event.category}
                                </Badge>
                                {event.isFeatured && (
                                    <Badge
                                        className="text-[10px] font-semibold uppercase tracking-widest rounded-full px-3 py-1 flex items-center gap-1"
                                        style={{ background: "var(--color-gold-500)", color: "#0F3C24" }}
                                    >
                                        <RiFireLine className="text-xs" /> Featured
                                    </Badge>
                                )}
                            </div>
                            <Badge
                                className="text-[10px] font-semibold text-gray-100 uppercase tracking-wider rounded-full px-3 py-1 border">
                                {status.label}
                            </Badge>
                        </div>

                        {/* Bottom Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                            {countdown && (
                                <p className="text-xs font-medium mb-2 flex items-center gap-1" style={{ color: "var(--color-gold-300)" }}>
                                    <RiTimeLine /> Starts {countdown}
                                </p>
                            )}
                            <h3 className="font-display font-bold text-2xl md:text-3xl leading-tight mb-3" style={{ color: "#FDFAF2" }}>
                                {event.title}
                            </h3>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm" style={{ color: "rgba(253,250,242,0.80)" }}>
                                <span className="flex items-center gap-1.5"><RiCalendarEventLine />{formatEventDate(event.startDateTime)}</span>
                                <span className="flex items-center gap-1.5"><RiTimeLine />{formatEventTime(event.startDateTime)}</span>
                                {event.venue && <span className="flex items-center gap-1.5"><RiMapPinLine />{event.venue}</span>}
                                {event.maxAttendees && <span className="flex items-center gap-1.5"><RiGroupLine />{event.maxAttendees} seats</span>}
                            </div>
                        </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6" style={{ background: "var(--color-surface)" }}>
                        <p className="text-sm leading-relaxed line-clamp-2 mb-5" style={{ color: "var(--color-text-secondary)" }}>
                            {event.description}
                        </p>

                        {/* Price Tiers */}
                        {event.priceTiers && event.priceTiers.length > 0 && (
                            <div className="mb-5">
                                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--color-primary2-600)" }}>
                                    Registration Fee
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {event.priceTiers.map((tier) => (
                                        <div
                                            key={tier.label}
                                            className="text-xs rounded-lg px-3 py-1.5 border"
                                            style={{ background: "var(--color-surface-100)", borderColor: "var(--color-primary2-200)", color: "var(--color-primary2-800)" }}
                                        >
                                            <span className="font-medium">{tier.label}</span>
                                            <span className="mx-1" style={{ color: "var(--color-text-muted)" }}>·</span>
                                            <span className="font-bold">৳{tier.fee}</span>
                                        </div>
                                    ))}
                                    {event.allowGuests && (
                                        <div
                                            className="text-xs rounded-lg px-3 py-1.5 border"
                                            style={{ background: "var(--color-gold-50)", borderColor: "var(--color-gold-300)", color: "var(--color-gold-800)" }}
                                        >
                                            <span className="font-medium">Guest</span>
                                            <span className="mx-1">·</span>
                                            <span className="font-bold">৳{event.guestFee}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Event Flow */}
                        {event.eventFlow && event.eventFlow.length > 0 && (
                            <div className="mb-5">
                                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--color-primary2-600)" }}>
                                    Program Highlights
                                </p>
                                <div className="flex flex-col gap-1">
                                    {event.eventFlow.slice(0, 3).map((item, i) => (
                                        <div key={i} className="flex items-start gap-2 text-xs" style={{ color: "var(--color-text-secondary)" }}>
                                            <span
                                                className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                                                style={{ background: "var(--color-primary2-100)", color: "var(--color-primary2-700)" }}
                                            >
                                                {i + 1}
                                            </span>
                                            {item}
                                        </div>
                                    ))}
                                    {event.eventFlow.length > 3 && (
                                        <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                                            +{event.eventFlow.length - 3} more
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4" style={{ borderTop: "1px solid var(--color-border)" }}>
                            <div className="flex items-center gap-4 text-xs" style={{ color: "var(--color-text-muted)" }}>
                                {event.organizer && <span className="flex items-center gap-1"><RiUserLine /> {event.organizer}</span>}
                                {event.registrationDeadline && (
                                    <span className="flex items-center gap-1">
                                        <RiTicketLine /> Register by {formatEventDate(event.registrationDeadline)}
                                    </span>
                                )}
                            </div>
                            <span
                                className="inline-flex items-center gap-1 text-xs font-semibold transition-all duration-200 group-hover:gap-2"
                                style={{ color: "var(--color-primary2-600)" }}
                            >
                                View Details <HiArrowUpRight />
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </FadeUpWrapper>
    )
}
export default FeaturedEventCard
