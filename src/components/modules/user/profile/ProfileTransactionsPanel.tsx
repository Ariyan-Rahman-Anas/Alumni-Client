"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import {
    RiWallet3Line,
    RiCalendarEventLine,
    RiLoader4Line,
    RiFolderInfoLine,
    RiCheckboxCircleLine,
    RiTimeLine,
    RiMapPin2Line,
    RiTicketLine,
} from "react-icons/ri";
import { cn } from "@/lib/utils";
import { useGetMyRegistrationsQuery } from "@/redux/apis/eventApi";
import type {
    IEventRegistration,
    IEventRegistrationEvent,
    TPaymentStatus,
} from "@/types/common/events.types";

const PAYMENT_STATUS_CFG: Record<TPaymentStatus, { label: string; className: string; icon: React.ReactNode }> = {
    PENDING: { label: "Pending", className: "bg-amber-50 text-amber-700 border border-amber-200", icon: <RiTimeLine /> },
    PAID: { label: "Paid", className: "bg-primary2-50 text-primary2-700 border border-primary2-200", icon: <RiCheckboxCircleLine /> },
    WAIVED: { label: "Waived", className: "bg-sky-50 text-sky-700 border border-sky-200", icon: <RiCheckboxCircleLine /> },
};

const ProfileTransactionsPanel = () => {
    const { data, isLoading } = useGetMyRegistrationsQuery();

    const registrations: IEventRegistration[] = (data?.data ?? []).filter(
        (r) => r.status !== "CANCELLED" && r.totalAmount > 0
    );

    const totalPaid = registrations
        .filter((r) => r.paymentStatus === "PAID" || r.paymentStatus === "WAIVED")
        .reduce((sum, r) => sum + r.totalAmount, 0);

    const totalPending = registrations
        .filter((r) => r.paymentStatus === "PENDING")
        .reduce((sum, r) => sum + r.totalAmount, 0);

    const stats = [
        { label: "Total Transactions", value: registrations.length.toString() },
        { label: "Amount Paid", value: `${totalPaid.toLocaleString()}` },
        { label: "Amount Pending", value: `${totalPending.toLocaleString()}` },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="rounded-3xl border border-surface-300/50 bg-surface p-6 sm:p-8"
        >
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-primary2-600">Transactions</p>
                    <h2 className="mt-1 text-xl font-semibold text-primary2-900">Payment Overview</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Event registration payments associated with your account.
                    </p>
                </div>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary2-100 text-primary2-700 text-xl">
                    <RiWallet3Line />
                </span>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {stats.map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-surface-300/50 bg-primary2-50/40 px-4 py-4">
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                        <p className="mt-1 text-2xl font-bold text-primary2-900">{isLoading ? "”" : stat.value}</p>
                    </div>
                ))}
            </div>

            {/* List */}
            <div className="mt-6">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <RiLoader4Line className="animate-spin text-3xl text-primary2-600" />
                    </div>
                ) : registrations.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-surface-400/70 bg-white/30 p-6 text-center">
                        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary2-100 text-primary2-700 text-2xl">
                            <RiFolderInfoLine />
                        </span>
                        <h3 className="mt-3 text-base font-semibold text-primary2-900">No transactions yet</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Paid event registrations will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {registrations.map((reg) => {
                            const event = typeof reg.eventId === "object"
                                ? (reg.eventId as IEventRegistrationEvent)
                                : null;
                            const payCfg = PAYMENT_STATUS_CFG[reg.paymentStatus] ?? PAYMENT_STATUS_CFG.PENDING;

                            return (
                                <div
                                    key={reg._id}
                                    className="rounded-2xl border border-surface-200 bg-white p-4 flex flex-col sm:flex-row sm:items-center gap-3"
                                >
                                    {/* Event icon */}
                                    <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-primary2-100 flex items-center justify-center text-primary2-700 text-xl">
                                        <RiCalendarEventLine />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm text-primary2-900 truncate">
                                            {event?.title ?? "Event"}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground">
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
                                            {reg.priceTierLabel && (
                                                <span className="flex items-center gap-1">
                                                    <RiTicketLine />
                                                    {reg.priceTierLabel}
                                                </span>
                                            )}
                                            {reg.transactionId && (
                                                <span className="font-mono">TxnID: {reg.transactionId}</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Amount + badge */}
                                    <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1.5 flex-shrink-0">
                                        <p className="text-lg font-bold text-primary2-900">
                                            {reg.totalAmount.toLocaleString()}
                                        </p>
                                        <span className={cn(
                                            "inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border",
                                            payCfg.className
                                        )}>
                                            {payCfg.icon} {payCfg.label}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ProfileTransactionsPanel;

