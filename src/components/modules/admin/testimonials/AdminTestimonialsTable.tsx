"use client";

import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { BsStarFill } from "react-icons/bs";
import { RiCheckLine, RiCloseLine, RiDeleteBinLine } from "react-icons/ri";

import DataTable from "@/components/shared/dataTable/DataTable";
import DeleteAlertModal from "@/components/shared/DeleteAlertModal";
import type { TableColumn } from "@/types";
import {
    useGetAdminTestimonialsQuery,
    useApproveTestimonialMutation,
    useRejectTestimonialMutation,
    useDeleteTestimonialMutation,
} from "@/redux/apis/testimonialApi";
import type { ITestimonial, ITestimonialUser, TTestimonialStatus } from "@/types/common/testimonial.types";
import type { IServerErrorRes } from "@/types/common.components.types";

const BADGE_CLASS: Record<TTestimonialStatus, string> = {
    PENDING: "bg-amber-50 text-amber-700",
    APPROVED: "bg-green-50 text-green-700",
    REJECTED: "bg-red-50 text-red-600",
};

function getUser(t: ITestimonial): ITestimonialUser | null {
    if (typeof t.userId === "string" || !t.userId) return null;
    return t.userId as ITestimonialUser;
}

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
                <BsStarFill key={s} size={11} className={s <= rating ? "text-amber-400" : "text-gray-200"} />
            ))}
        </div>
    );
}

interface AdminTestimonialsTableProps {
    status: TTestimonialStatus;
}

const AdminTestimonialsTable = ({ status }: AdminTestimonialsTableProps) => {
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [rejectState, setRejectState] = useState<{ id: string; reason: string } | null>(null);
    const [orderMap, setOrderMap] = useState<Record<string, number>>({});

    const { data, isLoading, isError } = useGetAdminTestimonialsQuery({ status });
    const [approve, { isLoading: isApproving }] = useApproveTestimonialMutation();
    const [reject, { isLoading: isRejecting }] = useRejectTestimonialMutation();
    const [del, { isLoading: isDeleting }] = useDeleteTestimonialMutation();

    const testimonials = data?.data ?? [];

    const handleApprove = async (id: string) => {
        try {
            await approve({ id, order: orderMap[id] }).unwrap();
            toast.success("Testimonial approved!");
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

    const columns: TableColumn<ITestimonial>[] = [
        { key: "index", label: "#" },
        {
            key: "userId",
            label: "User",
            render: (t) => {
                const user = getUser(t);
                return (
                    <div className="flex items-center gap-3">
                        {user?.imageUrl ? (
                            <Image src={user.imageUrl} alt={user.name} width={36} height={36} className="rounded-full object-cover shrink-0" />
                        ) : (
                            <div className="h-9 w-9 rounded-full bg-primary2-100 text-primary2-700 flex items-center justify-center text-sm font-bold shrink-0">
                                {user?.name?.charAt(0)?.toUpperCase() ?? "?"}
                            </div>
                        )}
                        <div className="min-w-0">
                            <p className="font-semibold text-sm text-primary2-900 leading-tight">{user?.name ?? "Unknown"}</p>
                            {user?.batch && <p className="text-xs text-muted-foreground">Batch {user.batch}</p>}
                        </div>
                    </div>
                );
            },
        },
        {
            key: "quote",
            label: "Quote",
            render: (t) => (
                <p className="text-sm text-gray-700 italic line-clamp-2 max-w-xs">&ldquo;{t.quote}&rdquo;</p>
            ),
        },
        {
            key: "rating",
            label: "Rating",
            render: (t) => <StarRating rating={t.rating} />,
        },
        {
            key: "status",
            label: "Status",
            render: (t) => (
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${BADGE_CLASS[t.status]}`}>
                    {t.status}
                </span>
            ),
        },
        {
            key: "actions",
            label: "Actions",
            render: (t) => (
                <div className="flex items-center justify-center gap-1.5">
                    {t.status !== "APPROVED" && (
                        <button
                            type="button"
                            disabled={isApproving}
                            onClick={() => handleApprove(t._id)}
                            className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 font-medium transition-colors disabled:opacity-50"
                        >
                            <RiCheckLine size={13} /> Approve
                        </button>
                    )}
                    {t.status === "APPROVED" && (
                        <div className="flex items-center gap-1">
                            <input
                                type="number"
                                min={0}
                                defaultValue={t.order}
                                onChange={(e) => setOrderMap((prev) => ({ ...prev, [t._id]: Number(e.target.value) }))}
                                className="w-14 text-xs border border-surface-300 rounded-md px-2 py-1 text-center"
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
                    {t.status !== "REJECTED" && (
                        <button
                            type="button"
                            onClick={() => setRejectState({ id: t._id, reason: "" })}
                            className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium transition-colors"
                        >
                            <RiCloseLine size={13} /> Reject
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() => setDeleteId(t._id)}
                        className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg hover:bg-gray-100 text-muted-foreground hover:text-red-600 font-medium transition-colors"
                    >
                        <RiDeleteBinLine size={13} />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <>
            <DataTable
                data={testimonials}
                columns={columns}
                isLoading={isLoading}
                isError={isError}
                isPaginate={false}
                emptyMessage={`No ${status.toLowerCase()} testimonials.`}
            />

            {/* Reject dialog */}
            {rejectState && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white dark:bg-gunmetal-900 rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Reject Testimonial</h3>
                        <p className="text-sm text-muted-foreground">Optionally provide a reason (visible to admin only).</p>
                        <textarea
                            rows={3}
                            className="w-full border border-surface-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary2-400"
                            placeholder="Reason (optional)..."
                            value={rejectState.reason}
                            onChange={(e) => setRejectState((s) => s && { ...s, reason: e.target.value })}
                        />
                        <div className="flex justify-end gap-3">
                            <button type="button" onClick={() => setRejectState(null)} disabled={isRejecting} className="text-sm px-4 py-2 rounded-lg hover:bg-gray-100 text-muted-foreground transition-colors">
                                Cancel
                            </button>
                            <button type="button" onClick={handleReject} disabled={isRejecting} className="text-sm px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium transition-colors disabled:opacity-50">
                                {isRejecting ? "Rejecting..." : "Confirm Reject"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <DeleteAlertModal
                open={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
                title="Delete this testimonial?"
                description="This action cannot be undone."
            />
        </>
    );
};

export default AdminTestimonialsTable;
