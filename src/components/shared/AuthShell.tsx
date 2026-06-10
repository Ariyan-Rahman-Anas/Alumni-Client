import Navbar from "@/components/Navbar";

/** Shared dark-background shell used by auth pages and the reset-password page. */
const AuthShell = ({ children }: { children: React.ReactNode }) => (
    <div className="relative flex flex-col items-center justify-center min-h-screen">
        <Navbar />

        <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(165deg, var(--color-primary-950) 0%, var(--color-primary-900) 52%, var(--color-primary-950) 100%)" }}
        />

        <div
            className="absolute inset-0 pointer-events-none"
            style={{
                backgroundImage:
                    "linear-gradient(color-mix(in srgb, var(--color-primary-500) 8%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--color-primary-500) 8%, transparent) 1px, transparent 1px)",
                backgroundSize: "60px 60px",
            }}
        />

        <main className="relative z-10 flex items-center justify-center">
            {children}
        </main>
    </div>
);

export default AuthShell;
