import Navbar from "@/components/Navbar";
import ClientAuthGuard from "@/components/shared/ClientAuthGuard";

/** Auth layout — redirects already-logged-in users away */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative flex flex-col justify-between min-h-screen three-xl-section-setup">
            <Navbar />

            <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(165deg, #041a12 0%, #0a3d2b 52%, #051f15 100%)" }}
            />

            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(46,139,87,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(46,139,87,0.08) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />

            <main className="flex-1">
                <ClientAuthGuard requireGuest>
                    {children}
                </ClientAuthGuard>
            </main>
        </div>
    );
}