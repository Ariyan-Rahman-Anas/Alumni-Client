"use client";

import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetAllPublishedEventsQuery } from "@/redux/apis/eventApi";
import { IEvent } from "@/types/common/events.types";
import Link from "next/link";
import {
    RiArrowRightLine,
    RiCalendarEventLine,
    RiMapPinLine,
    RiTimeLine,
    RiUserLine,
    RiGroupLine,
    RiFireLine,
    RiTicketLine,
} from "react-icons/ri";
import { HiArrowUpRight } from "react-icons/hi2";
import { format, formatDistanceToNow, isPast, isWithinInterval, addDays } from "date-fns";
import SectionLabel from "@/components/shared/SectionLabel";
import Image from "next/image";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStatusMeta(event: IEvent) {
    const now = new Date();
    const start = new Date(event.startDateTime);
    // Guard: endDateTime may be undefined on the IEvent type
    const end = event.endDateTime ? new Date(event.endDateTime) : null;
    const regDeadline = event.registrationDeadline ? new Date(event.registrationDeadline) : null;
    const regOpens = event.registrationOpensAt ? new Date(event.registrationOpensAt) : null;

    if (event.status === "ONGOING" || (end && start <= now && end >= now)) {
        return { label: "Live Now", color: "var(--color-success-DEFAULT)", bg: "var(--color-success-light)" };
    }
    if (regDeadline && isPast(regDeadline)) {
        return { label: "Registration Closed", color: "var(--color-danger-DEFAULT)", bg: "var(--color-danger-light)" };
    }
    if (regDeadline && isWithinInterval(regDeadline, { start: now, end: addDays(now, 3) })) {
        return { label: "Closing Soon", color: "#D97706", bg: "#FEF9C3" };
    }
    if (regOpens && regOpens > now) {
        return { label: "Registration Opens Soon", color: "#2563EB", bg: "#DBEAFE" };
    }
    return { label: "Registration Open", color: "var(--color-primary2-600)", bg: "var(--color-primary2-50)" };
}

function getCategoryColor(category: string) {
    const map: Record<string, { text: string; bg: string; border: string }> = {
        Reunion: { text: "#0F3C24", bg: "#C3E8CE", border: "#72C48C" },
        Community: { text: "#92400E", bg: "#FEF3C7", border: "#FCD34D" },
        Initiative: { text: "#1E3A8A", bg: "#DBEAFE", border: "#93C5FD" },
        Academic: { text: "#4A1B0C", bg: "#FAECE7", border: "#F0997B" },
        Sports: { text: "#3B6D11", bg: "#EAF3DE", border: "#97C459" },
        Cultural: { text: "#86198F", bg: "#FDF2F8", border: "#E879F9" },
    };
    return map[category] ?? { text: "#3A3A38", bg: "#F4F4F2", border: "#D4D4CE" };
}

function formatEventDate(dateStr: string) {
    return format(new Date(dateStr), "d MMM yyyy");
}

function formatEventTime(dateStr: string) {
    return format(new Date(dateStr), "h:mm a");
}

function getCountdown(dateStr: string) {
    const d = new Date(dateStr);
    if (isPast(d)) return null;
    return formatDistanceToNow(d, { addSuffix: true });
}

// ─── Featured Card ────────────────────────────────────────────────────────────

function FeaturedEventCard({ event }: { event: IEvent }) {
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
                                className="text-[10px] font-semibold text-gray-100 uppercase tracking-wider rounded-full px-3 py-1 border"
                                // style={{ borderColor: `${status.color}40` }}
                            >
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
    );
}

// ─── Standard Event Card ──────────────────────────────────────────────────────

function EventCard({ event, index }: { event: IEvent; index: number }) {
    const status = getStatusMeta(event);
    const catColor = getCategoryColor(event.category);
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
                            <Badge
                                className="text-[10px] font-semibold uppercase tracking-wider rounded-md px-2 py-0.5 border"
                                style={{ background: catColor.bg, color: catColor.text, borderColor: catColor.border }}
                            >
                                {event.category}
                            </Badge>
                            <Badge
                                className="text-[10px] font-medium rounded-md px-2 py-0.5"
                                style={{ background: `${status.bg}CC`, color: status.color, border: `1px solid ${status.color}30` }}
                            >
                                {status.label}
                            </Badge>
                        </div>

                        <h3
                            className="font-display font-semibold text-base leading-snug mb-2 line-clamp-2"
                            style={{ color: "var(--color-primary2-800)" }}
                        >
                            {event.title}
                        </h3>

                        <div className="flex flex-col gap-1 mb-3 text-xs" style={{ color: "var(--color-text-secondary)" }}>
                            <span className="flex items-center gap-1.5">
                                <RiCalendarEventLine style={{ color: accent }} />
                                {formatEventDate(event.startDateTime)} · {formatEventTime(event.startDateTime)}
                            </span>
                            {event.venue && (
                                <span className="flex items-center gap-1.5">
                                    <RiMapPinLine style={{ color: accent }} />
                                    {event.venue}
                                </span>
                            )}
                        </div>

                        <p className="text-xs leading-relaxed line-clamp-2 mb-4" style={{ color: "var(--color-text-secondary)" }}>
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
                                className="inline-flex items-center gap-1 text-[11px] font-semibold transition-all duration-200 group-hover:gap-1.5"
                                style={{ color: accent }}
                            >
                                Details <RiArrowRightLine />
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </FadeUpWrapper>
    );
}

// ─── Skeletons ────────────────────────────────────────────────────────────────

function FeaturedSkeleton() {
    return (
        <div className="rounded-3xl overflow-hidden shadow-md" style={{ background: "var(--color-surface)" }}>
            <div className="skeleton h-96 w-full" />
            <div className="p-6 space-y-3">
                <div className="skeleton h-4 w-32 rounded" />
                <div className="skeleton h-5 w-full rounded" />
                <div className="skeleton h-5 w-2/3 rounded" />
            </div>
        </div>
    );
}

function CardSkeleton() {
    return (
        <div className="rounded-2xl overflow-hidden shadow-sm" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
            <div className="h-1 skeleton" />
            <div className="skeleton h-36 w-full" />
            <div className="p-5 space-y-3">
                <div className="skeleton h-3 w-24 rounded" />
                <div className="skeleton h-4 w-full rounded" />
                <div className="skeleton h-3 w-3/4 rounded" />
            </div>
        </div>
    );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyEvents() {
    return (
        <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
            <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-2xl"
                style={{ background: "var(--color-primary2-50)", color: "var(--color-primary2-400)" }}
            >
                <RiCalendarEventLine />
            </div>
            <p className="font-display font-semibold text-lg mb-1" style={{ color: "var(--color-primary2-800)" }}>
                No upcoming events
            </p>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                Check back soon for reunions, drives & initiatives.
            </p>
        </div>
    );
}

// ─── Main Section ─────────────────────────────────────────────────────────────

const EventsSection = () => {
    const { data: allEventsData, isLoading } = useGetAllPublishedEventsQuery({});

    const allEvents: IEvent[] = allEventsData?.data || [];
    const featuredEvents: IEvent[] = allEvents.filter((e) => e.isFeatured).slice(0, 1);
    const otherEvents: IEvent[] = allEvents.filter((e) => !e.isFeatured).slice(0, 3);

    return (
        <section className="three-xl-section-setup">
            <FadeUpWrapper delay={0.1} className="text-left w-fit mb-8">
                <SectionLabel text="What's Happening" align="left" icon={<RiCalendarEventLine />} />
                <h2 className="section-heading-text-left text-primary2-800">
                    Events &amp; Initiatives
                </h2>
                <p className="text-muted-foreground mt-2">
                    Stay connected — reunions, blood drives, scholarship campaigns and more await you.
                </p>
            </FadeUpWrapper>

            {isLoading && (
                <div className="space-y-8">
                    <FeaturedSkeleton />
                    <div className="grid md:grid-cols-3 gap-6">
                        <CardSkeleton />
                        <CardSkeleton />
                        <CardSkeleton />
                    </div>
                </div>
            )}

            {!isLoading && (
                <>
                    {featuredEvents.length > 0 && (
                        <div className="mb-8">
                            <FeaturedEventCard event={featuredEvents[0]} />
                        </div>
                    )}

                    {otherEvents.length > 0 ? (
                        <div className="grid md:grid-cols-3 gap-6 mb-10">
                            {otherEvents.map((event, i) => (
                                <EventCard key={event._id} event={event} index={i} />
                            ))}
                        </div>
                    ) : (
                        !featuredEvents.length && <EmptyEvents />
                    )}

                    {featuredEvents.length > 0 && otherEvents.length === 0 && (
                        <div
                            className="mb-10 rounded-2xl py-8 text-center"
                            style={{ background: "var(--color-primary2-50)", border: "1px dashed var(--color-primary2-200)" }}
                        >
                            <p className="text-sm font-medium" style={{ color: "var(--color-primary2-600)" }}>
                                More events coming soon — stay tuned!
                            </p>
                        </div>
                    )}
                </>
            )}

            {!isLoading && (
                <FadeUpWrapper className="text-right">
                    <Button asChild className="rounded-xl font-medium px-7 py-5 shadow-md hover:shadow-lg transition-shadow duration-200">
                        <Link href="/events">
                            Browse All Events <RiArrowRightLine className="ml-1.5" />
                        </Link>
                    </Button>
                </FadeUpWrapper>
            )}
        </section>
    );
};

export default EventsSection;