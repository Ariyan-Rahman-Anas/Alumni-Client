"use client";

import { useState } from "react";
import { toast } from "sonner";
import { RiAddLine, RiDeleteBinLine, RiEditLine, RiToggleLine, RiToggleFill } from "react-icons/ri";

import DataTable from "@/components/shared/dataTable/DataTable";
import InputField from "@/components/shared/InputField";
import PrimaryButton from "@/components/shared/PrimaryButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { TableColumn } from "@/types";
import {
    useGetAllBatchesQuery,
    useCreateBatchMutation,
    useUpdateBatchMutation,
    useDeleteBatchMutation,
    useToggleBatchActiveMutation,
    type Batch,
} from "@/redux/apis/batchApi";

const AdminBatchesPage = () => {
    const [page, setPage] = useState(1);
    const limit = 10;

    // Modals
    const [createOpen, setCreateOpen] = useState(false);
    const [editBatch, setEditBatch] = useState<Batch | null>(null);
    const [deleteBatchId, setDeleteBatchId] = useState<string | null>(null);

    // Form state
    const [createYear, setCreateYear] = useState("");
    const [editYear, setEditYear] = useState("");

    const { data, isLoading, isError } = useGetAllBatchesQuery({ page, limit });
    const [createBatch, { isLoading: isCreating }] = useCreateBatchMutation();
    const [updateBatch, { isLoading: isUpdating }] = useUpdateBatchMutation();
    const [deleteBatch, { isLoading: isDeleting }] = useDeleteBatchMutation();
    const [toggleBatchActive, { isLoading: isToggling }] = useToggleBatchActiveMutation();

    const handleCreate = async () => {
        const year = parseInt(createYear);
        if (!year || year < 1900 || year > 2100) {
            toast.error("Please enter a valid year (1900–2100)");
            return;
        }
        try {
            await createBatch({ year }).unwrap();
            toast.success("Batch created successfully");
            setCreateOpen(false);
            setCreateYear("");
        } catch (err: unknown) {
            toast.error((err as { data?: { message?: string } })?.data?.message ?? "Failed to create batch");
        }
    };

    const handleUpdate = async () => {
        if (!editBatch) return;
        const year = parseInt(editYear);
        if (!year || year < 1900 || year > 2100) {
            toast.error("Please enter a valid year (1900–2100)");
            return;
        }
        try {
            await updateBatch({ id: editBatch._id, year }).unwrap();
            toast.success("Batch updated successfully");
            setEditBatch(null);
        } catch (err: unknown) {
            toast.error((err as { data?: { message?: string } })?.data?.message ?? "Failed to update batch");
        }
    };

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

    const columns: TableColumn<Batch>[] = [
        { key: "index", label: "#", width: "60px" },
        { key: "year", label: "Batch Year", width: "140px" },
        {
            key: "isActive",
            label: "Status",
            render: (b) => (
                <Badge variant={b.isActive ? "default" : "secondary"} className={b.isActive ? "bg-emerald-100 text-emerald-700 border-emerald-200" : ""}>
                    {b.isActive ? "Active" : "Inactive"}
                </Badge>
            ),
        },
        {
            key: "actions",
            label: "Actions",
            width: "160px",
            render: (b) => (
                <div className="flex items-center justify-center gap-1.5">
                    <Button
                        size="icon"
                        variant="ghost"
                        title={b.isActive ? "Deactivate" : "Activate"}
                        disabled={isToggling}
                        onClick={() => handleToggle(b)}
                        className="h-8 w-8 text-primary2-600 hover:bg-primary2-50"
                    >
                        {b.isActive ? <RiToggleFill className="text-lg" /> : <RiToggleLine className="text-lg" />}
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        title="Edit"
                        onClick={() => { setEditBatch(b); setEditYear(String(b.year)); }}
                        className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                    >
                        <RiEditLine className="text-base" />
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        title="Delete"
                        onClick={() => setDeleteBatchId(b._id)}
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
        <div className="p-6 md:p-8 max-w-4xl">
            {/* Header */}
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
                    onClick={() => setCreateOpen(true)}
                />
            </div>

            <DataTable<Batch>
                data={data?.data ?? []}
                columns={columns}
                isLoading={isLoading}
                isError={isError}
                errorMessage="Failed to load batches"
                emptyMessage="No batches found"
                isPaginate={!!paginationOptions}
                paginationOptions={paginationOptions}
                pageSize={limit}
                onPageChange={setPage}
            />

            {/* Create Dialog */}
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Add New Batch</DialogTitle>
                    </DialogHeader>
                    <div className="py-2">
                        <InputField
                            id="create-batch-year"
                            label="Batch Year"
                            type="number"
                            placeholder="e.g. 2010"
                            value={createYear}
                            onChange={(e) => setCreateYear(e.target.value)}
                            required
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                        <PrimaryButton
                            type="button"
                            title="Create"
                            loadingTitle="Creating..."
                            isLoading={isCreating}
                            onClick={handleCreate}
                        />
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={!!editBatch} onOpenChange={(o) => !o && setEditBatch(null)}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Edit Batch</DialogTitle>
                    </DialogHeader>
                    <div className="py-2">
                        <InputField
                            id="edit-batch-year"
                            label="Batch Year"
                            type="number"
                            placeholder="e.g. 2010"
                            value={editYear}
                            onChange={(e) => setEditYear(e.target.value)}
                            required
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditBatch(null)}>Cancel</Button>
                        <PrimaryButton
                            type="button"
                            title="Save"
                            loadingTitle="Saving..."
                            isLoading={isUpdating}
                            onClick={handleUpdate}
                        />
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirm */}
            <AlertDialog open={!!deleteBatchId} onOpenChange={(o) => !o && setDeleteBatchId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Batch</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the batch. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default AdminBatchesPage;
