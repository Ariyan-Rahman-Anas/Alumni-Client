"use client";

import { Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { RiArrowLeftLine } from "react-icons/ri";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string } from "zod";

import PasswordField from "@/components/shared/PasswordField";
import PrimaryButton from "@/components/shared/PrimaryButton";
import { useResetPasswordMutation } from "@/redux/apis/authApi";
import { useFormWithToast } from "@/hooks/useFormWithToast";

const resetSchema = object({
    password: string().min(6, "Password must be at least 6 characters"),
    confirmPassword: string().min(1, "Please confirm your password"),
}).refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type ResetFormValues = { password: string; confirmPassword: string };

interface ResetPasswordFormProps {
    token: string;
}

const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
    const router = useRouter();
    const [resetPassword, { isLoading }] = useResetPasswordMutation();

    const methods = useFormWithToast<ResetFormValues>(
        {
            resolver: zodResolver(resetSchema),
            defaultValues: { password: "", confirmPassword: "" },
        },
        { fieldOrder: ["password", "confirmPassword"] }
    );
    const { control, handleSubmit, formState: { errors } } = methods;

    const onSubmit = async (data: ResetFormValues) => {
        try {
            const res = await resetPassword({ token, password: data.password }).unwrap();
            toast.success(res.message ?? "Password reset successfully!");
            router.push("/login");
        } catch (err: unknown) {
            toast.error(
                (err as { data?: { message?: string } })?.data?.message ??
                "Invalid or expired reset link. Please request a new one."
            );
        }
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
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
                        label="Confirm New Password"
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
                isFullWidth
                isLoading={isLoading}
                loadingTitle="Resetting..."
                className="py-5"
            />

            <p className="text-center text-sm text-muted-foreground">
                <Link
                    href="/forgot-password"
                    className="inline-flex items-center gap-1 font-medium text-primary2-600 hover:underline"
                >
                    <RiArrowLeftLine size={14} />
                    Request a new link
                </Link>
            </p>
        </form>
    );
};

export default ResetPasswordForm;
