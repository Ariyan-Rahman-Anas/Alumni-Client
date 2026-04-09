"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider } from "react-hook-form";

import InputField from "@/components/shared/InputField";
import PrimaryButton from "@/components/shared/PrimaryButton";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useCreateBatchMutation, useUpdateBatchMutation, type Batch } from "@/redux/apis/batchApi";
import { useFormWithToast } from "@/hooks/useFormWithToast";
import { BATCH_FIELD_ORDER, BatchFormValues, batchSchema } from "./batchSchema";

interface AdminBatchFormModalProps {
    open: boolean;
    onClose: () => void;
    /** Pass a batch to switch to edit mode */
    batch?: Batch | null;
}

const AdminBatchFormModal = ({ open, onClose, batch }: AdminBatchFormModalProps) => {
    const isEdit = !!batch;
    const [createBatch, { isLoading: isCreating }] = useCreateBatchMutation();
    const [updateBatch, { isLoading: isUpdating }] = useUpdateBatchMutation();
    const isLoading = isCreating || isUpdating;

    const methods = useFormWithToast<BatchFormValues>(
        {
            resolver: zodResolver(batchSchema),
            defaultValues: { year: "" },
        },
        { fieldOrder: BATCH_FIELD_ORDER }
    );

    const { register, handleSubmit, reset, formState: { errors } } = methods;

    // Populate form when editing, reset when closing
    useEffect(() => {
        if (open) {
            reset({ year: batch ? String(batch.year) : "" });
        }
    }, [open, batch, reset]);

    const handleSubmitForm = async (data: BatchFormValues) => {
        const y = parseInt(data.year);
        if (!y || y < 1950 || y > 2150) {
            toast.error("Please enter a valid year (1950–2150)");
            return;
        }
        try {
            if (isEdit) {
                const res = await updateBatch({ id: batch._id, year: y }).unwrap();
                toast.success(res.message ?? "Batch updated successfully");
            } else {
                const res = await createBatch({ year: y }).unwrap();
                toast.success(res.message ?? "Batch created successfully");
            }
            onClose();
        } catch (err: unknown) {
            toast.error(
                (err as { data?: { message?: string } })?.data?.message ??
                `Failed to ${isEdit ? "update" : "create"} batch`
            );
        }
    };

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit Batch" : "Add New Batch"}</DialogTitle>
                </DialogHeader>
                <div className="py-2">
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
                            <InputField
                                type="number"
                                {...register("year")}
                                id="batch-year"
                                label="Batch Year"
                                placeholder="e.g. 2010"
                                error={errors.year?.message}
                            />
                            <div className="flex items-center justify-between gap-2">
                                <Button variant="outline" onClick={onClose} disabled={isLoading}>
                                    Cancel
                                </Button>
                                <PrimaryButton
                                    type="submit"
                                    title={isEdit ? "Save" : "Create"}
                                    loadingTitle={isEdit ? "Saving..." : "Creating..."}
                                    isLoading={isLoading}
                                />
                            </div>
                        </form>
                    </FormProvider>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AdminBatchFormModal;