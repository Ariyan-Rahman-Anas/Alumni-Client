"use client";

import { motion } from "framer-motion";
import { RiArrowRightSLine, RiLockPasswordLine, RiProfileLine, RiWallet3Line, RiFileListLine, RiBriefcaseLine, RiMessage2Line, RiUserStarLine, RiTicketLine, RiGalleryLine } from "react-icons/ri";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export type ProfileSectionKey = "profile-info" | "transactions" | "change-password" | "my-applications" | "my-posted-jobs" | "my-provider-contacts" | "my-provider-profile" | "my-event-registrations" | "my-requests" | "my-contributions";

interface SidebarItem {
    id: ProfileSectionKey;
    label: string;
    description: string;
    icon: React.ReactNode;
}

const sidebarItems: SidebarItem[] = [
    { id: "profile-info", label: "Profile Info", description: "Manage personal and contact details", icon: <RiProfileLine /> },
    { id: "transactions", label: "Transactions", description: "Track profile-related payments", icon: <RiWallet3Line /> },
    { id: "change-password", label: "Change Password", description: "Secure your account access", icon: <RiLockPasswordLine /> },
    { id: "my-applications", label: "My Applications", description: "Track your job applications", icon: <RiFileListLine /> },
    { id: "my-posted-jobs", label: "My Posted Jobs", description: "View your posts & applicants", icon: <RiBriefcaseLine /> },
    { id: "my-provider-contacts", label: "Contacts", description: "Messages from people who found you", icon: <RiMessage2Line /> },
    { id: "my-provider-profile", label: "Provider Profile", description: "Manage your provider registration", icon: <RiUserStarLine /> },
    { id: "my-event-registrations", label: "Event Registrations", description: "Track your event sign-ups", icon: <RiTicketLine /> },
    { id: "my-requests", label: "My Requests", description: "Track your requests to admin", icon: <RiFileListLine /> },
    { id: "my-contributions", label: "My Contributions", description: "Gallery photos you submitted", icon: <RiGalleryLine /> },
];

interface ProfileSidebarProps {
    activeSection: ProfileSectionKey;
    onSectionChange: (section: ProfileSectionKey) => void;
}

const ProfileSidebar = ({ activeSection, onSectionChange }: ProfileSidebarProps) => {
    return (
        <aside className="rounded-3xl shadow md:sticky md:top-24 h-fit">
            {/* ── Desktop header (hidden on mobile) ─────────── */}
            <div
                className="hidden md:block rounded-t-3xl px-4 py-3"
                style={{ background: "linear-gradient(135deg, rgba(4,26,18,0.95) 0%, rgba(10,61,43,0.92) 55%, rgba(5,31,21,0.95) 100%)" }}
            >
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">Account Console</p>
                <h2 className="text-base sm:text-lg font-semibold text-white mt-1">Profile Dashboard</h2>
            </div>

            {/* ── Mobile: icon grid ──────────────────────────── */}
            <nav className="md:hidden p-3 grid grid-cols-7 gap-1" aria-label="Profile sections">
                {sidebarItems.map((item) => {
                    const isActive = item.id === activeSection;
                    return (
                        <Tooltip key={item.id}>
                            <TooltipTrigger asChild>
                                <button
                                    type="button"
                                    onClick={() => onSectionChange(item.id)}
                                    aria-current={isActive ? "page" : undefined}
                                    aria-label={item.label}
                                    className={cn(
                                        "flex items-center justify-center rounded-xl p-2.5 text-xl transition-colors",
                                        isActive
                                            ? "bg-primary2-700 text-white shadow-sm"
                                            : "bg-primary2-50 text-primary2-700 hover:bg-primary2-100",
                                    )}
                                >
                                    {item.icon}
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                                <p className="text-xs">{item.label}</p>
                            </TooltipContent>
                        </Tooltip>
                    );
                })}
            </nav>

            {/* ── Desktop: full sidebar list ─────────────────── */}
            <nav className="hidden md:flex flex-col gap-1.5 p-3" aria-label="Profile sections">
                {sidebarItems.map((item, index) => {
                    const isActive = item.id === activeSection;
                    return (
                        <motion.button
                            key={item.id}
                            type="button"
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.35, delay: index * 0.06 }}
                            onClick={() => onSectionChange(item.id)}
                            className={cn(
                                "group flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left transition",
                                isActive ? "bg-primary2-100 ring-1 ring-primary2-300" : "hover:bg-primary2-50",
                            )}
                            aria-current={isActive ? "page" : undefined}
                        >
                            <span className={cn(
                                "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-lg",
                                isActive ? "bg-primary2-700 text-white" : "bg-primary2-100 text-primary2-700",
                            )}>
                                {item.icon}
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="block text-sm font-semibold text-primary2-900">{item.label}</span>
                                <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{item.description}</span>
                            </span>
                            <RiArrowRightSLine className={cn("mt-1 text-lg transition", isActive ? "text-primary2-700" : "text-primary2-400 group-hover:text-primary2-600")} />
                        </motion.button>
                    );
                })}
            </nav>
        </aside>
    );
};

export default ProfileSidebar;

