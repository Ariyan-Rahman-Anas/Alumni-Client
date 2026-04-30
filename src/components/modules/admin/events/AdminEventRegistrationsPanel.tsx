"use client";

import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
    RiCheckboxCircleLine,
    RiCloseCircleLine,
    RiLoader4Line,
    RiTimeLine,
    RiGroupLine,
    RiDownloadLine,
    RiQuestionAnswerLine,
} from "react-icons/ri";
import { cn } from "@/lib/utils";
import {
    useGetRegistrationsByEventQuery,
    useVerifyPaymentMutation,
    useGetAllCancelRequestsQuery,
    useProcessCancelRequestMutation,
} from "@/redux/apis/eventApi";
import type {
    IEventRegistration,
    IEventRegistrationUser,
    TPaymentStatus,
    TRegistrationStatus,
    IEventCancelRequest,
    TCancelRequestStatus,
} from "@/types/common/events.types";

/* -- Badge config ---------------------------------------- */

const PAYMENT_STATUS: Record<TPaymentStatus, { label: string; className: string }> = {
    PENDING: { label: "Pending", className: "bg-amber-50 text-amber-700 border border-amber-200" },
    PAID: { label: "Paid", className: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
    WAIVED: { label: "Waived", className: "bg-sky-50 text-sky-700 border border-sky-200" },
};

const REG_STATUS: Record<TRegistrationStatus, { label: string; className: string }> = {
    CONFIRMED: { label: "Confirmed", className: "badge-success" },
    CANCELLED: { label: "Cancelled", className: "badge-danger" },
    WAITLISTED: { label: "Waitlisted", className: "badge-parent" },
};

const CANCEL_STATUS: Record<TCancelRequestStatus, { label: string; className: string }> = {
    PENDING: { label: "Pending", className: "bg-amber-50 text-amber-700 border border-amber-200" },
    APPROVED: { label: "Approved", className: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
    REJECTED: { label: "Rejected", className: "bg-red-50 text-red-700 border border-red-200" },
};

/* -- Registrations Tab ------------------------------------ */

function RegistrationsTab({ eventId, eventTitle }: { eventId: string; eventTitle: string }) {
    const { data, isLoading, isError } = useGetRegistrationsByEventQuery(eventId);
    const [verifyPayment, { isLoading: isVerifying }] = useVerifyPaymentMutation();
    const [verifyingId, setVerifyingId] = useState<string | null>(null);

    const registrations: IEventRegistration[] = data?.data ?? [];
    const confirmed = registrations.filter((r) => r.status === "CONFIRMED");
    const paid = confirmed.filter((r) => r.paymentStatus === "PAID" || r.paymentStatus === "WAIVED");
    const pending = confirmed.filter((r) => r.paymentStatus === "PENDING");

    const handleVerify = async (id: string, paymentStatus: "PAID" | "WAIVED") => {
        setVerifyingId(id);
        try {
            await verifyPayment({ id, paymentStatus }).unwrap();
            toast.success(`Payment marked as ${paymentStatus}`);
        } catch (err: unknown) {
            toast.error((err as { data?: { message?: string } })?.data?.message ?? "Failed to verify payment");
        } finally {
            setVerifyingId(null);
        }
    };

    const exportCsv = () => {
        const rows = [
            ["Name", "Email", "Phone", "Batch", "Status", "Payment", "Total (BDT)", "Tier", "Guests", "T-Shirt", "TxnID", "Registered At"],
            ...registrations.map((r) => {
                const user = typeof r.userId === "object" ? (r.userId as IEventRegistrationUser) : null;
                return [
                    user?.name ?? "",
                    user?.email ?? "",
                    user?.phone ?? "",
                    user?.batch ?? "",
                    r.status,
                    r.paymentStatus,
                    r.totalAmount,
                    r.priceTierLabel ?? "",
                    r.guestCount,
                    r.tshirtSize ?? "",
                    r.transactionId ?? "",
                    format(new Date(r.createdAt), "yyyy-MM-dd HH:mm"),
                ];
            }),
        ];
        const csv = rows.map((row) => row.map((v) => `"${v}"`).join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${eventTitle.replace(/\s+/g, "_")}_registrations.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex flex-col flex-1 min-h-0">
            <div className="flex items-center justify-between px-6 py-3 border-b border-surface-100 flex-shrink-0 text-sm">
                <div className="flex items-center gap-6">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                        <RiGroupLine className="text-primary2-600" />
                        <strong className="text-primary2-900">{confirmed.length}</strong> confirmed
                    </span>
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                        <RiCheckboxCircleLine className="text-emerald-600" />
                        <strong className="text-emerald-700">{paid.length}</strong> paid
                    </span>
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                        <RiTimeLine className="text-amber-600" />
                        <strong className="text-amber-700">{pending.length}</strong> pending
                    </span>
                </div>
                <button onClick={exportCsv} className="flex items-center gap-1.5 text-xs bg-primary2-100 text-primary2-700 hover:bg-primary2-200 px-3 py-1.5 rounded-lg font-medium transition-colors">
                    <RiDownloadLine /> Export CSV
                </button>
            </div>
            <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                    <div className="flex items-center justify-center py-16"><RiLoader4Line className="animate-spin text-3xl text-primary2-600" /></div>
                ) : isError ? (
                    <div className="py-16 text-center text-muted-foreground text-sm">Failed to load registrations.</div>
                ) : registrations.length === 0 ? (
                    <div className="py-16 text-center">
                        <RiGroupLine className="text-4xl text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No registrations yet.</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="sticky top-0 bg-surface-50 border-b border-surface-200">
                            <tr>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Registrant</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden md:table-cell">Tier / Guests</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Amount</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Payment</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden lg:table-cell">TxnID</th>
                                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-100">
                            {registrations.map((reg) => {
                                const user = typeof reg.userId === "object" ? (reg.userId as IEventRegistrationUser) : null;
                                const regCfg = REG_STATUS[reg.status] ?? REG_STATUS.CONFIRMED;
                                const payCfg = PAYMENT_STATUS[reg.paymentStatus] ?? PAYMENT_STATUS.PENDING;
                                const isThisVerifying = isVerifying && verifyingId === reg._id;
                                return (
                                    <tr key={reg._id} className="hover:bg-surface-50">
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-primary2-900">{user?.name ?? "—"}</p>
                                            <p className="text-xs text-muted-foreground">{user?.email}</p>
                                            {user?.batch && <p className="text-xs text-muted-foreground">Batch {user.batch} · {user.section}</p>}
                                        </td>
                                        <td className="px-4 py-3 hidden md:table-cell">
                                            <p className="text-xs text-muted-foreground">{reg.priceTierLabel ?? "—"}</p>
                                            {reg.guestCount > 0 && <p className="text-xs text-muted-foreground">{reg.guestCount} guest{reg.guestCount > 1 ? "s" : ""}</p>}
                                            {reg.tshirtSize && <p className="text-xs text-muted-foreground">T-Shirt: {reg.tshirtSize}</p>}
                                        </td>
                                        <td className="px-4 py-3 font-semibold text-primary2-900">৳{reg.totalAmount.toLocaleString()}</td>
                                        <td className="px-4 py-3">
                                            <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", regCfg.className)}>{regCfg.label}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full border", payCfg.className)}>{payCfg.label}</span>
                                            {reg.paymentMethod && <p className="text-xs text-muted-foreground mt-0.5">{reg.paymentMethod}</p>}
                                        </td>
                                        <td className="px-4 py-3 hidden lg:table-cell">
                                            <span className="font-mono text-xs text-muted-foreground">{reg.transactionId ?? "—"}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {reg.paymentStatus === "PENDING" && reg.status !== "CANCELLED" && (
                                                <div className="flex flex-col gap-1">
                                                    <button onClick={() => handleVerify(reg._id, "PAID")} disabled={isThisVerifying} className="text-xs bg-emerald-600 text-white hover:bg-emerald-700 px-2.5 py-1 rounded-lg font-medium disabled:opacity-50 flex items-center gap-1">
                                                        {isThisVerifying ? <RiLoader4Line className="animate-spin" /> : <RiCheckboxCircleLine />} Mark Paid
                                                    </button>
                                                    <button onClick={() => handleVerify(reg._id, "WAIVED")} disabled={isThisVerifying} className="text-xs bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 px-2.5 py-1 rounded-lg font-medium disabled:opacity-50">
                                                        Waive
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

/* -- Cancel Requests Tab ---------------------------------- */

function CancelRequestsTab({ eventId }: { eventId: string }) {
    const { data, isLoading } = useGetAllCancelRequestsQuery({ status: "ALL" });
    const [processRequest, { isLoading: isProcessing }] = useProcessCancelRequestMutation();
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [noteInputId, setNoteInputId] = useState<string | null>(null);
    const [noteText, setNoteText] = useState("");

    const allRequests: IEventCancelRequest[] = data?.data ?? [];
    const requests = allRequests.filter((r) => {
        const evId = typeof r.eventId === "object" ? r.eventId._id : r.eventId;
        return evId === eventId;
    });

    const handleProcess = async (id: string, action: "APPROVED" | "REJECTED") => {
        setProcessingId(id);
        try {
            await processRequest({ id, body: { action, adminNote: noteText.trim() || undefined } }).unwrap();
            toast.success(`Request ${action === "APPROVED" ? "approved" : "rejected"}.`);
            setNoteInputId(null);
            setNoteText("");
        } catch (err: unknown) {
            toast.error((err as { data?: { message?: string } })?.data?.message ?? "Failed to process request");
        } finally {
            setProcessingId(null);
        }
    };

    if (isLoading) {
        return <div className="flex items-center justify-center py-16"><RiLoader4Line className="animate-spin text-3xl text-primary2-600" /></div>;
    }
    if (requests.length === 0) {
        return (
            <div className="py-16 text-center">
                <RiQuestionAnswerLine className="text-4xl text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No cancellation requests for this event.</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto divide-y divide-surface-100">
            {requests.map((req) => {
                const user = typeof req.userId === "object" ? req.userId : null;
                const statusCfg = CANCEL_STATUS[req.status] ?? CANCEL_STATUS.PENDING;
                const isThisProcessing = isProcessing && processingId === req._id;
                const showNoteInput = noteInputId === req._id;

                return (
                    <div key={req._id} className="px-6 py-4 hover:bg-surface-50">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                            <div className="min-w-0">
                                <p className="font-semibold text-primary2-900 text-sm">{user?.name ?? "—"}</p>
                                <p className="text-xs text-muted-foreground">{user?.email}</p>
                                {user?.batch && <p className="text-xs text-muted-foreground">Batch {user.batch} · {user.section}</p>}
                                <p className="text-xs text-muted-foreground mt-1.5">Requested {format(new Date(req.createdAt), "d MMM yyyy, h:mm a")}</p>
                            </div>
                            <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full border flex-shrink-0", statusCfg.className)}>{statusCfg.label}</span>
                        </div>

                        <div className="mt-2 rounded-xl bg-surface-50 border border-surface-200 p-3 text-xs text-neutral-700">
                            <span className="font-semibold text-muted-foreground">Reason: </span>{req.reason}
                        </div>

                        {req.adminNote && (
                            <div className="mt-2 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs">
                                <span className="font-semibold text-amber-800">Admin note: </span>
                                <span className="text-amber-700">{req.adminNote}</span>
                                {req.actionBy && (
                                    <p className="text-[11px] text-amber-600 mt-1">
                                        — {req.actionBy.name}{req.actionAt ? `, ${format(new Date(req.actionAt), "d MMM yyyy, h:mm a")}` : ""}
                                    </p>
                                )}
                            </div>
                        )}

                        {req.status === "PENDING" && (
                            <div className="mt-3 space-y-2">
                                {showNoteInput ? (
                                    <div className="space-y-2">
                                        <textarea
                                            value={noteText}
                                            onChange={(e) => setNoteText(e.target.value)}
                                            rows={2}
                                            maxLength={1000}
                                            placeholder="Add a note for the user (optional)..."
                                            className="w-full rounded-xl border border-surface-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary2-300 resize-none"
                                        />
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleProcess(req._id, "APPROVED")} disabled={isThisProcessing} className="text-xs bg-emerald-600 text-white hover:bg-emerald-700 px-3 py-1.5 rounded-lg font-medium disabled:opacity-50 flex items-center gap-1">
                                                {isThisProcessing ? <RiLoader4Line className="animate-spin" /> : <RiCheckboxCircleLine />} Approve &amp; Cancel Reg
                                            </button>
                                            <button onClick={() => handleProcess(req._id, "REJECTED")} disabled={isThisProcessing} className="text-xs bg-red-600 text-white hover:bg-red-700 px-3 py-1.5 rounded-lg font-medium disabled:opacity-50 flex items-center gap-1">
                                                {isThisProcessing ? <RiLoader4Line className="animate-spin" /> : <RiCloseCircleLine />} Reject
                                            </button>
                                            <button onClick={() => { setNoteInputId(null); setNoteText(""); }} className="text-xs text-muted-foreground hover:text-neutral-700 px-2 py-1.5">Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <button onClick={() => setNoteInputId(req._id)} className="text-xs text-primary2-700 border border-primary2-200 hover:bg-primary2-50 px-3 py-1.5 rounded-lg font-medium transition-colors">
                                        Review Request
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

/* -- Main Panel ------------------------------------------- */

interface Props {
    eventId: string;
    eventTitle: string;
    onClose: () => void;
}

type Tab = "registrations" | "cancel-requests";

export default function AdminEventRegistrationsPanel({ eventId, eventTitle, onClose }: Props) {
    const [activeTab, setActiveTab] = useState<Tab>("registrations");
    const { data: cancelData } = useGetAllCancelRequestsQuery({ status: "PENDING" });
    const pendingCancelCount = (cancelData?.data ?? []).filter((r) => {
        const evId = typeof r.eventId === "object" ? r.eventId._id : r.eventId;
        return evId === eventId;
    }).length;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-white w-full max-w-4xl rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-2xl">
                <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200 flex-shrink-0">
                    <div>
                        <h2 className="font-bold text-lg text-primary2-900">Registrations</h2>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{eventTitle}</p>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-surface-100 text-muted-foreground">
                        <RiCloseCircleLine className="text-xl" />
                    </button>
                </div>

                <div className="flex gap-1 px-6 pt-3 border-b border-surface-200 flex-shrink-0">
                    {([
                        { id: "registrations" as Tab, label: "Registrations", icon: <RiGroupLine /> },
                        { id: "cancel-requests" as Tab, label: "Cancellation Requests", icon: <RiQuestionAnswerLine />, badge: pendingCancelCount },
                    ]).map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                                activeTab === tab.id ? "text-primary2-700" : "text-muted-foreground hover:text-neutral-700"
                            )}
                        >
                            {tab.icon} {tab.label}
                            {tab.badge !== undefined && tab.badge > 0 && (
                                <span className="ml-1 text-[10px] font-bold bg-red-500 text-white rounded-full px-1.5 py-0.5 leading-none">{tab.badge}</span>
                            )}
                            {activeTab === tab.id && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-primary2-500 rounded-full" />}
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                    {activeTab === "registrations"
                        ? <RegistrationsTab eventId={eventId} eventTitle={eventTitle} />
                        : <CancelRequestsTab eventId={eventId} />}
                </div>
            </div>
        </div>
    );
}
