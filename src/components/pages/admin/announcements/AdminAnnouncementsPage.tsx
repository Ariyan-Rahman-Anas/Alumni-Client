"use client";

import { useState } from "react";
import { RiAddLine } from "react-icons/ri";

import AdminPageHead from "@/components/shared/admin/AdminPageHead";
import PrimaryButton from "@/components/shared/PrimaryButton";
import AdminAnnouncementsTable from "@/components/modules/admin/announcements/AdminAnnouncementsTable";
import AdminAnnouncementFormModal from "@/components/modules/admin/announcements/AdminAnnouncementFormModal";

import { constantsData, TAnnouncementStatus } from "@/constants";
import { IAnnouncement } from "@/components/modules/user/announcements/announcement.types";

type StatusFilter = "ALL" | TAnnouncementStatus;

const STATUS_TABS: { label: string; value: StatusFilter }[] = [
    { label: "All", value: "ALL" },
    { label: "Published", value: constantsData.announcement.status.PUBLISHED },
    { label: "Draft", value: constantsData.announcement.status.DRAFT },
    { label: "Scheduled", value: constantsData.announcement.status.SCHEDULED },
    { label: "Archived", value: constantsData.announcement.status.ARCHIVED },
];

const AdminAnnouncementsPage = () => {
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
    const [formOpen, setFormOpen] = useState(false);
    const [editItem, setEditItem] = useState<IAnnouncement | null>(null);

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
                page={page}
                limit={constantsData.TABLE_PAGE_SIZE}
                status={statusFilter === "ALL" ? undefined : statusFilter}
                onPageChange={setPage}
                onEdit={(item) => {
                    setEditItem(item);
                    setFormOpen(true);
                }}
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
        </div>
    );
};
export default AdminAnnouncementsPage;