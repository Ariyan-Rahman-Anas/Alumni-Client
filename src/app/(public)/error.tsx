"use client";

import { useEffect } from "react";
import LayoutErrorBoundary from "@/components/shared/LayoutErrorBoundary";
import { RiHome4Line } from "react-icons/ri";

export default function PublicError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("[Public Error]", error);
    }, [error]);

    return (
        <LayoutErrorBoundary
            title="Oops! Landing Page Error."
            message="Something went wrong during loading this page."
            btn2Text="Go Home"
            btn2Link="/"
            btn2Icon={<RiHome4Line />}
            error={error}
            reset={reset}
        />
    );
}
