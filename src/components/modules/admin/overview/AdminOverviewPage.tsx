"use client";

import { RiGroupLine, RiTimeLine, RiCheckLine, RiCalendarLine, RiCheckboxCircleLine } from "react-icons/ri";
import { useGetAdminStatsQuery } from "@/redux/apis/statsApi";

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
    const { data: statsResponse, isLoading } = useGetAdminStatsQuery();
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
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {statCards.map((card) => (
                    <StatCard key={card.label} {...card} isLoading={isLoading} />
                ))}
            </div>
        </div>
    );
};

export default AdminOverviewPage;
