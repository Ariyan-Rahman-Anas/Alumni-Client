"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { RiArrowLeftLine } from "react-icons/ri";

import ResetPasswordForm from "@/components/modules/auth/reset-password/ResetPasswordForm";

const ResetPasswordPage = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    if (!token) {
        return (
            <div className="flex min-h-[80vh] items-center justify-center px-4">
                <div className="w-full max-w-md rounded-3xl bg-white dark:bg-gunmetal-600 p-8 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-3xl">
                        ⚠️
                    </div>
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-gunmetal-100">
                        Invalid reset link
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        This password reset link is missing or malformed.
                    </p>
                    <Link
                        href="/forgot-password"
                        className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary2-600 hover:underline"
                    >
                        <RiArrowLeftLine size={15} />
                        Request a new link
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-[80vh] items-center justify-center px-4">
            <div className="w-full max-w-md rounded-3xl bg-white dark:bg-gunmetal-600 p-8">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary2-50 text-3xl text-primary2-600">
                        🔒
                    </div>
                    <h1 className="text-2xl font-semibold text-primary2-900 dark:text-gunmetal-100">
                        Set new password
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Choose a strong password for your account.
                    </p>
                </div>

                <ResetPasswordForm token={token} />
            </div>
        </div>
    );
};

export default ResetPasswordPage;
