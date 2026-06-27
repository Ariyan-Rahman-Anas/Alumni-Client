"use client";

import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { RiCheckLine, RiEditLine, RiDeleteBinLine } from "react-icons/ri";
import { Badge } from "@/components/ui/badge";

import DataTable from "@/components/shared/dataTable/DataTable";
import DeleteAlertModal from "@/components/shared/DeleteAlertModal";
import AdminCommitteeFormModal from "@/components/modules/admin/committee/AdminCommitteeFormModal";

import type { TableColumn } from "@/types";
import {
    useGetAllCommitteesAdminQuery,
    useDeleteCommitteeMutation,
    useSetActiveCommitteeMutation,
} from "@/redux/apis/committeeApi";
import type { ICommittee, ICommitteeMemberUser } from "@/types/common/committee.types";
import type { IServerErrorRes } from "@/types/common.components.types";

interface AdminCommitteeTableProps {
    openNew: boolean;
    onNewClose: () => void;
}

const AdminCommitteeTable = ({ openNew, onNewClose }: AdminCommitteeTableProps) => {
    const [editItem, setEditItem] = useState<ICommittee | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const { data, isLoading, isError } = useGetAllCommitteesAdminQuery();
    const [deleteCommittee, { isLoading: isDeleting }] = useDeleteCommitteeMutation();
    const [setActive] = useSetActiveCommitteeMutation();

    const committees = data?.data ?? [];

    const handleSetActive = async (id: string) => {
        try {
            await setActive(id).unwrap();
            toast.success("Committee set as active");
        } catch (err) {
            const error = err as IServerErrorRes;
            toast.error(error?.data?.message ?? "Failed to activate committee");
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await deleteCommittee(deleteId).unwrap();
            toast.success("Committee deleted");
            setDeleteId(null);
        } catch (err) {
            const error = err as IServerErrorRes;
            toast.error(error?.data?.message ?? "Failed to delete committee");
        }
    };

    const columns: TableColumn<ICommittee>[] = [
        {
            key: "index",
            label: "#",
            width: "w-12",
            render: () => null,
        },
        {
            key: "name",
            label: "Name",
            render: (item) => (
                <div>
                    <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                    {item.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                            {item.description}
                        </p>
                    )}
                </div>
            ),
        },
        {
            key: "functionalFrom",
            label: "Period",
            render: (item) => {
                const from = format(new Date(item.functionalFrom), "MMM yyyy");
                const to = item.functionalTo
                    ? format(new Date(item.functionalTo), "MMM yyyy")
                    : "Present";
                return (
                    <span className="text-muted-foreground whitespace-nowrap">
                        {from} to {to}
                    </span>
                );
            },
        },
        {
            key: "members",
            label: "Members",
            render: (item) => (
                <div className="flex items-center justify-center flex-wrap gap-1">
                    {item.members.slice(0, 3).map((m, i) => {
                        const user =
                            typeof m.member === "object"
                                ? (m.member as ICommitteeMemberUser)
                                : null;
                        return (
                            <span
                                key={i}
                                className="text-xs bg-surface-100 dark:bg-gunmetal-700 text-gray-600 dark:text-gunmetal-100 px-2 py-0.5 rounded-full border dark:border-gunmetal-600"
                            >
                                {user ? user.name : "�"}
                            </span>
                        );
                    })}
                    {item.members.length > 3 && (
                        <span className="text-xs text-muted-foreground px-1">
                            +{item.members.length - 3} more
                        </span>
                    )}
                </div>
            ),
        },
        {
            key: "isActive",
            label: "Status",
            render: (item) => (
                <Badge
                    className={
                        item.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-gray-100 text-gray-500 border border-gray-200"
                    }
                >
                    {item.isActive ? "Active" : "Inactive"}
                </Badge>
            ),
        },
        {
            key: "actions",
            label: "Actions",
            render: (item) => (
                <div className="flex items-center justify-center gap-2">
                    {!item.isActive && (
                        <button
                            title="Set as Active"
                            onClick={() => handleSetActive(item._id)}
                            className="p-1.5 rounded hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-600 transition-colors"
                        >
                            <RiCheckLine size={16} />
                        </button>
                    )}
                    <button
                        title="Edit"
                        onClick={() => setEditItem(item)}
                        className="p-1.5 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 transition-colors"
                    >
                        <RiEditLine size={16} />
                    </button>
                    <button
                        title="Delete"
                        onClick={() => setDeleteId(item._id)}
                        className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
                    >
                        <RiDeleteBinLine size={16} />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <>
            <DataTable<ICommittee>
                data={committees}
                columns={columns}
                isLoading={isLoading}
                isError={isError}
                isPaginate={false}
                emptyMessage="No committees found"
                errorMessage="Failed to load committees"
            />

            <AdminCommitteeFormModal
                open={openNew || !!editItem}
                onClose={() => {
                    onNewClose();
                    setEditItem(null);
                }}
                committee={editItem}
            />

            <DeleteAlertModal
                open={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
            />
        </>
    );
};
export default AdminCommitteeTable;