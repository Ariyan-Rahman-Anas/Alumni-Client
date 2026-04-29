"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    RiBriefcaseLine,
    RiSearchLine,
    RiCloseLine,
    RiUserLine,
    RiArrowLeftSLine,
    RiArrowRightSLine,
    RiBookOpenLine,
    RiToolsLine,
    RiFilterLine,
    RiStarLine,
} from "react-icons/ri";
import { useDebounce } from "@/hooks/useDebounce";
import JobPageHead from "@/components/modules/user/job/JobPageHead";
import { useGetApprovedJobsQuery, useGetApprovedProvidersQuery } from "@/redux/apis/jobs";
import JobPageJobCard from "@/components/modules/user/job/JobPageJobCard";
import { TJobPostType, TTab } from "@/components/modules/user/job/job.types";
import JobPageProviderCard from "@/components/modules/user/job/JobPageProviderCard";
import JobPageCardSkeleton from "@/components/modules/user/job/JobPageCardSkeleton";
import JobPageProviderRegCTA from "@/components/modules/user/job/JobPageProviderRegCTA";
import { FadeUpWrapper } from "../Home/HomePage";

const TABS: { key: TTab; label: string; icon: React.ReactNode }[] = [
    { key: "all", label: "All Posts", icon: <RiFilterLine /> },
    { key: "OFFICIAL", label: "Official Jobs", icon: <RiBriefcaseLine /> },
    { key: "TUITION", label: "Tuition Seek", icon: <RiBookOpenLine /> },
    { key: "PERSONAL", label: "Service Seek", icon: <RiToolsLine /> },
    { key: "providers", label: "Browse Providers", icon: <RiStarLine /> },
];

export default function JobsPage() {
    const router = useRouter();
    const [tab, setTab] = useState<TTab>("all");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [providerPage, setProviderPage] = useState(1);
    const debouncedSearch = useDebounce(search, 400);

    const isProviderTab = tab === "providers";

    const { data: jobsData, isLoading: jobsLoading } = useGetApprovedJobsQuery(
        {
            page,
            limit: 9,
            searchTerm: debouncedSearch || undefined,
            type: tab !== "all" && tab !== "providers" ? (tab as TJobPostType) : undefined,
        },
        { skip: isProviderTab },
    );

    const { data: providersData, isLoading: providersLoading } = useGetApprovedProvidersQuery(
        { page: providerPage, limit: 9, searchTerm: debouncedSearch || undefined },
        { skip: !isProviderTab },
    );

    const jobs = jobsData?.data ?? [];
    const meta = jobsData?.meta;
    const providers = providersData?.data ?? [];
    const providerMeta = providersData?.meta;

    const handleTabChange = (t: TTab) => {
        setTab(t);
        setPage(1);
        setProviderPage(1);
    };

    return (
        <div className="three-xl-section-setup pb-20 space-y-16">
            <JobPageHead />

            <FadeUpWrapper delay={0.15} className="space-y-4">
                {/* Search + Tabs */}
                <div className="rounded-2xl border border-surface-200 bgwhite p-4 sm:p-5 shadow-sm space-y-4">
                    {/* Search */}
                    <div className="relative">
                        <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-base pointer-events-none" />
                        <input
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            placeholder="Search posts, subjects, companies..."
                            className="w-full rounded-xl border border-surface-200 bg-surface-50 pl-10 pr-10 py-2.5 text-sm text-primary2-900 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary2-300 focus:border-primary2-300 transition-all"
                        />
                        {search && (
                            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary2-700 transition-colors">
                                <RiCloseLine />
                            </button>
                        )}
                    </div>

                    {/* Tab Pills */}
                    <div className="flex flex-wrap gap-2">
                        {TABS.map((t) => (
                            <button
                                key={t.key}
                                onClick={() => handleTabChange(t.key)}
                                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all border ${tab === t.key
                                    ? "bg-primary2-800 text-white border-primary2-800 shadow-sm"
                                    : "border-surface-200 text-primary2-700 hover:border-primary2-300 hover:bg-primary2-50"
                                    }`}
                            >
                                {t.icon} {t?.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Job Posts Grid */}
                {!isProviderTab && (
                    <>
                        <FadeUpWrapper
                            key="jobs-grid"
                            delay={0.1}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                        >
                            {jobsLoading
                                ? Array.from({ length: 9 }).map((_, i) => <JobPageCardSkeleton key={i} />)
                                : jobs.length === 0
                                    ? (
                                        <div className="col-span-full flex flex-col items-center gap-3 py-24 text-center">
                                            <div className="h-16 w-16 rounded-full bg-surface-100 flex items-center justify-center">
                                                <RiBriefcaseLine className="text-2xl text-muted-foreground" />
                                            </div>
                                            <p className="text-base font-semibold text-primary2-900">No posts found</p>
                                            <p className="text-sm text-muted-foreground">Try a different search or tab</p>
                                        </div>
                                    )
                                    : jobs.map((job, i) => <JobPageJobCard key={job._id} job={job} index={i} />)
                            }
                        </FadeUpWrapper>

                        {/* Pagination */}
                        {meta && meta.totalPage > 1 && (
                            <div className="mt-10 flex items-center justify-center gap-1.5">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-surface-200 text-primary2-700 hover:bg-surface-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    <RiArrowLeftSLine className="text-lg" />
                                </button>
                                <span className="text-sm text-muted-foreground px-3">
                                    Page {page} of {meta.totalPage}
                                </span>
                                <button
                                    onClick={() => setPage((p) => Math.min(meta.totalPage, p + 1))}
                                    disabled={page === meta.totalPage}
                                    className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-surface-200 text-primary2-700 hover:bg-surface-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    <RiArrowRightSLine className="text-lg" />
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Providers Grid */}
                {isProviderTab && (
                    <>
                        <FadeUpWrapper
                            key="providers-grid"
                            delay={0.1}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                            {providersLoading
                                ? Array.from({ length: 6 }).map((_, i) => <JobPageCardSkeleton key={i} />)
                                : providers.length === 0
                                    ? (
                                        <div className="col-span-full flex flex-col items-center gap-3 py-24 text-center">
                                            <div className="h-16 w-16 rounded-full bg-surface-100 flex items-center justify-center">
                                                <RiUserLine className="text-2xl text-muted-foreground" />
                                            </div>
                                            <p className="text-base font-semibold text-primary2-900">No providers found</p>
                                            <p className="text-sm text-muted-foreground">Try a different search</p>
                                        </div>
                                    )
                                    : providers.map((p) => (
                                        <JobPageProviderCard
                                            key={p._id}
                                            provider={p}
                                            onClick={() => router.push(`/jobs/providers/${p._id}`)}
                                        />
                                    ))
                            }
                        </FadeUpWrapper>

                        {providerMeta && providerMeta.totalPage > 1 && (
                            <div className="mt-10 flex items-center justify-center gap-1.5">
                                <button onClick={() => setProviderPage((p) => Math.max(1, p - 1))} disabled={providerPage === 1} className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-surface-200 text-primary2-700 hover:bg-surface-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                                    <RiArrowLeftSLine className="text-lg" />
                                </button>
                                <span className="text-sm text-muted-foreground px-3">Page {providerPage} of {providerMeta.totalPage}</span>
                                <button onClick={() => setProviderPage((p) => Math.min(providerMeta.totalPage, p + 1))} disabled={providerPage === providerMeta.totalPage} className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-surface-200 text-primary2-700 hover:bg-surface-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                                    <RiArrowRightSLine className="text-lg" />
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* CTA Banner */}
            </FadeUpWrapper>
            <JobPageProviderRegCTA />
        </div>
    );
}
