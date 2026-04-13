"use client";

import { useEffect, useState } from "react";
import type { Resolver } from "react-hook-form";
import { useFieldArray, Controller, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { RiAddLine, RiCloseLine, RiDeleteBinLine } from "react-icons/ri";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import CheckBox from "@/components/shared/CheckBox";
import DatePickerSingle from "@/components/shared/DatePickerSingle";
import ImageUploadField from "@/components/shared/ImageUploadField";
import InputField from "@/components/shared/InputField";
import PrimaryButton from "@/components/shared/PrimaryButton";
import SingleSelect from "@/components/shared/SingleSelect";
import TextAreaBox from "@/components/shared/TextAreaBox";
import { useCreateEventMutation, useUpdateEventMutation, type Event } from "@/redux/apis/eventApi";
import { useFormWithToast } from "@/hooks/useFormWithToast";
import {
    eventSchema,
    buildEventFormData,
    EVENT_CATEGORIES,
    EVENT_STATUSES,
    LOCATION_TYPES,
    type EventFormValues,
    eventFieldOrder,
} from "./eventSchema";

interface AdminEventFormModalProps {
    open: boolean;
    onClose: () => void;
    event?: Event | null;
}

/* ── Convert UTC ISO → "yyyy-MM-dd'T'HH:mm" local for DatePickerSingle ── */
const toLocalDT = (iso?: string): string => {
    if (!iso) return "";
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

/* ── Static option lists ── */
const CATEGORY_OPTIONS = EVENT_CATEGORIES.map((c) => ({ label: c, value: c }));
const STATUS_OPTIONS = EVENT_STATUSES.map((s) => ({ label: s, value: s }));
const LOCATION_OPTIONS = LOCATION_TYPES.map((l) => ({ label: l, value: l }));

/* ════════════════════════════════════════════════
   Form Modal
════════════════════════════════════════════════ */
const AdminEventFormModal = ({ open, onClose, event }: AdminEventFormModalProps) => {
    const isEdit = !!event;

    const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();
    const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();
    const isLoading = isCreating || isUpdating;

    const [imageFile, setImageFile] = useState<File | null>(null);

    const methods = useFormWithToast<EventFormValues>(
        {
            resolver: zodResolver(eventSchema) as unknown as Resolver<EventFormValues>,
            defaultValues: {
                title: "",
                description: "",
                category: undefined,
                status: "UPCOMING",
                startDateTime: "",
                endDateTime: "",
                locationType: "PHYSICAL",
                venue: "",
                meetingLink: "",
                organizer: "",
                contactInfo: "",
                isRegistrationRequired: false,
                registrationOpensAt: "",
                registrationDeadline: "",
                maxAttendees: "",
                isFree: true,
                priceTiers: [],
                allowGuests: false,
                maxGuestsPerAlumni: 1,
                guestFee: 0,
                collectsTShirtSize: false,
                eventFlow: [],
                isPublished: false,
                isFeatured: false,
            },
        },
        { fieldOrder: eventFieldOrder }
    );

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = methods;

    /* ── Populate form when editing ── */
    useEffect(() => {
        if (!open) return;
        if (event) {
            reset({
                title: event.title ?? "",
                description: event.description ?? "",
                category: event.category as EventFormValues["category"],
                status: event.status as EventFormValues["status"],
                startDateTime: toLocalDT(event.startDateTime),
                endDateTime: toLocalDT(event.endDateTime),
                locationType: event.locationType as EventFormValues["locationType"],
                venue: event.venue ?? "",
                meetingLink: event.meetingLink ?? "",
                organizer: event.organizer ?? "",
                contactInfo: event.contactInfo ?? "",
                isRegistrationRequired: event.isRegistrationRequired ?? false,
                registrationOpensAt: toLocalDT(event.registrationOpensAt),
                registrationDeadline: toLocalDT(event.registrationDeadline),
                maxAttendees: event.maxAttendees ?? "",
                isFree: event.isFree ?? true,
                priceTiers: (event.priceTiers ?? []).map((t) => ({
                    label: t.label,
                    fee: t.fee,
                    batchFrom: t.batchFrom ?? "",
                    batchTo: t.batchTo ?? "",
                })),
                allowGuests: event.allowGuests ?? false,
                maxGuestsPerAlumni: event.maxGuestsPerAlumni ?? 1,
                guestFee: event.guestFee ?? 0,
                collectsTShirtSize: event.collectsTShirtSize ?? false,
                eventFlow: (event.eventFlow ?? []).map((v) => ({ value: v })),
                isPublished: event.isPublished ?? false,
                isFeatured: event.isFeatured ?? false,
            });
        } else {
            reset();
        }
        setImageFile(null);
    }, [open, event, reset]);

    /* ── Field arrays ── */
    const { fields: tierFields, append: appendTier, remove: removeTier } =
        useFieldArray({ control, name: "priceTiers" });

    const { fields: flowFields, append: appendFlow, remove: removeFlow } =
        useFieldArray({ control, name: "eventFlow" });

    /* ── Watched conditionals ── */
    const locationType = watch("locationType");
    const isFree = watch("isFree");
    const isRegistrationRequired = watch("isRegistrationRequired");
    const allowGuests = watch("allowGuests");

    /* ── Submit ── */
    const onSubmit = async (data: EventFormValues) => {
        const fd = buildEventFormData(data, imageFile);
        try {
            if (isEdit) {
                const res = await updateEvent({ id: event._id, body: fd }).unwrap();
                toast.success(res.message ?? "Event updated");
            } else {
                const res = await createEvent(fd).unwrap();
                toast.success(res.message ?? "Event created");
            }
            onClose();
        } catch (err: unknown) {
            toast.error(
                (err as { data?: { message?: string } })?.data?.message ??
                `Failed to ${isEdit ? "update" : "create"} event`
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
                {/* ── Header ── */}
                <SheetHeader className="px-6 py-4 border-b border-surface-300 shrink-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <SheetTitle className="text-base font-semibold text-gray-900">
                                {isEdit ? "Edit Event" : "Create New Event"}
                            </SheetTitle>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {isEdit
                                    ? "Update the event details below."
                                    : "Fill in the details to publish a new event."}
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

                {/* ── Scrollable body + footer wrapped in form ── */}
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)}
                        noValidate
                        className="flex flex-col flex-1 min-h-0">
                        <div className="flex-1 overflow-y-auto px-6 py-6">
                            <div className="space-y-8">

                                {/* Cover Image */}
                                <section>
                                    <ImageUploadField
                                        value={imageFile}
                                        onChange={setImageFile}
                                        previewUrl={event?.coverImage}
                                        label="Cover Image"
                                        helperText="JPG, PNG or WebP · Max 5 MB"
                                    />
                                </section>

                                {/* Basic Info */}
                                <section>
                                    <InputField
                                        {...register("title")}
                                        id="ev-title"
                                        label="Title"
                                        placeholder="e.g. Annual Alumni Reunion 2025"
                                        error={errors.title?.message}
                                        required
                                    />
                                    <TextAreaBox
                                        {...register("description")}
                                        id="ev-description"
                                        label="Description"
                                        placeholder="Describe the event..."
                                        error={errors.description?.message}
                                        rows={3}
                                        required
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        <Controller
                                            name="category"
                                            control={control}
                                            render={({ field }) => (
                                                <SingleSelect
                                                    label="Category"
                                                    options={CATEGORY_OPTIONS}
                                                    value={field.value ?? ""}
                                                    onValueChange={field.onChange}
                                                    placeholder="Select category"
                                                    error={!!errors.category}
                                                    helperText={errors.category?.message}
                                                    required
                                                    isRequiredSign
                                                />
                                            )}
                                        />
                                        <Controller
                                            name="status"
                                            control={control}
                                            render={({ field }) => (
                                                <SingleSelect
                                                    label="Status"
                                                    options={STATUS_OPTIONS}
                                                    value={field.value ?? ""}
                                                    onValueChange={field.onChange}
                                                    placeholder="Select status"
                                                />
                                            )}
                                        />
                                    </div>
                                </section>

                                {/* Schedule */}
                                <section >
                                    <div className="grid grid-cols-2 gap-3">
                                        <Controller
                                            name="startDateTime"
                                            control={control}
                                            render={({ field }) => (
                                                <DatePickerSingle
                                                    id="ev-start"
                                                    label="Start Date & Time"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    includeTime
                                                    placeholder="Pick start date & time"
                                                    error={errors.startDateTime?.message}
                                                    required
                                                />
                                            )}
                                        />
                                        <Controller
                                            name="endDateTime"
                                            control={control}
                                            render={({ field }) => (
                                                <DatePickerSingle
                                                    id="ev-end"
                                                    label="End Date & Time"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    includeTime
                                                    placeholder="Pick end date & time"
                                                    error={errors.endDateTime?.message}
                                                />
                                            )}
                                        />
                                    </div>
                                </section>

                                {/* Location */}
                                <section >
                                    <div className="grid grid-cols-3 gap-3">
                                        <Controller
                                            name="locationType"
                                            control={control}
                                            render={({ field }) => (
                                                <SingleSelect
                                                    label="Type"
                                                    options={LOCATION_OPTIONS}
                                                    value={field.value ?? "PHYSICAL"}
                                                    onValueChange={field.onChange}
                                                    searchable={false}
                                                />
                                            )}
                                        />
                                        <div className="col-span-2">
                                            <InputField
                                                {...register("venue")}
                                                id="ev-venue"
                                                label="Venue / Address"
                                                placeholder="e.g. BAMHS Auditorium, Dhaka"
                                                error={errors.venue?.message}
                                            />
                                        </div>
                                    </div>
                                    {(locationType === "ONLINE" || locationType === "HYBRID") && (
                                        <InputField
                                            {...register("meetingLink")}
                                            id="ev-meeting"
                                            label="Meeting Link"
                                            placeholder="https://meet.google.com/..."
                                            error={errors.meetingLink?.message}
                                        />
                                    )}
                                </section>

                                {/* Organizer */}
                                <section >
                                    <div className="grid grid-cols-2 gap-3">
                                        <InputField
                                            {...register("organizer")}
                                            id="ev-organizer"
                                            label="Organizer Name"
                                            placeholder="e.g. BAMHS Alumni Cell"
                                            error={errors.organizer?.message}
                                        />
                                        <InputField
                                            {...register("contactInfo")}
                                            id="ev-contact"
                                            label="Contact Info"
                                            placeholder="e.g. +880 1700-000000"
                                            error={errors.contactInfo?.message}
                                        />
                                    </div>
                                </section>

                                {/* Registration */}
                                <section>
                                    <CheckBox
                                        name="isRegistrationRequired"
                                        label="Registration Required"
                                        register={register}
                                        checked={isRegistrationRequired}
                                        checkedFunc={(val: boolean) =>
                                            setValue("isRegistrationRequired", val)
                                        }
                                    />
                                    {isRegistrationRequired && (
                                        <div className="pl-7 space-y-3 pt-1 animate-in fade-in-0 slide-in-from-top-1 duration-200">
                                            <div className="grid grid-cols-2 gap-3">
                                                <Controller
                                                    name="registrationOpensAt"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <DatePickerSingle
                                                            id="ev-reg-opens"
                                                            label="Registration Opens At"
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            includeTime
                                                            placeholder="Pick date & time"
                                                            error={errors.registrationOpensAt?.message}
                                                        />
                                                    )}
                                                />
                                                <Controller
                                                    name="registrationDeadline"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <DatePickerSingle
                                                            id="ev-reg-deadline"
                                                            label="Registration Deadline"
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            includeTime
                                                            placeholder="Pick date & time"
                                                            error={errors.registrationDeadline?.message}
                                                        />
                                                    )}
                                                />
                                            </div>
                                            <InputField
                                                {...register("maxAttendees")}
                                                id="ev-max-attendees"
                                                type="number"
                                                label="Max Attendees"
                                                placeholder="Leave blank for unlimited"
                                                error={errors.maxAttendees?.message}
                                            />
                                        </div>
                                    )}
                                </section>

                                {/* Pricing */}
                                <section >
                                    <CheckBox
                                        name="isFree"
                                        label="Free Event (no registration fee)"
                                        register={register}
                                        checked={isFree}
                                        checkedFunc={(val: boolean) => setValue("isFree", val)}
                                    />
                                    {!isFree && (
                                        <div className="pl-7 space-y-3 pt-1 animate-in fade-in-0 slide-in-from-top-1 duration-200">
                                            {errors.priceTiers?.message && (
                                                <p className="text-xs text-red-500">{errors.priceTiers.message}</p>
                                            )}
                                            {tierFields.map((field, idx) => (
                                                <div
                                                    key={field.id}
                                                    className="rounded-lg border border-surface-300 bg-surface-50 p-3 space-y-2"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-semibold text-primary2-600">
                                                            Tier {idx + 1}
                                                        </span>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => removeTier(idx)}
                                                            className="h-6 w-6 p-0 text-danger hover:bg-danger-light"
                                                        >
                                                            <RiDeleteBinLine className="text-sm" />
                                                        </Button>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <InputField
                                                            {...register(`priceTiers.${idx}.label`)}
                                                            id={`tier-label-${idx}`}
                                                            label="Label"
                                                            placeholder="e.g. General"
                                                            error={errors.priceTiers?.[idx]?.label?.message}
                                                        />
                                                        <InputField
                                                            {...register(`priceTiers.${idx}.fee`)}
                                                            id={`tier-fee-${idx}`}
                                                            type="number"
                                                            label="Fee (BDT)"
                                                            placeholder="e.g. 500"
                                                            error={errors.priceTiers?.[idx]?.fee?.message}
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <InputField
                                                            {...register(`priceTiers.${idx}.batchFrom`)}
                                                            id={`tier-from-${idx}`}
                                                            type="number"
                                                            label="Batch From (optional)"
                                                            placeholder="e.g. 2000"
                                                        />
                                                        <InputField
                                                            {...register(`priceTiers.${idx}.batchTo`)}
                                                            id={`tier-to-${idx}`}
                                                            type="number"
                                                            label="Batch To (optional)"
                                                            placeholder="e.g. 2010"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    appendTier({ label: "", fee: 0, batchFrom: "", batchTo: "" })
                                                }
                                                className="text-xs h-8 border-primary2-200 text-primary2-600 hover:bg-primary2-50 hover:text-primary2-700"
                                            >
                                                <RiAddLine className="mr-1" /> Add Price Tier
                                            </Button>
                                        </div>
                                    )}
                                </section>

                                {/* Guests */}
                                <section>
                                    <CheckBox
                                        name="allowGuests"
                                        label="Allow Guests (alumni can bring additional guests)"
                                        register={register}
                                        checked={allowGuests}
                                        checkedFunc={(val: boolean) => setValue("allowGuests", val)}
                                    />
                                    {allowGuests && (
                                        <div className="pl-7 grid grid-cols-2 gap-3 pt-1 animate-in fade-in-0 slide-in-from-top-1 duration-200">
                                            <InputField
                                                {...register("maxGuestsPerAlumni")}
                                                id="ev-max-guests"
                                                type="number"
                                                label="Max Guests per Alumni"
                                                placeholder="e.g. 2"
                                                error={errors.maxGuestsPerAlumni?.message}
                                            />
                                            <InputField
                                                {...register("guestFee")}
                                                id="ev-guest-fee"
                                                type="number"
                                                label="Guest Fee (BDT)"
                                                placeholder="e.g. 300"
                                                error={errors.guestFee?.message}
                                            />
                                        </div>
                                    )}
                                </section>

                                {/* Options */}
                                <section >
                                    <CheckBox
                                        name="collectsTShirtSize"
                                        label="Collect T-shirt Size from participants"
                                        register={register}
                                        checked={watch("collectsTShirtSize")}
                                        checkedFunc={(val: boolean) => setValue("collectsTShirtSize", val)}
                                    />

                                    {/* Event flow / schedule */}
                                    <div className="space-y-2 pt-1">
                                        <p className="text-xs font-medium text-gray-700">
                                            Event Schedule / Flow
                                        </p>
                                        <div className="space-y-2">
                                            {flowFields.map((field, idx) => (
                                                <div key={field.id} className="flex items-center gap-2">
                                                    <span className="text-xs text-muted-foreground w-5 shrink-0 text-right">
                                                        {idx + 1}.
                                                    </span>
                                                    <input
                                                        {...register(`eventFlow.${idx}.value`)}
                                                        className="flex-1 h-9 rounded-lg border border-input bg-white px-3 text-sm outline-none focus:border-primary2-500 transition"
                                                        placeholder={`Step ${idx + 1}...`}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeFlow(idx)}
                                                        className="h-8 w-8 p-0 text-danger hover:bg-danger-light shrink-0"
                                                    >
                                                        <RiDeleteBinLine className="text-sm" />
                                                    </Button>
                                                </div>
                                            ))}
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => appendFlow({ value: "" })}
                                                className="text-xs h-7 border-surface-300 text-muted-foreground hover:text-gray-700"
                                            >
                                                <RiAddLine className="mr-1" /> Add Step
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Visibility */}
                                    <div className="space-y-2 pt-1">
                                        <p className="text-xs font-medium text-gray-700">Visibility</p>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="rounded-lg border border-surface-300 bg-surface-50 px-4 py-3">
                                                <CheckBox
                                                    name="isPublished"
                                                    label="Publish (visible on public pages)"
                                                    register={register}
                                                    checked={watch("isPublished")}
                                                    checkedFunc={(val: boolean) => setValue("isPublished", val)}
                                                />
                                            </div>
                                            <div className="rounded-lg border border-gold-200 bg-gold-50 px-4 py-3">
                                                <CheckBox
                                                    name="isFeatured"
                                                    label="Featured (highlight on homepage)"
                                                    register={register}
                                                    checked={watch("isFeatured")}
                                                    checkedFunc={(val: boolean) => setValue("isFeatured", val)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </section>

                            </div>
                        </div>

                        {/* ── Sticky footer ── */}
                        <div className="px-6 py-4 border-t border-surface-300 bg-white shrink-0 flex items-center justify-between gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={isLoading}
                                className="border-surface-300 text-gray-600 hover:text-gray-900"
                            >
                                Cancel
                            </Button>
                            <PrimaryButton
                                type="submit"
                                title={isEdit ? "Save Changes" : "Create Event"}
                                loadingTitle={isEdit ? "Saving..." : "Creating..."}
                                isLoading={isLoading}
                            />
                        </div>
                    </form>
                </FormProvider>
            </SheetContent>
        </Sheet>
    );
};
export default AdminEventFormModal;