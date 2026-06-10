"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import ResetPasswordForm from "@/components/modules/auth/reset-password/ResetPasswordForm";

const ResetPasswordPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    useEffect(() => {
        if (!token) {
            router.replace("/forgot-password");
        }
    }, [token, router]);

    if (!token) return null;

    return (
        <div className="flex min-h-[80vh] items-center justify-center px-4">
            <div
                className="w-full max-w-md rounded-3xl bg-white dark:bg-gunmetal-600 p-8"
                style={{ boxShadow: "0 24px 65px rgba(5,31,21,0.18)" }}
            >
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
