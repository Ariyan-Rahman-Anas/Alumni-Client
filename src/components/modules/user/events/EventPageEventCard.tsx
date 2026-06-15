"use client"

import Image from "next/image"
import Link from "next/link"
import {
    RiMapPin2Line,
    RiTimeLine,
    RiGroupLine,
    RiGiftLine,
    RiArrowRightLine,
} from "react-icons/ri"
import { MdOutlineVideocam } from "react-icons/md"
import DateFormatter from "@/lib/DateFormatter"
import PrimaryButton from "@/components/shared/PrimaryButton"
import { IEvent, PriceTier } from "@/types/common/events.types"
import { useGetMyRegistrationsQuery } from "@/redux/apis/eventApi"
import { useAppSelector } from "@/redux/hooks"
import { selectCurrentUser, selectIsInitialized } from "@/redux/slice/authSlice"
import { RiCheckboxCircleLine } from "react-icons/ri"

// ─── Constants ───────────────────────────────────────────────────────────────
const TIER_COLORS = [
    "from-emerald-400 to-emerald-600",
    "from-amber-400 to-amber-600",
    "from-violet-400 to-violet-600",
    "from-pink-400 to-pink-600",
    "from-sky-400 to-sky-600",
]

const STATUS_CONFIG: Record<string, {
    bg: string
    text: string
    dot: string
    border: string
    label: string
}> = {
    UPCOMING: {
        bg: "bg-white/15",
        text: "text-white",
        dot: "bg-white/90",
        border: "border-white/25",
        label: "Upcoming",
    },
    ONGOING: {
        bg: "bg-emerald-500/90",
        text: "text-white",
        dot: "bg-white animate-pulse",
        border: "border-emerald-400/40",
        label: "Live Now",
    },
    COMPLETED: {
        bg: "bg-neutral-800/70",
        text: "text-neutral-300",
        dot: "bg-neutral-500",
        border: "border-neutral-600/40",
        label: "Completed",
    },
    CANCELLED: {
        bg: "bg-red-600/80",
        text: "text-white",
        dot: "bg-white/80",
        border: "border-red-400/40",
        label: "Cancelled",
    },
}

const LOCATION_CONFIG: Record<string, {
    style: string
    icon: React.ReactNode
    label: string
}> = {
    PHYSICAL: {
        style: "bg-amber-50 text-amber-800 border-amber-200/80",
        icon: <RiMapPin2Line className="shrink-0" />,
        label: "In-Person",
    },
    ONLINE: {
        style: "bg-indigo-50 text-indigo-800 border-indigo-200/80",
        icon: <MdOutlineVideocam className="shrink-0" />,
        label: "Online",
    },
    HYBRID: {
        style: "bg-teal-50 text-teal-800 border-teal-200/80",
        icon: <span className="text-[11px] shrink-0">🌐</span>,
        label: "Hybrid",
    },
}

// ─── Component ───────────────────────────────────────────────────────────────

const EventPageEventCard = ({ event }: { event: IEvent }) => {
    const { _id, locationType, startDateTime, slug, status, coverImage, title, isFree, category, priceTiers, venue, maxAttendees,
        // allowGuests, collectsTShirtSize, createdAt, description, eventFlow, guestFee, isFeatured, isRegistrationRequired, maxGuestsPerAlumni, updatedAt, contactInfo, coverImagePublicId, endDateTime, meetingLink, organizer, registrationDeadline, registrationOpensAt 

    } = event || {}

    const authUser = useAppSelector(selectCurrentUser);
    const isInitialized = useAppSelector(selectIsInitialized);
    const { data: myRegsData } = useGetMyRegistrationsQuery(undefined, {
        skip: !isInitialized || !authUser,
    });
    const alreadyRegistered = myRegsData?.data?.some((r) => {
        const evId = typeof r.eventId === "object" ? String(r.eventId._id) : String(r.eventId);
        return evId === String(_id) && r.status !== "CANCELLED";
    }) ?? false;

    const isCancelled = status === "CANCELLED"
    const statusConfig = STATUS_CONFIG[status] ?? STATUS_CONFIG.UPCOMING
    const locInfo = LOCATION_CONFIG[locationType ?? "PHYSICAL"]

    const eventDate = new Date(event.startDateTime)
    const month = eventDate.toLocaleString("default", { month: "short" }).toUpperCase()
    const day = eventDate.getDate()
    const weekday = eventDate.toLocaleString("default", { weekday: "short" })

    return (
        <article
            className={`
                group relative flex flex-col overflow-hidden rounded-[1.75rem]
                border border-surface-200 bgwhite
                shadow-[0_2px_20px_rgba(10,61,43,0.06)]
                transition-all duration-500 ease-out
                ${isCancelled
                    ? "opacity-60 grayscale-[40%]"
                    : "hover:shadow-[0_8px_40px_rgba(10,61,43,0.14)] hover:-translate-y-1 hover:border-primary2-200/60"
                }
            `}
        >
            {/* ── Cover Image ─────────────────────────────────────── */}
            <div className="relative h-52 w-full overflow-hidden bg-primary2-950">
                {coverImage && (
                    <Image
                        src={coverImage}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary2-950/80 via-primary2-950/10 to-transparent" />

                {/* Category chip — top left */}
                <div className="absolute left-4 top-4">
                    <span className="rounded-lg border border-white/25 bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md">
                        {category}
                    </span>
                </div>

                {/* Date badge — top right */}
                <div className="absolute right-4 top-4 rounded-xl border border-white/20 bg-primary2-950/60 px-3 py-2 text-center backdrop-blur-md">
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-primary2-300">
                        {weekday}
                    </span>
                    <span className="block text-xl font-extrabold leading-none text-white font-sanchez">
                        {day}
                    </span>
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-primary2-300">
                        {month}
                    </span>
                </div>

                {/* Status badge — bottom left */}
                <div className="absolute bottom-4 left-4">
                    <div className={`
                        inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 backdrop-blur-md
                        ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}
                    `}>
                        <span className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot}`} />
                        <span className="text-[10px] font-bold tracking-widest uppercase">{statusConfig.label}</span>
                    </div>
                </div>

                {/* Location type badge — bottom right */}
                <div className="absolute bottom-4 right-4">
                    <div className={`
                        flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold
                        backdrop-blur-md bg-white/90 shadow-sm
                        ${locInfo.style}
                    `}>
                        {locInfo.icon}
                        <span>{locInfo.label}</span>
                    </div>
                </div>
            </div>

            {/* ── Body ────────────────────────────────────────────── */}
            <div className="flex flex-1 flex-col p-6">

                {/* Title */}
                <h2 className="mb-3 font-sanchez text-xl font-bold leading-snug text-neutral-900 transition-colors group-hover:text-primary2-800">
                    {title}
                </h2>

                {/* Meta row */}
                <div className="mb-5 grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <RiTimeLine className="shrink-0 text-primary2-500" />
                        <DateFormatter date={startDateTime} isShowTime={true} />
                    </div>
                    <div className="flex items-center justify-end gap-2 text-sm text-neutral-500">
                        <RiMapPin2Line className="shrink-0 text-primary2-500" />
                        <span className="truncate">{venue || "TBA"}</span>
                    </div>
                    {maxAttendees && (
                        <div className="flex items-center gap-2 text-sm text-neutral-500">
                            <RiGroupLine className="shrink-0 text-primary2-500" />
                            <span>{maxAttendees.toLocaleString()} seats available</span>
                        </div>
                    )}
                </div>

                {/* Separator */}
                <div className="mb-5 h-px w-full bg-surface-200" />

                {/* Pricing */}
                <div className="mb-5 flex-1">
                    {isFree ? (
                        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                            <RiGiftLine className="text-lg text-emerald-600 shrink-0" />
                            <div>
                                <p className="text-xs font-black uppercase tracking-wider text-emerald-700">Free Entry</p>
                                <p className="text-[10px] text-emerald-600/70">Open to all — no registration fee</p>
                            </div>
                        </div>
                    ) : priceTiers?.length > 0 ? (
                        <div className="space-y-2">
                            {/* {priceTiers.slice(0, 2).map((tier: any, i: number) => ( */}
                            {priceTiers.map((tier: PriceTier, i: number) => (
                                <div
                                    key={i + tier.label}
                                    className="flex items-center justify-between rounded-xl border border-surface-200 bg-surface-50 px-3.5 py-2.5"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`h-7 w-1 rounded-full bg-gradient-to-b ${TIER_COLORS[i % TIER_COLORS.length]}`} />
                                        <div>
                                            <p className="text-xs font-bold text-neutral-800">{tier.label}</p>
                                            <p className="text-[10px] uppercase tracking-wide text-neutral-400">Tier {i + 1}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-black text-primary2-900">
                                        ৳{tier.fee.toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : null}
                </div>

                {/* Action row */}
                <div className="flex items-center gap-3">
                    {alreadyRegistered ? (
                        <Link
                            href={`/events/${slug || _id}`}
                            className="flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
                        >
                            <RiCheckboxCircleLine className="text-base flex-shrink-0" />
                            Already Registered — View Details
                        </Link>
                    ) : (
                        <PrimaryButton
                            isDisabled={isCancelled}
                            isFullWidth
                            title={isCancelled ? "Cancelled" : isFree ? "Attend for Free" : "Register Now"}
                            icon={<RiArrowRightLine className="transition-transform group-hover:translate-x-0.5" />}
                            iconSide2="right"
                            className="py-[19px] rounded-xl"
                            href={`/events/${slug || _id}`}
                        />
                    )}
                </div>
            </div>
        </article>
    )
}
export default EventPageEventCard