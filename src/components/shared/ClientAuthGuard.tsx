"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ClientAuthGuard — client-side route protection
//
// WHY THIS EXISTS:
//   Next.js middleware cannot reliably read cross-site cookies on Vercel
//   (different subdomains = browser won't attach cookie to Edge requests).
//   This component runs after hydration, reads Redux auth state (populated by
//   AuthInitializer via GET /auth/me), and redirects if access is denied.
//
// WHEN CUSTOM DOMAIN IS SET UP:
//   Middleware will handle redirects server-side again (faster, no flash).
//   You can then either:
//     a) Remove <ClientAuthGuard> wrappers and rely solely on middleware, OR
//     b) Keep both for defence-in-depth (recommended).
//
// USAGE:
//   requireAuth  — user must be logged in
//   requireRole  — user must have a specific role (e.g. "ADMIN")
//   requireGuest — user must NOT be logged in (login/register pages)
//
//   <ClientAuthGuard requireAuth>          ← protected page
//   <ClientAuthGuard requireRole="ADMIN">  ← admin-only page
//   <ClientAuthGuard requireGuest>         ← auth-only page
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { selectCurrentUser, selectIsInitialized } from "@/redux/slice/authSlice";

interface ClientAuthGuardProps {
    children: React.ReactNode;
    /** Redirect to /login if not authenticated */
    requireAuth?: boolean;
    /** Redirect to / if user doesn't have this role */
    requireRole?: string | string[];
    /** Redirect to / if already authenticated (login/register pages) */
    requireGuest?: boolean;
}

const ClientAuthGuard = ({
    children,
    requireAuth,
    requireRole,
    requireGuest,
}: ClientAuthGuardProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const user = useSelector(selectCurrentUser);
    const isInitialized = useSelector(selectIsInitialized);

    // isLoading = true while AuthInitializer's GET /auth/me is in-flight
    // const { isLoading } = useGetMeQuery();

    useEffect(() => {
        // Wait for auth state to settle before making redirect decisions
        // if (isLoading) return;
        if (!isInitialized) return;

        if (requireAuth && !user) {
            router.replace(`/login?next=${encodeURIComponent(pathname)}`);
            return;
        }

        if (requireRole && user?.role !== requireRole && (!Array.isArray(requireRole) || !requireRole.includes(user?.role || ""))) {
            // Logged in but wrong role → home
            // Not logged in → login
            router.replace(user ? "/" : `/login?next=${encodeURIComponent(pathname)}`);
            return;
        }

        if (requireGuest && user) {
            // Redirect to ?next if present (e.g. after login), otherwise home.
            // Uses window.location.search to avoid requiring a Suspense boundary.
            const params = new URLSearchParams(window.location.search);
            const next = params.get("next");
            const to = next && next.startsWith("/") ? next : "/";
            router.replace(to);
            return;
        }
    }, [isInitialized, user, requireAuth, requireRole, requireGuest, router, pathname]);

    // While auth is loading OR a redirect is pending, render nothing to avoid flash
    // if (isLoading) return null;
    if (!isInitialized) return (
        <div className="flex-1 flex items-center justify-center min-h-[40vh]">
            <div className="w-6 h-6 rounded-full border-2 border-primary2-300 border-t-primary2-600 animate-spin" />
        </div>
    );
    if (requireAuth && !user) return null;
    if (requireRole && user?.role !== requireRole && (!Array.isArray(requireRole) || !requireRole.includes(user?.role || ""))) return null;
    if (requireGuest && user) return null;

    return <>{children}</>;
};

export default ClientAuthGuard;
