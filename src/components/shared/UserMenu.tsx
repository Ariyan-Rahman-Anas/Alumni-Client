"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { RiUser3Line, RiUserLine, RiLogoutBoxLine, RiSunLine, RiMoonLine, RiComputerLine } from "react-icons/ri";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogoutUserMutation } from "@/redux/apis/authApi";
import type { AppDispatch } from "@/redux/store";
import type { UserMenuProps } from "@/types/common.components.types";
import { clearUser, selectCurrentUser } from "@/redux/slice/authSlice";
import { MdDashboard } from "react-icons/md";

const THEMES = [
    { value: "light", label: "Light", icon: RiSunLine },
    { value: "dark", label: "Dark", icon: RiMoonLine },
    { value: "system", label: "System", icon: RiComputerLine },
] as const;

const UserMenu = ({ size = "md", align = "end" }: UserMenuProps) => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector(selectCurrentUser);
    const [logoutUser, { isLoading: isLoggingOut }] = useLogoutUserMutation();
    const { theme, setTheme } = useTheme();

    const avatarSize = size === "sm" ? "size-8" : "size-9";
    const initials = user?.name
        ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
        : "?";

    const handleLogout = async () => {
        try {
            const logoutRes = await logoutUser().unwrap();
            toast.success(logoutRes?.message);
            setTimeout(() => router.push("/login"), 300);
        } catch {
            // server error is fine — still clear local state
        } finally {
            dispatch(clearUser());
            setTimeout(() => router.push("/login"), 300);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className="flex items-center gap-2 rounded-full ring-2 ring-primary2-300 ring-offset1 bg-primary text-primary2-100 transition-all duration-200 hover:ring-primary2-500 focus:outline-none focus-visible:ring-primary2-500 pr-0 md:pr-3"
                    aria-label="User menu"
                >
                    <Avatar className={`${avatarSize} shrink-0`}>
                        {user?.imageUrl && (
                            <AvatarImage src={user.imageUrl} alt={user.name} />
                        )}
                        <AvatarFallback className="bg-primary2-100 text-primary2-700 text-xs font-semibold">
                            {user?.imageUrl
                                ? null
                                : initials || <RiUserLine className="size-4" />
                            }
                        </AvatarFallback>
                    </Avatar>
                    {user?.name && (
                        <span className="hidden md:block text-sm font-medium max-w-[150px] truncate">
                            {user.name}
                        </span>
                    )}
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align={align} sideOffset={8} className="w-56">
                {/* User info header */}
                <DropdownMenuLabel className="px-3 py-2.5">
                    <p className="text-sm font-semibold text-accent-foreground truncate">{user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2">
                        <RiUser3Line className="size-4 text-primary2-500" />
                        Profile
                    </Link>
                </DropdownMenuItem>

                {user?.role === "ADMIN" && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/admin/overview" className="flex items-center gap-2">
                                <MdDashboard className="size-4 text-primary2-500" />
                                Admin Dashboard
                            </Link>
                        </DropdownMenuItem>
                    </>
                )}

                {/* Theme switcher */}
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="px-3 py-1 text-xs font-medium text-muted-foreground">
                    Theme
                </DropdownMenuLabel>
                <div className="flex gap-1 px-2 pb-1.5">
                    {THEMES.map(({ value, label, icon: Icon }) => (
                        <button
                            key={value}
                            onClick={() => setTheme(value)}
                            title={label}
                            className={`flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-lg text-xs transition-colors ${theme === value
                                    ? "bg-primary2-700 text-white"
                                    : "bg-surface-100 text-muted-foreground hover:bg-primary2-50 hover:text-primary2-700"
                                }`}
                        >
                            <Icon className="text-base" />
                            <span className="text-[10px] leading-none">{label}</span>
                        </button>
                    ))}
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    variant="destructive"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex items-center gap-2"
                >
                    <RiLogoutBoxLine className="size-4" />
                    {isLoggingOut ? "Logging out..." : "Logout"}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserMenu;

