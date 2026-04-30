import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClientAuthGuard from "@/components/shared/ClientAuthGuard";

/** Protected layout — all routes inside (user) require authentication */
export default function UserLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col justify-between min-h-screen">
            <Navbar />
            <main className="flex-1">
                <ClientAuthGuard requireAuth>
                    {children}
                </ClientAuthGuard>
            </main>
            <Footer />
        </div>
    );
}
