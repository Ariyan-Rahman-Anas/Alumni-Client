"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RiAlertLine, RiRefreshLine, RiHome4Line } from "react-icons/ri";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log to an error reporting service in production
        console.error("[Global Error]", error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface-50 px-4">
            <div className="max-w-md w-full text-center">
                <div className="flex justify-center mb-6">
                    <span className="flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 border border-red-100 text-red-500 text-3xl">
                        <RiAlertLine />
                    </span>
                </div>

                <h1 className="text-2xl font-bold text-primary2-900 mb-2">
                    Something went wrong
                </h1>
                <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                    An unexpected error occurred. Our team has been notified.
                    {error.digest && (
                        <span className="block mt-1 text-xs font-mono text-neutral-400">
                            Error ID: {error.digest}
                        </span>
                    )}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={reset}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary2-700 text-white text-sm font-semibold hover:bg-primary2-800 transition-colors"
                    >
                        <RiRefreshLine />
                        Try again
                    </button>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-surface-200 bg-white text-primary2-700 text-sm font-semibold hover:bg-surface-50 transition-colors"
                    >
                        <RiHome4Line />
                        Go home
                    </Link>
                </div>
            </div>
        </div>
    );
}
