"use client";

import { useEffect } from "react";
import { useFieldArray, Controller, Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { RiAddLine, RiDeleteBinLine } from "react-icons/ri";

import {
    Sheet,
    SheetContent,
    SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import InputField from "@/components/shared/InputField";
import TextAreaBox from "@/components/shared/TextAreaBox";
import PrimaryButton from "@/components/shared/PrimaryButton";
import SingleSelect from "@/components/shared/SingleSelect";
import DatePickerSingle from "@/components/shared/DatePickerSingle";
import CheckBox from "@/components/shared/CheckBox";

import {
    useCreateCommitteeMutation,
    useUpdateCommitteeMutation,
} from "@/redux/apis/committeeApi";
import { useGetAllApprovedUsersQuery } from "@/redux/apis/userApi";
import { useFormWithToast } from "@/hooks/useFormWithToast";
import type { ICommittee, ICommitteeMemberUser } from "@/types/common/committee.types";
import type { IServerErrorRes } from "@/types/common.components.types";

/* ── Designation options ─────────────────────────────────── */
const DESIGNATION_OPTIONS = [
    { label: "President", value: "PRESIDENT" },
    { label: "Vice President", value: "VICE_PRESIDENT" },
    { label: "General Secretary", value: "GENERAL_SECRETARY" },
    { label: "Joint Secretary", value: "JOINT_SECRETARY" },
    { label: "Treasurer", value: "TREASURER" },
    { label: "Organizing Secretary", value: "ORGANIZING_SECRETARY" },
    { label: "Executive Member", value: "EXECUTIVE_MEMBER" },
    { label: "Member", value: "MEMBER" },
];

/* ── Zod schema ──────────────────────────────────────────── */
const memberSchema = z.object({
    member: z.string().min(1, "Please select a member"),
    designation: z.string().min(1, "Please select a designation"),
});

const formSchema = z.object({
    name: z.string().trim().min(2, "Committee name is required").max(150),
    description: z.string().trim().max(500).optional(),
    functionalFrom: z.string().min(1, "Start date is required"),
    functionalTo: z.string().optional(),
    isActive: z.boolean().optional(),
    members: z.array(memberSchema).min(1, "At least one member is required"),
});

type FormValues = z.infer<typeof formSchema>;

const FIELD_ORDER: Path<FormValues>[] = [
    "name",
    "description",
    "functionalFrom",
    "members",
];

/* ── Props ───────────────────────────────────────────────── */
interface AdminCommitteeFormModalProps {
    open: boolean;
    onClose: () => void;
    committee?: ICommittee | null;
}

/* ── Component ───────────────────────────────────────────── */
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
        watch,
        setValue,
        formState: { errors },
    } = useFormWithToast<FormValues>(
        {
            resolver: zodResolver(formSchema),
            defaultValues: {
                name: "",
                description: "",
                functionalFrom: "",
                functionalTo: "",
                isActive: false,
                members: [{ member: "", designation: "" }],
            },
        },
        { fieldOrder: FIELD_ORDER }
    );

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

    const isActive = watch("isActive");

    return (
        <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
            <SheetContent
                side="right"
                className="w-full sm:max-w-lg flex flex-col p-0 overflow-hidden gap-0"
            >
                {/* ── Header ───────────────────────────────── */}
                <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
                    <SheetTitle className="text-base font-semibold">
                        {isEdit ? "Edit Committee" : "Create Committee"}
                    </SheetTitle>
                </div>

                {/* ── Body + Footer ────────────────────────── */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col flex-1 overflow-hidden"
                >
                    {/* Scrollable fields */}
                    <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                        {/* Name */}
                        <InputField
                            label="Committee Name"
                            placeholder="e.g. Alumni Executive Committee 2024"
                            {...register("name")}
                            error={errors.name?.message}
                            required={true}
                        />

                        {/* Description */}
                        <TextAreaBox
                            label="Description"
                            placeholder="Brief description of this committee"
                            rows={3}
                            {...register("description")}
                            error={errors.description?.message}
                        />

                        {/* Dates */}
                        <div className="grid grid-cols-1 gap-3">
                            <Controller
                                control={control}
                                name="functionalFrom"
                                render={({ field }) => (
                                    <DatePickerSingle
                                        label="Functional From"
                                        value={field.value}
                                        onChange={field.onChange}
                                        error={errors.functionalFrom?.message}
                                        required={true}
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                name="functionalTo"
                                render={({ field }) => (
                                    <DatePickerSingle
                                        label="Functional To"
                                        value={field.value}
                                        onChange={field.onChange}
                                        error={errors.functionalTo?.message}
                                    />
                                )}
                            />
                        </div>

                        {/* Is Active */}
                        <CheckBox
                            name="isActive"
                            label="Set as active committee"
                            checked={!!isActive}
                            checkedFunc={(val: boolean) => setValue("isActive", val)}
                        />

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
                                                    label="Member"
                                                    options={userOptions}
                                                    value={f.value}
                                                    onValueChange={f.onChange}
                                                    placeholder="Select member"
                                                    error={errors.members?.[index]?.member?.message}
                            required={true}
                                                />
                                            )}
                                        />
                                        <Controller
                                            control={control}
                                            name={`members.${index}.designation`}
                                            render={({ field: f }) => (
                                                <SingleSelect
                                                    label="Designation"
                                                    options={DESIGNATION_OPTIONS}
                                                    value={f.value}
                                                    onValueChange={f.onChange}
                                                    placeholder="Select designation"
                                                    error={errors.members?.[index]?.designation?.message}
                                                    searchable={false}
                            required={true}
                                                />
                                            )}
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
                    </div>

                    {/* ── Footer ───────────────────────────── */}
                    <div className="flex gap-3 px-6 py-4 border-t shrink-0">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <PrimaryButton
                            type="submit"
                            title={isEdit ? "Save Changes" : "Create Committee"}
                            className="flex-1"
                            isDisabled={isSubmitting}
                            isLoading={isSubmitting}
                        />
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
};

export default AdminCommitteeFormModal;
