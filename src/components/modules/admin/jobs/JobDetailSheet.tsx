"use client";

import Image from "next/image";
import {
    RiBriefcaseLine,
    RiBookOpenLine,
    RiToolsLine,
    RiMapPinLine,
    RiCalendarLine,
    RiChat3Line,
    RiHeartLine,
    RiUserLine,
    RiAlertLine,
    RiStickyNoteLine,
    RiCheckboxCircleLine,
} from "react-icons/ri";
import { format, formatDistanceToNow } from "date-fns";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { useGetJobApplicationsQuery } from "@/redux/apis/jobApi";
import type { IJobPost, TJobPostType } from "@/components/modules/user/job/job.types";

/* ── Config ─────────────────────────────────────────────── */
const TYPE_ICONS: Record<TJobPostType, React.ReactNode> = {
    OFFICIAL: <RiBriefcaseLine />,
    TUITION: <RiBookOpenLine />,
    PERSONAL: <RiToolsLine />,
};

const STATUS_BADGE: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-700 border border-amber-200",
    APPROVED: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    REJECTED: "bg-red-50 text-red-700 border border-red-200",
    CLOSED: "bg-surface-100 text-neutral-600 border border-surface-300",
};

function Avatar({ user, size = 32 }: { user: { name: string; imageUrl?: string }; size?: number }) {
    if (user.imageUrl) {
        return (
            <Image
                src={user.imageUrl}
                alt={user.name}
                width={size}
                height={size}
                className="rounded-full object-cover flex-shrink-0"
                style={{ width: size, height: size }}
            />
        );
    }
    return (
        <div
            className="rounded-full bg-primary2-100 flex items-center justify-center font-bold text-primary2-700 flex-shrink-0"
            style={{ width: size, height: size, fontSize: size * 0.38 }}
        >
            {user.name[0]}
        </div>
    );
}

interface JobDetailSheetProps {
    job: IJobPost | null;
    open: boolean;
    onClose: () => void;
    onUpdateStatus: () => void;
}

const JobDetailSheet = ({ job, open, onClose, onUpdateStatus }: JobDetailSheetProps) => {
    const { data: appsData } = useGetJobApplicationsQuery(job?._id ?? "", {
        skip: !job || job.type === "OFFICIAL",
    });
    const apps = appsData?.data ?? [];

    if (!job) return null;
    const isSeek = job.type !== "OFFICIAL";

    return (
        <Sheet open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
            <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-6">
                <SheetHeader className="mb-6 p-0">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl text-primary2-600 mt-1">{TYPE_ICONS[job.type]}</span>
                        <div className="min-w-0">
                            <SheetTitle className="text-primary2-900 text-lg font-bold leading-tight">
                                {job.title}
                            </SheetTitle>
                            <SheetDescription className="flex flex-wrap items-center gap-2 mt-1.5">
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_BADGE[job.status]}`}>
                                    {job.status}
                                </span>
                                <span className="text-xs text-muted-foreground">by {job.postedBy?.name}</span>
                                <span className="text-xs text-muted-foreground">
                                    · {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                                </span>
                            </SheetDescription>
                        </div>
                    </div>
                </SheetHeader>

                {/* Update Status */}
                <div className="mb-5">
                    <button
                        onClick={onUpdateStatus}
                        className="w-full py-2.5 bg-primary2-700 text-white font-semibold rounded-xl hover:bg-primary2-800 transition-colors text-sm flex items-center justify-center gap-2"
                    >
                        <RiCheckboxCircleLine /> Update Status
                    </button>
                </div>

                {/* Description */}
                <div className="mb-5 bg-surface-50 rounded-xl p-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Description</p>
                    <p className="text-sm text-neutral-700 leading-relaxed">{job.description}</p>
                </div>

                {/* Details */}
                <div className="mb-5 bg-white rounded-xl border border-surface-200 p-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Details</p>
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div>
                            <dt className="text-muted-foreground text-xs">Type</dt>
                            <dd className="font-medium text-primary2-900 capitalize">{job.type.replace("_", " ")}</dd>
                        </div>
                        {job.company && (
                            <div>
                                <dt className="text-muted-foreground text-xs">Company</dt>
                                <dd className="font-medium text-primary2-900">{job.company}</dd>
                            </div>
                        )}
                        {job.location && (
                            <div>
                                <dt className="text-muted-foreground text-xs">Location</dt>
                                <dd className="font-medium text-primary2-900 flex items-center gap-1">
                                    <RiMapPinLine />{job.location}
                                </dd>
                            </div>
                        )}
                        {job.seekLocation && (
                            <div>
                                <dt className="text-muted-foreground text-xs">Location</dt>
                                <dd className="font-medium text-primary2-900">{job.seekLocation}</dd>
                            </div>
                        )}
                        {job.studentClass && (
                            <div>
                                <dt className="text-muted-foreground text-xs">Class</dt>
                                <dd className="font-medium text-primary2-900">{job.studentClass}</dd>
                            </div>
                        )}
                        {job.serviceCategory && (
                            <div>
                                <dt className="text-muted-foreground text-xs">Category</dt>
                                <dd className="font-medium text-primary2-900 capitalize">{job.serviceCategory}</dd>
                            </div>
                        )}
                        {job.paymentAmount && (
                            <div>
                                <dt className="text-muted-foreground text-xs">Payment</dt>
                                <dd className="font-medium text-primary2-900">
                                    {job.paymentNegotiable ? "Negotiable" : `${job.paymentAmount} BDT/${job.paymentPer}`}
                                </dd>
                            </div>
                        )}
                        {job.applicationDeadline && (
                            <div>
                                <dt className="text-muted-foreground text-xs">Deadline</dt>
                                <dd className="font-medium text-primary2-900 flex items-center gap-1">
                                    <RiCalendarLine />
                                    {format(new Date(job.applicationDeadline), "dd MMM yyyy")}
                                </dd>
                            </div>
                        )}
                    </dl>
                </div>

                {/* Engagement */}
                <div className="mb-5 flex gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <RiHeartLine /> {job.likes.length} likes · {job.dislikes.length} dislikes
                    </span>
                    <span className="flex items-center gap-1">
                        <RiChat3Line /> {job.comments.length} comments
                    </span>
                </div>

                {/* Rejection Reason */}
                {job.status === "REJECTED" && job.rejectedReason && (
                    <div className="mb-5 bg-red-50 rounded-xl border border-red-200 p-4">
                        <p className="text-xs font-semibold text-red-700 uppercase tracking-wide mb-1 flex items-center gap-1">
                            <RiAlertLine /> Rejection Reason
                        </p>
                        <p className="text-sm text-red-700">{job.rejectedReason}</p>
                    </div>
                )}

                {/* Admin Notes */}
                {job.adminNotes?.length > 0 && (
                    <div className="mb-5 bg-blue-50 rounded-xl border border-blue-200 p-4">
                        <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-3 flex items-center gap-1">
                            <RiStickyNoteLine /> Admin Notes
                        </p>
                        <div className="space-y-3">
                            {job.adminNotes.map((n, i) => (
                                <div key={i} className="bg-white rounded-lg p-3 border border-blue-100">
                                    <p className="text-sm text-blue-800">{n.note}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-xs text-blue-600 font-medium">{n.addedBy?.name}</span>
                                        <span className="text-xs text-blue-400">
                                            · {format(new Date(n.addedAt), "dd MMM yyyy, HH:mm")}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Applicants */}
                {isSeek && (
                    <div className="mb-5">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                            <RiUserLine /> Applicants ({apps.length})
                        </p>
                        {apps.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">No applicants yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {apps.map((app) => (
                                    <div key={app._id} className="flex items-start gap-3 bg-white rounded-xl border border-surface-200 p-3">
                                        <Avatar user={app.applicant} size={36} />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="font-semibold text-primary2-900 text-sm">{app.applicant.name}</p>
                                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_BADGE[app.status] ?? ""}`}>
                                                    {app.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">{app.applicant.email}</p>
                                            {app.message && (
                                                <p className="text-xs text-neutral-600 mt-1">{app.message}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Posted By */}
                <div className="bg-white rounded-xl border border-surface-200 p-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Posted by</p>
                    <div className="flex items-center gap-3">
                        <Avatar user={job.postedBy} size={36} />
                        <div>
                            <p className="font-semibold text-primary2-900 text-sm">{job.postedBy.name}</p>
                            <p className="text-xs text-muted-foreground">{job.postedBy.email}</p>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default JobDetailSheet;
