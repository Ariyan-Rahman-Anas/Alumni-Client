import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CiLogout } from "react-icons/ci";
import { useSchoolInfo } from "@/hooks/useSchoolInfo";
import ThemeSwitch from "@/lib/ThemeSwitch";
import { cn } from "@/lib/utils";
import { useLogoutUserMutation } from "@/redux/apis/authApi";
import { AppDispatch } from "@/redux/store";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
    RiGroupLine,
    RiCalendarLine,
    RiCalendarEventLine,
    RiShieldCheckLine,
    RiBarChartBoxLine,
    RiArrowLeftLine,
    RiExternalLinkLine,
    RiImageLine,
    RiSettings3Line,
    RiFileListLine,
    RiDoubleQuotesL,
} from "react-icons/ri";
import { MdOutlineCampaign } from "react-icons/md";
import { clearUser, selectCurrentUser } from "@/redux/slice/authSlice";
import PrimaryButton from "@/components/shared/PrimaryButton";

const SidebarContent = ({ onNav }: { onNav?: () => void }) => {

    const NAV_ITEMS = [
        { label: "Dashboard", href: "/admin/overview", icon: RiBarChartBoxLine },
        { label: "Announcements", href: "/admin/announcements", icon: MdOutlineCampaign },
        { label: "Batches", href: "/admin/batches", icon: RiCalendarLine },
        { label: "Events", href: "/admin/events", icon: RiCalendarEventLine },
        { label: "Gallery", href: "/admin/gallery", icon: RiImageLine },
        { label: "Image Categories", href: "/admin/image-categories", icon: RiImageLine },
        { label: "Jobs", href: "/admin/jobs", icon: RiExternalLinkLine },
        { label: "Users", href: "/admin/users", icon: RiGroupLine },
        { label: "Committee", href: "/admin/committee", icon: RiGroupLine },
        { label: "Requests", href: "/admin/requests", icon: RiFileListLine },
        { label: "Testimonials", href: "/admin/testimonials", icon: RiDoubleQuotesL },
        { label: "Website Settings", href: "/admin/website-management", icon: RiSettings3Line },
    ];

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

    const { shortName } = useSchoolInfo();


    return (
        <div className="flex flex-col h-full bgred-100">
            <div className="px-5 py-4 border-b border-gunmetal-100 dark:border-gunmetal-400 shrink-0 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary2-600 shrink-0">
                        <RiShieldCheckLine className="text-white text-lg" />
                    </span>
                    <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white leading-none">{shortName} Admin</p>
                        <p className="text-[11px] text-gray-500 dark:text-white/40 mt-0.5">Control Panel</p>
                    </div>
                </div>
                <ThemeSwitch />
            </div>

            <nav className="flex-1 px-3 py-4 overflow-y-auto">
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
                                    ? "bg-primary2-100 text-primary2-800 dark:bg-primary2-700/60 dark:text-white"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white"
                            )}
                        >
                            <Icon className={cn("text-lg shrink-0", isActive ? "text-primary2-600 dark:text-primary2-300" : "text-gray-400 dark:text-white/40")} />
                            {label}
                            {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary2-500 dark:bg-primary2-400" />}
                        </Link>
                    );
                })}
            </nav>

            <div className="px-3 pt-4 pb-2 border-t border-gray-200 dark:border-white/10 space-y-2 shrink-0">
                {/* Back to website */}
                <div className="space-y-0.5">
                    <Link
                        href="/"
                        onClick={onNav}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white transition-all group"
                    >
                        <RiArrowLeftLine className="text-lg shrink-0 text-gray-400 group-hover:text-gray-600 dark:text-white/40 dark:group-hover:text-white/70" />
                        Back to Website
                    </Link>
                    <Link
                        href="/profile"
                        onClick={onNav}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white transition-all group"
                    >
                        <RiExternalLinkLine className="text-lg shrink-0 text-gray-400 group-hover:text-gray-600 dark:text-white/40 dark:group-hover:text-white/70" />
                        My Profile
                    </Link>
                </div>

                <div className="border pt-2 rounded-lg dark:bg-white/5">
                    <div className="flex items-center gap-3 px-3 py-2">
                        <Avatar className="size-8 shrink-0">
                            {user?.imageUrl && <AvatarImage src={user.imageUrl} alt={user.name} />}
                            <AvatarFallback className="bg-primary2-700 text-white text-xs font-semibold">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name ?? "Admin"}</p>
                            <p className="text-[11px] text-gray-500 dark:text-white/40 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <PrimaryButton
                        variant="destructive"
                        title={isLoggingOut ? "Logging out..." : "Logout"}
                        onClick={handleLogout}
                        isDisabled={isLoggingOut}
                        isFullWidth={true}
                        className="mt-1 rounded-b-lg rounded-t-none border-none dark:bg-danger/10 dark:text-danger dark:hover:bg-danger/20"
                        icon2={<CiLogout className="rotate-180" />}
                    />
                </div>
            </div>
        </div>
    )
}
export default SidebarContent