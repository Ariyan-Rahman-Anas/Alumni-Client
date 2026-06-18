"use client";

import { useEffect } from "react";
import LayoutErrorBoundary from "@/components/shared/LayoutErrorBoundary";
import { RiLoginBoxLine } from "react-icons/ri";

export default function AuthError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("[Auth Error]", error);
    }, [error]);

    return (
        <LayoutErrorBoundary
            title="Oops! Authentication Error."
            message="Something went wrong during the authentication process."
            btn2Text="Back to login"
            btn2Link="/login"
            btn2Icon={<RiLoginBoxLine />}
            error={error}
            reset={reset}
        />
    );
}
