"use client";

import { useState } from "react";
import { toast } from "sonner";

import DeleteAlertModal from "@/components/shared/DeleteAlertModal";
import {
    useGetAllBatchesQuery,
    useDeleteBatchMutation,
    useToggleBatchActiveMutation,
    type Batch,
} from "@/redux/apis/batchApi";
import AdminBatchFormModal from "@/components/modules/admin/batches/AdminBatchFormModal";
import AdminBatchesTable from "@/components/modules/admin/batches/AdminBatchesTable";
import AdminPageHead from "@/components/shared/admin/AdminPageHead";
import { constantsData } from "@/constants";
import { RiAddLine } from "react-icons/ri";
import PrimaryButton from "@/components/shared/PrimaryButton";

const AdminBatchesPage = () => {
    const [page, setPage] = useState(1);
    const limit = constantsData.TABLE_PAGE_SIZE;

    const [formOpen, setFormOpen] = useState(false);
    const [editBatch, setEditBatch] = useState<Batch | null>(null);
    const [deleteBatchId, setDeleteBatchId] = useState<string | null>(null);

    const { data, isLoading, isError } = useGetAllBatchesQuery({ page, limit });
    const [deleteBatch, { isLoading: isDeleting }] = useDeleteBatchMutation();
    const [toggleBatchActive, { isLoading: isToggling }] = useToggleBatchActiveMutation();

    const handleDelete = async () => {
        if (!deleteBatchId) return;
        try {
            await deleteBatch(deleteBatchId).unwrap();
            toast.success("Batch deleted");
            setDeleteBatchId(null);
        } catch (err: unknown) {
            toast.error((err as { data?: { message?: string } })?.data?.message ?? "Failed to delete batch");
        }
    };

    const handleToggle = async (batch: Batch) => {
        try {
            await toggleBatchActive(batch._id).unwrap();
            toast.success(`Batch ${batch.isActive ? "deactivated" : "activated"}`);
        } catch (err: unknown) {
            toast.error((err as { data?: { message?: string } })?.data?.message ?? "Failed to toggle batch");
        }
    };

    const meta = data?.meta;
    const paginationOptions = meta
        ? { count: meta.total, current_page: meta.page, num_pages: meta.totalPage }
        : undefined;

    return (
        <div>
            {/* Header */}
            <AdminPageHead
                title="Batches"
                description="Manage graduation batches. Active batches appear in the registration form."
            />

            <div className="admin-page-setup">
                <PrimaryButton
                    type="button"
                    title="Add Batch"
                    icon={<RiAddLine />}
                    iconSide="left"
                    onClick={() => { setEditBatch(null); setFormOpen(true); }}
                />

                <AdminBatchesTable
                    data={data?.data ?? []}
                    isLoading={isLoading}
                    isError={isError}
                    paginationOptions={paginationOptions}
                    pageSize={limit}
                    onPageChange={setPage}
                    onEdit={(b) => { setEditBatch(b); setFormOpen(true); }}
                    onDelete={setDeleteBatchId}
                    onToggle={handleToggle}
                    isToggling={isToggling}
                />

                <AdminBatchFormModal
                    open={formOpen}
                    onClose={() => { setFormOpen(false); setEditBatch(null); }}
                    batch={editBatch}
                />

                <DeleteAlertModal
                    open={!!deleteBatchId}
                    onClose={() => setDeleteBatchId(null)}
                    onConfirm={handleDelete}
                    isDeleting={isDeleting}
                    title="Delete Batch"
                    description="This will permanently delete the batch. This action cannot be undone."
                />
            </div>
        </div>
    );
};
export default AdminBatchesPage;