"use client";

import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import {
    RiMapPinLine,
    RiFileListLine,
    RiExternalLinkLine,
    RiCheckboxCircleLine,
    RiEyeLine,
    RiStickyNoteLine,
    RiShieldCheckLine,
} from "react-icons/ri";
import { format, formatDistanceToNow } from "date-fns";
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
import DataTable from "@/components/shared/dataTable/DataTable";
import type { TableColumn } from "@/types";
import {
    useAdminGetAllProvidersQuery,
    useAdminUpdateProviderStatusMutation,
} from "@/redux/apis/jobApi";
import { IServiceProvider } from "@/components/modules/user/job/job.types";

/* ── Config ─────────────────────────────────────────────── */
const STATUS_BADGE: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-700 border border-amber-200",
    APPROVED: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    REJECTED: "bg-red-50 text-red-700 border border-red-200",
};

function Avatar({ user, size = 32 }: { user: { name: string; imageUrl?: string }; size?: number }) {
    if (user.imageUrl) {
        return <Image src={user.imageUrl} alt={user.name} width={size} height={size} className="rounded-full object-cover flex-shrink-0" style={{ width: size, height: size }} />;
    }
    return (
        <div className="rounded-full bg-primary2-100 flex items-center justify-center font-bold text-primary2-700 flex-shrink-0" style={{ width: size, height: size, fontSize: size * 0.38 }}>
            {user.name[0]}
        </div>
    );
}

/* ── Status Dialog ──────────────────────────────────────── */
function ProviderStatusDialog({ provider, open, onClose, onSubmit, isLoading }: {
    provider: IServiceProvider | null; open: boolean; onClose: () => void;
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

/* ── Detail Sheet ───────────────────────────────────────── */
function ProviderDetailSheet({ provider, open, onClose, onUpdateStatus }: {
    provider: IServiceProvider | null; open: boolean; onClose: () => void; onUpdateStatus: () => void;
}) {
    if (!provider) return null;
    return (
        <Sheet open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
            <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto p-6">
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

                {(provider.subjects?.length || provider.classRange?.length) ? (
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
                ) : null}

                {provider.certificates?.length > 0 && (
                    <div className="mb-4 bg-white rounded-xl border border-surface-200 p-4">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Certificates</p>
                        <div className="space-y-2">
                            {provider.certificates.map((cert, i) => (
                                <a key={i} href={cert.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl border border-surface-200 hover:border-primary2-300 hover:bg-primary2-50 transition-colors group">
                                    <RiFileListLine className="text-primary2-600 text-lg flex-shrink-0" />
                                    <span className="text-sm text-neutral-700 font-medium group-hover:text-primary2-700 flex-1 truncate">{cert.name}</span>
                                    <RiExternalLinkLine className="text-muted-foreground text-sm flex-shrink-0" />
                                </a>
                            ))}
                        </div>
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
                                        <span className="text-xs text-blue-600 font-medium">{n.addedBy?.name}</span>
                                        <span className="text-xs text-blue-400">· {format(new Date(n.addedAt), "dd MMM yyyy, HH:mm")}</span>
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

/* ── Table Component ────────────────────────────────────── */
interface AdminProvidersTableProps {
    page: number;
    limit: number;
    onPageChange: (page: number) => void;
}

const AdminProvidersTable = ({ page, limit, onPageChange }: AdminProvidersTableProps) => {
    const [sheetProvider, setSheetProvider] = useState<IServiceProvider | null>(null);
    const [dialogProvider, setDialogProvider] = useState<IServiceProvider | null>(null);

    const { data, isLoading, isError } = useAdminGetAllProvidersQuery({ page, limit });
    const [updateProviderStatus, { isLoading: statusUpdating }] = useAdminUpdateProviderStatusMutation();

    const providers = data?.data ?? [];
    const meta = data?.meta;

    const handleStatusSubmit = async (newStatus: "APPROVED" | "REJECTED", adminNote: string) => {
        if (!dialogProvider) return;
        try {
            await updateProviderStatus({ id: dialogProvider._id, status: newStatus, adminNote }).unwrap();
            toast.success(`Provider ${newStatus}`);
            setDialogProvider(null);
            setSheetProvider(null);
        } catch {
            toast.error("Failed to update status");
        }
    };

    const columns: TableColumn<IServiceProvider>[] = [
        { key: "index", label: "#" },
        {
            key: "user",
            label: "Provider",
            render: (p) => (
                <div>
                    <p className="font-semibold text-primary2-900">{p.user?.name}</p>
                    <p className="text-xs text-muted-foreground">{p.user?.email}</p>
                </div>
            ),
        },
        {
            key: "providerType",
            label: "Type",
            render: (p) => <span className="text-xs text-muted-foreground capitalize">{p.providerType}</span>,
        },
        {
            key: "location",
            label: "Location",
            render: (p) => <span className="text-xs text-muted-foreground">{p.location}</span>,
        },
        {
            key: "status",
            label: "Status",
            render: (p) => (
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_BADGE[p.status]}`}>
                    {p.status}
                </span>
            ),
        },
        {
            key: "createdAt",
            label: "Registered",
            render: (p) => (
                <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(p.createdAt), { addSuffix: true })}
                </span>
            ),
        },
        {
            key: "actions",
            label: "Actions",
            align: "right",
            render: (p) => (
                <div className="flex items-center justify-end gap-2">
                    <button onClick={() => setSheetProvider(p)} title="View Details" className="p-2 text-muted-foreground hover:text-primary2-700 hover:bg-primary2-50 rounded-xl transition-colors">
                        <RiEyeLine />
                    </button>
                    <button onClick={() => setDialogProvider(p)} title="Update Status" className="p-2 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors">
                        <RiCheckboxCircleLine />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <>
            <DataTable
                data={providers}
                columns={columns}
                isLoading={isLoading}
                isError={isError}
                emptyMessage="No providers found."
                paginationOptions={{
                    count: meta?.total,
                    current_page: page,
                    num_pages: meta?.totalPage,
                }}
                pageSize={limit}
                onPageChange={onPageChange}
            />

            <ProviderDetailSheet
                provider={sheetProvider}
                open={!!sheetProvider}
                onClose={() => setSheetProvider(null)}
                onUpdateStatus={() => setDialogProvider(sheetProvider)}
            />
            <ProviderStatusDialog
                provider={dialogProvider}
                open={!!dialogProvider}
                onClose={() => setDialogProvider(null)}
                onSubmit={handleStatusSubmit}
                isLoading={statusUpdating}
            />
        </>
    );
};

export default AdminProvidersTable;
