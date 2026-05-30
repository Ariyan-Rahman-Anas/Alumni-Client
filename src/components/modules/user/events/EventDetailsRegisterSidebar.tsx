import { fmt, getCountdown, getStatusConfig } from "@/components/pages/user/Events/EventDetailsPage";
import PrimaryButton from "@/components/shared/PrimaryButton"
import { IEvent } from "@/types/common/events.types";
import { RiArrowRightLine, RiCalendarCheckLine, RiCheckboxCircleLine, RiInformationLine, RiPhoneLine, RiShareLine, RiShirtLine, RiTimeLine, RiUserAddLine, RiUserLine } from "react-icons/ri"
import { isPast } from "date-fns";

const EventDetailsRegisterSidebar = ({ event, alreadyRegistered }: { event: IEvent; alreadyRegistered: boolean }) => {
    const status = getStatusConfig(event);
    const countdown = getCountdown(event.startDateTime);
    const regCountdown = event.registrationDeadline ? getCountdown(event.registrationDeadline) : null;
    const isDisabled = event.status === "CANCELLED" || event.status === "COMPLETED";
    const lowestFee = event.priceTiers?.length
        ? Math.min(...event.priceTiers.map((t) => t.fee))
        : null;

    async function handleShare(event: IEvent) {
        const url = window.location.href;
        if (navigator.share) {
            await navigator.share({ title: event.title, text: event.description ?? "", url });
        } else {
            await navigator.clipboard.writeText(url);
        }
    }

    function buildGoogleCalendarUrl(event: IEvent) {
        const start = new Date(event.startDateTime).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
        const end = event.endDateTime
            ? new Date(event.endDateTime).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
            : start;
        const params = new URLSearchParams({
            action: "TEMPLATE",
            text: event.title,
            dates: `${start}/${end}`,
            details: event.description ?? "",
            location: event.venue ?? "",
        });
        return `https://calendar.google.com/calendar/render?${params.toString()}`;
    }

    return (
        <div><div className="sticky top-24 space-y-4">
            {/* Main CTA Card */}
            <div
                className="overflow-hidden rounded-3xl shadow-xl"
                style={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-primary2-200)",
                }}
            >
                {/* Dark header strip */}
                <div
                    className="relative overflow-hidden px-6 py-5"
                    style={{ background: "linear-gradient(135deg, var(--color-primary2-900) 0%, var(--color-primary2-700) 100%)" }}
                >
                    {/* subtle grid texture */}
                    <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="sgrid" width="28" height="28" patternUnits="userSpaceOnUse">
                                <path d="M 28 0 L 0 0 0 28" fill="none" stroke="white" strokeWidth="0.8" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#sgrid)" />
                    </svg>

                    <div className="relative z-10">
                        {/* Status badge */}
                        <div className="mb-3 flex items-center gap-2">
                            {status.pulse && (
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background: status.color }} />
                                    <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: status.color }} />
                                </span>
                            )}
                            <span
                                className="rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest"
                                style={{ background: `${status.bg}22`, color: status.bg, border: `1px solid ${status.color}40` }}
                            >
                                {status.label}
                            </span>
                        </div>

                        {/* Price */}
                        {!event.isFree && lowestFee !== null ? (
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(253,250,242,0.55)" }}>
                                    Starting from
                                </p>
                                <p className="text-3xl font-extrabold" style={{ color: "#FDFAF2" }}>
                                    {lowestFee.toLocaleString()}
                                </p>
                            </div>
                        ) : (
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(253,250,242,0.55)" }}>
                                    Entry
                                </p>
                                <p className="text-3xl font-extrabold" style={{ color: "#FDFAF2" }}>Free</p>
                            </div>
                        )}

                        {/* Countdown */}
                        {countdown && (
                            <p className="mt-2 flex items-center gap-1.5 text-xs" style={{ color: "var(--color-gold-300)" }}>
                                <RiTimeLine /> Event starts {countdown}
                            </p>
                        )}
                    </div>
                </div>

                {/* Body */}
                <div className="p-5 space-y-3">
                    {/* Registration deadline notice */}
                    {event.registrationDeadline && !isPast(new Date(event.registrationDeadline)) && (
                        <div
                            className="flex items-start gap-2 rounded-xl p-3 text-xs"
                            style={{ background: "var(--color-gold-50)", border: "1px solid var(--color-gold-200)", color: "#78350F" }}
                        >
                            <RiInformationLine className="mt-0.5 flex-shrink-0 text-sm" style={{ color: "var(--color-gold-600)" }} />
                            <span>
                                Registration closes <strong>{fmt(event.registrationDeadline)}</strong>
                                {regCountdown ? ` (${regCountdown})` : ""}
                            </span>
                        </div>
                    )}

                    {/* Register CTA ” only for events that require registration */}
                    {event.isRegistrationRequired && (alreadyRegistered ? (
                        <div className="flex items-center gap-2 rounded-2xl bg-primary2-50 border border-primary2-200 px-4 py-3.5 text-sm font-semibold text-primary2-700">
                            <RiCheckboxCircleLine className="text-lg flex-shrink-0" />
                            Already Registered
                        </div>
                    ) : (
                        <PrimaryButton
                            title="Register Now"
                            isDisabled={isDisabled}
                            icon={<RiUserAddLine className="text-base" />}
                            icon2={<RiArrowRightLine className="text-base" />}
                            href={!isDisabled && `/events/${event.slug}/register`} isFullWidth className="py-[19px]"
                        />
                    ))}

                    {/* Secondary actions */}
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => handleShare(event)}
                            className="flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-xs font-semibold transition-all duration-150 hover:shadow-sm"
                            style={{
                                background: "var(--color-surface-100)",
                                borderColor: "var(--color-border)",
                                color: "var(--color-text-secondary)",
                            }}
                        >
                            <RiShareLine /> Share
                        </button>
                        <a
                            href={buildGoogleCalendarUrl(event)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-xs font-semibold transition-all duration-150 hover:shadow-sm"
                            style={{
                                background: "var(--color-surface-100)",
                                borderColor: "var(--color-border)",
                                color: "var(--color-text-secondary)",
                            }}
                        >
                            <RiCalendarCheckLine /> Calendar
                        </a>
                    </div>

                    {/* Guests note */}
                    {event.allowGuests && (
                        <p className="flex items-start gap-1.5 text-[11px] leading-snug" style={{ color: "var(--color-text-muted)" }}>
                            <RiUserLine className="mt-0.5 flex-shrink-0" />
                            Up to {event.maxGuestsPerAlumni} guest{event.maxGuestsPerAlumni !== 1 ? "s" : ""} per alumni
                            {event.guestFee ? ` · ${event.guestFee} each` : ""}
                        </p>
                    )}

                    {/* T-shirt note */}
                    {event.collectsTShirtSize && (
                        <p className="flex items-start gap-1.5 text-[11px] leading-snug" style={{ color: "var(--color-text-muted)" }}>
                            <RiShirtLine className="mt-0.5 flex-shrink-0" />
                            T-shirt size will be collected during registration
                        </p>
                    )}
                </div>
            </div>

            {/* Contact Card */}
            {event.contactInfo && (
                <div
                    className="rounded-2xl p-4"
                    style={{
                        background: "var(--color-surface-100)",
                        border: "1px solid var(--color-border)",
                    }}
                >
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
                        Contact
                    </p>
                    <a
                        href={`tel:${event.contactInfo}`}
                        className="flex items-center gap-2 text-sm font-semibold transition-colors hover:text-primary"
                        style={{ color: "var(--color-primary2-700)" }}
                    >
                        <RiPhoneLine /> {event.contactInfo}
                    </a>
                </div>
            )}
        </div></div>
    )
}
export default EventDetailsRegisterSidebar