"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
    RiGroupLine,
    RiCalendarLine,
    RiCalendarEventLine,
    RiLogoutBoxLine,
    RiShieldCheckLine,
    RiBarChartBoxLine,
    RiMenuLine,
    RiCloseLine,
    RiArrowLeftLine,
    RiExternalLinkLine,
    RiImageLine,
} from "react-icons/ri";
import { cn } from "@/lib/utils";
import { useLogoutUserMutation } from "@/redux/apis/authApi";
import { clearUser, selectCurrentUser } from "@/redux/slice/authSlice";
import type { AppDispatch } from "@/redux/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const NAV_ITEMS = [
    { label: "Overview", href: "/admin/overview", icon: RiBarChartBoxLine },
    { label: "Users", href: "/admin/users", icon: RiGroupLine },
    { label: "Batches", href: "/admin/batches", icon: RiCalendarLine },
    { label: "Events", href: "/admin/events", icon: RiCalendarEventLine },
    { label: "Image Categories", href: "/admin/image-categories", icon: RiImageLine },
    { label: "Gallery", href: "/admin/gallery", icon: RiImageLine },
];

function SidebarContent({ onNav }: { onNav?: () => void }) {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector(selectCurrentUser);
    const [logoutUser, { isLoading: isLoggingOut }] = useLogoutUserMutation();

    const initials = user?.name
        ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
        : "AD";

    const handleLogout = async () => {
        try {
            const res = await logoutUser().unwrap();
            toast.success(res?.message);
        } catch {
            // ignore
        } finally {
            dispatch(clearUser());
            setTimeout(() => router.push("/login"), 300);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="px-5 py-4 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary2-600 shrink-0">
                        <RiShieldCheckLine className="text-white text-lg" />
                    </span>
                    <div>
                        <p className="text-sm font-semibold text-white leading-none">BAMHS Admin</p>
                        <p className="text-[11px] text-white/40 mt-0.5">Control Panel</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                <p className="px-3 mb-2 text-[10px] uppercase tracking-widest text-white/30 font-medium">
                    Management
                </p>
                {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
                    const isActive = pathname === href || pathname.startsWith(href + "/");
                    return (
                        <Link
                            key={href}
                            href={href}
                            onClick={onNav}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                                isActive
                                    ? "bg-primary2-700/60 text-white"
                                    : "text-white/60 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <Icon className={cn("text-lg shrink-0", isActive ? "text-primary2-300" : "text-white/40")} />
                            {label}
                            {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary2-400" />}
                        </Link>
                    );
                })}
            </nav>

            <div className="px-3 py-4 border-t border-white/10 space-y-2 shrink-0">
                {/* Back to website */}
                <div className="space-y-0.5">
                    <p className="px-3 mb-1.5 text-[10px] uppercase tracking-widest text-white/30 font-medium">Navigate</p>
                    <Link
                        href="/"
                        onClick={onNav}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white transition-all group"
                    >
                        <RiArrowLeftLine className="text-lg shrink-0 text-white/40 group-hover:text-white/70" />
                        Back to Website
                    </Link>
                    <Link
                        href="/profile"
                        onClick={onNav}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white transition-all group"
                    >
                        <RiExternalLinkLine className="text-lg shrink-0 text-white/40 group-hover:text-white/70" />
                        My Profile
                    </Link>
                </div>

                <div className="border-t border-white/10 pt-2">
                    <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5">
                        <Avatar className="size-8 shrink-0">
                            {user?.imageUrl && <AvatarImage src={user.imageUrl} alt={user.name} />}
                            <AvatarFallback className="bg-primary2-700 text-white text-xs font-semibold">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate">{user?.name ?? "Admin"}</p>
                            <p className="text-[11px] text-white/40 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
                    >
                        <RiLogoutBoxLine className="text-lg shrink-0" />
                        {isLoggingOut ? "Logging out..." : "Logout"}
                    </button>
                </div>
            </div>
        </div>
    );
}

const AdminSidebar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <>
            {/* Desktop sidebar */}
            <aside className="hidden lg:flex flex-col w-64 shrink-0 sticky top-0 h-screen bg-[#041a12] border-r border-white/5 overflow-y-auto">
                <SidebarContent />
            </aside>

            {/* Mobile top bar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center gap-3 bg-[#041a12] border-b border-white/10 px-4 h-14">
                <button
                    type="button"
                    onClick={() => setMobileOpen(true)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 transition-colors"
                    aria-label="Open menu"
                >
                    <RiMenuLine className="text-xl" />
                </button>
                <div className="flex items-center gap-2">
                    <RiShieldCheckLine className="text-primary2-400 text-base shrink-0" />
                    <span className="text-sm font-semibold text-white">BAMHS Admin</span>
                </div>
            </div>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Mobile drawer */}
            <aside
                className={cn(
                    "lg:hidden fixed top-0 left-0 z-50 h-full w-72 bg-[#041a12] transition-transform duration-300 ease-in-out",
                    mobileOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="absolute top-3 right-3 z-10">
                    <button
                        type="button"
                        onClick={() => setMobileOpen(false)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-white/60 hover:bg-white/10"
                    >
                        <RiCloseLine className="text-xl" />
                    </button>
                </div>
                <SidebarContent onNav={() => setMobileOpen(false)} />
            </aside>
        </>
    );
};

export default AdminSidebar;
