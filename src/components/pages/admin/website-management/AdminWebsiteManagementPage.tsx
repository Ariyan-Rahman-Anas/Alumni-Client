"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
    RiGlobalLine,
    RiMapPin2Line,
    RiPhoneLine,
    RiShareLine,
    RiImageLine,
    RiSaveLine,
    RiAddLine,
    RiYoutubeLine,
    RiFacebookLine,
    RiWhatsappLine,
    RiMailLine,
    RiCheckLine,
    RiAlertLine,
    RiEditLine,
    RiPaletteLine,
} from "react-icons/ri";
import { motion } from "framer-motion";

import AdminPageHead from "@/components/shared/admin/AdminPageHead";
import InputField from "@/components/shared/InputField";
import PrimaryButton from "@/components/shared/PrimaryButton";
import ImageUploadField from "@/components/shared/ImageUploadField";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/slice/authSlice";
import { revalidateWebsiteLayout } from "@/app/actions";
import {
    useGetWebsiteManagementQuery,
    useCreateWebsiteManagementMutation,
    useUpdateWebsiteManagementMutation,
    type IWebsiteManagement,
} from "@/redux/apis/websiteManagementApi";

/* â”€â”€ Zod Schema â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const schema = z.object({
    motto: z.string().min(3, "Motto must be at least 3 characters").max(80, "Motto must be at most 80 characters"),
    schoolName: z.string().min(5, "School name must be at least 5 characters").max(150, "School name must be at most 150 characters"),
    fullAddress: z.string().max(180, "Full address must be at most 180 characters").optional(),
    postalCode: z.string({ error: "Postal code is required" }).min(4, "Postal code must be at least 4 digits").max(4, "Postal code must be at most 4 digits"),
    area: z.string().min(5, "Area must be at least 5 characters").max(70, "Area must be at most 70 characters"),
    thana: z.string().min(3, "Thana must be at least 3 characters").max(50, "Thana must be at most 50 characters"),
    district: z.string().min(3, "District must be at least 3 characters").max(50, "District must be at most 50 characters"),
    division: z.string().min(3, "Division must be at least 3 characters").max(50, "Division must be at most 50 characters"),
    country: z.string().min(4, "Country must be at least 4 characters").max(50, "Country must be at most 50 characters"),
    contactNumber: z.string().min(11, "Contact number must be 11â€“16 digits").max(16, "Contact number must be at most 16 digits"),
    email: z.string().email("Enter a valid email address").max(70, "Email must be at most 70 characters"),
    whatsappNumber: z.string().max(16, "WhatsApp number must be at most 16 digits").optional(),
    facebook: z.string().optional().refine(
        (v) => !v || /^https?:\/\/.+/.test(v),
        "Enter a valid Facebook URL"
    ),
    youtube: z.string().optional().refine(
        (v) => !v || /^https?:\/\/.+/.test(v),
        "Enter a valid YouTube URL"
    ),
    primaryColor: z
        .string()
        .regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color e.g. #2E8B57")
        .optional(),
    primaryColorDark: z
        .string()
        .refine((v) => !v || /^#[0-9A-Fa-f]{6}$/.test(v), "Must be a valid hex color or leave blank")
        .optional(),
    bloodBankColor: z
        .string()
        .regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color e.g. #DC143C")
        .optional(),
    bloodBankColorDark: z
        .string()
        .refine((v) => !v || /^#[0-9A-Fa-f]{6}$/.test(v), "Must be a valid hex color or leave blank")
        .optional(),
});

type TFormValues = z.infer<typeof schema>;

/* â”€â”€ Color picker field â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const SWATCH_OPACITIES = [0.96, 0.82, 0.61, 0.40, 1, 0.78, 0.58, 0.38] as const;
const SWATCH_SIZES = ["h-4 w-4", "h-5 w-5", "h-6 w-6", "h-7 w-7", "h-8 w-8", "h-7 w-7", "h-6 w-6", "h-5 w-5"] as const;

const ColorPickerField = ({
    label,
    hint,
    value,
    onChange,
    error,
}: {
    label: string;
    hint: string;
    value: string;
    onChange: (v: string) => void;
    error?: string;
}) => {
    const isSet = /^#[0-9A-Fa-f]{6}$/.test(value);
    return (
        <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold text-surface-700 dark:text-surface-300">{label}</p>
            {isSet ? (
                <div className="flex items-center gap-3">
                    {/* Native color wheel */}
                    <input
                        type="color"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="h-10 w-14 cursor-pointer rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 p-1 flex-shrink-0"
                    />
                    {/* Hex text input (synced) */}
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => {
                            const v = e.target.value;
                            if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) onChange(v);
                        }}
                        maxLength={7}
                        placeholder="#000000"
                        className="h-10 w-24 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 px-3 text-sm font-mono text-surface-800 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary2-400 flex-shrink-0"
                    />
                    {/* Live scale preview */}
                    <div className="flex gap-0.5 items-end overflow-hidden">
                        {SWATCH_OPACITIES.map((opacity, i) => (
                            <div
                                key={i}
                                title={["50", "200", "400", "600", "500 (base)", "600", "700", "800"][i]}
                                style={{ backgroundColor: value, opacity }}
                                className={`rounded-sm flex-shrink-0 ${SWATCH_SIZES[i]}${i === 4 ? " ring-1 ring-offset-1 ring-current" : ""}`}
                            />
                        ))}
                    </div>
                    {/* Clear button (for optional fields) */}
                    <button
                        type="button"
                        onClick={() => onChange("")}
                        className="ml-auto text-xs text-gunmetal-400 hover:text-rose-500 transition-colors"
                        title="Clear â€” reuse light mode color in dark mode"
                    >
                        âœ• Clear
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => onChange("#2E8B57")}
                    className="flex items-center gap-2 h-10 px-4 rounded-lg border border-dashed border-surface-300 dark:border-surface-600 text-xs text-surface-500 dark:text-surface-400 hover:border-primary2-400 hover:text-primary2-600 dark:hover:text-primary2-400 transition-colors w-fit"
                >
                    + Set a custom color
                </button>
            )}
            {error && <p className="text-xs text-red-500">{error}</p>}
            <p className="text-xs text-surface-500 dark:text-surface-400">{hint}</p>
        </div>
    );
};

/* â”€â”€ Section card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const SectionCard = ({
    title,
    icon,
    children,
    index,
}: {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    index: number;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.07, ease: "easeOut" }}
        className="rounded-2xl border border-surface-200 bg-white dark:bg-surface-900 dark:border-surface-700 p-6"
    >
        <div className="flex items-center gap-2.5 mb-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary2-50 dark:bg-primary2-900/30 text-primary2-700 dark:text-primary2-400 text-base">
                {icon}
            </span>
            <h3 className="text-sm font-semibold text-surface-800 dark:text-surface-100">{title}</h3>
        </div>
        {children}
    </motion.div>
);

/* â”€â”€ Main Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const AdminWebsiteManagementPage = () => {
    const currentUser = useAppSelector(selectCurrentUser);
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const isFirstRender = useRef(true);

    const { data: wmData, isLoading: isFetching, isError: fetchError } = useGetWebsiteManagementQuery();
    const existing: IWebsiteManagement | undefined = wmData?.data;
    const isNew = !isFetching && !existing;

    const [createWM, { isLoading: isCreating }] = useCreateWebsiteManagementMutation();
    const [updateWM, { isLoading: isUpdating }] = useUpdateWebsiteManagementMutation();
    const isSaving = isCreating || isUpdating;

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<TFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            motto: "",
            schoolName: "",
            fullAddress: "",
            postalCode: "",
            area: "",
            thana: "",
            district: "",
            division: "",
            country: "Bangladesh",
            contactNumber: "",
            email: "",
            whatsappNumber: "",
            facebook: "",
            youtube: "",
            primaryColor: "#2E8B57",
            primaryColorDark: "",
            bloodBankColor: "#DC143C",
            bloodBankColorDark: "",
        },
    });

    // Populate form once data is fetched
    useEffect(() => {
        if (existing && isFirstRender.current) {
            isFirstRender.current = false;
            reset({
                motto: existing.motto ?? "",
                schoolName: existing.schoolName ?? "",
                fullAddress: existing.fullAddress ?? "",
                postalCode: existing.postalCode,
                area: existing.area ?? "",
                thana: existing.thana ?? "",
                district: existing.district ?? "",
                division: existing.division ?? "",
                country: existing.country ?? "Bangladesh",
                contactNumber: existing.contactNumber ?? "",
                email: existing.email ?? "",
                whatsappNumber: existing.whatsappNumber ?? "",
                facebook: existing.facebook ?? "",
                youtube: existing.youtube ?? "",
                primaryColor: existing.primaryColor ?? "#2E8B57",
                primaryColorDark: existing.primaryColorDark ?? "",
                bloodBankColor: existing.bloodBankColor ?? "#DC143C",
                bloodBankColorDark: existing.bloodBankColorDark ?? "",
            });
        }
    }, [existing, reset]);

    const onSubmit = async (values: TFormValues) => {
        if (!isDirty && !bannerFile && !isNew) {
            toast.info("No changes to save.");
            return;
        }
        if (!currentUser?._id) {
            toast.error("Could not identify current user. Please refresh.");
            return;
        }

        const payload = {
            ...values,
            updatedBy: currentUser._id,
        };

        try {
            if (isNew) {
                const createRes = await createWM({ payload: payload as never, banner: bannerFile }).unwrap();
                toast.success(createRes?.message || "Website management settings created");
            } else {
                const updateRes = await updateWM({ payload, banner: bannerFile }).unwrap();
                toast.success(updateRes?.message || "Website management settings updated");
            }
            await revalidateWebsiteLayout();
            setBannerFile(null);
            isFirstRender.current = false;
        } catch { }
    };

    /* â”€â”€ Loading State â”€â”€â”€â”€ */
    if (isFetching) {
        return (
            <div className="admin-page-setup space-y-4 animate-pulse">
                <div className="h-8 w-48 rounded-lg bg-surface-200 dark:bg-surface-700" />
                <div className="h-4 w-72 rounded bg-surface-200 dark:bg-surface-700" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-48 rounded-2xl bg-surface-200 dark:bg-surface-700" />
                    ))}
                </div>
            </div>
        );
    }

    /* â”€â”€ Fetch Error â”€â”€â”€â”€ */
    if (fetchError && !isNew) {
        return (
            <div className="admin-page-setup flex flex-col items-center justify-center gap-3 py-20 text-center">
                <RiAlertLine className="text-4xl text-rose-400" />
                <p className="font-medium text-surface-700 dark:text-surface-300">Failed to load website settings</p>
                <p className="text-sm text-muted-foreground">Check the server connection and try again.</p>
            </div>
        );
    }

    return (
        <div className="admin-page-setup">
            {/* Header */}
            <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
                <div className="flex items-start gap-3">
                    <AdminPageHead
                        title="Website Management"
                        description="Control global website settings â€” contact info, social links, banner, and branding."
                    />
                </div>
                <div className="flex items-center gap-2">
                    {/* Status badge */}
                    {isNew ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-700/40">
                            <RiAddLine /> Not configured yet
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-primary2-50 text-primary2-700 border border-primary2-200 dark:bg-primary2-900/20 dark:text-primary2-400 dark:border-primary2-700/40">
                            <RiCheckLine /> Configured
                        </span>
                    )}
                    <PrimaryButton
                        type="button"
                        title={isNew ? "Create Settings" : "Save Changes"}
                        loadingTitle={isNew ? "Creating..." : "Saving..."}
                        icon={isNew ? <RiAddLine /> : <RiSaveLine />}
                        iconSide="left"
                        isLoading={isSaving}
                        isDisabled={isSaving}
                        onClick={handleSubmit(onSubmit)}
                    />
                </div>
            </div>

            {/* Edit mode indicator */}
            {!isNew && (
                <div className="flex items-center gap-2 mb-5 px-4 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/15 border border-blue-200 dark:border-blue-700/40">
                    <RiEditLine className="text-blue-600 dark:text-blue-400 text-base flex-shrink-0" />
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                        Editing existing configuration. Changes will overwrite current settings.
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                {/* â”€â”€ Row 1: Branding + Location â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                    {/* Branding */}
                    <SectionCard title="Branding" icon={<RiGlobalLine />} index={0}>
                        <div className="space-y-4">
                            <InputField
                                label="School Name"
                                placeholder="Battli Abdul Matin High School"
                                error={errors.schoolName?.message}
                                {...register("schoolName")}
                            />
                            <InputField
                                label="Motto"
                                placeholder="e.g. Illuminating Minds Since 1963"
                                error={errors.motto?.message}
                                {...register("motto")}
                            />
                        </div>
                    </SectionCard>

                    {/* Contact */}
                    <SectionCard title="Contact Information" icon={<RiPhoneLine />} index={1}>
                        <div className="space-y-4">
                            <InputField
                                label="Contact Number"
                                placeholder="+8801XXXXXXXXX"
                                icon={<RiPhoneLine />}
                                error={errors.contactNumber?.message}
                                {...register("contactNumber")}
                            />
                            <InputField
                                label="Email Address"
                                type="email"
                                placeholder="info@bamhs.edu.bd"
                                icon={<RiMailLine />}
                                error={errors.email?.message}
                                {...register("email")}
                            />
                            <InputField
                                label="WhatsApp Number"
                                placeholder="+8801XXXXXXXXX (optional)"
                                icon={<RiWhatsappLine />}
                                error={errors.whatsappNumber?.message}
                                {...register("whatsappNumber")}
                            />
                        </div>
                    </SectionCard>
                </div>

                {/* â”€â”€ Row 2: Address (full width) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
                <SectionCard title="Address & Location" icon={<RiMapPin2Line />} index={2}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="sm:col-span-2 lg:col-span-3">
                            <InputField
                                label="Full Address"
                                placeholder="Battali Bazar, Nangalkot, Cumilla (optional)"
                                error={errors.fullAddress?.message}
                                {...register("fullAddress")}
                            />
                        </div>
                        <InputField
                            label="Area / Village"
                            placeholder="Battali Bazar"
                            error={errors.area?.message}
                            {...register("area")}
                        />
                        <InputField
                            label="Thana / Upazila"
                            placeholder="Nangalkot"
                            error={errors.thana?.message}
                            {...register("thana")}
                        />
                        <InputField
                            label="District"
                            placeholder="Cumilla"
                            error={errors.district?.message}
                            {...register("district")}
                        />
                        <InputField
                            label="Division"
                            placeholder="Chattogram"
                            error={errors.division?.message}
                            {...register("division")}
                        />
                        <InputField
                            label="Country"
                            placeholder="Bangladesh"
                            error={errors.country?.message}
                            {...register("country")}
                        />
                        <InputField
                            label="Postal Code"
                            placeholder="3582"
                            type="number"
                            error={errors.postalCode?.message}
                            {...register("postalCode")}
                        />
                    </div>
                </SectionCard>

                {/* â”€â”€ Row 3: Social + Banner â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                    {/* Social Media */}
                    <SectionCard title="Social Media" icon={<RiShareLine />} index={3}>
                        <div className="space-y-4">
                            <InputField
                                label="Facebook Page URL"
                                placeholder="https://facebook.com/bamhs"
                                icon={<RiFacebookLine />}
                                error={errors.facebook?.message}
                                {...register("facebook")}
                            />
                            <InputField
                                label="YouTube Channel URL"
                                placeholder="https://youtube.com/@bamhs"
                                icon={<RiYoutubeLine />}
                                error={errors.youtube?.message}
                                {...register("youtube")}
                            />
                        </div>
                    </SectionCard>

                    {/* Banner Image */}
                    <SectionCard title="Banner / Hero Image" icon={<RiImageLine />} index={4}>
                        <Controller
                            name={"motto" as never}
                            control={control}
                            render={() => (
                                <ImageUploadField
                                    label="Banner Image"
                                    helperText="Recommended: 1920Ã—600px, JPG or PNG. This appears as the homepage hero banner."
                                    previewUrl={existing?.bannerUrl}
                                    value={bannerFile}
                                    onChange={(file) => setBannerFile(file)}
                                    maxSizeMB={8}
                                />
                            )}
                        />
                    </SectionCard>
                </div>

                {/* â”€â”€ Brand Colors â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
                <SectionCard title="Brand Colors" icon={<RiPaletteLine />} index={5}>
                    {/* Light mode row */}
                    <p className="text-xs font-semibold uppercase tracking-widest text-gunmetal-400 dark:text-gunmetal-300 mb-3">Light Mode</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                        <Controller
                            name="primaryColor"
                            control={control}
                            render={({ field }) => (
                                <ColorPickerField
                                    label="Primary Brand Color"
                                    hint="Drives buttons, links, badges and accents across the entire site."
                                    value={field.value ?? "#2E8B57"}
                                    onChange={field.onChange}
                                    error={errors.primaryColor?.message}
                                />
                            )}
                        />
                        <Controller
                            name="bloodBankColor"
                            control={control}
                            render={({ field }) => (
                                <ColorPickerField
                                    label="Blood Bank Color"
                                    hint="Used exclusively on the blood bank page and donor-related UI."
                                    value={field.value ?? "#DC143C"}
                                    onChange={field.onChange}
                                    error={errors.bloodBankColor?.message}
                                />
                            )}
                        />
                    </div>

                    {/* Dark mode row */}
                    <p className="text-xs font-semibold uppercase tracking-widest text-gunmetal-400 dark:text-gunmetal-300 mb-3">Dark Mode (optional â€” leave blank to reuse light color)</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Controller
                            name="primaryColorDark"
                            control={control}
                            render={({ field }) => (
                                <ColorPickerField
                                    label="Primary Brand Color â€” Dark"
                                    hint="Override for dark mode. If blank, the light mode color is used."
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                    error={errors.primaryColorDark?.message}
                                />
                            )}
                        />
                        <Controller
                            name="bloodBankColorDark"
                            control={control}
                            render={({ field }) => (
                                <ColorPickerField
                                    label="Blood Bank Color â€” Dark"
                                    hint="Override for dark mode. If blank, the light mode color is used."
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                    error={errors.bloodBankColorDark?.message}
                                />
                            )}
                        />
                    </div>
                    <p className="mt-3 text-xs text-surface-500 dark:text-surface-400">
                        Color changes take effect on the next full page load (cached for 1 hour).
                    </p>
                </SectionCard>

                {/* â”€â”€ Save Button (bottom) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 }}
                    className="flex justify-end pt-2"
                >
                    <PrimaryButton
                        type="submit"
                        title={isNew ? "Create Settings" : "Save Changes"}
                        loadingTitle={isNew ? "Creating..." : "Saving..."}
                        icon={isNew ? <RiAddLine /> : <RiSaveLine />}
                        iconSide="left"
                        isLoading={isSaving}
                        isDisabled={isSaving}
                        className="min-w-44"
                    />
                </motion.div>
            </form>
        </div>
    );
};

export default AdminWebsiteManagementPage;
