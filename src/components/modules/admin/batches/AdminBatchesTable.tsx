import { RiDeleteBinLine, RiEditLine, RiEyeLine, RiToggleFill, RiToggleLine } from "react-icons/ri";
import { useRouter } from "next/navigation";

import DataTable from "@/components/shared/dataTable/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type Batch } from "@/redux/apis/batchApi";
import type { TableColumn } from "@/types";
import DateFormatter from "@/lib/DateFormatter";

interface AdminBatchesTableProps {
    data: Batch[];
    isLoading: boolean;
    isError: boolean;
    paginationOptions?: { count: number; current_page: number; num_pages: number };
    pageSize: number;
    onPageChange: (page: number) => void;
    onEdit: (batch: Batch) => void;
    onDelete: (id: string) => void;
    onToggle: (batch: Batch) => void;
    isToggling: boolean;
}

const AdminBatchesTable = ({
    data,
    isLoading,
    isError,
    paginationOptions,
    pageSize,
    onPageChange,
    onEdit,
    onDelete,
    onToggle,
    isToggling,
}: AdminBatchesTableProps) => {
    const router = useRouter();
    const columns: TableColumn<Batch>[] = [
        { key: "index", label: "#", },
        { key: "year", label: "Batch Year", },
        {
            key: "isActive",
            label: "Status",
            render: (b) => (
                <Badge
                    variant={b.isActive ? "default" : "secondary"}
                    className={b.isActive ? "bg-emerald-100 text-emerald-700 border-emerald-200" : ""}
                >
                    {b.isActive ? "Active" : "Inactive"}
                </Badge>
            ),
        },
        {
            key: "stats",
            label: "Registrations",
            render: (b) => (
                <span className="text-sm font-medium text-gray-800">
                    {b.stats?.totalRegistrations ?? 0}
                </span>
            ),
        },
        {
            key: "stats",
            label: "Approved",
            render: (b) => (
                <span className="text-sm text-emerald-700 font-medium">
                    {b.stats?.approved ?? 0}
                </span>
            ),
        },
        {
            key: "stats",
            label: "Email Verified",
            render: (b) => (
                <span className="text-sm text-blue-700 font-medium">
                    {b.stats?.emailVerified ?? 0}
                </span>
            ),
        },
        {
            key: "stats",
            label: "In Last 30 Days",
            render: (b) => (
                <span className="text-sm text-gray-600">
                    {b.stats?.last30Days ?? 0}
                </span>
            ),
        },
        {
            key: "stats",
            label: "Last Registration",
            render: (b) => <DateFormatter date={b.stats?.lastRegistration} />
        },
        {
            key: "stats",
            label: "Science",
            render: (b) => (
                <span className="text-sm font-medium text-violet-700">
                    {b.stats?.scienceCount ?? 0}
                </span>
            ),
        },
        {
            key: "stats",
            label: "Commerce",
            render: (b) => (
                <span className="text-sm font-medium text-sky-700">
                    {b.stats?.commerceCount ?? 0}
                </span>
            ),
        },
        {
            key: "stats",
            label: "Arts",
            render: (b) => (
                <span className="text-sm font-medium text-amber-700">
                    {b.stats?.artsCount ?? 0}
                </span>
            ),
        },
        {
            key: "actions",
            label: "Actions",
            render: (b) => (
                <div className="flex items-center justify-center gap-1.5">
                    <Button
                        size="icon"
                        variant="ghost"
                        title="View detail"
                        onClick={() => router.push(`/admin/batches/${b._id}`)}
                        className="h-8 w-8 text-neutral-600 hover:bg-surface-100"
                    >
                        <RiEyeLine className="text-base" />
                    </Button>
                    <button
                        title={b.isActive ? "Deactivate" : "Activate"}
                        disabled={isToggling}
                        onClick={() => onToggle(b)}
                        className="text-primary2-600 disabled:opacity-50"
                    >
                        {b.isActive ? <RiToggleFill className="text-xl" /> : <RiToggleLine className="text-xl" />}
                    </button>
                    <Button
                        size="icon"
                        variant="ghost"
                        title="Edit"
                        onClick={() => onEdit(b)}
                        className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                    >
                        <RiEditLine className="text-base" />
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        title="Delete"
                        onClick={() => onDelete(b._id)}
                        className="h-8 w-8 text-danger hover:bg-red-50"
                    >
                        <RiDeleteBinLine className="text-base" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <DataTable<Batch>
            data={data}
            columns={columns}
            isLoading={isLoading}
            isError={isError}
            errorMessage="Failed to load batches"
            emptyMessage="No batches found"
            isPaginate={!!paginationOptions}
            paginationOptions={paginationOptions}
            pageSize={pageSize}
            onPageChange={onPageChange}
        />
    );
};

export default AdminBatchesTable;
