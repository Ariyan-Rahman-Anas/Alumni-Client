import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/** Public layout — no auth required (home, about) */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col justify-between min-h-screen">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}
