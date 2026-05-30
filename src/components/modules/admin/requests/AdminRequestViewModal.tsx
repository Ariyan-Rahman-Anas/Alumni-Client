"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { RiCheckLine, RiCloseLine, RiTimeLine, RiSearchLine } from "react-icons/ri";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { IRequest, TRequestStatus } from "@/types/request.types";
import { useUpdateRequestMutation } from "@/redux/apis/requestApi";
import DateFormatter from "@/lib/DateFormatter";
import SingleSelect from "@/components/shared/SingleSelect";

const STATUS_STYLES: Record<TRequestStatus, string> = {
    PENDING: "bg-amber-50 text-amber-700 border border-amber-200",
    IN_REVIEW: "bg-blue-50 text-blue-700 border border-blue-200",
    RESOLVED: "bg-primary2-50 text-primary2-700 border border-primary2-200",
    REJECTED: "bg-red-50 text-red-700 border border-red-200",
};

const STATUS_ICONS: Record<TRequestStatus, React.ReactNode> = {
    PENDING: <RiTimeLine />,
    IN_REVIEW: <RiSearchLine />,
    RESOLVED: <RiCheckLine />,
    REJECTED: <RiCloseLine />,
};

const CATEGORY_LABELS: Record<string, string> = {
    general: "General",
    correction: "Correction",
    complaint: "Complaint",
    suggestion: "Suggestion",
    other: "Other",
};

interface AdminRequestViewModalProps {
    request: IRequest | null;
    onClose: () => void;
}

const AdminRequestViewModal = ({ request, onClose }: AdminRequestViewModalProps) => {
    const [status, setStatus] = useState<TRequestStatus>("PENDING");
    const [adminMessage, setAdminMessage] = useState("");
    const [updateRequest, { isLoading }] = useUpdateRequestMutation();

    useEffect(() => {
        if (request) {
            setStatus(request.status);
            setAdminMessage(request.adminMessage ?? "");
        }
    }, [request]);

    const handleSubmit = async () => {
        if (!request) return;
        try {
            const res = await updateRequest({
                id: request._id,
                body: { status, adminMessage: adminMessage.trim() || undefined },
            }).unwrap();
            toast.success(res.message || "Request updated");
            onClose();
        } catch { }
    };

    const user = request && typeof request.user === "object" ? request.user : null;

    const statusOptions = [
        { value: "PENDING", label: "Pending" },
        { value: "IN_REVIEW", label: "In Review" },
        { value: "RESOLVED", label: "Resolved" },
        { value: "REJECTED", label: "Rejected" },
    ]

    return (
        <Dialog open={!!request} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Request Details</DialogTitle>
                </DialogHeader>

                {request && (
                    <div className="space-y-5">
                        {/* Requester */}
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-50 border border-surface-200">
                            {user?.imageUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={user.imageUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                            ) : (
                                <span className="w-10 h-10 rounded-full bg-primary2-100 text-primary2-700 font-bold flex items-center justify-center shrink-0">
                                    {user?.name?.[0] ?? "?"}
                                </span>
                            )}
                            <div className="min-w-0">
                                <p className="font-semibold text-gray-900 text-sm">{user?.name ?? "â€”"}</p>
                                <p className="text-xs text-muted-foreground">{user?.email ?? "â€”"}</p>
                                {user?.phone && <p className="text-xs text-muted-foreground">{user.phone}</p>}
                            </div>
                            <span className={`ml-auto text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 ${STATUS_STYLES[request.status]}`}>
                                {STATUS_ICONS[request.status]}
                                {request.status.replace("_", " ")}
                            </span>
                        </div>

                        {/* Request info */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-surface-100 border">
                                    {CATEGORY_LABELS[request.category] ?? request.category}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    <DateFormatter date={request.createdAt} />
                                </span>
                            </div>
                            <h3 className="font-semibold text-gray-900">{request.subject}</h3>
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{request.description}</p>
                        </div>

                        <hr className="border-surface-200" />

                        {/* Admin response */}
                        <div className="space-y-3">
                            <p className="text-sm font-semibold text-gray-800">Admin Response</p>
                            <SingleSelect
                                label="Status"
                                value={status}
                                onValueChange={(v) => setStatus(v as TRequestStatus)}
                                options={statusOptions}
                                placeholder="Status"
                                searchable={false}
                            />

                            <div className="space-y-1">
                                <label className="text-xs text-muted-foreground">Message to user (optional)</label>
                                <Textarea
                                    value={adminMessage}
                                    onChange={(e) => setAdminMessage(e.target.value)}
                                    placeholder="Write a response message for the userâ€¦"
                                    maxLength={500}
                                    rows={4}
                                />
                                <p className="text-xs text-muted-foreground text-right">{adminMessage.length}/500</p>
                            </div>

                            <div className="flex gap-2 justify-end pt-1">
                                <Button variant="outline" onClick={onClose} disabled={isLoading}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSubmit} disabled={isLoading}>
                                    {isLoading ? "Savingâ€¦" : "Save Response"}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default AdminRequestViewModal;
