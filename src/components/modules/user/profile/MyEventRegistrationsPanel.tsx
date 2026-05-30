"use client";

import { useState } from "react";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import {
    RiCalendarEventLine,
    RiCheckboxCircleLine,
    RiCloseCircleLine,
    RiExternalLinkLine,
    RiLoader4Line,
    RiMapPin2Line,
    RiTimeLine,
    RiTicketLine,
    RiWallet3Line,
    RiInformationLine,
    RiSendPlaneLine,
} from "react-icons/ri";
import { cn } from "@/lib/utils";
import { useGetMyRegistrationsQuery, useSubmitCancelRequestMutation, useGetMyCancelRequestQuery } from "@/redux/apis/eventApi";
import type {
    IEventRegistration,
    IEventRegistrationEvent,
    IEventCancelRequest,
    TPaymentStatus,
    TRegistrationStatus,
    TCancelRequestStatus,
} from "@/types/common/events.types";

const PAYMENT_STATUS: Record<TPaymentStatus, { label: string; className: string }> = {
    PENDING: { label: "Payment Pending", className: "bg-amber-50 text-amber-700 border border-amber-200" },
    PAID: { label: "Paid", className: "bg-primary2-50 text-primary2-700 border border-primary2-200" },
    WAIVED: { label: "Waived", className: "bg-sky-50 text-sky-700 border border-sky-200" },
};

const REG_STATUS: Record<TRegistrationStatus, { label: string; icon: React.ReactNode; className: string }> = {
    CONFIRMED: { label: "Confirmed", icon: <RiCheckboxCircleLine />, className: "bg-primary2-50 text-primary2-700 border border-primary2-200" },
    CANCELLED: { label: "Cancelled", icon: <RiCloseCircleLine />, className: "bg-red-50 text-red-700 border border-red-200" },
    WAITLISTED: { label: "Waitlisted", icon: <RiTimeLine />, className: "bg-amber-50 text-amber-700 border border-amber-200" },
};

const CANCEL_REQUEST_STATUS: Record<TCancelRequestStatus, { label: string; className: string }> = {
    PENDING: { label: "Cancellation Requested", className: "bg-amber-50 text-amber-700 border border-amber-200" },
    APPROVED: { label: "Cancellation Approved", className: "bg-red-50 text-red-700 border border-red-200" },
    REJECTED: { label: "Cancellation Rejected", className: "bg-surface-100 text-neutral-600 border border-surface-200" },
};

/* â”€â”€ Cancel Request Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

function CancelRequestModal({
    registrationId,
    eventTitle,
    onClose,
}: {
    registrationId: string;
    eventTitle: string;
    onClose: () => void;
}) {
    const [reason, setReason] = useState("");
    const [submitRequest, { isLoading }] = useSubmitCancelRequestMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reason.trim()) { toast.error("Please provide a reason."); return; }
        try {
            await submitRequest({ registrationId, body: { reason: reason.trim() } }).unwrap();
            toast.success("Cancellation request submitted. An admin will review it shortly.");
            onClose();
        } catch (err: unknown) {
            toast.error((err as { data?: { message?: string } })?.data?.message ?? "Failed to submit request.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h3 className="font-bold text-primary2-900">Request Cancellation</h3>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{eventTitle}</p>
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-neutral-700">
                        <RiCloseCircleLine className="text-xl" />
                    </button>
                </div>

                <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 flex items-start gap-2 text-xs text-amber-800">
                    <RiInformationLine className="flex-shrink-0 mt-0.5" />
                    Your registration will remain active until an admin approves this request. Refunds are at the organizer&apos;s discretion.
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="block text-sm font-semibold text-primary2-900 mb-1.5">
                            Reason for cancellation <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={4}
                            maxLength={1000}
                            placeholder="Please explain why you need to cancel this registration..."
                            className="w-full rounded-xl border border-surface-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary2-300 resize-none"
                        />
                        <p className="text-[11px] text-muted-foreground text-right mt-0.5">{reason.length}/1000</p>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading || !reason.trim()}
                        className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
                    >
                        {isLoading ? <RiLoader4Line className="animate-spin" /> : <RiSendPlaneLine />}
                        Submit Request
                    </button>
                </form>
            </div>
        </div>
    );
}

/* â”€â”€ Cancel Request Status Badge â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

function CancelRequestStatusBadge({ req }: { req: IEventCancelRequest | undefined }) {
    if (!req) return null;
    const cfg = CANCEL_REQUEST_STATUS[req.status];
    return (
        <div className="mt-3 space-y-2">
            <span className={cn("inline-flex text-xs font-semibold px-2.5 py-1 rounded-full border", cfg.className)}>
                {cfg.label}
            </span>
            {req.adminNote && (
                <div className="rounded-xl bg-surface-50 border border-surface-200 p-3 text-xs">
                    <p className="font-semibold text-neutral-700 mb-0.5">Admin note:</p>
                    <p className="text-muted-foreground">{req.adminNote}</p>
                    {req.actionBy && (
                        <p className="text-[11px] text-muted-foreground mt-1">
                            â€” {req.actionBy.name}
                            {req.actionAt ? `, ${format(new Date(req.actionAt), "d MMM yyyy")}` : ""}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

function RegistrationCard({ reg }: { reg: IEventRegistration }) {
    const [showCancelModal, setShowCancelModal] = useState(false);
    const { data: cancelReqData } = useGetMyCancelRequestQuery(reg._id);
    const cancelReq = cancelReqData?.data;

    const event = typeof reg.eventId === "object" ? (reg.eventId as IEventRegistrationEvent) : null;
    const regStatus = REG_STATUS[reg.status] ?? REG_STATUS.CONFIRMED;
    const payStatus = PAYMENT_STATUS[reg.paymentStatus] ?? PAYMENT_STATUS.PENDING;
    const isCancelled = reg.status === "CANCELLED";

    return (
        <div className={cn(
            "rounded-2xl border bg-white p-5 transition-colors",
            isCancelled ? "border-surface-200 opacity-70" : "border-surface-200 hover:border-primary2-200"
        )}>
            <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                    <h3 className="font-semibold text-primary2-900 text-sm leading-snug">
                        {event?.title ?? "Event"}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                        {event?.startDateTime && (
                            <span className="flex items-center gap-1">
                                <RiCalendarEventLine />
                                {format(new Date(event.startDateTime), "d MMM yyyy")}
                            </span>
                        )}
                        {event?.venue && (
                            <span className="flex items-center gap-1">
                                <RiMapPin2Line />
                                {event.venue}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={cn("inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full", regStatus.className)}>
                        {regStatus.icon} {regStatus.label}
                    </span>
                </div>
            </div>

            {/* Details */}
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {reg.priceTierLabel && (
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                        <RiTicketLine className="text-primary2-500" />
                        Tier: <strong className="text-neutral-700">{reg.priceTierLabel}</strong>
                    </div>
                )}
                <div className="flex items-center gap-1.5 text-muted-foreground">
                    <RiWallet3Line className="text-primary2-500" />
                    Total: <strong className="text-neutral-700">à§³{reg.totalAmount.toLocaleString()}</strong>
                </div>
                {reg.guestCount > 0 && (
                    <div className="text-muted-foreground">
                        Guests: <strong className="text-neutral-700">{reg.guestCount}</strong>
                    </div>
                )}
                {reg.tshirtSize && (
                    <div className="text-muted-foreground">
                        T-Shirt: <strong className="text-neutral-700">{reg.tshirtSize}</strong>
                    </div>
                )}
                {reg.transactionId && (
                    <div className="text-muted-foreground col-span-full">
                        TxnID: <strong className="text-neutral-700 font-mono">{reg.transactionId}</strong>
                    </div>
                )}
            </div>

            {/* Payment badge + registered time */}
            <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                    <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", payStatus.className)}>
                        {payStatus.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        Registered {formatDistanceToNow(new Date(reg.createdAt), { addSuffix: true })}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    {typeof reg.eventId === "object" && (
                        <Link
                            href={`/events`}
                            className="text-xs text-primary2-700 font-medium hover:underline flex items-center gap-1"
                        >
                            View Event <RiExternalLinkLine />
                        </Link>
                    )}
                    {!isCancelled && !cancelReq && (
                        <button
                            onClick={() => setShowCancelModal(true)}
                            className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                        >
                            <RiCloseCircleLine />
                            Request Cancellation
                        </button>
                    )}
                </div>
            </div>

            {/* Show cancel request status / admin note */}
            <CancelRequestStatusBadge req={cancelReq} />

            {/* Cancel request modal */}
            {showCancelModal && (
                <CancelRequestModal
                    registrationId={reg._id}
                    eventTitle={event?.title ?? "this event"}
                    onClose={() => setShowCancelModal(false)}
                />
            )}
        </div>
    );
}

export default function MyEventRegistrationsPanel() {
    const { data, isLoading } = useGetMyRegistrationsQuery();
    const registrations = data?.data ?? [];

    if (isLoading) {
        return (
            <div className="space-y-4 animate-pulse">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="rounded-2xl border border-surface-200 bg-white p-5 h-28" />
                ))}
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center gap-2 mb-5">
                <RiTicketLine className="text-xl text-primary2-700" />
                <h2 className="text-lg font-bold text-primary2-900">My Event Registrations</h2>
                <span className="ml-auto text-xs text-muted-foreground">{registrations.length} total</span>
            </div>

            {registrations.length === 0 ? (
                <div className="bg-white rounded-2xl border border-surface-200 p-12 text-center">
                    <RiTicketLine className="text-4xl text-muted-foreground mx-auto mb-3" />
                    <p className="font-medium text-primary2-900">No registrations yet</p>
                    <p className="text-sm text-muted-foreground mt-1">Browse upcoming events and register to join.</p>
                    <Link href="/events" className="mt-4 inline-flex items-center gap-1 text-sm text-primary2-700 font-medium hover:underline">
                        Browse Events <RiExternalLinkLine />
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {registrations.map((reg) => (
                        <RegistrationCard key={reg._id} reg={reg} />
                    ))}
                </div>
            )}
        </div>
    );
}
