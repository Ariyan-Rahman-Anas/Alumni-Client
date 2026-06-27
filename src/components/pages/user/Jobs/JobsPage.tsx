"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    RiBriefcaseLine,
    RiUserLine,
    RiStarLine,
    RiSearchLine,
} from "react-icons/ri";
import { useDebounce } from "@/hooks/useDebounce";
import JobPageHead from "@/components/modules/user/job/JobPageHead";
import { useGetApprovedJobsQuery, useGetApprovedProvidersQuery } from "@/redux/apis/jobs";
import JobPageJobCard from "@/components/modules/user/job/JobPageJobCard";
import { TJobPostType } from "@/components/modules/user/job/job.types";
import JobPageProviderCard from "@/components/modules/user/job/JobPageProviderCard";
import JobPageCardSkeleton from "@/components/modules/user/job/JobPageCardSkeleton";
import JobPageProviderRegCTA from "@/components/modules/user/job/JobPageProviderRegCTA";
import { FadeUpWrapper } from "../Home/HomePage";
import InputField from "@/components/shared/InputField";
import SingleSelect from "@/components/shared/SingleSelect";
import Pagination from "@/components/shared/Pagination";
import { constantsData } from "@/constants";

type TMainTab = "jobs" | "providers";
type TJobTypeTab = "all" | TJobPostType;

const JOB_TYPE_OPTIONS = [
    { label: "All Types Jobs", value: "all" },
    { label: "Official", value: "OFFICIAL" },
    { label: "Tuition", value: "TUITION" },
    { label: "Service", value: "PERSONAL" },
];

const MAIN_TABS: { key: TMainTab; label: string; icon: React.ReactNode }[] = [
    { key: "jobs", label: "Job Posts", icon: <RiBriefcaseLine /> },
    { key: "providers", label: "Browse Providers", icon: <RiStarLine /> },
];

export default function JobsPage() {
    const router = useRouter();

    const [mainTab, setMainTab] = useState<TMainTab>("jobs");

    // Jobs state
    const [jobTypeTab, setJobTypeTab] = useState<TJobTypeTab>("all");
    const [jobSearch, setJobSearch] = useState("");
    const [page, setPage] = useState(1);
    const debouncedJobSearch = useDebounce(jobSearch, 400);

    // Providers state
    const [providerSearch, setProviderSearch] = useState("");
    const [providerPage, setProviderPage] = useState(1);
    const debouncedProviderSearch = useDebounce(providerSearch, 400);

    const isJobs = mainTab === "jobs";

    const { data: jobsData, isLoading: jobsLoading } = useGetApprovedJobsQuery(
        { page, limit: constantsData.PAGE_SECTION_SIZE, searchTerm: debouncedJobSearch || undefined, type: jobTypeTab !== "all" ? (jobTypeTab as TJobPostType) : undefined },
        { skip: !isJobs },
    );

    const { data: providersData, isLoading: providersLoading } = useGetApprovedProvidersQuery(
        { page: providerPage, limit: constantsData.PAGE_SECTION_SIZE, searchTerm: debouncedProviderSearch || undefined },
        { skip: isJobs },
    );

    const jobs = jobsData?.data ?? [];
    const meta = jobsData?.meta;
    const providers = providersData?.data ?? [];
    const providerMeta = providersData?.meta;

    const handleMainTabChange = (t: TMainTab) => {
        setMainTab(t);
        setPage(1);
        setProviderPage(1);
    };

    const handleJobTypeChange = (t: TJobTypeTab) => {
        setJobTypeTab(t);
        setPage(1);
    };

    return (
        <div className="three-xl-section-setup pb-20 space-y-10">
            <JobPageHead />

            <FadeUpWrapper delay={0.1} className="space-y-6">
                {/* -- Main Tab Switcher ---------------------------- */}
                <div className="flex items-center gap-2 p-1 rounded-2xl bg-surface-100 dark:bg-gunmetal-800 border border-surface-200 dark:border-gunmetal-700 w-fit">
                    {MAIN_TABS.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => handleMainTabChange(t.key)}
                            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${mainTab === t.key
                                ? "bg-white dark:bg-gunmetal-700 text-primary2-900 dark:text-white shadow-sm"
                                : "text-gray-500 dark:text-gunmetal-400 hover:text-gray-800 dark:hover:text-gunmetal-200"
                                }`}
                        >
                            {t.icon} {t.label}
                        </button>
                    ))}
                </div>

                {/* -- Jobs Panel ---------------------------------- */}
                {isJobs && (
                    <div className="space-y-5">
                        {/* Search + type filter */}
                        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between w-full">
                            <div className="w-full max-w-lg ">
                                <InputField
                                    placeholder="Search jobs, subjects, companies..."
                                    value={jobSearch}
                                    icon={<RiSearchLine />}
                                    onChange={(e) => { setJobSearch(e.target.value); setPage(1); }}
                                />
                            </div>
                            <div>
                                <SingleSelect
                                    options={JOB_TYPE_OPTIONS}
                                    value={jobTypeTab}
                                    onValueChange={(v) => handleJobTypeChange(v as TJobTypeTab)}
                                    searchable={false}
                                    className="w-fit"
                                />
                            </div>
                        </div>
                        {/* Jobs Grid */}
                        <FadeUpWrapper key="jobs-grid" delay={0.05} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {jobsLoading
                                ? Array.from({ length: 9 }).map((_, i) => <JobPageCardSkeleton key={i} />)
                                : jobs.length === 0
                                    ? (
                                        <div className="col-span-full flex flex-col items-center gap-3 py-24 text-center">
                                            <div className="h-16 w-16 rounded-full bg-surface-100 dark:bg-gunmetal-700 flex items-center justify-center">
                                                <RiBriefcaseLine className="text-2xl text-muted-foreground" />
                                            </div>
                                            <p className="text-base font-semibold text-primary2-900 dark:text-gunmetal-100">No posts found</p>
                                            <p className="text-sm text-muted-foreground">Try a different search or filter</p>
                                        </div>
                                    )
                                    : jobs.map((job, i) => <JobPageJobCard key={job._id} job={job} index={i} />)
                            }
                        </FadeUpWrapper>

                        {/* Jobs Pagination */}
                        {meta && meta.totalPage > 1 && (
                            <Pagination
                                page={page}
                                totalPages={meta.totalPage}
                                total={meta.total}
                                pageSize={constantsData.PAGE_SECTION_SIZE}
                                dataCount={jobs.length}
                                onPageChange={setPage}
                            />
                        )}
                    </div>
                )}

                {/* -- Providers Panel ----------------------------- */}
                {!isJobs && (
                    <div className="space-y-5">
                        {/* Provider Search */}
                        <InputField
                            placeholder="Search providers by name or skill..."
                            value={providerSearch}
                            icon={<RiSearchLine />}
                            onChange={(e) => { setProviderSearch(e.target.value); setProviderPage(1); }}
                            containerClassName="max-w-md"
                        />

                        {/* Providers Grid */}
                        <FadeUpWrapper key="providers-grid" delay={0.05} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {providersLoading
                                ? Array.from({ length: 6 }).map((_, i) => <JobPageCardSkeleton key={i} />)
                                : providers.length === 0
                                    ? (
                                        <div className="col-span-full flex flex-col items-center gap-3 py-24 text-center">
                                            <div className="h-16 w-16 rounded-full bg-surface-100 dark:bg-gunmetal-700 flex items-center justify-center">
                                                <RiUserLine className="text-2xl text-muted-foreground" />
                                            </div>
                                            <p className="text-base font-semibold text-primary2-900 dark:text-gunmetal-100">No providers found</p>
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

                        {/* Providers Pagination */}
                        {providerMeta && providerMeta.totalPage > 1 && (
                            <Pagination
                                page={providerPage}
                                totalPages={providerMeta.totalPage}
                                total={providerMeta.total}
                                pageSize={constantsData.PAGE_SECTION_SIZE}
                                dataCount={providers.length}
                                onPageChange={setProviderPage}
                            />
                        )}
                    </div>
                )}
            </FadeUpWrapper>

            <JobPageProviderRegCTA />
        </div>
    );
}