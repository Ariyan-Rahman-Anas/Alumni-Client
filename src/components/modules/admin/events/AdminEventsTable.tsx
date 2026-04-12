"use client";

import { toast } from "sonner";
import {
    RiDeleteBinLine,
    RiEditLine,
    RiEyeLine,
    RiEyeOffLine,
    RiMedalLine,
} from "react-icons/ri";

import DataTable from "@/components/shared/dataTable/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TableColumn } from "@/types";
import {
    type Event,
    useToggleEventPublishMutation,
    useToggleEventFeatureMutation,
} from "@/redux/apis/eventApi";

interface AdminEventsTableProps {
    data: Event[];
    isLoading: boolean;
    isError: boolean;
    paginationOptions?: { count: number; current_page: number; num_pages: number };
    pageSize: number;
    onPageChange: (page: number) => void;
    onEdit: (event: Event) => void;
    onDelete: (id: string) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
    Reunion: "bg-primary2-100 text-primary2-700 border-primary2-200",
    Career: "bg-blue-100 text-blue-700 border-blue-200",
    Community: "bg-gold-100 text-gold-700 border-gold-200",
    Cultural: "bg-violet-100 text-violet-700 border-violet-200",
    Sports: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Other: "bg-surface-200 text-neutral-600 border-surface-300",
};

const STATUS_COLORS: Record<string, string> = {
    UPCOMING: "bg-blue-100 text-blue-700 border-blue-200",
    ONGOING: "bg-emerald-100 text-emerald-700 border-emerald-200",
    COMPLETED: "bg-surface-200 text-neutral-600 border-surface-300",
    CANCELLED: "bg-danger-light text-danger border-red-200",
};

const formatEventDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

const AdminEventsTable = ({
    data,
    isLoading,
    isError,
    paginationOptions,
    pageSize,
    onPageChange,
    onEdit,
    onDelete,
}: AdminEventsTableProps) => {
    const [togglePublish, { isLoading: isTogglingPublish }] = useToggleEventPublishMutation();
    const [toggleFeature, { isLoading: isTogglingFeature }] = useToggleEventFeatureMutation();

    const handleTogglePublish = async (event: Event) => {
        try {
            await togglePublish(event._id).unwrap();
            toast.success(`Event ${event.isPublished ? "unpublished" : "published"}`);
        } catch (err: unknown) {
            toast.error(
                (err as { data?: { message?: string } })?.data?.message ?? "Failed to toggle publish"
            );
        }
    };

    const handleToggleFeature = async (event: Event) => {
        try {
            await toggleFeature(event._id).unwrap();
            toast.success(`Event ${event.isFeatured ? "unfeatured" : "featured"}`);
        } catch (err: unknown) {
            toast.error(
                (err as { data?: { message?: string } })?.data?.message ?? "Failed to toggle feature"
            );
        }
    };

    const columns: TableColumn<Event>[] = [
        { key: "index", label: "#" },
        {
            key: "title",
            label: "Title",
            render: (e) => (
                <span className="font-medium text-sm text-gray-900 line-clamp-1 max-w-[200px] block">
                    {e.title}
                </span>
            ),
        },
        {
            key: "category",
            label: "Category",
            render: (e) => (
                <Badge
                    variant="outline"
                    className={`text-xs font-medium ${CATEGORY_COLORS[e.category] ?? "bg-surface-200 text-neutral-600"}`}
                >
                    {e.category}
                </Badge>
            ),
        },
        {
            key: "status",
            label: "Status",
            render: (e) => (
                <Badge
                    variant="outline"
                    className={`text-xs font-medium ${STATUS_COLORS[e.status] ?? ""}`}
                >
                    {e.status}
                </Badge>
            ),
        },
        {
            key: "locationType",
            label: "Type",
            render: (e) => (
                <span className="text-xs text-muted-foreground font-medium">
                    {e.locationType}
                </span>
            ),
        },
        {
            key: "startDateTime",
            label: "Date",
            render: (e) => (
                <span className="text-sm text-gray-600">{formatEventDate(e.startDateTime)}</span>
            ),
        },
        {
            key: "isFree",
            label: "Pricing",
            render: (e) => (
                <Badge
                    variant="outline"
                    className={e.isFree
                        ? "bg-emerald-100 text-emerald-700 border-emerald-200 text-xs"
                        : "bg-gold-100 text-gold-700 border-gold-200 text-xs"}
                >
                    {e.isFree ? "Free" : "Paid"}
                </Badge>
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
