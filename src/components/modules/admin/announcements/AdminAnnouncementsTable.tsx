"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
    RiDeleteBinLine,
    RiEditLine,
    RiPushpin2Line,
    RiPushpinLine,
    RiEyeLine,
} from "react-icons/ri";

import DataTable from "@/components/shared/dataTable/DataTable";
import DeleteAlertModal from "@/components/shared/DeleteAlertModal";
import { IAnnouncement } from "../../user/announcements/announcement.types";
import { TAnnouncementPriority, TAnnouncementStatus } from "@/constants";
import {
    useGetAllAnnouncementsAdminQuery,
    useDeleteAnnouncementMutation,
    useToggleAnnouncementPinMutation,
} from "@/redux/apis/announcementApi";
import type { TableColumn } from "@/types";

/* ── Badge helpers  */
const STATUS_COLORS: Record<TAnnouncementStatus, string> = {
    DRAFT: "bg-gray-100 text-gray-600 border-gray-200",
    PUBLISHED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    SCHEDULED: "bg-blue-50 text-blue-700 border-blue-200",
    ARCHIVED: "bg-orange-50 text-orange-700 border-orange-200",
};

const PRIORITY_COLORS: Record<TAnnouncementPriority, string> = {
    URGENT: "bg-red-50 text-red-700 border-red-200",
    HIGH: "bg-amber-50 text-amber-700 border-amber-200",
    NORMAL: "bg-surface-100 text-gray-600 border-surface-200",
};

interface AdminAnnouncementsTableProps {
    page: number;
    limit: number;
    status?: TAnnouncementStatus;
    onPageChange: (page: number) => void;
    onEdit: (item: IAnnouncement) => void;
    emptyMessage?: string;
}

const AdminAnnouncementsTable = ({
    page,
    limit,
    status,
    onPageChange,
    onEdit,
    emptyMessage = "No announcements found.",
}: AdminAnnouncementsTableProps) => {
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const { data, isLoading, isError } = useGetAllAnnouncementsAdminQuery({
        page,
        limit,
        status,
    });

    const [deleteAnnouncement, { isLoading: isDeleting }] = useDeleteAnnouncementMutation();
    const [togglePin, { isLoading: isTogglingPin }] = useToggleAnnouncementPinMutation();

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            const res = await deleteAnnouncement(deleteId).unwrap();
            toast.success(res.message || "Announcement deleted");
            setDeleteId(null);
        } catch { }
    };

    const handleTogglePin = async (id: string) => {
        try {
            const res = await togglePin(id).unwrap();
            toast.success(res.message);
        } catch { }
    };

    const columns: TableColumn<IAnnouncement>[] = [
        {
            key: "index",
            label: "#",
        },
        {
            key: "title",
            label: "Title",
            render: (item) => (
                <div className="max-w-[22rem] mx-auto overflow-auto ">
                    <span>{item.title}</span>
                </div>
            ),
        },
        {
            key: "type",
            label: "Type",
            render: (item) => (
                <Badge variant="outline" className="capitalize text-xs">
                    {item.type.toLowerCase()}
                </Badge>
            ),
        },
        {
            key: "priority",
            label: "Priority",
            render: (item) => (
                <Badge variant="outline" className={`capitalize text-xs ${PRIORITY_COLORS[item.priority]}`}>
                    {item.priority.toLowerCase()}
                </Badge>
            ),
        },
        {
            key: "status",
            label: "Status",
            render: (item) => (
                <Badge variant="outline" className={`capitalize text-xs ${STATUS_COLORS[item.status]}`}>
                    {item.status.toLowerCase()}
                </Badge>
            ),
        },
        {
            key: "publishedAt",
            label: "Published",
            render: (item) => (
                <span className="text-muted-foreground text-xs whitespace-nowrap">
                    {item.publishedAt ? format(new Date(item.publishedAt), "dd MMM yyyy") : "N/A"}
                </span>
            ),
        },
        {
            key: "viewCount",
            label: "Views",
            render: (item) => (
                <span className="inline-flex items-center gap-1 text-muted-foreground text-xs">
                    <RiEyeLine /> {item.viewCount}
                </span>
            ),
        },
        {
            key: "actions",
            label: "Actions",
            render: (item) => (
                <div className="flex items-center justify-center gap-1">
                    <button
                        type="button"
                        title={item.isPinned ? "Unpin" : "Pin"}
                        disabled={isTogglingPin}
                        onClick={() => handleTogglePin(item._id)}
                        className={`h-8 w-8 flex items-center justify-center rounded-lg transition-colors ${item.isPinned
                            ? "text-primary2-600 bg-primary2-50 hover:bg-primary2-100"
                            : "text-muted-foreground hover:bg-surface-100"
                            }`}
                    >
                        {item.isPinned ? <RiPushpin2Line /> : <RiPushpinLine />}
                    </button>
                    <button
                        type="button"
                        title="Edit"
                        onClick={() => onEdit(item)}
                        className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-100 hover:text-gray-700 transition-colors"
                    >
                        <RiEditLine />
                    </button>
                    <button
                        type="button"
                        title="Delete"
                        onClick={() => setDeleteId(item._id)}
                        className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                        <RiDeleteBinLine />
                    </button>
                </div>
            ),
        },
    ];

    const meta = data?.meta;
    const paginationOptions = meta
        ? { count: meta.total, current_page: meta.page, num_pages: meta.totalPage }
        : undefined;

    return (
        <>
            <DataTable<IAnnouncement>
                data={data?.data ?? []}
                columns={columns}
                isLoading={isLoading}
                isError={isError}
                errorMessage="Failed to load announcements."
                emptyMessage={emptyMessage}
                isPaginate={!!paginationOptions}
                paginationOptions={paginationOptions}
                pageSize={limit}
                onPageChange={onPageChange}
            />

            <DeleteAlertModal
                open={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
                title="Delete Announcement"
                description="This will permanently delete the announcement. This action cannot be undone."
            />
        </>
    );
};

export default AdminAnnouncementsTable;
