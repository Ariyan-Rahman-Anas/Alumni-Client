"use client"

import Image from "next/image"
import Link from "next/link"
import { LuShieldPlus } from "react-icons/lu";
import {
    RiMapPin2Line,
    RiTimeLine,
    RiGiftLine,
} from "react-icons/ri"
import { HiArrowNarrowRight } from "react-icons/hi";
import DateFormatter from "@/lib/DateFormatter"
import PrimaryButton from "@/components/shared/PrimaryButton"
import { IEvent, PriceTier } from "@/types/common/events.types"
import { useGetMyRegistrationsQuery } from "@/redux/apis/eventApi"
import { useAppSelector } from "@/redux/hooks"
import { selectCurrentUser, selectIsInitialized } from "@/redux/slice/authSlice"
import { RiCheckboxCircleLine } from "react-icons/ri"
import { constantsData } from "@/constants";

// ─── Constants 
const TIER_COLORS = [
    "from-emerald-400 to-emerald-600",
    "from-amber-400 to-amber-600",
    "from-violet-400 to-violet-600",
    "from-pink-400 to-pink-600",
    "from-sky-400 to-sky-600",
]

const EventPageEventCard = ({ event }: { event: IEvent }) => {
    const { _id, locationType, startDateTime, slug, status, coverImage, title, isFree, category, priceTiers, venue, registrationOpensAt, registrationDeadline
        // allowGuests, collectsTShirtSize, createdAt, description, eventFlow, guestFee, isFeatured, isRegistrationRequired, maxGuestsPerAlumni, updatedAt, contactInfo, coverImagePublicId, endDateTime, meetingLink, organizer, registrationDeadline, registrationOpensAt, maxAttendees

    } = event || {}

    const authUser = useAppSelector(selectCurrentUser);
    const isInitialized = useAppSelector(selectIsInitialized);
    const { data: myRegsData } = useGetMyRegistrationsQuery(undefined, {
        skip: !isInitialized || !authUser,
    });
    const alreadyRegistered = myRegsData?.data?.some((r) => {
        const evId = typeof r.eventId === "object" ? String(r.eventId._id) : String(r.eventId);
        return evId === String(_id) && r.status !== constantsData.event.eventStatus.CANCELLED;
    }) ?? false;

    const isCancelled = status === constantsData.event.eventStatus.CANCELLED

    const isRegistrationDatePassed = new Date(registrationDeadline as string) < new Date()

    const eventDate = new Date(event.startDateTime)
    const year = eventDate.toLocaleString("default", { year: "numeric" })
    const month = eventDate.toLocaleString("default", { month: "short" })
    const day = eventDate.getDate()
    const weekday = eventDate.toLocaleString("default", { weekday: "short" })

    return (
        <article
            className={`
                group relative flex flex-col overflow-hidden rounded-2xl shadow transition-all duration-500 ease-out
                ${isCancelled
                    ? "opacity-60 grayscale-[40%]"
                    : "hover:shadow-[0_8px_40px_rgba(10,61,43,0.14)] hover:-translate-y-1 hover:border-primary2-200/60"
                }
            `}
        >
            {/* ── Cover Image  */}
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

                {/* Date badge — top right */}
                <div className="absolute right-3 bottom-2 rounded-lg bg-black primary2-950 px-3 py-2 text-center backdrop-blur-md">
                    <span className="block text-[9px] font-bold tracking-wider text-primary2-200 dark:text-primary mb-1">
                        {weekday}
                    </span>
                    <span className="block text-xl font-extrabold leading-none text-white dark:text-gunmetal-100 font-sanchez">
                        {day}
                    </span>
                    <span className="block text-[9px] font-bold tracking-wider text-white dark:text-gunmetal-100 primary2-300">
                        {month}
                    </span>
                    <span className="block text-[9px] font-bold tracking-wider text-white dark:text-gunmetal-100 primary2-300">
                        {year}
                    </span>
                </div>

                <div className="absolute top-2 left-3 flex items-center justify-between gap-4">
                    {/* Status badge  */}
                    <div className="">
                        <span className="rounded-full bg-black px-3 py-1 text-[10px] font-bold tracking-widest text-white capitalize  dark:text-gunmetal-100 ">
                            {status.slice(0, 1) + status.toLowerCase().slice(1)}
                        </span>
                    </div>

                    {/* Category chip  */}
                    <div className="">
                        <span className="rounded-full bg-black px-3 py-1 text-[10px] font-bold tracking-widest capitalize text-white dark:text-gunmetal-100 ">
                            {category.toLowerCase()}
                        </span>
                    </div>

                    {/* Location type badge  */}
                    <div className="">
                        <span className="rounded-full bg-black px-3 py-1 text-[10px] font-bold tracking-widest text-white capitalize  dark:text-gunmetal-100 ">
                            {locationType.slice(0, 1) + locationType.toLowerCase().slice(1)}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Body  */}
            <div className="flex flex-1 flex-col p-4">
                {/* Title */}
                <h2 className="mb-3 font-sanchez text-xl font-bold leading-snug text-neutral-900 transition-colors group-hover:text-primary2-800 dark:text-gunmetal-200">
                    {title}
                </h2>

                {/* Meta row */}
                <div className="mb-5 space-y-1.5">
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <RiMapPin2Line className="shrink-0 text-primary2-500" />
                        <span className="truncate"><strong>Venue: </strong>  {venue || "TBA"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <RiTimeLine className="shrink-0 text-primary2-500" />
                        <span>
                            <strong>Scheduled At: </strong>
                            <DateFormatter date={startDateTime} isShowTime={true} />
                        </span>
                    </div>
                    {registrationOpensAt && registrationDeadline && <div className="flex items-center gap-2">
                        <LuShieldPlus className="shrink-0 text-primary2-500" />
                        <span className="text-sm text-neutral-500">
                            {registrationDeadline && (
                                <span><strong>Register Period:</strong>  <DateFormatter date={registrationOpensAt} /> - <DateFormatter date={registrationDeadline} /> </span>
                            )}
                        </span>
                    </div>}
                </div>

                {/* Separator */}
                <div className="mb-5 h-px w-full bg-surface-200" />

                {/* Pricing */}
                <div className="mb-5 flex-1">
                    {isFree ? (
                        <div className="flex items-center gap-2.5 rounded-xl text-primary2-600 dark:text-gunmetal-300 border border-primary2-100 dark:border-gunmetal-500 bg-primary2-50 dark:bg-gunmetal-600 px-4 py-3">
                            <RiGiftLine className="text-lg shrink-0" />
                            <div>
                                <p className="text-xs font-black uppercase tracking-wider">Free Entry</p>
                                <p className="text-xs">Open to all — no registration fee</p>
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
                <div className="flex items-center mt-3 gap-3 w-fit mx-auto">
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
                            isDisabled={isCancelled || isRegistrationDatePassed}
                            isFullWidth
                            title={isCancelled ? "Cancelled" : isRegistrationDatePassed ? "Registration Date Passed" : isFree ? "Attend for Free" : `Register Before`}
                            icon2={!isCancelled && !isRegistrationDatePassed ? <HiArrowNarrowRight className="text-2xl" /> : null}
                            className="bg-transparent text-primary2-500 hover:text-white hover:bg-primary2-500 dark:text-gunmetal-100 dark:bg-transparent border-2 border-primary2-300 font-semibold hover:border-transparent dark:border-gunmetal-400 hover:dark:border-gunmetal-500 hover:dark:bg-gunmetal-500 duration-500"
                            href={`/events/${slug || _id}`}
                        />
                    )}
                </div>
            </div>
        </article>
    )
}
export default EventPageEventCard