import Navbar from "@/components/Navbar";
import ClientAuthGuard from "@/components/shared/ClientAuthGuard";

/** Auth layout — redirects already-logged-in users away */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col justify-between min-h-screen">
            <Navbar />
            <main className="flex-1">
                <ClientAuthGuard requireGuest>
                    {children}
                </ClientAuthGuard>
            </main>
        </div>
    );
}