"use client";

import { useState } from "react";
import {
    RiShieldCheckLine,
    RiMenuLine,
    RiCloseLine,
} from "react-icons/ri";
import { cn } from "@/lib/utils";
import { useSchoolInfo } from "@/hooks/useSchoolInfo";
import SidebarContent from "./SidebarContent";


const AdminSidebar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { shortName} = useSchoolInfo();

    return (
        <>
            {/* Desktop sidebar */}
            <aside className="hidden lg:flex flex-col w-64 shrink-0 sticky top-0 h-screen bg-white dark:bg-[#041a12] border-r border-gunmetal-100 dark:border-gunmetal-400 overflow-y-auto" data-lenis-prevent>
                <SidebarContent />
            </aside>

            {/* Mobile top bar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center gap-3 bg-white dark:bg-[#041a12] border-b border-gunmetal-100 dark:border-gunmetal-400 px-4 h-14">
                <button
                    type="button"
                    onClick={() => setMobileOpen(true)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 dark:text-white/70 dark:hover:bg-white/10 transition-colors"
                    aria-label="Open menu"
                >
                    <RiMenuLine className="text-xl" />
                </button>
                <div className="flex items-center gap-2">
                    <RiShieldCheckLine className="text-primary2-500 dark:text-primary2-400 text-base shrink-0" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{shortName} Admin</span>
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
                    "lg:hidden fixed top-0 left-0 z-50 h-full w-72 bg-white dark:bg-[#041a12] transition-transform duration-300 ease-in-out",
                    mobileOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="absolute top-3 right-3 z-10">
                    <button
                        type="button"
                        onClick={() => setMobileOpen(false)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:text-white/60 dark:hover:bg-white/10"
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
