"use client";

import { useState } from "react";
import { toast } from "sonner";
import { RiAddLine } from "react-icons/ri";

import AdminPageHead from "@/components/shared/admin/AdminPageHead";
import PrimaryButton from "@/components/shared/PrimaryButton";
import DeleteAlertModal from "@/components/shared/DeleteAlertModal";
import AdminAnnouncementsTable from "@/components/modules/admin/announcements/AdminAnnouncementsTable";
import AdminAnnouncementFormModal from "@/components/modules/admin/announcements/AdminAnnouncementFormModal";

import {
    useGetAllAnnouncementsAdminQuery,
    useDeleteAnnouncementMutation,
    useToggleAnnouncementPinMutation,
} from "@/redux/apis/announcementApi";
import { constantsData } from "@/constants";
import { IAnnouncement, TAnnouncementStatus } from "@/components/modules/user/announcements/announcement.types";
import { IServerErrorRes } from "@/types/common.components.types";

type StatusFilter = "ALL" | TAnnouncementStatus;

const STATUS_TABS: { label: string; value: StatusFilter }[] = [
    { label: "All", value: "ALL" },
    { label: "Published", value: "published" },
    { label: "Draft", value: "draft" },
    { label: "Scheduled", value: "scheduled" },
    { label: "Archived", value: "archived" },
];

const AdminAnnouncementsPage = () => {
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
    const [formOpen, setFormOpen] = useState(false);
    const [editItem, setEditItem] = useState<IAnnouncement | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const { data, isLoading, isError } = useGetAllAnnouncementsAdminQuery({
        page,
        limit: constantsData.TABLE_PAGE_SIZE,
        status: statusFilter === "ALL" ? undefined : statusFilter,
    });

    const [deleteAnnouncement, { isLoading: isDeleting }] = useDeleteAnnouncementMutation();
    const [togglePin, { isLoading: isTogglingPin }] = useToggleAnnouncementPinMutation();

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await deleteAnnouncement(deleteId).unwrap();
            toast.success("Announcement deleted");
            setDeleteId(null);
        } catch (err: unknown) {
            const error = err as IServerErrorRes;
            toast.error(error.data.message || "Failed to delete announcement");
        }
    };

    const handleTogglePin = async (id: string) => {
        try {
            const toggleRes = await togglePin(id).unwrap();
            toast.success(toggleRes.message);
        } catch (error: unknown) {
            const err = error as IServerErrorRes
            toast.error(err.data.message || "Failed to toggle pin");
        }
    };

    const meta = data?.meta;
    const paginationOptions = meta
        ? { count: meta.total, current_page: meta.page, num_pages: meta.totalPage }
        : undefined;

    return (
        <div className="admin-page-setup">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <AdminPageHead
                    title="Announcements"
                    description="Create and manage alumni announcements, notices, and updates."
                />
                <PrimaryButton
                    type="button"
                    title="New Announcement"
                    icon={<RiAddLine />}
                    iconSide="left"
                    onClick={() => {
                        setEditItem(null);
                        setFormOpen(true);
                    }}
                />
            </div>

            {/* Status Tabs */}
            <div className="flex items-center flex-wrap gap-1 mb-5 border-b border-surface-300">
                {STATUS_TABS.map(({ label, value }) => (
                    <button
                        key={value}
                        type="button"
                        onClick={() => {
                            setStatusFilter(value);
                            setPage(1);
                        }}
                        className={`relative px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors ${statusFilter === value
                            ? "text-primary2-700"
                            : "text-muted-foreground hover:text-gray-700"
                            }`}
                    >
                        {label}
                        {statusFilter === value && (
                            <span className="absolute inset-x-0 -bottom-px h-0.5 bg-primary2-500 rounded-full" />
                        )}
                    </button>
                ))}
            </div>

            {/* Table */}
            <AdminAnnouncementsTable
                data={data?.data ?? []}
                isLoading={isLoading}
                isError={isError}
                paginationOptions={paginationOptions}
                pageSize={constantsData.TABLE_PAGE_SIZE}
                onPageChange={setPage}
                onEdit={(item) => {
                    setEditItem(item);
                    setFormOpen(true);
                }}
                onDelete={setDeleteId}
                onTogglePin={handleTogglePin}
                isTogglingPin={isTogglingPin}
            />

            {/* Form Sheet */}
            <AdminAnnouncementFormModal
                open={formOpen}
                onClose={() => {
                    setFormOpen(false);
                    setEditItem(null);
                }}
                announcement={editItem}
            />

            {/* Delete Confirmation */}
            <DeleteAlertModal
                open={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
                title="Delete Announcement"
                description="This will permanently delete the announcement. This action cannot be undone."
            />
        </div>
    );
};

export default AdminAnnouncementsPage;
