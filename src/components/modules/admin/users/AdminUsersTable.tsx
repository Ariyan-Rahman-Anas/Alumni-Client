"use client";

import { useState } from "react";
import { toast } from "sonner";
import { RiCheckLine, RiDeleteBinLine, RiEyeLine } from "react-icons/ri";

import DataTable from "@/components/shared/dataTable/DataTable";
import DeleteAlertModal from "@/components/shared/DeleteAlertModal";
import AdminUserViewModal from "./AdminUserViewModal";
import type { TableColumn } from "@/types";
import Image from "next/image";
import { AdminUsersTableProps } from "@/types/admin/users.types";
import DateFormatter from "@/lib/DateFormatter";
import { IUserProfile } from "../../user/user.types";
import { useApproveUserMutation, useDeleteUserMutation, useGetAllUsersQuery } from "@/redux/apis/userApi";
import { MdAdminPanelSettings } from "react-icons/md";
import { constantsData } from "@/constants";
import { FaRegUser } from "react-icons/fa";

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
    const [viewUser, setViewUser] = useState<IUserProfile | null>(null);
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

    const columns: TableColumn<IUserProfile>[] = [
        {
            key: "index", label: "#",
        },
        {
            key: "userId", label: "User ID"
        },
        {
            key: "imageUrl", label: "Image & Name",
            width: "0%",
            render: (u) => (
                <div className="flex items-center w-fit gap-3">
                    <div className="h-20 w-20 rounded-full border-2 border-surface-200 flex items-center justify-center overflow-hidden">
                        {u.imageUrl ? <Image src={u.imageUrl ?? ""} alt={u.name.slice(0, 5)} width={500} height={500} /> : <div className="h-20 w-20 bg-gray-200 rounded-full flex items-center justify-center">{u.name.slice(0, 2).toUpperCase()}</div>}
                    </div>
                    <div className="text-left">
                        <p>{u.name}</p>
                        {u.role === constantsData.USER_ROLE.SUPER_ADMIN || u.role === constantsData.USER_ROLE.ADMIN ? <p className="text-xs mt-0.5 opacity-80" >{u.role === constantsData.USER_ROLE.SUPER_ADMIN ? "Super Admin" : "Admin"}</p> : null}
                    </div>
                </div>
            )
        },
        {
            key: "contact",
            label: "Contact",
            render: (u) => (
                <div>
                    <p>{u.phone}</p>
                    <p>{u.email}</p>

                </div>
            )
        },
        {
            key: "dob",
            label: "Date of Birth",
            render: (u) => <DateFormatter date={u.dob} />
        },
        {
            key: "batch",
            label: "Batch",
            render: (u) => (
                <div>
                    <p>{u.batch}</p>
                    <p>{u.section}</p>

                </div>
            )
        },
        {
            key: "bloodGroup",
            label: "Blood Group",
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
            render: (u) => (
                <div className="flex items-center justify-center gap-3">
                    {u.role !== constantsData.USER_ROLE.SUPER_ADMIN &&
                    //     <Button
                    //     size="icon"
                    //     variant="ghost"
                    //     title="View profile"
                    //     onClick={() => setViewUser(u)}
                    //     className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                    // >
                        <RiEyeLine className="text-base" size={20} />
                    // {/* </Button> */}
                    }
                    {u.approvalStatus === "PENDING" && (
                        // <Button
                        //     size="icon"
                        //     variant="ghost"
                        //     title="Approve"
                        //     disabled={isApproving}
                        //     onClick={() => handleApprove(u._id)}
                        //     className="h-8 w-8 text-emerald-600 hover:bg-emerald-50"
                        // >
                        <RiCheckLine className="text-base" size={20} />
                        // {/* </Button> */}
                    )}

                    {
                        u.role !== constantsData.USER_ROLE.SUPER_ADMIN && <div>
                            {u.role === constantsData.USER_ROLE.ADMIN ? <MdAdminPanelSettings size={20} /> : <FaRegUser size={20} />}
                        </div>
                    }

                    {u.role !== constantsData.USER_ROLE.SUPER_ADMIN &&
                    //     <Button
                    //     size="icon"
                    //     variant="ghost"
                    //     title="Delete"
                    //     onClick={() => setDeleteUserId(u._id)}
                    //     className="h-8 w-8 text-red-500 hover:bg-red-50"
                    // >
                        <RiDeleteBinLine className="text-base" size={20} />
                        // {/* </Button> */}
                    }
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
            <DataTable<IUserProfile>
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