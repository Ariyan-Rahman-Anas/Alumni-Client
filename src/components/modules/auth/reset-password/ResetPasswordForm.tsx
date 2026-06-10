"use client";

import { useState } from "react";
import { Controller, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { RiCheckboxCircleLine, RiArrowRightLine } from "react-icons/ri";
import Link from "next/link";

import PrimaryButton from "@/components/shared/PrimaryButton";
import PasswordField from "@/components/shared/PasswordField";
import { useResetPasswordMutation } from "@/redux/apis/authApi";
import { useFormWithToast } from "@/hooks/useFormWithToast";
import {
    RESET_PASSWORD_FIELD_ORDER,
    ResetPasswordFormValues,
    resetPasswordSchema,
} from "./resetPasswordSchema";

interface Props {
    token: string;
}

const ResetPasswordForm = ({ token }: Props) => {
    const router = useRouter();
    const [done, setDone] = useState(false);
    const [resetPassword, { isLoading }] = useResetPasswordMutation();

    const methods = useFormWithToast<ResetPasswordFormValues>(
        {
            resolver: zodResolver(resetPasswordSchema),
            defaultValues: { password: "", confirmPassword: "" },
        },
        { fieldOrder: RESET_PASSWORD_FIELD_ORDER }
    );

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = methods;

    const onSubmit = async (data: ResetPasswordFormValues) => {
        try {
            const result = await resetPassword({ token, password: data.password }).unwrap();
            toast.success(result.message);
            setDone(true);
            setTimeout(() => router.replace("/login"), 2500);
        } catch { }
    };

    if (done) {
        return (
            <div className="text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary2-50 text-4xl text-primary2-600">
                    <RiCheckboxCircleLine />
                </div>
                <h2 className="text-xl font-semibold text-primary2-900 dark:text-gunmetal-100">
                    Password reset!
                </h2>
                <p className="text-sm text-muted-foreground">
                    Your password has been updated. Redirecting to login...
                </p>
            </div>
        );
    }

    return (
        <FormProvider {...methods}>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
                <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                        <PasswordField
                            id="reset-password"
                            name={field.name}
                            label="New Password"
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
                            id="reset-confirm-password"
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

                <PrimaryButton
                    type="submit"
                    title="Reset Password"
                    icon2={<RiArrowRightLine />}
                    iconSide2="right"
                    isFullWidth
                    isLoading={isLoading}
                    loadingTitle="Resetting..."
                    className="py-5"
                />

                <p className="text-center text-sm text-muted-foreground">
                    <Link
                        href="/login"
                        className="font-semibold text-primary2-600 dark:text-primary hover:underline"
                    >
                        Back to login
                    </Link>
                </p>
            </form>
        </FormProvider>
    );
};

export default ResetPasswordForm;
