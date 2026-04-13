"use client";

import { useState } from "react";
import { toast } from "sonner";
import { RiAddLine } from "react-icons/ri";

import PrimaryButton from "@/components/shared/PrimaryButton";
import DeleteAlertModal from "@/components/shared/DeleteAlertModal";
import AdminBatchesTable from "@/components/modules/admin/batches/AdminBatchesTable";
import AdminBatchFormModal from "@/components/modules/admin/batches/AdminBatchFormModal";
import {
    useGetAllBatchesQuery,
    useDeleteBatchMutation,
    useToggleBatchActiveMutation,
    type Batch,
} from "@/redux/apis/batchApi";

const AdminBatchesPage = () => {
    const [page, setPage] = useState(1);
    const limit = 10;

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
        <div className="p-6 md:p-8 max-w4xl">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">Batches</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Manage graduation batches. Active batches appear in the registration form.
                    </p>
                </div>
                <PrimaryButton
                    type="button"
                    title="Add Batch"
                    icon={<RiAddLine />}
                    iconSide="left"
                    onClick={() => { setEditBatch(null); setFormOpen(true); }}
                />
            </div>

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
    );
};
export default AdminBatchesPage;