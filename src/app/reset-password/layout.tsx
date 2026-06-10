import AuthShell from "@/components/shared/AuthShell";

/** Reset-password layout — same dark background as auth pages but no login-redirect guard.
 *  Anyone with a valid reset link (including currently logged-in users) must be able to reach this page. */
export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
    return <AuthShell>{children}</AuthShell>;
}
