"use client";

import { useEffect } from "react";
import { Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useFormWithToast } from "@/hooks/useFormWithToast";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import InputField from "@/components/shared/InputField";
import TextAreaBox from "@/components/shared/TextAreaBox";
import SingleSelect from "@/components/shared/SingleSelect";
import ImageUploadField from "@/components/shared/ImageUploadField";
import PrimaryButton from "@/components/shared/PrimaryButton";
import RichTextEditor from "@/components/shared/RichTextEditor";
import DatePickerSingle from "@/components/shared/DatePickerSingle";
import { RiCloseLine } from "react-icons/ri";

import {
    useCreateAnnouncementMutation,
    useUpdateAnnouncementMutation,
    type Announcement,
    type AnnouncementStatus,
    type AnnouncementPriority,
    type AnnouncementType,
} from "@/redux/apis/announcementApi";

/* ── Options ───────────────────────────────────────────────── */
const STATUS_OPTIONS: { label: string; value: AnnouncementStatus }[] = [
    { label: "Draft", value: "draft" },
    { label: "Published", value: "published" },
    { label: "Scheduled", value: "scheduled" },
    { label: "Archived", value: "archived" },
];

const PRIORITY_OPTIONS: { label: string; value: AnnouncementPriority }[] = [
    { label: "Normal", value: "normal" },
    { label: "High", value: "high" },
    { label: "Urgent", value: "urgent" },
];

const TYPE_OPTIONS: { label: string; value: AnnouncementType }[] = [
    { label: "General", value: "general" },
    { label: "Notice", value: "notice" },
    { label: "Event", value: "event" },
    { label: "News", value: "news" },
    { label: "Update", value: "update" },
    { label: "Alert", value: "alert" },
];

/* ── Zod schema ─────────────────────────────────────────────── */
const formSchema = z.object({
    title: z.string().trim().min(3, "Title must be at least 3 characters").max(200),
    description: z.string().trim().min(10, "Description must be at least 10 characters").max(500),
    body: z.string().optional(),
    status: z.enum(["draft", "published", "scheduled", "archived"]).optional(),
    priority: z.enum(["urgent", "high", "normal"]).optional(),
    type: z.enum(["general", "notice", "event", "news", "update", "alert"]).optional(),
    scheduledAt: z.string().optional(),
    expiresAt: z.string().optional(),
    isPinned: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
    tags: z.string().optional(), // comma-separated string → parsed to array on submit
    ctaLink: z.string().optional(),
    ctaLabel: z.string().max(50).optional(),
    coverImage: z.instanceof(File).nullable().optional(),
});

type FormValues = z.infer<typeof formSchema>;

/* ── Props ──────────────────────────────────────────────────── */
interface AdminAnnouncementFormModalProps {
    open: boolean;
    onClose: () => void;
    announcement?: Announcement | null;
}

/* ── Component ──────────────────────────────────────────────── */
const AdminAnnouncementFormModal = ({
    open,
    onClose,
    announcement,
}: AdminAnnouncementFormModalProps) => {
    const isEdit = !!announcement;

    const {
        register,
        handleSubmit,
        control,
        reset,
        watch,
        formState: { errors },
    } = useFormWithToast<FormValues>(
        {
            resolver: zodResolver(formSchema),
            defaultValues: {
                status: "draft",
                priority: "normal",
                type: "general",
                isPinned: false,
                isFeatured: false,
            },
        },
        { fieldOrder: ["title", "description", "body", "status", "priority", "type"] },
    );

    const [createAnnouncement, { isLoading: isCreating }] = useCreateAnnouncementMutation();
    const [updateAnnouncement, { isLoading: isUpdating }] = useUpdateAnnouncementMutation();
    const isSaving = isCreating || isUpdating;

    const statusValue = watch("status");

    // Populate form when editing
    useEffect(() => {
        if (announcement) {
            reset({
                title: announcement.title,
                description: announcement.description,
                body: announcement.body ?? "",
                status: announcement.status,
                priority: announcement.priority,
                type: announcement.type,
                scheduledAt: announcement.scheduledAt
                    ? new Date(announcement.scheduledAt).toISOString().slice(0, 16)
                    : "",
                expiresAt: announcement.expiresAt
                    ? new Date(announcement.expiresAt).toISOString().slice(0, 16)
                    : "",
                isPinned: announcement.isPinned,
                isFeatured: announcement.isFeatured,
                tags: announcement.tags?.join(", ") ?? "",
                ctaLink: announcement.ctaLink ?? "",
                ctaLabel: announcement.ctaLabel ?? "",
                coverImage: null,
            });
        } else {
            reset({
                status: "draft",
                priority: "normal",
                type: "general",
                isPinned: false,
                isFeatured: false,
                body: "",
                tags: "",
            });
        }
    }, [announcement, reset, open]);

    const onSubmit = async (values: FormValues) => {
        const tags = values.tags
            ? values.tags.split(",").map((t) => t.trim()).filter(Boolean)
            : [];

        const payload = {
            title: values.title,
            description: values.description,
            body: values.body,
            status: values.status,
            priority: values.priority,
            type: values.type,
            isPinned: values.isPinned,
            isFeatured: values.isFeatured,
            tags,
            ctaLink: values.ctaLink || undefined,
            ctaLabel: values.ctaLabel || undefined,
            scheduledAt: values.scheduledAt || undefined,
            expiresAt: values.expiresAt || undefined,
        };

        try {
            if (isEdit) {
                await updateAnnouncement({
                    id: announcement!._id,
                    payload,
                    coverImage: values.coverImage,
                }).unwrap();
                toast.success("Announcement updated!");
            } else {
                await createAnnouncement({
                    payload,
                    coverImage: values.coverImage,
                }).unwrap();
                toast.success("Announcement created!");
            }
            onClose();
        } catch (err: unknown) {
            toast.error(
                (err as { data?: { message?: string } })?.data?.message ?? "Something went wrong",
            );
        }
    };

    return (
        <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
            <SheetContent
                side="right"
                className="w-full sm:!max-w-3xl bg-white flex flex-col p-0 gap-0"
                showCloseButton={false}
            >
                {/* ── Sticky header ── */}
                <SheetHeader className="px-6 py-4 border-b border-surface-300 shrink-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <SheetTitle className="text-base font-semibold text-gray-900">
                                {isEdit ? "Edit Announcement" : "New Announcement"}
                            </SheetTitle>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {isEdit
                                    ? "Update the announcement details below."
                                    : "Fill in the details to publish a new announcement."}
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-gray-900"
                        >
                            <RiCloseLine className="text-lg" />
                        </Button>
                    </div>
                </SheetHeader>

                {/* ── Scrollable body + sticky footer ── */}
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col flex-1 min-h-0">
                    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">

                        {/* Title */}
                        <InputField
                            label="Title"
                            required
                            placeholder="Announcement title"
                            error={errors.title?.message}
                            {...register("title")}
                        />

                        {/* Description */}
                        <TextAreaBox
                            label="Short Description"
                            required
                            placeholder="Brief summary shown in listing cards (max 500 chars)"
                            rows={3}
                            error={errors.description?.message}
                            {...register("description")}
                        />

                        {/* Rich text body */}
                        <Controller
                            name="body"
                            control={control}
                            render={({ field }) => (
                                <RichTextEditor
                                    label="Full Content (Body)"
                                    placeholder="Write the full announcement content here..."
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                    error={errors.body?.message}
                                    minHeight={220}
                                />
                            )}
                        />

                        {/* Status / Priority / Type row */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <SingleSelect
                                        label="Status"
                                        required
                                        options={STATUS_OPTIONS}
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        error={errors.status?.message}
                                    />
                                )}
                            />
                            <Controller
                                name="priority"
                                control={control}
                                render={({ field }) => (
                                    <SingleSelect
                                        label="Priority"
                                        options={PRIORITY_OPTIONS}
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        error={errors.priority?.message}
                                    />
                                )}
                            />
                            <Controller
                                name="type"
                                control={control}
                                render={({ field }) => (
                                    <SingleSelect
                                        label="Type"
                                        options={TYPE_OPTIONS}
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        error={errors.type?.message}
                                    />
                                )}
                            />
                        </div>

                        {/* Scheduling */}
                        {statusValue === "scheduled" && (
                            <Controller
                                name="scheduledAt"
                                control={control}
                                render={({ field }) => (
                                    <DatePickerSingle
                                        label="Scheduled At"
                                        includeTime
                                        placeholder="Pick scheduled date & time"
                                        value={field.value ?? ""}
                                        onChange={field.onChange}
                                        error={errors.scheduledAt?.message}
                                    />
                                )}
                            />
                        )}

                        <Controller
                            name="expiresAt"
                            control={control}
                            render={({ field }) => (
                                <DatePickerSingle
                                    label="Expires At (optional)"
                                    includeTime
                                    placeholder="Pick expiry date & time"
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                    error={errors.expiresAt?.message}
                                    helperText="Announcement will auto-archive after this date"
                                />
                            )}
                        />

                        {/* CTA */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InputField
                                label="CTA Link (optional)"
                                placeholder="https://..."
                                {...register("ctaLink")}
                                error={errors.ctaLink?.message}
                            />
                            <InputField
                                label="CTA Label (optional)"
                                placeholder="e.g. Register Now"
                                {...register("ctaLabel")}
                                error={errors.ctaLabel?.message}
                            />
                        </div>

                        {/* Tags */}
                        <InputField
                            label="Tags (optional)"
                            placeholder="Comma-separated, e.g. reunion, scholarship"
                            helperText="Used for search and filtering"
                            {...register("tags")}
                        />

                        {/* Flags */}
                        <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    className="rounded border-surface-300 text-primary2-600 focus:ring-primary2-500"
                                    {...register("isPinned")}
                                />
                                <span className="text-sm font-medium">Pin to top</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    className="rounded border-surface-300 text-primary2-600 focus:ring-primary2-500"
                                    {...register("isFeatured")}
                                />
                                <span className="text-sm font-medium">Featured</span>
                            </label>
                        </div>

                        {/* Cover image */}
                        <Controller
                            name="coverImage"
                            control={control}
                            render={({ field }) => (
                                <ImageUploadField
                                    label="Cover Image (optional)"
                                    value={field.value ?? null}
                                    onChange={field.onChange}
                                    previewUrl={announcement?.coverImage}
                                    error={errors.coverImage?.message as string}
                                />
                            )}
                        />
                    </div>

                    {/* ── Sticky footer ── */}
                    <div className="px-6 py-4 border-t border-surface-300 bg-white shrink-0 flex items-center justify-between gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isSaving}
                            className="border-surface-300 text-gray-600 hover:text-gray-900"
                        >
                            Cancel
                        </Button>
                        <PrimaryButton
                            type="submit"
                            title={isEdit ? "Save Changes" : "Create Announcement"}
                            isLoading={isSaving}
                            isDisabled={isSaving}
                        />
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
};
export default AdminAnnouncementFormModal;
