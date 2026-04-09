import type { Metadata } from "next";
import AdminSidebar from "@/components/modules/admin/AdminSidebar";
import { Sanchez } from "next/font/google";
import { cn } from "@/lib/utils";
import ClientAuthGuard from "@/components/shared/ClientAuthGuard";

const sanchez = Sanchez({
    subsets: ["latin"],
    variable: "--font-sanchez",
    display: "swap",
    weight: ["400"],
});

export const metadata: Metadata = {
    title: {
        default: "Admin Dashboard | BAMHS",
        template: "%s | Admin — BAMHS",
    },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        // ClientAuthGuard: requireRole="ADMIN" — blocks non-admin + unauthenticated users.
        // WHEN CUSTOM DOMAIN: middleware will handle this. Keep guard for defence-in-depth.
        <ClientAuthGuard requireRole="ADMIN">
            <div className={cn(sanchez.variable, "flex h-screen overflow-hidden bg-[#f4f6f5]")}>
                <AdminSidebar />
                <main className="flex-1 min-w-0 h-full overflow-y-auto pt-14 lg:pt-0">
                    {children}
                </main>
            </div>
        </ClientAuthGuard>
    );
}
