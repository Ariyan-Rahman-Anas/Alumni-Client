"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
    RiAwardLine,
    RiCheckboxCircleLine,
    RiCloseCircleLine,
    RiDeleteBin6Line,
    RiMapPin2Line,
    RiTimeLine,
    RiUserStarLine,
} from "react-icons/ri";

import {
    useGetMyProviderProfileQuery,
    useDeleteProviderProfileMutation,
} from "@/redux/apis/jobApi";
import DeleteAlertModal from "@/components/shared/DeleteAlertModal";
import { IServiceProvider } from "../job/job.types";

/* ── Helpers ───────────────────────────────────────────── */
const STATUS_CONFIG: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
    PENDING: { label: "Pending Review", className: "bg-amber-50 text-amber-700 border border-amber-200", icon: <RiTimeLine /> },
    APPROVED: { label: "Approved", className: "bg-emerald-50 text-emerald-700 border border-emerald-200", icon: <RiCheckboxCircleLine /> },
    REJECTED: { label: "Rejected", className: "bg-red-50 text-red-700 border border-red-200", icon: <RiCloseCircleLine /> },
};

function ProviderAvatar({ provider }: { provider: IServiceProvider }) {
    const user = provider.user;
    if (user.imageUrl) {
        return (
            <Image
                src={user.imageUrl}
                alt={user.name}
                width={72}
                height={72}
                className="rounded-full object-cover"
            />
        );
    }
    return (
        <div className="w-[72px] h-[72px] rounded-full bg-primary2-100 flex items-center justify-center text-2xl font-bold text-primary2-700 select-none">
            {user.name?.[0]?.toUpperCase() ?? "?"}
        </div>
    );
}

function TagList({ items }: { items: string[] }) {
    return (
        <div className="flex flex-wrap gap-1.5">
            {items.map((item) => (
                <span key={item} className="px-2.5 py-1 rounded-full bg-surface-100 text-xs text-neutral-700 border border-surface-200">
                    {item}
                </span>
            ))}
        </div>
    );
}

/* ── Profile card ──────────────────────────────────────── */
function ProviderCard({ provider }: { provider: IServiceProvider }) {
    const status = STATUS_CONFIG[provider.status] ?? STATUS_CONFIG.PENDING;
    const rates = [
        provider.hourlyRate && `৳${provider.hourlyRate}/hr`,
        provider.monthlyRate && `৳${provider.monthlyRate}/mo`,
    ].filter(Boolean);

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-start gap-4">
                <ProviderAvatar provider={provider} />
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base text-primary2-900 truncate">{provider.user.name}</h3>
                    <p className="text-sm text-neutral-600 mt-0.5">{provider.providerType}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${status.className}`}>
                            {status.icon}
                            {status.label}
                        </span>
                        {!provider.isAvailable && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-100 text-neutral-500 border border-surface-200">
                                Unavailable
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Bio */}
            <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">About</p>
                <p className="text-sm text-neutral-700 leading-relaxed">{provider.bio}</p>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
                <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Experience</p>
                    <p className="font-medium text-neutral-800">{provider.experience}</p>
                </div>
                <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Location</p>
                    <p className="font-medium text-neutral-800 flex items-center gap-1">
                        <RiMapPin2Line className="text-primary2-500" />
                        {provider.location}
                    </p>
                </div>
                {rates.length > 0 && (
                    <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Rate</p>
                        <p className="font-medium text-neutral-800">{rates.join(" · ")}</p>
                    </div>
                )}
                {provider.gender && (
                    <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Gender</p>
                        <p className="font-medium text-neutral-800 capitalize">{provider.gender.toLowerCase()}</p>
                    </div>
                )}
            </div>

            {/* Tag lists */}
            {(provider.subjects?.length ?? 0) > 0 && (
                <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Subjects</p>
                    <TagList items={provider.subjects!} />
                </div>
            )}
            {(provider.qualifications?.length ?? 0) > 0 && (
                <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Qualifications</p>
                    <TagList items={provider.qualifications!} />
                </div>
            )}
            {(provider.availability?.length ?? 0) > 0 && (
                <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Availability</p>
                    <TagList items={provider.availability!} />
                </div>
            )}

            {/* Certificates */}
            {provider.certificates.length > 0 && (
                <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                        Certificates ({provider.certificates.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {provider.certificates.map((cert) => (
                            <a
                                key={cert.publicId}
                                href={cert.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-100 border border-surface-200 text-xs text-primary2-700 hover:bg-primary2-50 hover:border-primary2-200 transition-colors"
                            >
                                <RiAwardLine className="text-sm" />
                                {cert.name}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

/* ── Main component ────────────────────────────────────── */
export default function MyProviderProfilePanel() {
    const { data, isLoading } = useGetMyProviderProfileQuery();
    const [deleteProvider, { isLoading: isDeleting }] = useDeleteProviderProfileMutation();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const provider = data?.data ?? null;

    const handleDelete = async () => {
        if (!provider) return;
        try {
            await deleteProvider(provider._id).unwrap();
            toast.success("Provider profile deleted successfully.");
            setShowDeleteModal(false);
        } catch {
            toast.error("Failed to delete provider profile. Please try again.");
        }
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl border border-surface-200 p-6 animate-pulse space-y-4">
                <div className="flex gap-4">
                    <div className="w-[72px] h-[72px] rounded-full bg-surface-200 flex-shrink-0" />
                    <div className="flex-1 space-y-2 pt-1">
                        <div className="h-4 w-40 bg-surface-200 rounded" />
                        <div className="h-3 w-24 bg-surface-200 rounded" />
                        <div className="h-5 w-28 bg-surface-200 rounded-full mt-2" />
                    </div>
                </div>
                <div className="h-3 w-full bg-surface-200 rounded" />
                <div className="h-3 w-4/5 bg-surface-200 rounded" />
            </div>
        );
    }

    if (!provider) {
        return (
            <div className="bg-white rounded-2xl border border-surface-200 p-12 text-center">
                <RiUserStarLine className="text-4xl text-surface-300 mx-auto mb-3" />
                <p className="font-medium text-primary2-900">No provider profile yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                    Register as a service provider from the Jobs page.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white rounded-2xl border border-surface-200 p-6">
                <div className="flex items-center gap-2 mb-5">
                    <RiUserStarLine className="text-xl text-primary2-700" />
                    <h2 className="text-lg font-bold text-primary2-900">My Provider Profile</h2>
                </div>

                <ProviderCard provider={provider} />

                {/* Danger zone */}
                <div className="mt-8 pt-5 border-t border-red-100">
                    <p className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-3">Danger Zone</p>
                    <div className="flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                        <div>
                            <p className="text-sm font-medium text-red-800">Delete Provider Profile</p>
                            <p className="text-xs text-red-600 mt-0.5">
                                This permanently removes your profile and all contact requests.
                            </p>
                        </div>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
                        >
                            <RiDeleteBin6Line />
                            Delete
                        </button>
                    </div>
                </div>
            </div>

            <DeleteAlertModal
                open={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
                title="Delete provider profile?"
                description="This will permanently delete your provider profile and all contact requests from seekers. This cannot be undone."
            />
        </>
    );
}
