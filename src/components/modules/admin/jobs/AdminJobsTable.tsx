"use client";

import { useState } from "react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import {
    RiBriefcaseLine,
    RiBookOpenLine,
    RiToolsLine,
    RiCheckboxCircleLine,
    RiEyeLine,
} from "react-icons/ri";

import DataTable from "@/components/shared/dataTable/DataTable";
import JobDetailSheet from "@/components/modules/admin/jobs/JobDetailSheet";
import JobStatusDialog from "@/components/modules/admin/jobs/JobStatusDialog";

import type { TableColumn } from "@/types";
import {
    useAdminGetAllJobsQuery,
    useAdminUpdateJobStatusMutation,
} from "@/redux/apis/jobApi";
import type { IJobPost, TJobPostStatus, TJobPostType } from "@/components/modules/user/job/job.types";

/* -- Config ----------------------------------------------- */
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

/* -- Props ------------------------------------------------ */
interface AdminJobsTableProps {
    page: number;
    limit: number;
    status?: TJobPostStatus;
    onPageChange: (page: number) => void;
}

const AdminJobsTable = ({ page, limit, status, onPageChange }: AdminJobsTableProps) => {
    const [sheetJob, setSheetJob] = useState<IJobPost | null>(null);
    const [dialogJob, setDialogJob] = useState<IJobPost | null>(null);

    const { data, isLoading, isError } = useAdminGetAllJobsQuery({ page, limit, status });
    const [updateJobStatus, { isLoading: statusUpdating }] = useAdminUpdateJobStatusMutation();

    const jobs = data?.data ?? [];
    const meta = data?.meta;

    const handleStatusSubmit = async (
        newStatus: "APPROVED" | "REJECTED" | "CLOSED",
        adminNote: string,
        rejectedReason?: string
    ) => {
        if (!dialogJob) return;
        try {
            await updateJobStatus({ id: dialogJob._id, status: newStatus, adminNote, rejectedReason }).unwrap();
            toast.success(`Job ${newStatus}`);
            setDialogJob(null);
            setSheetJob(null);
        } catch {
            toast.error("Failed to update status");
        }
    };

    const columns: TableColumn<IJobPost>[] = [
        { key: "index", label: "#" },
        {
            key: "title",
            label: "Title / Author",
            render: (job) => (
                <div>
                    <p className="font-semibold text-primary2-900 line-clamp-1">{job.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{job.postedBy?.name}</p>
                </div>
            ),
        },
        {
            key: "type",
            label: "Type",
            render: (job) => (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground capitalize">
                    {TYPE_ICONS[job.type]} {job.type.replace("_", " ")}
                </span>
            ),
        },
        {
            key: "status",
            label: "Status",
            render: (job) => (
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_BADGE[job.status]}`}>
                    {job.status}
                </span>
            ),
        },
        {
            key: "createdAt",
            label: "Posted",
            render: (job) => (
                <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                </span>
            ),
        },
        {
            key: "actions",
            label: "Actions",
            render: (job) => (
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => setSheetJob(job)}
                        title="View Details"
                        className="p-2 text-muted-foreground hover:text-primary2-700 hover:bg-primary2-50 rounded-xl transition-colors"
                    >
                        <RiEyeLine />
                    </button>
                    <button
                        onClick={() => setDialogJob(job)}
                        title="Update Status"
                        className="p-2 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                    >
                        <RiCheckboxCircleLine />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <>
            <DataTable
                data={jobs}
                columns={columns}
                isLoading={isLoading}
                isError={isError}
                emptyMessage="No job posts found."
                paginationOptions={{
                    count: meta?.total,
                    current_page: page,
                    num_pages: meta?.totalPage,
                }}
                pageSize={limit}
                onPageChange={onPageChange}
            />

            <JobDetailSheet
                job={sheetJob}
                open={!!sheetJob}
                onClose={() => setSheetJob(null)}
                onUpdateStatus={() => setDialogJob(sheetJob)}
            />
            <JobStatusDialog
                job={dialogJob}
                open={!!dialogJob}
                onClose={() => setDialogJob(null)}
                onSubmit={handleStatusSubmit}
                isLoading={statusUpdating}
            />
        </>
    );
};

export default AdminJobsTable;
