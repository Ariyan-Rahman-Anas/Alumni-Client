"use client";

import { useState } from "react";
import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage";
import InputField from "@/components/shared/InputField";
import SingleSelect from "@/components/shared/SingleSelect";
import { RiBriefcaseLine, RiSearchLine } from "react-icons/ri";
import JobPageCardSkeleton from "./JobPageCardSkeleton";
import JobPageJobCard from "./JobPageJobCard";
import Pagination from "@/components/shared/Pagination";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetApprovedJobsQuery } from "@/redux/apis/jobs";
import { TJobPostType } from "./job.types";
import { constantsData } from "@/constants";

type TJobTypeTab = "all" | TJobPostType;

const JOB_TYPE_OPTIONS = [
    { label: "All Types Jobs", value: "all" },
    { label: "Official", value: "OFFICIAL" },
    { label: "Tuition", value: "TUITION" },
    { label: "Service", value: "PERSONAL" },
];

const JobPageJobs = () => {
    const [jobTypeTab, setJobTypeTab] = useState<TJobTypeTab>("all");
    const [jobSearch, setJobSearch] = useState("");
    const [page, setPage] = useState(1);
    const debouncedJobSearch = useDebounce(jobSearch, 400);

    const { data: jobsData, isLoading: jobsLoading } = useGetApprovedJobsQuery({
        page,
        limit: constantsData.PAGE_SECTION_SIZE,
        searchTerm: debouncedJobSearch || undefined,
        type: jobTypeTab !== "all" ? (jobTypeTab as TJobPostType) : undefined,
    });

    const jobs = jobsData?.data ?? [];
    const meta = jobsData?.meta;

    const handleJobTypeChange = (t: TJobTypeTab) => {
        setJobTypeTab(t);
        setPage(1);
    };

    const handleJobSearchChange = (v: string) => {
        setJobSearch(v);
        setPage(1);
    };

    return (
        <div className="space-y-5">
            {/* Search + type filter */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between w-full">
                <div className="w-full max-w-lg ">
                    <InputField
                        placeholder="Search jobs, subjects, companies..."
                        value={jobSearch}
                        icon={<RiSearchLine />}
                        onChange={(e) => handleJobSearchChange(e.target.value)}
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
    );
};

export default JobPageJobs;