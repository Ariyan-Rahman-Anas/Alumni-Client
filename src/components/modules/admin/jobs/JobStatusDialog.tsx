"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import TextAreaBox from "@/components/shared/TextAreaBox";
import type { IJobPost } from "@/components/modules/user/job/job.types";

interface JobStatusDialogProps {
    job: IJobPost | null;
    open: boolean;
    onClose: () => void;
    onSubmit: (
        status: "APPROVED" | "REJECTED" | "CLOSED",
        adminNote: string,
        rejectedReason?: string
    ) => void;
    isLoading: boolean;
}

const STATUSES = ["APPROVED", "REJECTED", "CLOSED"] as const;

const JobStatusDialog = ({ job, open, onClose, onSubmit, isLoading }: JobStatusDialogProps) => {
    const [status, setStatus] = useState<"APPROVED" | "REJECTED" | "CLOSED">("APPROVED");
    const [adminNote, setAdminNote] = useState("");
    const [rejectedReason, setRejectedReason] = useState("");
    const [submitted, setSubmitted] = useState(false);

    if (!job) return null;

    const noteError = !adminNote.trim() ? "Admin note is required" : undefined;
    const reasonError = status === "REJECTED" && !rejectedReason.trim() ? "Rejection reason is required" : undefined;

    const handleClose = () => {
        setSubmitted(false);
        setAdminNote("");
        setRejectedReason("");
        setStatus("APPROVED");
        onClose();
    };

    const handleConfirm = () => {
        setSubmitted(true);
        if (noteError) { toast.error(noteError); return; }
        if (reasonError) { toast.error(reasonError); return; }
        onSubmit(status, adminNote.trim(), rejectedReason.trim() || undefined);
    };

    return (
        <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Update Job Status</DialogTitle>
                    <DialogDescription className="line-clamp-1">{job.title}</DialogDescription>
                </DialogHeader>

                {/* Status tabs */}
                <div className="flex gap-2 my-2">
                    {STATUSES.map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatus(s)}
                            className={`flex-1 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${
                                status === s
                                    ? "bg-primary2-700 text-white"
                                    : "bg-surface-100 text-neutral-600 hover:bg-surface-200"
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                <div className="space-y-3">
                    <TextAreaBox
                        label="Admin Note"
                        required
                        rows={2}
                        value={adminNote}
                        onChange={(e) => setAdminNote(e.target.value)}
                        placeholder="Write an admin note..."
                        error={submitted ? noteError : undefined}
                    />

                    {status === "REJECTED" && (
                        <TextAreaBox
                            label="Rejection Reason"
                            required
                            rows={2}
                            value={rejectedReason}
                            onChange={(e) => setRejectedReason(e.target.value)}
                            placeholder="Explain the rejection reason..."
                            error={submitted ? reasonError : undefined}
                        />
                    )}
                </div>

                <DialogFooter className="gap-2 sm:gap-2">
                    <button
                        onClick={handleClose}
                        className="flex-1 py-2.5 border border-surface-200 rounded-xl text-sm text-neutral-700 hover:border-surface-300 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className="flex-1 py-2.5 bg-primary2-700 text-white font-semibold rounded-xl hover:bg-primary2-800 disabled:opacity-50 transition-colors text-sm"
                    >
                        {isLoading ? "Saving..." : "Confirm"}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default JobStatusDialog;
