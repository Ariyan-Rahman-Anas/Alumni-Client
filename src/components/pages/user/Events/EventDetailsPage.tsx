"use client";

import { useParams, notFound } from "next/navigation";
import {
  RiCalendarEventLine,
  RiMapPin2Line,
  RiTimeLine,
  RiGroupLine,
  RiUserLine,
  RiArrowRightLine,
  RiTicketLine,
  RiCheckboxCircleLine,
  RiMedalLine,
  RiShirtLine,
  RiUserAddLine,
  RiGlobalLine,
} from "react-icons/ri";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { IEvent } from "@/types/common/events.types";
import { format, formatDistanceToNow, isPast, isWithinInterval, addDays } from "date-fns";
import { useGetEventBySlugQuery, useGetMyRegistrationsQuery } from "@/redux/apis/eventApi";
import PrimaryButton from "@/components/shared/PrimaryButton";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser, selectIsInitialized } from "@/redux/slice/authSlice";
import EventDetailsRegisterSidebar from "@/components/modules/user/events/EventDetailsRegisterSidebar";
import EventDetailsHero from "@/components/modules/user/events/EventDetailsHero";
import EventDetailsPriceTiers from "@/components/modules/user/events/EventDetailsPriceTiers";
import EventDetailsRegistrationRules from "@/components/modules/user/events/EventDetailsRegistrationRules";
import EventDetailsEventFlow from "@/components/modules/user/events/EventDetailsEventFlow";
import { FadeUpWrapper } from "../Home/HomePage";
import EventDetailsMetaChip from "@/components/modules/user/events/EventDetailsMetaChip";
import EventDetailsSkeleton from "@/components/modules/user/events/EventDetailsSkeleton";

// ”€”€”€ Helpers 
export function fmt(dateStr: string, pattern = "d MMM yyyy") {
  return format(new Date(dateStr), pattern);
}
export function fmtTime(dateStr: string) {
  return format(new Date(dateStr), "h:mm a");
}
export function getCountdown(dateStr: string) {
  const d = new Date(dateStr);
  if (isPast(d)) return null;
  return formatDistanceToNow(d, { addSuffix: true });
}

export function getStatusConfig(event: IEvent) {
  const now = new Date();
  const start = new Date(event.startDateTime);
  const end = event.endDateTime ? new Date(event.endDateTime) : null;
  const regDeadline = event.registrationDeadline ? new Date(event.registrationDeadline) : null;

  if (event.status === "ONGOING" || (end && start <= now && end >= now)) {
    return { label: "Live Now", color: "var(--color-primary-700)", bg: "var(--color-primary-100)", pulse: true };
  }
  if (event.status === "COMPLETED") {
    return { label: "Completed", color: "#737370", bg: "#F4F4F2", pulse: false };
  }
  if (event.status === "CANCELLED") {
    return { label: "Cancelled", color: "#DC2626", bg: "#FEE2E2", pulse: false };
  }
  if (regDeadline && isPast(regDeadline)) {
    return { label: "Registration Closed", color: "#DC2626", bg: "#FEE2E2", pulse: false };
  }
  if (regDeadline && isWithinInterval(regDeadline, { start: now, end: addDays(now, 3) })) {
    return { label: "Closing Soon", color: "#D97706", bg: "#FEF9C3", pulse: true };
  }
  return { label: "Registration Open", color: "var(--color-primary-600)", bg: "var(--color-primary-50)", pulse: false };
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

// ”€”€”€ Sub-components 
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="mb-5 flex items-center gap-3 text-xl font-bold"
      style={{ color: "var(--color-primary2-900)" }}
    >
      <span
        className="inline-block h-5 w-1 rounded-full"
        style={{ background: "var(--color-primary2-500)" }}
      />
      {children}
    </h2>
  );
}

// ”€”€”€ Main Page 
const EventDetailsPage = () => {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : Array.isArray(params?.slug) ? params.slug[0] : "";

  const { data, isLoading, isError } = useGetEventBySlugQuery(slug, { skip: !slug });
  const event: IEvent | undefined = data?.data;

  const authUser = useAppSelector(selectCurrentUser);
  const isInitialized = useAppSelector(selectIsInitialized);
  const { data: myRegsData } = useGetMyRegistrationsQuery(undefined, {
    skip: !isInitialized || !authUser,
  });
  const alreadyRegistered = myRegsData?.data?.some((r) => {
    const evId = typeof r.eventId === "object" ? String(r.eventId._id) : String(r.eventId);
    return event && evId === String(event._id) && r.status !== "CANCELLED";
  }) ?? false;

  if (isLoading) return <EventDetailsSkeleton />;
  if (isError || !event) return notFound();

  return (
    <div className="three-xl-section-setup space-y-16">
      {/* ”€”€ Hero */}
      <EventDetailsHero event={event} />

      {/* ”€”€ Body */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">

        {/* ”€”€ Left Column ”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€ */}
        <div className="space-y-12">

          {/* Quick Meta Grid */}
          <FadeUpWrapper>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-4">
              <EventDetailsMetaChip
                icon={<RiCalendarEventLine />}
                label="Date"
                value={fmt(event.startDateTime, "d MMM yyyy")}
                accent
              />
              <EventDetailsMetaChip
                icon={<RiTimeLine />}
                label="Time"
                value={`${fmtTime(event.startDateTime)}${event.endDateTime ? ` “ ${fmtTime(event.endDateTime)}` : ""}`}
              />
              <EventDetailsMetaChip
                icon={<HiOutlineLocationMarker />}
                label={event.locationType === "ONLINE" ? "Platform" : "Venue"}
                value={event.venue ?? "TBA"}
              />
              <EventDetailsMetaChip
                icon={<RiGroupLine />}
                label="Capacity"
                value={event.maxAttendees ? `${event.maxAttendees.toLocaleString()} seats` : "Open"}
              />
            </div>
          </FadeUpWrapper>

          {/* About / Description */}
          {event.description && (
            <EventDetailsRegistrationRules description={event.description} />
          )}

          {/* Price Tiers */}
          {!event.isFree && event.priceTiers && event.priceTiers.length > 0 && (
            <EventDetailsPriceTiers
              tiers={event.priceTiers}
              guestFee={event.guestFee}
              allowGuests={event.allowGuests}
            />
          )}

          {/* Free event banner */}
          {event.isFree && (
            <FadeUpWrapper>
              <div
                className="flex items-center gap-4 rounded-2xl p-5"
                style={{ background: "var(--color-primary2-50)", border: "1px solid var(--color-primary2-200)" }}
              >
                <div
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl text-xl"
                  style={{ background: "var(--color-primary2-100)", color: "var(--color-primary2-700)" }}
                >
                  <RiMedalLine />
                </div>
                <div>
                  <p className="font-bold" style={{ color: "var(--color-primary2-900)" }}>Free Entry</p>
                  <p className="text-sm" style={{ color: "var(--color-primary2-600)" }}>
                    This event is open to all at no cost. Registration may still be required.
                  </p>
                </div>
              </div>
            </FadeUpWrapper>
          )}

          {/* Event Flow */}
          {event.eventFlow && event.eventFlow.length > 0 && (
            <EventDetailsEventFlow flow={event.eventFlow} />
          )}

          {/* Registration details grid */}
          <FadeUpWrapper>
            <SectionHeading>Event Details</SectionHeading>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {event.organizer && (
                <EventDetailsMetaChip icon={<RiUserLine />} label="Organizer" value={event.organizer} />
              )}
              {event.registrationDeadline && (
                <EventDetailsMetaChip icon={<RiTicketLine />} label="Registration Deadline" value={fmt(event.registrationDeadline, "d MMM yyyy, h:mm a")} />
              )}
              {event.registrationOpensAt && (
                <EventDetailsMetaChip icon={<RiCalendarEventLine />} label="Registration Opens" value={fmt(event.registrationOpensAt, "d MMM yyyy, h:mm a")} />
              )}
              {event.maxGuestsPerAlumni !== undefined && event.allowGuests && (
                <EventDetailsMetaChip icon={<RiGroupLine />} label="Max Guests / Alumni" value={`${event.maxGuestsPerAlumni} guest${event.maxGuestsPerAlumni !== 1 ? "s" : ""}`} />
              )}
              {event.collectsTShirtSize && (
                <EventDetailsMetaChip icon={<RiShirtLine />} label="T-Shirt" value="Size collected at registration" />
              )}
              {event.locationType && (
                <EventDetailsMetaChip
                  icon={event.locationType === "ONLINE" ? <RiGlobalLine /> : <RiMapPin2Line />}
                  label="Format"
                  value={event.locationType === "PHYSICAL" ? "In-Person" : event.locationType === "ONLINE" ? "Online" : "Hybrid"}
                />
              )}
            </div>
          </FadeUpWrapper>

          {/* Bottom CTA (mobile-visible, hidden on lg) ” only for events that require registration */}
          <FadeUpWrapper className="lg:hidden">
            {event.isRegistrationRequired && (alreadyRegistered ? (
              <div className="flex items-center gap-2 rounded-2xl bg-primary2-50 border border-primary2-200 px-4 py-3.5 text-sm font-semibold text-primary2-700 w-full justify-center">
                <RiCheckboxCircleLine className="text-lg flex-shrink-0" />
                Already Registered
              </div>
            ) : (
              <PrimaryButton
                title="Register Now"
                icon={<RiUserAddLine className="text-base" />}
                icon2={<RiArrowRightLine className="text-base" />}
                href={`/events/${event.slug}/register`}
                isFullWidth className="py-[19px]"
              />
            ))}
          </FadeUpWrapper>
        </div>

        {/* ”€”€ Right Column ” Sticky Sidebar ”€”€”€”€”€”€”€”€”€”€”€”€”€ */}
        <div className="hidden lg:block">
          <EventDetailsRegisterSidebar event={event} alreadyRegistered={alreadyRegistered} />
        </div>
      </div>
    </div>
  );
};
export default EventDetailsPage;