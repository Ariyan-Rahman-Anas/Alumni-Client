"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import {
    RiBriefcaseLine,
    RiCheckboxCircleLine,
    RiCloseCircleLine,
    RiTimeLine,
    RiCheckLine,
    RiExternalLinkLine,
    RiUserLine,
    RiArrowDownSLine,
    RiArrowUpSLine,
} from "react-icons/ri";
import {
    useGetMyJobsQuery,
    useGetJobApplicationsQuery,
    useSelectApplicantMutation,
    type JobPost,
    type JobPostStatus,
} from "@/redux/apis/jobApi";

const STATUS_CONFIG: Record<JobPostStatus, { label: string; className: string; icon: React.ReactNode }> = {
    pending: { label: "Pending", className: "bg-amber-50 text-amber-700 border border-amber-200", icon: <RiTimeLine /> },
    approved: { label: "Active", className: "bg-emerald-50 text-emerald-700 border border-emerald-200", icon: <RiCheckboxCircleLine /> },
    rejected: { label: "Rejected", className: "bg-red-50 text-red-700 border border-red-200", icon: <RiCloseCircleLine /> },
    closed: { label: "Closed", className: "bg-surface-100 text-neutral-600 border border-surface-300", icon: <RiCheckLine /> },
};

function Avatar({ name, imageUrl, size = 36 }: { name: string; imageUrl?: string; size?: number }) {
    if (imageUrl) return <Image src={imageUrl} alt={name} width={size} height={size} className="rounded-full object-cover flex-shrink-0" style={{ width: size, height: size }} />;
    return (
        <div className="rounded-full bg-primary2-100 flex items-center justify-center font-bold text-primary2-700 flex-shrink-0" style={{ width: size, height: size, fontSize: size * 0.4 }}>
            {name[0]}
        </div>
    );
}

/* ── Applicants sub-panel per job ─────────────────────── */
function JobApplicantsPanel({ jobId, isOwner }: { jobId: string; isOwner: boolean }) {
    const { data, isLoading } = useGetJobApplicationsQuery(jobId);
    const [selectApplicant] = useSelectApplicantMutation();
    const apps = data?.data ?? [];

    if (isLoading) return <div className="py-3 text-xs text-muted-foreground animate-pulse">Loading applicants…</div>;
    if (apps.length === 0) return <p className="py-3 text-xs text-muted-foreground text-center">No applicants yet.</p>;

    return (
        <div className="space-y-3">
            {apps.map((app) => {
                const statusColor = {
                    pending: "bg-amber-50 text-amber-700 border border-amber-200",
                    selected: "bg-emerald-50 text-emerald-700 border border-emerald-200",
                    rejected: "bg-red-50 text-red-700 border border-red-200",
                }[app.status] ?? "bg-surface-100 text-neutral-600";

                return (
                    <div key={app._id} className="flex items-start gap-3 bg-surface-50 rounded-xl p-3">
                        <Avatar name={app.applicant.name} imageUrl={app.applicant.imageUrl} size={32} />
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                                <p className="font-semibold text-primary2-900 text-sm">{app.applicant.name}</p>
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${statusColor}`}>{app.status}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{app.applicant.email}</p>
                            {app.message && <p className="text-xs text-neutral-600 mt-1 line-clamp-2">{app.message}</p>}
                            <div className="flex items-center gap-3 mt-2">
                                <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}</span>
                                {isOwner && app.status === "pending" && (
                                    <button
                                        onClick={() => selectApplicant({ jobId, appId: app._id })}
                                        className="text-xs bg-emerald-500 text-white px-3 py-1 rounded-full hover:bg-emerald-600 transition-colors"
                                    >
                                        Select
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

/* ── Job Row ──────────────────────────────────────────── */
function JobRow({ job }: { job: JobPost }) {
    const [expanded, setExpanded] = useState(false);
    const isSeek = job.type !== "official";
    const statusCfg = STATUS_CONFIG[job.status] ?? STATUS_CONFIG.pending;

    return (
        <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden hover:border-primary2-200 transition-colors">
            <div className="p-5">
                <div className="flex items-start gap-3">
                    <div className="mt-1 text-lg text-primary2-600">
                        <RiBriefcaseLine />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div>
                                <Link href={`/jobs/${job._id}`} className="font-semibold text-primary2-900 hover:text-primary2-700 hover:underline transition-colors line-clamp-1">
                                    {job.title}
                                </Link>
                                <p className="text-xs text-muted-foreground mt-0.5 capitalize">{job.type.replace("_", " ")} · Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusCfg.className}`}>
                                    {statusCfg.icon} {statusCfg.label}
                                </span>
                                <Link href={`/jobs/${job._id}`} title="View post" className="p-1.5 text-muted-foreground hover:text-primary2-700 hover:bg-primary2-50 rounded-lg transition-colors">
                                    <RiExternalLinkLine />
                                </Link>
                            </div>
                        </div>

                        <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs mt-3">
                            {job.applicationDeadline && (
                                <><dt className="text-muted-foreground">Deadline</dt><dd className="font-medium text-primary2-900">{format(new Date(job.applicationDeadline), "dd MMM yyyy")}</dd></>
                            )}
                            {job.location && <><dt className="text-muted-foreground">Location</dt><dd className="font-medium text-primary2-900">{job.location}</dd></>}
                            {job.paymentAmount && <><dt className="text-muted-foreground">Payment</dt><dd className="font-medium text-primary2-900">{job.paymentNegotiable ? "Negotiable" : `${job.paymentAmount} BDT`}</dd></>}
                            <><dt className="text-muted-foreground">Likes</dt><dd className="font-medium text-primary2-900">{job.likes.length}</dd></>
                            <><dt className="text-muted-foreground">Comments</dt><dd className="font-medium text-primary2-900">{job.comments.length}</dd></>
                        </dl>
                    </div>
                </div>

                {/* Expand applicants (seek posts only) */}
                {isSeek && (
                    <button
                        onClick={() => setExpanded((v) => !v)}
                        className="mt-4 w-full flex items-center justify-center gap-1.5 text-xs text-primary2-700 font-medium hover:underline"
                    >
                        <RiUserLine /> {expanded ? "Hide" : "View"} Applicants
                        {expanded ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
                    </button>
                )}
            </div>

            {/* Applicants panel */}
            {isSeek && expanded && (
                <div className="border-t border-surface-200 px-5 py-4">
                    <JobApplicantsPanel jobId={job._id} isOwner={true} />
                </div>
            )}
        </div>
    );
}

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════ */
export default function MyPostedJobsPanel() {
    const { data, isLoading } = useGetMyJobsQuery({});
    const jobs = data?.data ?? [];

    if (isLoading) {
        return (
            <div className="space-y-4 animate-pulse">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-surface-200 p-5">
                        <div className="h-4 w-56 bg-surface-200 rounded mb-3" />
                        <div className="h-3 w-32 bg-surface-200 rounded" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center gap-2 mb-5">
                <RiBriefcaseLine className="text-xl text-primary2-700" />
                <h2 className="text-lg font-bold text-primary2-900">My Posted Jobs</h2>
                <span className="ml-auto text-xs text-muted-foreground">{jobs.length} total</span>
            </div>

            {jobs.length === 0 ? (
                <div className="bg-white rounded-2xl border border-surface-200 p-12 text-center">
                    <RiBriefcaseLine className="text-4xl text-muted-foreground mx-auto mb-3" />
                    <p className="font-medium text-primary2-900">No jobs posted yet</p>
                    <p className="text-sm text-muted-foreground mt-1">Post a job to find the right person.</p>
                    <Link href="/jobs/post" className="mt-4 inline-flex items-center gap-1 text-sm text-primary2-700 font-medium hover:underline">
                        Post a Job <RiExternalLinkLine />
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {jobs.map((job) => <JobRow key={job._id} job={job} />)}
                </div>
            )}
        </div>
    );
}
