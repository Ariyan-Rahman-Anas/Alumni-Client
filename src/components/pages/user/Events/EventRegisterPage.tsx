"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { isPast } from "date-fns";
import {
    RiArrowLeftLine,
    RiCalendarEventLine,
    RiCheckboxCircleLine,
    RiGroupLine,
    RiInformationLine,
    RiLoader4Line,
    RiMapPin2Line,
    RiShirtLine,
    RiTimeLine,
    RiUserAddLine,
    RiWallet3Line,
} from "react-icons/ri";

import { useGetEventBySlugQuery, useRegisterForEventMutation, useGetMyRegistrationsQuery } from "@/redux/apis/eventApi";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/slice/authSlice";
import type { IEvent, PriceTier, TPaymentMethod, TTshirtSize, RegisterForEventPayload } from "@/types/common/events.types";
import { cn } from "@/lib/utils";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(dateStr: string,
    // pattern = "d MMM yyyy, h:mm a"
) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function resolvePriceTier(priceTiers: PriceTier[], userBatch: number): PriceTier | null {
    return (
        priceTiers.find((tier) => {
            const fromOk = tier.batchFrom == null || userBatch >= tier.batchFrom;
            const toOk = tier.batchTo == null || userBatch <= tier.batchTo;
            return fromOk && toOk;
        }) ?? null
    );
}

// ─── Registration window helper ───────────────────────────────────────────────

function getRegistrationBlocker(event: IEvent): string | null {
    const now = new Date();
    if (event.status === "CANCELLED") return "This event has been cancelled.";
    if (event.status === "COMPLETED") return "This event has already ended.";
    if (!event.isPublished) return "This event is not yet open for registration.";
    if (!event.isRegistrationRequired) return null; // no registration needed — show info instead
    if (event.registrationOpensAt && now < new Date(event.registrationOpensAt))
        return `Registration opens on ${fmt(event.registrationOpensAt)}.`;
    if (event.registrationDeadline && isPast(new Date(event.registrationDeadline)))
        return "Registration deadline has passed.";
    return null;
}

// ─── Payment method labels ─────────────────────────────────────────────────────

const PAYMENT_METHODS: { value: TPaymentMethod; label: string }[] = [
    { value: "BKASH", label: "bKash" },
    { value: "NAGAD", label: "Nagad" },
    { value: "ROCKET", label: "Rocket" },
    { value: "BANK_TRANSFER", label: "Bank Transfer" },
    { value: "CASH", label: "Cash (pay at venue)" },
];

const TSHIRT_SIZES: TTshirtSize[] = ["S", "M", "L", "XL", "XXL"];

// ─── Summary Card ──────────────────────────────────────────────────────────────

function EventSummaryCard({ event, userBatch }: { event: IEvent; userBatch?: number }) {
    const tier = userBatch && !event.isFree ? resolvePriceTier(event.priceTiers, userBatch) : null;

    return (
        <div className="rounded-2xl border border-surface-200 bg-white p-5 space-y-3">
            <h3 className="font-semibold text-primary2-900 text-base">{event.title}</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                    <RiCalendarEventLine className="text-primary2-600 flex-shrink-0" />
                    {fmt(event.startDateTime)}
                </span>
                {event.venue && (
                    <span className="flex items-center gap-2">
                        <RiMapPin2Line className="text-primary2-600 flex-shrink-0" />
                        {event.venue}
                    </span>
                )}
                {event.registrationDeadline && (
                    <span className="flex items-center gap-2">
                        <RiTimeLine className="text-primary2-600 flex-shrink-0" />
                        Deadline: {fmt(event.registrationDeadline)}
                    </span>
                )}
            </div>
            {tier && (
                <div className="pt-2 border-t border-surface-100 text-sm text-primary2-900">
                    <span className="text-muted-foreground">Your tier: </span>
                    <strong>{tier.label}</strong>
                    <span className="ml-2 font-bold text-primary2-700">৳{tier.fee.toLocaleString()}</span>
                </div>
            )}
            {event.isFree && (
                <div className="pt-2 border-t border-surface-100 text-sm font-bold text-emerald-700">
                    Free Entry
                </div>
            )}
        </div>
    );
}

// ─── Fee Preview ───────────────────────────────────────────────────────────────

function FeePreview({
    event,
    userBatch,
    guestCount,
}: {
    event: IEvent;
    userBatch?: number;
    guestCount: number;
}) {
    const tier = userBatch && !event.isFree ? resolvePriceTier(event.priceTiers, userBatch) : null;
    const baseFee = event.isFree ? 0 : (tier?.fee ?? 0);
    const guestFeeTotal = guestCount * (event.guestFee ?? 0);
    const total = baseFee + guestFeeTotal;

    if (event.isFree && guestCount === 0) return null;

    return (
        <div className="rounded-2xl border border-primary2-200 bg-primary2-50 p-4 space-y-2 text-sm">
            <p className="font-semibold text-primary2-900 flex items-center gap-1.5">
                <RiWallet3Line /> Fee Breakdown
            </p>
            {!event.isFree && (
                <div className="flex justify-between text-muted-foreground">
                    <span>Registration fee {tier ? `(${tier.label})` : ""}</span>
                    <span className="font-medium text-neutral-800">৳{baseFee.toLocaleString()}</span>
                </div>
            )}
            {guestCount > 0 && (
                <div className="flex justify-between text-muted-foreground">
                    <span>{guestCount} guest{guestCount > 1 ? "s" : ""} × ৳{(event.guestFee ?? 0).toLocaleString()}</span>
                    <span className="font-medium text-neutral-800">৳{guestFeeTotal.toLocaleString()}</span>
                </div>
            )}
            <div className="flex justify-between border-t border-primary2-200 pt-2 font-bold text-primary2-900">
                <span>Total</span>
                <span>৳{total.toLocaleString()}</span>
            </div>
            {total > 0 && (
                <p className="text-[11px] text-muted-foreground flex items-start gap-1">
                    <RiInformationLine className="mt-0.5 flex-shrink-0" />
                    Payment will be verified by the organizer after registration.
                </p>
            )}
        </div>
    );
}

// ─── Already Registered Banner ────────────────────────────────────────────────

function AlreadyRegisteredBanner({ status }: { status: string }) {
    const isCancelled = status === "CANCELLED";
    return (
        <div className={cn(
            "rounded-2xl border p-5 flex items-start gap-3",
            isCancelled
                ? "bg-red-50 border-red-200"
                : "bg-emerald-50 border-emerald-200"
        )}>
            <RiCheckboxCircleLine className={cn("text-2xl flex-shrink-0 mt-0.5", isCancelled ? "text-red-500" : "text-emerald-600")} />
            <div>
                <p className={cn("font-semibold", isCancelled ? "text-red-700" : "text-emerald-700")}>
                    {isCancelled ? "Registration Cancelled" : "Already Registered"}
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                    {isCancelled
                        ? "Your registration was cancelled. You may register again if the event is still open."
                        : "You have already registered for this event. Check your profile for details."}
                </p>
                {!isCancelled && (
                    <Link href="/profile" className="text-sm text-emerald-700 font-medium hover:underline mt-2 inline-block">
                        View in Profile →
                    </Link>
                )}
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function EventRegisterPage() {
    const params = useParams();
    const router = useRouter();
    const slug = typeof params?.slug === "string" ? params.slug : Array.isArray(params?.slug) ? params.slug[0] : "";

    const authUser = useAppSelector(selectCurrentUser);
    const userBatch = authUser?.batch as number | undefined;

    const { data: eventData, isLoading: eventLoading } = useGetEventBySlugQuery(slug, { skip: !slug });
    const { data: myRegsData } = useGetMyRegistrationsQuery();
    const [registerForEvent, { isLoading: isRegistering }] = useRegisterForEventMutation();

    const event: IEvent | undefined = eventData?.data;

    // Check if user already has a registration for this event
    const existingReg = useMemo(() => {
        if (!event || !myRegsData?.data) return null;
        return myRegsData.data.find((r) => {
            const evId = typeof r.eventId === "object" ? r.eventId._id : r.eventId;
            return evId === event._id;
        }) ?? null;
    }, [event, myRegsData]);

    // Form state
    const [guestCount, setGuestCount] = useState(0);
    const [tshirtSize, setTshirtSize] = useState<TTshirtSize | "">("");
    const [notes, setNotes] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<TPaymentMethod | "">("");
    const [bankName, setBankName] = useState("");
    const [transactionId, setTransactionId] = useState("");

    if (eventLoading) {
        return (
            <div className="three-xl-section-setup py-12 flex items-center justify-center">
                <RiLoader4Line className="animate-spin text-3xl text-primary2-600" />
            </div>
        );
    }

    if (!event) {
        return (
            <div className="three-xl-section-setup py-20 text-center">
                <p className="text-muted-foreground">Event not found.</p>
                <Link href="/events" className="text-primary2-700 hover:underline mt-2 inline-block text-sm">← Back to Events</Link>
            </div>
        );
    }

    const blocker = getRegistrationBlocker(event);
    const tier = userBatch && !event.isFree ? resolvePriceTier(event.priceTiers, userBatch) : null;
    const baseFee = event.isFree ? 0 : (tier?.fee ?? 0);
    const guestFeeTotal = guestCount * (event.guestFee ?? 0);
    const totalAmount = baseFee + guestFeeTotal;
    const needsPayment = totalAmount > 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Client-side validation
        if (event.collectsTShirtSize && !tshirtSize) {
            toast.error("Please select your t-shirt size.");
            return;
        }
        if (!event.isFree && event.priceTiers.length > 0 && !tier) {
            toast.error("No pricing tier found for your batch. Please contact the organizer.");
            return;
        }
        if (needsPayment && !paymentMethod) {
            toast.error("Please select a payment method.");
            return;
        }
        if (paymentMethod === "BANK_TRANSFER" && !bankName) {
            toast.error("Please enter the bank name.");
            return;
        }
        if (paymentMethod && paymentMethod !== "CASH" && !transactionId) {
            toast.error("Please enter your transaction ID.");
            return;
        }

        const body: RegisterForEventPayload = {
            guestCount: guestCount > 0 ? guestCount : undefined,
            tshirtSize: (tshirtSize || undefined) as TTshirtSize | undefined,
            notes: notes.trim() || undefined,
            paymentMethod: (paymentMethod || undefined) as TPaymentMethod | undefined,
            bankName: paymentMethod === "BANK_TRANSFER" ? bankName : undefined,
            transactionId: (paymentMethod && paymentMethod !== "CASH") ? transactionId : undefined,
        };

        try {
            await registerForEvent({ eventId: event._id, body }).unwrap();
            toast.success("Registration successful! The organizer will verify your payment.");
            router.push("/profile");
        } catch (err: unknown) {
            toast.error(
                (err as { data?: { message?: string } })?.data?.message ?? "Registration failed. Please try again."
            );
        }
    };

    return (
        <div className="three-xl-section-setup py-8 sm:py-12">
            {/* Back link */}
            <Link
                href={`/events/${slug}`}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary2-700 transition-colors mb-6"
            >
                <RiArrowLeftLine /> Back to Event
            </Link>

            <h1 className="text-2xl sm:text-3xl font-bold text-primary2-900 mb-8">Register for Event</h1>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
                {/* ── Left: Form ── */}
                <div className="space-y-6">
                    {/* Already registered banner */}
                    {existingReg && existingReg.status !== "CANCELLED" && (
                        <AlreadyRegisteredBanner status={existingReg.status} />
                    )}

                    {/* Registration blocked */}
                    {blocker && (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 flex items-start gap-3">
                            <RiInformationLine className="text-amber-600 text-xl flex-shrink-0 mt-0.5" />
                            <p className="text-amber-800 text-sm">{blocker}</p>
                        </div>
                    )}

                    {/* No registration required */}
                    {!event.isRegistrationRequired && !blocker && (
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 flex items-start gap-3">
                            <RiCheckboxCircleLine className="text-emerald-600 text-xl flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-emerald-800 font-semibold">Open Entry</p>
                                <p className="text-emerald-700 text-sm mt-0.5">
                                    This event does not require registration. Simply show up on the day!
                                </p>
                            </div>
                        </div>
                    )}

                    {/* The form — only show if registration is required and not blocked and not already registered */}
                    {event.isRegistrationRequired && !blocker && (!existingReg || existingReg.status === "CANCELLED") && (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Tier info */}
                            {!event.isFree && (
                                <div className="rounded-2xl border border-surface-200 bg-surface-50 p-4 text-sm">
                                    {tier ? (
                                        <p className="text-neutral-700">
                                            Your batch (<strong>Batch {userBatch}</strong>) falls under the{" "}
                                            <strong className="text-primary2-700">{tier.label}</strong> tier at{" "}
                                            <strong className="text-primary2-700">৳{tier.fee.toLocaleString()}</strong>.
                                        </p>
                                    ) : (
                                        <p className="text-red-700 flex items-start gap-1.5">
                                            <RiInformationLine className="mt-0.5 flex-shrink-0" />
                                            No pricing tier found for your batch ({userBatch}). Please contact the organizer.
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Guest count */}
                            {event.allowGuests && (
                                <div>
                                    <label className="block text-sm font-semibold text-primary2-900 mb-1.5">
                                        <RiGroupLine className="inline mr-1" />
                                        Number of Guests
                                        <span className="font-normal text-muted-foreground ml-1">
                                            (max {event.maxGuestsPerAlumni})
                                        </span>
                                    </label>
                                    <select
                                        value={guestCount}
                                        onChange={(e) => setGuestCount(Number(e.target.value))}
                                        className="w-full rounded-xl border border-surface-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary2-300"
                                    >
                                        {Array.from({ length: event.maxGuestsPerAlumni + 1 }, (_, i) => (
                                            <option key={i} value={i}>
                                                {i === 0 ? "No guests" : `${i} guest${i > 1 ? "s" : ""}${event.guestFee ? ` (৳${(i * event.guestFee).toLocaleString()})` : ""}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* T-shirt size */}
                            {event.collectsTShirtSize && (
                                <div>
                                    <label className="block text-sm font-semibold text-primary2-900 mb-1.5">
                                        <RiShirtLine className="inline mr-1" />
                                        T-Shirt Size <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {TSHIRT_SIZES.map((size) => (
                                            <button
                                                key={size}
                                                type="button"
                                                onClick={() => setTshirtSize(size)}
                                                className={cn(
                                                    "px-4 py-2 rounded-xl border text-sm font-medium transition-colors",
                                                    tshirtSize === size
                                                        ? "bg-primary2-600 text-white border-primary2-600"
                                                        : "bg-white text-neutral-700 border-surface-200 hover:border-primary2-300"
                                                )}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Payment method (only if fee > 0) */}
                            {needsPayment && (
                                <>
                                    <div>
                                        <label className="block text-sm font-semibold text-primary2-900 mb-1.5">
                                            <RiWallet3Line className="inline mr-1" />
                                            Payment Method <span className="text-red-500">*</span>
                                        </label>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                            {PAYMENT_METHODS.map((pm) => (
                                                <button
                                                    key={pm.value}
                                                    type="button"
                                                    onClick={() => setPaymentMethod(pm.value)}
                                                    className={cn(
                                                        "px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors text-left",
                                                        paymentMethod === pm.value
                                                            ? "bg-primary2-600 text-white border-primary2-600"
                                                            : "bg-white text-neutral-700 border-surface-200 hover:border-primary2-300"
                                                    )}
                                                >
                                                    {pm.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Bank name (bank transfer only) */}
                                    {paymentMethod === "BANK_TRANSFER" && (
                                        <div>
                                            <label className="block text-sm font-semibold text-primary2-900 mb-1.5">
                                                Bank Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={bankName}
                                                onChange={(e) => setBankName(e.target.value)}
                                                placeholder="e.g. Dutch Bangla Bank"
                                                className="w-full rounded-xl border border-surface-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary2-300"
                                            />
                                        </div>
                                    )}

                                    {/* Transaction ID (non-cash) */}
                                    {paymentMethod && paymentMethod !== "CASH" && (
                                        <div>
                                            <label className="block text-sm font-semibold text-primary2-900 mb-1.5">
                                                Transaction ID / Reference <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={transactionId}
                                                onChange={(e) => setTransactionId(e.target.value)}
                                                placeholder="Enter transaction number"
                                                className="w-full rounded-xl border border-surface-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary2-300"
                                            />
                                            <p className="text-[11px] text-muted-foreground mt-1">
                                                Send ৳{totalAmount.toLocaleString()} to our number, then enter the transaction ID here.
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-semibold text-primary2-900 mb-1.5">
                                    Additional Notes <span className="text-muted-foreground font-normal">(optional)</span>
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={3}
                                    maxLength={500}
                                    placeholder="Any dietary requirements, accessibility needs, or messages for the organizer..."
                                    className="w-full rounded-xl border border-surface-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary2-300 resize-none"
                                />
                                <p className="text-[11px] text-muted-foreground text-right mt-0.5">{notes.length}/500</p>
                            </div>

                            {/* Fee preview */}
                            <FeePreview event={event} userBatch={userBatch} guestCount={guestCount} />

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isRegistering}
                                className="w-full flex items-center justify-center gap-2 bg-primary2-700 hover:bg-primary2-800 disabled:opacity-60 text-white font-semibold py-3 rounded-2xl transition-colors text-sm"
                            >
                                {isRegistering ? (
                                    <><RiLoader4Line className="animate-spin" /> Registering…</>
                                ) : (
                                    <><RiUserAddLine /> Confirm Registration</>
                                )}
                            </button>

                            <p className="text-[11px] text-muted-foreground text-center">
                                By registering you agree to the event terms. Refunds are at the organizer&apos;s discretion.
                            </p>
                        </form>
                    )}
                </div>

                {/* ── Right: Summary ── */}
                <div className="space-y-4 lg:sticky lg:top-24">
                    <EventSummaryCard event={event} userBatch={userBatch} />

                    {event.contactInfo && (
                        <div className="rounded-2xl border border-surface-200 bg-white p-4 text-sm">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Contact Organizer</p>
                            <a href={`tel:${event.contactInfo}`} className="text-primary2-700 font-medium hover:underline">
                                {event.contactInfo}
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
