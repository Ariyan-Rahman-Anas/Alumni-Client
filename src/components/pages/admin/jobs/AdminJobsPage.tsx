"use client";

import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import {
    RiBriefcaseLine,
    RiCheckboxCircleLine,
    RiEyeLine,
    RiBookOpenLine,
    RiToolsLine,
    RiMapPinLine,
    RiCalendarLine,
    RiChat3Line,
    RiHeartLine,
    RiUserLine,
    RiAlertLine,
    RiShieldCheckLine,
    RiStickyNoteLine,
} from "react-icons/ri";
import { format, formatDistanceToNow } from "date-fns";
import AdminPageHead from "@/components/shared/admin/AdminPageHead";
import {
    useAdminGetAllJobsQuery,
    useAdminUpdateJobStatusMutation,
    useAdminGetAllProvidersQuery,
    useAdminUpdateProviderStatusMutation,
    useGetJobApplicationsQuery,
    type JobPost,
    type ServiceProvider,
    type JobPostStatus,
    type JobPostType,
} from "@/redux/apis/jobApi";
import { constantsData } from "@/constants";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

/* â”€â”€ Config â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const TYPE_ICONS: Record<JobPostType, React.ReactNode> = {
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

type TabKey = "posts" | "providers";
const TABS: { key: TabKey; label: string }[] = [
    { key: "posts", label: "Job Posts" },
    { key: "providers", label: "Service Providers" },
];

type StatusFilterType = "all" | JobPostStatus;
const STATUS_FILTERS: { label: string; value: StatusFilterType }[] = [
    { label: "All", value: "all" },
    { label: "Pending", value: "PENDING" },
    { label: "Approved", value: "APPROVED" },
    { label: "Rejected", value: "REJECTED" },
    { label: "Closed", value: "CLOSED" },
];

/* â”€â”€ Avatar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function Avatar({ user, size = 32 }: { user: { name: string; imageUrl?: string }; size?: number }) {
    if (user.imageUrl) {
        return <Image src={user.imageUrl} alt={user.name} width={size} height={size} className="rounded-full object-cover flex-shrink-0" style={{ width: size, height: size }} />;
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

/* â”€â”€ Job Status Dialog â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function JobStatusDialog({
    job, open, onClose, onSubmit, isLoading,
}: {
    job: JobPost | null; open: boolean; onClose: () => void;
    onSubmit: (status: "APPROVED" | "REJECTED" | "CLOSED", adminNote: string, rejectedReason?: string) => void;
    isLoading: boolean;
}) {
    const [status, setStatus] = useState<"APPROVED" | "REJECTED" | "CLOSED">("APPROVED");
    const [adminNote, setAdminNote] = useState("");
    const [rejectedReason, setRejectedReason] = useState("");
    if (!job) return null;
    return (
        <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Update Job Status</DialogTitle>
                    <DialogDescription className="line-clamp-1">{job.title}</DialogDescription>
                </DialogHeader>
                <div className="flex gap-2 my-2">
                    {(["APPROVED", "REJECTED", "CLOSED"] as const).map((s) => (
                        <button key={s} onClick={() => setStatus(s)} className={`flex-1 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${status === s ? "bg-primary2-700 text-white" : "bg-surface-100 text-neutral-600 hover:bg-surface-200"}`}>{s}</button>
                    ))}
                </div>
                <div className="space-y-3">
                    <div>
                        <textarea value={adminNote} onChange={(e) => setAdminNote(e.target.value)} placeholder="Admin note (required)..." rows={2} className="w-full px-4 py-2.5 rounded-xl border border-surface-200 bg-surface-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary2-300 resize-none" />
                        {!adminNote.trim() && <p className="text-xs text-red-500 mt-1">Note is required</p>}
                    </div>
                    {status === "REJECTED" && (
                        <div>
                            <textarea value={rejectedReason} onChange={(e) => setRejectedReason(e.target.value)} placeholder="Rejection reason (shown to poster)..." rows={2} className="w-full px-4 py-2.5 rounded-xl border border-surface-200 bg-surface-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary2-300 resize-none" />
                            {!rejectedReason.trim() && <p className="text-xs text-red-500 mt-1">Rejection reason is required</p>}
                        </div>
                    )}
                </div>
                <DialogFooter className="gap-2 sm:gap-2">
                    <button onClick={onClose} className="flex-1 py-2.5 border border-surface-200 rounded-xl text-sm text-neutral-700 hover:border-surface-300 transition-colors">Cancel</button>
                    <button onClick={() => { const r = rejectedReason.trim() || undefined; onSubmit(status, adminNote.trim(), r); }} disabled={isLoading || !adminNote.trim() || (status === "REJECTED" && !rejectedReason.trim())} className="flex-1 py-2.5 bg-primary2-700 text-white font-semibold rounded-xl hover:bg-primary2-800 disabled:opacity-50 transition-colors text-sm">{isLoading ? "Saving..." : "Confirm"}</button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

/* â”€â”€ Provider Status Dialog â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function ProviderStatusDialog({
    provider, open, onClose, onSubmit, isLoading,
}: {
    provider: ServiceProvider | null; open: boolean; onClose: () => void;
    onSubmit: (status: "APPROVED" | "REJECTED", adminNote: string) => void;
    isLoading: boolean;
}) {
    const [status, setStatus] = useState<"APPROVED" | "REJECTED">("APPROVED");
    const [adminNote, setAdminNote] = useState("");
    if (!provider) return null;
    return (
        <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Update Provider Status</DialogTitle>
                    <DialogDescription>{provider.user.name} · {provider.providerType}</DialogDescription>
                </DialogHeader>
                <div className="flex gap-2 my-2">
                    {(["APPROVED", "REJECTED"] as const).map((s) => (
                        <button key={s} onClick={() => setStatus(s)} className={`flex-1 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${status === s ? "bg-primary2-700 text-white" : "bg-surface-100 text-neutral-600 hover:bg-surface-200"}`}>{s}</button>
                    ))}
                </div>
                <div>
                    <textarea value={adminNote} onChange={(e) => setAdminNote(e.target.value)} placeholder="Admin note (required)..." rows={2} className="w-full px-4 py-2.5 rounded-xl border border-surface-200 bg-surface-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary2-300 resize-none" />
                    {!adminNote.trim() && <p className="text-xs text-red-500 mt-1">Note is required</p>}
                </div>
                <DialogFooter className="gap-2 sm:gap-2">
                    <button onClick={onClose} className="flex-1 py-2.5 border border-surface-200 rounded-xl text-sm text-neutral-700 hover:border-surface-300 transition-colors">Cancel</button>
                    <button onClick={() => onSubmit(status, adminNote.trim())} disabled={isLoading || !adminNote.trim()} className="flex-1 py-2.5 bg-primary2-700 text-white font-semibold rounded-xl hover:bg-primary2-800 disabled:opacity-50 transition-colors text-sm">{isLoading ? "Saving…" : "Confirm"}</button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

/* â”€â”€ Job Detail Sheet â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function JobDetailSheet({ job, open, onClose, onUpdateStatus }: {
    job: JobPost | null; open: boolean; onClose: () => void; onUpdateStatus: () => void;
}) {
    const { data: appsData } = useGetJobApplicationsQuery(job?._id ?? "", { skip: !job || job.type === "OFFICIAL" });
    const apps = appsData?.data ?? [];
    if (!job) return null;
    const isSeek = job.type !== "OFFICIAL";
    return (
        <Sheet open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
            <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
                <SheetHeader className="mb-6">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl text-primary2-600 mt-1">{TYPE_ICONS[job.type]}</span>
                        <div className="min-w-0">
                            <SheetTitle className="text-primary2-900 text-lg font-bold leading-tight">{job.title}</SheetTitle>
                            <SheetDescription className="flex flex-wrap items-center gap-2 mt-1.5">
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_BADGE[job.status]}`}>{job.status}</span>
                                <span className="text-xs text-muted-foreground">by {job.postedBy?.name}</span>
                                <span className="text-xs text-muted-foreground">Â· {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
                            </SheetDescription>
                        </div>
                    </div>
                </SheetHeader>

                <div className="mb-5">
                    <button onClick={onUpdateStatus} className="w-full py-2.5 bg-primary2-700 text-white font-semibold rounded-xl hover:bg-primary2-800 transition-colors text-sm flex items-center justify-center gap-2">
                        <RiCheckboxCircleLine /> Update Status
                    </button>
                </div>

                <div className="mb-5 bg-surface-50 rounded-xl p-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Description</p>
                    <p className="text-sm text-neutral-700 leading-relaxed">{job.description}</p>
                </div>

                <div className="mb-5 bg-white rounded-xl border border-surface-200 p-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Details</p>
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div><dt className="text-muted-foreground text-xs">Type</dt><dd className="font-medium text-primary2-900 capitalize">{job.type.replace("_", " ")}</dd></div>
                        {job.company && <div><dt className="text-muted-foreground text-xs">Company</dt><dd className="font-medium text-primary2-900">{job.company}</dd></div>}
                        {job.jobTitle && <div><dt className="text-muted-foreground text-xs">Job Title</dt><dd className="font-medium text-primary2-900">{job.jobTitle}</dd></div>}
                        {job.location && <div><dt className="text-muted-foreground text-xs">Location</dt><dd className="font-medium text-primary2-900 flex items-center gap-1"><RiMapPinLine />{job.location}</dd></div>}
                        {job.seekLocation && <div><dt className="text-muted-foreground text-xs">Location</dt><dd className="font-medium text-primary2-900">{job.seekLocation}</dd></div>}
                        {job.studentClass && <div><dt className="text-muted-foreground text-xs">Class</dt><dd className="font-medium text-primary2-900">{job.studentClass}</dd></div>}
                        {job.serviceCategory && <div><dt className="text-muted-foreground text-xs">Category</dt><dd className="font-medium text-primary2-900 capitalize">{job.serviceCategory}</dd></div>}
                        {job.paymentAmount && <div><dt className="text-muted-foreground text-xs">Payment</dt><dd className="font-medium text-primary2-900">{job.paymentNegotiable ? "Negotiable" : `${job.paymentAmount} BDT/${job.paymentPer}`}</dd></div>}
                        {job.applicationDeadline && <div><dt className="text-muted-foreground text-xs">Deadline</dt><dd className="font-medium text-primary2-900 flex items-center gap-1"><RiCalendarLine />{format(new Date(job.applicationDeadline), "dd MMM yyyy")}</dd></div>}
                        {job.approvedAt && <div><dt className="text-muted-foreground text-xs">Approved</dt><dd className="font-medium text-primary2-900">{format(new Date(job.approvedAt), "dd MMM yyyy")}</dd></div>}
                    </dl>
                </div>

                <div className="mb-5 flex gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><RiHeartLine /> {job.likes.length} likes Â· {job.dislikes.length} dislikes</span>
                    <span className="flex items-center gap-1"><RiChat3Line /> {job.comments.length} comments</span>
                </div>

                {job.status === "REJECTED" && job.rejectedReason && (
                    <div className="mb-5 bg-red-50 rounded-xl border border-red-200 p-4">
                        <p className="text-xs font-semibold text-red-700 uppercase tracking-wide mb-1 flex items-center gap-1"><RiAlertLine /> Rejection Reason</p>
                        <p className="text-sm text-red-700">{job.rejectedReason}</p>
                    </div>
                )}

                {job.adminNotes?.length > 0 && (
                    <div className="mb-5 bg-blue-50 rounded-xl border border-blue-200 p-4">
                        <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-3 flex items-center gap-1"><RiStickyNoteLine /> Admin Notes History</p>
                        <div className="space-y-3">
                            {job.adminNotes.map((n, i) => (
                                <div key={i} className="bg-white rounded-lg p-3 border border-blue-100">
                                    <p className="text-sm text-blue-800">{n.note}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        {n.addedBy?.imageUrl ? (
                                            <Image src={n.addedBy.imageUrl} alt={n.addedBy.name} width={18} height={18} className="rounded-full object-cover flex-shrink-0" />
                                        ) : (
                                            <span className="w-4.5 h-4.5 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0">{n.addedBy?.name?.[0]}</span>
                                        )}
                                        <span className="text-xs text-blue-600 font-medium">{n.addedBy?.name}</span>
                                        <span className="text-xs text-blue-400">&middot; {format(new Date(n.addedAt), "dd MMM yyyy, HH:mm")}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {isSeek && (
                    <div className="mb-5">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2"><RiUserLine /> Applicants ({apps.length})</p>
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
                                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_BADGE[app.status] ?? ""}`}>{app.status}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">{app.applicant.email}</p>
                                            {app.message && <p className="text-xs text-neutral-600 mt-1">{app.message}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

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
}

/* â”€â”€ Provider Detail Sheet â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function ProviderDetailSheet({ provider, open, onClose, onUpdateStatus }: {
    provider: ServiceProvider | null; open: boolean; onClose: () => void; onUpdateStatus: () => void;
}) {
    if (!provider) return null;
    return (
        <Sheet open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
            <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
                <SheetHeader className="mb-5">
                    <div className="flex gap-4 items-start">
                        {provider.user.imageUrl ? (
                            <Image src={provider.user.imageUrl} alt={provider.user.name} width={56} height={56} className="rounded-2xl object-cover flex-shrink-0" />
                        ) : (
                            <div className="w-14 h-14 rounded-2xl bg-primary2-100 flex items-center justify-center text-xl font-bold text-primary2-700 flex-shrink-0">{provider.user.name[0]}</div>
                        )}
                        <div className="min-w-0">
                            <SheetTitle className="text-primary2-900 font-bold">{provider.user.name}</SheetTitle>
                            <SheetDescription className="flex flex-wrap gap-2 mt-1.5">
                                <span className="capitalize bg-primary2-50 text-primary2-700 border border-primary2-200 text-xs font-semibold px-2.5 py-1 rounded-full">{provider.providerType}</span>
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_BADGE[provider.status]}`}>{provider.status}</span>
                            </SheetDescription>
                        </div>
                    </div>
                </SheetHeader>

                <div className="mb-5">
                    <button onClick={onUpdateStatus} className="w-full py-2.5 bg-primary2-700 text-white font-semibold rounded-xl hover:bg-primary2-800 transition-colors text-sm flex items-center justify-center gap-2">
                        <RiCheckboxCircleLine /> Update Status
                    </button>
                </div>

                <div className="mb-4 bg-surface-50 rounded-xl p-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">About</p>
                    <p className="text-sm text-neutral-700 leading-relaxed">{provider.bio}</p>
                </div>

                <div className="mb-4 bg-white rounded-xl border border-surface-200 p-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Details</p>
                    <dl className="space-y-2 text-sm">
                        <div className="flex justify-between"><dt className="text-muted-foreground">Location</dt><dd className="font-medium text-primary2-900 flex items-center gap-1"><RiMapPinLine />{provider.location}</dd></div>
                        <div className="flex justify-between"><dt className="text-muted-foreground">Experience</dt><dd className="font-medium text-primary2-900">{provider.experience}</dd></div>
                        <div className="flex justify-between"><dt className="text-muted-foreground">Gender</dt><dd className="font-medium text-primary2-900 capitalize">{provider.gender}</dd></div>
                        {provider.hourlyRate && <div className="flex justify-between"><dt className="text-muted-foreground">Hourly Rate</dt><dd className="font-medium text-primary2-900">{provider.hourlyRate} BDT/hr</dd></div>}
                        {provider.monthlyRate && <div className="flex justify-between"><dt className="text-muted-foreground">Monthly Rate</dt><dd className="font-medium text-primary2-900">{provider.monthlyRate} BDT/mo</dd></div>}
                        <div className="flex justify-between"><dt className="text-muted-foreground">Registered</dt><dd className="font-medium text-primary2-900">{format(new Date(provider.createdAt), "dd MMM yyyy")}</dd></div>
                    </dl>
                </div>

                {(provider.subjects?.length || provider.classRange?.length) && (
                    <div className="mb-4 bg-white rounded-xl border border-surface-200 p-4">
                        {provider.subjects?.length ? (
                            <><p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Subjects</p>
                                <div className="flex flex-wrap gap-2 mb-3">{provider.subjects.map((s) => <span key={s} className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs px-2.5 py-1 rounded-full">{s}</span>)}</div></>
                        ) : null}
                        {provider.classRange?.length ? (
                            <><p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Class Range</p>
                                <div className="flex flex-wrap gap-2">{provider.classRange.map((c) => <span key={c} className="bg-blue-50 text-blue-700 border border-blue-100 text-xs px-2.5 py-1 rounded-full">{c}</span>)}</div></>
                        ) : null}
                    </div>
                )}

                {provider.adminNotes?.length > 0 && (
                    <div className="mb-4 bg-blue-50 rounded-xl border border-blue-200 p-4">
                        <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-3 flex items-center gap-1"><RiStickyNoteLine /> Admin Notes</p>
                        <div className="space-y-3">
                            {provider.adminNotes.map((n, i) => (
                                <div key={i} className="bg-white rounded-lg p-3 border border-blue-100">
                                    <p className="text-sm text-blue-800">{n.note}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        {n.addedBy?.imageUrl ? (
                                            <Image src={n.addedBy.imageUrl} alt={n.addedBy.name} width={18} height={18} className="rounded-full object-cover flex-shrink-0" />
                                        ) : (
                                            <span className="w-4.5 h-4.5 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0">{n.addedBy?.name?.[0]}</span>
                                        )}
                                        <span className="text-xs text-blue-600 font-medium">{n.addedBy?.name}</span>
                                        <span className="text-xs text-blue-400">&middot; {format(new Date(n.addedAt), "dd MMM yyyy, HH:mm")}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-xl border border-surface-200 p-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Contact</p>
                    <div className="flex items-center gap-3">
                        <Avatar user={provider.user} size={36} />
                        <div>
                            <p className="font-semibold text-primary2-900 text-sm">{provider.user.name}</p>
                            <p className="text-xs text-muted-foreground">{provider.user.email}</p>
                            {provider.status === "APPROVED" && <span className="inline-flex items-center gap-1 text-xs text-emerald-700 mt-1"><RiShieldCheckLine /> Verified Provider</span>}
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   MAIN COMPONENT
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
export default function AdminJobsPage() {
    const [tab, setTab] = useState<TabKey>("posts");
    const [page, setPage] = useState(1);
    const [providerPage, setProviderPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<StatusFilterType>("all");
    const [sheetJob, setSheetJob] = useState<JobPost | null>(null);
    const [sheetProvider, setSheetProvider] = useState<ServiceProvider | null>(null);
    const [dialogJob, setDialogJob] = useState<JobPost | null>(null);
    const [dialogProvider, setDialogProvider] = useState<ServiceProvider | null>(null);

    const { data: jobsData, isLoading: jobsLoading } = useAdminGetAllJobsQuery({
        page, limit: constantsData.TABLE_PAGE_SIZE, status: statusFilter === "all" ? undefined : statusFilter,
    });
    const { data: providersData, isLoading: providersLoading } = useAdminGetAllProvidersQuery(
        { page: providerPage, limit: constantsData.TABLE_PAGE_SIZE }, { skip: tab !== "providers" },
    );
    const [updateJobStatus, { isLoading: statusUpdating }] = useAdminUpdateJobStatusMutation();
    const [updateProviderStatus, { isLoading: providerStatusUpdating }] = useAdminUpdateProviderStatusMutation();

    const handleJobStatusSubmit = async (status: "APPROVED" | "REJECTED" | "CLOSED", adminNote: string, rejectedReason?: string) => {
        if (!dialogJob) return;
        try {
            await updateJobStatus({ id: dialogJob._id, status, adminNote, rejectedReason }).unwrap();
            toast.success(`Job ${status}`);
            setDialogJob(null);
            setSheetJob(null);
        } catch { toast.error("Failed to update status"); }
    };

    const handleProviderStatusSubmit = async (status: "APPROVED" | "REJECTED", adminNote: string) => {
        if (!dialogProvider) return;
        try {
            await updateProviderStatus({ id: dialogProvider._id, status, adminNote }).unwrap();
            toast.success(`Provider ${status}`);
            setDialogProvider(null);
            setSheetProvider(null);
        } catch { toast.error("Failed to update status"); }
    };

    const jobs = jobsData?.data ?? [];
    const providers = providersData?.data ?? [];
    const meta = jobsData?.meta;
    const providerMeta = providersData?.meta;

    return (
        <div className="admin-page-setup">
            <div className="flex items-start justify-between mb-6">
                <AdminPageHead title="Job Board" description="Manage job posts, service providers, and applications." />
            </div>

            <div className="flex gap-2 mb-6">
                {TABS.map((t) => (
                    <button key={t.key} onClick={() => setTab(t.key)}
                        className={`px-5 py-2 rounded-xl text-sm font-medium transition-colors ${tab === t.key ? "bg-primary2-700 text-white" : "bg-surface-100 text-neutral-600 hover:bg-surface-200"}`}
                    >{t.label}</button>
                ))}
            </div>

            {tab === "posts" && (
                <>
                    <div className="flex flex-wrap gap-2 mb-5">
                        {STATUS_FILTERS.map((f) => (
                            <button key={f.value} onClick={() => { setStatusFilter(f.value); setPage(1); }}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${statusFilter === f.value ? "bg-primary2-900 text-white" : "bg-surface-100 text-neutral-600 hover:bg-surface-200"}`}
                            >{f.label}</button>
                        ))}
                    </div>

                    <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-surface-50 border-b border-surface-200">
                                <tr>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Title / Author</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Type</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Posted</th>
                                    <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-100">
                                {jobsLoading ? Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-5 py-4"><div className="h-4 w-48 bg-surface-200 rounded" /></td>
                                        <td className="px-4 py-4"><div className="h-4 w-20 bg-surface-200 rounded" /></td>
                                        <td className="px-4 py-4"><div className="h-4 w-16 bg-surface-200 rounded" /></td>
                                        <td className="px-4 py-4"><div className="h-4 w-24 bg-surface-200 rounded" /></td>
                                        <td className="px-5 py-4"><div className="h-4 w-16 bg-surface-200 rounded ml-auto" /></td>
                                    </tr>
                                )) : jobs.length === 0 ? (
                                    <tr><td colSpan={5} className="text-center py-16 text-muted-foreground">No jobs found.</td></tr>
                                ) : jobs.map((job) => (
                                    <tr key={job._id} className="hover:bg-surface-50 transition-colors">
                                        <td className="px-5 py-4">
                                            <p className="font-semibold text-primary2-900 line-clamp-1">{job.title}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">{job.postedBy?.name}</p>
                                        </td>
                                        <td className="px-4 py-4"><span className="inline-flex items-center gap-1 text-xs text-muted-foreground capitalize">{TYPE_ICONS[job.type]} {job.type.replace("_", " ")}</span></td>
                                        <td className="px-4 py-4"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_BADGE[job.status]}`}>{job.status}</span></td>
                                        <td className="px-4 py-4 text-xs text-muted-foreground">{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => setSheetJob(job)} title="View Details" className="p-2 text-muted-foreground hover:text-primary2-700 hover:bg-primary2-50 rounded-xl transition-colors"><RiEyeLine /></button>
                                                <button onClick={() => setDialogJob(job)} title="Update Status" className="p-2 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"><RiCheckboxCircleLine /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {meta && meta.totalPage > 1 && (
                            <div className="flex items-center justify-between px-5 py-4 border-t border-surface-100">
                                <p className="text-xs text-muted-foreground">Showing {((page - 1) * constantsData.TABLE_PAGE_SIZE) + 1}â€“{Math.min(page * constantsData.TABLE_PAGE_SIZE, meta.total)} of {meta.total}</p>
                                <div className="flex gap-2">
                                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 text-xs border border-surface-200 text-primary2-700 rounded-lg disabled:opacity-40 hover:border-primary2-300 transition-colors">Prev</button>
                                    <button onClick={() => setPage((p) => Math.min(meta.totalPage, p + 1))} disabled={page === meta.totalPage} className="px-3 py-1.5 text-xs border border-surface-200 text-primary2-700 rounded-lg disabled:opacity-40 hover:border-primary2-300 transition-colors">Next</button>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}

            {tab === "providers" && (
                <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-surface-50 border-b border-surface-200">
                            <tr>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Provider</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Type</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Location</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                                <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-100">
                            {providersLoading ? Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="px-5 py-4"><div className="h-4 w-36 bg-surface-200 rounded" /></td>
                                    <td className="px-4 py-4"><div className="h-4 w-20 bg-surface-200 rounded" /></td>
                                    <td className="px-4 py-4"><div className="h-4 w-24 bg-surface-200 rounded" /></td>
                                    <td className="px-4 py-4"><div className="h-4 w-16 bg-surface-200 rounded" /></td>
                                    <td className="px-5 py-4"><div className="h-4 w-16 bg-surface-200 rounded ml-auto" /></td>
                                </tr>
                            )) : providers.length === 0 ? (
                                <tr><td colSpan={5} className="text-center py-16 text-muted-foreground">No providers found.</td></tr>
                            ) : providers.map((p) => (
                                <tr key={p._id} className="hover:bg-surface-50 transition-colors">
                                    <td className="px-5 py-4">
                                        <p className="font-semibold text-primary2-900">{p.user?.name}</p>
                                        <p className="text-xs text-muted-foreground">{p.user?.email}</p>
                                    </td>
                                    <td className="px-4 py-4 text-xs text-muted-foreground capitalize">{p.providerType}</td>
                                    <td className="px-4 py-4 text-xs text-muted-foreground">{p.location}</td>
                                    <td className="px-4 py-4"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_BADGE[p.status]}`}>{p.status}</span></td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => setSheetProvider(p)} title="View Details" className="p-2 text-muted-foreground hover:text-primary2-700 hover:bg-primary2-50 rounded-xl transition-colors"><RiEyeLine /></button>
                                            <button onClick={() => setDialogProvider(p)} title="Update Status" className="p-2 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"><RiCheckboxCircleLine /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {providerMeta && providerMeta.totalPage > 1 && (
                        <div className="flex items-center justify-between px-5 py-4 border-t border-surface-100">
                            <p className="text-xs text-muted-foreground">Total: {providerMeta.total}</p>
                            <div className="flex gap-2">
                                <button onClick={() => setProviderPage((p) => Math.max(1, p - 1))} disabled={providerPage === 1} className="px-3 py-1.5 text-xs border border-surface-200 text-primary2-700 rounded-lg disabled:opacity-40 hover:border-primary2-300 transition-colors">Prev</button>
                                <button onClick={() => setProviderPage((p) => Math.min(providerMeta.totalPage, p + 1))} disabled={providerPage === providerMeta.totalPage} className="px-3 py-1.5 text-xs border border-surface-200 text-primary2-700 rounded-lg disabled:opacity-40 hover:border-primary2-300 transition-colors">Next</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <JobDetailSheet job={sheetJob} open={!!sheetJob} onClose={() => setSheetJob(null)} onUpdateStatus={() => setDialogJob(sheetJob)} />
            <ProviderDetailSheet provider={sheetProvider} open={!!sheetProvider} onClose={() => setSheetProvider(null)} onUpdateStatus={() => setDialogProvider(sheetProvider)} />
            <JobStatusDialog job={dialogJob} open={!!dialogJob} onClose={() => setDialogJob(null)} onSubmit={handleJobStatusSubmit} isLoading={statusUpdating} />
            <ProviderStatusDialog provider={dialogProvider} open={!!dialogProvider} onClose={() => setDialogProvider(null)} onSubmit={handleProviderStatusSubmit} isLoading={providerStatusUpdating} />
        </div>
    );
}

