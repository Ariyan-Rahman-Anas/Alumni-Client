"use client";

import { useState } from "react";
import { toast } from "sonner";
import { RiCheckLine, RiDeleteBinLine, RiEyeLine } from "react-icons/ri";

import DataTable from "@/components/shared/dataTable/DataTable";
import DeleteAlertModal from "@/components/shared/DeleteAlertModal";
import AdminUserViewModal from "./AdminUserViewModal";
import { Button } from "@/components/ui/button";
import type { TableColumn } from "@/types";
import {
    useGetAllUsersQuery,
    useApproveUserMutation,
    useDeleteUserMutation,
    type UserProfile,
} from "@/redux/apis/userApi";
import { formatDate } from "@/lib/DateFormatter";
import Image from "next/image";

interface AdminUsersTableProps {
    page: number;
    limit: number;
    onPageChange: (page: number) => void;
    approvalStatus?: string;
    search?: string;
    bloodGroup?: string;
    section?: string;
    dobYear?: number;
    dobMonth?: number;
    dobDay?: number;
    isVerified?: boolean;
    emptyMessage?: string;
}

const AdminUsersTable = ({
    page,
    limit,
    onPageChange,
    approvalStatus,
    search,
    bloodGroup,
    section,
    dobYear,
    dobMonth,
    dobDay,
    isVerified,
    emptyMessage = "No users found",
}: AdminUsersTableProps) => {
    const [viewUser, setViewUser] = useState<UserProfile | null>(null);
    const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

    const { data, isLoading, isError } = useGetAllUsersQuery({
        page,
        limit,
        approvalStatus,
        search,
        bloodGroup,
        section,
        dobYear,
        dobMonth,
        dobDay,
        isVerified,
    });

    const [approveUser, { isLoading: isApproving }] = useApproveUserMutation();
    const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

    const handleApprove = async (userId: string) => {
        try {
            await approveUser(userId).unwrap();
            toast.success("User approved successfully");
        } catch (err: unknown) {
            toast.error((err as { data?: { message?: string } })?.data?.message ?? "Failed to approve user");
        }
    };

    const handleDelete = async () => {
        if (!deleteUserId) return;
        try {
            await deleteUser(deleteUserId).unwrap();
            toast.success("User deleted");
            setDeleteUserId(null);
        } catch (err: unknown) {
            toast.error((err as { data?: { message?: string } })?.data?.message ?? "Failed to delete user");
        }
    };

    const columns: TableColumn<UserProfile>[] = [
        {
            key: "index", label: "#"
        },
        {
            key: "userId", label: "User ID"
        },
        {
            key: "name", label: "Name"
        },
        {
            key: "imageUrl", label: "Image",
            render: (u) => (
                <div>
                    <Image src={u.imageUrl ?? ""} alt={u.name.slice(0, 2).toUpperCase()} width={40} height={40} className="rounded-full" />
                </div>
            )
        },
        {
            key: "email",
            label: "Email",
        },
        {
            key: "phone",
            label: "Phone",
        },
        {
            key: "dob",
            label: "Date of Birth",
            render: (u) => <span>{u.dob ? formatDate(u.dob) : "—"}</span>,
        },
        {
            key: "batch",
            label: "Batch",
        },
        {
            key: "isVerified",
            label: "Verified",
            render: (u) => (
                <p
                    className={
                        u.isVerified === true
                            ? "badge-success"
                            : "badge-danger"
                    }
                >
                    {u.isVerified ? "Yes" : "No"}
                </p>
            ),
        },
        {
            key: "approvalStatus",
            label: "Status",
            render: (u) => (
                <p
                    className={
                        u.approvalStatus === "APPROVED"
                            ? "badge-success"
                            : "badge-danger"
                    }
                >
                    {u.approvalStatus}
                </p>
            ),
        },
        {
            key: "actions",
            label: "Actions",
            // width: "130px",
            render: (u) => (
                <div className="flex items-center justify-center gap-1">
                    <Button
                        size="icon"
                        variant="ghost"
                        title="View profile"
                        onClick={() => setViewUser(u)}
                        className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                    >
                        <RiEyeLine className="text-base" />
                    </Button>
                    {u.approvalStatus === "PENDING" && (
                        <Button
                            size="icon"
                            variant="ghost"
                            title="Approve"
                            disabled={isApproving}
                            onClick={() => handleApprove(u._id)}
                            className="h-8 w-8 text-emerald-600 hover:bg-emerald-50"
                        >
                            <RiCheckLine className="text-base" />
                        </Button>
                    )}
                    <Button
                        size="icon"
                        variant="ghost"
                        title="Delete"
                        onClick={() => setDeleteUserId(u._id)}
                        className="h-8 w-8 text-red-500 hover:bg-red-50"
                    >
                        <RiDeleteBinLine className="text-base" />
                    </Button>
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
            <DataTable<UserProfile>
                data={data?.data ?? []}
                columns={columns}
                isLoading={isLoading}
                isError={isError}
                errorMessage="Failed to load users"
                emptyMessage={emptyMessage}
                isPaginate={!!paginationOptions}
                paginationOptions={paginationOptions}
                pageSize={limit}
                onPageChange={onPageChange}
            />

            <AdminUserViewModal
                user={viewUser}
                onClose={() => setViewUser(null)}
                onApprove={handleApprove}
                isApproving={isApproving}
            />

            <DeleteAlertModal
                open={!!deleteUserId}
                onClose={() => setDeleteUserId(null)}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
                title="Delete User"
                description="This will permanently delete the user account and all associated data. This cannot be undone."
            />
        </>
    );
};
export default AdminUsersTable;