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
import { useApproveUserMutation, useDeleteUserMutation, useGetAllUsersQuery, useMakeAdminMutation, useMakeAdminToUserMutation } from "@/redux/apis/userApi";
import { MdAdminPanelSettings } from "react-icons/md";
import { constantsData } from "@/constants";
import { LuUserRound } from "react-icons/lu";

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
    const [makeAdmin, { isLoading: isMakingAdmin }] = useMakeAdminMutation();
    const [makeAdminToUser, { isLoading: isMakingAdminToUser }] = useMakeAdminToUserMutation();

    const handleApprove = async (userId: string) => {
        try {
            const approveRes = await approveUser(userId).unwrap();
            toast.success(approveRes.message || "User approved successfully");
        } catch {}
    };

    const handleDelete = async () => {
        if (!deleteUserId) return;
        try {
            const deleteRes = await deleteUser(deleteUserId).unwrap();
            toast.success(deleteRes.message || "User deleted");
            setDeleteUserId(null);
        } catch {}
    };

    const handleMakeAdmin = async (userId: string) => {
        try {
            const makeAdminRes = await makeAdmin(userId).unwrap();
            toast.success(makeAdminRes.message || "User made admin successfully");
        } catch {}
    };

    const handleMakeAdminToUser = async (userId: string) => {
        try {
            const makeAdminToUserRes = await makeAdminToUser(userId).unwrap();
            toast.success(makeAdminToUserRes.message || "User made admin successfully");
        } catch {}
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
                    <p className="capitalize">{u.section?.toLowerCase() ?? ""}</p>

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
                <div className="flex items-center justify-center gap-3 py-1">
                    {u.role !== constantsData.USER_ROLE.SUPER_ADMIN &&
                        <button
                            title="View profile"
                            onClick={() => setViewUser(u)}
                            className="text-info cursor-pointer hover:scale-125 transition-all duration-300">
                            <RiEyeLine size={18} />
                        </button>
                    }
                    {u.approvalStatus === "PENDING" && (
                        <button
                            title="Approve"
                            disabled={isApproving}
                            onClick={() => handleApprove(u._id)}
                            className="text-primary2-500 cursor-pointer hover:scale-125 transition-all duration-300">
                            <RiCheckLine size={18} />
                        </button>
                    )}

                    {
                        (u.role !== constantsData.USER_ROLE.SUPER_ADMIN && u.approvalStatus !== constantsData.APPROVAL_STATUS.PENDING) && <>
                            {u.role === constantsData.USER_ROLE.ADMIN ?
                                <button
                                    title="Make User"
                                    disabled={isMakingAdminToUser}
                                    onClick={() => handleMakeAdminToUser(u._id)}
                                    className="text-primary2-500 cursor-pointer hover:scale-125 transition-all duration-300">
                                    <LuUserRound size={18} />
                                </button>
                                :
                                <button
                                    title="Make Admin"
                                    disabled={isMakingAdmin}
                                    onClick={() => handleMakeAdmin(u._id)}
                                    className="text-primary2-500 cursor-pointer hover:scale-125 transition-all duration-300">
                                    <MdAdminPanelSettings size={18} />
                                </button>
                            }
                        </>
                    }

                    {u.role !== constantsData.USER_ROLE.SUPER_ADMIN &&
                        <button
                            title="Delete"
                            onClick={() => setDeleteUserId(u._id)}
                            className="text-danger cursor-pointer hover:scale-125 transition-all duration-300">
                            <RiDeleteBinLine className="text-base" size={18} />
                        </button>
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