import type { Metadata } from "next";
import AdminSidebar from "@/components/modules/admin/AdminSidebar";
import StoreProvider from "@/providers/StoreProvider";
import { Toaster } from "sonner";
import { Sanchez } from "next/font/google";
import { cn } from "@/lib/utils";

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
        <html lang="en" className={cn(sanchez.variable)}>
            <body className="antialiased bg-[#f4f6f5] min-h-screen">
                <StoreProvider>
                    <div className="flex h-screen overflow-hidden">
                        <AdminSidebar />
                        <main className="flex-1 min-w-0 h-full overflow-y-auto pt-14 lg:pt-0">
                            {children}
                        </main>
                    </div>
                    <Toaster richColors position="top-right" />
                </StoreProvider>
            </body>
        </html>
    );
}
