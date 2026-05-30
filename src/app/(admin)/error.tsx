"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RiAlertLine, RiRefreshLine, RiDashboardLine } from "react-icons/ri";

export default function AdminError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("[Admin Error]", error);
    }, [error]);

    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <div className="flex justify-center mb-5">
                    <span className="flex items-center justify-center w-14 h-14 rounded-2xl bg-red-50 border border-red-100 text-red-500 text-2xl">
                        <RiAlertLine />
                    </span>
                </div>

                <h2 className="text-xl font-bold text-primary2-900 mb-2">Admin panel error</h2>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    Something went wrong loading this admin page.
                    {error.digest && (
                        <span className="block mt-1 text-xs font-mono text-neutral-400">
                            ID: {error.digest}
                        </span>
                    )}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={reset}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary2-700 text-white text-sm font-semibold hover:bg-primary2-800 transition-colors"
                    >
                        <RiRefreshLine />
                        Retry
                    </button>
                    <Link
                        href="/admin"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-surface-200 bg-white text-primary2-700 text-sm font-semibold hover:bg-surface-50 transition-colors"
                    >
                        <RiDashboardLine />
                        Admin home
                    </Link>
                </div>
            </div>
        </div>
    );
}
