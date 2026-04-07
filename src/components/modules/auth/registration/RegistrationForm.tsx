"use client";

import { useMemo, useState } from "react";
import { Controller, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
    RiArrowRightLine,
    RiBriefcase4Line,
    RiMailLine,
    RiPhoneLine,
    RiUser3Line,
} from "react-icons/ri";

import DatePickerSingle from "@/components/shared/DatePickerSingle";
import ImageUploadField from "@/components/shared/ImageUploadField";
import InputField from "@/components/shared/InputField";
import PasswordField from "@/components/shared/PasswordField";
import PrimaryButton from "@/components/shared/PrimaryButton";
import SingleSelect from "@/components/shared/SingleSelect";
import TextAreaBox from "@/components/shared/TextAreaBox";
import { useFormWithToast } from "@/hooks/useFormWithToast";
import { RegisterPayload, useRegisterUserMutation } from "@/redux/apis/authApi";
import {
    REGISTRATION_FIELD_ORDER,
    RegistrationFormValues,
    registrationSchema,
} from "./registrationSchema";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const COUNTRY_CODES = [
    { label: "Bangladesh (+880)", value: "+880", description: "Recommended" },
    { label: "India (+91)", value: "+91" },
    { label: "Saudi Arabia (+966)", value: "+966" },
    { label: "UAE (+971)", value: "+971" },
    { label: "United Kingdom (+44)", value: "+44" },
    { label: "United States (+1)", value: "+1" },
];

const RegistrationForm = () => {
    const [countryCode, setCountryCode] = useState("+880");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);

    const [registerUser, { isLoading }] = useRegisterUserMutation();

    const methods = useFormWithToast<RegistrationFormValues>(
        {
            resolver: zodResolver(registrationSchema),
            defaultValues: {
                name: "",
                email: "",
                batch: "",
                bloodGroup: "",
                dob: "",
                phone: "",
                currentAddress: "",
                permanentAddress: "",
                workplace: "",
                position: "",
                password: "",
                confirmPassword: "",
            },
        },
        { fieldOrder: REGISTRATION_FIELD_ORDER }
    );

    const {
        register,
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = methods;

    const normalizedPhone = phoneNumber.replace(/\D/g, "");
    const combinedPhone = `${countryCode}${normalizedPhone}`;

    const batchOptions = useMemo(() => {
        const currentYear = new Date().getFullYear();
        return Array.from({ length: currentYear - 1964 }, (_, i) => {
            const year = String(currentYear - i);
            return { label: year, value: year, description: `${year} batch` };
        });
    }, []);

    const bloodGroupOptions = useMemo(
        () => BLOOD_GROUPS.map((group) => ({ label: group, value: group })),
        []
    );

    const onSubmit = async (data: RegistrationFormValues) => {
        const payload: RegisterPayload = {
            name: data.name,
            email: data.email,
            phone: combinedPhone,
            batch: Number(data.batch),
            bloodGroup: data.bloodGroup,
            dob: data.dob,
            currentAddress: data.currentAddress,
            permanentAddress: data.permanentAddress,
            workplace: data.workplace || undefined,
            position: data.position || undefined,
            password: data.password,
        };

        try {
            const result = await registerUser({ payload, image: imageFile }).unwrap();
            toast.success(result.message || "Registration submitted successfully.");
            reset();
            setCountryCode("+880");
            setPhoneNumber("");
            setImageFile(null);
        } catch (error: unknown) {
            const message =
                (error as { data?: { message?: string } })?.data?.message ||
                "Registration failed. Please try again.";
            toast.error(message);
        }
    };

    return (
        <FormProvider {...methods}>
            <form
                className="mt-7 space-y-4"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
            >
                {/* Profile Image */}
                <ImageUploadField
                    value={imageFile}
                    onChange={setImageFile}
                    label="Profile Image"
                    helperText="JPG, PNG or WEBP — square or portrait photo works best."
                />

                {/* Full Name + Batch */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <InputField
                        {...register("name")}
                        id="reg-name"
                        label="Full Name"
                        placeholder="Your full name"
                        icon={<RiUser3Line />}
                        error={errors.name?.message}
                        required
                    />

                    <Controller
                        name="batch"
                        control={control}
                        render={({ field }) => (
                            <SingleSelect
                                id="reg-batch"
                                label="Batch Year"
                                value={field.value || ""}
                                onValueChange={field.onChange}
                                options={batchOptions}
                                placeholder="Select your batch"
                                searchPlaceholder="Search batch year"
                                error={errors.batch?.message}
                                required
                            />
                        )}
                    />
                </div>

                {/* Email + Phone */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <InputField
                        {...register("email")}
                        id="reg-email"
                        type="email"
                        label="Email Address"
                        placeholder="you@example.com"
                        icon={<RiMailLine />}
                        error={errors.email?.message}
                        required
                    />

                    <div className="flex flex-col gap-1.5">
                        <label className="block text-xs">
                            Phone Number <span className="text-danger">*</span>
                        </label>
                        <div className="grid gap-2 grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
                            <SingleSelect
                                id="reg-country-code"
                                value={countryCode}
                                onValueChange={(val) => {
                                    setCountryCode(val);
                                    setValue("phone", `${val}${normalizedPhone}`);
                                }}
                                options={COUNTRY_CODES}
                                placeholder="Code"
                                searchPlaceholder="Search country"
                                searchable
                                error={errors.phone ? true : undefined}
                            />

                            <InputField
                                id="reg-phone"
                                type="tel"
                                inputMode="numeric"
                                value={phoneNumber}
                                onChange={(e) => {
                                    const next = e.target.value;
                                    setPhoneNumber(next);
                                    setValue("phone", `${countryCode}${next.replace(/\D/g, "")}`);
                                }}
                                placeholder="1XXXXXXXXX"
                                icon={<RiPhoneLine />}
                                error={errors.phone?.message}
                            />
                        </div>
                        {/* {!errors.phone?.message && (
                            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                                Full number: {combinedPhone || `${countryCode}...`}
                            </p>
                        )} */}
                    </div>
                </div>

                {/* Blood Group + Date of Birth */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <Controller
                        name="bloodGroup"
                        control={control}
                        render={({ field }) => (
                            <SingleSelect
                                id="reg-blood-group"
                                label="Blood Group"
                                value={field.value || ""}
                                onValueChange={field.onChange}
                                options={bloodGroupOptions}
                                placeholder="Select blood group"
                                error={errors.bloodGroup?.message}
                                required
                            />
                        )}
                    />

                    <Controller
                        name="dob"
                        control={control}
                        render={({ field }) => (
                            <DatePickerSingle
                                id="reg-dob"
                                label="Date of Birth"
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.dob?.message}
                                required
                            />
                        )}
                    />
                </div>

                {/* Addresses */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <TextAreaBox
                        {...register("currentAddress")}
                        id="reg-current-address"
                        label="Current Address"
                        placeholder="Where you live now"
                        error={errors.currentAddress?.message}
                        required
                    />
                    <TextAreaBox
                        {...register("permanentAddress")}
                        id="reg-permanent-address"
                        label="Permanent Address"
                        placeholder="Your permanent home address"
                        error={errors.permanentAddress?.message}
                        required
                    />
                </div>

                {/* Workplace + Position (optional) */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <InputField
                        {...register("workplace")}
                        id="reg-workplace"
                        label="Workplace"
                        placeholder="School, company or organization"
                        icon={<RiBriefcase4Line />}
                    // helperText="Optional"
                    />
                    <InputField
                        {...register("position")}
                        id="reg-position"
                        label="Position / Role"
                        placeholder="Your current role or title"
                        icon={<RiBriefcase4Line />}
                    />
                </div>

                {/* Password + Confirm */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <PasswordField
                                id="reg-password"
                                name={field.name}
                                label="Password"
                                value={field.value}
                                onBlur={field.onBlur}
                                onChange={field.onChange}
                                error={errors.password?.message}
                                required
                            />
                        )}
                    />
                    <Controller
                        name="confirmPassword"
                        control={control}
                        render={({ field }) => (
                            <PasswordField
                                id="reg-confirm-password"
                                name={field.name}
                                label="Confirm Password"
                                value={field.value}
                                onBlur={field.onBlur}
                                onChange={field.onChange}
                                error={errors.confirmPassword?.message}
                                required
                            />
                        )}
                    />
                </div>

                {/* Notice */}
                <div
                    className="rounded-2xl border px-4 py-3 text-sm"
                    style={{
                        borderColor: "rgba(46,139,87,0.18)",
                        background: "rgba(46,139,87,0.05)",
                        color: "var(--color-text-secondary)",
                    }}
                >
                    After registration, your account stays pending until admin approval and email
                    verification are completed.
                </div>

                {/* Submit */}
                <PrimaryButton
                    type="submit"
                    title="Submit Registration"
                    icon={<RiArrowRightLine />}
                    iconSide="right"
                    isFullWidth
                    isLoading={isLoading}
                    loadingTitle="Submitting..." className="py-5"
                />
            </form>
        </FormProvider>
    );
};

export default RegistrationForm;