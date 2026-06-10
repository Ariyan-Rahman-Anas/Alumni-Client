"use client";

import { useState } from "react";
import { toast } from "sonner";

import DataTable from "@/components/shared/dataTable/DataTable";
import DeleteAlertModal from "@/components/shared/DeleteAlertModal";
import type { TableColumn } from "@/types";
import Image from "next/image";
import DateFormatter from "@/lib/DateFormatter";
import { IRequest, TRequestStatus } from "@/types/request.types";
import { useDeleteRequestMutation, useGetAllRequestsQuery } from "@/redux/apis/requestApi";
import AdminRequestViewModal from "./AdminRequestViewModal";

const STATUS_STYLES: Record<TRequestStatus, string> = {
    PENDING: "bg-amber-50 text-amber-700 border border-amber-200",
    IN_REVIEW: "bg-blue-50 text-blue-700 border border-blue-200",
    RESOLVED: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    REJECTED: "bg-red-50 text-red-700 border border-red-200",
};

const STATUS_LABELS: Record<TRequestStatus, string> = {
    PENDING: "Pending",
    IN_REVIEW: "In Review",
    RESOLVED: "Resolved",
    REJECTED: "Rejected",
};

interface AdminRequestsTableProps {
    page: number;
    limit: number;
    onPageChange: (page: number) => void;
    search?: string;
    status?: string;
    category?: string;
}

const AdminRequestsTable = ({
    page,
    limit,
    onPageChange,
    search,
    status,
    category,
}: AdminRequestsTableProps
) => {
    const [viewRequest, setViewRequest] = useState<IRequest | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const { data, isLoading, isError } = useGetAllRequestsQuery({ page, limit, search, status, category });
    const [deleteRequest, { isLoading: isDeleting }] = useDeleteRequestMutation();

    console.log({ data })

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            const res = await deleteRequest(deleteId).unwrap();
            toast.success(res.message || "Request deleted");
            setDeleteId(null);
        } catch { }
    };

    const columns: TableColumn<IRequest>[] = [
        { key: "index", label: "#" },
        {
            key: "imageUrl", label: "Requested By",
            width: "0%",
            render: (req) => (
                <div className="flex items-center w-fit gap-3">
                    <div className="h-20 w-20 rounded-full border-2 border-surface-200 flex items-center justify-center overflow-hidden">
                        {req.user.imageUrl ? <Image src={req.user.imageUrl ?? ""} alt={req.user.name.slice(0, 5)} width={500} height={500} /> : <div className="h-20 w-20 bg-gray-200 rounded-full flex items-center justify-center">{req.user.name.slice(0, 2).toUpperCase()}</div>}
                    </div>
                    <div className="text-left">
                        <p>{req.user.name}</p>
                        <p>{req.user.email}</p>
                        <p>{req.user.phone}</p>
                    </div>
                </div>
            )
        },
        {
            key: "category", label: "Category",
        },
        { key: "subject", label: "Subject" },
        { key: "description", label: "Description" },
        {
            key: "status", label: "Status", render: (row) => (
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_STYLES[row.status]}`}>
                    {STATUS_LABELS[row.status]}
                </span>
            ),
        },
        { key: "createdAt", label: "Created At", render: (req) => <DateFormatter date={req.createdAt || ""} /> },
        {
            key: "resolvedAt", label: "Resolved At", render: (req) => (
                <div>
                    {req.resolvedAt ? <DateFormatter date={req.resolvedAt} /> : "Not resolved yet"}
                    {req.resolvedBy && <>
                        <p className="text-xs mt-0.5 opacity-80">Resolved by {typeof req.resolvedBy === "string" ? "Unknown" : req.resolvedBy.name}</p>
                        <p>{req.adminMessage}</p>
                    </>
                    }
                </div>
            )
        },
        // {
        //     key: "actions",
        //     label: "Actions",
        //     render: (req) => (
        //         <div className="flex items-center justify-center gap-3 py-1">

        //         </div>
        //     ),
        // },
    ];

    const meta = data?.meta;
    const paginationOptions = meta
        ? { count: meta.total, current_page: meta.page, num_pages: meta.totalPage }
        : undefined;

    return (
        <>
            <div className="mt-4">
                <DataTable<IRequest>
                    data={data?.data ?? []}
                    columns={columns}
                    isLoading={isLoading}
                    isError={isError}
                    emptyMessage="No requests found"
                    isPaginate
                    paginationOptions={paginationOptions}
                    onPageChange={onPageChange}
                />
            </div>

            <AdminRequestViewModal
                request={viewRequest}
                onClose={() => setViewRequest(null)}
            />

            <DeleteAlertModal
                open={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
                title="Delete Request"
                description="This will permanently delete the request. This action cannot be undone."
            />
        </>
    );
};
export default AdminRequestsTable;