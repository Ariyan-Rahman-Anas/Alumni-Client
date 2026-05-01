"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { RiUser3Line, RiUserLine, RiLogoutBoxLine} from "react-icons/ri";

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

const UserMenu = ({ size = "md", align = "end" }: UserMenuProps) => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector(selectCurrentUser);
    const [logoutUser, { isLoading: isLoggingOut }] = useLogoutUserMutation();

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
                    className="flex items-center gap-2 rounded-full border-2 border-primary2-500 dark:border-gunmetal-200 bg-white dark:bg-gunmetal-600 transition-all duration-200 hover:ring-primary2-500 pr-0 md:pr-3"
                    aria-label="User menu"
                >
                    <Avatar className={`${avatarSize} shrink-0 md:border-2 border-primary2-500 dark:border-gunmetal-200`}>
                        {user?.imageUrl && (
                            <AvatarImage src={user.imageUrl} alt={user.name} />
                        )}
                        <AvatarFallback className="bg-primary2-100 text-xs font-semibold">
                            {user?.imageUrl
                                ? null
                                : initials || <RiUserLine className="size-4" />
                            }
                        </AvatarFallback>
                    </Avatar>
                    {user?.name && (
                        <span className="hidden md:block text-sm font-medium max-w-[150px] truncate text-primary2-500 dark:text-gunmetal-200">
                            {user.name}
                        </span>
                    )}
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align={align} sideOffset={8} className="w-56">
                {/* User info header */}
                <DropdownMenuLabel className="px-3 py-2.5">
                    <p className="text-sm font-semibold truncate text-primary2-700 dark:text-gunmetal-200 ">{user?.name}</p>
                    <p className="text-xs truncate">{user?.email}</p>
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
