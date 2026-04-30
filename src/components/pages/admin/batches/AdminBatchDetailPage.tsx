"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";
import {
    RiArrowLeftLine,
    RiShieldUserLine,
    RiCheckLine,
    RiCloseLine,
    RiBarChartLine,
    RiTimeLine,
} from "react-icons/ri";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { useGetBatchByIdQuery } from "@/redux/apis/batchApi";
import {
    useGetBatchRoomQuery,
    useGetBatchPollsQuery,
    useGetCoordinatorApplicationsQuery,
    useReviewCoordinatorApplicationMutation,
} from "@/redux/apis/batchRoom";
import type { BatchCoordinatorApplication, BatchPoll } from "@/redux/apis/batchRoom/types";

function PollSummary({ poll }: { poll: BatchPoll }) {
    const total = poll.options.reduce((s, o) => s + o.voters.length, 0);
    return (
        <div className="border border-surface-200 rounded-xl p-4 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-neutral-800">{poll.question}</p>
                {poll.isOpen ? (
                    <span className="text-[10px] bg-green-50 text-green-700 border border-green-200 rounded-full px-2 py-0.5">Open</span>
                ) : (
                    <span className="text-[10px] bg-surface-100 text-muted-foreground border border-surface-200 rounded-full px-2 py-0.5">Closed</span>
                )}
            </div>
            <div className="space-y-1.5">
                {poll.options.map((opt) => {
                    const pct = total > 0 ? Math.round((opt.voters.length / total) * 100) : 0;
                    return (
                        <div key={opt._id} className="flex items-center gap-2">
                            <div className="flex-1 bg-surface-100 rounded-full h-2">
                                <div className="bg-primary2-500 h-2 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-xs text-muted-foreground w-24 text-right">{opt.text} ({opt.voters.length})</span>
                        </div>
                    );
                })}
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">{total} votes total</p>
            {poll.deadline && (
                <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                    <RiTimeLine /> Deadline: {format(new Date(poll.deadline), "MMM d, yyyy HH:mm")}
                </p>
            )}
        </div>
    );
}

function ApplicationCard({ app, onReview }: {
    app: BatchCoordinatorApplication;
    onReview: (id: string, decision: "APPROVED" | "REJECTED", note?: string) => void;
}) {
    const [rejectionNote, setRejectionNote] = useState("");
    const [showRejectForm, setShowRejectForm] = useState(false);

    const statusColor = {
        PENDING: "bg-amber-50 text-amber-700 border-amber-200",
        APPROVED: "bg-green-50 text-green-700 border-green-200",
        REJECTED: "bg-red-50 text-red-700 border-red-200",
    }[app.status];

    return (
        <div className="border border-surface-200 rounded-xl p-4 bg-white shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold text-neutral-800">{app.applicant.name}</p>
                    <p className="text-xs text-muted-foreground">{app.applicant.email}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Applied: {format(new Date(app.createdAt), "MMM d, yyyy")}</p>
                    {app.rejectionNote && (
                        <div className="mt-2 text-xs bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2">
                            <strong>Rejection reason:</strong> {app.rejectionNote}
                        </div>
                    )}
                </div>
                <span className={`text-[10px] border rounded-full px-2 py-0.5 flex-shrink-0 ${statusColor}`}>{app.status}</span>
            </div>

            {app.status === "PENDING" && (
                <div className="mt-3 flex flex-col gap-2">
                    {showRejectForm ? (
                        <>
                            <textarea value={rejectionNote} onChange={(e) => setRejectionNote(e.target.value)}
                                placeholder="Rejection reason (required)…"
                                rows={2}
                                className="w-full text-sm px-3 py-2 rounded-lg border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary2-300 resize-none" />
                            <div className="flex gap-2">
                                <Button size="sm" variant="destructive"
                                    onClick={() => {
                                        if (!rejectionNote.trim()) { toast.error("Rejection reason is required."); return; }
                                        onReview(app._id, "REJECTED", rejectionNote.trim());
                                    }}>
                                    Confirm Reject
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => setShowRejectForm(false)}>Cancel</Button>
                            </div>
                        </>
                    ) : (
                        <div className="flex gap-2">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
                                onClick={() => onReview(app._id, "APPROVED")}>
                                <RiCheckLine /> Approve
                            </Button>
                            <Button size="sm" variant="destructive" className="flex items-center gap-1"
                                onClick={() => setShowRejectForm(true)}>
                                <RiCloseLine /> Reject
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function AdminBatchDetailPage({ id }: { id: string }) {
    const { data: batchData, isLoading: batchLoading } = useGetBatchByIdQuery(id);
    const batch = batchData?.data;
    const batchYear = batch?.year;

    const { data: roomData } = useGetBatchRoomQuery(batchYear!, { skip: !batchYear });
    const { data: pollsData } = useGetBatchPollsQuery(batchYear!, { skip: !batchYear });
    const { data: appsData, refetch: refetchApps } = useGetCoordinatorApplicationsQuery(batchYear, { skip: !batchYear });
    const [reviewApplication] = useReviewCoordinatorApplicationMutation();

    const room = roomData?.data;
    const polls = pollsData?.data ?? [];
    const applications = appsData?.data ?? [];
    const coordinator = room?.coordinator as { name?: string; email?: string } | null | undefined;

    const handleReview = async (applicationId: string, decision: "APPROVED" | "REJECTED", rejectionNote?: string) => {
        try {
            await reviewApplication({ applicationId, decision, rejectionNote }).unwrap();
            toast.success(decision === "APPROVED" ? "Application approved." : "Application rejected.");
            refetchApps();
        } catch { toast.error("Review failed."); }
    };

    if (batchLoading) return <div className="p-8 text-sm text-muted-foreground">Loading…</div>;
    if (!batch) return <div className="p-8 text-sm text-muted-foreground">Batch not found.</div>;

    return (
        <div className="three-xl-section-setup pb-20 space-y-8">
            {/* Back */}
            <Link href="/admin/batches" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary2-700 transition-colors">
                <RiArrowLeftLine /> Back to Batches
            </Link>

            {/* Header */}
            <div className="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-primary2-900">Batch {batch.year}</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge variant={batch.isActive ? "default" : "secondary"}
                                className={batch.isActive ? "bg-emerald-100 text-emerald-700 border-emerald-200" : ""}>
                                {batch.isActive ? "Active" : "Inactive"}
                            </Badge>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                        {[
                            { label: "Total", value: batch.stats?.totalRegistrations ?? 0 },
                            { label: "Approved", value: batch.stats?.approved ?? 0 },
                            { label: "Last 30 days", value: batch.stats?.last30Days ?? 0 },
                            { label: "Science / Commerce / Arts", value: `${batch.stats?.scienceCount ?? 0} / ${batch.stats?.commerceCount ?? 0} / ${batch.stats?.artsCount ?? 0}` },
                        ].map((s) => (
                            <div key={s.label} className="rounded-xl border border-surface-200 bg-surface-50 px-4 py-3">
                                <p className="text-lg font-bold text-primary2-900">{s.value}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Batch Room */}
            <div className="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm">
                <h2 className="font-bold text-lg text-primary2-900 mb-4">Batch Room</h2>
                {room ? (
                    <div className="space-y-2 text-sm">
                        <p><span className="font-medium text-neutral-700">Name:</span> {room.name ?? `Batch ${batchYear} Room`}</p>
                        {coordinator ? (
                            <p className="flex items-center gap-1.5">
                                <RiShieldUserLine className="text-amber-500" />
                                <span className="font-medium text-neutral-700">Coordinator:</span> {coordinator.name} ({coordinator.email})
                            </p>
                        ) : (
                            <p className="text-muted-foreground">No coordinator assigned.</p>
                        )}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">No batch room yet.</p>
                )}
            </div>

            {/* Polls */}
            {polls.length > 0 && (
                <div className="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm">
                    <h2 className="font-bold text-lg text-primary2-900 mb-4 flex items-center gap-2">
                        <RiBarChartLine className="text-primary2-600" /> Polls ({polls.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {polls.map((poll) => <PollSummary key={poll._id} poll={poll} />)}
                    </div>
                </div>
            )}

            {/* Coordinator Applications */}
            <div className="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm">
                <h2 className="font-bold text-lg text-primary2-900 mb-4">Coordinator Applications</h2>
                {applications.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No applications for this batch.</p>
                ) : (
                    <div className="space-y-3">
                        {applications.map((app) => (
                            <ApplicationCard key={app._id} app={app} onReview={handleReview} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
