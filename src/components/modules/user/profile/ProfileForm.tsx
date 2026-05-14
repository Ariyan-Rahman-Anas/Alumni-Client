"use client";

import { useEffect } from "react";
import { Controller, Resolver, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
    RiUser3Line,
    RiPhoneLine,
    RiDropLine,
    RiBriefcaseLine,
    RiAwardLine,
} from "react-icons/ri";
import { toast } from "sonner";

import InputField from "@/components/shared/InputField";
import TextAreaBox from "@/components/shared/TextAreaBox";
import SingleSelect from "@/components/shared/SingleSelect";
import DatePickerSingle from "@/components/shared/DatePickerSingle";
import PrimaryButton from "@/components/shared/PrimaryButton";
import { useUpdateUserMutation } from "@/redux/apis/userApi";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/hooks";
import type { AppDispatch } from "@/redux/store";
import { setUser } from "@/redux/slice/authSlice";
import { MdOutlineBloodtype } from "react-icons/md";
import CheckBox from "@/components/shared/CheckBox";
import { BiDonateBlood } from "react-icons/bi";
import { useFormWithToast } from "@/hooks/useFormWithToast";
import { profileSchema } from "./user-profiel.schema";
import { ISectionCardProps, IUpdateUserPayload, IUserProfile, TProfileFormValues } from "./user-profile.types";
import { constantsData } from "@/constants";

const bloodGroupOptions = Object.values(constantsData.BLOOD_GROUPS).map((bg) => ({ label: bg, value: bg }));


const SectionCard = ({ title, icon, index, children }: ISectionCardProps) => (
    <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
        className="rounded-3xl shadow p-6 sm:p-8"
    >
        <div className="flex items-center gap-2.5 mb-6">
            <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary2-100 text-primary2-700 text-lg">
                {icon}
            </span>
            <h2 className="text-base font-semibold text-primary2-900">{title}</h2>
        </div>
        {children}
    </motion.div>
);

interface IProfileFormProps {
    user: IUserProfile;
    pendingImage: File | null;
    onImageSaved: () => void;
}

const ProfileForm = ({ user, pendingImage, onImageSaved }: IProfileFormProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const accessToken = useAppSelector((s) => s.auth.accessToken) ?? "";
    const [updateUser, { isLoading: isSaving }] = useUpdateUserMutation();

    const methods = useFormWithToast<TProfileFormValues>({
        resolver: zodResolver(profileSchema) as unknown as Resolver<TProfileFormValues>,
        defaultValues: {
            name: user.name ?? "",
            phone: user.phone ?? "",
            bloodGroup: user.bloodGroup ?? "",
            dob: user.dob ? user.dob.slice(0, 10) : "",
            currentAddress: user.currentAddress ?? "",
            permanentAddress: user.permanentAddress ?? "",
            workplace: user.workplace ?? "",
            position: user.position ?? "",
            isInterestedToDonateBlood: user.isInterestedToDonateBlood ?? false,
            bloodDonateCount: user.bloodDonateCount ?? 0,
            lastBloodDonationDate: user.lastBloodDonationDate ?? "",
        },
    })

    const {
        handleSubmit,
        reset,
        register,
        control,
        // formState: { errors, isDirty, dirtyFields },
        formState: { errors, isDirty, dirtyFields },
    } = methods;

    // Reset form when user data changes (e.g. after successful update)
    useEffect(() => {
        reset({
            name: user.name ?? "",
            phone: user.phone ?? "",
            bloodGroup: user.bloodGroup ?? "",
            dob: user.dob ? user.dob.slice(0, 10) : "",
            currentAddress: user.currentAddress ?? "",
            permanentAddress: user.permanentAddress ?? "",
            workplace: user.workplace ?? "",
            position: user.position ?? "",
            isInterestedToDonateBlood: user.isInterestedToDonateBlood ?? false,
            bloodDonateCount: user.bloodDonateCount ?? 0,
            lastBloodDonationDate: user.lastBloodDonationDate ?? "",
        });
    }, [user, reset]);

    const onSubmit = async (values: TProfileFormValues) => {
        const hasChanges = isDirty || Boolean(pendingImage);
        if (!hasChanges) {
            toast.info("No changes to save.");
            return;
        }

        try {
            const payload: IUpdateUserPayload = {};
            if (dirtyFields.name) payload.name = values.name;
            if (dirtyFields.phone && values.phone) payload.phone = values.phone;
            if (dirtyFields.bloodGroup && values.bloodGroup) payload.bloodGroup = values.bloodGroup;
            if (dirtyFields.dob && values.dob) payload.dob = values.dob;
            if (dirtyFields.currentAddress && values.currentAddress) payload.currentAddress = values.currentAddress;
            if (dirtyFields.permanentAddress && values.permanentAddress) payload.permanentAddress = values.permanentAddress;
            if (dirtyFields.workplace) payload.workplace = values.workplace;
            if (dirtyFields.position) payload.position = values.position;
            if (dirtyFields.isInterestedToDonateBlood) payload.isInterestedToDonateBlood = values.isInterestedToDonateBlood;
            if (dirtyFields.bloodDonateCount) payload.bloodDonateCount = values.bloodDonateCount;
            if (dirtyFields.lastBloodDonationDate) payload.lastBloodDonationDate = values.lastBloodDonationDate;

            const result = await updateUser({
                id: user._id,
                payload,
                image: pendingImage,
            }).unwrap();

            // Sync auth slice with updated fields (preserve existing accessToken)
            dispatch(
                setUser({
                    user: {
                        _id: result.data._id,
                        name: result.data.name,
                        email: result.data.email,
                        role: result.data.role,
                        approvalStatus: result.data.approvalStatus,
                        isVerified: result.data.isVerified,
                        imageUrl: result.data.imageUrl,
                        batch: result.data.batch,
                        isInterestedToDonateBlood: result.data.isInterestedToDonateBlood,
                        bloodDonateCount: result.data.bloodDonateCount,
                        lastBloodDonationDate: result.data.lastBloodDonationDate,
                    },
                    accessToken,
                })
            );

            if (pendingImage) onImageSaved();
            toast.success("Profile updated successfully!");
        } catch (err: unknown) {
            const msg =
                (err as { data?: { message?: string } })?.data?.message ??
                "Failed to update profile.";
            toast.error(msg);
        }
    };

    return (

        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                {/* Section 1 — Personal */}
                <SectionCard title="Personal Info" icon={<RiUser3Line />} index={0}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <InputField
                            label="Full Name"
                            icon={<RiUser3Line />}
                            error={errors.name?.message}
                            {...register("name")}
                        />
                        <InputField
                            label="Phone Number"
                            icon={<RiPhoneLine />}
                            placeholder="+8801XXXXXXXXX"
                            error={errors.phone?.message}
                            {...register("phone")}
                        />
                        <Controller
                            name="bloodGroup"
                            control={control}
                            render={({ field }) => (
                                <SingleSelect
                                    label="Blood Group"
                                    options={bloodGroupOptions}
                                    value={field.value ?? ""}
                                    onValueChange={field.onChange}
                                    placeholder="Select blood group"
                                    allowDeselect
                                    searchable={false}
                                    error={errors.bloodGroup?.message}
                                />
                            )}
                        />
                        <Controller
                            name="dob"
                            control={control}
                            render={({ field }) => (
                                <DatePickerSingle
                                    label="Date of Birth"
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                    placeholder="Select date"
                                    error={errors.dob?.message}
                                />
                            )}
                        />
                    </div>
                </SectionCard>

                {/* Section 2 — Address */}
                <SectionCard title="Address" icon={<RiDropLine />} index={1}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Controller
                            name="currentAddress"
                            control={control}
                            render={({ field }) => (
                                <TextAreaBox
                                    label="Current Address"
                                    rows={3}
                                    error={errors.currentAddress?.message}
                                    {...field}
                                />
                            )}
                        />
                        <Controller
                            name="permanentAddress"
                            control={control}
                            render={({ field }) => (
                                <TextAreaBox
                                    label="Permanent Address"
                                    rows={3}
                                    error={errors.permanentAddress?.message}
                                    {...field}
                                />
                            )}
                        />
                    </div>
                </SectionCard>

                {/* Section 3 — Professional */}
                <SectionCard title="Professional Info" icon={<RiBriefcaseLine />} index={2}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <InputField
                            label="Workplace"
                            icon={<RiBriefcaseLine />}
                            placeholder="Company or organisation"
                            error={errors.workplace?.message}
                            {...register("workplace")}
                        />
                        <InputField
                            label="Position / Title"
                            icon={<RiAwardLine />}
                            placeholder="e.g. Software Engineer"
                            error={errors.position?.message}
                            {...register("position")}
                        />
                    </div>
                </SectionCard>

                {/* Section 4 — Blood Donation */}
                <SectionCard title="Blood Donation" icon={<BiDonateBlood />} index={3}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        <Controller
                            name="isInterestedToDonateBlood"
                            control={control}
                            render={({ field }) => (
                                <CheckBox
                                    label="Interested to donate blood?"
                                    checked={field.value}
                                    checkedFunc={field.onChange}
                                />
                            )}
                        />

                        <InputField
                            label="How many times you donated blood so far?"
                            type="number"
                            icon={<MdOutlineBloodtype />}
                            placeholder="Enter how many times you donated blood"
                            error={errors.bloodDonateCount?.message}
                            {...register("bloodDonateCount")}
                        />

                        <Controller
                            name="lastBloodDonationDate"
                            control={control}
                            render={({ field }) => (
                                <DatePickerSingle
                                    label="Last Blood Donation Date"
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                    placeholder="Select date"
                                    error={errors.lastBloodDonationDate?.message}
                                />
                            )}
                        />
                    </div>
                </SectionCard>

                {/* Submit */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.45, duration: 0.4 }}
                    className="flex justify-end pt-1"
                >
                    <PrimaryButton
                        type="submit"
                        title="Save Changes"
                        loadingTitle="Saving…"
                        isLoading={isSaving}
                        isDisabled={isSaving}
                        className="min-w-36"
                    />
                </motion.div>
            </form>
        </FormProvider>

    );
};
export default ProfileForm;
