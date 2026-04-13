"use client"

import { RiGroupLine, RiTimeLine, RiCheckLine, RiCalendarLine, RiCheckboxCircleLine } from "react-icons/ri";
import AdminPageHead from "@/components/shared/admin/AdminPageHead"
import { useGetAdminStatsQuery } from "@/redux/apis/statsApi";
import StatCard from "@/components/shared/admin/StatCard";

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
        <div className="admin-page-setup">
            <AdminPageHead
                title="Overview"
                description="Application statistics at a glance."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {statCards.map((card) => (
                    <StatCard key={card.label} {...card} isLoading={isLoading} />
                ))}
            </div>
        </div>
    )
}
export default AdminOverviewPage