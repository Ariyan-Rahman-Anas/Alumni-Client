import ClientAuthGuard from "@/components/shared/ClientAuthGuard";
import AuthShell from "@/components/shared/AuthShell";

/** Auth layout — redirects already-logged-in users away */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthShell>
            <ClientAuthGuard requireGuest>
                {children}
            </ClientAuthGuard>
        </AuthShell>
    );
}