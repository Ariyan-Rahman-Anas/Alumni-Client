"use client";

import { toast } from "sonner";
import {
    RiDeleteBinLine,
    RiEditLine,
    RiEyeLine,
    RiEyeOffLine,
    RiMedalLine,
    RiGroupLine,
} from "react-icons/ri";

import DataTable from "@/components/shared/dataTable/DataTable";
import { Button } from "@/components/ui/button";
import type { TableColumn } from "@/types";
import {
    useToggleEventPublishMutation,
    useToggleEventFeatureMutation,
} from "@/redux/apis/eventApi";
import DateFormatter from "@/lib/DateFormatter";
import { IEvent } from "@/types/common/events.types";

interface AdminEventsTableProps {
    data: IEvent[];
    isLoading: boolean;
    isError: boolean;
    paginationOptions?: { count: number; current_page: number; num_pages: number };
    pageSize: number;
    onPageChange: (page: number) => void;
    onEdit: (event: IEvent) => void;
    onDelete: (id: string) => void;
    onViewRegistrations: (event: IEvent) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
    Reunion: "badge-student",
    Career: "badge-parent",
    Community: "badge-alumni",
    Cultural: "badge-staff",
    Sports: "badge-success",
    Other: "badge-admin",
};

const STATUS_COLORS: Record<string, string> = {
    UPCOMING: "badge-parent",
    ONGOING: "badge-success",
    COMPLETED: "badge-staff",
    CANCELLED: "badge-danger",
};

const AdminEventsTable = ({
    data,
    isLoading,
    isError,
    paginationOptions,
    pageSize,
    onPageChange,
    onEdit,
    onDelete,
    onViewRegistrations,
}: AdminEventsTableProps) => {
    const [togglePublish, { isLoading: isTogglingPublish }] = useToggleEventPublishMutation();
    const [toggleFeature, { isLoading: isTogglingFeature }] = useToggleEventFeatureMutation();

    const handleTogglePublish = async (event: IEvent) => {
        try {
            await togglePublish(event._id).unwrap();
            toast.success(`Event ${event.isPublished ? "unpublished" : "published"}`);
        } catch (err: unknown) {
            toast.error(
                (err as { data?: { message?: string } })?.data?.message ?? "Failed to toggle publish"
            );
        }
    };

    const handleToggleFeature = async (event: IEvent) => {
        try {
            await toggleFeature(event._id).unwrap();
            toast.success(`Event ${event.isFeatured ? "unfeatured" : "featured"}`);
        } catch (err: unknown) {
            toast.error(
                (err as { data?: { message?: string } })?.data?.message ?? "Failed to toggle feature"
            );
        }
    };

    const columns: TableColumn<IEvent>[] = [
        { key: "index", label: "SN." },
        {
            key: "title",
            width: "0%",
            label: "Title",
            render: (e) => (
                <span className="max-w-sm flex items-center justify-center overflow-hidden">
                    {e.title}
                </span>
            ),
        },
        {
            key: "category",
            label: "Category",
            render: (e) => (
                <p
                    className={`${CATEGORY_COLORS[e.category] ?? "bg-surface-200 text-neutral-600"}`}
                >
                    {e.category}
                </p>
            ),
        },
        {
            key: "status",
            label: "Status",
            render: (e) => (
                <p
                    className={`${STATUS_COLORS[e.status] ?? ""}`}
                >
                    {e.status}
                </p>
            ),
        },
        {
            key: "locationType",
            label: "Type",
            render: (e) => (
                <span>
                    {e.locationType}
                </span>
            ),
        },
        {
            key: "startDateTime",
            label: "Date",
            render: (e) => <DateFormatter date={e.startDateTime} isShowTime={true} />
        },
        {
            key: "isFree",
            label: "Pricing",
            render: (e) => (
                <p
                    className={e.isFree
                        ? "badge-success"
                        : "badge-alumni"}
                >
                    {e.isFree ? "Free" : "Paid"}
                </p>
            ),
        },
        {
            key: "isPublished",
            label: "Published",
            render: (e) => (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTogglePublish(e)}
                    disabled={isTogglingPublish}
                    className={`h-7 gap-1.5 text-xs font-medium px-2 rounded-md ${e.isPublished
                        ? "text-primary2-600 hover:text-primary2-700 hover:bg-primary2-50"
                        : "text-neutral-400 hover:text-neutral-600 hover:bg-surface-100"
                        }`}
                    title={e.isPublished ? "Click to unpublish" : "Click to publish"}
                >
                    {e.isPublished ? (
                        <RiEyeLine className="text-sm" />
                    ) : (
                        <RiEyeOffLine className="text-sm" />
                    )}
                    {e.isPublished ? "Live" : "Draft"}
                </Button>
            ),
        },
        {
            key: "isFeatured",
            label: "Featured",
            render: (e) => (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleFeature(e)}
                    disabled={isTogglingFeature}
                    className={`h-7 gap-1.5 text-xs font-medium px-2 rounded-md ${e.isFeatured
                        ? "text-gold-600 hover:text-gold-700 hover:bg-gold-50"
                        : "text-neutral-400 hover:text-neutral-600 hover:bg-surface-100"
                        }`}
                    title={e.isFeatured ? "Remove from featured" : "Add to featured"}
                >
                    <RiMedalLine className="text-sm" />
                    {e.isFeatured ? "Featured" : "—"}
                </Button>
            ),
        },
        {
            key: "actions",
            label: "Actions",
            render: (e) => (
                <div className="flex items-center gap-1.5">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewRegistrations(e)}
                        className="h-7 w-7 p-0 text-sky-600 hover:text-sky-700 hover:bg-sky-50"
                        title="View registrations"
                    >
                        <RiGroupLine className="text-base" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(e)}
                        className="h-7 w-7 p-0 text-primary2-600 hover:text-primary2-700 hover:bg-primary2-50"
                        title="Edit event"
                    >
                        <RiEditLine className="text-base" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(e._id)}
                        className="h-7 w-7 p-0 text-danger hover:text-danger hover:bg-danger-light"
                        title="Delete event"
                    >
                        <RiDeleteBinLine className="text-base" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <DataTable
            data={data}
            columns={columns}
            isLoading={isLoading}
            isError={isError}
            errorMessage="Failed to load events"
            paginationOptions={paginationOptions}
            pageSize={pageSize}
            onPageChange={onPageChange}
            emptyMessage="No events found. Create your first event!"
        />
    );
};
export default AdminEventsTable;