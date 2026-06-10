"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { RiArrowLeftLine, RiMailLine } from "react-icons/ri";

import InputField from "@/components/shared/InputField";
import PrimaryButton from "@/components/shared/PrimaryButton";
import { useForgotPasswordMutation } from "@/redux/apis/authApi";
import { useFormWithToast } from "@/hooks/useFormWithToast";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string } from "zod";

const forgotSchema = object({
    email: string().trim().min(1, "Please enter your email").email("Please enter a valid email address"),
});
type ForgotFormValues = { email: string };

const ForgotPasswordForm = () => {
    const [emailSent, setEmailSent] = useState(false);
    const [sentTo, setSentTo] = useState("");
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

    const methods = useFormWithToast<ForgotFormValues>(
        { resolver: zodResolver(forgotSchema), defaultValues: { email: "" } },
        { fieldOrder: ["email"] }
    );
    const { register, handleSubmit, formState: { errors } } = methods;

    const onSubmit = async (data: ForgotFormValues) => {
        try {
            const res = await forgotPassword({ email: data.email }).unwrap();
            setSentTo(data.email);
            setEmailSent(true);
            toast.success(res.message);
        } catch (err: unknown) {
            toast.error(
                (err as { data?: { message?: string } })?.data?.message ??
                "Something went wrong. Please try again."
            );
        }
    };

    if (emailSent) {
        const masked = sentTo.replace(/(.{2})(.*)(@.*)/, (_, a, _b, c) => `${a}${"*".repeat(4)}${c}`);
        return (
            <div className="flex flex-col items-center gap-5 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary2-50 text-3xl">
                    📧
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">
                        We sent a password reset link to{" "}
                        <span className="font-medium text-primary2-700">{masked}</span>.
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Check your inbox (and spam folder) — the link expires in 1 hour.
                    </p>
                </div>
                <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary2-600 hover:underline"
                >
                    <RiArrowLeftLine size={15} />
                    Back to Login
                </Link>
            </div>
        );
    }

    return (
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
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
                isFullWidth
                isLoading={isLoading}
                loadingTitle="Sending..."
                className="py-5"
            />

            <p className="text-center text-sm text-muted-foreground">
                Remember your password?{" "}
                <Link href="/login" className="font-medium text-primary2-600 hover:underline">
                    Sign in
                </Link>
            </p>
        </form>
    );
};

export default ForgotPasswordForm;
