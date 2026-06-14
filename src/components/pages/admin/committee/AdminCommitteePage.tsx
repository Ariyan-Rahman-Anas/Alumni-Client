"use client";

import { useState } from "react";
import { toast } from "sonner";
import { RiAddLine } from "react-icons/ri";

import AdminPageHead from "@/components/shared/admin/AdminPageHead";
import PrimaryButton from "@/components/shared/PrimaryButton";
import DeleteAlertModal from "@/components/shared/DeleteAlertModal";
import AdminCommitteeTable from "@/components/modules/admin/committee/AdminCommitteeTable";
import AdminCommitteeFormModal from "@/components/modules/admin/committee/AdminCommitteeFormModal";

import {
    useGetAllCommitteesAdminQuery,
    useDeleteCommitteeMutation,
    useSetActiveCommitteeMutation,
} from "@/redux/apis/committeeApi";
import type { ICommittee } from "@/types/common/committee.types";
import type { IServerErrorRes } from "@/types/common.components.types";

const AdminCommitteePage = () => {
    const [formOpen, setFormOpen] = useState(false);
    const [editItem, setEditItem] = useState<ICommittee | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const { data, isLoading, isError } = useGetAllCommitteesAdminQuery();
    const [deleteCommittee, { isLoading: isDeleting }] = useDeleteCommitteeMutation();
    const [setActive ] = useSetActiveCommitteeMutation();

    const committees = data?.data ?? [];

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await deleteCommittee(deleteId).unwrap();
            toast.success("Committee deleted");
            setDeleteId(null);
        } catch (err: unknown) {
            const error = err as IServerErrorRes;
            toast.error(error?.data?.message ?? "Failed to delete committee");
        }
    };

    const handleSetActive = async (id: string) => {
        try {
            await setActive(id).unwrap();
            toast.success("Committee set as active");
        } catch (err: unknown) {
            const error = err as IServerErrorRes;
            toast.error(error?.data?.message ?? "Failed to activate committee");
        }
    };

    return (
        <div className="admin-page-setup">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <AdminPageHead
                    title="Committee"
                    description="Manage alumni committee members and designations shown on the About page."
                />
                <PrimaryButton
                    type="button"
                    title="New Committee"
                    icon={<RiAddLine />}
                    iconSide="left"
                    onClick={() => {
                        setEditItem(null);
                        setFormOpen(true);
                    }}
                />
            </div>

            {/* Table */}
            <AdminCommitteeTable
                data={committees}
                isLoading={isLoading}
                isError={isError}
                onEdit={(item) => {
                    setEditItem(item);
                    setFormOpen(true);
                }}
                onDelete={(id) => setDeleteId(id)}
                onSetActive={handleSetActive}
            />

            {/* Form modal */}
            <AdminCommitteeFormModal
                open={formOpen}
                onClose={() => {
                    setFormOpen(false);
                    setEditItem(null);
                }}
                committee={editItem}
            />

            {/* Delete confirmation */}
            <DeleteAlertModal
                open={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
            />
        </div>
    );
};

export default AdminCommitteePage;
