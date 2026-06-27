"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import OtpVerifyForm from "@/components/modules/auth/verify-email/OtpVerifyForm";

const VerifyEmailPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");

    useEffect(() => {
        if (!email) {
            router.replace("/registration");
        }
    }, [email, router]);

    if (!email) return null;

    return (
        <div className="flex min-h-[80vh] items-center justify-center px-4"
        >
            <div
                className="w-full max-w-md rounded-3xl bg-white dark:bg-gunmetal-600 p-8" >
                {/* Header */}
                <div className="mb-8 text-center">
                    <div
                        className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary2-50 text-3xl text-primary2-600"
                    >
                        ✉️
                    </div>
                    <h1 className="text-2xl font-semibold text-primary2-900">
                        Verify your email
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Enter the 6-digit code we sent to your inbox.
                    </p>
                </div>

                <OtpVerifyForm email={email} />
            </div>
        </div>
    );
};
export default VerifyEmailPage;
