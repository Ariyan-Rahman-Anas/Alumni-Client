"use client";

import { useState } from "react";
import { toast } from "sonner";
import { BsStarFill } from "react-icons/bs";
import { RiCheckLine, RiCloseLine, RiDeleteBinLine } from "react-icons/ri";
import Image from "next/image";

import AdminPageHead from "@/components/shared/admin/AdminPageHead";
import DeleteAlertModal from "@/components/shared/DeleteAlertModal";

import {
    useGetAdminTestimonialsQuery,
    useApproveTestimonialMutation,
    useRejectTestimonialMutation,
    useDeleteTestimonialMutation,
} from "@/redux/apis/testimonialApi";
import type { ITestimonial, ITestimonialUser, TTestimonialStatus } from "@/types/common/testimonial.types";
import type { IServerErrorRes } from "@/types/common.components.types";

/* ── helpers ─────────────────────────────────────────────── */
function getUser(t: ITestimonial): ITestimonialUser | null {
    if (typeof t.userId === "string" || !t.userId) return null;
    return t.userId as ITestimonialUser;
}

const TABS: { label: string; value: TTestimonialStatus; color: string }[] = [
    { label: "Pending", value: "PENDING", color: "text-amber-600" },
    { label: "Approved", value: "APPROVED", color: "text-green-600" },
    { label: "Rejected", value: "REJECTED", color: "text-red-500" },
];

const BADGE_CLASS: Record<TTestimonialStatus, string> = {
    PENDING: "bg-amber-50 text-amber-700",
    APPROVED: "bg-green-50 text-green-700",
    REJECTED: "bg-red-50 text-red-600",
};

/* ── reject dialog ────────────────────────────────────────── */
interface RejectState { id: string; reason: string }

/* ── component ─────────────────────────────────────────────── */
const AdminTestimonialsPage = () => {
    const [activeTab, setActiveTab] = useState<TTestimonialStatus>("PENDING");
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [rejectState, setRejectState] = useState<RejectState | null>(null);
    const [orderMap, setOrderMap] = useState<Record<string, number>>({});

    const { data, isLoading, isError } = useGetAdminTestimonialsQuery({ status: activeTab });
    const [approve, { isLoading: isApproving }] = useApproveTestimonialMutation();
    const [reject, { isLoading: isRejecting }] = useRejectTestimonialMutation();
    const [del, { isLoading: isDeleting }] = useDeleteTestimonialMutation();

    const testimonials = data?.data ?? [];

    const handleApprove = async (id: string) => {
        try {
            await approve({ id, order: orderMap[id] }).unwrap();
            toast.success("Testimonial approved and published!");
        } catch (err) {
            toast.error((err as IServerErrorRes).data?.message ?? "Failed to approve");
        }
    };

    const handleReject = async () => {
        if (!rejectState) return;
        try {
            await reject({ id: rejectState.id, rejectionReason: rejectState.reason || undefined }).unwrap();
            toast.success("Testimonial rejected.");
            setRejectState(null);
        } catch (err) {
            toast.error((err as IServerErrorRes).data?.message ?? "Failed to reject");
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await del(deleteId).unwrap();
            toast.success("Deleted.");
            setDeleteId(null);
        } catch (err) {
            toast.error((err as IServerErrorRes).data?.message ?? "Failed to delete");
        }
    };

    return (
        <div className="admin-page-setup">
            {/* Header */}
            <div className="mb-6">
                <AdminPageHead
                    title="Testimonials"
                    description="Review alumni testimonials. Approve to publish on the home page, or reject with feedback."
                />
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 mb-5 border-b border-surface-300">
                {TABS.map(({ label, value, color }) => {
                    const isActive = activeTab === value;
                    return (
                        <button
                            key={value}
                            type="button"
                            onClick={() => setActiveTab(value)}
                            className={`px-4 py-2.5 text-sm font-medium transition-all relative ${
                                isActive
                                    ? `${color} border-b-2 border-current`
                                    : "text-muted-foreground hover:text-gray-700"
                            }`}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-28 rounded-xl bg-gray-100 dark:bg-gunmetal-800 animate-pulse" />
                    ))}
                </div>
            )}

            {/* Error */}
            {isError && (
                <p className="text-sm text-red-500">Failed to load. Please try again.</p>
            )}

            {/* Empty */}
            {!isLoading && !isError && testimonials.length === 0 && (
                <div className="text-center py-16 text-muted-foreground text-sm">
                    No {activeTab.toLowerCase()} testimonials.
                </div>
            )}

            {/* Review cards */}
            {!isLoading && testimonials.length > 0 && (
                <div className="space-y-4">
                    {testimonials.map((t) => {
                        const user = getUser(t);
                        const roleLabel = [user?.position, user?.workplace]
                            .filter(Boolean)
                            .join(" @ ") || user?.country || "";

                        return (
                            <div
                                key={t._id}
                                className="bg-white dark:bg-gunmetal-900 rounded-xl border border-surface-200 dark:border-gunmetal-700 p-5 flex flex-col sm:flex-row gap-5"
                            >
                                {/* User info */}
                                <div className="flex items-start gap-3 sm:w-52 shrink-0">
                                    {user?.imageUrl ? (
                                        <Image
                                            src={user.imageUrl}
                                            alt={user.name}
                                            width={44}
                                            height={44}
                                            className="rounded-full object-cover shrink-0"
                                        />
                                    ) : (
                                        <div className="h-11 w-11 rounded-full bg-primary2-100 text-primary2-700 flex items-center justify-center text-sm font-bold shrink-0">
                                            {user?.name?.charAt(0)?.toUpperCase() ?? "?"}
                                        </div>
                                    )}
                                    <div className="min-w-0">
                                        <p className="font-semibold text-sm text-gray-900 dark:text-white leading-tight">
                                            {user?.name ?? "Unknown"}
                                        </p>
                                        {user?.batch && (
                                            <p className="text-xs text-muted-foreground leading-tight mt-0.5">
                                                Batch {user.batch}
                                            </p>
                                        )}
                                        {roleLabel && (
                                            <p className="text-xs text-muted-foreground leading-tight mt-0.5 line-clamp-2">
                                                {roleLabel}
                                            </p>
                                        )}
                                        {/* Stars */}
                                        <div className="flex items-center gap-0.5 mt-1.5">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <BsStarFill
                                                    key={s}
                                                    size={11}
                                                    className={s <= t.rating ? "text-amber-400" : "text-gray-200"}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Quote + actions */}
                                <div className="flex-1 flex flex-col justify-between gap-4 min-w-0">
                                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">
                                        &ldquo;{t.quote}&rdquo;
                                    </p>

                                    {t.rejectionReason && (
                                        <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">
                                            <span className="font-medium">Rejection reason:</span> {t.rejectionReason}
                                        </p>
                                    )}

                                    <div className="flex items-center flex-wrap gap-2">
                                        {/* Status badge */}
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${BADGE_CLASS[t.status]}`}>
                                            {t.status}
                                        </span>

                                        {/* Approve */}
                                        {t.status !== "APPROVED" && (
                                            <button
                                                type="button"
                                                disabled={isApproving}
                                                onClick={() => handleApprove(t._id)}
                                                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 font-medium transition-colors disabled:opacity-50"
                                            >
                                                <RiCheckLine size={14} />
                                                Approve
                                            </button>
                                        )}

                                        {/* Order (only on Approved tab) */}
                                        {t.status === "APPROVED" && (
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-xs text-muted-foreground">Order:</span>
                                                <input
                                                    type="number"
                                                    min={0}
                                                    defaultValue={t.order}
                                                    onChange={(e) =>
                                                        setOrderMap((prev) => ({
                                                            ...prev,
                                                            [t._id]: Number(e.target.value),
                                                        }))
                                                    }
                                                    className="w-16 text-xs border border-surface-300 rounded-md px-2 py-1 text-center"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleApprove(t._id)}
                                                    disabled={isApproving}
                                                    className="text-xs px-2 py-1 rounded-md bg-primary2-50 text-primary2-700 hover:bg-primary2-100 font-medium transition-colors disabled:opacity-50"
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        )}

                                        {/* Reject */}
                                        {t.status !== "REJECTED" && (
                                            <button
                                                type="button"
                                                onClick={() => setRejectState({ id: t._id, reason: "" })}
                                                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium transition-colors"
                                            >
                                                <RiCloseLine size={14} />
                                                Reject
                                            </button>
                                        )}

                                        {/* Delete */}
                                        <button
                                            type="button"
                                            onClick={() => setDeleteId(t._id)}
                                            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg hover:bg-gray-100 text-muted-foreground hover:text-red-600 font-medium transition-colors ml-auto"
                                        >
                                            <RiDeleteBinLine size={13} />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Reject reason dialog */}
            {rejectState && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white dark:bg-gunmetal-900 rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Reject Testimonial</h3>
                        <p className="text-sm text-muted-foreground">
                            Optionally provide a reason (visible to admin only).
                        </p>
                        <textarea
                            rows={3}
                            className="w-full border border-surface-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary2-400"
                            placeholder="Reason (optional)..."
                            value={rejectState.reason}
                            onChange={(e) => setRejectState((s) => s && { ...s, reason: e.target.value })}
                        />
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setRejectState(null)}
                                disabled={isRejecting}
                                className="text-sm px-4 py-2 rounded-lg hover:bg-gray-100 text-muted-foreground transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleReject}
                                disabled={isRejecting}
                                className="text-sm px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium transition-colors disabled:opacity-50"
                            >
                                {isRejecting ? "Rejecting..." : "Confirm Reject"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete confirmation */}
            <DeleteAlertModal
                open={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
                title="Delete this testimonial?"
                description="This action cannot be undone."
            />
        </div>
    );
};

export default AdminTestimonialsPage;
