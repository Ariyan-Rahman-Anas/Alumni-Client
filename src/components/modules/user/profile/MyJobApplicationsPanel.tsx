"use client";

import Image from "next/image";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { RiFileListLine, RiCheckboxCircleLine, RiCloseCircleLine, RiTimeLine, RiExternalLinkLine, RiBriefcaseLine } from "react-icons/ri";
import { useGetMyApplicationsQuery } from "@/redux/apis/jobApi";
import { TApplicationStatus } from "../job/job.types";

const STATUS_CONFIG: Record<TApplicationStatus, { label: string; className: string; icon: React.ReactNode }> = {
    PENDING: { label: "Pending", className: "bg-amber-50 text-amber-700 border border-amber-200", icon: <RiTimeLine /> },
    SELECTED: { label: "Selected", className: "bg-primary2-50 text-primary2-700 border border-primary2-200", icon: <RiCheckboxCircleLine /> },
    REJECTED: { label: "Rejected", className: "bg-red-50 text-red-700 border border-red-200", icon: <RiCloseCircleLine /> },
};

function Avatar({ name, imageUrl, size = 36 }: { name: string; imageUrl?: string; size?: number }) {
    if (imageUrl) return <Image src={imageUrl} alt={name} width={size} height={size} className="rounded-full object-cover flex-shrink-0" style={{ width: size, height: size }} />;
    return (
        <div className="rounded-full bg-primary2-100 flex items-center justify-center font-bold text-primary2-700 flex-shrink-0" style={{ width: size, height: size, fontSize: size * 0.4 }}>
            {name[0]}
        </div>
    );
}

export default function MyJobApplicationsPanel() {
    const { data, isLoading } = useGetMyApplicationsQuery({});
    const applications = data?.data ?? [];

    if (isLoading) {
        return (
            <div className="space-y-4 animate-pulse">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-surface-200 p-5">
                        <div className="h-4 w-48 bg-surface-200 rounded mb-3" />
                        <div className="h-3 w-32 bg-surface-200 rounded" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center gap-2 mb-5">
                <RiFileListLine className="text-xl text-primary2-700" />
                <h2 className="text-lg font-bold text-primary2-900">My Applications</h2>
                <span className="ml-auto text-xs text-muted-foreground">{applications.length} total</span>
            </div>

            {applications.length === 0 ? (
                <div className="bg-white rounded-2xl border border-surface-200 p-12 text-center">
                    <RiBriefcaseLine className="text-4xl text-muted-foreground mx-auto mb-3" />
                    <p className="font-medium text-primary2-900">No applications yet</p>
                    <p className="text-sm text-muted-foreground mt-1">Browse jobs and apply to get started.</p>
                    <Link href="/jobs" className="mt-4 inline-flex items-center gap-1 text-sm text-primary2-700 font-medium hover:underline">
                        Browse Jobs <RiExternalLinkLine />
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {applications.map((app) => {
                        const statusCfg = STATUS_CONFIG[app.status] ?? STATUS_CONFIG.PENDING;
                        const jobTitle = typeof app.job === "object" ? app.job.title : "Job Post";
                        const jobId = typeof app.job === "object" ? app.job._id : app.job as unknown as string;

                        return (
                            <div key={app._id} className="bg-white rounded-2xl border border-surface-200 p-5 hover:border-primary2-200 transition-colors">
                                {/* Selected banner */}
                                {app.status === "SELECTED" && (
                                    <div className="bg-primary2-50 border border-primary2-200 rounded-xl px-4 py-2 mb-4 flex items-center gap-2 text-primary2-700 text-sm font-medium">
                                        <RiCheckboxCircleLine className="text-lg" /> Congratulations! You were selected for this position.
                                    </div>
                                )}

                                <div className="flex items-start gap-4">
                                    <Avatar
                                        name={typeof app.job === "object" ? (app.job.postedBy?.name ?? "?") : "?"}
                                        imageUrl={typeof app.job === "object" ? app.job.postedBy?.imageUrl : undefined}
                                        size={40}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-3 flex-wrap">
                                            <div>
                                                <Link href={`/jobs/${jobId}`} className="font-semibold text-primary2-900 hover:text-primary2-700 hover:underline transition-colors line-clamp-1">
                                                    {jobTitle}
                                                </Link>
                                                {typeof app.job === "object" && (
                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                        by {app.job.postedBy?.name} Â· {app.job.type?.replace("_", " ")}
                                                    </p>
                                                )}
                                            </div>
                                            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full capitalize flex-shrink-0 ${statusCfg.className}`}>
                                                {statusCfg.icon} {statusCfg.label}
                                            </span>
                                        </div>

                                        {app.message && (
                                            <p className="text-sm text-neutral-600 mt-2 line-clamp-2 bg-surface-50 rounded-lg px-3 py-2">{app.message}</p>
                                        )}

                                        <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                                            <span>Applied {formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}</span>
                                            <span>Â·</span>
                                            <span>{format(new Date(app.createdAt), "dd MMM yyyy")}</span>
                                            <Link href={`/jobs/${jobId}`} className="ml-auto flex items-center gap-1 text-primary2-700 hover:underline font-medium">
                                                View Post <RiExternalLinkLine />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
