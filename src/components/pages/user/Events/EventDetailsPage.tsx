"use client";

import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  RiCalendarEventLine,
  RiMapPin2Line,
  RiTimeLine,
  RiGroupLine,
  RiUserLine,
  RiPhoneLine,
  RiArrowLeftLine,
  RiArrowRightLine,
  RiShareLine,
  RiCalendarCheckLine,
  RiFireLine,
  RiTicketLine,
  RiCheckboxCircleLine,
  RiInformationLine,
  RiMedalLine,
  RiShirtLine,
  RiUserAddLine,
  RiGlobalLine,
} from "react-icons/ri";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { Badge } from "@/components/ui/badge";
import { IEvent, PriceTier } from "@/types/common/events.types";
import { format, formatDistanceToNow, isPast, isWithinInterval, addDays } from "date-fns";
import { useGetEventBySlugQuery, useGetMyRegistrationsQuery } from "@/redux/apis/eventApi";
import PrimaryButton from "@/components/shared/PrimaryButton";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser, selectIsInitialized } from "@/redux/slice/authSlice";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(dateStr: string, pattern = "d MMM yyyy") {
  return format(new Date(dateStr), pattern);
}
function fmtTime(dateStr: string) {
  return format(new Date(dateStr), "h:mm a");
}
function getCountdown(dateStr: string) {
  const d = new Date(dateStr);
  if (isPast(d)) return null;
  return formatDistanceToNow(d, { addSuffix: true });
}

function getStatusConfig(event: IEvent) {
  const now = new Date();
  const start = new Date(event.startDateTime);
  const end = event.endDateTime ? new Date(event.endDateTime) : null;
  const regDeadline = event.registrationDeadline ? new Date(event.registrationDeadline) : null;

  if (event.status === "ONGOING" || (end && start <= now && end >= now)) {
    return { label: "Live Now", color: "#059669", bg: "#D1FAE5", pulse: true };
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
  // return { label: "Registration Open", color: "#2E8B57", bg: "#E8F5ED", pulse: false };
  return { label: "Registration Open", color: "#2E8B57", bg: "#038f39", pulse: false };
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

const TIER_GRADIENTS = [
  "from-emerald-400 to-emerald-600",
  "from-amber-400 to-amber-600",
  "from-violet-400 to-violet-600",
  "from-pink-400 to-pink-600",
  "from-sky-400 to-sky-600",
];

// ─── Add-to-Calendar helper ───────────────────────────────────────────────────

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

async function handleShare(event: IEvent) {
  const url = window.location.href;
  if (navigator.share) {
    await navigator.share({ title: event.title, text: event.description ?? "", url });
  } else {
    await navigator.clipboard.writeText(url);
  }
}

// ─── Animation helpers ────────────────────────────────────────────────────────

const FadeUp = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.19, 1, 0.22, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function MetaChip({
  icon,
  label,
  value,
  accent = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className="flex items-start gap-3 rounded-2xl p-4"
      style={{
        background: accent ? "var(--color-primary2-50)" : "var(--color-surface-100)",
        border: `1px solid ${accent ? "var(--color-primary2-200)" : "var(--color-border)"}`,
      }}
    >
      <div
        className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-base"
        style={{
          background: accent ? "var(--color-primary2-100)" : "var(--color-surface-200)",
          color: accent ? "var(--color-primary2-700)" : "var(--color-text-secondary)",
        }}
      >
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
          {label}
        </p>
        <p className="mt-0.5 text-sm font-semibold leading-snug" style={{ color: "var(--color-primary2-900)" }}>
          {value}
        </p>
      </div>
    </div>
  );
}

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

// ─── Sticky Registration Sidebar ─────────────────────────────────────────────

function RegisterSidebar({ event, alreadyRegistered }: { event: IEvent; alreadyRegistered: boolean }) {
  const status = getStatusConfig(event);
  const countdown = getCountdown(event.startDateTime);
  const regCountdown = event.registrationDeadline ? getCountdown(event.registrationDeadline) : null;
  const isDisabled = event.status === "CANCELLED" || event.status === "COMPLETED";
  const lowestFee = event.priceTiers?.length
    ? Math.min(...event.priceTiers.map((t) => t.fee))
    : null;

  return (
    <div className="sticky top-24 space-y-4">
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
                  ৳{lowestFee.toLocaleString()}
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

          {/* Register CTA — only for events that require registration */}
          {event.isRegistrationRequired && (alreadyRegistered ? (
            <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3.5 text-sm font-semibold text-emerald-700">
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
              {event.guestFee ? ` · ৳${event.guestFee} each` : ""}
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
    </div>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

function EventHero({ event }: { event: IEvent }) {
  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 600], [0, 120]);
  const status = getStatusConfig(event);
  const catColor = getCategoryColor(event.category);

  return (
    <div ref={heroRef} className="relative h-[55vh] min-h-[400px] max-h-[620px] overflow-hidden rounded-2xl">
      {/* Parallax image */}
      <motion.div className="absolute inset-0 scale-110" style={{ y: imageY }}>
        <Image
          src={event.coverImage ?? "/event-placeholder.jpg"}
          alt={event.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </motion.div>

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
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
        >
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
        </motion.div>
      </div>
    </div>
  );
}

// ─── Price Tiers ──────────────────────────────────────────────────────────────

function PriceTiersSection({ tiers, guestFee, allowGuests }: { tiers: PriceTier[]; guestFee?: number; allowGuests?: boolean }) {
  return (
    <FadeUp>
      <SectionHeading>Registration Fees</SectionHeading>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {tiers.map((tier, i) => (
          <div
            key={tier.label}
            className="relative overflow-hidden rounded-2xl p-5"
            style={{ background: "var(--color-surface-100)", border: "1px solid var(--color-border)" }}
          >
            {/* colour bar */}
            <div className={`absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-gradient-to-b ${TIER_GRADIENTS[i % TIER_GRADIENTS.length]}`} />
            <div className="pl-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-bold" style={{ color: "var(--color-primary2-900)" }}>
                    {tier.label}
                  </p>
                  {tier.batchFrom && tier.batchTo && (
                    <p className="mt-0.5 text-[11px]" style={{ color: "var(--color-text-muted)" }}>
                      Batch {tier.batchFrom}–{tier.batchTo}
                    </p>
                  )}
                </div>
                <p
                  className="text-xl font-extrabold tabular-nums"
                  style={{ color: "var(--color-primary2-800)" }}
                >
                  ৳{tier.fee.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Guest tier */}
        {allowGuests && guestFee !== undefined && (
          <div
            className="relative overflow-hidden rounded-2xl p-5"
            style={{ background: "var(--color-gold-50)", border: "1px solid var(--color-gold-200)" }}
          >
            <div className="absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-gradient-to-b from-amber-400 to-amber-600" />
            <div className="pl-3 flex items-start justify-between">
              <div>
                <p className="text-sm font-bold" style={{ color: "#78350F" }}>Guest</p>
                <p className="mt-0.5 text-[11px]" style={{ color: "#92400E" }}>Per accompanying guest</p>
              </div>
              <p className="text-xl font-extrabold tabular-nums" style={{ color: "#78350F" }}>
                ৳{guestFee.toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bkash fee note */}
      <p
        className="mt-3 flex items-start gap-1.5 text-xs leading-snug"
        style={{ color: "var(--color-text-muted)" }}
      >
        <RiInformationLine className="mt-0.5 flex-shrink-0" />
        Bkash payments incur an additional ৳15 charge per ৳1,000. Bank transfer: deposit first, then register with the slip.
      </p>
    </FadeUp>
  );
}

// ─── Event Flow ───────────────────────────────────────────────────────────────

function EventFlowSection({ flow }: { flow: string[] }) {
  return (
    <FadeUp>
      <SectionHeading>Program Schedule</SectionHeading>
      <div className="relative space-y-0">
        {/* vertical line */}
        <div
          className="absolute left-[17px] top-4 h-[calc(100%-2rem)] w-px"
          style={{ background: "linear-gradient(to bottom, var(--color-primary2-300), transparent)" }}
        />
        {flow.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: i * 0.07, ease: "easeOut" }}
            className="relative flex items-start gap-4 pb-5"
          >
            {/* dot */}
            <div
              className="relative z-10 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 text-sm font-extrabold"
              style={{
                background: "var(--color-surface)",
                borderColor: "var(--color-primary2-300)",
                color: "var(--color-primary2-700)",
              }}
            >
              {i + 1}
            </div>
            <div
              className="flex-1 rounded-2xl p-4"
              style={{
                background: "var(--color-surface-100)",
                border: "1px solid var(--color-border)",
              }}
            >
              <p className="text-sm font-medium leading-snug" style={{ color: "var(--color-primary2-900)" }}>
                {item}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </FadeUp>
  );
}

// ─── Registration Rules ───────────────────────────────────────────────────────

function RegistrationRulesSection({ description }: { description: string }) {
  // Extract bullet-like rules from Bengali description
  const lines = description
    .split(/[*\n]/)
    .map((l) => l.trim())
    .filter((l) => l.length > 10);

  if (lines.length <= 1) {
    return (
      <FadeUp>
        <SectionHeading>About This Event</SectionHeading>
        <div
          className="rounded-2xl p-6 text-sm leading-relaxed"
          style={{
            background: "var(--color-surface-100)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text-secondary)",
          }}
        >
          {description}
        </div>
      </FadeUp>
    );
  }

  return (
    <FadeUp>
      <SectionHeading>Registration Rules</SectionHeading>
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid var(--color-border)" }}
      >
        {lines.map((rule, i) => (
          <div
            key={i}
            className="flex items-start gap-3 px-5 py-4 text-sm leading-relaxed transition-colors"
            style={{
              background: i % 2 === 0 ? "var(--color-surface)" : "var(--color-surface-100)",
              borderBottom: i < lines.length - 1 ? "1px solid var(--color-border)" : "none",
              color: "var(--color-text-secondary)",
            }}
          >
            <RiCheckboxCircleLine
              className="mt-0.5 flex-shrink-0 text-base"
              style={{ color: "var(--color-primary2-500)" }}
            />
            {rule}
          </div>
        ))}
      </div>
    </FadeUp>
  );
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

function EventDetailsSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="skeleton h-[55vh] min-h-[400px] rounded-[2.5rem]" />
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            <div className="skeleton h-6 w-3/4 rounded" />
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-2/3 rounded" />
          </div>
          <div className="skeleton h-80 rounded-3xl" />
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
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
      {/* ── Hero */}
      <EventHero event={event} />

      {/* ── Body */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">

        {/* ── Left Column ──────────────────────────────── */}
        <div className="space-y-12">

          {/* Quick Meta Grid */}
          <FadeUp>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-4">
              <MetaChip
                icon={<RiCalendarEventLine />}
                label="Date"
                value={fmt(event.startDateTime, "d MMM yyyy")}
                accent
              />
              <MetaChip
                icon={<RiTimeLine />}
                label="Time"
                value={`${fmtTime(event.startDateTime)}${event.endDateTime ? ` – ${fmtTime(event.endDateTime)}` : ""}`}
              />
              <MetaChip
                icon={<HiOutlineLocationMarker />}
                label={event.locationType === "ONLINE" ? "Platform" : "Venue"}
                value={event.venue ?? "TBA"}
              />
              <MetaChip
                icon={<RiGroupLine />}
                label="Capacity"
                value={event.maxAttendees ? `${event.maxAttendees.toLocaleString()} seats` : "Open"}
              />
            </div>
          </FadeUp>

          {/* About / Description */}
          {event.description && (
            <RegistrationRulesSection description={event.description} />
          )}

          {/* Price Tiers */}
          {!event.isFree && event.priceTiers && event.priceTiers.length > 0 && (
            <PriceTiersSection
              tiers={event.priceTiers}
              guestFee={event.guestFee}
              allowGuests={event.allowGuests}
            />
          )}

          {/* Free event banner */}
          {event.isFree && (
            <FadeUp>
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
            </FadeUp>
          )}

          {/* Event Flow */}
          {event.eventFlow && event.eventFlow.length > 0 && (
            <EventFlowSection flow={event.eventFlow} />
          )}

          {/* Registration details grid */}
          <FadeUp>
            <SectionHeading>Event Details</SectionHeading>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {event.organizer && (
                <MetaChip icon={<RiUserLine />} label="Organizer" value={event.organizer} />
              )}
              {event.registrationDeadline && (
                <MetaChip icon={<RiTicketLine />} label="Registration Deadline" value={fmt(event.registrationDeadline, "d MMM yyyy, h:mm a")} />
              )}
              {event.registrationOpensAt && (
                <MetaChip icon={<RiCalendarEventLine />} label="Registration Opens" value={fmt(event.registrationOpensAt, "d MMM yyyy, h:mm a")} />
              )}
              {event.maxGuestsPerAlumni !== undefined && event.allowGuests && (
                <MetaChip icon={<RiGroupLine />} label="Max Guests / Alumni" value={`${event.maxGuestsPerAlumni} guest${event.maxGuestsPerAlumni !== 1 ? "s" : ""}`} />
              )}
              {event.collectsTShirtSize && (
                <MetaChip icon={<RiShirtLine />} label="T-Shirt" value="Size collected at registration" />
              )}
              {event.locationType && (
                <MetaChip
                  icon={event.locationType === "ONLINE" ? <RiGlobalLine /> : <RiMapPin2Line />}
                  label="Format"
                  value={event.locationType === "PHYSICAL" ? "In-Person" : event.locationType === "ONLINE" ? "Online" : "Hybrid"}
                />
              )}
            </div>
          </FadeUp>

          {/* Bottom CTA (mobile-visible, hidden on lg) — only for events that require registration */}
          <FadeUp className="lg:hidden">
            {event.isRegistrationRequired && (alreadyRegistered ? (
              <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3.5 text-sm font-semibold text-emerald-700 w-full justify-center">
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
          </FadeUp>
        </div>

        {/* ── Right Column — Sticky Sidebar ───────────── */}
        <div className="hidden lg:block">
          <RegisterSidebar event={event} alreadyRegistered={alreadyRegistered} />
        </div>
      </div>
    </div>
  );
};
export default EventDetailsPage;