"use client";

import { RiGroupLine, RiTimeLine, RiCheckLine, RiCalendarLine, RiCheckboxCircleLine } from "react-icons/ri";
import { useGetStatsQuery, type AppStats } from "@/redux/apis/adminApi";
import { Badge } from "@/components/ui/badge";

interface StatCardProps {
    label: string;
    value: number | undefined;
    icon: React.ReactNode;
    color: string;
    isLoading: boolean;
}

const StatCard = ({ label, value, icon, color, isLoading }: StatCardProps) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
        <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
            {isLoading ? (
                <div className="h-7 w-16 bg-gray-100 rounded animate-pulse mt-1" />
            ) : (
                <p className="text-2xl font-bold text-gray-900">{value ?? 0}</p>
            )}
        </div>
    </div>
);

const AdminOverviewPage = () => {
    const { data: statsResponse, isLoading } = useGetStatsQuery();
    const stats = statsResponse?.data;

    const statCards = [
        {
            label: "Total Users",
            value: stats?.users.total,
            icon: <RiGroupLine className="text-xl text-blue-600" />,
            color: "bg-blue-50",
        },
        {
            label: "Pending Approval",
            value: stats?.users.pending,
            icon: <RiTimeLine className="text-xl text-amber-600" />,
            color: "bg-amber-50",
        },
        {
            label: "Approved Users",
            value: stats?.users.approved,
            icon: <RiCheckLine className="text-xl text-emerald-600" />,
            color: "bg-emerald-50",
        },
        {
            label: "Email Verified",
            value: stats?.users.verified,
            icon: <RiCheckboxCircleLine className="text-xl text-violet-600" />,
            color: "bg-violet-50",
        },
        {
            label: "Total Batches",
            value: stats?.batches.total,
            icon: <RiCalendarLine className="text-xl text-sky-600" />,
            color: "bg-sky-50",
        },
        {
            label: "Active Batches",
            value: stats?.batches.active,
            icon: <RiCalendarLine className="text-xl text-teal-600" />,
            color: "bg-teal-50",
        },
    ];

    return (
        <div className="p-4 sm:p-6 md:p-8">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-xl font-semibold text-gray-900">Overview</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                    Application statistics at a glance.
                </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
                {statCards.map((card) => (
                    <StatCard key={card.label} {...card} isLoading={isLoading} />
                ))}
            </div>

            {/* Recent Registrations */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                    <h2 className="text-sm font-semibold text-gray-800">Recent Registrations</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Latest 5 users who registered</p>
                </div>

                {isLoading ? (
                    <div className="divide-y divide-gray-50">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-3 px-5 py-3">
                                <div className="h-9 w-9 rounded-full bg-gray-100 animate-pulse shrink-0" />
                                <div className="flex-1 space-y-1.5">
                                    <div className="h-3.5 w-32 bg-gray-100 rounded animate-pulse" />
                                    <div className="h-3 w-48 bg-gray-50 rounded animate-pulse" />
                                </div>
                                <div className="h-5 w-16 bg-gray-100 rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                ) : !stats?.recentUsers?.length ? (
                    <p className="text-sm text-muted-foreground text-center py-10">No recent registrations</p>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {stats.recentUsers.map((user: AppStats["recentUsers"][number]) => (
                            <div key={user._id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                                {user.imageUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={user.imageUrl}
                                        alt={user.name}
                                        className="h-9 w-9 rounded-full object-cover shrink-0"
                                    />
                                ) : (
                                    <span className="h-9 w-9 rounded-full bg-primary2-100 text-primary2-700 text-xs font-bold flex items-center justify-center shrink-0">
                                        {user.name.slice(0, 2).toUpperCase()}
                                    </span>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                </div>
                                <div className="flex flex-col items-end gap-1 shrink-0">
                                    <Badge
                                        className={
                                            user.approvalStatus === "APPROVED"
                                                ? "bg-emerald-100 text-emerald-700 border-emerald-200 text-[10px]"
                                                : "bg-amber-100 text-amber-700 border-amber-200 text-[10px]"
                                        }
                                    >
                                        {user.approvalStatus}
                                    </Badge>
                                    <p className="text-[10px] text-muted-foreground">
                                        {new Date(user.createdAt).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOverviewPage;
