"use client";

import { useState } from "react";
import { RiBriefcaseLine, RiToolsLine } from "react-icons/ri";
import AdminPageHead from "@/components/shared/admin/AdminPageHead";
import SingleSelect from "@/components/shared/SingleSelect";
import { constantsData } from "@/constants";
import { TJobPostStatus } from "@/components/modules/user/job/job.types";
import AdminJobsTable from "@/components/modules/admin/jobs/AdminJobsTable";
import AdminProvidersTable from "@/components/modules/admin/jobs/AdminProvidersTable";

type TabKey = "posts" | "providers";

type StatusFilterType = "all" | TJobPostStatus;
const STATUS_OPTIONS = [
    { label: "All Statuses", value: "all" },
    { label: "Pending", value: "PENDING" },
    { label: "Approved", value: "APPROVED" },
    { label: "Rejected", value: "REJECTED" },
    { label: "Closed", value: "CLOSED" },
];

export default function AdminJobsPage() {
    const [tab, setTab] = useState<TabKey>("posts");
    const [page, setPage] = useState(1);
    const [providerPage, setProviderPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<StatusFilterType>("all");

    const handleTabChange = (t: TabKey) => {
        setTab(t);
        setPage(1);
        setProviderPage(1);
    };

    return (
        <div className="admin-page-setup">
            <AdminPageHead
                title="Job Board"
                description="Manage job posts, service providers, and applications."
            />

            {/* Tab switcher */}
            <div className="flex items-center gap-1 mt-6 mb-5 p-1 bg-surface-100 dark:bg-gunmetal-800 rounded-xl w-fit border border-surface-200 dark:border-gunmetal-700">
                {(
                    [
                        { key: "posts", label: "Job Posts", icon: <RiBriefcaseLine /> },
                        { key: "providers", label: "Service Providers", icon: <RiToolsLine /> },
                    ] as { key: TabKey; label: string; icon: React.ReactNode }[]
                ).map((t) => (
                    <button
                        key={t.key}
                        onClick={() => handleTabChange(t.key)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.key
                                ? "bg-white dark:bg-gunmetal-600 text-primary2-800 dark:text-white shadow-sm"
                                : "text-neutral-500 dark:text-gunmetal-300 hover:text-neutral-700 dark:hover:text-white"
                            }`}
                    >
                        {t.icon}
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Jobs tab */}
            {tab === "posts" && (
                <>
                    <div className="mb-5">
                        <SingleSelect
                            options={STATUS_OPTIONS}
                            value={statusFilter}
                            onValueChange={(v) => {
                                setStatusFilter(v as StatusFilterType);
                                setPage(1);
                            }}
                            width="w-48"
                            placeholder="Filter by status"
                        />
                    </div>
                    <AdminJobsTable
                        page={page}
                        limit={constantsData.TABLE_PAGE_SIZE}
                        status={statusFilter === "all" ? undefined : statusFilter}
                        onPageChange={setPage}
                    />
                </>
            )}

            {/* Providers tab */}
            {tab === "providers" && (
                <AdminProvidersTable
                    page={providerPage}
                    limit={constantsData.TABLE_PAGE_SIZE}
                    onPageChange={setProviderPage}
                />
            )}
        </div>
    );
}
