"use client";

import { useState } from "react";
import { FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { RiMailLine, RiArrowRightLine, RiCheckboxCircleLine } from "react-icons/ri";
import Link from "next/link";

import InputField from "@/components/shared/InputField";
import PrimaryButton from "@/components/shared/PrimaryButton";
import { useForgotPasswordMutation } from "@/redux/apis/authApi";
import { useFormWithToast } from "@/hooks/useFormWithToast";
import {
    FORGOT_PASSWORD_FIELD_ORDER,
    ForgotPasswordFormValues,
    forgotPasswordSchema,
} from "./forgotPasswordSchema";

const ForgotPasswordForm = () => {
    const [submitted, setSubmitted] = useState(false);
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

    const methods = useFormWithToast<ForgotPasswordFormValues>(
        {
            resolver: zodResolver(forgotPasswordSchema),
            defaultValues: { email: "" },
        },
        { fieldOrder: FORGOT_PASSWORD_FIELD_ORDER }
    );

    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
    } = methods;

    const onSubmit = async (data: ForgotPasswordFormValues) => {
        try {
            const result = await forgotPassword({ email: data.email }).unwrap();
            toast.success(result.message);
            setSubmitted(true);
        } catch { }
    };

    if (submitted) {
        return (
            <div className="text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary2-50 text-4xl text-primary2-600">
                    <RiCheckboxCircleLine />
                </div>
                <h2 className="text-xl font-semibold text-primary2-900 dark:text-gunmetal-100">
                    Check your inbox
                </h2>
                <p className="text-sm text-muted-foreground">
                    If <span className="font-medium text-primary2-700 dark:text-primary">{getValues("email")}</span> is registered, a password reset link has been sent. It expires in 1 hour.
                </p>
                <Link
                    href="/login"
                    className="inline-block mt-2 text-sm font-medium text-primary2-600 dark:text-primary hover:underline"
                >
                    Back to login
                </Link>
            </div>
        );
    }

    return (
        <FormProvider {...methods}>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
                <InputField
                    {...register("email")}
                    id="forgot-email"
                    type="email"
                    label="Email Address"
                    placeholder="you@example.com"
                    icon={<RiMailLine />}
                    error={errors.email?.message}
                    required
                />

                <PrimaryButton
                    type="submit"
                    title="Send Reset Link"
                    icon2={<RiArrowRightLine />}
                    iconSide2="right"
                    isFullWidth
                    isLoading={isLoading}
                    loadingTitle="Sending..."
                    className="py-5"
                />

                <p className="text-center text-sm text-muted-foreground">
                    Remember your password?{" "}
                    <Link
                        href="/login"
                        className="font-semibold text-primary2-600 dark:text-primary hover:underline"
                    >
                        Sign in
                    </Link>
                </p>
            </form>
        </FormProvider>
    );
};

export default ForgotPasswordForm;
