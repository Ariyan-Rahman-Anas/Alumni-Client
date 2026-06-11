"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { RiAddLine, RiCloseLine, RiDeleteBinLine } from "react-icons/ri";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import InputField from "@/components/shared/InputField";
import TextAreaBox from "@/components/shared/TextAreaBox";
import PrimaryButton from "@/components/shared/PrimaryButton";
import SingleSelect from "@/components/shared/SingleSelect";

import {
    useCreateCommitteeMutation,
    useUpdateCommitteeMutation,
} from "@/redux/apis/committeeApi";
import { useGetAllApprovedUsersQuery } from "@/redux/apis/userApi";
import type { ICommittee, ICommitteeMemberUser } from "@/types/common/committee.types";
import type { IServerErrorRes } from "@/types/common.components.types";

/* ── Zod schema ──────────────────────────────────────────── */
const memberSchema = z.object({
    member: z.string().min(1, "Member is required"),
    designation: z.string().trim().min(2, "Designation is required").max(100),
});

const formSchema = z.object({
    name: z.string().trim().min(2, "Name is required").max(150),
    description: z.string().trim().max(500).optional(),
    functionalFrom: z.string().min(1, "Start date is required"),
    functionalTo: z.string().optional(),
    isActive: z.boolean().optional(),
    members: z.array(memberSchema).min(1, "At least one member is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface AdminCommitteeFormModalProps {
    open: boolean;
    onClose: () => void;
    committee?: ICommittee | null;
}

const AdminCommitteeFormModal = ({ open, onClose, committee }: AdminCommitteeFormModalProps) => {
    const isEdit = !!committee;

    const { data: usersData } = useGetAllApprovedUsersQuery({ limit: 500 });
    const userOptions = (usersData?.data ?? []).map((u) => ({
        label: `${u.name} (Batch ${u.batch})`,
        value: u._id,
    }));

    const [createCommittee, { isLoading: isCreating }] = useCreateCommitteeMutation();
    const [updateCommittee, { isLoading: isUpdating }] = useUpdateCommitteeMutation();
    const isSubmitting = isCreating || isUpdating;

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            functionalFrom: "",
            functionalTo: "",
            isActive: false,
            members: [{ member: "", designation: "" }],
        },
    });

    const { fields, append, remove } = useFieldArray({ control, name: "members" });

    useEffect(() => {
        if (committee) {
            reset({
                name: committee.name,
                description: committee.description ?? "",
                functionalFrom: committee.functionalFrom?.slice(0, 10) ?? "",
                functionalTo: committee.functionalTo?.slice(0, 10) ?? "",
                isActive: committee.isActive,
                members: committee.members.map((m) => ({
                    member: typeof m.member === "object" ? (m.member as ICommitteeMemberUser)._id : (m.member as string),
                    designation: m.designation,
                })),
            });
        } else {
            reset({
                name: "",
                description: "",
                functionalFrom: "",
                functionalTo: "",
                isActive: false,
                members: [{ member: "", designation: "" }],
            });
        }
    }, [committee, reset, open]);

    const onSubmit = async (values: FormValues) => {
        try {
            const payload = {
                ...values,
                functionalTo: values.functionalTo || undefined,
                description: values.description || undefined,
            };

            if (isEdit) {
                await updateCommittee({ id: committee!._id, body: payload }).unwrap();
                toast.success("Committee updated successfully!");
            } else {
                await createCommittee(payload).unwrap();
                toast.success("Committee created successfully!");
            }
            onClose();
        } catch (err: unknown) {
            const error = err as IServerErrorRes;
            toast.error(error?.data?.message ?? "Something went wrong");
        }
    };

    return (
        <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
            <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
                <SheetHeader className="mb-6">
                    <div className="flex items-center justify-between">
                        <SheetTitle>{isEdit ? "Edit Committee" : "Create Committee"}</SheetTitle>
                        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                            <RiCloseLine size={20} />
                        </button>
                    </div>
                </SheetHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Name */}
                    <InputField
                        label="Committee Name"
                        placeholder="e.g. Alumni Executive Committee 2024"
                        {...register("name")}
                        error={errors.name?.message}
                    />

                    {/* Description */}
                    <TextAreaBox
                        label="Description (optional)"
                        placeholder="Brief description of this committee"
                        rows={3}
                        {...register("description")}
                        error={errors.description?.message}
                    />

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-3">
                        <InputField
                            label="Functional From"
                            type="date"
                            {...register("functionalFrom")}
                            error={errors.functionalFrom?.message}
                        />
                        <InputField
                            label="Functional To (optional)"
                            type="date"
                            {...register("functionalTo")}
                            error={errors.functionalTo?.message}
                        />
                    </div>

                    {/* Is Active */}
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <Controller
                            control={control}
                            name="isActive"
                            render={({ field }) => (
                                <input
                                    type="checkbox"
                                    checked={!!field.value}
                                    onChange={(e) => field.onChange(e.target.checked)}
                                    className="w-4 h-4 accent-primary"
                                />
                            )}
                        />
                        <span className="text-sm font-medium">Set as active committee</span>
                    </label>

                    {/* Members */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">Members</p>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => append({ member: "", designation: "" })}
                                className="flex items-center gap-1 text-xs"
                            >
                                <RiAddLine size={14} /> Add Member
                            </Button>
                        </div>

                        {fields.map((field, index) => (
                            <div key={field.id} className="flex gap-2 items-start border rounded-lg p-3">
                                <div className="flex-1 space-y-2">
                                    <Controller
                                        control={control}
                                        name={`members.${index}.member`}
                                        render={({ field: f }) => (
                                            <SingleSelect
                                                options={userOptions}
                                                value={f.value}
                                                onValueChange={f.onChange}
                                                placeholder="Select member"
                                                error={errors.members?.[index]?.member?.message}
                                            />
                                        )}
                                    />
                                    <InputField
                                        placeholder="Designation (e.g. President)"
                                        {...register(`members.${index}.designation`)}
                                        error={errors.members?.[index]?.designation?.message}
                                    />
                                </div>
                                {fields.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="mt-1 p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                                    >
                                        <RiDeleteBinLine size={15} />
                                    </button>
                                )}
                            </div>
                        ))}
                        {errors.members?.root?.message && (
                            <p className="text-xs text-destructive">{errors.members.root.message}</p>
                        )}
                    </div>

                    {/* Submit */}
                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                            Cancel
                        </Button>
                        <PrimaryButton
                            type="submit"
                            title={isEdit ? "Save Changes" : "Create Committee"}
                            className="flex-1"
                            disabled={isSubmitting}
                        />
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
};

export default AdminCommitteeFormModal;
