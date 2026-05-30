"use client";

import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage";
import { useGetAllPublishedEventsQuery } from "@/redux/apis/eventApi";
import { IEvent } from "@/types/common/events.types";
import {
    RiArrowRightLine,
    RiCalendarEventLine,
} from "react-icons/ri";
import { format, formatDistanceToNow, isPast, isWithinInterval, addDays } from "date-fns";
import SectionLabel from "@/components/shared/SectionLabel";
import FeaturedEventCard from "./FeaturedEventCard";
import EventCard from "./EventCard";
import PrimaryButton from "@/components/shared/PrimaryButton";

// ─── Helpers 
export function getStatusMeta(event: IEvent) {
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
    return { label: "Registration Open", color: "var(--color-primary-600)", bg: "var(--color-primary-50)" };
}

export function getCategoryColor(category: string) {
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

export function formatEventDate(dateStr: string) {
    return format(new Date(dateStr), "d MMM yyyy");
}

export function formatEventTime(dateStr: string) {
    return format(new Date(dateStr), "h:mm a");
}

export function getCountdown(dateStr: string) {
    const d = new Date(dateStr);
    if (isPast(d)) return null;
    return formatDistanceToNow(d, { addSuffix: true });
}

// ─── Skeletons 
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

// ─── Empty State 
function EmptyEvents() {
    return (
        <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
            <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-2xl"
                style={{ background: "var(--color-primary-50)", color: "var(--color-primary-400)" }}
            >
                <RiCalendarEventLine />
            </div>
            <p className="font-display font-semibold text-lg mb-1" style={{ color: "var(--color-primary-800)" }}>
                No upcoming events
            </p>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                Check back soon for reunions, drives & initiatives.
            </p>
        </div>
    );
}

// ─── Main Section 
const EventsSection = () => {
    const { data: allEventsData, isLoading } = useGetAllPublishedEventsQuery({});

    const allEvents: IEvent[] = allEventsData?.data || [];
    const featuredEvents: IEvent[] = allEvents.filter((e) => e.isFeatured).slice(0, 1);
    const otherEvents: IEvent[] = allEvents.filter((e) => !e.isFeatured).slice(0, 3);

    return (
        <section className="three-xl-section-setup">
            <FadeUpWrapper delay={0.1} className="text-left w-fit mb-8">
                <SectionLabel text="What's Happening" align="left" icon={<RiCalendarEventLine />} className="dark:text-gunmetal-300 dark:border-gunmetal-500 " />
                <h2 className="section-heading-text-left mt-5 text-primary2-800 dark:text-primary">
                    Events &amp; Initiatives
                </h2>
                <p className="text-gunmetal-300 mt-2">
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
                            <p className="text-sm font-medium" style={{ color: "var(--color-primary-600)" }}>
                                More events coming soon — stay tuned!
                            </p>
                        </div>
                    )}
                </>
            )}

            {!isLoading && (
                <FadeUpWrapper className="text-right">
                    <PrimaryButton type="button" title="Browse All Events" href={"/events"} className="bg-primary2-600 text-white" icon2={<RiArrowRightLine />} />
                </FadeUpWrapper>
            )}
        </section>
    );
};
export default EventsSection;
